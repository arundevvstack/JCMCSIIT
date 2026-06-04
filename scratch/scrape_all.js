const fs = require('fs');
const path = require('path');
const https = require('https');
const cheerio = require('cheerio');

const BASE_URL = 'https://jcmcsiit.ac.in/';
const APP_DIR = path.join(__dirname, '../src/app');
const PUBLIC_IMG_DIR = path.join(__dirname, '../public/img/legacy');

if (!fs.existsSync(PUBLIC_IMG_DIR)) {
  fs.mkdirSync(PUBLIC_IMG_DIR, { recursive: true });
}

// Helper to download an image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        resolve(null);
      }
    }).on('error', reject);
  });
};

// Helper to fetch HTML
const fetchHtml = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const generatePageTemplate = (title, htmlContent) => {
  return `import { Metadata } from "next";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "${title.replace(/"/g, '\\"')} | JCMCSIIT",
};

export default function Page() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-slate-50 relative">
      <div className="layout-grid relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
            ${title}
          </h1>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-200/60">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-emerald-600">
            ${htmlContent}
          </div>
        </div>
      </div>
    </main>
  );
}
`;
};

const getSlug = (str) => {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

async function main() {
  console.log("Fetching homepage for menu links from local cache...");
  let homeHtml = '';
  try {
    homeHtml = fs.readFileSync('C:\\\\Users\\\\Admin-\\\\.gemini\\\\antigravity-ide\\\\brain\\\\59ded620-0409-40a3-a603-66d9fb82f071\\\\.system_generated\\\\steps\\\\1292\\\\content.md', 'utf8');
  } catch(e) { console.error("Error reading cache", e); }
  
  const $ = cheerio.load(homeHtml);
  
  const pagesToScrape = [];
  
  // Find all links in the top nav
  $('.nav.topnav a').each((i, el) => {
    const href = $(el).attr('href');
    let title = $(el).text().trim();
    
    if (!href || href === '#' || title === 'Home' || title === '') return;
    if (href.startsWith('http') && !href.includes('jcmcsiit.ac.in')) return; // ignore external sites

    let finalHref = href;
    if (finalHref.startsWith('http')) {
       finalHref = finalHref.replace('https://jcmcsiit.ac.in/', '').replace('http://jcmcsiit.ac.in/', '').replace('www.jcmcsiit.ac.in/', '');
    }
    
    if (finalHref.toLowerCase().endsWith('.pdf') || finalHref.toLowerCase().endsWith('.webp') || finalHref.toLowerCase().endsWith('.jpg')) return;

    pagesToScrape.push({
      title: title,
      href: finalHref
    });
  });

  // Remove duplicates based on href
  const uniquePages = Array.from(new Map(pagesToScrape.map(item => [item.href, item])).values());
  
  console.log(`Found ${uniquePages.length} valid subpages to scrape.`);

  for (let i = 0; i < uniquePages.length; i++) {
    const page = uniquePages[i];
    console.log(`[${i+1}/${uniquePages.length}] Scraping: ${page.title} (${page.href})`);
    
    try {
      const pageHtml = await fetchHtml(BASE_URL + encodeURI(page.href));
      const $page = cheerio.load(pageHtml);
      
      const contentDiv = $page('#content');
      if (!contentDiv.length) {
        console.log(`  -> No #content found, skipping.`);
        continue;
      }

      // Extract title from inner-heading if exists
      const innerHeading = $page('.inner-heading h2').text().trim();
      const finalTitle = innerHeading || page.title;

      // Extract only the text paragraphs, lists, and images from span6/span12 inside #content
      let cleanHtml = '';
      
      contentDiv.find('p, ul, ol, img, h3, h4').each((idx, el) => {
        const tagName = el.tagName.toLowerCase();
        
        if (tagName === 'img') {
          let src = $page(el).attr('src');
          if (src) {
             // Handle relative paths
             if (!src.startsWith('http')) {
               src = BASE_URL + src;
             }
             // For simplicity, we just use a placeholder next/image syntax in the HTML, or just keep it as a standard img tag pointing to the live site for now
             cleanHtml += `<img src="${src}" alt="${finalTitle}" className="rounded-2xl shadow-md my-8 max-w-full h-auto" />\n`;
          }
        } else if (tagName === 'p') {
          const text = $page(el).text().trim();
          if (text) cleanHtml += `<p className="mb-6 leading-relaxed">${text}</p>\n`;
        } else if (tagName === 'ul') {
           cleanHtml += `<ul className="list-disc pl-6 mb-6 space-y-2">\n`;
           $page(el).find('li').each((_, li) => {
             cleanHtml += `<li>${$page(li).text().trim()}</li>\n`;
           });
           cleanHtml += `</ul>\n`;
        } else if (tagName === 'ol') {
           cleanHtml += `<ol className="list-decimal pl-6 mb-6 space-y-2">\n`;
           $page(el).find('li').each((_, li) => {
             cleanHtml += `<li>${$page(li).text().trim()}</li>\n`;
           });
           cleanHtml += `</ol>\n`;
        } else if (tagName === 'h3' || tagName === 'h4') {
           cleanHtml += `<${tagName} className="text-2xl font-bold mt-8 mb-4">${$page(el).text().trim()}</${tagName}>\n`;
        }
      });
      
      if (!cleanHtml) {
        cleanHtml = `<p>Content coming soon.</p>`;
      }

      // Generate the Next.js page
      const slug = getSlug(page.title);
      const pageDir = path.join(APP_DIR, slug);
      
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }
      
      const tsxContent = generatePageTemplate(finalTitle, cleanHtml);
      fs.writeFileSync(path.join(pageDir, 'page.tsx'), tsxContent);
      console.log(`  -> Created /${slug}`);
      
    } catch (e) {
      console.error(`  -> Failed to scrape ${page.href}: ${e.message}`);
    }
  }
  
  console.log("Done generating pages!");
}

main();
