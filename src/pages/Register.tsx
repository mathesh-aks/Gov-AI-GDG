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
  User, 
  Briefcase, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["Citizen", "MP", "Department Officer", "Administrator"])
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterProps {
  onNavigate: (page: any) => void;
}

export default function RegisterPage({ onNavigate }: RegisterProps) {
  const { register: authRegister } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "Citizen"
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setGeneralError(null);
    try {
      await authRegister(data.email, data.password, data.name, data.role);
      setSuccess(true);
      setTimeout(() => {
        // Redirect to appropriate portal based on role
        switch (data.role) {
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
      }, 1500);
    } catch (error: any) {
      console.error("Registration failed", error);
      if (error.code === "auth/email-already-in-use") {
        setGeneralError("An account with this email address already exists. Try signing in.");
      } else {
        setGeneralError(error.message || "An unexpected error occurred during profile registration.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12" id="register-container">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden" id="register-card">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div className="text-center space-y-2 mb-8" id="register-header">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
            <Sparkles className="h-6 w-6 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Register Governance Account</h2>
            <p className="text-xs text-slate-400">Join GovAI Connect to synchronize planning and community reports</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4" id="register-success">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Account Created Successfully!</h3>
              <p className="text-xs text-slate-400">Saving profile parameters & preparing secure gateway...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {generalError && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start gap-2" id="register-error-alert">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="register-form">
              
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    id="name-input"
                    type="text" 
                    placeholder="Enter full name" 
                    {...register("name")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                {errors.name && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.name.message}</span>
                )}
              </div>

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
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    id="password-input"
                    type="password" 
                    placeholder="Create secure password" 
                    {...register("password")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                {errors.password && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.password.message}</span>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Governance Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select 
                    id="role-select"
                    {...register("role")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
                  >
                    <option value="Citizen">Citizen (Local Resident)</option>
                    <option value="MP">Member of Parliament (MP Office)</option>
                    <option value="Department Officer">Zonal Department Officer</option>
                    <option value="Administrator">Administrator Core Unit</option>
                  </select>
                </div>
                {errors.role && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.role.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                id="register-submit-button"
                disabled={isSubmitting}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Sign-In link */}
            <p className="mt-6 text-center text-xs text-slate-500" id="register-footer">
              Already have an administrative account?{" "}
              <button 
                type="button" 
                id="login-redirect-link"
                onClick={() => onNavigate("login")}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}
