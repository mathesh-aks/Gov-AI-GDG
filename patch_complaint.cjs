const fs = require('fs');
let code = fs.readFileSync('src/services/complaintService.ts', 'utf8');

// 1. Add import
if (!code.includes('isFirebaseConfigured')) {
  code = code.replace(
    'import { db, auth } from "../config/firebase";',
    'import { db, auth, isFirebaseConfigured } from "../config/firebase";'
  );
}

// 2. Safe handleFirestoreError
const oldErrFunc = `function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}`;

const newErrFunc = `function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const isReal = isFirebaseConfigured();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: isReal ? auth?.currentUser?.uid : undefined,
      email: isReal ? auth?.currentUser?.email : undefined,
      emailVerified: isReal ? auth?.currentUser?.emailVerified : undefined,
      isAnonymous: isReal ? auth?.currentUser?.isAnonymous : undefined,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}`;

if (code.includes(oldErrFunc)) {
  code = code.replace(oldErrFunc, newErrFunc);
}

// 3. submitComplaint
code = code.replace(
  '      // Test or write to real firestore\n      const docRef = doc(db, "complaints", complaint.id);',
  '      // Test or write to real firestore\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const docRef = doc(db, "complaints", complaint.id);'
);

// 4. getUserComplaints
code = code.replace(
  '    try {\n      const complaintsRef = collection(db, "complaints");',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");'
);

// 5. getDepartmentComplaints
code = code.replace(
  '    try {\n      const complaintsRef = collection(db, "complaints");',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");'
);

// 6. getRecentComplaints
code = code.replace(
  '    try {\n      const complaintsRef = collection(db, "complaints");',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");'
);

// 7. getComplaintById
code = code.replace(
  '    try {\n      const docRef = doc(db, "complaints", id);',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const docRef = doc(db, "complaints", id);'
);

// 8. updateComplaintStatus
code = code.replace(
  '    try {\n      const docRef = doc(db, "complaints", id);',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const docRef = doc(db, "complaints", id);'
);

// 9. getAllComplaints
code = code.replace(
  '    try {\n      const complaintsRef = collection(db, "complaints");',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");'
);

// 10. getAllComplaintsForMP
code = code.replace(
  '    try {\n      const complaintsRef = collection(db, "complaints");',
  '    try {\n      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");\n      const complaintsRef = collection(db, "complaints");'
);

fs.writeFileSync('src/services/complaintService.ts', code);
console.log("Patched complaintService.ts");
