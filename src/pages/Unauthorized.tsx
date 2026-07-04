import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, ArrowLeft, LogOut, Sparkles } from "lucide-react";

interface UnauthorizedProps {
  onNavigate: (page: any) => void;
}

export default function UnauthorizedPage({ onNavigate }: UnauthorizedProps) {
  const { currentUser, logout } = useAuth();

  const handleSignOutDifferent = async () => {
    await logout();
    onNavigate("login");
  };

  const getAuthorizedDashboard = () => {
    if (!currentUser) return "login";
    switch (currentUser.role) {
      case "Citizen":
        return "portal";
      case "MP":
        return "mp";
      case "Department Officer":
        return "department";
      case "Administrator":
        return "admin";
      default:
        return "home";
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[75vh] px-4 py-12" id="unauthorized-container">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6 relative overflow-hidden" id="unauthorized-card">
        
        {/* Subtle decorative background stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500"></div>

        {/* Brand Header */}
        <div className="flex items-center justify-center gap-1.5 text-slate-400 font-extrabold text-[9px] uppercase tracking-widest leading-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          Security Sandbox
        </div>

        {/* Danger Shield Icon */}
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-500 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Access Prohibited</h2>
          <p className="text-xs text-slate-500 leading-relaxed px-2">
            Your authenticated governance role <strong className="font-extrabold text-indigo-600">({currentUser?.role || "Visitor"})</strong> does not possess matching credentials to inspect this administrative zone.
          </p>
        </div>

        {/* Details card */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-left text-[11px] space-y-1.5 text-slate-600">
          <div className="flex justify-between">
            <span className="font-bold">Active User:</span>
            <span>{currentUser?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Credential Email:</span>
            <span>{currentUser?.email || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Zonal Token Status:</span>
            <span className="text-rose-600 font-black">UNAUTHORIZED_ROLE</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button 
            onClick={() => onNavigate(getAuthorizedDashboard())}
            className="flex-1 h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
          >
            <ArrowLeft className="w-4 h-4" />
            My Dashboard
          </button>
          
          <button 
            onClick={handleSignOutDifferent}
            className="flex-1 h-10 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            Use Another
          </button>
        </div>

      </div>
    </div>
  );
}
