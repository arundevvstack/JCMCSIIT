const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse').PDFParse;

const DIR = path.join(__dirname, '../public/Faculty/Final');
const OUTPUT = path.join(__dirname, '../scratch/raw_faculty_text.json');

async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (ext === '.doc') {
      return fs.readFileSync(filePath, 'latin1').replace(/[^\x20-\x7E]/g, ' '); 
    } else {
      return null; // ignore jpg etc
    }
  } catch (err) {
    console.error(`Error reading ${path.basename(filePath)}:`, err.message);
    return "";
  }
}

async function main() {
  if (!fs.existsSync(DIR)) {
    console.error("Directory not found:", DIR);
    return;
  }
  
  const files = fs.readdirSync(DIR).filter(f => !f.startsWith('~'));
  const allTexts = [];

  for (const file of files) {
    const filePath = path.join(DIR, file);
    const text = await extractText(filePath);
    if (text !== null) {
      console.log("Processed", file);
      allTexts.push({
        file,
        text: text.trim()
      });
    }
  }

  if (!fs.existsSync(path.dirname(OUTPUT))) {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  }

  fs.writeFileSync(OUTPUT, JSON.stringify(allTexts, null, 2));
  console.log(`Saved raw text for ${allTexts.length} files to ${OUTPUT}`);
}

main();
