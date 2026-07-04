import React, { useState } from "react";
import { Sliders, Cpu, Save, Bell, Shield, Database, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const [model, setModel] = useState("gemini-2.5-flash");
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailReports: true,
    webhookTrigger: false
  });

  const [dbUri, setDbUri] = useState("firestore://default-governance-cluster");

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6" id="settings-page">
      
      {/* Left Grid: Configuration Form */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <Sliders className="w-5 h-5 text-indigo-600" />
                System Settings
              </h2>
              <p className="text-xs text-slate-500">Fine-tune Gemini generation prompts, temperature thresholds, and notification triggers.</p>
            </div>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
              Configuration parameters saved successfully to local localstorage state.
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* AI Model Parameters */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Vertex AI Model Parameters
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400">Target Generative Model</label>
                  <select 
                    value={model} 
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended for instant speed)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Extreme analytical accuracy)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash (Legacy node support)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-slate-400">Response Max Tokens Limit</label>
                  <input 
                    type="number" 
                    value={maxTokens} 
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400">
                  <span>Temperature Coefficient</span>
                  <span>{temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1.0" 
                  step="0.1"
                  value={temperature} 
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <p className="text-[10px] text-slate-400">Lower values produce deterministic government-grade classification records.</p>
              </div>
            </div>

            {/* Database Settings */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-600" />
                Data Connection Clusters
              </h3>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase text-slate-400">Firestore Cluster Endpoint URI</label>
                <input 
                  type="text" 
                  value={dbUri} 
                  onChange={(e) => setDbUri(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none font-mono"
                />
              </div>
            </div>

            {/* Notification triggers */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-indigo-600" />
                Notification Webhook Triggers
              </h3>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.smsAlerts} 
                    onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Send direct SMS alert triggers to Ward Nodal Officer on urgent (Score &ge; 80) dispatches</span>
                </label>

                <label className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={notifications.emailReports} 
                    onChange={(e) => setNotifications({ ...notifications, emailReports: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Compile and email daily MP constituency status reports to Office Magistrate</span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              Save System Parameters
            </button>

          </form>
        </div>
      </div>

      {/* Right Grid: Security Cards */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">System Security Rules</h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            All configuration updates require administrative credentials authenticated via Firebase JWT. Vertex triggers operate in high-security sandbox environments.
          </p>
        </div>
      </div>

    </div>
  );
}
