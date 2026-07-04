import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured as configIsConfigured } from "../config/firebase";
import { UserProfile, UserRole } from "../types";

// In-memory/localStorage fallback to guarantee 100% operation when Firebase setup is incomplete
const LOCAL_STORAGE_USER_KEY = "govai_connect_user";
const LOCAL_STORAGE_DB_KEY = "govai_connect_users_db";

const getLocalDb = (): Record<string, UserProfile> => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

const saveLocalDb = (dbData: Record<string, UserProfile>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(dbData));
  } catch (e) {
    console.error("Failed to save to mock DB storage", e);
  }
};

let forceMockFallback = false;

const DEMO_EMAILS = ["citizen@gov.in", "mp@gov.in", "department@gov.in", "admin@gov.in"];

const isDemoAccount = (email: string): boolean => {
  return DEMO_EMAILS.includes(email.toLowerCase());
};

const checkIsApiKeyError = (error: any): boolean => {
  const errStr = String(error?.message || error?.code || error || "").toLowerCase();
  return (
    errStr.includes("api-key-not-valid") ||
    errStr.includes("invalid-api-key") ||
    errStr.includes("api key") ||
    errStr.includes("apikey") ||
    errStr.includes("invalid key") ||
    errStr.includes("key-not-valid") ||
    errStr.includes("restricted-client") ||
    errStr.includes("unauthorized")
  );
};

const isFirebaseConfigured = (): boolean => {
  if (forceMockFallback) {
    return false;
  }
  return configIsConfigured();
};

export const FirebaseAuthService = {
  /**
   * Check if Firebase is configured
   */
  isFirebaseConfigured(): boolean {
    return isFirebaseConfigured();
  },

  /**
   * Safe Firestore fetch. Falls back to mock client DB if fails or is unconfigured.
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    if (isFirebaseConfigured()) {
      try {
        const userDocRef = doc(db, "users", uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          return docSnap.data() as UserProfile;
        }
      } catch (error) {
        console.warn("Firestore getUserProfile failed, trying local fallback", error);
      }
    }

    // Local Storage fallback
    const localDb = getLocalDb();
    return localDb[uid] || null;
  },

  /**
   * Safe Firestore write. Falls back to mock client DB if fails or is unconfigured.
   */
  async saveUserProfile(profile: UserProfile): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        const userDocRef = doc(db, "users", profile.uid);
        await setDoc(userDocRef, profile, { merge: true });
        console.log("Successfully wrote user profile to Firestore:", profile.uid);
        return;
      } catch (error) {
        console.warn("Firestore saveUserProfile failed, saving to local fallback", error);
      }
    }

    // Local Storage fallback
    const localDb = getLocalDb();
    localDb[profile.uid] = profile;
    saveLocalDb(localDb);
  },

  /**
   * Update individual fields in user profile
   */
  async updateUserProfile(uid: string, fields: Partial<UserProfile>): Promise<void> {
    const existing = await this.getUserProfile(uid);
    if (!existing) return;

    const updated: UserProfile = {
      ...existing,
      ...fields,
      updatedAt: new Date().toISOString()
    };

    await this.saveUserProfile(updated);
  },

  /**
   * Register a new user with email and password
   */
  async registerWithEmail(email: string, password: string, name: string, role: UserRole): Promise<UserProfile> {
    const lowerEmail = email.toLowerCase();
    if (isDemoAccount(lowerEmail)) {
      throw new Error("auth/email-already-in-use: This email address is reserved for demo accounts.");
    }

    let uid = "mock-" + Math.random().toString(36).substr(2, 9);
    const isReal = isFirebaseConfigured();

    if (isReal) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        uid = userCredential.user.uid;
      } catch (error: any) {
        const isApiKeyError = checkIsApiKeyError(error);
        if (isApiKeyError) {
          console.warn("Detected invalid/unconfigured Firebase API key during registration. Switching to Demo Mode fallback.");
          forceMockFallback = true;
          return this.registerWithEmail(email, password, name, role);
        }
        console.error("Firebase Auth registration failed", error);
        throw error;
      }
    }

    const now = new Date().toISOString();
    const newUser: UserProfile = {
      uid,
      name,
      fullName: name,
      email,
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      role,
      language: "English",
      preferredLanguage: "English",
      phoneNumber: "",
      createdAt: now,
      updatedAt: now,
      lastLogin: now,
      status: "Active"
    };

    await this.saveUserProfile(newUser);
    return newUser;
  },

  /**
   * Sign in with email and password
   */
  async loginWithEmail(email: string, password: string): Promise<UserProfile> {
    const lowerEmail = email.toLowerCase();

    // 1. If it's a demo account, always authenticate locally with demo credentials
    if (isDemoAccount(lowerEmail)) {
      let expectedPassword = "";
      if (lowerEmail === "citizen@gov.in") {
        expectedPassword = "Citizen@2026!";
      } else if (lowerEmail === "mp@gov.in") {
        expectedPassword = "Mp@2026!";
      } else if (lowerEmail === "department@gov.in") {
        expectedPassword = "Dept@2026!";
      } else if (lowerEmail === "admin@gov.in") {
        expectedPassword = "Admin@2026!";
      }

      if (password !== expectedPassword) {
        throw new Error("auth/wrong-password: Incorrect password for this demo account.");
      }
      
      const localDb = getLocalDb();
      const matchedUser = Object.values(localDb).find(u => u.email.toLowerCase() === lowerEmail);
      if (!matchedUser) {
        throw new Error("User profile not found in database.");
      }
      
      const updated: UserProfile = {
        ...matchedUser,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      localDb[updated.uid] = updated;
      saveLocalDb(localDb);
      return updated;
    }

    // 2. Otherwise check if Firebase is configured
    const isReal = isFirebaseConfigured();

    if (!isReal) {
      // Check fallback user index for registered simulated users in Demo Mode
      const localDb = getLocalDb();
      const matchedUser = Object.values(localDb).find(u => u.email.toLowerCase() === lowerEmail);
      if (!matchedUser) {
        throw new Error("auth/user-not-found: No user found with this email. Please register first.");
      }

      const updatedProfile: UserProfile = {
        ...matchedUser,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await this.saveUserProfile(updatedProfile);
      return updatedProfile;
    }

    // Production Mode authentication: ONLY Firebase
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const profile = await this.getUserProfile(uid);
      if (!profile) {
        throw new Error("User profile not found in database.");
      }
      const updatedProfile: UserProfile = {
        ...profile,
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await this.saveUserProfile(updatedProfile);
      return updatedProfile;
    } catch (error: any) {
      const isApiKeyError = checkIsApiKeyError(error);
      if (isApiKeyError) {
        console.warn("Detected invalid/unconfigured Firebase API key. Switching to Demo Mode fallback.");
        forceMockFallback = true;
        return this.loginWithEmail(email, password);
      }
      console.error("Firebase Auth login failed", error);
      throw error;
    }
  },

  /**
   * Reset password email
   */
  async resetPassword(email: string): Promise<void> {
    const lowerEmail = email.toLowerCase();
    const isReal = isFirebaseConfigured();

    if (isReal) {
      try {
        await sendPasswordResetEmail(auth, email);
        return;
      } catch (error: any) {
        const isApiKeyError = checkIsApiKeyError(error);
        if (isApiKeyError) {
          console.warn("Detected invalid/unconfigured Firebase API key during password reset. Switching to Demo Mode fallback.");
          forceMockFallback = true;
          return this.resetPassword(email);
        }
        console.error("Firebase Reset Password failed", error);
        throw error;
      }
    }

    // Demo Mode logic:
    if (isDemoAccount(lowerEmail)) {
      // Success simulation for demo accounts
      return;
    }
    // Check if user exists in fallback db
    const localDb = getLocalDb();
    const matchedUser = Object.values(localDb).find(u => u.email.toLowerCase() === lowerEmail);
    if (!matchedUser) {
      throw new Error("auth/user-not-found: No user found with this email.");
    }
  },

  /**
   * Sign in with Google. If popups are blocked (sandboxed iframe), simulates Google auth.
   */
  async loginWithGoogle(roleSelectorFallback: (onSelect: (role: UserRole) => void) => void): Promise<UserProfile> {
    const isReal = isFirebaseConfigured();

    if (isReal) {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const firebaseUser = result.user;
        
        const existingProfile = await this.getUserProfile(firebaseUser.uid);
        if (existingProfile) {
          const updated = {
            ...existingProfile,
            lastLogin: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await this.saveUserProfile(updated);
          return updated;
        }

        const now = new Date().toISOString();
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Google User",
          fullName: firebaseUser.displayName || "Google User",
          email: firebaseUser.email || "google@example.com",
          photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firebaseUser.displayName || "Google")}`,
          role: "Citizen", // default role
          language: "English",
          preferredLanguage: "English",
          phoneNumber: firebaseUser.phoneNumber || "",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          status: "Active"
        };

        await this.saveUserProfile(profile);
        return profile;
      } catch (error: any) {
        const isApiKeyError = checkIsApiKeyError(error);
        if (isApiKeyError) {
          console.warn("Detected invalid/unconfigured Firebase API key during Google sign-in. Switching to Demo Mode fallback.");
          forceMockFallback = true;
          return this.loginWithGoogle(roleSelectorFallback);
        }
        console.error("Firebase Google Sign-In failed", error);
        throw error;
      }
    } else {
      // Demo Mode simulated Google Sign-In
      return new Promise((resolve) => {
        roleSelectorFallback((selectedRole: UserRole) => {
          const mockUid = "google-mock-" + Math.random().toString(36).substr(2, 9);
          const now = new Date().toISOString();
          const mockProfile: UserProfile = {
            uid: mockUid,
            name: `Google User (${selectedRole})`,
            fullName: `Google User (${selectedRole})`,
            email: `google.${selectedRole.toLowerCase().replace(" ", "")}@gmail.com`,
            photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=google-${selectedRole}`,
            role: selectedRole,
            language: "English",
            preferredLanguage: "English",
            phoneNumber: "",
            createdAt: now,
            updatedAt: now,
            lastLogin: now,
            status: "Active"
          };

          // Save profile
          const localDb = getLocalDb();
          localDb[mockUid] = mockProfile;
          saveLocalDb(localDb);

          resolve(mockProfile);
        });
      });
    }
  },

  /**
   * Log out from system
   */
  async logout(): Promise<void> {
    if (isFirebaseConfigured()) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.warn("Firebase signout failed, clearing local session", e);
      }
    }
    // Clear user session token/credentials if any from local storage
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  },

  /**
   * Listen to Auth changes
   */
  onAuthChanged(callback: (userProfile: UserProfile | null) => void): () => void {
    if (!isFirebaseConfigured()) {
      // Pure offline mode: read from localStorage and trigger callback once
      const localUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (localUser) {
        try {
          callback(JSON.parse(localUser));
        } catch (e) {
          callback(null);
        }
      } else {
        callback(null);
      }
      return () => {}; // return empty unsubscribe
    }

    // Real Firebase mode
    let firebaseUnsubscribe = () => {};
    try {
      firebaseUnsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const profile = await this.getUserProfile(user.uid);
          if (profile) {
            callback(profile);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
          } else {
            callback(null);
          }
        } else {
          // Production Mode: Do not bypass or fallback to local sessions if Firebase says user is logged out
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          callback(null);
        }
      });
    } catch (e) {
      console.warn("Could not listen to real Firebase Auth states, using purely offline persistence listener", e);
    }

    return () => {
      firebaseUnsubscribe();
    };
  }
};
