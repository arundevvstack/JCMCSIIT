const fs = require('fs');
const path = require('path');

function replaceHeadingsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace <p...>#+ Text</p> with <hX...>Text</hX>
  content = content.replace(/<p([^>]*)>\s*(#{1,6})\s+(.*?)<\/p>/g, (match, pAttrs, hashes, text) => {
    const level = hashes.length; // 1 to 6
    
    // Define some default styling based on level if we want it to look like a heading
    let headingClasses = "";
    if (level === 1) headingClasses = "text-4xl font-bold mb-6 text-slate-900";
    else if (level === 2) headingClasses = "text-3xl font-bold mb-5 text-slate-900";
    else if (level === 3) headingClasses = "text-2xl font-bold mb-4 text-slate-900";
    else if (level === 4) headingClasses = "text-xl font-bold mb-4 text-slate-800";
    else if (level === 5) headingClasses = "text-lg font-bold mb-3 text-slate-800";
    else if (level === 6) headingClasses = "text-base font-bold mb-3 text-slate-800";

    // If pAttrs already has className, we might want to replace or merge it
    // For simplicity, we'll just completely replace the className with our heading classes
    let newAttrs = pAttrs.replace(/className=(["'])(.*?)\1/, 'className="' + headingClasses + '"');
    
    // If there was no className, add it
    if (!pAttrs.includes('className=')) {
      newAttrs = ' className="' + headingClasses + '"';
    }

    return '<h' + level + newAttrs + '>' + text + '</h' + level + '>';
  });

  // Also replace any inline #+ Text that aren't wrapped in <p> just in case, but only if they are at the start of a line
  // Example: {">"} #### Heading
  // It's safer to just handle the <p> wrapped ones since that's what the markdown converter outputted.
  // But let's also handle raw lines just in case (e.g. {`#### Text`})
  // Actually, the <p> wrapper is 99% of the cases from the markdown parser.

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
      replaceHeadingsInFile(fullPath);
    }
  }
}

scanDir('src/app');
scanDir('src/components');
console.log("Done fixing headings!");
