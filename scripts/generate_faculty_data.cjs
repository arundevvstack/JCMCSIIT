const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../scratch/raw_faculty_text.json');
const rawData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
const outDir = path.join(__dirname, '../src/data/faculty');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function getSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function parseText(text, filename) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Basic heuristics
  let name = filename.replace(/\.(docx|pdf|doc)$/i, '').replace(/profile/i, '').replace(/removed/i, '').trim();
  // Cleanup name
  name = name.replace(/^(Mr\.|Mrs\.|Dr\.|Mr|Mrs|Ms)\s*/i, '').replace(/,+$/, '').trim();

  const slug = getSlug(name);
  
  // Try to find email
  let email = '';
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) email = emailMatch[0];

  // Try to find phone
  let phone = '';
  const phoneMatch = text.match(/(?:\+91|0)?[ -]*\d{10}/);
  if (phoneMatch) phone = phoneMatch[0];

  let designation = 'Assistant Professor'; // Default
  if (text.match(/Associate Professor/i)) designation = 'Associate Professor';
  else if (text.match(/Professor/i) && !text.match(/Assistant Professor/i)) designation = 'Professor';
  else if (text.match(/HOD/i) || text.match(/Head of Department/i)) designation = 'HOD & Professor';

  let department = { name: 'Computer Science & Engineering', slug: 'cse' };
  if (text.match(/Civil/i)) department = { name: 'Civil Engineering', slug: 'civil' };
  else if (text.match(/Mechanical/i)) department = { name: 'Mechanical Engineering', slug: 'me' };
  else if (text.match(/Electrical/i) || text.match(/EEE/i)) department = { name: 'Electrical & Electronics Engineering', slug: 'eee' };
  else if (text.match(/Electronics/i) || text.match(/ECE/i)) department = { name: 'Electronics & Communication Engineering', slug: 'ece' };
  
  let qualification = '';
  if (text.match(/Ph\.?D/i)) qualification = 'Ph.D';
  else if (text.match(/M\.?Tech/i)) qualification = 'M.Tech';
  else if (text.match(/M\.?E\./i)) qualification = 'M.E.';
  else if (text.match(/B\.?Tech/i)) qualification = 'B.Tech';

  // Find experience
  let exp = '';
  const expMatch = text.match(/(\d+)\s*(?:years|yrs)/i);
  if (expMatch) exp = expMatch[1] + ' Years';

  // Section extraction
  let sections = {
    publications: [],
    researchInterests: [],
    subjectsHandled: [],
    workshops: []
  };

  let currentSection = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    
    if (lower.includes('publication') || lower.includes('journal')) { currentSection = 'publications'; continue; }
    if (lower.includes('research interest') || lower.includes('areas of interest')) { currentSection = 'researchInterests'; continue; }
    if (lower.includes('subject') && lower.includes('handle')) { currentSection = 'subjectsHandled'; continue; }
    if (lower.includes('workshop') || lower.includes('seminar') || lower.includes('fdp')) { currentSection = 'workshops'; continue; }
    if (lower.match(/^education|^academic qualification/)) { currentSection = 'education'; continue; }
    
    if (currentSection === 'publications' && line.length > 20) {
      sections.publications.push({ title: line, journal: '', year: '' });
    }
    if (currentSection === 'researchInterests' && line.length > 5) {
      sections.researchInterests.push(line.replace(/^[-\*•]\s*/, ''));
    }
    if (currentSection === 'subjectsHandled' && line.length > 5) {
      sections.subjectsHandled.push(line.replace(/^[-\*•]\s*/, ''));
    }
    if (currentSection === 'workshops' && line.length > 10) {
      sections.workshops.push(line.replace(/^[-\*•]\s*/, ''));
    }
  }

  // Deduplicate and clean
  sections.researchInterests = [...new Set(sections.researchInterests)].slice(0, 5);
  sections.subjectsHandled = [...new Set(sections.subjectsHandled)].slice(0, 10);
  sections.workshops = [...new Set(sections.workshops)].slice(0, 5);

  return {
    id: slug,
    slug: slug,
    name: name,
    designation: designation,
    department_id: department.slug,
    email: email,
    image_url: '', // will fix later
    departments: department,
    profile_data: {
      highestQualification: qualification || 'M.Tech',
      teachingExperience: exp || '5 Years',
      phone: phone || '',
      officeLocation: '',
      researchInterests: sections.researchInterests.length > 0 ? sections.researchInterests : undefined,
      subjectsHandled: sections.subjectsHandled.length > 0 ? sections.subjectsHandled : undefined,
      publications: sections.publications.length > 0 ? sections.publications : undefined,
      workshops: sections.workshops.length > 0 ? sections.workshops : undefined,
    }
  };
}

const facultyList = [];

for (const item of rawData) {
  try {
    const f = parseText(item.text, item.file);
    facultyList.push(f);
  } catch (e) {
    console.error("Error parsing", item.file, e);
  }
}

// 2. Map images
const imgDir = path.join(__dirname, '../public/Faculty/Final');
const imgFiles = fs.readdirSync(imgDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));

for (const f of facultyList) {
  // Find matching image
  const normName = f.name.toLowerCase().replace(/[^a-z]/g, '');
  let bestMatch = '';
  let bestScore = 0;
  
  for (const img of imgFiles) {
    const normImg = img.toLowerCase().replace(/\.[a-z]+$/, '').replace(/[^a-z]/g, '');
    if (normImg === normName) {
      bestMatch = img;
      break;
    }
    if (normImg.includes(normName) || normName.includes(normImg)) {
      bestMatch = img;
    }
  }
  
  if (bestMatch) {
    f.image_url = '/Faculty/Final/' + bestMatch;
  }
}

// 3. Write individual files
for (const f of facultyList) {
  const tsContent = `import { Faculty } from "@/types/faculty";

export const ${f.slug.replace(/-/g, '')}Data: Faculty = ${JSON.stringify(f, null, 2)};
`;
  fs.writeFileSync(path.join(outDir, f.slug + '.ts'), tsContent);
}

// 4. Write index.ts
const imports = facultyList.map(f => `import { ${f.slug.replace(/-/g, '')}Data } from "./${f.slug}";`).join('\n');
const exportsStr = `\nexport const facultyData: Faculty[] = [\n  ${facultyList.map(f => `${f.slug.replace(/-/g, '')}Data`).join(',\n  ')}\n];\n`;

fs.writeFileSync(path.join(outDir, 'index.ts'), `import { Faculty } from "@/types/faculty";\n` + imports + exports);

console.log("Generated structured data for", facultyList.length, "faculty members!");
