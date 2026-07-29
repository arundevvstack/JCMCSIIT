import os
import glob
import re
import json

faculty_dir = "src/data/faculty"
files = glob.glob(os.path.join(faculty_dir, "*.ts"))

completed = []
basic = []
missing_info = {}
issues = []

for fpath in files:
    if "index.ts" in fpath:
        continue
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()
    
    name_match = re.search(r'"name":\s*"([^"]+)"', content)
    name = name_match.group(1) if name_match else os.path.basename(fpath)
    
    # Check fields robustly
    has_photo = '"image_url":' in content and '""' not in re.search(r'"image_url":\s*("[^"]*")', content).group(1) if re.search(r'"image_url":\s*("[^"]*")', content) else False
    has_bio = '"biography":' in content and '""' not in re.search(r'"biography":\s*("[^"]*")', content).group(1) if re.search(r'"biography":\s*("[^"]*")', content) else False
    
    exp_match = re.search(r'"teachingExperience":\s*(\[.*?\])', content, re.DOTALL)
    has_exp = exp_match and '[]' not in exp_match.group(1).replace(" ", "").replace("\n", "")
    
    missing = []
    if not has_photo: missing.append("Faculty Photograph")
    if not has_exp: missing.append("Experience")
    if '"areasOfInterest":' not in content: missing.append("Areas of Interest")
    if '"publications":' not in content: missing.append("Publications")
    if '"academicProjects":' not in content: missing.append("Research Projects")
    if '"achievements":' not in content: missing.append("Awards")
    if '"administrativeResponsibilities":' not in content: missing.append("Responsibilities")
    if '"fdps":' not in content: missing.append("FDP / Workshop Details")
    if '"professionalMemberships":' not in content: missing.append("Professional Memberships")
    if '"certifications":' not in content: missing.append("Certifications")
    
    if len(missing) > 5:
        basic.append(name)
    else:
        completed.append(name)
        
    if missing:
        missing_info[name] = missing
        
out = {
  "completed": completed,
  "basic": basic,
  "missing_info": missing_info,
  "issues": issues
}
with open("scratch/audit_results.json", "w") as f:
    json.dump(out, f, indent=2)
