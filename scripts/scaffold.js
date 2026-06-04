const fs = require('fs');
const path = require('path');

const routes = [
  // About
  "/about/college/profile",
  "/about/college/vision-mission",
  "/about/college/chairman",
  "/about/college/principal",
  "/about/college/bursar",
  "/about/college/vice-principal",
  "/about/college/deans/academic",
  "/about/college/administrative-council",
  "/about/college/college-council",
  "/about/college/governing-body",
  "/about/college/mandatory-disclosure",
  "/about/college/service-rules",
  "/about/campus/location",
  "/about/campus/aerial-view",
  "/about/campus/route-map",
  "/about/highlights",
  
  // Departments
  "/departments/aiml",
  "/departments/biomedical-robotic",
  "/departments/cse",
  "/departments/ece",
  "/departments/eee",
  "/departments/mechanical",
  "/departments/civil",
  "/departments/science-humanities",
  "/departments/office-administration",

  // Academics
  "/academics/academic-calendar",
  "/academics/advisory-system",
  "/academics/toppers",
  "/academics/question-bank/cse",
  "/academics/question-bank/ece",
  "/academics/question-bank/eee",
  "/academics/question-bank/me",
  "/academics/question-bank/ce",
  "/academics/syllabus",
  "/academics/instructions/rules-regulations",
  "/academics/instructions/college-uniform",
  "/academics/ecampus",
  "/academics/emagazine/inkdrops",
  "/academics/emagazine/attitude",
  "/academics/mooc/nptel",

  // Facilities
  "/facilities/campus",
  "/facilities/internet-lab",
  "/facilities/library",
  "/facilities/workshop",
  "/facilities/conference-hall",
  "/facilities/hostel",
  "/facilities/canteen",
  "/facilities/transportation",

  // Admission
  "/admission/application-form",
  "/admission/e-brochure",
  "/admission/fees-scholarships",
  "/admission/preparation-tests",
  "/admission/keam-prospectus",

  // Student Support
  "/student-support/placement",
  "/student-support/ieee",
  "/student-support/students-council",
  "/student-support/sports",
  "/student-support/arts-committee",
  "/student-support/grievance/dac",
  "/student-support/grievance/sgrc",
  "/student-support/grievance/icc",
  "/student-support/grievance/aicte-feedback",
  "/student-support/grievance/online",
  "/student-support/clubs/energy",
  "/student-support/clubs/plantations",
  "/student-support/clubs/alumni",
  "/student-support/clubs/counselling",
  "/student-support/clubs/scm",
  "/student-support/clubs/pta",
  "/student-support/clubs/scholarship",

  // Cells
  "/cells/iedc",
  "/cells/ieee",
  "/cells/nss",
  "/cells/iic",
  "/cells/iiic",
  "/cells/iqac",
  "/cells/anti-ragging",
  "/cells/grievance-faculty",
  "/cells/anti-narcotic",
  "/cells/women-empowerment",
  "/cells/research-development",
];

const basePath = path.join(process.cwd(), 'src', 'app');

routes.forEach(route => {
  const dirPath = path.join(basePath, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, 'page.tsx');
  
  // Format title from route
  const segments = route.split('/').filter(Boolean);
  const title = segments[segments.length - 1]
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const content = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title} | JCMC SIIT',
  description: 'Content under update.',
};

export default function Page() {
  return (
    <div className="pt-32 pb-24 layout-grid min-h-[60vh]">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">{title}</h1>
        
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

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
});

console.log('Successfully scaffolded ' + routes.length + ' routes.');
