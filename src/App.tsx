import React, { useState, useEffect } from "react";
import { PageId, UserRole } from "./types";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CitizenPage from "./pages/Citizen";
import MPDashboardPage from "./pages/MPDashboard";
import DepartmentPage from "./pages/Department";
import AdminPage from "./pages/Admin";
import SettingsPage from "./pages/Settings";
import HelpPage from "./pages/Help";
import AIInspectorPage from "./pages/AIInspector";

// Authentication & Core Guards Page imports
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ForgotPasswordPage from "./pages/ForgotPassword";
import UnauthorizedPage from "./pages/Unauthorized";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Loader2, Sparkles, ShieldCheck } from "lucide-react";

function AppContent() {
  const { currentUser, isLoading, hasRole } = useAuth();

  // Safe client-side hash router initialization
  const [activePage, setActivePage] = useState<PageId>(() => {
    const hash = window.location.hash.replace("#", "") as PageId;
    const allowedPages: PageId[] = [
      "home", "portal", "mp", "department", "admin", "settings", "help", 
      "login", "register", "forgot-password", "unauthorized", "citizen", "dashboard"
    ];
    return allowedPages.includes(hash) ? hash : "home";
  });

  // Handle page transitions and sync browser hash history
  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
    // Scroll content area back to top on transitions
    document.getElementById("main-scrollable-canvas")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sync state if user clicks browser Back/Forward navigation keys
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "") as PageId;
      const allowedPages: PageId[] = [
        "home", "portal", "mp", "department", "admin", "settings", "help", 
        "login", "register", "forgot-password", "unauthorized", "citizen", "dashboard"
      ];
      if (allowedPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Define route protection parameters
  const isPagePublic = (page: PageId): boolean => {
    return ["home", "login", "register", "forgot-password", "unauthorized", "help"].includes(page);
  };

  const getPageAllowedRoles = (page: PageId): UserRole[] => {
    switch (page) {
      case "portal":
      case "citizen":
        return ["Citizen", "Administrator"];
      case "mp":
      case "dashboard":
        return ["MP", "Administrator"];
      case "department":
        return ["Department Officer", "Administrator"];
      case "admin":
        return ["Administrator"];
      case "ai-inspector":
        return ["MP", "Department Officer", "Administrator"];
      case "settings":
        return ["MP", "Department Officer", "Administrator"];
      default:
        return [];
    }
  };

  // Run Route Guard checks before rendering
  useEffect(() => {
    if (isLoading) return;

    // 1. If trying to access non-public page while logged out, force redirect to Login page
    if (!isPagePublic(activePage) && !currentUser) {
      handleNavigate("login");
      return;
    }

    // 2. If logged in but trying to access auth utility pages, auto-route to correct dashboard based on RBAC role
    if (currentUser && ["login", "register", "forgot-password"].includes(activePage)) {
      switch (currentUser.role) {
        case "Citizen":
          handleNavigate("portal");
          break;
        case "MP":
          handleNavigate("mp");
          break;
        case "Department Officer":
          handleNavigate("department");
          break;
        case "Administrator":
          handleNavigate("admin");
          break;
        default:
          handleNavigate("home");
      }
      return;
    }

    // 3. If logged in and trying to access restricted pages, check matching role claims
    if (currentUser && !isPagePublic(activePage)) {
      const allowedRoles = getPageAllowedRoles(activePage);
      if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        handleNavigate("unauthorized");
      }
    }
  }, [activePage, currentUser, isLoading]);

  // Loading Authentication View State
  if (isLoading) {
    return (
      <div 
        className="min-h-screen bg-slate-900 flex flex-col items-center justify-center font-sans text-white p-6 relative overflow-hidden" 
        id="loading-auth-page"
      >
        <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>
        <div className="text-center space-y-6 max-w-sm z-10">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
            <ShieldCheck className="absolute inset-0 m-auto w-7 h-7 text-indigo-400" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-black tracking-tight flex items-center justify-center gap-1.5">
              GovAI Connect
              <span className="text-[9px] bg-indigo-500/15 text-indigo-300 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest border border-indigo-500/30">M3 Shield</span>
            </h2>
            <p className="text-xs text-slate-400">Synchronizing secure authentication tokens and routing claims...</p>
          </div>
        </div>
      </div>
    );
  }

  // Determine active sub-view element
  const renderPage = () => {
    switch (activePage) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "portal":
      case "citizen":
        return <CitizenPage />;
      case "mp":
      case "dashboard":
        return <MPDashboardPage />;
      case "department":
        return <DepartmentPage />;
      case "admin":
        return <AdminPage />;
      case "ai-inspector":
        return <AIInspectorPage />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPage />;
      
      // Authentication Routes
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case "unauthorized":
        return <UnauthorizedPage onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
