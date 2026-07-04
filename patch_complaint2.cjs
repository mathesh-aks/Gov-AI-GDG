const fs = require('fs');
let code = fs.readFileSync('src/services/complaintService.ts', 'utf8');

code = code.replace(/try \{\s*const complaintsRef = collection\(db, "complaints"\);/g, 'try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");');

code = code.replace(/try \{\s*const docRef = doc\(db, "complaints", id\);/g, 'try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const docRef = doc(db, "complaints", id);');

fs.writeFileSync('src/services/complaintService.ts', code);
console.log("Patched again");
