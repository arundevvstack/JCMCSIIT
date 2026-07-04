const fs = require('fs');
const content = fs.readFileSync('C:/Users/Admin-/.gemini/antigravity-ide/brain/378fa844-aac8-4314-a7ac-a037736136e2/.system_generated/steps/374/content.md', 'utf8');

const regex = /<a[^>]+href="([^"]+)"[^>]*>Click Here<\/a>/i;
const match = regex.exec(content);
if (match) {
  console.log("Form Link:", match[1]);
}
