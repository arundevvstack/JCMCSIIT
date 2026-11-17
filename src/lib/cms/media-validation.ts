import "server-only";

import crypto from "node:crypto";
import { z } from "zod";

export const MEDIA_BUCKETS = [
    "cms-media",
    "galleries",
    "faculty-profiles",
    "cms-documents",
    "pdfs",
] as const;

export type MediaBucketId = (typeof MEDIA_BUCKETS)[number];

export const IMAGE_MIMES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
] as const;

export const DOCUMENT_MIMES = ["application/pdf"] as const;

export type AllowedMediaMime =
    | (typeof IMAGE_MIMES)[number]
    | (typeof DOCUMENT_MIMES)[number];

export interface BucketPolicySpec {
    maxBytes: number;
    allowedMimes: readonly AllowedMediaMime[];
    category: "image" | "document";
}

export const BUCKET_POLICIES: Record<MediaBucketId, BucketPolicySpec> = {
    "cms-media": {
        maxBytes: 5_242_880, // 5 MB
        allowedMimes: IMAGE_MIMES,
        category: "image",
    },
    galleries: {
        maxBytes: 5_242_880, // 5 MB
        allowedMimes: IMAGE_MIMES,
        category: "image",
    },
    "faculty-profiles": {
        maxBytes: 5_242_880, // 5 MB
        allowedMimes: IMAGE_MIMES,
        category: "image",
    },
    "cms-documents": {
        maxBytes: 15_728_640, // 15 MB
        allowedMimes: DOCUMENT_MIMES,
        category: "document",
    },
    pdfs: {
        maxBytes: 15_728_640, // 15 MB
        allowedMimes: DOCUMENT_MIMES,
        category: "document",
    },
};

const CANONICAL_EXTENSION_BY_MIME: Record<AllowedMediaMime, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "application/pdf": "pdf",
};

export const MediaBucketSchema = z.enum(MEDIA_BUCKETS);

/**
 * Inspects binary file headers (magic bytes) to determine the actual file format.
 * Returns `null` for any unrecognized, truncated, or disguised payload.
 */
export function detectMagicByteMime(buffer: Buffer): AllowedMediaMime | null {
    if (!Buffer.isBuffer(buffer) || buffer.byteLength < 4) {
        return null;
    }

    // 1. JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return "image/jpeg";
    }

    // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
        buffer.byteLength >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
    ) {
        return "image/png";
    }

    // 3. WebP: "RIFF" [4-byte size] "WEBP"
    if (
        buffer.byteLength >= 12 &&
        buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
        buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
        return "image/webp";
    }

    // 4. AVIF: ISO Base Media File Format `ftyp` box containing `avif` or `avis` brand
    if (
        buffer.byteLength >= 12 &&
        buffer.subarray(4, 8).toString("ascii") === "ftyp"
    ) {
        const boxSize = buffer.readUInt32BE(0);
        const ftypEnd = Math.min(
            buffer.byteLength,
            boxSize >= 12 && boxSize <= 128 ? boxSize : 32
        );
        const brandsAscii = buffer.subarray(8, ftypEnd).toString("ascii");
        if (brandsAscii.includes("avif") || brandsAscii.includes("avis")) {
            return "image/avif";
        }
    }

    // 5. PDF: "%PDF-"
    if (
        buffer.byteLength >= 5 &&
        buffer.subarray(0, 5).toString("ascii") === "%PDF-"
    ) {
        return "application/pdf";
    }

    return null;
}

function normalizeDeclaredMime(rawMime: string): string {
    const lower = rawMime.trim().toLowerCase().split(";")[0].trim();
    if (lower === "image/jpg" || lower === "image/pjpeg") {
        return "image/jpeg";
    }
    return lower;
}

export interface ValidatedUploadBinary {
    ok: true;
    mimeType: AllowedMediaMime;
    canonicalExt: string;
}

export interface InvalidUploadBinary {
    ok: false;
    status: 400 | 413 | 415;
    error: string;
}

export function validateUploadBinary(
    buffer: Buffer,
    declaredMime: string,
    bucketId: MediaBucketId
): ValidatedUploadBinary | InvalidUploadBinary {
    const policy = BUCKET_POLICIES[bucketId];

    if (buffer.byteLength === 0) {
        return {
            ok: false,
            status: 400,
            error: "Uploaded file is empty.",
        };
    }

    if (buffer.byteLength > policy.maxBytes) {
        const maxMb = Math.round(policy.maxBytes / (1024 * 1024));
        return {
            ok: false,
            status: 413,
            error: `File size exceeds the ${maxMb} MB limit for bucket "${bucketId}".`,
        };
    }

    const detectedMime = detectMagicByteMime(buffer);
    if (!detectedMime) {
        return {
            ok: false,
            status: 415,
            error: "Unsupported or corrupted file signature. Only verified JPEG, PNG, WebP, AVIF, or PDF files are accepted.",
        };
    }

    if (!policy.allowedMimes.includes(detectedMime)) {
        return {
            ok: false,
            status: 415,
            error: `File type "${detectedMime}" is not permitted in bucket "${bucketId}". Allowed: ${policy.allowedMimes.join(", ")}.`,
        };
    }

    const normalizedDeclared = normalizeDeclaredMime(declaredMime);
    if (
        normalizedDeclared &&
        normalizedDeclared !== "application/octet-stream" &&
        normalizedDeclared !== detectedMime
    ) {
        return {
            ok: false,
            status: 415,
            error: `Declared MIME type "${normalizedDeclared}" does not match the file's binary content ("${detectedMime}").`,
        };
    }

    return {
        ok: true,
        mimeType: detectedMime,
        canonicalExt: CANONICAL_EXTENSION_BY_MIME[detectedMime],
    };
}

/**
 * Sanitizes an untrusted original filename for safe storage in `public.media.original_filename`.
 * Strips directory paths, traversal sequences, and control characters.
 */
export function sanitizeOriginalFilename(
    rawFilename: string,
    fallbackExt: string
): string {
    const baseName = rawFilename
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .split(/[\\/]/)
        .pop()
        ?.replace(/\.\.+/g, ".")
        .trim();

    if (!baseName) {
        return `upload.${fallbackExt}`;
    }

    return baseName.slice(0, 255);
}

/**
 * Generates an immutable, collision-proof, path-traversal-safe object key:
 * `YYYY/MM/<uuid>-<safe-slug>.<canonicalExt>`
 */
export function generateSafeStoragePath(
    originalFilename: string,
    canonicalExt: string,
    now = new Date()
): string {
    const year = String(now.getUTCFullYear());
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");

    const withoutExt = originalFilename.replace(/\.[^.]+$/, "");
    const safeStem =
        withoutExt
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
            .slice(0, 60) || "asset";

    const uniqueId = crypto.randomUUID();
    const storagePath = `${year}/${month}/${uniqueId}-${safeStem}.${canonicalExt}`;

    if (
        storagePath.includes("..") ||
        storagePath.startsWith("/") ||
        storagePath.includes("//")
    ) {
        throw new Error("Generated storage path failed safety invariant.");
    }

    return storagePath;
}

export function computeSha256Hex(buffer: Buffer): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Lightweight, zero-dependency parser for JPEG, PNG, and WebP intrinsic pixel dimensions.
 * Returns `{ width: null, height: null }` for PDFs or non-standard frames.
 */
export function extractImageDimensions(
    buffer: Buffer,
    mimeType: AllowedMediaMime
): { width: number | null; height: number | null } {
    try {
        if (mimeType === "image/png" && buffer.byteLength >= 24) {
            const width = buffer.readUInt32BE(16);
            const height = buffer.readUInt32BE(20);
            if (width > 0 && height > 0) {
                return { width, height };
            }
        }

        if (mimeType === "image/jpeg" && buffer.byteLength > 4) {
            let offset = 2;
            while (offset + 9 < buffer.byteLength) {
                if (buffer[offset] !== 0xff) {
                    offset += 1;
                    continue;
                }
                const marker = buffer[offset + 1];
                // Skip padding 0xFF bytes
                if (marker === 0xff) {
                    offset += 1;
                    continue;
                }
                // Standalone markers without length payload
                if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
                    offset += 2;
                    continue;
                }
                if (offset + 4 > buffer.byteLength) break;
                const segmentLength = buffer.readUInt16BE(offset + 2);
                if (segmentLength < 2) break;

                // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
                const isSofMarker =
                    (marker >= 0xc0 && marker <= 0xc3) ||
                    (marker >= 0xc5 && marker <= 0xc7) ||
                    (marker >= 0xc9 && marker <= 0xcb) ||
                    (marker >= 0xcd && marker <= 0xcf);

                if (isSofMarker && offset + 9 <= buffer.byteLength) {
                    const height = buffer.readUInt16BE(offset + 5);
                    const width = buffer.readUInt16BE(offset + 7);
                    if (width > 0 && height > 0) {
                        return { width, height };
                    }
                    break;
                }

                offset += 2 + segmentLength;
            }
        }

        if (mimeType === "image/webp" && buffer.byteLength >= 30) {
            const chunkType = buffer.subarray(12, 16).toString("ascii");
            if (chunkType === "VP8X") {
                const width = 1 + buffer.readUIntLE(24, 3);
                const height = 1 + buffer.readUIntLE(27, 3);
                if (width > 0 && height > 0) return { width, height };
            } else if (
                chunkType === "VP8 " &&
                buffer[23] === 0x9d &&
                buffer[24] === 0x01 &&
                buffer[25] === 0x2a
            ) {
                const width = buffer.readUInt16LE(26) & 0x3fff;
                const height = buffer.readUInt16LE(28) & 0x3fff;
                if (width > 0 && height > 0) return { width, height };
            } else if (chunkType === "VP8L" && buffer[20] === 0x2f) {
                const b0 = buffer[21];
                const b1 = buffer[22];
                const b2 = buffer[23];
                const b3 = buffer[24];
                const width = 1 + (((b1 & 0x3f) << 8) | b0);
                const height =
                    1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6));
                if (width > 0 && height > 0) return { width, height };
            }
        }
    } catch {
        // Safely return null dimensions if optional header parsing fails.
    }

    return { width: null, height: null };
}
