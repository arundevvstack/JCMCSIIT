const fs = require('fs');
const path = require('path');

function replaceLinksInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace Markdown links: [Text](URL)
  // Need to handle cases where URL has < > around it, e.g. [View More](<Staff Profile/...>)
  content = content.replace(/\[([^\]]*)\]\((.*?)\)/g, (match, text, url) => {
    // clean up URL if it has < >
    let cleanUrl = url.trim();
    if (cleanUrl.startsWith('<') && cleanUrl.endsWith('>')) {
      cleanUrl = cleanUrl.slice(1, -1);
    }
    
    // if text is empty and url is #, just remove it
    if (!text.trim() && cleanUrl === '#') {
      return '';
    }
    
    // if text is empty but has a URL, maybe we render the URL as text? Or just remove. 
    // Usually [](#) is garbage. Let's return empty if text is empty.
    if (!text.trim()) {
      return '';
    }

    // Convert .php links to # for now, or just keep them as they are
    // Return a styled anchor tag
    return '<a href="' + cleanUrl + '" className="text-primary hover:underline font-medium transition-colors">' + text + '</a>';
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Updated:", filePath);
  }
}

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceLinksInFile(fullPath);
    }
  }
}

scanDir('src/app');
scanDir('src/components');
console.log("Done fixing markdown links!");
