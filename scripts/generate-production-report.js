const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'src', 'app');
const reportPath = 'C:\\\\Users\\\\Admin-\\\\.gemini\\\\antigravity-ide\\\\brain\\\\e701f238-70d7-4d25-8fd9-07400409912b\\\\production_acceptance_report.md';

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

const pageFiles = getFiles(basePath).filter(f => f.endsWith('page.tsx') || f.endsWith('page.ts'));

const pages = [];
const summaries = {
  productionReady: [],
  content: [],
  images: [],
  documents: [],
  faculty: [],
  department: [],
  news: [],
  events: [],
  gallery: []
};

let globalStats = {
  total: 0,
  contentComplete: 0,
  imageComplete: 0,
  facultyComplete: 0,
  departmentComplete: 0,
  seoComplete: 0,
  a11yComplete: 0,
  mobileComplete: 0
};

pageFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let route = f.split(path.sep).join('/').replace('src/app', '').replace('/page.tsx', '').replace('/page.ts', '');
  if (route === '') route = '/';

  const isScaffolded = content.includes('Content under update');
  const isPlaceholder = isScaffolded || content.includes('Coming Soon') || content.includes('coming-soon');
  const hasLorem = content.includes('Lorem') || content.includes('ipsum');
  const hasDummyImages = content.includes('aaa.png') || content.includes('placeholder');
  
  const hasMetadata = content.includes('export const metadata') || content.includes('export function generateMetadata');
  const hasStructuredData = content.includes('application/ld+json') || content.includes('SchemaOrg');
  const hasA11yIssues = (content.match(/<img /g) && !content.match(/alt=/g)) || (content.match(/<Image /g) && !content.match(/alt=/g));
  const hasInternalLinks = content.includes('href="/') || content.includes("href='/") || content.includes('href={`/');
  const hasCTA = content.includes('Apply Now') || content.includes('Contact Us') || content.includes('Learn More') || content.toLowerCase().includes('cta');
  
  // Categorize requirements
  let missingContent = isPlaceholder || hasLorem ? 'Real text copy required' : 'None';
  let missingImages = hasDummyImages || !content.includes('Image') ? 'Official photographs required' : 'None';
  let missingDownloads = (route.includes('downloads') || route.includes('admission')) && !content.includes('.pdf') ? 'PDF documents required' : 'None';
  let missingSEO = !hasMetadata ? 'Title/Description meta tags missing' : 'None';
  let missingMeta = !hasMetadata ? 'Missing exported metadata' : 'None';
  let missingSchema = !hasStructuredData ? 'JSON-LD structured data missing' : 'None';
  let missingA11y = hasA11yIssues ? 'Missing alt attributes on images' : 'None';
  let missingMobile = !content.includes('sm:') && !content.includes('md:') ? 'Responsive Tailwind classes missing' : 'None';
  let missingLinks = !hasInternalLinks ? 'No contextual internal linking' : 'None';
  let missingCta = !hasCTA ? 'Clear Call to Action missing' : 'None';
  let reqDoc = 'Website Copy Document';

  if (route.includes('faculty')) reqDoc = 'Faculty Profiles Data';
  if (route.includes('departments')) reqDoc = 'Department Prospectus/Vision Document';
  if (route.includes('news')) reqDoc = 'Latest News Articles';
  if (route.includes('events')) reqDoc = 'Event Calendar Details';
  if (route.includes('gallery')) reqDoc = 'Official Campus Photos Archive';

  // Calculate completion %
  let score = 0;
  let maxScore = 10;
  
  if (!isPlaceholder && !hasLorem) score += 3;
  if (missingImages === 'None') score += 2;
  if (missingSEO === 'None') score += 1;
  if (missingMeta === 'None') score += 1;
  if (missingSchema === 'None') score += 1;
  if (missingA11y === 'None') score += 1;
  if (missingMobile === 'None') score += 1;

  let completionPct = Math.round((score / maxScore) * 100);
  if (isPlaceholder || hasLorem) completionPct = Math.min(completionPct, 10); // Cap placeholders

  let titleMatch = content.match(/title:\s*["']([^"']+)["']/);
  let title = titleMatch ? titleMatch[1] : (route === '/' ? 'Home' : route.split('/').pop());

  pages.push({
    route,
    title,
    completionPct,
    missingContent,
    missingImages,
    missingDownloads,
    missingSEO,
    missingMeta,
    missingSchema,
    missingA11y,
    missingMobile,
    missingLinks,
    missingCta,
    reqDoc
  });

  // Track global stats for dashboard
  globalStats.total++;
  if (missingContent === 'None') globalStats.contentComplete++;
  if (missingImages === 'None') globalStats.imageComplete++;
  if (missingSEO === 'None') globalStats.seoComplete++;
  if (missingA11y === 'None') globalStats.a11yComplete++;
  if (missingMobile === 'None') globalStats.mobileComplete++;
  
  if (route.includes('faculty') && missingContent === 'None') globalStats.facultyComplete++;
  if (route.includes('departments') && missingContent === 'None') globalStats.departmentComplete++;

  // Categorize into summaries
  if (completionPct >= 90) summaries.productionReady.push(route);
  if (missingContent !== 'None') summaries.content.push(route);
  if (missingImages !== 'None') summaries.images.push(route);
  if (missingDownloads !== 'None') summaries.documents.push(route);
  if (route.includes('faculty') && missingContent !== 'None') summaries.faculty.push(route);
  if (route.includes('departments') && missingContent !== 'None') summaries.department.push(route);
  if (route.includes('news') && missingContent !== 'None') summaries.news.push(route);
  if (route.includes('events') && missingContent !== 'None') summaries.events.push(route);
  if (route.includes('gallery') && missingImages !== 'None') summaries.gallery.push(route);
});

// Generate Markdown
let md = `# Production Acceptance Report\n\n`;
md += `*Generated automatically from verified codebase implementation.*\n\n`;

md += `## Executive Dashboard\n\n`;
md += `| Metric | Completion |\n`;
md += `|--------|------------|\n`;
md += `| Production Completion | **${Math.round((summaries.productionReady.length / globalStats.total) * 100)}%** |\n`;
md += `| Content Completion | **${Math.round((globalStats.contentComplete / globalStats.total) * 100)}%** |\n`;
md += `| Image Completion | **${Math.round((globalStats.imageComplete / globalStats.total) * 100)}%** |\n`;
md += `| Faculty Completion | **${Math.round((globalStats.facultyComplete / Math.max(1, pages.filter(p => p.route.includes('faculty')).length)) * 100)}%** |\n`;
md += `| Department Completion | **${Math.round((globalStats.departmentComplete / Math.max(1, pages.filter(p => p.route.includes('departments')).length)) * 100)}%** |\n`;
md += `| SEO Completion | **${Math.round((globalStats.seoComplete / globalStats.total) * 100)}%** |\n`;
md += `| Accessibility Completion | **${Math.round((globalStats.a11yComplete / globalStats.total) * 100)}%** |\n`;
md += `| Mobile Completion | **${Math.round((globalStats.mobileComplete / globalStats.total) * 100)}%** |\n\n`;

md += `## Detailed Page Audit\n\n`;
pages.forEach(p => {
  md += `### ${p.title} (\`${p.route}\`)\n`;
  md += `- **Completion**: ${p.completionPct}%\n`;
  md += `- **Missing Content**: ${p.missingContent}\n`;
  md += `- **Missing Images**: ${p.missingImages}\n`;
  md += `- **Missing Downloads**: ${p.missingDownloads}\n`;
  md += `- **Missing SEO**: ${p.missingSEO}\n`;
  md += `- **Missing Metadata**: ${p.missingMeta}\n`;
  md += `- **Missing Structured Data**: ${p.missingSchema}\n`;
  md += `- **Missing Accessibility**: ${p.missingA11y}\n`;
  md += `- **Missing Mobile Optimisation**: ${p.missingMobile}\n`;
  md += `- **Missing Internal Links**: ${p.missingLinks}\n`;
  md += `- **Missing CTA**: ${p.missingCta}\n`;
  md += `- **Required Source Document**: ${p.reqDoc}\n\n`;
});

md += `## Action Summaries\n\n`;

const writeSummary = (title, arr) => {
  md += `### ${title} (${arr.length})\n`;
  if (arr.length === 0) md += `*All items complete.*\n\n`;
  else md += arr.map(a => `- \`${a}\``).join('\n') + '\n\n';
};

writeSummary('1. Production Ready Pages', summaries.productionReady);
writeSummary('2. Pages Requiring Content', summaries.content);
writeSummary('3. Pages Requiring Images', summaries.images);
writeSummary('4. Pages Requiring Documents', summaries.documents);
writeSummary('5. Pages Requiring Faculty Data', summaries.faculty);
writeSummary('6. Pages Requiring Department Data', summaries.department);
writeSummary('7. Pages Requiring News Updates', summaries.news);
writeSummary('8. Pages Requiring Event Updates', summaries.events);
writeSummary('9. Pages Requiring Gallery Updates', summaries.gallery);

// Write artifact
fs.writeFileSync(reportPath, md);
console.log('Production Acceptance Report Generated at: ' + reportPath);
