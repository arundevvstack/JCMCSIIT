import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'mirror');
const reportFile = path.join(process.cwd(), 'mirror-report.txt');

if (!fs.existsSync(outputDir)) {
  console.error('Mirror directory not found. Please run the mirroring script first.');
  process.exit(1);
}

let fileCount = 0;
let dirCount = 0;
const files = [];

function traverse(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      dirCount++;
      traverse(fullPath);
    } else {
      fileCount++;
      files.push(fullPath.replace(outputDir, ''));
    }
  }
}

console.log('Generating report...');
traverse(outputDir);

const reportContent = `
Mirror Report for jcmcsiit.ac.in
=================================
Total Directories: ${dirCount}
Total Files: ${fileCount}

List of all mirrored files:
---------------------------
${files.join('\n')}
`;

fs.writeFileSync(reportFile, reportContent);
console.log(`Report generated successfully at ${reportFile}`);
