const fs = require('fs');
let code = fs.readFileSync('src/services/complaintService.ts', 'utf8');

code = code.replace(
  '    try {\n      let q;',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      let q;'
);

fs.writeFileSync('src/services/complaintService.ts', code);
console.log("Patched getComplaintsForUser");
