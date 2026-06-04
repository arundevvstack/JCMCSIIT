const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, 'src', 'app');

const routeMap = {
  'departments': 'academics/departments',
  'hostel': 'facilities/hostel',
  'library': 'facilities/library',
  'nss': 'campus-life/nss',
  'cells/nss': 'campus-life/nss',
  'cells/iic': 'research/iic',
  'cells/iqac': 'about/iqac',
  'admission': 'admissions',
  'events': 'news-events/events',
  'news': 'news-events/news',
  'gallery': 'news-events/gallery',
  'campus': 'about/campus-overview',
  'faculty': 'academics/faculty',
  'courses': 'academics/courses',
  'student-support': 'campus-life/student-support',
  'alumni': 'campus-life/alumni',
  'alumni-meet': 'campus-life/alumni-meet',
  'anti-ragging': 'about/anti-ragging',
  'emergency': 'about/emergency',
  'careers': 'about/careers',
  'faculty-positions': 'about/faculty-positions',
  'international': 'academics/international',
  'payment': 'admissions/payment',
  'research': 'research',
  'resources': 'downloads/resources',
};

// 1. Move Directories safely for Windows
for (const [oldRoute, newRoute] of Object.entries(routeMap)) {
  const oldPath = path.join(APP_DIR, oldRoute);
  const newPath = path.join(APP_DIR, newRoute);
  
  if (fs.existsSync(oldPath) && oldPath !== newPath) {
    console.log(`Moving ${oldRoute} -> ${newRoute}`);
    
    // Create new path if it doesn't exist
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath, { recursive: true });
    }
    
    // Copy all contents recursively
    fs.cpSync(oldPath, newPath, { recursive: true });
    
    // Delete the old directory
    fs.rmSync(oldPath, { recursive: true, force: true });
  }
}

// 2. Update all internal links in .tsx files
function updateLinks(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateLinks(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const [oldRoute, newRoute] of Object.entries(routeMap)) {
        if (oldRoute === newRoute) continue;
        
        // Replace exact href strings: href="/oldRoute" -> href="/newRoute"
        const exactRegex = new RegExp(`href=(["'])/${oldRoute}(/|["'])`, 'g');
        if (exactRegex.test(content)) {
          content = content.replace(exactRegex, `href=$1/${newRoute}$2`);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated links in ${fullPath}`);
      }
    }
  }
}

console.log("Updating internal links...");
updateLinks(path.join(__dirname, 'src'));
const componentsDir = path.join(__dirname, 'components');
if (fs.existsSync(componentsDir)) {
    updateLinks(componentsDir);
}
console.log("Done.");
