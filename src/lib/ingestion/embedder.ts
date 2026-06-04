import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client (Note: Requires service role key for inserts into RLS protected tables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  // A simple chunking strategy. In production, consider a more robust NLP sentence splitter.
  const paragraphs = text.split(/\n\s*\n/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    if (currentChunk.length + p.length > maxTokens * 4) { // rough char-to-token ratio
      chunks.push(currentChunk.trim());
      currentChunk = p;
    } else {
      currentChunk += '\n\n' + p;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Generates embeddings for a list of chunks and inserts them into Supabase
 */
export async function embedAndStore(chunks: Chunk[]) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OPENAI_API_KEY is missing. Skipping embedding generation.");
    return false;
  }

  try {
    const contents = chunks.map(c => c.content);
    
    // Generate embeddings in batch using OpenAI text-embedding-ada-002
    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-ada-002'),
      values: contents,
    });

    // Prepare data for Supabase
    const rows = chunks.map((chunk, i) => ({
      source_type: chunk.sourceType,
      source_id: chunk.sourceId || null,
      content: chunk.content,
      embedding: embeddings[i],
    }));

    // Insert into document_embeddings table
    const { error } = await supabase
      .from('document_embeddings')
      .insert(rows);

    if (error) {
      console.error("Supabase insert error:", error);
      return false;
    }

    return true;
  } catch (error: any) {
    console.error("Embedding generation failed:", error);
    return false;
  }
}
