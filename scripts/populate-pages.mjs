import fs from 'fs/promises';
import path from 'path';

// Mapping old URLs to new Next.js routes
const routeMap = {
  // About
  "https://jcmcsiit.ac.in/about%20us.php": "/about/college/profile",
  "https://jcmcsiit.ac.in/Vision%20&%20mission.php": "/about/college/vision-mission",
  "https://jcmcsiit.ac.in/chairman.php": "/about/college/chairman",
  "https://jcmcsiit.ac.in/Principal.php": "/about/college/principal",
  "https://jcmcsiit.ac.in/bursar.php": "/about/college/bursar",
  "https://jcmcsiit.ac.in/Vice_Principal.php": "/about/college/vice-principal",
  "https://jcmcsiit.ac.in/Administrative%20Council.php": "/about/college/administrative-council",
  "https://jcmcsiit.ac.in/college_council.php": "/about/college/college-council",
  "https://jcmcsiit.ac.in/governing.php": "/about/college/governing-body",
  "https://jcmcsiit.ac.in/mandatory.php": "/about/college/mandatory-disclosure",
  "https://jcmcsiit.ac.in/Campus%20and%20Location.php": "/about/campus/location",
  "https://jcmcsiit.ac.in/Campus%20Plan.php": "/about/campus/aerial-view",
  "https://jcmcsiit.ac.in/Route%20Map.php": "/about/campus/route-map",
  "https://jcmcsiit.ac.in/highlight.php": "/about/highlights",

  // Departments
  "https://jcmcsiit.ac.in/BMRE_about.php": "/departments/biomedical-robotic",
  "https://jcmcsiit.ac.in/CSE_about.php": "/departments/cse",
  "https://jcmcsiit.ac.in/ECE_about.php": "/departments/ece",
  "https://jcmcsiit.ac.in/EEE_about.php": "/departments/eee",
  "https://jcmcsiit.ac.in/ME_about.php": "/departments/mechanical",
  "https://jcmcsiit.ac.in/CE_about.php": "/departments/civil",
  "https://jcmcsiit.ac.in/Basic%20Science_about.php": "/departments/science-humanities",
  "https://jcmcsiit.ac.in/Office%20Admistration_about.php": "/departments/office-administration",

  // Academics
  "https://jcmcsiit.ac.in/calender.php": "/academics/academic-calendar",
  "https://jcmcsiit.ac.in/Advisory%20System.php": "/academics/advisory-system",
  "https://jcmcsiit.ac.in/toppers.php": "/academics/toppers",
  "https://jcmcsiit.ac.in/CSE_QP.php": "/academics/question-bank/cse",
  "https://jcmcsiit.ac.in/ECE_QP.php": "/academics/question-bank/ece",
  "https://jcmcsiit.ac.in/EEE_QP.php": "/academics/question-bank/eee",
  "https://jcmcsiit.ac.in/ME_QP.php": "/academics/question-bank/me",
  "https://jcmcsiit.ac.in/CE_QP.php": "/academics/question-bank/ce",
  "https://jcmcsiit.ac.in/syllabus.php": "/academics/syllabus",
  "https://jcmcsiit.ac.in/Rules%20and%20Regulation.php": "/academics/instructions/rules-regulations",

  // Facilities
  "https://jcmcsiit.ac.in/ccf.php": "/facilities/internet-lab",
  "https://jcmcsiit.ac.in/library.php": "/facilities/library",
  "https://jcmcsiit.ac.in/workshop.php": "/facilities/workshop",
  "https://jcmcsiit.ac.in/Conference%20Hall.php": "/facilities/conference-hall",
  "https://jcmcsiit.ac.in/hostel.php": "/facilities/hostel",
  "https://jcmcsiit.ac.in/Canteen.php": "/facilities/canteen",
  "https://jcmcsiit.ac.in/transportation.php": "/facilities/transportation",

  // Admission
  "https://jcmcsiit.ac.in/application.php": "/admission/application-form",
  "https://jcmcsiit.ac.in/E-Brouchure.php": "/admission/e-brochure",
  "https://jcmcsiit.ac.in/fee.php": "/admission/fees-scholarships",

  // Student Support
  "https://jcmcsiit.ac.in/CGPU.php": "/student-support/placement",
  "https://jcmcsiit.ac.in/Students%20Council.php": "/student-support/students-council",
  "https://jcmcsiit.ac.in/Physical%20education.php": "/student-support/sports",
  "https://jcmcsiit.ac.in/Activities%20Committee.php": "/student-support/arts-committee",
  "https://jcmcsiit.ac.in/DAC.php": "/student-support/grievance/dac",
  "https://jcmcsiit.ac.in/SGRC.php": "/student-support/grievance/sgrc",
  "https://jcmcsiit.ac.in/Internal%20Complaints%20Committee.php": "/student-support/grievance/icc",
  "https://jcmcsiit.ac.in/grievance.php": "/student-support/grievance/online",
  "https://jcmcsiit.ac.in/Energy%20Club.php": "/student-support/clubs/energy",
  "https://jcmcsiit.ac.in/Planation%20Club.php": "/student-support/clubs/plantations",
  "https://jcmcsiit.ac.in/Alumni.php": "/student-support/clubs/alumni",
  "https://jcmcsiit.ac.in/Counseling%20centre.php": "/student-support/clubs/counselling",
  "https://jcmcsiit.ac.in/scm.php": "/student-support/clubs/scm",
  "https://jcmcsiit.ac.in/PTA.php": "/student-support/clubs/pta",
  "https://jcmcsiit.ac.in/Scholarships.php": "/student-support/clubs/scholarship",

  // Cells
  "https://jcmcsiit.ac.in/NSS.php": "/cells/nss",
  "https://jcmcsiit.ac.in/IIC.php": "/cells/iic",
  "https://jcmcsiit.ac.in/IIIC.php": "/cells/iiic",
  "https://jcmcsiit.ac.in/IQAC.php": "/cells/iqac",
  "https://jcmcsiit.ac.in/Anti%20ragging%20Cell.php": "/cells/anti-ragging",
  "https://jcmcsiit.ac.in/GRC.php": "/cells/grievance-faculty",
  "https://jcmcsiit.ac.in/Anti%20Narcotic%20Cell.php": "/cells/anti-narcotic",
  "https://jcmcsiit.ac.in/Women%20Empowerment%20Cell.php": "/cells/women-empowerment",
  "https://jcmcsiit.ac.in/Research%20and%20Development%20Cell.php": "/cells/research-development"
};

function formatContent(markdown) {
  if (!markdown || markdown.trim() === '') return '<p className="text-slate-500 italic">No content available.</p>';
  
  // Convert basic markdown to React TSX structure safely
  const lines = markdown.split('\n');
  let jsxContent = '';
  
  let inList = false;
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Replace internal img urls
    line = line.replace(/!\[.*?\]\((.*?)\)/g, (match, url) => {
      return ''; // Strip images to prevent raw URL issues, we can handle them manually later
    });

    if (line.startsWith('# ')) {
      jsxContent += `<h1 className="text-3xl font-bold mt-8 mb-4">${line.substring(2)}</h1>\n`;
    } else if (line.startsWith('## ')) {
      jsxContent += `<h2 className="text-2xl font-bold mt-8 mb-4">${line.substring(3)}</h2>\n`;
    } else if (line.startsWith('### ')) {
      jsxContent += `<h3 className="text-xl font-bold mt-6 mb-3">${line.substring(4)}</h3>\n`;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        jsxContent += `<ul className="list-disc pl-6 mb-4 space-y-2">\n`;
        inList = true;
      }
      jsxContent += `<li>${line.substring(2)}</li>\n`;
    } else {
      if (inList) {
        jsxContent += `</ul>\n`;
        inList = false;
      }
      // Escape braces for React
      const escaped = line.replace(/{/g, '&#123;').replace(/}/g, '&#125;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      jsxContent += `<p className="mb-4">${escaped}</p>\n`;
    }
  }
  
  if (inList) {
    jsxContent += `</ul>\n`;
  }
  
  return jsxContent;
}

async function main() {
  const seedPath = path.join(process.cwd(), 'content', 'deep_crawl_seed.json');
  const data = JSON.parse(await fs.readFile(seedPath, 'utf8'));
  
  let count = 0;
  for (const page of data.pages) {
    const route = routeMap[page.url];
    if (!route) continue;
    
    // We skip Profile since we did it manually
    if (route === '/about/college/profile') continue;
    
    const pagePath = path.join(process.cwd(), 'src', 'app', route, 'page.tsx');
    
    try {
      await fs.access(pagePath);
      
      const title = page.title.replace(/'/g, "\\'");
      const content = formatContent(page.markdown);
      
      const fileContent = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title} | JCMC SIIT',
  description: 'Information about ${title}',
};

export default function Page() {
  return (
    <div className="pt-32 pb-24 layout-grid min-h-[60vh]">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">${title}</h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="prose prose-lg prose-slate max-w-none text-justify">
            ${content}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
      await fs.writeFile(pagePath, fileContent);
      console.log(`[UPDATED] ${route}`);
      count++;
    } catch (e) {
      console.error(`[ERROR] Could not update ${route}: ${e.message}`);
    }
  }
  console.log(`Successfully populated ${count} pages.`);
}

main().catch(console.error);
