import React from "react";
import { HelpCircle, Sparkles, Languages, CheckCircle, ArrowRight, ShieldCheck, HelpCircle as HelpIcon } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      question: "How does the Multilingual Translation engine work?",
      answer: "When a citizen submits a grievance in any of the registered Indian languages (e.g., Hindi, Tamil, Telugu, Malayalam), the input payload is securely sent to our Google Gemini model. The model automatically detects the language, translates the text into a professional English summary, and extracts structured categorization data instantly."
    },
    {
      question: "What does the Urgency Rating Score represent?",
      answer: "Urgency Rating (a score from 0 to 100) is evaluated using a systemic matrix. The AI reviews the length of supply outages, danger to life or physical safety, vulnerable demographics affected (such as hospital zones or children), and density of identical reports to compute an executive response rank."
    },
    {
      question: "How are duplicate complaints prevented?",
      answer: "Gemini executes semantic analysis to compare newly registered issues against existing active files in the same ward. If a high similarity index is identified, the complaint is flagged as a duplicate of a main parent complaint. It is linked visually in the MP Dashboard so departments can solve them jointly instead of working on duplicate work orders."
    }
  ];

  return (
    <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8" id="help-page">
      
      {/* Header */}
      <div className="space-y-1 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-600" />
          Platform Guide & Documentation
        </h2>
        <p className="text-xs text-slate-500">Learn how GovAI Connect uses Gemini to streamline constituency planning and resolve citizen grievances.</p>
      </div>

      {/* Platform Schematic Flowchart Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          Unified Governance Flowchart
        </h3>

        {/* Visual pipeline flow represented in Tailwind CSS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs" id="flowchart-steps">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">01</span>
            <h4 className="font-bold text-slate-800">Citizen Submission</h4>
            <p className="text-[10px] text-slate-500">Citizen uploads text, image, or regional voice notes.</p>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">02</span>
            <h4 className="font-bold text-slate-800">Gemini Processing</h4>
            <p className="text-[10px] text-slate-500">Translates regional input, clusters duplicate tickets, and scores urgency.</p>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">03</span>
            <h4 className="font-bold text-slate-800">MP Dispatch</h4>
            <p className="text-[10px] text-slate-500">MP reviews clustered recommendations and issues work orders.</p>
            <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-slate-300">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-700 font-extrabold px-2 py-0.5 rounded-full">04</span>
            <h4 className="font-bold text-slate-800">Zonal Resolution</h4>
            <p className="text-[10px] text-slate-500">Responsible local department executes repairs and completes task.</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wider">
          <HelpIcon className="w-4 h-4 text-indigo-600" />
          Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-800">{faq.question}</h4>
              <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
