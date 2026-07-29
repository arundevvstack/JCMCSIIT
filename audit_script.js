const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const appFiles = getFiles('src/app');
const routes = appFiles.filter(f => f.endsWith('page.tsx') || f.endsWith('page.ts')).map(f => {
  let route = f.replace(/\\/g, '/').replace('src/app', '').replace('/page.tsx', '').replace('/page.ts', '');
  return route === '' ? '/' : route;
});

const componentsFiles = getFiles('src/components');

console.log('Total Routes:', routes.length);
