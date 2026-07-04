import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Home, 
  Users, 
  BarChart3, 
  Building2, 
  ShieldCheck, 
  Sliders, 
  HelpCircle, 
  Menu, 
  X, 
  Bell,
  LogOut,
  LogIn,
  Cpu
} from "lucide-react";
import { PageId, UserRole } from "../types";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: React.ReactNode;
}

export default function Layout({ activePage, onNavigate, children }: LayoutProps) {
  const { currentUser, logout, hasRole, isProductionMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onNavigate("login");
  };

  // Check if current page is full-screen authentication page
  const isAuthPage = ["login", "register", "forgot-password", "unauthorized"].includes(activePage);

  // Define sidebar navigation directories matching user persona access list
  const menuItems = [
    { id: "home", label: "Home", icon: Home, roles: ["Citizen", "MP", "Department Officer", "Administrator"] },
    { id: "portal", label: "Citizen Portal", icon: Users, roles: ["Citizen", "Administrator"] },
    { id: "mp", label: "MP Dashboard", icon: BarChart3, roles: ["MP", "Administrator"] },
    { id: "department", label: "Department Portal", icon: Building2, roles: ["Department Officer", "Administrator"] },
    { id: "admin", label: "Admin Control", icon: ShieldCheck, roles: ["Administrator"] },
    { id: "ai-inspector", label: "AI Pipeline Inspector", icon: Cpu, roles: ["MP", "Department Officer", "Administrator"] },
    { id: "settings", label: "System Settings", icon: Sliders, roles: ["MP", "Department Officer", "Administrator"] },
    { id: "help", label: "Help & Guide", icon: HelpCircle, roles: ["Citizen", "MP", "Department Officer", "Administrator"] }
  ] as const;

  // Filter menu items by active user role authorizations
  const visibleMenuItems = menuItems.filter(item => {
    if (!currentUser) return item.id === "home" || item.id === "help";
    return item.roles.includes(currentUser.role);
  });

  // If full-screen login, register, or unauthorized, skip the main layout chrome
  if (isAuthPage) {
    return (
      <div className="bg-slate-100 min-h-screen flex flex-col font-sans text-slate-900 selection:bg-indigo-100" id="auth-fullscreen-container">
        <main className="flex-1 flex flex-col justify-center items-center">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col font-sans overflow-x-hidden text-slate-900 selection:bg-indigo-100" id="app-layout-root">
      
      {/* Responsive Top Navigation Header */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-xs" id="navbar">
        
        {/* Left Side: Brand Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1.5 hover:bg-slate-50 text-slate-600 rounded-lg transition-all border border-slate-200 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button onClick={() => { onNavigate("home"); }} className="flex items-center gap-2.5 text-left bg-transparent border-0 cursor-pointer p-0">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
              <Sparkles className="h-4.5 w-4.5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-black tracking-tight text-slate-800 leading-tight">
                GovAI Connect
              </h1>
              <p className="text-[9px] uppercase font-bold text-indigo-500 tracking-widest leading-none">Constituency Planning Suite</p>
            </div>
          </button>
        </div>

        {/* Right Side: Administrative Profile and Quick Actions */}
        <div className="flex items-center gap-3">
          
          {/* Real-time system API indicator */}
          <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-1" id="layout-mode-badge-container">
            {isProductionMode ? (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-[10px] font-bold text-emerald-700">Production Mode</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-[10px] font-bold text-amber-700">Demo Mode</span>
              </>
            )}
          </div>

          {/* Simulated notification dropdown bell */}
          {currentUser && (
            <div className="relative">
              <button 
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg p-3 space-y-2 z-50 text-xs text-slate-700">
                  <p className="font-bold text-slate-800 pb-1.5 border-b border-slate-100 uppercase text-[9px] tracking-wider text-slate-400">System Logs</p>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pt-1">
                    <div className="p-2 bg-indigo-50/50 rounded-lg border border-indigo-50 text-[11px]">
                      <span className="font-bold text-indigo-950">Active Session:</span> Authenticated as <strong className="font-extrabold">{currentUser.role}</strong>. Secure connection established.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Badge or Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 border-l pl-3.5 border-slate-200" id="navbar-profile-badge">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold leading-none text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] text-indigo-600 font-bold mt-0.5">{currentUser.role}</p>
              </div>
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.name} 
                referrerPolicy="no-referrer"
                className="w-8.5 h-8.5 rounded-full border border-indigo-200 shadow-xs bg-slate-50"
              />
              <button 
                onClick={handleLogout}
                className="p-1.5 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-all border border-transparent hover:border-rose-100 cursor-pointer"
                title="Log Out"
                id="navbar-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onNavigate("login")}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
              id="navbar-login-btn"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main Container Layout */}
      <div className="flex flex-1 relative" id="layout-body">
        
        {/* Desktop Sidebar (Left Rail) */}
        <aside className="w-64 bg-white border-r border-slate-200 p-5 flex flex-col gap-1.5 shrink-0 hidden md:flex" id="sidebar-nav">
          <div className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest px-3">System Directory</div>
          
          <nav className="flex-1 flex flex-col gap-1">
            {visibleMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activePage === item.id;
              return (
                <button 
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 font-bold shadow-xs border-l-4 border-indigo-600" 
                      : "text-slate-600 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sign Out block at the bottom of the sidebar */}
          {currentUser && (
            <div className="pt-2 border-t border-slate-100 mb-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold transition-all cursor-pointer"
                id="sidebar-logout-btn"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out Session</span>
              </button>
            </div>
          )}

          {/* Dynamic platform metadata info box */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3.5 bg-slate-900 rounded-xl text-white relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 w-16 h-16 bg-indigo-500/20 rounded-full blur-lg"></div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">M3 Zonal Gateway</p>
              <div className="flex justify-between items-end">
                <span className="text-lg font-black leading-none">{currentUser ? "SECURED" : "GUEST"}</span>
                <span className="text-[8px] bg-emerald-500 text-white font-black px-1 rounded-sm leading-normal">JWT256</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40" 
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer Menu */}
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.25 }}
                className="md:hidden fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 p-5 z-40 flex flex-col gap-1.5"
              >
                <div className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest px-3">System Directory</div>
                <nav className="flex-1 flex flex-col gap-1">
                  {visibleMenuItems.map((item) => {
                    const IconComp = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button 
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isActive 
                            ? "bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600" 
                            : "text-slate-600 hover:bg-slate-50 font-semibold"
                        }`}
                      >
                        <IconComp className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {currentUser && (
                  <div className="pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold transition-all cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Content Grid - Framed by negative space */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-100" id="main-scrollable-canvas">
          <motion.div 
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </main>

      </div>
    </div>
  );
}
