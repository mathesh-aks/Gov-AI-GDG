import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { 
  Sparkles, 
  Mail, 
  AlertCircle, 
  Loader2,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

const forgotSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Please enter a valid email address" })
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

interface ForgotPasswordProps {
  onNavigate: (page: any) => void;
}

export default function ForgotPasswordPage({ onNavigate }: ForgotPasswordProps) {
  const { resetPassword } = useAuth();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setGeneralError(null);
    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (error: any) {
      console.error("Password reset failed", error);
      if (error.message && error.message.includes("auth/user-not-found")) {
        setGeneralError("No user profile found matching this email address.");
      } else {
        setGeneralError(error.message || "An error occurred. Please verify your connection.");
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12" id="forgot-password-container">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 relative overflow-hidden" id="forgot-password-card">
        
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Back Button */}
        <button 
          onClick={() => onNavigate("login")}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-semibold cursor-pointer"
          id="back-to-login-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8" id="forgot-password-header">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100 shadow-xs">
            <Sparkles className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recover Password</h2>
            <p className="text-xs text-slate-400">Request a safe recovery credentials link to your registered inbox</p>
          </div>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-4" id="forgot-success-view">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-800">Recovery Link Dispatched</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                If the email address exists in our secure directory registry, a password recovery link has been dispatched to it.
              </p>
            </div>
            <button 
              onClick={() => onNavigate("login")}
              className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              Sign In Now
            </button>
          </div>
        ) : (
          <>
            {/* Error Alert */}
            {generalError && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex items-start gap-2" id="forgot-error-alert">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{generalError}</span>
              </div>
            )}

            {/* Forgot Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="forgot-password-form">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    id="email-input"
                    type="email" 
                    placeholder="Enter registered email" 
                    {...register("email")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                {errors.email && (
                  <span className="text-[10px] text-rose-600 font-semibold">{errors.email.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                id="forgot-submit-button"
                disabled={isSubmitting}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-indigo-100"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Dispatch Recovery Link</span>
                )}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
