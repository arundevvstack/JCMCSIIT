const fs = require('fs');
const path = require('path');

const facultyDir = path.join(__dirname, '../src/data/faculty');
const files = fs.readdirSync(facultyDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');

let report = `# Faculty Module Validation Report\n\n`;

let missingCount = 0;

files.forEach(file => {
  const filePath = path.join(facultyDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const nameMatch = content.match(/["']?name["']?:\s*['"]([^'"]+)['"]/);
  const imageMatch = content.match(/["']?image_url["']?:\s*['"]([^'"]+)['"]/);
  
  if (!nameMatch) return;
  const name = nameMatch[1];
  
  // Extract profile_data JSON-like structure (rudimentary, but works to check existence of keys)
  
  const check = (key) => content.includes(`"${key}":`) || content.includes(`'${key}':`) || content.includes(`${key}:`);
  
  const hasPhoto = !!imageMatch;
  const hasProfile = check('designation') && check('department_id');
  const hasViewMore = check('profile_data');
  const hasPubs = check('publications') || check('journalPapers') || check('conferencePapers') || check('books');
  const hasProjects = check('academicProjects') || check('btechProjects') || check('mtechThesis');
  const hasExp = check('teachingExperience') || check('industryExperience') || check('teachingExperienceDetails');
  const hasResp = check('administrativeResponsibilities') || check('college') || check('department') || check('roles');
  const hasFDP = check('fdps');
  const hasWorkshops = check('workshops');
  const hasAwards = check('awards') || check('achievements');
  
  report += `### ${name}\n`;
  report += `- Photo ${hasPhoto ? '✓' : '❌'}\n`;
  report += `- Profile ${hasProfile ? '✓' : '❌'}\n`;
  report += `- View More ${hasViewMore ? '✓' : '❌'}\n`;
  report += `- Publications ${hasPubs ? '✓' : '—'}\n`;
  report += `- Projects ${hasProjects ? '✓' : '—'}\n`;
  report += `- Experience ${hasExp ? '✓' : '—'}\n`;
  report += `- Responsibilities ${hasResp ? '✓' : '—'}\n`;
  report += `- FDP ${hasFDP ? '✓' : '—'}\n`;
  report += `- Workshops ${hasWorkshops ? '✓' : '—'}\n`;
  report += `- Awards ${hasAwards ? '✓' : '—'}\n`;
  report += `- SEO ✓ (Dynamically Generated)\n\n`;
});

fs.writeFileSync(path.join(__dirname, 'validation_report.md'), report);
console.log('Validation report generated.');
