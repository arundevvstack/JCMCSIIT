import { openai } from '@ai-sdk/openai';
import { streamText, embed } from 'ai';
import { createClient } from '@supabase/supabase-js';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1].content;

  let contextText = "";

  // Perform RAG if API keys are available
  if (process.env.OPENAI_API_KEY && supabaseUrl && supabaseKey) {
    try {
      // 1. Generate an embedding for the user's latest message
      const { embedding } = await embed({
        model: openai.embedding('text-embedding-ada-002'),
        value: lastMessage,
      });

      // 2. Query the document_embeddings table using the match_documents RPC function
      const { data: documents, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.75, // strict threshold to prevent hallucinations
        match_count: 5 // top 5 most relevant chunks
      });

      if (!error && documents && documents.length > 0) {
        contextText = documents.map((doc: any) => doc.content).join("\n\n---\n\n");
      }
    } catch (e) {
      console.error("RAG retrieval failed:", e);
    }
  }

  const systemPrompt = `You are the official AI Campus Assistant for John Cox Memorial CSI Institute of Technology (JCMCSIIT).
You are a highly intelligent, futuristic, and helpful assistant. 
Use a premium, professional, yet welcoming tone.

You must ground your responses strictly in the provided Context below. 
If the answer is not in the context, politely state that you don't have that specific information and direct them to contact admissions or the relevant department.
NEVER invent statistics, placement rates, approvals, fee structures, deadlines, or rankings.

Context Retrieved from Database:
=========================
${contextText || 'No specific context found. Rely on general verified knowledge about JCMCSIIT.'}
=========================`;

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: systemPrompt,
    messages,
  });

  return result.toTextStreamResponse();
}
