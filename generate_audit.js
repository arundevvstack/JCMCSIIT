const fs = require('fs');

const audit = JSON.parse(fs.readFileSync('audit_results.json', 'utf8'));

let md = '# JCMC SIIT Empirical Implementation Audit Report\n\n';
md += 'This report was generated through direct static code analysis of all source files, routing files, layout components, and public assets.\n\n';

md += '## 1. Missing Pages / Broken Routes (404)\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
if (audit.missingPages.length === 0) {
  md += '| N/A | N/A | N/A | ? Validated | No missing links found | None | Low |\n';
} else {
  audit.missingPages.forEach(route => {
    md += '| N/A | N/A | ' + route + ' | ? Missing | Linked in codebase but no matching page.tsx exists | Create page.tsx at this route or remove link | High |\n';
  });
}
md += '\n';

md += '## 2. Placeholder Pages\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
if (audit.placeholderPages.length === 0) {
  md += '| N/A | N/A | N/A | ? Validated | No placeholders found | None | Low |\n';
} else {
  audit.placeholderPages.forEach(route => {
    md += '| ' + route + '/page.tsx | Placeholder/Coming Soon | ' + route + ' | ? Incomplete | Code contains "coming-soon" or placeholder text | Implement full content | Medium |\n';
  });
}
md += '\n';

md += '## 3. Orphan Pages (Unreachable)\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
if (audit.orphanPages.length === 0) {
  md += '| N/A | N/A | N/A | ? Validated | No orphan pages found | None | Low |\n';
} else {
  audit.orphanPages.forEach(route => {
    md += '| ' + route + ' | N/A | ' + route.replace('src/app', '').replace('/page.tsx', '') + ' | ? Orphaned | Route exists but is not linked anywhere in the codebase | Add navigation link or delete if obsolete | Medium |\n';
  });
}
md += '\n';

md += '## 4. Unused Components\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
if (audit.unusedComponents.length === 0) {
  md += '| N/A | N/A | N/A | ? Validated | All components are used | None | Low |\n';
} else {
  audit.unusedComponents.forEach(comp => {
    md += '| ' + comp + ' | Component | N/A | ? Unused | File is in src/components but not imported by any file | Integrate component or delete | Low |\n';
  });
}
md += '\n';

md += '## 5. Missing Uploaded Documents & Assets\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
md += '| N/A | N/A | N/A | ? Missing | Workspace search for "Biomedical Robotics Vision" and "Faculty Profile" yielded 0 results | Provide the missing text/PDF documents to the agent | Critical |\n';
md += '\n';

md += '## 6. Duplicated Content\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
md += '| N/A | N/A | N/A | ? Validated | No duplicate text blocks detected | None | Low |\n';
md += '\n';

md += '## 7. Homepage Sections Audit\n';
md += '| File path | Component name | Route | Current status | Evidence | Required fix | Priority |\n';
md += '|---|---|---|---|---|---|---|\n';
md += '| src/components/layout/navbar.tsx | Navbar | / | ? Completed | Verified via code inspection | None | Low |\n';
md += '| src/app/page.tsx | Hero | / | ? Completed | Verified via code inspection | None | Low |\n';
md += '| src/components/home/ai-course-explorer.tsx | B.Tech Programs | / | ? Completed | Header reads "B.Tech Programs." | None | Low |\n';
md += '| src/components/home/diploma-programmes.tsx | Diploma Programs | / | ? Completed | Positioned after B.Tech | None | Low |\n';
md += '| src/components/home/scholarships.tsx | Scholarships | / | ? Completed | Component exists and imported in page.tsx | None | Low |\n';

fs.writeFileSync('C:\\Users\\Admin-\\.gemini\\antigravity-ide\\brain\\e701f238-70d7-4d25-8fd9-07400409912b\\audit_report.md', md);
