const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      files.push(name);
    }
  }
  return files;
}

const appDir = path.join(__dirname, 'src');
const allPages = getFiles(appDir);

let count = 0;

for (const filePath of allPages) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to match className="...container..." ensuring it doesn't already have mx-auto
  const regex = /className=(["'])([^"']*?\bcontainer\b[^"']*?)\1/g;
  
  const newContent = content.replace(regex, (match, quote, classes) => {
    if (!classes.includes('mx-auto')) {
      changed = true;
      return `className=${quote}${classes} mx-auto${quote}`;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent);
    count++;
    console.log(`Updated alignment in: ${filePath}`);
  }
}

console.log(`Successfully fixed center alignment in ${count} files.`);
