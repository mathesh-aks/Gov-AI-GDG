import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  Settings, 
  Sliders, 
  Wrench, 
  Truck, 
  Activity, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { ActionLog } from "../types";

export default function DepartmentPage() {
  const [activeDept, setActiveDept] = useState("Water Resources");

  // Mock department loads and rosters
  const departments = [
    { name: "Water Resources", activeIssues: 2, staffOnField: 14, responseTime: "3.5h", icon: Building2 },
    { name: "Power Grid Division", activeIssues: 1, staffOnField: 8, responseTime: "2.1h", icon: Sliders },
    { name: "Public Works Department", activeIssues: 1, staffOnField: 22, responseTime: "5.8h", icon: Wrench },
    { name: "Sanitation Board", activeIssues: 0, staffOnField: 35, responseTime: "1.4h", icon: Truck }
  ];

  // Dispatched work orders (local simulated state)
  const [workOrders, setWorkOrders] = useState<ActionLog[]>([
    {
      id: "WO-201",
      complaintId: "COMP-001",
      taskTitle: "Ward 15 Aqueduct Renovation",
      actionTaken: "Deploy 4 heavy water tenders to southern sector blocks. Coordinate maintenance crew to localize trunk pipeline joint leak.",
      executedBy: "Water Resources Zonal Head",
      status: "In Progress",
      timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
    },
    {
      id: "WO-202",
      complaintId: "COMP-003",
      taskTitle: "Ward 14 Pressure Joint Valve Seal",
      actionTaken: "Locate and replace rusted pressure release valve. Clear blocked secondary pipeline drainage outlet.",
      executedBy: "Water Resources Zonal Head",
      status: "Completed",
      timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
    }
  ]);

  const handleUpdateStatus = (id: string, nextStatus: "In Progress" | "Completed") => {
    setWorkOrders(workOrders.map(wo => {
      if (wo.id === id) {
        return { ...wo, status: nextStatus };
      }
      return wo;
    }));
  };

  return (
    <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6" id="department-portal-page">
      
      {/* Sidebar: Department List */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Nodal Zonal Offices
          </h2>
          <p className="text-[11px] text-slate-500">Select which department board to inspect and manage in real-time.</p>
        </div>

        <div className="space-y-3">
          {departments.map((dept) => {
            const IconComp = dept.icon;
            const isActive = activeDept === dept.name;
            return (
              <button
                key={dept.name}
                onClick={() => setActiveDept(dept.name)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  isActive 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isActive ? "bg-indigo-500 text-white" : "bg-indigo-50 text-indigo-600"}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs">{dept.name}</h3>
                    <p className={`text-[10px] ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                      {dept.staffOnField} officers deployed on field
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    isActive ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-600"
                  }`}>
                    {dept.activeIssues} Open
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live operational load indicators */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Activity className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Field Fleet Utilization</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Heavy Repair Vehicles</span>
                <span className="font-bold">85% deployed</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[85%]"></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Water Tankers</span>
                <span className="font-bold">40% deployed</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full w-[40%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Dispatched Tasks & Updates */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4 flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">{activeDept} Work Order Command</h3>
              <p className="text-xs text-slate-500">Live operational panel synced with MP Command Center dispatch triggers.</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
              API Webhook Online
            </span>
          </div>

          {/* Task Feed */}
          <div className="space-y-4">
            {activeDept !== "Water Resources" ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-500">No active dispatches routed to this department at this hour.</p>
              </div>
            ) : (
              workOrders.map(wo => (
                <div key={wo.id} className="p-5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-3">
                  <div className="flex justify-between items-start gap-4 flex-wrap">
                    <div>
                      <span className="font-mono text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">{wo.id}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-1">{wo.taskTitle}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                        wo.status === "Completed" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800 animate-pulse"
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed font-sans">{wo.actionTaken}</p>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/40 text-[10px] text-slate-400">
                    <span>Dispatched {new Date(wo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    <div className="flex gap-2">
                      {wo.status === "In Progress" ? (
                        <button 
                          onClick={() => handleUpdateStatus(wo.id, "Completed")}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold cursor-pointer transition-all"
                        >
                          Mark Completed
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(wo.id, "In Progress")}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded font-bold cursor-pointer transition-all"
                        >
                          Reopen Task
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
