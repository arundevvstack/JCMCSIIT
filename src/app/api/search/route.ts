import { NextResponse } from "next/server";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

interface MatchedDocumentRow {
    id: string;
    source_type: string;
    source_id: string | null;
    content: string;
    similarity: number;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q")?.trim() ?? "";

    if (!rawQuery) {
        return NextResponse.json(
            { error: "Missing query parameter" },
            { status: 400 }
        );
    }

    if (rawQuery.length > 200) {
        return NextResponse.json(
            { error: "Search query exceeds maximum length of 200 characters" },
            { status: 400 }
        );
    }

    const sanitizedLike = rawQuery.replace(/[%_\\]/g, " ").trim();

    try {
        const semanticResults: {
            id: string;
            sourceType: string;
            sourceId: string | null;
            content: string;
            similarity: number;
        }[] = [];

        if (process.env.OPENAI_API_KEY) {
            try {
                const supabaseAdmin = createAdminClient();
                const { embedding } = await embed({
                    model: openai.embedding("text-embedding-ada-002"),
                    value: rawQuery,
                });

                const { data, error } = await supabaseAdmin.rpc(
                    "match_documents",
                    {
                        query_embedding: embedding,
                        match_threshold: 0.7,
                        match_count: 10,
                    }
                );

                if (!error && Array.isArray(data)) {
                    for (const doc of data as MatchedDocumentRow[]) {
                        semanticResults.push({
                            id: doc.id,
                            sourceType: doc.source_type,
                            sourceId: doc.source_id,
                            content: doc.content,
                            similarity: doc.similarity,
                        });
                    }
                }
            } catch {
                // Degrade gracefully to public text search if semantic RPC is unavailable.
            }
        }

        let exactMatches: {
            id: string;
            name: string;
            description: string | null;
            slug: string;
        }[] = [];

        if (
            sanitizedLike &&
            process.env.NEXT_PUBLIC_SUPABASE_URL &&
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ) {
            const supabase = await createClient();
            const { data: textResults } = await supabase
                .from("departments")
                .select("id, name, description, slug")
                .ilike("name", `%${sanitizedLike}%`)
                .limit(5);

            exactMatches = textResults ?? [];
        }

        return NextResponse.json({
            query: rawQuery,
            semanticMatches: semanticResults,
            exactMatches,
        });
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
