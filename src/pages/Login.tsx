import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { 
  Sparkles, 
  Mail, 
  Lock, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowRight
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginProps {
  onNavigate: (page: any) => void;
}

export default function LoginPage({ onNavigate }: LoginProps) {
  const { login, loginWithGoogle, isProductionMode } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [googleRoleSelectorOpen, setGoogleRoleSelectorOpen] = useState(false);
  const [googleOnSelectCallback, setGoogleOnSelectCallback] = useState<((role: UserRole) => void) | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGeneralError(null);
    try {
      const user = await login(data.email, data.password);
      // Route based on role
      routeByRole(user.role);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.message && error.message.includes("auth/user-not-found")) {
        setGeneralError("No user account found matching these credentials. Please try registering first.");
      } else if (error.message && error.message.includes("auth/wrong-password")) {
        setGeneralError("Incorrect password. Please verify your password or use Reset Password.");
      } else {
        setGeneralError(error.message || "Authentication failed. Please verify your credentials and try again.");
      }
    }
  };

  const routeByRole = (role: UserRole) => {
    switch (role) {
      case "Citizen":
        onNavigate("portal");
        break;
      case "MP":
        onNavigate("mp");
        break;
      case "Department Officer":
        onNavigate("department");
        break;
      case "Administrator":
        onNavigate("admin");
        break;
      default:
        onNavigate("home");
    }
  };

  const handleGoogleSignIn = async () => {
    setGeneralError(null);
    try {
      const user = await loginWithGoogle((onSelect) => {
        // This is called if real Firebase Auth is blocked by the iframe sandbox
        setGoogleOnSelectCallback(() => onSelect);
        setGoogleRoleSelectorOpen(true);
      });

      if (user && !googleRoleSelectorOpen) {
        routeByRole(user.role);
      }
    } catch (error: any) {
      console.error("Google Sign-In failed", error);
      setGeneralError(error.message || "Google Authentication was interrupted.");
    }
  };

  const handleSelectGoogleRole = (role: UserRole) => {
    if (googleOnSelectCallback) {
      googleOnSelectCallback(role);
      setGoogleRoleSelectorOpen(false);
      // The promise will resolve, update state, and trigger route redirect
      setTimeout(() => {
        routeByRole(role);
      }, 100);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12" id="login-container">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden" id="login-card">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8" id="login-header">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome to GovAI Connect</h2>
            <p className="text-xs text-slate-400">Secure legislative governance & local coordination portal</p>
            <div className="mt-1 inline-flex items-center" id="auth-mode-badge">
              {isProductionMode ? (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Production Mode
                </span>
              ) : (
                <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Demo Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Preset Testing Credentials Prompt */}
        <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2" id="login-presets">
          <p className="text-[10px] font-bold text-indigo-950 uppercase tracking-wider">Quick Testing Accounts (Click to Autofill & Login)</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <button 
              type="button" 
              onClick={() => {
                onSubmit({ email: "citizen@gov.in", password: "Citizen@2026!" });
              }}
              className="text-left font-semibold hover:text-indigo-600 transition-colors bg-white px-2 py-1.5 rounded-lg border border-slate-100 cursor-pointer text-[10px] flex flex-col"
            >
              <span className="font-extrabold text-slate-800">Citizen</span>
              <span className="text-[9px] text-slate-400">citizen@gov.in</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">Citizen@2026!</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                onSubmit({ email: "mp@gov.in", password: "Mp@2026!" });
              }}
              className="text-left font-semibold hover:text-indigo-600 transition-colors bg-white px-2 py-1.5 rounded-lg border border-slate-100 cursor-pointer text-[10px] flex flex-col"
            >
              <span className="font-extrabold text-slate-800">MP</span>
              <span className="text-[9px] text-slate-400">mp@gov.in</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">Mp@2026!</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                onSubmit({ email: "department@gov.in", password: "Dept@2026!" });
              }}
              className="text-left font-semibold hover:text-indigo-600 transition-colors bg-white px-2 py-1.5 rounded-lg border border-slate-100 cursor-pointer text-[10px] flex flex-col"
            >
              <span className="font-extrabold text-slate-800">Dept Officer</span>
              <span className="text-[9px] text-slate-400">department@gov.in</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">Dept@2026!</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                onSubmit({ email: "admin@gov.in", password: "Admin@2026!" });
              }}
              className="text-left font-semibold hover:text-indigo-600 transition-colors bg-white px-2 py-1.5 rounded-lg border border-slate-100 cursor-pointer text-[10px] flex flex-col"
            >
              <span className="font-extrabold text-slate-800">Admin</span>
              <span className="text-[9px] text-slate-400">admin@gov.in</span>
              <span className="text-[8px] text-slate-400 font-mono mt-0.5">Admin@2026!</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {generalError && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start gap-2 animate-shake" id="login-error-alert">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="login-form">
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                id="email-input"
                type="email" 
                placeholder="Enter email address" 
                {...register("email")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-rose-600 font-semibold">{errors.email.message}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Password</label>
              <button 
                type="button"
                id="forgot-password-link"
                onClick={() => onNavigate("forgot-password")}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                id="password-input"
                type={showPassword ? "text" : "password"} 
                placeholder="Enter password" 
                {...register("password")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-rose-600 font-semibold">{errors.password.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            id="login-submit-button"
            disabled={isSubmitting}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Spacer & Divider */}
        <div className="my-6 flex items-center justify-between text-[10px] font-bold uppercase text-slate-400 tracking-wider" id="login-divider">
          <div className="w-[40%] h-[1px] bg-slate-200"></div>
          <span>Or</span>
          <div className="w-[40%] h-[1px] bg-slate-200"></div>
        </div>

        {/* Google Sign-In button */}
        <button 
          type="button" 
          id="google-signin-button"
          onClick={handleGoogleSignIn}
          className="w-full h-10 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <g transform="matrix(1, 0, 0, 1, 0, 0)">
              <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
              <path d="M12,20.58c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.58c-0.9,0.6 -2.07,0.98 -3.32,0.98 -2.34,0 -4.33,-1.58 -5.04,-3.7H2.92v2.66C4.4,18.66 8.02,20.58 12,20.58z" fill="#34A853" />
              <path d="M6.96,13.1c-0.18,-0.54 -0.29,-1.12 -0.29,-1.72s0.1,-1.18 0.29,-1.72V7.02H2.92c-0.62,1.26 -0.98,2.68 -0.98,4.22s0.36,2.96 0.98,4.22L6.96,13.1z" fill="#FBBC05" />
              <path d="M12,6.38c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.64 14.43,2.82 12,2.82c-3.98,0 -7.6,1.92 -9.08,4.2l3.7,2.88C7.33,7.96 9.32,6.38 12,6.38z" fill="#EA4335" />
            </g>
          </svg>
          Continue with Google
        </button>

        {/* Registration Link */}
        <p className="mt-6 text-center text-xs text-slate-500" id="login-footer">
          Don't have an administrative account?{" "}
          <button 
            type="button" 
            id="register-redirect-link"
            onClick={() => onNavigate("register")}
            className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Register Here
          </button>
        </p>

      </div>

      {/* Google Sign-In Interactive Fallback Role Selector Dialog (Required for Sandboxed Iframe Previews) */}
      {googleRoleSelectorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="google-role-modal">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold">Iframe Sandbox Support</span>
              <h3 className="text-lg font-black text-slate-800">Assign Sign-In Role</h3>
              <p className="text-xs text-slate-400">Select which governance persona role to claim on this simulated Google Single-Sign-On token.</p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button 
                onClick={() => handleSelectGoogleRole("Citizen")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 cursor-pointer font-bold text-xs text-slate-700 transition-all flex justify-between items-center"
              >
                <span>Citizen (Local Ward Resident)</span>
                <span className="text-[10px] text-slate-400 uppercase">&rarr;</span>
              </button>
              <button 
                onClick={() => handleSelectGoogleRole("MP")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 cursor-pointer font-bold text-xs text-slate-700 transition-all flex justify-between items-center"
              >
                <span>Member of Parliament (Hon. MP)</span>
                <span className="text-[10px] text-slate-400 uppercase">&rarr;</span>
              </button>
              <button 
                onClick={() => handleSelectGoogleRole("Department Officer")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 cursor-pointer font-bold text-xs text-slate-700 transition-all flex justify-between items-center"
              >
                <span>Nodal Department Officer</span>
                <span className="text-[10px] text-slate-400 uppercase">&rarr;</span>
              </button>
              <button 
                onClick={() => handleSelectGoogleRole("Administrator")}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 cursor-pointer font-bold text-xs text-slate-700 transition-all flex justify-between items-center"
              >
                <span>System Administrator (Root)</span>
                <span className="text-[10px] text-slate-400 uppercase">&rarr;</span>
              </button>
            </div>

            <button 
              onClick={() => setGoogleRoleSelectorOpen(false)}
              className="w-full text-center py-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
