const fs = require('fs');
const path = require('path');

const files = [
  'src/app/research/iic/page.tsx',
  'src/app/about/college/principal/page.tsx',
  'src/app/about/college/chairman/page.tsx'
];

for (const file of files) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix lingering } before />
    content = content.replace(/}\s*\/>/g, '/>');
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed orphaned } in ' + file);
  }
}
