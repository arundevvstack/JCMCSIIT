const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.tsx')) results.push(file);
  });
  return results;
}

const files = walk('src/app');
let count = 0;

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let original = c;
  
  // Remove the extensions themselves
  c = c.replace(/\.(jpg|jpeg|png|pdf)\)/g, '');
  
  // Clean up empty tags that were left behind
  c = c.replace(/<li>\s*<\/li>\n?/g, '');
  c = c.replace(/<p className="mb-4">\s*<\/p>\n?/g, '');
  
  // Also clean up any empty lists 
  c = c.replace(/<ul className="list-disc pl-6 mb-4 space-y-2">\s*<\/ul>\n?/g, '');

  if (c !== original) {
    fs.writeFileSync(f, c);
    console.log('Cleaned:', f);
    count++;
  }
});

console.log('Total cleaned:', count);
