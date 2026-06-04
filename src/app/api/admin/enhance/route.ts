import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Authenticate Request
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, instruction } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const systemPrompt = `You are an expert academic editor and content strategist for John Cox Memorial CSI Institute of Technology (JCMCSIIT).
You format raw text into premium, elite, highly readable Markdown suitable for a world-class university website.
Adhere to these rules:
1. Use professional, inspiring academic tone (like Oxford or MIT).
2. Fix any grammar and structural issues.
3. Keep it concise but impactful.
4. Output ONLY valid Markdown. No conversational filler like "Here is the improved text:".

Specific user instruction: ${instruction || "Enhance for professionalism, clarity, and formatting."}`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: content,
    });

    return NextResponse.json({ enhancedContent: text });
  } catch (error: any) {
    console.error("AI Enhance Error:", error);
    return NextResponse.json({ error: 'Failed to enhance content' }, { status: 500 });
  }
}
