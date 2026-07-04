import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Terminal, 
  Settings, 
  RefreshCw, 
  Cpu, 
  Globe, 
  HardDrive, 
  Activity, 
  Database,
  Lock,
  UserCheck
} from "lucide-react";

export default function AdminPage() {
  const [logs, setLogs] = useState([
    { timestamp: "08:51:24", service: "Vertex AI", type: "POST", message: "Processed Hindi transcription audio payload COMP-001 (Success)", status: 200 },
    { timestamp: "08:51:25", service: "Firestore", type: "SET", message: "Wrote document /complaints/COMP-001 in 32ms", status: 200 },
    { timestamp: "08:52:10", service: "Vertex AI", type: "POST", message: "Identified redundant duplicate mapping (COMP-003 -> COMP-001)", status: 200 },
    { timestamp: "08:53:11", service: "Firebase Auth", type: "GET", message: "Validated JWT credentials for Hon. Rajesh Kumar", status: 200 }
  ]);

  const [systemOnline, setSystemOnline] = useState(true);

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6" id="admin-page">
      
      {/* Left Grid: Core Health Metrics */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                Administrative Command Panel
              </h2>
              <p className="text-xs text-slate-500">Configure core Vertex routing rules, system parameters, and language transcription matrices.</p>
            </div>
            <button 
              onClick={() => setSystemOnline(!systemOnline)} 
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                systemOnline ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              {systemOnline ? "System: Active" : "System: Paused"}
            </button>
          </div>

          {/* Infrastructure Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">99.9%</span>
              </div>
              <h4 className="font-bold text-xs text-slate-700">Vertex AI API Gateway</h4>
              <p className="text-[10px] text-slate-500">Latency: 242ms avg response. Translation nodes active.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <Database className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <h4 className="font-bold text-xs text-slate-700">Firestore Instance</h4>
              <p className="text-[10px] text-slate-500">Storage utilization: 1.2 GB of 5.0 GB active.</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <Lock className="w-4 h-4 text-indigo-600" />
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">SECURED</span>
              </div>
              <h4 className="font-bold text-xs text-slate-700">Firebase Authentication</h4>
              <p className="text-[10px] text-slate-500">Secured with SHA-256 JWT encryption rules.</p>
            </div>
          </div>

          {/* Real-time audit logs terminal */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Live API Transaction Audit</h3>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-2.5 overflow-x-auto min-h-[180px]">
              {logs.map((log, index) => (
                <div key={index} className="flex gap-4">
                  <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                  <span className="text-indigo-400 font-semibold shrink-0">[{log.service}]</span>
                  <span className="text-amber-400 shrink-0">{log.type}</span>
                  <span className="text-slate-200 leading-tight">{log.message}</span>
                  <span className="ml-auto text-emerald-400 font-bold">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Grid: Access controls and language parameters */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Language mapping dashboard card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Language Mapping Indices</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Hindi (हिंदी) node</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Tamil (தமிழ்) node</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Telugu (తెలుగు) node</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Security Access configuration roles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Access Control Roles</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg">
              <p className="font-bold text-slate-800">Hon. Member of Parliament</p>
              <p className="text-[10px] text-slate-400">Total permission: Executive read-write-dispatch authority</p>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg">
              <p className="font-bold text-slate-800">Zonal Nodal Officer</p>
              <p className="text-[10px] text-slate-400">Total permission: Field order read-execute authority</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
