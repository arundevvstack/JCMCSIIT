import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
  }

  try {
    let semanticResults: any[] = [];

    // If OpenAI key is available, perform semantic search
    if (process.env.OPENAI_API_KEY) {
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-ada-002'),
        value: query,
      });

      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.7, // looser threshold for general search vs RAG
        match_count: 10
      });

      if (!error && data) {
        semanticResults = data.map((doc: any) => ({
          id: doc.id,
          sourceType: doc.source_type,
          sourceId: doc.source_id,
          content: doc.content,
          similarity: doc.similarity
        }));
      }
    }

    // Basic ILIKE search as fallback or augmentation
    const { data: textResults } = await supabase
      .from('departments')
      .select('id, name, description, slug')
      .ilike('name', `%${query}%`)
      .limit(5);

    return NextResponse.json({
      query,
      semanticMatches: semanticResults,
      exactMatches: textResults || []
    });

  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
