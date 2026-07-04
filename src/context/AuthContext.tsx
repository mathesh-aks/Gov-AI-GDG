import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "../types";
import { FirebaseAuthService } from "../services/authService";

interface AuthContextType {
  currentUser: UserProfile | null;
  isLoading: boolean;
  isProductionMode: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: (roleSelectorFallback: (onSelect: (role: UserRole) => void) => void) => Promise<UserProfile>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Core Seed Function to prepopulate mock DB for direct out-of-the-box testing
const seedMockDatabaseIfNeeded = () => {
  try {
    const LOCAL_STORAGE_DB_KEY = "govai_connect_users_db";
    const existing = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
    if (!existing || existing === "{}") {
      const now = new Date().toISOString();
      const seedUsers: Record<string, UserProfile> = {
        "uid-citizen": {
          uid: "uid-citizen",
          name: "Amit Deshmukh (Citizen)",
          fullName: "Amit Deshmukh (Citizen)",
          email: "citizen@gov.in",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Amit",
          role: "Citizen",
          language: "Hindi",
          preferredLanguage: "Hindi",
          phoneNumber: "+91 98765 43210",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          status: "Active"
        },
        "uid-mp": {
          uid: "uid-mp",
          name: "Hon. Rajesh Kumar (MP)",
          fullName: "Hon. Rajesh Kumar (MP)",
          email: "mp@gov.in",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Rajesh",
          role: "MP",
          language: "English",
          preferredLanguage: "English",
          phoneNumber: "+91 99999 88888",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          status: "Active"
        },
        "uid-dept": {
          uid: "uid-dept",
          name: "Zonal Head (Water Division)",
          fullName: "Zonal Head (Water Division)",
          email: "department@gov.in",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Nodal",
          role: "Department Officer",
          language: "English",
          preferredLanguage: "English",
          phoneNumber: "+91 77777 66666",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          status: "Active"
        },
        "uid-admin": {
          uid: "uid-admin",
          name: "SysAdmin Core Unit",
          fullName: "SysAdmin Core Unit",
          email: "admin@gov.in",
          photoURL: "https://api.dicebear.com/7.x/adventurer/svg?seed=Admin",
          role: "Administrator",
          language: "English",
          preferredLanguage: "English",
          phoneNumber: "+91 11111 22222",
          createdAt: now,
          updatedAt: now,
          lastLogin: now,
          status: "Active"
        }
      };
      localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(seedUsers));
      console.log("Prepopulated mock user databases for simple direct testing! Accounts: citizen@gov.in (Citizen@2026!), mp@gov.in (Mp@2026!), department@gov.in (Dept@2026!), admin@gov.in (Admin@2026!)");
    }
  } catch (e) {
    console.warn("Failed to seed fallback DB", e);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProductionMode] = useState<boolean>(() => FirebaseAuthService.isFirebaseConfigured());

  useEffect(() => {
    // 1. Seed demo accounts first for seamless playground verification
    seedMockDatabaseIfNeeded();

    // 2. Load initially persisted user state from local storage
    const stored = localStorage.getItem("govai_connect_user");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }

    // 3. Listen to firebase/session changes
    const unsubscribe = FirebaseAuthService.onAuthChanged((userProfile) => {
      if (userProfile) {
        setCurrentUser(userProfile);
        localStorage.setItem("govai_connect_user", JSON.stringify(userProfile));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("govai_connect_user");
      }
      setIsLoading(false);
    });

    // Handle initial loading finish in fallback mode
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await FirebaseAuthService.loginWithEmail(email, password);
      setCurrentUser(profile);
      localStorage.setItem("govai_connect_user", JSON.stringify(profile));
      return profile;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await FirebaseAuthService.registerWithEmail(email, password, name, role);
      setCurrentUser(profile);
      localStorage.setItem("govai_connect_user", JSON.stringify(profile));
      return profile;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await FirebaseAuthService.logout();
      setCurrentUser(null);
      localStorage.removeItem("govai_connect_user");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await FirebaseAuthService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (
    roleSelectorFallback: (onSelect: (role: UserRole) => void) => void
  ): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const profile = await FirebaseAuthService.loginWithGoogle(roleSelectorFallback);
      setCurrentUser(profile);
      localStorage.setItem("govai_connect_user", JSON.stringify(profile));
      return profile;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      isProductionMode,
      login,
      register,
      logout,
      resetPassword,
      loginWithGoogle,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
