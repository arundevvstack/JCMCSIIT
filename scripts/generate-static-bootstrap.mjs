import fs from 'fs/promises';
import path from 'path';

const INITIAL_FACULTY = [
  "Divya G Pillai",
  "Alan Don Benny",
  "Anoja C M",
  "Nitya V Arnold",
  "Sarika B C",
  "Neethu S S",
  "Nibin Sabu",
  "Swapna V",
  "Anjana S P",
  "Anu R John",
  "Arathiraj B S",
  "Arathy Krishnan",
  "Sangeetha John C S",
  "Shehin N",
  "Ardra B"
];

function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

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

          if (normName.length > 3 && (normFile.includes(normName) || normName.includes(normFile))) {
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

async function main() {
  const facultyList = [];

  for (const name of INITIAL_FACULTY) {
    const slug = generateSlug(name);
    const image_url = await findFacultyImage(name);
    
    // Create static mock object mapping to Faculty interface
    facultyList.push({
      id: slug,
      name: name,
      slug: slug,
      designation: "Faculty Member", // Placeholder since we don't have docs yet
      department_id: "engineering", // Fallback
      image_url: image_url,
      departments: {
        name: "Engineering",
        slug: "engineering"
      },
      profile_data: {}
    });
  }

  const outputContent = `import { Faculty } from "@/types/faculty";

export const facultyData: Faculty[] = ${JSON.stringify(facultyList, null, 2)};
`;

  const outputPath = path.join(process.cwd(), 'src', 'data', 'faculty.ts');
  await fs.writeFile(outputPath, outputContent, 'utf-8');
  console.log("Bootstrap static data written to src/data/faculty.ts");
}

main().catch(console.error);
