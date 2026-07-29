const fs = require('fs');
const path = require('path');

const audit = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));
const missingRoutes = audit.missingPages;

const basePath = path.join(process.cwd(), 'src', 'app');
let created = 0;

missingRoutes.forEach(route => {
  if (route.startsWith('http')) return; // Ignore external links just in case
  const cleanRoute = route.replace(/^\/+/, '').replace(/\/+$/, ''); // Remove leading/trailing slashes
  if (!cleanRoute) return;

  const segments = cleanRoute.split('/').filter(Boolean);
  let currentPath = basePath;
  for (const seg of segments) {
     currentPath = path.join(currentPath, seg);
     if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
     }
  }

  const filePath = path.join(currentPath, 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    const title = segments.length > 0 
      ? segments[segments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : 'Page';

    const content = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title} | JCMC SIIT',
  description: 'Content under update.',
};

export default function Page() {
  return (
    <div className="pt-32 pb-24 layout-grid min-h-[60vh]">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">${title}</h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-slate-500 italic">Content under update.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

    fs.writeFileSync(filePath, content);
    created++;
  }
});

console.log('Successfully generated ' + created + ' missing routes.');
