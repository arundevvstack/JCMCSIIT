import fs from 'fs/promises';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
import 'dotenv/config';

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Comprehensive 25-Section Zod Schema
const FacultySchema = z.object({
  name: z.string().describe("Full name of the faculty member. Preserve exact spelling."),
  designation: z.string().optional().describe("E.g., Assistant Professor, Associate Professor, Head of Department"),
  department: z.string().optional().describe("Department name"),
  email: z.string().optional(),
  phone: z.string().optional(),
  
  highestQualification: z.string().optional(),
  totalExperience: z.string().optional(),
  officeLocation: z.string().optional(),
  primarySpecialization: z.string().optional(),
  biography: z.string().optional().describe("A brief summary or biography of the faculty member."),
  careerObjective: z.string().optional(),
  website: z.string().optional(),

  academicQualifications: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    university: z.string().optional(),
    year: z.string(),
    grade: z.string().optional()
  })).optional(),

  areasOfExpertise: z.array(z.string()).optional(),
  researchInterests: z.array(z.string()).optional(),
  areasOfInterest: z.array(z.string()).optional(),

  teachingExperience: z.array(z.object({
    institution: z.string().optional(),
    designation: z.string().optional(),
    duration: z.string()
  })).optional(),
  
  industryExperience: z.array(z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    duration: z.string()
  })).optional(),

  subjectsHandled: z.array(z.string()).optional(),
  
  technicalSkills: z.object({
    languages: z.array(z.string()).optional(),
    software: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    laboratories: z.array(z.string()).optional(),
    platforms: z.array(z.string()).optional()
  }).optional(),

  academicProjects: z.object({
    ugProjects: z.array(z.string()).optional(),
    pgProjects: z.array(z.string()).optional(),
    btechProjects: z.array(z.string()).optional(),
    mtechThesis: z.array(z.string()).optional(),
    phdResearch: z.array(z.string()).optional(),
    phdTopic: z.array(z.string()).optional(),
    researchProjects: z.array(z.string()).optional()
  }).optional(),

  publications: z.object({
    journalPapers: z.array(z.object({
      title: z.string(),
      journal: z.string(),
      year: z.string(),
      link: z.string().optional()
    })).optional(),
    conferencePapers: z.array(z.object({
      title: z.string(),
      conference: z.string(),
      year: z.string(),
      link: z.string().optional()
    })).optional(),
    books: z.array(z.string()).optional(),
    bookChapters: z.array(z.string()).optional(),
    patents: z.array(z.string()).optional()
  }).optional(),

  researchActivities: z.array(z.string()).optional(),
  
  fdps: z.array(z.string()).optional(),
  workshops: z.array(z.string()).optional(),
  seminars: z.array(z.string()).optional(),
  trainingProgrammes: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  professionalMemberships: z.array(z.string()).optional(),

  administrativeResponsibilities: z.object({
    department: z.array(z.string()).optional(),
    college: z.array(z.string()).optional(),
    university: z.array(z.string()).optional(),
    committees: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
    placementResponsibilities: z.array(z.string()).optional(),
    labInchargeResponsibilities: z.array(z.string()).optional(),
    staffAdvisorRoles: z.array(z.string()).optional(),
    coordinatorRoles: z.array(z.string()).optional(),
    examCell: z.array(z.string()).optional(),
    nba: z.array(z.string()).optional(),
    naac: z.array(z.string()).optional(),
    iqac: z.array(z.string()).optional(),
    iedc: z.array(z.string()).optional(),
    innovationCell: z.array(z.string()).optional(),
    kdisc: z.array(z.string()).optional(),
    nss: z.array(z.string()).optional()
  }).optional(),

  studentGuidance: z.object({
    ugProjects: z.array(z.string()).optional(),
    pgProjects: z.array(z.string()).optional(),
    researchGuidance: z.array(z.string()).optional(),
    mentoring: z.array(z.string()).optional()
  }).optional(),

  awards: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  rankHolders: z.array(z.string()).optional(),
  paperPresentations: z.array(z.string()).optional(),
  consultancy: z.array(z.string()).optional(),
  extensionActivities: z.array(z.string()).optional(),
  conferences: z.array(z.string()).optional(),
  
  googleScholar: z.string().optional(),
  orcid: z.string().optional(),
  researchGate: z.string().optional(),
  linkedin: z.string().optional()
});

/**
 * Clean string for fuzzy matching (lowercase, remove spaces, underscores, hyphens, non-alphanumeric)
 */
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fuzzy matches faculty name to image filename
 */
async function findFacultyImage(facultyName) {
  const imagesDir = path.join(process.cwd(), 'public', 'Faculty', 'Final');
  let bestMatch = null;

  try {
    async function searchDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await searchDir(fullPath);
        } else if (entry.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
          const fileNameWithoutExt = path.basename(entry.name, path.extname(entry.name));
          
          const normName = normalizeString(facultyName);
          const normFile = normalizeString(fileNameWithoutExt);

          if (normName.length > 3 && (normFile.includes(normName) || normName.includes(normFile))) {
            const relativePath = '/Faculty/Final/' + path.relative(imagesDir, fullPath).replace(/\\/g, '/');
            bestMatch = relativePath;
          }
        }
      }
    }
    await searchDir(imagesDir);
  } catch (err) {
    console.error("Error searching images:", err.message);
  }

  return bestMatch || '/Faculty/default_avatar.png';
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function extractFacultyDataFromDocument(filePath) {
  try {
    let textContent = "";
    
    if (filePath.toLowerCase().endsWith('.pdf')) {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      textContent = data.text;
    } else if (filePath.toLowerCase().endsWith('.docx') || filePath.toLowerCase().endsWith('.doc')) {
      const result = await mammoth.extractRawText({ path: filePath });
      textContent = result.value;
    } else {
      console.log(`Unsupported file type for ${filePath}`);
      return null;
    }
    
    console.log(`Extracting data from ${path.basename(filePath)}...`);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing in .env.local");
    }

    const { object } = await generateObject({
      model: openai('gpt-4o'), // Used gpt-4o for better comprehensive reading
      schema: FacultySchema,
      prompt: `Extract ALL information from the following faculty profile document into the structured Zod JSON format.
      
      CRITICAL INSTRUCTIONS:
      1. READ EVERY PAGE: Parse the entire document from beginning to end. Do not stop early.
      2. NEVER TRUNCATE LISTS: If a list has 30 publications, extract all 30. If there are 20 FDPs, extract all 20. Do not summarize or limit long lists.
      3. EXTRACT ALL SECTIONS: Look out for small or obscure sections like NAAC responsibilities, NBA, Lab In-charge, Placement Coordinators, B.Tech/M.Tech/PhD Projects, Rank holders, etc.
      4. DO NOT INVENT DATA: Only populate fields that explicitly exist in the text.
      5. PRESERVE TITLES: Maintain original publication titles, project titles, award names, and institution names exactly.
      
      TEXT:
      ${textContent}`
    });

    return object;
  } catch (error) {
    console.error(`Error processing Document ${filePath}:`, error.message);
    return null;
  }
}

async function processAllDocuments() {
  console.log("Starting Advanced Faculty Data Extraction (25 Sections)...");
  
  const docsDir = path.join(process.cwd(), 'public', 'Faculty');
  
  const files = await fs.readdir(docsDir);
  const profileDocs = files.filter(f => f.match(/\.(pdf|doc|docx)$/i));
  
  if (profileDocs.length === 0) {
    console.log(`No Faculty Profile documents found in ${docsDir}.`);
    return;
  }

  for (const file of profileDocs) {
    console.log(`\n--- Processing ${file} ---`);
    const filePath = path.join(docsDir, file);
    
    const extractedData = await extractFacultyDataFromDocument(filePath);
    if (!extractedData || !extractedData.name) {
      console.log(`Failed to extract data or find name for ${file}. Skipping.`);
      continue;
    }

    console.log(`Successfully extracted data for: ${extractedData.name}`);

    const imageUrl = await findFacultyImage(extractedData.name);
    const slug = generateSlug(extractedData.name);
    
    const { 
      name, designation, email, department, 
      ...profileData 
    } = extractedData;

    const payload = {
      id: slug,
      slug,
      name,
      designation: designation || null,
      email: email || null,
      department_id: department || "engineering",
      image_url: imageUrl,
      departments: {
        name: department || "Engineering",
        slug: department || "engineering"
      },
      profile_data: profileData
    };

    const fileContent = `import { Faculty } from "@/types/faculty";\n\nexport const ${slug.replace(/-/g, '')}Data: Faculty = ${JSON.stringify(payload, null, 2)};\n`;
    
    const outPath = path.join(process.cwd(), 'src', 'data', 'faculty', `${slug}.ts`);
    await fs.writeFile(outPath, fileContent, 'utf-8');
    
    console.log(`Successfully generated ${outPath}`);
  }
  
  console.log("\nPipeline finished.");
}

processAllDocuments().catch(console.error);
