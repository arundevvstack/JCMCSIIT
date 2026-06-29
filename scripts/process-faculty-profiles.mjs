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
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Zod Schema for Faculty Profile Data Extraction
const FacultySchema = z.object({
  name: z.string().describe("The full name of the faculty member. Preserve exact spelling."),
  designation: z.string().optional().describe("Current official designation (e.g. Assistant Professor)."),
  department: z.string().optional().describe("Department the faculty belongs to (e.g. Computer Science and Engineering)."),
  email: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional().describe("A brief summary or biography of the faculty member."),
  highestQualification: z.string().optional(),
  specialization: z.string().optional().describe("Areas of Specialization"),
  researchInterests: z.array(z.string()).optional(),
  teachingExperience: z.string().optional(),
  industryExperience: z.string().optional(),
  professionalExperience: z.string().optional(),
  projects: z.array(z.string()).optional(),
  publications: z.array(z.object({
    title: z.string(),
    journal: z.string(),
    year: z.string(),
    link: z.string().optional()
  })).optional(),
  conferencePapers: z.array(z.string()).optional(),
  patents: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  fdps: z.array(z.string()).optional().describe("Faculty Development Programmes"),
  workshops: z.array(z.string()).optional(),
  trainingProgrammes: z.array(z.string()).optional(),
  technicalSkills: z.array(z.string()).optional(),
  professionalMemberships: z.array(z.string()).optional(),
  academicResponsibilities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  currentResponsibilities: z.array(z.string()).optional(),
  languagesKnown: z.array(z.string()).optional(),
  officeLocation: z.string().optional(),
  googleScholar: z.string().optional(),
  orcid: z.string().optional(),
  researchGate: z.string().optional(),
  linkedin: z.string().optional(),
  qualificationTimeline: z.array(z.object({
    year: z.string(),
    degree: z.string(),
    institution: z.string()
  })).optional()
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
  const imagesDir = path.join(process.cwd(), 'public', 'Faculty');
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

          // Simple containment check. If the file name contains the faculty's first or last name
          // or vice versa.
          if (normName.length > 3 && (normFile.includes(normName) || normName.includes(normFile))) {
            // Get relative path for web
            const relativePath = '/Faculty/' + path.relative(imagesDir, fullPath).replace(/\\/g, '/');
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

/**
 * Reads a document (PDF, DOCX) and extracts structured data via OpenAI
 */
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
    
    // We pass the raw text to OpenAI to parse into JSON
    console.log(`Extracting data from ${path.basename(filePath)} using OpenAI...`);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is missing in .env.local");
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'), // fast and cheap for extraction
      schema: FacultySchema,
      prompt: `Extract the faculty profile information from the following text. 
      Only populate fields that exist in the text. Do not invent information. 
      Maintain original spelling and formatting where appropriate.\n\n${textContent}`
    });

    return object;
  } catch (error) {
    console.error(`Error processing Document ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Helper to generate a URL-friendly slug
 */
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

/**
 * Looks up the department ID in the database using fuzzy matching
 */
async function getDepartmentId(departmentName) {
  if (!departmentName) return null;
  
  const { data, error } = await supabase.from('departments').select('id, name');
  if (error || !data) return null;

  const normTarget = normalizeString(departmentName);
  for (const dept of data) {
    const normDbName = normalizeString(dept.name);
    if (normTarget.includes(normDbName) || normDbName.includes(normTarget)) {
      return dept.id;
    }
  }
  
  // If not found, look for acronyms (e.g., CSE)
  if (normTarget.includes('computer')) return data.find(d => d.name.includes('Computer'))?.id;
  if (normTarget.includes('electronics')) return data.find(d => d.name.includes('Electronics'))?.id;
  if (normTarget.includes('electrical')) return data.find(d => d.name.includes('Electrical'))?.id;
  if (normTarget.includes('civil')) return data.find(d => d.name.includes('Civil'))?.id;
  if (normTarget.includes('mechanical')) return data.find(d => d.name.includes('Mechanical'))?.id;

  return null;
}

async function processAllDocuments() {
  console.log("Starting Faculty Profile Document Data Extraction Pipeline...");
  
  // Directory where Documents are placed. Create if missing.
  const docsDir = path.join(process.cwd(), 'public', 'Faculty_Profiles');
  await fs.mkdir(docsDir, { recursive: true }).catch(() => {});
  
  const files = await fs.readdir(docsDir);
  const profileDocs = files.filter(f => f.match(/\.(pdf|doc|docx)$/i));
  
  if (profileDocs.length === 0) {
    console.log(`No Faculty Profile documents found in ${docsDir}.`);
    console.log("Please upload Faculty Profile documents (PDF, DOC, DOCX) to this directory and run again.");
    return;
  }

  for (const file of profileDocs) {
    console.log(`\n--- Processing ${file} ---`);
    const filePath = path.join(docsDir, file);
    
    // 1. Extract data
    const extractedData = await extractFacultyDataFromDocument(filePath);
    if (!extractedData || !extractedData.name) {
      console.log(`Failed to extract data or find name for ${file}. Skipping.`);
      continue;
    }

    console.log(`Successfully extracted data for: ${extractedData.name}`);

    // 2. Find photo match
    const imageUrl = await findFacultyImage(extractedData.name);
    console.log(`Matched image: ${imageUrl}`);

    // 3. Resolve Department ID
    const departmentId = await getDepartmentId(extractedData.department);

    // 4. Prepare Database Payload
    const slug = generateSlug(extractedData.name);
    
    // Separate primary fields from profile_data
    const { 
      name, designation, email, phone, bio, department, 
      ...profileData 
    } = extractedData;

    if (phone) profileData.phone = phone; // add phone to profile_data

    const payload = {
      name,
      slug,
      designation: designation || null,
      email: email || null,
      image_url: imageUrl,
      bio: bio || null,
      department_id: departmentId || null,
      profile_data: profileData
    };

    // 5. Upsert into Database
    const { data, error } = await supabase
      .from('faculty')
      .upsert({ ...payload, slug }, { onConflict: 'slug' })
      .select()
      .single();

    if (error) {
      console.error(`Error saving ${name} to DB:`, error.message);
    } else {
      console.log(`Successfully saved ${name} to database (ID: ${data.id})`);
    }
  }
  
  console.log("\nPipeline finished.");
}

processAllDocuments().catch(console.error);
