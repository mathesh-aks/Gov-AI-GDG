export interface CitizenProfile {
  uid: string;
  fullName: string;
  phone: string;
  email?: string;
  preferredLanguage: string;
  location: string;
  registeredAt: string;
}

export interface MPProfile {
  uid: string;
  fullName: string;
  constituencyName: string;
  state: string;
  officeAddress: string;
  email: string;
}

export interface DepartmentProfile {
  id: string;
  name: string;
  nodalOfficer: string;
  email: string;
  phone: string;
  activeTasksCount: number;
}

export interface Complaint {
  id: string;
  citizenName: string;
  citizenUid?: string;
  contactInfo: string;
  location: string;
  originalText: string;
  detectedLanguage: string;
  translatedText: string;
  category: "Water Supply" | "Roads & Transport" | "Public Safety" | "Sanitation" | "Power & Electricity" | "Healthcare" | "Education" | "General";
  urgencyScore: number; // 0 - 100
  department: string;
  duplicateOfId: string | null;
  status: "Pending" | "In Progress" | "Resolved" | "Investigating";
  recommendedAction: string;
  createdAt: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  attachmentUrls?: string[];
  audioUrl?: string;
  title?: string;
  ward?: string;
  villageArea?: string;
  priority?: "Low" | "Medium" | "High" | "Urgent";
  contactPreference?: "Email" | "SMS" | "Phone Call" | "WhatsApp";
  files?: Array<{
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  }>;
  aiPayload?: {
    originalLanguage: string;
    translatedLanguage: string;
    issueCategory: string;
    issueDescription: string;
    uploadedFiles: Array<{
      name: string;
      size: number;
      type: string;
    }>;
    geoLocation: {
      latitude: number;
      longitude: number;
      accuracy?: number;
    } | null;
    metadata: {
      device: string;
      browser: string;
      priority: string;
      contactPreference: string;
      ward: string;
      villageArea: string;
    };
    citizenProfile: {
      uid: string;
      fullName: string;
      email?: string;
      phoneNumber?: string;
      preferredLanguage?: string;
    };
    timestamp: string;
  };
}

export interface ActionLog {
  id: string;
  complaintId: string;
  taskTitle: string;
  actionTaken: string;
  executedBy: string;
  status: "Dispatched" | "In Progress" | "Completed";
  timestamp: string;
}

export type UserRole = "Citizen" | "MP" | "Department Officer" | "Administrator";

export interface UserProfile {
  uid: string;
  name: string;
  fullName: string;
  email: string;
  photoURL: string;
  role: UserRole;
  language: string;
  preferredLanguage: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  status: string;
}

export type PageId = 
  | "home" 
  | "portal" 
  | "mp" 
  | "department" 
  | "admin" 
  | "settings" 
  | "help"
  | "login"
  | "register"
  | "forgot-password"
  | "unauthorized"
  | "citizen"
  | "dashboard"
  | "ai-inspector";
