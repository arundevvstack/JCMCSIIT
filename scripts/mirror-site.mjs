import scrape from 'website-scraper';
import fs from 'fs';
import path from 'path';

const targetUrl = 'https://jcmcsiit.ac.in/';
const outputDir = path.join(process.cwd(), 'mirror');

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

class MyPlugin {
  apply(registerAction) {
    registerAction('beforeRequest', ({resource, requestOptions}) => {
      requestOptions.headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      };
      return {requestOptions};
    });
  }
}

const options = {
  urls: [targetUrl],
  directory: outputDir,
  recursive: true,
  maxDepth: 100, 
  urlFilter: function (url) {
    // Always allow the primary domain
    if (url.startsWith('https://jcmcsiit.ac.in') || url.startsWith('http://jcmcsiit.ac.in')) {
      return true;
    }
    // Allow assets based on extension so images/CSS/JS from other domains are downloaded
    if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)(\?.*)?$/i)) {
      return true;
    }
    // Allow common CDNs just in case they lack extensions
    if (url.includes('cdnjs') || url.includes('jsdelivr') || url.includes('googleapis') || url.includes('gstatic') || url.includes('bootstrap')) {
      return true;
    }
    return false;
  },
  filenameGenerator: function (resource, options, occupiedFileNames) {
    const urlObj = new URL(resource.url);
    let pathname = urlObj.pathname;
    
    // Remove leading slash
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1);
    }
    
    if (pathname === '') {
      pathname = 'index.html';
    } else if (pathname.endsWith('/')) {
      pathname += 'index.html';
    } else if (pathname.endsWith('.php')) {
      pathname = pathname.replace(/\.php$/, '.html');
    } else if (!pathname.includes('.')) {
      pathname += '/index.html';
    }

    // Keep query params for unique assets if they have ?v=...
    if (resource.isHtml()) {
       return decodeURI(pathname);
    }
    
    return decodeURI(pathname);
  },
  plugins: [new MyPlugin()],
};

console.log(`Starting crawl and mirror of ${targetUrl}...`);

scrape(options)
  .then((result) => {
    console.log('Website successfully mirrored!');
  })
  .catch((err) => {
    console.error('An error occurred during mirroring:', err);
  });
