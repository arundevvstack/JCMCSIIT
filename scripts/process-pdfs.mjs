import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import 'dotenv/config';

// In a real app, we'd import the OpenAI client from ai SDK, but since this is a script,
// we can either use standard fetch to OpenAI API or the ai-sdk.
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';

async function processPdf(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    
    // Chunking Strategy: Split by double newlines or paragraphs
    const text = data.text;
    const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 50);
    
    // Max chunk size to ~1000 characters to keep embeddings focused
    const chunks = [];
    let currentChunk = '';
    
    for (const p of paragraphs) {
      if ((currentChunk.length + p.length) > 1000) {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = p;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + p;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
  } catch (error) {
    console.error(`Error processing PDF ${filePath}:`, error.message);
    return [];
  }
}

async function generateEmbeddings(chunks, sourceId, sourceType = 'general') {
  if (!chunks || chunks.length === 0) return [];
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn("No OPENAI_API_KEY found, skipping actual embedding generation. Returning mock embeddings.");
    // Return mock data if no key
    return chunks.map(chunk => ({
      source_type: sourceType,
      source_id: sourceId,
      content: chunk,
      embedding: new Array(1536).fill(0.0) // Mock vector
    }));
  }

  try {
    console.log(`Generating embeddings for ${chunks.length} chunks using OpenAI...`);
    // AI SDK embedMany uses the provider
    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-ada-002'),
      values: chunks,
    });
    
    return chunks.map((chunk, i) => ({
      source_type: sourceType,
      source_id: sourceId,
      content: chunk,
      embedding: embeddings[i]
    }));
  } catch (error) {
    console.error("Error generating embeddings:", error.message);
    return [];
  }
}

async function main() {
  console.log("Starting AI PDF Intelligence Pipeline...");
  
  const docsDir = path.join(process.cwd(), 'content', 'docs');
  
  // Create dummy PDF directory if it doesn't exist
  await fs.mkdir(docsDir, { recursive: true });
  
  // Here we would iterate through PDFs in docsDir. For demonstration, we'll just check.
  const files = await fs.readdir(docsDir);
  const pdfFiles = files.filter(f => f.endsWith('.pdf'));
  
  if (pdfFiles.length === 0) {
    console.log("No PDFs found in content/docs to process. (Pipeline ready for use)");
  } else {
    for (const file of pdfFiles) {
      console.log(`Processing ${file}...`);
      const chunks = await processPdf(path.join(docsDir, file));
      console.log(`Extracted ${chunks.length} chunks from ${file}`);
      
      const embeddingsData = await generateEmbeddings(chunks, 'dummy-uuid-here', 'pdf_document');
      console.log(`Generated ${embeddingsData.length} vectors. (Ready to insert to Supabase)`);
      
      // In production, insert `embeddingsData` into Supabase `document_embeddings` table.
    }
  }
}

main().catch(console.error);
