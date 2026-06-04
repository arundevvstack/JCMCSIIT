import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';

async function downloadFile(url, dest) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ensure dir exists
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, buffer);
    console.log(`[SUCCESS] Downloaded: ${url}`);
  } catch (e) {
    console.error(`[ERROR] Failed to download ${url}: ${e.message}`);
  }
}

async function main() {
  const seedPath = path.join(process.cwd(), 'content', 'deep_crawl_seed.json');
  const data = JSON.parse(await fs.readFile(seedPath, 'utf8'));
  
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log(`Found ${data.images.length} images and ${data.pdfs.length} PDFs to process.`);
  
  // Download PDFs
  for (const pdfUrl of data.pdfs) {
    try {
      const parsed = new URL(pdfUrl);
      const relativePath = parsed.pathname.replace(/^\/+/, ''); // e.g. documents/Service Rules/...
      const dest = path.join(publicDir, relativePath);
      await downloadFile(pdfUrl, dest);
    } catch(e) {}
  }
  
  // Download Images (excluding external or invalid)
  for (const imgUrl of data.images) {
    try {
      const parsed = new URL(imgUrl);
      if (parsed.hostname === 'jcmcsiit.ac.in' || parsed.hostname === 'www.jcmcsiit.ac.in') {
        const relativePath = parsed.pathname.replace(/^\/+/, '');
        const dest = path.join(publicDir, relativePath);
        await downloadFile(imgUrl, dest);
      }
    } catch(e) {}
  }
  
  console.log('Asset download completed.');
}

main().catch(console.error);
