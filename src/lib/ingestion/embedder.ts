import "server-only";

import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { createAdminClient } from "@/lib/supabase/admin";

export interface Chunk {
    content: string;
    sourceType: string;
    sourceId?: string;
}

/**
 * Basic semantic chunker. Splits text by double newlines or headers,
 * ensuring chunks aren't too massive.
 */
export function chunkText(text: string, maxTokens: number = 500): string[] {
    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const p of paragraphs) {
        if (currentChunk.length + p.length > maxTokens * 4) {
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = p;
        } else {
            currentChunk += "\n\n" + p;
        }
    }

    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * Generates embeddings for a list of chunks and inserts them into Supabase
 * using the strictly server-only admin client.
 */
export async function embedAndStore(chunks: Chunk[]): Promise<boolean> {
    if (!process.env.OPENAI_API_KEY) {
        console.warn("OPENAI_API_KEY is missing. Skipping embedding generation.");
        return false;
    }

    if (chunks.length === 0) {
        return true;
    }

    try {
        const supabaseAdmin = createAdminClient();
        const contents = chunks.map((c) => c.content);

        const { embeddings } = await embedMany({
            model: openai.embedding("text-embedding-ada-002"),
            values: contents,
        });

        const rows = chunks.map((chunk, i) => ({
            source_type: chunk.sourceType,
            source_id: chunk.sourceId || null,
            content: chunk.content,
            embedding: embeddings[i],
        }));

        const { error } = await supabaseAdmin
            .from("document_embeddings")
            .insert(rows);

        if (error) {
            console.error("Supabase embedding insert error:", error.code);
            return false;
        }

        return true;
    } catch {
        console.error("Embedding generation failed.");
        return false;
    }
}
