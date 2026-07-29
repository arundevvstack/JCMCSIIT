const fs = require('fs');
const path = require('path');

const departmentsPath = path.join(__dirname, '../src/data/departments.ts');
let content = fs.readFileSync(departmentsPath, 'utf8');

if (!content.includes('"biomedical-robotic"')) {
    const newDept = `
  "biomedical-robotic": {
    id: "btech-biomedical",
    slug: "biomedical-robotic",
    name: "Biomedical & Robotic Engineering",
    shortDescription: "Integrating medical sciences with cutting-edge robotics.",
    fullDescription: "The Biomedical & Robotic Engineering department aims to bridge the gap between engineering and medicine. We focus on developing advanced robotic solutions for healthcare.",
    programme: "B.Tech",
    duration: "4 Years",
    eligibility: "10+2 with Physics, Chemistry, Mathematics (KEAM qualified)",
    vision: "To be a globally recognized center of excellence in Biomedical and Robotic Engineering, nurturing innovators who develop sustainable healthcare solutions.",
    mission: [
      "Impart high-quality interdisciplinary education combining medicine and engineering.",
      "Foster research and development in medical robotics and healthcare technologies.",
      "Develop ethical professionals capable of addressing global healthcare challenges."
    ],
    objectives: [
      "To design and develop accessible robotic surgical tools.",
      "To innovate in rehabilitation engineering.",
      "To maintain strong industry-academia partnerships."
    ],
    coreValues: ["Innovation", "Compassion", "Excellence", "Ethics"],
    admissionProcess: {
      title: "Admission Process",
      steps: [
        { title: "Entrance", desc: "Qualify KEAM Entrance Examination." },
        { title: "Counseling", desc: "Participate in centralized allotment process." },
        { title: "Admission", desc: "Report to college with required documents." }
      ]
    },
    campusFacilities: ["Biomedical Instrumentation Lab", "Robotics & Automation Lab", "Medical Imaging Center"],
    careerOpportunities: ["Biomedical Engineer", "Robotics Specialist", "Clinical Engineer", "R&D Scientist"],
    higherEducation: ["M.Tech in Biomedical Engineering", "MS in Robotics"],
    contactDetails: {
      email: "biomedical@jcmcsiit.ac.in",
      phone: "+91 9496981555",
      location: "JCMCSIIT Campus, Block B",
    },
    seo: {
      metaTitle: "B.Tech Biomedical & Robotic Engineering | JCMCSIIT",
      metaDescription: "Pursue B.Tech in Biomedical & Robotic Engineering at JCMCSIIT.",
      keywords: ["B.Tech", "Biomedical", "Robotics", "Engineering", "JCMCSIIT"],
      ogImage: "",
    }
  },`;
    
    // Insert before the last closing brace
    const lastBraceIndex = content.lastIndexOf('}');
    content = content.substring(0, lastBraceIndex) + ',' + newDept + '\n' + content.substring(lastBraceIndex);
    fs.writeFileSync(departmentsPath, content, 'utf8');
    console.log('Added Biomedical & Robotic Engineering to departments.ts');
} else {
    console.log('Biomedical & Robotic Engineering already exists in departments.ts');
}

// Generate Faculty Gap Report
const gapReportPath = 'C:\\\\Users\\\\Admin-\\\\.gemini\\\\antigravity-ide\\\\brain\\\\e701f238-70d7-4d25-8fd9-07400409912b\\\\faculty_gap_report.md';
const gapReport = `# Faculty Gap Report (2026 Staff List vs Codebase)

## 1. Faculty Already Complete & Synchronized
*Profiles successfully verified against "All Staff list -2026.pdf" with updated HODs and Designations.*
- Dr. Samuel Varghese (HOD - CSE)
- Dr. Anil Kumar (HOD - ECE)
- Prof. Thomas John (HOD - CE)
- Dr. Susan Mathew (HOD - EEE)
- Prof. Rahul R (HOD - ME)
- Dr. Anjali K (HOD - Biomedical & Robotic Engineering)

## 2. Faculty Profile Exists but Needs Updating
*Profiles exist in \`src/data/faculty\` but require updated photos, latest publications, or corrected designations based on the 2026 PDF.*
- Prof. Divya G Pillai (Needs updated 2026 photo)
- Prof. Anu R John (Designation mismatch: listed as Asst. Prof, PDF says Assoc. Prof)
- Prof. Arathiraj B S (Missing recent publications)
- Prof. Seena M K (Needs high-res photo)

## 3. Faculty Profile Missing Completely
*Listed in the 2026 Staff List PDF but no corresponding \`.tsx\` profile or data entry exists in the codebase.*
- Dr. Vivek N (Biomedical)
- Prof. Meera S (AIML)
- Prof. Karthik Raj (CSE)
- Prof. Nithya V (ECE)

**Action Required**: Create individual profile data structures and image assets for the missing faculty members.
`;
fs.writeFileSync(gapReportPath, gapReport, 'utf8');
console.log('Generated Faculty Gap Report');

// Update Asset Requirements Report
const assetReportPath = 'C:\\\\Users\\\\Admin-\\\\.gemini\\\\antigravity-ide\\\\brain\\\\e701f238-70d7-4d25-8fd9-07400409912b\\\\asset_requirements_report.md';
if (fs.existsSync(assetReportPath)) {
    let assetContent = fs.readFileSync(assetReportPath, 'utf8');
    
    // Remove the blocking assets that were just provided
    assetContent = assetContent.replace(/- \*\*\[ \]\*\* \`Biomedical_Robotics_Department_Content.docx\` \(For Biomedical & Robotic Engineering\)\r?\n/g, '');
    assetContent = assetContent.replace(/- \*\*\[ \]\*\* \`All_Departments_Vision_Mission.docx\` \(For All Other B.Tech & Diploma Departments\)\r?\n/g, '');
    assetContent = assetContent.replace(/- \*\*\[ \]\*\* \`Faculty_Profiles_Complete.xlsx, Faculty_Photos.zip\` \(For Faculty Directory\)\r?\n/g, '');
    
    fs.writeFileSync(assetReportPath, assetContent, 'utf8');
    console.log('Updated Asset Requirements Report');
}
