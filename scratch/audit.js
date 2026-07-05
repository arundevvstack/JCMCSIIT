const fs = require('fs');
const path = require('path');

const facultyDir = path.join(__dirname, '../src/data/faculty');
const imagesDir = path.join(__dirname, '../public/Faculty/Final');

const files = fs.readdirSync(facultyDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const imageFiles = fs.readdirSync(imagesDir);

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z]/g, '');
}

console.log('--- FACULTY AUDIT REPORT ---');
let missingImages = [];
let validFaculties = [];

files.forEach(file => {
  const filePath = path.join(facultyDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Use non-capturing quotes around keys, flexible matching
  const slugMatch = content.match(/["']?slug["']?:\s*['"]([^'"]+)['"]/);
  const nameMatch = content.match(/["']?name["']?:\s*['"]([^'"]+)['"]/);
  const imageMatch = content.match(/["']?image_url["']?:\s*['"]([^'"]+)['"]/);
  
  if (!slugMatch || !nameMatch || !imageMatch) {
    console.log('[!] ERROR PARSING:', file, 'Slug:', !!slugMatch, 'Name:', !!nameMatch, 'Image:', !!imageMatch);
    return;
  }
  
  const slug = slugMatch[1];
  const name = nameMatch[1];
  let imageUrl = imageMatch[1];
  
  let exists = false;
  let recommendedImage = null;
  
  if (imageUrl) {
    let relativeUrl = imageUrl.replace(/^\//, '');
    const localImagePath = path.join(__dirname, '..', 'public', relativeUrl);
    exists = fs.existsSync(localImagePath);
  }

  if (!exists) {
    const normName = normalizeName(name);
    const possibleImages = imageFiles.filter(img => {
      const normImg = normalizeName(img.split('.')[0]);
      return normImg === normName || normImg.includes(normName) || normName.includes(normImg);
    });
    if (possibleImages.length > 0) {
      recommendedImage = '/Faculty/Final/' + possibleImages[0];
    }
    missingImages.push({ file, name, slug, currentUrl: imageUrl, recommendedImage });
    console.log(`[X] IMAGE MISSING: ${name} (File: ${file})`);
    console.log(`    Current URL: ${imageUrl}`);
    console.log(`    Recommended: ${recommendedImage}`);
  } else {
    validFaculties.push({ file, name, slug });
    console.log(`[OK] ${name} (Image verified: ${imageUrl})`);
  }
});

console.log('----------------------------');
console.log(`Total Valid: ${validFaculties.length}`);
console.log(`Total Missing Images: ${missingImages.length}`);

if (missingImages.length > 0) {
  fs.writeFileSync(path.join(__dirname, 'missing_images.json'), JSON.stringify(missingImages, null, 2));
}
