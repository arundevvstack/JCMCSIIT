const fs = require('fs');
const path = require('path');

function extractHrefs(content) {
  const regex = /href=(["'])(.*?)\1/g;
  const hrefs = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const href = match[2];
    if (href.startsWith('/') && !href.startsWith('//')) {
      hrefs.add(href);
    }
  }
  return hrefs;
}

function scanDir(dir, hrefs) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath, hrefs);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const found = extractHrefs(content);
      found.forEach(h => hrefs.add(h));
    }
  }
}

const allHrefs = new Set();
scanDir('src/components', allHrefs);
scanDir('src/app', allHrefs);

const missingHrefs = [];
for (let href of allHrefs) {
  // Remove query params or hashes
  href = href.split('?')[0].split('#')[0];
  if (href === '/') continue;
  
  // Try to find the page file
  // For dynamic routes like /news/${item.id}, skip or match with [slug]
  if (href.includes('${') || href.includes('}')) continue;

  let pagePath = path.join('src/app', href, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    // maybe dynamic?
    missingHrefs.push(href);
  }
}

console.log("Missing Routes Count:", missingHrefs.length);
console.log(missingHrefs.join('\n'));
