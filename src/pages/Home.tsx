import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ArrowRight, 
  Languages, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Activity, 
  MessageSquare,
  BarChart3,
  Bot,
  BrainCircuit,
  TrendingUp,
  FileText,
  Award,
  Globe,
  Database,
  CheckCircle2,
  Lock
} from "lucide-react";
import { PageId } from "../types";

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 overflow-x-hidden font-sans" id="home-page-container">
      
      {/* Hackathon Challenge Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden rounded-b-[2.5rem] shadow-2xl" id="hero-section">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-[-20%] right-[10%] w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Official Hackathon Submission Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-semibold tracking-wider uppercase mb-8 shadow-xs"
          >
            <Award className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>Google Cloud Build with AI Hackathon Project Entry</span>
          </motion.div>

          {/* Sub-Brand Descriptor */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xs sm:text-sm font-bold tracking-widest text-indigo-400 uppercase mb-3"
          >
            DEMOCRATIZING REPRESENTATION • SYSTEMIZING PRIORITIES
          </motion.p>

          {/* App Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent drop-shadow-sm"
          >
            GovAI Connect
          </motion.h1>

          {/* Prime Value Proposition Title */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-200 max-w-4xl tracking-tight leading-tight px-4"
          >
            Bridging the Gap Between 1.4 Billion Citizens and Parliamentary Leadership
          </motion.h2>

          {/* Detailed Narrative Hook */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl font-light leading-relaxed px-2"
          >
            GovAI Connect is a state-of-the-art decision intelligence platform designed to ingest unstructured regional voice logs, citizen emails, and photo evidence. Utilizing enterprise Gemini intelligence, it translates, de-duplicates, and systematically weighs civic demands to generate transparent, prioritized developmental projects.
          </motion.p>

          {/* Call To Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 pt-8 w-full px-4"
          >
            <button 
              onClick={() => onNavigate("citizen")}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-extrabold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-indigo-500"
              id="cta-citizen-home"
            >
              <MessageSquare className="w-4 h-4" />
              Lodge Citizen Grievance
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate("dashboard")}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 rounded-xl font-extrabold text-sm shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              id="cta-mp-home"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              Access MP Command Center
            </button>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats Banner (Overlapping) */}
      <section className="-mt-10 px-4 sm:px-6 max-w-5xl mx-auto w-full relative z-20" id="stats-banner">
        <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-6 p-6 sm:p-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          
          <div className="text-center p-2 md:p-0 flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 flex justify-center items-center gap-1">
              543 <span className="text-lg font-bold text-slate-400">Seats</span>
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-extrabold mt-1.5">National Scale</p>
          </div>

          <div className="text-center p-2 md:p-0 pt-4 md:pt-0 flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 flex justify-center items-center gap-1">
              12+ <span className="text-lg font-bold text-slate-400">Langs</span>
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-extrabold mt-1.5">Indian Dialects</p>
          </div>

          <div className="text-center p-2 md:p-0 pt-4 md:pt-0 flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 flex justify-center items-center gap-1">
              &lt; 3s <span className="text-lg font-bold text-slate-400">Latency</span>
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-extrabold mt-1.5">Multimodal Intake</p>
          </div>

          <div className="text-center p-2 md:p-0 pt-4 md:pt-0 flex flex-col justify-center">
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-indigo-600 flex justify-center items-center gap-1">
              0-100 <span className="text-lg font-bold text-slate-400">Index</span>
            </span>
            <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest font-extrabold mt-1.5">Priority Engine</p>
          </div>

        </div>
      </section>

      {/* The Challenge Core Mission Section */}
      <section className="py-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto w-full" id="challenge-challenge-section">
        <div className="bg-gradient-to-r from-indigo-900/5 to-indigo-950/5 border border-indigo-100 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Hackathon Challenge Solution</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Transforming Civic Chaos into Structured Developmental Roadmaps
            </h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Every day, elected representatives are flooded with hundreds of petition letters, social media grievances, and voice transcripts. Vital local requirements get lost in subjective noise. GovAI Connect directly resolves this by standardizing and scoring incoming citizen concerns with complete, transparent, and explainable AI pipelines.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">Empathetic Ingestion</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Empowers localized oral complaints with advanced audio transcription.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">Explainable Prioritization</h5>
                  <p className="text-xs text-slate-500 mt-0.5">Clear mathematical weighting based on actual citizen density and outage duration.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[350px] shrink-0 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" />
              Gemini Intelligence Core
            </h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Model Engine</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded">Gemini-2.5-Flash</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Multilingual Parser</span>
                <span className="font-bold text-indigo-600">Active (12+ Languages)</span>
              </div>
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">De-duplication Method</span>
                <span className="font-bold text-slate-700">Semantic Clustering</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Explainability Inspector</span>
                <span className="font-bold text-green-600 flex items-center gap-1">
                  100% Audit Track
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Platform Pillars Section */}
      <section className="py-12 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto w-full space-y-12" id="capabilities-section">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full">
            Core Platform Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 pt-2">
            The Four Strategic Pillars
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Our comprehensive, enterprise-grade technology stack solves complex civic governance problems through robust architectural components.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Pillar 1: AI-Powered Constituency Planning Platform */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5 hover:shadow-lg transition-all hover:border-slate-300">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <MapPin className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                AI-Powered Constituency Planning Platform
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Empower parliamentary offices to structure, organize, and budget developmental milestones seamlessly. Convert chaotic arrays of local requests into visual, geolocated project maps. Staff can immediately isolate priority areas, aggregate demands by sector (water, roads, health), and manage systematic milestone tracking.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100 mt-auto">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Integrated GIS-style priority planning map
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Automated sector categorization (infrastructure, public safety, utilities)
              </li>
            </ul>
          </div>

          {/* Pillar 2: Multilingual Citizen Intelligence */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5 hover:shadow-lg transition-all hover:border-slate-300">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Languages className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Multilingual Citizen Intelligence
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Ensure perfect linguistic inclusivity across India's rich demographic spectrum. Citizens can submit voice files, text letters, or upload images in 12+ regional languages (Hindi, Tamil, Telugu, Marathi, Malayalam). Gemini translates and structures inputs instantly into uniform executive summaries.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100 mt-auto">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Regional dialect audio transcription & sentiment analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Multimodal image analysis to extract and verify infrastructural issues
              </li>
            </ul>
          </div>

          {/* Pillar 3: Ranked Evidence-Based Development Priorities */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5 hover:shadow-lg transition-all hover:border-slate-300">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Activity className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Ranked Evidence-Based Development Priorities
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Replace subjectivity and loud lobbies with data-driven objectivity. The urgency index evaluates key parameters: size of affected population, duration of outage, vulnerability profiles of surrounding localities, and systemic health and safety factors. Similar local issues are automatically clustered, avoiding duplicate congestion.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100 mt-auto">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Algorithmic 0-100 severity index weighting
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Duplicate complaint spikes clustered to a single parent issue
              </li>
            </ul>
          </div>

          {/* Pillar 4: Decision Support for Members of Parliament */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col gap-5 hover:shadow-lg transition-all hover:border-slate-300">
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Decision Support for Members of Parliament
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Empower MPs and decision-makers to generate precise budget forecasts and issue briefs instantly. Leverage executive action panels that draft detailed department work orders, recommend optimal allocations, and display dynamic progress timelines of ongoing projects across the constituency.
              </p>
            </div>
            <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100 mt-auto">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Generative briefing summaries with financial projections
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                Automated line-agency work dispatch routing
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Enterprise-Grade Security & Trust Indicators */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 md:px-12 rounded-t-[2rem] relative overflow-hidden" id="trust-indicators-section">
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          <div className="space-y-4 lg:col-span-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enterprise Grade Security</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Built on Pillars of Integrity & Safety
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              GovAI Connect adheres to high standards of government tech requirements. We guarantee complete separation of data, encrypted audit trails, and data safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-2">
            
            {/* Trust Metric 1 */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <div className="w-9 h-9 bg-slate-700/60 rounded-lg flex items-center justify-center text-indigo-400">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-100 text-sm">Secure Identity Protocols</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Robust Role-Based Access Controls (RBAC) ensuring appropriate separation of powers between general citizens, MPs, line agencies, and administrators.
              </p>
            </div>

            {/* Trust Metric 2 */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <div className="w-9 h-9 bg-slate-700/60 rounded-lg flex items-center justify-center text-indigo-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-100 text-sm">Explainable Heuristics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero black-box decisions. The AI Inspector panel displays prompt details, JSON schema constraints, and raw logits to ensure full system accountability.
              </p>
            </div>

            {/* Trust Metric 3 */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <div className="w-9 h-9 bg-slate-700/60 rounded-lg flex items-center justify-center text-indigo-400">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-100 text-sm">Sovereign Data Storage</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Designed to run on cloud containers utilizing secure databases with end-to-end data encryption in transit and at rest.
              </p>
            </div>

            {/* Trust Metric 4 */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <div className="w-9 h-9 bg-slate-700/60 rounded-lg flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-slate-100 text-sm">Line-Agency Work-Order Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintains a strict tamper-proof event stream logging every dispatch, status revision, priority re-rank, and department reply.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Role-Based Navigation Hub Section */}
      <section className="py-16 px-4 sm:px-6 bg-slate-100/80 border-t border-slate-200/80" id="role-selector">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Access Unified Command Portals
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
              Select your specific system portal to explore the platform modules in Demo mode or Production mode.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Citizen card */}
            <button 
              onClick={() => onNavigate("citizen")}
              className="bg-white hover:bg-slate-50/80 text-left p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
              id="hub-citizen-card"
            >
              <div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Citizen Portal</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                  Lodge complaints using text, audio, or photo evidence. Get automatic progress alerts.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 mt-6 group-hover:translate-x-1.5 transition-all flex items-center gap-1 shrink-0">
                Lodge Grievance <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* MP Command Center card */}
            <button 
              onClick={() => onNavigate("dashboard")}
              className="bg-white hover:bg-slate-50/80 text-left p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
              id="hub-mp-card"
            >
              <div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">MP Command Center</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                  Analyze priority milestones, review budget outlines, and generate summaries.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 mt-6 group-hover:translate-x-1.5 transition-all flex items-center gap-1 shrink-0">
                Access Panel <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Department field officer card */}
            <button 
              onClick={() => onNavigate("department")}
              className="bg-white hover:bg-slate-50/80 text-left p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
              id="hub-dept-card"
            >
              <div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Line Departments</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                  Receive systemized developmental work orders, submit site photos, and report progress.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 mt-6 group-hover:translate-x-1.5 transition-all flex items-center gap-1 shrink-0">
                Field Office <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* Admin control room card */}
            <button 
              onClick={() => onNavigate("admin")}
              className="bg-white hover:bg-slate-50/80 text-left p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
              id="hub-admin-card"
            >
              <div>
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-100 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">System Administration</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-2 leading-relaxed">
                  Calibrate nodal parameter thresholds, monitor Gemini API latency logs, and audit records.
                </p>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 mt-6 group-hover:translate-x-1.5 transition-all flex items-center gap-1 shrink-0">
                Control Room <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-400 py-10 px-6 border-t border-slate-900 text-center text-xs" id="footer-landing">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <p className="font-bold text-slate-300 text-sm">GovAI Connect</p>
            <p className="text-slate-500 text-[11px]">Empowering governance with state-of-the-art decision intelligence.</p>
          </div>
          <p>© 2026 GovAI Connect. Built for the Google Cloud Build with AI Hackathon.</p>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("help")} className="hover:text-white transition-all cursor-pointer">Documentation</button>
            <span className="text-slate-800">·</span>
            <button onClick={() => onNavigate("settings")} className="hover:text-white transition-all cursor-pointer">Security Controls</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
