import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { db, auth, isFirebaseConfigured } from "../config/firebase";
import { Complaint, UserRole } from "../types";

// Operation types for error reporting conformant with Firestore skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

// Hardened error handler to satisfy Firestore skill requirements
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
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
}

// In-Memory & LocalStorage cache for fallback and instant retrieval
const LOCAL_STORAGE_KEY = "govai_local_complaints";
const DRAFT_STORAGE_PREFIX = "govai_complaint_draft_";

export class ComplaintService {
  /**
   * Safe fetch of all complaints locally stored as a fallback
   */
  static getLocalComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to read local complaints cache", e);
      return [];
    }
  }

  /**
   * Safe save of complaints cache locally
   */
  static saveLocalComplaints(complaints: Complaint[]) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error("Failed to update local complaints cache", e);
    }
  }

  /**
   * Submit a new complaint, writing to Firestore, with automatic LocalStorage fallback.
   */
  static async submitComplaint(complaint: Complaint): Promise<{ success: boolean; id: string; error?: string }> {
    const path = `complaints/${complaint.id}`;
    
    // Save locally first so the user never loses their submission regardless of connection
    const local = this.getLocalComplaints();
    this.saveLocalComplaints([complaint, ...local]);

    try {
      // Test or write to real firestore
      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
      const docRef = doc(db, "complaints", complaint.id);
      await setDoc(docRef, complaint);
      console.log(`Successfully stored complaint ${complaint.id} in Firestore.`);
      return { success: true, id: complaint.id };
    } catch (error: any) {
      const errDetails = handleFirestoreError(error, OperationType.WRITE, path);
      console.warn("Firestore write failed, using secure client-side storage fallback.", errDetails);
      return { 
        success: false, 
        id: complaint.id, 
        error: "Saved securely to client database (Offline Mode active)." 
      };
    }
  }

  /**
   * Retrieve complaints for a specific user, combining Firestore with local fallback.
   */
  static async getComplaintsForUser(uid: string, role: UserRole): Promise<Complaint[]> {
    const localComplaints = this.getLocalComplaints();
    let firestoreComplaints: Complaint[] = [];
    const colPath = "complaints";

    try {
      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
      let q;
      if (role === "MP" || role === "Department Officer" || role === "Administrator") {
        q = query(collection(db, colPath), orderBy("createdAt", "desc"));
      } else {
        q = query(
          collection(db, colPath), 
          where("citizenUid", "==", uid)
        );
      }
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        firestoreComplaints.push(doc.data() as Complaint);
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, colPath);
      console.warn("Using offline local database fallback for listing complaints.");
    }

    // Merge both, matching by ID to eliminate duplicates
    const allMap = new Map<string, Complaint>();
    
    // Process local complaints
    localComplaints.forEach(c => {
      // Filter if standard user is querying
      if (role === "Citizen" && c.citizenUid !== uid) {
        return;
      }
      allMap.set(c.id, c);
    });

    // Process firestore complaints, which are more authoritative
    firestoreComplaints.forEach(c => {
      allMap.set(c.id, c);
    });

    // Convert back to array sorted by creation date (descending)
    return Array.from(allMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get a single complaint by ID
   */
  static async getComplaintById(id: string): Promise<Complaint | null> {
    const local = this.getLocalComplaints().find(c => c.id === id);
    if (local) return local;

    try {
      if (!isFirebaseConfigured()) throw new Error("Firebase not configured");
      const docRef = doc(db, "complaints", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Complaint;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `complaints/${id}`);
    }

    return null;
  }

  /**
   * Manage form drafts
   */
  static saveDraft(uid: string, draft: any) {
    try {
      localStorage.setItem(`${DRAFT_STORAGE_PREFIX}${uid}`, JSON.stringify(draft));
    } catch (e) {
      console.error("Failed to save draft", e);
    }
  }

  static getDraft(uid: string): any | null {
    try {
      const draft = localStorage.getItem(`${DRAFT_STORAGE_PREFIX}${uid}`);
      return draft ? JSON.parse(draft) : null;
    } catch (e) {
      console.error("Failed to retrieve draft", e);
      return null;
    }
  }

  static clearDraft(uid: string) {
    try {
      localStorage.removeItem(`${DRAFT_STORAGE_PREFIX}${uid}`);
    } catch (e) {
      console.error("Failed to clear draft", e);
    }
  }
}
