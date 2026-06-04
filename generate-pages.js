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
  
  // also grab hrefs from navLinks in navbar.tsx where they might just be unquoted in an object
  // href: "/about/college/profile"
  const regex2 = /href:\s*(["'])(.*?)\1/g;
  while ((match = regex2.exec(content)) !== null) {
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

  // special manual dynamic overrides
  if (href.startsWith('/courses/')) continue; // handled by dynamic route

  let pagePath = path.join('src/app', href, 'page.tsx');
  if (!fs.existsSync(pagePath)) {
    missingHrefs.push(href);
  }
}

console.log("Found Missing Routes:", missingHrefs.length);

const template = (title) => `import { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '${title} | JCMC SIIT',
  description: 'Learn more about ${title} at JCMC SIIT.',
};

export default function GenericPage() {
  return (
    <div className="pt-32 pb-24 layout-grid min-h-[70vh] bg-slate-50 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-slate-50 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-sm font-semibold text-slate-700 tracking-wide uppercase">Under Development</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight">${title}</h1>
          
          <div className="prose prose-lg prose-slate max-w-none text-justify">
            <p className="text-xl text-slate-600 leading-relaxed mb-6 font-medium">
              We are currently in the process of migrating detailed information and media for the <strong>${title}</strong> section. 
            </p>
            <p className="text-slate-600 leading-relaxed">
              John Cox Memorial CSI Institute of Technology is dedicated to providing comprehensive and up-to-date resources for all our programs, facilities, and campus life initiatives. Please check back soon as our new premium web platform fully rolls out.
            </p>
            
            <div className="mt-12 pt-8 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Have an urgent query?</h3>
              <p className="text-slate-600">
                You can reach out to our admission or administration desks directly via the <Link href="/contact" className="text-blue-600 font-semibold hover:underline">Contact Us</Link> page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

function generateTitle(href) {
  // convert something like "/about/college/vision-mission" to "Vision Mission"
  const parts = href.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || 'Page';
  return last.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

for (const href of missingHrefs) {
  const dirPath = path.join('src/app', href);
  const pagePath = path.join(dirPath, 'page.tsx');
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const title = generateTitle(href);
  fs.writeFileSync(pagePath, template(title));
  console.log("Created: " + pagePath);
}
