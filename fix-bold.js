const fs = require('fs');
const path = require('path');

function replaceBoldInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace **text** with <strong>text</strong>
  // Using a non-greedy match for anything between ** and **
  // We should be careful about multi-line or empty asterisks
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Clean up any stray solitary ** (like <p>**</p>)
  content = content.replace(/>\*\*</g, '></strong><'); // if someone did >**<
  content = content.replace(/>\*\*([^*]*)</g, '><strong>$1</strong><'); // anything trailing
  content = content.replace(/\*\*/g, ''); // remove any remaining literal ** just in case

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
      replaceBoldInFile(fullPath);
    }
  }
}

scanDir('src/app');
scanDir('src/components');
console.log("Done fixing bold text!");
