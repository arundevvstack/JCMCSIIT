import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs/promises';
import path from 'path';
import { URL } from 'url';

const BASE_URL = 'https://jcmcsiit.ac.in';
const turndownService = new TurndownService();

turndownService.addRule('remove-clutter', {
  filter: ['script', 'noscript', 'style', 'nav', 'footer', 'header', 'aside'],
  replacement: () => ''
});

const visited = new Set();
const queue = [BASE_URL];
const scrapedData = { pages: [], pdfs: [], images: [] };

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      return { type: 'pdf', buffer: await response.arrayBuffer() };
    }
    
    const html = await response.text();
    return { type: 'html', $: cheerio.load(html) };
  } catch (error) {
    console.error(`Failed to fetch ${url}: ${error.message}`);
    return null;
  }
}

async function crawl() {
  console.log("Starting Deep Content Crawler...");
  
  let limit = 200; // Increased limit for full site discovery
  
  while (queue.length > 0 && limit > 0) {
    const currentUrl = queue.shift();
    if (visited.has(currentUrl)) continue;
    
    console.log(`[${200 - limit}] Crawling: ${currentUrl}`);
    visited.add(currentUrl);
    limit--;

    const content = await fetchPage(currentUrl);
    if (!content) continue;

    if (content.type === 'pdf') {
      scrapedData.pdfs.push(currentUrl);
      continue;
    }

    const $ = content.$;
    
    const title = $('title').text().trim() || $('h1').first().text().trim();
    const mainContentHtml = $('main').html() || $('.site-content').html() || $('article').html() || $('body').html();
    
    let markdown = '';
    try {
      markdown = turndownService.turndown(mainContentHtml || '');
    } catch (e) {
      console.warn(`[Warning] Could not convert HTML to markdown for ${currentUrl}: ${e.message}`);
      markdown = "HTML conversion failed. Manual extraction required.";
    }
    
    $('img').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        try {
          const imgUrl = new URL(src, currentUrl).href;
          if (!scrapedData.images.includes(imgUrl)) {
            scrapedData.images.push(imgUrl);
          }
        } catch(e) {}
      }
    });

    scrapedData.pages.push({
      url: currentUrl,
      title,
      html: mainContentHtml,
      markdown,
    });

    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      
      try {
        const resolvedUrl = new URL(href, currentUrl);
        if (resolvedUrl.hostname === new URL(BASE_URL).hostname || resolvedUrl.hostname === 'www.jcmcsiit.ac.in') {
          const cleanUrl = resolvedUrl.origin + resolvedUrl.pathname;
          if (!visited.has(cleanUrl) && !queue.includes(cleanUrl)) {
            queue.push(cleanUrl);
          }
        }
      } catch (e) {}
    });
    
    await new Promise(res => setTimeout(res, 200));
  }
}

async function main() {
  const outputDir = path.join(process.cwd(), 'content');
  await fs.mkdir(outputDir, { recursive: true });

  await crawl();

  const outputPath = path.join(outputDir, 'deep_crawl_seed.json');
  await fs.writeFile(outputPath, JSON.stringify(scrapedData, null, 2));
  console.log(`\nCrawling complete. Saved ${scrapedData.pages.length} pages, ${scrapedData.images.length} images, and found ${scrapedData.pdfs.length} PDFs to ${outputPath}`);
}

main().catch(console.error);
