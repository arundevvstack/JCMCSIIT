const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'src', 'app');

function fixJsx(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixJsx(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Fix: </strong>2015 Scheme<strong>
      content = content.replace(/<\/strong>2015 Scheme<strong>/g, '2015 Scheme');
      
      // Fix: cse/page.tsx orphaned </strong>
      content = content.replace(/<\/strong> Mr\. Vishnu/g, 'Mr. Vishnu');
      
      // Fix: fees-scholarships
      content = content.replace(/<strong>No tuition Fees<\/p>/g, 'No tuition Fees</p>');
      
      // Fix: scm/page.tsx
      content = content.replace(/<li>  Neethu<\/strong><\/li>/g, '<li>  Neethu</li>');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed JSX in ${fullPath}`);
      }
    }
  }
}

console.log("Fixing remaining malformed JSX...");
fixJsx(APP_DIR);
console.log("Done.");
