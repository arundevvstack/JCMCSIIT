const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin-/.gemini/antigravity-ide/brain/378fa844-aac8-4314-a7ac-a037736136e2/.system_generated/steps/311/content.md', 'utf8');

const regex = /<img src=\"(Photogallery\/2025\/[^\"]+)\" alt=\"([^\"]+)\">/g;
let match;
const results = [];
while ((match = regex.exec(content)) !== null) {
  results.push({
    title: match[2],
    image: 'https://jcmcsiit.ac.in/' + match[1].replace(/ /g, '%20')
  });
}
console.log(JSON.stringify(results, null, 2));
