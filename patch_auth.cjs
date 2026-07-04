const fs = require('fs');
let code = fs.readFileSync('src/services/authService.ts', 'utf8');

// 1. Add import
code = code.replace(
  'import { auth, db } from "../config/firebase";',
  'import { auth, db, isFirebaseConfigured as configIsConfigured } from "../config/firebase";'
);

// 2. Replace isFirebaseConfigured implementation
const oldFunc = `const isFirebaseConfigured = (): boolean => {
  if (forceMockFallback) {
    return false;
  }
  const options = auth.app.options;
  if (!options.apiKey || 
      options.apiKey.includes("Placeholder") || 
      options.apiKey.includes("FakeKey") || 
      options.apiKey === "undefined" || 
      options.apiKey === "null" ||
      options.apiKey.length < 25) {
    return false;
  }
  if (!options.projectId || 
      options.projectId.includes("Placeholder") || 
      options.projectId === "govai-connect" || 
      options.projectId === "react-example") {
    return false;
  }
  return true;
};`;

const newFunc = `const isFirebaseConfigured = (): boolean => {
  if (forceMockFallback) {
    return false;
  }
  return configIsConfigured();
};`;

if (code.includes(oldFunc)) {
  code = code.replace(oldFunc, newFunc);
  fs.writeFileSync('src/services/authService.ts', code);
  console.log("Successfully patched authService.ts");
} else {
  console.log("oldFunc not found, check regex/string matching.");
}
