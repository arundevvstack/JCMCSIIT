const fs = require('fs');
const path = require('path');

const report = {
  routes: [],
  missingPages: [],
  placeholderPages: [],
  unusedComponents: [],
  orphanPages: [],
  missingImages: []
};

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
const componentFiles = getFiles('src/components');
const allSourceFiles = [...appFiles, ...componentFiles];

// 1. Extract all routes
const routeFiles = appFiles.filter(f => f.endsWith('page.tsx') || f.endsWith('page.ts'));
report.routes = routeFiles.map(f => {
  let route = f.split(path.sep).join('/').replace('src/app', '').replace('/page.tsx', '').replace('/page.ts', '');
  return route === '' ? '/' : route;
});

// 2. Extract all links & imports & images
const allLinks = new Set();
const allImports = new Set();
const allImages = new Set();

const fileContents = new Map();

allSourceFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  fileContents.set(f, content);
  
  // Find hrefs
  const linkMatches = [...content.matchAll(/href=(["'])(.*?)\1/g)];
  linkMatches.forEach(m => {
    let link = m[2].split('?')[0].split('#')[0];
    if (link.startsWith('/') && !link.startsWith('//')) {
      allLinks.add(link);
    }
  });

  // Find images
  const imgMatches = [...content.matchAll(/src=(["'])(.*?)\1/g)];
  imgMatches.forEach(m => {
    let img = m[2];
    if (img.startsWith('/') && !img.startsWith('//')) {
      allImages.add(img);
    }
  });

  // Find placeholder usage
  if (content.includes('coming-soon') || content.includes('Coming Soon') || content.includes('Placeholder')) {
    let route = f.split(path.sep).join('/').replace('src/app', '').replace('/page.tsx', '');
    if (f.includes('page.tsx')) report.placeholderPages.push(route === '' ? '/' : route);
  }

  // Find component imports
  const importMatches = [...content.matchAll(/import\s+.*?from\s+["'](.*?)["']/g)];
  importMatches.forEach(m => {
    allImports.add(m[1]);
  });
});

// 3. Find missing pages
allLinks.forEach(link => {
  if (link === '/') return;
  if (link.includes('{') || link.includes('$')) return; // Dynamic
  
  const matchRoute = report.routes.find(r => r === link || r === link + '/' || link === r + '/');
  
  const publicPath = path.join('public', link);
  const isStatic = fs.existsSync(publicPath);

  if (!matchRoute && !isStatic) {
    const parts = link.split('/').filter(Boolean);
    let matchedDynamic = false;
    for (let route of report.routes) {
       const rParts = route.split('/').filter(Boolean);
       if (parts.length === rParts.length) {
         let match = true;
         for (let i = 0; i < parts.length; i++) {
           if (rParts[i].startsWith('[') && rParts[i].endsWith(']')) continue;
           if (parts[i] !== rParts[i]) { match = false; break; }
         }
         if (match) { matchedDynamic = true; break; }
       }
    }
    if (!matchedDynamic) {
      report.missingPages.push(link);
    }
  }
});

// 4. Find Orphan Pages
report.routes.forEach(route => {
  if (route === '/') return;
  if (!allLinks.has(route) && !route.includes('[')) {
    let isReferenced = false;
    for (const content of fileContents.values()) {
      if (content.includes(route)) {
        isReferenced = true;
        break;
      }
    }
    if (!isReferenced) {
      report.orphanPages.push(route);
    }
  }
});

// 5. Unused components
componentFiles.forEach(comp => {
  const basename = path.basename(comp, path.extname(comp));
  let isUsed = false;
  for (const imp of allImports) {
    if (imp.includes(basename)) {
      isUsed = true; break;
    }
  }
  if (!isUsed) {
    report.unusedComponents.push(comp.split(path.sep).join('/'));
  }
});

// 6. Missing images
allImages.forEach(img => {
  if (img.includes('{') || img.includes('$')) return;
  const publicPath = path.join('public', img.split('/').join(path.sep));
  if (!fs.existsSync(publicPath)) {
    report.missingImages.push(img);
  }
});

fs.writeFileSync('audit_results.json', JSON.stringify(report, null, 2));
console.log('Audit complete.');
