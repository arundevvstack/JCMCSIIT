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
    
    // Remove "use client";
    content = content.replace(/"use client";\n/g, '');
    content = content.replace(/'use client';\n/g, '');
    
    // Remove onError handler
    // e.g. onError={(e) => { e.currentTarget.style.display = 'none'; }}
    // or onError={(e) => { ... }}
    content = content.replace(/onError=\{[^}]+\}\s*\}/g, '}');
    content = content.replace(/onError=\{[^}]+\}\s*\}\s*\}/g, '}}');
    content = content.replace(/onError=\{[^}]+\}/g, '');
    
    fs.writeFileSync(fullPath, content);
    console.log('Fixed metadata/use client in ' + file);
  }
}
