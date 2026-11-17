import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { AdminAuthError, requireAdminRole } from "@/lib/auth/rbac";
import {
    BUCKET_POLICIES,
    MediaBucketSchema,
    computeSha256Hex,
    extractImageDimensions,
    generateSafeStoragePath,
    sanitizeOriginalFilename,
    validateUploadBinary,
} from "@/lib/cms/media-validation";
import { createClient } from "@/lib/supabase/server";

// Max multipart envelope ceiling (15 MB PDF limit + 1 MB multipart headers/fields)
const MAX_MULTIPART_ENVELOPE_BYTES = 16 * 1024 * 1024;

const OptionalMetadataSchema = z.object({
    alt_text: z.string().max(500, "Alt text must not exceed 500 characters.").optional(),
    caption: z.string().max(1000, "Caption must not exceed 1,000 characters.").optional(),
});

const MEDIA_SELECT_COLUMNS =
    "id, bucket_id, storage_path, public_url, original_filename, mime_type, size_bytes, width, height, alt_text, caption, sha256_hash, uploaded_by, is_archived, created_at";

function cleanOptionalText(raw: FormDataEntryValue | null): string | undefined {
    if (typeof raw !== "string") return undefined;
    const cleaned = raw
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .trim();
    return cleaned.length > 0 ? cleaned : undefined;
}

function isBlobLikeFile(
    entry: FormDataEntryValue | null
): entry is File {
    return (
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as File).arrayBuffer === "function" &&
        typeof (entry as File).size === "number"
    );
}

export async function POST(req: Request) {
    try {
        // 1. Authenticate & enforce CMS upload RBAC (`PUBLISHER` is read-only on Storage/media)
        const admin = await requireAdminRole([
            "SUPER_ADMIN",
            "ADMIN",
            "EDITOR",
        ]);

        if (
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Storage service is not configured.",
                },
                { status: 503 }
            );
        }

        // 2. Validate Content-Type and envelope Content-Length before reading form data
        const contentTypeHeader = req.headers.get("content-type") || "";
        if (!contentTypeHeader.toLowerCase().includes("multipart/form-data")) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Content-Type must be multipart/form-data.",
                },
                { status: 400 }
            );
        }

        const declaredLength = Number(req.headers.get("content-length") ?? "0");
        if (
            Number.isFinite(declaredLength) &&
            declaredLength > MAX_MULTIPART_ENVELOPE_BYTES
        ) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Upload request exceeds maximum 15 MB payload limit.",
                },
                { status: 413 }
            );
        }

        let formData: FormData;
        try {
            formData = await req.formData();
        } catch {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Malformed multipart upload payload.",
                },
                { status: 400 }
            );
        }

        // 3. Validate target Storage bucket
        const rawBucket = formData.get("bucket_id");
        const bucketParsed = MediaBucketSchema.safeParse(
            typeof rawBucket === "string" ? rawBucket.trim() : ""
        );
        if (!bucketParsed.success) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Invalid or unsupported storage bucket specified.",
                },
                { status: 400 }
            );
        }
        const bucketId = bucketParsed.data;
        const bucketPolicy = BUCKET_POLICIES[bucketId];

        // 4. Validate optional descriptive metadata
        const metaParsed = OptionalMetadataSchema.safeParse({
            alt_text: cleanOptionalText(formData.get("alt_text")),
            caption: cleanOptionalText(formData.get("caption")),
        });
        if (!metaParsed.success) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        metaParsed.error.issues[0]?.message ||
                        "Invalid media metadata fields.",
                },
                { status: 400 }
            );
        }

        // 5. Pre-validate file handle & declared byte size before allocating Buffer
        const fileEntry = formData.get("file");
        if (!isBlobLikeFile(fileEntry)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "A valid file attachment is required.",
                },
                { status: 400 }
            );
        }

        if (fileEntry.size === 0) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Uploaded file is empty.",
                },
                { status: 400 }
            );
        }

        if (fileEntry.size > bucketPolicy.maxBytes) {
            const maxMb = Math.round(bucketPolicy.maxBytes / (1024 * 1024));
            return NextResponse.json(
                {
                    ok: false,
                    error: `File size exceeds the ${maxMb} MB limit for bucket "${bucketId}".`,
                },
                { status: 413 }
            );
        }

        // 6. Read binary bytes & verify magic-byte signature + MIME consistency
        const buffer = Buffer.from(await fileEntry.arrayBuffer());
        const binaryCheck = validateUploadBinary(
            buffer,
            fileEntry.type || "",
            bucketId
        );
        if (!binaryCheck.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: binaryCheck.error,
                },
                { status: binaryCheck.status }
            );
        }

        // 7. Compute SHA-256 & check for existing identical active upload in this bucket
        const sha256Hash = computeSha256Hex(buffer);
        const supabase = await createClient();

        const { data: existingMedia, error: duplicateCheckError } =
            await supabase
                .from("media")
                .select(MEDIA_SELECT_COLUMNS)
                .eq("bucket_id", bucketId)
                .eq("sha256_hash", sha256Hash)
                .eq("is_archived", false)
                .limit(1)
                .maybeSingle();

        if (!duplicateCheckError && existingMedia) {
            return NextResponse.json(
                {
                    ok: true,
                    deduplicated: true,
                    message:
                        "Identical file already exists in this bucket; reusing registered media asset.",
                    media: existingMedia,
                },
                { status: 200 }
            );
        }

        // 8. Build safe collision-proof path & upload with `upsert: false` via authenticated SSR session
        const sanitizedFilename = sanitizeOriginalFilename(
            fileEntry.name || "",
            binaryCheck.canonicalExt
        );
        const storagePath = generateSafeStoragePath(
            sanitizedFilename,
            binaryCheck.canonicalExt
        );

        const { error: storageUploadError } = await supabase.storage
            .from(bucketId)
            .upload(storagePath, buffer, {
                contentType: binaryCheck.mimeType,
                upsert: false,
                cacheControl: "3600",
            });

        if (storageUploadError) {
            console.error(
                "Supabase Storage upload error:",
                storageUploadError.message
            );
            const status = /unauthorized|forbidden|policy|row-level/i.test(
                storageUploadError.message
            )
                ? 403
                : 400;
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        status === 403
                            ? "Permission denied by storage security policy."
                            : "Unable to store file in the selected bucket.",
                },
                { status }
            );
        }

        // 9. Register uploaded asset in `public.media` & handle registration failures safely
        const {
            data: { publicUrl },
        } = supabase.storage.from(bucketId).getPublicUrl(storagePath);

        const { width, height } = extractImageDimensions(
            buffer,
            binaryCheck.mimeType
        );

        const { data: insertedMedia, error: mediaInsertError } = await supabase
            .from("media")
            .insert({
                bucket_id: bucketId,
                storage_path: storagePath,
                public_url: publicUrl,
                original_filename: sanitizedFilename,
                mime_type: binaryCheck.mimeType,
                size_bytes: buffer.byteLength,
                width,
                height,
                alt_text: metaParsed.data.alt_text ?? null,
                caption: metaParsed.data.caption ?? null,
                sha256_hash: sha256Hash,
                uploaded_by: admin.id,
                is_archived: false,
            })
            .select(MEDIA_SELECT_COLUMNS)
            .single();

        if (mediaInsertError || !insertedMedia) {
            console.error(
                "Media catalog insert failed:",
                mediaInsertError?.code || mediaInsertError?.message
            );

            // Best-effort orphan cleanup when caller has Storage DELETE privilege (`SUPER_ADMIN` / `ADMIN`)
            if (admin.role === "SUPER_ADMIN" || admin.role === "ADMIN") {
                try {
                    await supabase.storage.from(bucketId).remove([storagePath]);
                } catch {
                    // Ignore secondary cleanup error; primary failure is reported below.
                }
            }

            return NextResponse.json(
                {
                    ok: false,
                    error: "File upload could not be registered in public.media. No media record was saved.",
                },
                { status: 500 }
            );
        }

        revalidatePath("/admin");
        revalidatePath("/admin/media");
        revalidatePath("/admin/documents");

        return NextResponse.json(
            {
                ok: true,
                deduplicated: false,
                message: "File uploaded and registered successfully.",
                media: insertedMedia,
            },
            { status: 201 }
        );
    } catch (err: unknown) {
        if (err instanceof AdminAuthError) {
            return NextResponse.json(
                { ok: false, error: err.message },
                { status: err.status }
            );
        }
        return NextResponse.json(
            {
                ok: false,
                error: "An unexpected error occurred while processing the upload.",
            },
            { status: 500 }
        );
    }
}
