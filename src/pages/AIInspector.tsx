import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Cpu, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Copy, 
  Check, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Bookmark, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  User,
  Activity,
  Award,
  Database
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AIPipelineOutput, PipelineStageLog } from "../../server/aiPipeline";

interface SeedPayload {
  name: string;
  title: string;
  description: string;
  location: string;
  ward: string;
  language: string;
  attachmentsCount: number;
  voiceTranscript?: string;
  citizenName: string;
}

const PRE_SEEDED_PAYLOADS: SeedPayload[] = [
  {
    name: "Ward 15 Water Pipeline Leak (Hindi)",
    title: "Drinking water pipeline leak causing dry taps in Ward 15",
    description: "हमारे इलाके वार्ड 15 में पिछले 5 दिनों से पीने का पानी नहीं आ रहा है। पाइपलाइन में कुछ लीकेज है। बच्चे और बुजुर्ग बहुत परेशान हैं। कृपया जल टैंकर भेजें।",
    location: "Ward 15 (South Sector)",
    ward: "Ward 15",
    language: "Hindi",
    attachmentsCount: 2,
    voiceTranscript: "We have had zero water supply for 5 days. Old people are suffering. Help us quickly.",
    citizenName: "Anil Deshmukh"
  },
  {
    name: "Main Sector Streetlight Outage (English)",
    title: "Blackout due to blown transformers on Main Sector Road",
    description: "Main Sector road streetlights have been completely dark for over two weeks. This is very unsafe for commuters returning home after 8 PM, especially women. Several minor thefts have been reported near the junction.",
    location: "Main Sector Road",
    ward: "Ward 12",
    language: "English",
    attachmentsCount: 1,
    citizenName: "Siddharth Menon"
  },
  {
    name: "Ward 14 Pipeline Rupture (Telugu)",
    title: "Broken drinking water pipeline leaking into wastewater drain",
    description: "వార్డు 14 లో పైప్‌లైన్ పగిలిపోయి మంచినీరంతా మురుగు కాలువలోకి వృధాగా పోతోంది. ప్రెషర్ అస్సలు లేదు.",
    location: "Ward 14 (East Sector)",
    ward: "Ward 14",
    language: "Telugu",
    attachmentsCount: 0,
    voiceTranscript: "Water is wasting into drainage pipeline. Fix it.",
    citizenName: "Meenakshi Sundaram"
  },
  {
    name: "Club Road Sanitation & Garbage Piles (Malayalam)",
    title: "Garbage accumulation and mosquito infestation on Club Road",
    description: "ക്ലബ്ബ് റോഡിൽ മാലിന്യം വൻതോതിൽ കെട്ടിക്കിടക്കുന്നു. മുൻസിപ്പൽ വണ്ടികൾ ആഴ്ചയിൽ ഒരിക്കൽ മാത്രമാണ് വരുന്നത്. കൊതുക് ശല്യം രൂക്ഷമാണ്.",
    location: "Lake View Garden Colony",
    ward: "Ward 18",
    language: "Malayalam",
    attachmentsCount: 3,
    citizenName: "Gopal Kurup"
  }
];

const STAGE_METADATA = [
  { id: 1, name: "Language Detection", desc: "Detects the primary submission tongue" },
  { id: 2, name: "English Translation", desc: "Translates vernacular input to administrative English" },
  { id: 3, name: "Complaint Classification", desc: "Categorizes into core municipal sectors" },
  { id: 4, name: "Entity Extraction", desc: "Extracts road names, schools, hospitals, offices" },
  { id: 5, name: "Duplicate Detection Prep", desc: "Generates semantic signature & indexing keywords" },
  { id: 6, name: "Severity Analysis", desc: "Assesses risk factors, civil hazards & scale" },
  { id: 7, name: "Priority Score", desc: "Evaluates standard urgency metrics (0-100)" },
  { id: 8, name: "Department Routing", desc: "Recommends exact operational department" },
  { id: 9, name: "Executive Summary", desc: "Generates concise summary and MP actions" },
  { id: 10, name: "QA & Confidence Assessment", desc: "Verifies processing confidence & factors" }
];

export default function AIInspector() {
  const [selectedSeedIndex, setSelectedSeedIndex] = useState<number>(0);
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [customWard, setCustomWard] = useState("");
  const [customLanguage, setCustomLanguage] = useState("English");
  const [customAttachments, setCustomAttachments] = useState(0);
  const [customVoice, setCustomVoice] = useState("");
  const [customCitizen, setCustomCitizen] = useState("");
  const [useCustomPayload, setUseCustomPayload] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentActiveStage, setCurrentActiveStage] = useState<number | null>(null);
  const [stageStatuses, setStageStatuses] = useState<Record<number, "idle" | "running" | "completed" | "failed">>({});
  const [pipelineResult, setPipelineResult] = useState<AIPipelineOutput | null>(null);
  const [expandedStageIndex, setExpandedStageIndex] = useState<number | null>(null);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load selected seed payload
  const activePayload = useCustomPayload ? {
    title: customTitle,
    description: customDesc,
    location: customLocation,
    ward: customWard,
    language: customLanguage,
    attachmentsCount: customAttachments,
    voiceTranscript: customVoice,
    citizenName: customCitizen || "Anonymous Citizen"
  } : PRE_SEEDED_PAYLOADS[selectedSeedIndex];

  // Quick seed loader
  const handleLoadSeed = (idx: number) => {
    setSelectedSeedIndex(idx);
    setUseCustomPayload(false);
  };

  const handleCopyJson = () => {
    if (!pipelineResult) return;
    navigator.clipboard.writeText(JSON.stringify(pipelineResult, null, 2));
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  const triggerPipeline = async () => {
    setIsProcessing(true);
    setErrorMsg(null);
    setPipelineResult(null);
    setExpandedStageIndex(null);

    // Initialize all stage statuses to idle
    const initialStatuses: Record<number, "idle" | "running" | "completed" | "failed"> = {};
    STAGE_METADATA.forEach((s) => {
      initialStatuses[s.id] = "idle";
    });
    setStageStatuses(initialStatuses);

    try {
      // 1. Hit the backend endpoint to run the actual AI pipeline
      const response = await fetch("/api/ai-pipeline/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activePayload.title,
          description: activePayload.description,
          language: activePayload.language,
          location: activePayload.location,
          ward: activePayload.ward,
          attachmentsCount: activePayload.attachmentsCount,
          voiceTranscript: activePayload.voiceTranscript,
          citizenProfile: { fullName: activePayload.citizenName }
        })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Failed to process AI pipeline on the server");
      }

      const result: AIPipelineOutput = resData.data;

      // 2. Play a staggered UI animation matching the stages list
      for (let i = 1; i <= 10; i++) {
        setCurrentActiveStage(i);
        setStageStatuses(prev => ({ ...prev, [i]: "running" }));
        
        // Stagger visual progress
        await new Promise((resolve) => setTimeout(resolve, 400));
        
        setStageStatuses(prev => ({ ...prev, [i]: "completed" }));
      }

      setCurrentActiveStage(null);
      setPipelineResult(result);
    } catch (err: any) {
      console.error("AI Pipeline process failure:", err);
      setErrorMsg(err.message || "An error occurred during pipeline execution.");
      
      // Mark current stage as failed
      if (currentActiveStage) {
        setStageStatuses(prev => ({ ...prev, [currentActiveStage]: "failed" }));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Pre-fill custom form when switching to custom mode
  useEffect(() => {
    if (useCustomPayload && !customTitle) {
      const seed = PRE_SEEDED_PAYLOADS[0];
      setCustomTitle(seed.title);
      setCustomDesc(seed.description);
      setCustomLocation(seed.location);
      setCustomWard(seed.ward);
      setCustomLanguage(seed.language);
      setCustomAttachments(seed.attachmentsCount);
      setCustomVoice(seed.voiceTranscript || "");
      setCustomCitizen(seed.citizenName);
    }
  }, [useCustomPayload]);

  return (
    <div className="flex-1 min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden flex flex-col" id="ai-inspector-root">
      {/* Absolute ambient lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 flex-1 flex flex-col z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs uppercase font-black tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Milestone 4 Engine
              </span>
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-xs text-slate-400 font-bold font-mono">Server Status: Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Cpu className="w-8 h-8 text-indigo-400" />
              AI Intelligence Pipeline Inspector
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Inspect, analyze, and verify every processing stage of GovAI Connect's modular 10-stage grievance parsing pipeline in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={triggerPipeline}
              disabled={isProcessing}
              className={`px-5 py-2.5 min-h-[44px] bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-900/40 border border-indigo-500/20`}
              id="execute-pipeline-btn"
            >
              {isProcessing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  Run AI Pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <p className="font-extrabold">Pipeline Execution Failure</p>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1">
          
          {/* Left Panel: Input Configuration (4 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Seed / Custom Selection Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5 shrink-0">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    Select Grievance Source
                  </h2>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 shrink-0">
                    <button
                      onClick={() => setUseCustomPayload(false)}
                      className={`px-2.5 min-h-[44px] sm:min-h-[auto] py-1 text-xs font-black tracking-wider rounded-md uppercase transition-all flex items-center justify-center ${!useCustomPayload ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Seeds
                    </button>
                    <button
                      onClick={() => setUseCustomPayload(true)}
                      className={`px-2.5 min-h-[44px] sm:min-h-[auto] py-1 text-xs font-black tracking-wider rounded-md uppercase transition-all flex items-center justify-center ${useCustomPayload ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Custom
                    </button>
                  </div>
                </div>
              </div>

              {!useCustomPayload ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">Select an authentic multi-lingual constituency grievance record to feed the engine:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {PRE_SEEDED_PAYLOADS.map((payload, idx) => {
                      const isSelected = selectedSeedIndex === idx && !useCustomPayload;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleLoadSeed(idx)}
                          className={`text-left p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                            isSelected 
                              ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-bold" 
                              : "bg-slate-950/50 border-slate-850 hover:bg-slate-900 text-slate-400"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <span className={`font-black tracking-tight leading-tight ${isSelected ? "text-white" : "text-slate-300"}`}>{payload.name}</span>
                            <span className="px-2 py-0.5 min-h-[20px] flex items-center justify-center text-xs bg-slate-800 text-slate-400 rounded-md font-mono shrink-0">{payload.language}</span>
                          </div>
                          <p className="line-clamp-2 text-xs opacity-80 font-normal leading-relaxed">{payload.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Citizen Name</label>
                      <input
                        type="text"
                        value={customCitizen}
                        onChange={(e) => setCustomCitizen(e.target.value)}
                        placeholder="e.g. Anil Deshmukh"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Preferred Language</label>
                      <select
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-semibold text-slate-300"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                        <option>Malayalam</option>
                        <option>Kannada</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-black text-slate-400">Grievance Issue Title</label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="e.g. Major water leak on sector road"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-semibold text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-black text-slate-400">Grievance Description (Can be in regional script)</label>
                    <textarea
                      value={customDesc}
                      onChange={(e) => setCustomDesc(e.target.value)}
                      placeholder="Enter complaint text details..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px].5 text-xs focus:outline-none focus:border-indigo-500 leading-relaxed font-normal text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Location Area</label>
                      <input
                        type="text"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        placeholder="e.g. Ward 15 South Corridor"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-200"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Ward Number</label>
                      <input
                        type="text"
                        value={customWard}
                        onChange={(e) => setCustomWard(e.target.value)}
                        placeholder="e.g. Ward 15"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Evidence Count</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={customAttachments}
                        onChange={(e) => setCustomAttachments(parseInt(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs uppercase font-black text-slate-400">Voice Transcript (Optional)</label>
                      <input
                        type="text"
                        value={customVoice}
                        onChange={(e) => setCustomVoice(e.target.value)}
                        placeholder="e.g. Water is leaking since Monday..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 min-h-[44px] text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Structured Complaint Payload Inspector Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs uppercase font-black tracking-wider text-slate-400 flex items-center gap-2 break-words">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                Input Payload Inspection
              </h3>
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-xs sm:text-xs overflow-x-auto max-w-full max-h-72 text-indigo-300 custom-scrollbar">
                <pre className="whitespace-pre-wrap break-words">{JSON.stringify({
                  issueTitle: activePayload.title,
                  description: activePayload.description,
                  language: activePayload.language,
                  location: activePayload.location,
                  ward: activePayload.ward,
                  citizenProfile: {
                    fullName: activePayload.citizenName,
                  },
                  attachments: activePayload.attachmentsCount > 0 ? Array(activePayload.attachmentsCount).fill(0).map((_, i) => `evidence_photo_${i + 1}.png`) : [],
                  voiceTranscript: activePayload.voiceTranscript || null,
                  timestamp: new Date().toISOString()
                }, null, 2)}</pre>
              </div>
            </div>

          </div>

          {/* Right Panel: AI Processing Pipeline & Step Visualizer (7 Columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 10-Stage Pipeline Flow */}
            <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-2 border-b border-slate-800">
                <h2 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400 animate-pulse shrink-0" />
                  Engine Pipelines Steps
                </h2>
                {isProcessing && (
                  <span className="text-xs font-mono text-indigo-400 font-bold flex items-center gap-1.5 animate-pulse break-words">
                    Stage {currentActiveStage} processing...
                  </span>
                )}
              </div>

              {/* Progress Tracker Slider Bar */}
              <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300"
                  style={{ 
                    width: `${
                      isProcessing && currentActiveStage ? (currentActiveStage / 10) * 100 : pipelineResult ? 100 : 0
                    }%` 
                  }}
                ></div>
              </div>

              {/* Staggered Steps Grid */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {STAGE_METADATA.map((stage) => {
                  const status = stageStatuses[stage.id] || "idle";
                  const isCurrent = currentActiveStage === stage.id;
                  const log = pipelineResult?.stagesLog.find(l => l.stageName === stage.name);
                  
                  return (
                    <div 
                      key={stage.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? "bg-indigo-950/25 border-indigo-500/60 ring-1 ring-indigo-500/30" 
                          : status === "completed" 
                            ? "bg-slate-900/60 border-slate-800/80" 
                            : "bg-slate-950/40 border-slate-900"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Number Indicator */}
                          <div className={`w-6 h-6 shrink-0 rounded-full font-mono text-xs font-black flex items-center justify-center ${
                            isCurrent 
                              ? "bg-indigo-500 text-white" 
                              : status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-900 text-slate-500 border border-slate-850"
                          }`}>
                            {stage.id}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-bold leading-tight truncate ${isCurrent ? "text-white" : status === "completed" ? "text-slate-200" : "text-slate-500"}`}>
                              {stage.name}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{stage.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto ml-9 sm:ml-0">
                          {log && (
                            <span className="text-xs font-mono text-slate-500 font-semibold">
                              {log.durationMs}ms
                            </span>
                          )}

                          {status === "completed" && (
                            <span className="flex items-center gap-1">
                              <span className="px-1.5 py-0.5 text-xs bg-emerald-500/10 text-emerald-400 font-extrabold rounded-sm uppercase tracking-wide border border-emerald-500/20">
                                {log?.status === "Simulated" ? "SIMULATED" : "GEMINI"}
                              </span>
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            </span>
                          )}

                          {status === "running" && (
                            <div className="relative w-4 h-4 flex items-center justify-center">
                              <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
                              <div className="absolute inset-0 border-2 border-t-indigo-400 rounded-full animate-spin"></div>
                            </div>
                          )}

                          {status === "idle" && (
                            <span className="text-xs text-slate-600 font-bold uppercase font-mono">Idle</span>
                          )}

                          {status === "failed" && (
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Results Section (Appears after execution completes) */}
        <AnimatePresence>
          {pipelineResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
              id="ai-results-panel"
            >
              
              {/* Executive Summary & Severity Badges Header Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Executive Summary Card (8 Columns) */}
                <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <h3 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 break-words leading-tight">
                        <FileText className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                        Executive Intelligence Summary (MP Briefing)
                      </h3>
                      <span className="px-2.5 py-1 text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full shrink-0 w-fit self-start sm:self-auto">
                        Form-Ready
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                      {pipelineResult.executiveSummary}
                    </p>

                    <div className="space-y-2">
                      <h4 className="text-xs uppercase font-black tracking-wide text-slate-400">Recommended Executive Actions</h4>
                      <div className="grid grid-cols-1 gap-1.5">
                        {pipelineResult.executiveActionItems.map((action, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="w-4 h-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs font-bold flex items-center justify-center text-indigo-400 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed font-medium">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score & KPI Metres (4 Columns) */}
                <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-6">
                  
                  {/* Priority score & Severity */}
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase font-black text-slate-400">Pipeline Outputs</span>
                      <span className="text-xs text-indigo-400 font-mono font-bold">Time: {pipelineResult.processingTimeMs}ms</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Priority gauge */}
                      <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl text-center flex flex-col items-center justify-center">
                        <span className="text-xs uppercase font-black tracking-wider text-slate-500 mb-2">Priority Score</span>
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          {/* Circle background */}
                          <svg className="absolute w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="#1e293b" strokeWidth="4" fill="transparent" />
                            <circle 
                              cx="32" 
                              cy="32" 
                              r="28" 
                              stroke="#6366f1" 
                              strokeWidth="4" 
                              fill="transparent" 
                              strokeDasharray="175.9"
                              strokeDashoffset={175.9 - (175.9 * pipelineResult.priorityScore) / 100}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="text-lg font-black font-mono tracking-tight text-white">{pipelineResult.priorityScore}</span>
                        </div>
                        <span className="text-xs bg-slate-900 border border-slate-800 text-slate-400 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wide mt-2 leading-none">
                          0-100 Range
                        </span>
                      </div>

                      {/* Severity level */}
                      <div className="bg-slate-950 p-4 border border-slate-900 rounded-xl text-center flex flex-col items-center justify-center">
                        <span className="text-xs uppercase font-black tracking-wider text-slate-500 mb-2">Severity Level</span>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 relative">
                          <AlertTriangle className={`w-7 h-7 ${
                            pipelineResult.severity === "Critical" 
                              ? "text-red-400 animate-pulse" 
                              : pipelineResult.severity === "High"
                                ? "text-orange-400"
                                : pipelineResult.severity === "Medium"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                          }`} />
                        </div>
                        <span className="text-xs font-black text-white mt-2 leading-none uppercase tracking-wide">
                          {pipelineResult.severity}
                        </span>
                      </div>
                    </div>

                    {/* Department Recommendation Badge */}
                    <div className="bg-indigo-950/20 p-4 border border-indigo-500/15 rounded-xl space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs uppercase font-black tracking-wider text-indigo-400">
                        <Building2 className="w-3.5 h-3.5" />
                        Recommended Department
                      </div>
                      <p className="text-xs font-extrabold text-white leading-tight">
                        {pipelineResult.recommendedDepartment}
                      </p>
                      <div className="space-y-0.5">
                        {pipelineResult.departmentRoutingRules.map((rule, idx) => (
                          <p key={idx} className="text-xs text-slate-400 font-medium leading-relaxed">
                            • {rule}
                          </p>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Middle Breakdown: Language, Entities, Severity Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Language translation diagnostics card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Vernacular & Translation Diagnostics
                  </h4>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Detected Language</span>
                      <span className="font-extrabold text-white">{pipelineResult.detectedLanguage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence Accuracy</span>
                      <span className="font-extrabold text-white font-mono">{Math.round(pipelineResult.languageConfidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-slate-400 shrink-0">Original Categories</span>
                      <span className="font-extrabold text-indigo-300 uppercase tracking-wide text-xs bg-indigo-500/15 border border-indigo-500/25 px-2 py-0.5 rounded-md text-right break-words">
                        {pipelineResult.detectedCategory}
                      </span>
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-slate-850">
                      <p className="text-xs uppercase font-black text-slate-500">Translated text fragment</p>
                      <p className="text-xs text-slate-300 italic font-normal line-clamp-3 leading-relaxed">
                        "{pipelineResult.translatedText}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Extracted Entities Card */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    Geographical & Administrative Entities
                  </h4>
                  <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                    {/* Roads and villages */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase font-black text-slate-500">Villages / Sectors / Wards</span>
                      {pipelineResult.extractedEntities.villages.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pipelineResult.extractedEntities.villages.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-xs text-slate-300 font-medium">{v}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium">None detected</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase font-black text-slate-500">Roads / Streets</span>
                      {pipelineResult.extractedEntities.roadNames.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pipelineResult.extractedEntities.roadNames.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-xs text-slate-300 font-medium">{r}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium">None detected</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase font-black text-slate-500">Key Landmarks & Offices</span>
                      {pipelineResult.extractedEntities.landmarks.length > 0 || pipelineResult.extractedEntities.governmentOffices.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {[...pipelineResult.extractedEntities.governmentOffices, ...pipelineResult.extractedEntities.landmarks].map((l, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-xs text-slate-300 font-medium">{l}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600 font-medium">None detected</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Indexing & Duplicate Detection Prep */}
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <Bookmark className="w-4 h-4 text-indigo-400" />
                    Duplicate prep & Indexing tags
                  </h4>
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-xs uppercase font-black text-slate-500">Semantic issue signature</span>
                      <p className="bg-slate-950 p-2 border border-slate-850 rounded-lg text-indigo-300 font-mono text-xs font-bold break-all">
                        {pipelineResult.duplicatePrep.issueSignature}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-xs uppercase font-black text-slate-500">Search keywords & tokens</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pipelineResult.duplicatePrep.searchKeywords.map((tag, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded-md text-xs font-mono text-slate-400">
                            #{tag.toLowerCase().replace(/\s+/g, '_')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Confidence analysis & Unified JSON block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Confidence audit factors (4 Columns) */}
                <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 pb-2.5 border-b border-slate-800">
                    <Award className="w-4 h-4 text-indigo-400" />
                    Engine Confidence Audit
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-950 p-3 border border-slate-900 rounded-xl">
                      <span className="text-xs text-slate-400 font-medium">Aggregated Score</span>
                      <span className="text-base font-black text-emerald-400 font-mono">
                        {(pipelineResult.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs uppercase font-black tracking-wider text-slate-500">Weighted QA Factors</span>
                      <div className="space-y-1.5">
                        {pipelineResult.confidenceFactors.map((factor, i) => (
                          <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">•</span>
                            <span className="leading-relaxed">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unified Output JSON (8 Columns) */}
                <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                    <h4 className="text-xs uppercase font-black tracking-wider text-slate-300 flex items-center gap-2 break-words">
                      <Database className="w-4 h-4 text-indigo-400 shrink-0" />
                      Unified Structured JSON Output
                    </h4>
                    <button
                      onClick={handleCopyJson}
                      className="px-2.5 py-1 min-h-[44px] sm:min-h-[auto] text-xs font-black tracking-wider rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white uppercase transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedOutput ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Output
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-900 font-mono text-xs sm:text-xs overflow-x-auto max-w-full max-h-[350px] text-emerald-300 custom-scrollbar">
                    <pre className="whitespace-pre-wrap break-words">{JSON.stringify({
                      originalLanguage: pipelineResult.originalLanguage,
                      translatedText: pipelineResult.translatedText,
                      detectedCategory: pipelineResult.detectedCategory,
                      extractedEntities: pipelineResult.extractedEntities,
                      severity: pipelineResult.severity,
                      priorityScore: pipelineResult.priorityScore,
                      recommendedDepartment: pipelineResult.recommendedDepartment,
                      executiveSummary: pipelineResult.executiveSummary,
                      confidenceScore: pipelineResult.confidenceScore,
                      processingTime: `${pipelineResult.processingTimeMs}ms`
                    }, null, 2)}</pre>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info banner */}
        <div className="pt-6 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-600 uppercase font-black tracking-widest leading-none">
            GovAI Connect AI Processing Suite • Strictly Confidential Administrative Intelligence
          </p>
        </div>

      </div>
    </div>
  );
}
