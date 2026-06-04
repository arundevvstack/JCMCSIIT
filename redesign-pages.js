const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('page.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const appDir = path.join(__dirname, 'src/app');
const allPages = getFiles(appDir);

let count = 0;

for (const filePath of allPages) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it matches the specific wrapper class
  if (content.includes('pt-32 pb-24 layout-grid min-h-[60vh]')) {
    try {
      const returnIndex = content.indexOf('return (');
      if (returnIndex === -1) continue;

      const jsxPart = content.slice(returnIndex);

      const h1Match = jsxPart.match(/<h1[^>]*>([\s\S]+?)<\/h1>/);
      let title = h1Match ? h1Match[1].trim().replace(/\n/g, ' ') : 'Page Content';
      title = title.replace(/\s+/g, ' ');

      const proseStartStr = '<div className="prose';
      const proseStart = jsxPart.indexOf(proseStartStr);
      
      let proseInnerHtml = '';
      if (proseStart !== -1) {
        // Just find where the prose div closes, rough heuristic
        const startTagEnd = jsxPart.indexOf('>', proseStart);
        const remainingStr = jsxPart.slice(startTagEnd + 1);
        const endOfProse = remainingStr.lastIndexOf('</div>', remainingStr.lastIndexOf('</div>', remainingStr.lastIndexOf('</div>') - 1) - 1);
        if (endOfProse !== -1) {
            proseInnerHtml = remainingStr.slice(0, endOfProse).trim();
        } else {
             proseInnerHtml = remainingStr.trim();
        }
      } else {
         continue; // If no prose, skip
      }

      // Cleanup remaining </div> at the end
      while (proseInnerHtml.endsWith('</div>')) {
        proseInnerHtml = proseInnerHtml.slice(0, proseInnerHtml.lastIndexOf('</div>')).trim();
      }

      const newFileContent = `import { Metadata } from 'next';
import { ContentLayout } from '@/components/layout/content-layout';

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")} | JCMCSIIT',
  description: '${title.replace(/'/g, "\\'")} at John Cox Memorial C.S.I Institute Of Technology',
};

export default function Page() {
  return (
    <ContentLayout title="${title.replace(/"/g, '&quot;')}">
      ${proseInnerHtml}
    </ContentLayout>
  );
}
`;

      fs.writeFileSync(filePath, newFileContent);
      count++;
      console.log(`Updated: ${filePath}`);
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }
}

console.log(`Successfully redesigned ${count} more normal sub pages.`);
