import fs from 'fs/promises';
import path from 'path';

async function walk(dir, callback) {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    const stat = await fs.stat(p);
    if (stat.isDirectory()) {
      await walk(p, callback);
    } else {
      await callback(p);
    }
  }
}

async function main() {
  const appDir = path.join(process.cwd(), 'src', 'app');
  let count = 0;
  
  await walk(appDir, async (p) => {
    if (p.endsWith('page.tsx')) {
      const content = await fs.readFile(p, 'utf8');
      if (content.includes('{title}')) {
        // derive a generic title from the parent folder name
        const folderName = path.basename(path.dirname(p));
        const titleStr = folderName
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
          
        const newContent = content.replace(/{title}/g, titleStr);
        await fs.writeFile(p, newContent);
        console.log(`Fixed ${p} with title: ${titleStr}`);
        count++;
      }
    }
  });
  
  console.log(`Fixed ${count} files.`);
}

main().catch(console.error);
