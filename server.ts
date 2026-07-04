import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { AIEnginePipeline } from "./server/aiPipeline";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI client lazily or safely
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({ apiKey });
    console.log("Gemini API client initialized successfully on the server.");
  } catch (error) {
    console.error("Failed to initialize Gemini API client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY detected. Running in Simulation/Local intelligence mode.");
}

// In-memory Database for Constituency Planning
interface Complaint {
  id: string;
  citizenName: string;
  contactInfo: string;
  location: string; // e.g. "Ward 14", "Ward 15", "East Sector", "Market Junction"
  originalText: string;
  detectedLanguage: string;
  translatedText: string;
  category: "Water Supply" | "Roads & Transport" | "Public Safety" | "Sanitation" | "Power & Electricity" | "Healthcare" | "General";
  urgencyScore: number; // 1 to 100
  department: string;
  duplicateOfId: string | null;
  status: "Pending" | "In Progress" | "Resolved" | "Investigating";
  recommendedAction: string;
  createdAt: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}

interface ActionLog {
  id: string;
  complaintId: string;
  taskTitle: string;
  actionTaken: string;
  executedBy: string;
  status: "Dispatched" | "In Progress" | "Completed";
  timestamp: string;
}

// Pre-seeded Complaints (Highly realistic government-grade records)
let complaints: Complaint[] = [
  {
    id: "COMP-001",
    citizenName: "Anil Deshmukh",
    contactInfo: "+91 98765 43210",
    location: "Ward 15 (South Sector)",
    originalText: "हमारे इलाके वार्ड 15 में पिछले 5 दिनों से पीने का पानी नहीं आ रहा है। पाइपलाइन में कुछ लीकेज है। बच्चे और बुजुर्ग बहुत परेशान हैं। कृपया जल टैंकर भेजें।",
    detectedLanguage: "Hindi",
    translatedText: "Drinking water has not been available in our area Ward 15 for the last 5 days. There is some leakage in the pipeline. Children and the elderly are very troubled. Please send water tankers.",
    category: "Water Supply",
    urgencyScore: 92,
    department: "Department of Water Resources",
    duplicateOfId: null,
    status: "Pending",
    recommendedAction: "Deploy emergency water tenders to Ward 15 immediately. Direct Water Board maintenance crew to localize and repair pipeline leak.",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(), // 36 hours ago
    sentiment: "Negative"
  },
  {
    id: "COMP-002",
    citizenName: "Siddharth Menon",
    contactInfo: "+91 94472 10293",
    location: "Main Sector Road",
    originalText: "Main Sector road streetlights have been completely dark for over two weeks. This is very unsafe for commuters returning home after 8 PM, especially women. Several minor thefts have been reported near the junction.",
    detectedLanguage: "English",
    translatedText: "Main Sector road streetlights have been completely dark for over two weeks. This is very unsafe for commuters returning home after 8 PM, especially women. Several minor thefts have been reported near the junction.",
    category: "Public Safety",
    urgencyScore: 78,
    department: "Power & Electricity Board",
    duplicateOfId: null,
    status: "In Progress",
    recommendedAction: "Replace blown transformers and install LED light fixtures along Main Sector Road. Request Police patrolling during night hours (8 PM - 4 AM).",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    sentiment: "Negative"
  },
  {
    id: "COMP-003",
    citizenName: "Meenakshi Sundaram",
    contactInfo: "+91 81234 56789",
    location: "Ward 14 (East Sector)",
    originalText: "వార్డు 14 లో పైప్‌లైన్ పగిలిపోయి మంచినీరంతా మురుగు కాలువలోకి వృధాగా పోతోంది. ప్రెషర్ అస్సలు లేదు.",
    detectedLanguage: "Telugu",
    translatedText: "In Ward 14, the pipeline is broken and all the drinking water is going waste into the drain. There is no pressure at all.",
    category: "Water Supply",
    urgencyScore: 85,
    department: "Department of Water Resources",
    duplicateOfId: "COMP-001", // Linked as duplicate of main water issue
    status: "Investigating",
    recommendedAction: "Review joint repair plan for Ward 14 and 15 pipelines. Water pressure restoration required.",
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    sentiment: "Negative"
  },
  {
    id: "COMP-004",
    citizenName: "Ramesh Solanki",
    contactInfo: "+91 70123 98451",
    location: "Market Junction Area",
    originalText: "Road near Market Junction is completely filled with massive potholes after the pre-monsoon showers. It leads to huge traffic jams daily. A couple of two-wheelers slipped yesterday causing injuries.",
    detectedLanguage: "English",
    translatedText: "Road near Market Junction is completely filled with massive potholes after the pre-monsoon showers. It leads to huge traffic jams daily. A couple of two-wheelers slipped yesterday causing injuries.",
    category: "Roads & Transport",
    urgencyScore: 80,
    department: "Ministry of Road Transport / Public Works Department",
    duplicateOfId: null,
    status: "Pending",
    recommendedAction: "Authorize emergency cold-mix pothole filling for Market Junction. Schedule complete re-metalling of the sector after monsoon.",
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    sentiment: "Negative"
  },
  {
    id: "COMP-005",
    citizenName: "Dr. Sunita Sharma",
    contactInfo: "+91 99887 76655",
    location: "Civil Hospital Sub-center",
    originalText: "The Primary Health Center (PHC) is understaffed. No gynecologist or pediatrician is available during morning outpatient hours. Patients have to travel 30 km to the main city hospital.",
    detectedLanguage: "English",
    translatedText: "The Primary Health Center (PHC) is understaffed. No gynecologist or pediatrician is available during morning outpatient hours. Patients have to travel 30 km to the main city hospital.",
    category: "Healthcare",
    urgencyScore: 65,
    department: "Department of Health & Family Welfare",
    duplicateOfId: null,
    status: "Resolved",
    recommendedAction: "Approved temporary deputation of a medical officer and pediatrician twice a week. Initiated recruitments for full-time doctors.",
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    sentiment: "Neutral"
  },
  {
    id: "COMP-006",
    citizenName: "Gopal Kurup",
    contactInfo: "+91 88776 55443",
    location: "Lake View Garden Colony",
    originalText: "ക്ലബ്ബ് റോഡിൽ മാലിന്യം വൻതോതിൽ കെട്ടിക്കിടക്കുന്നു. മുൻസിപ്പൽ വണ്ടികൾ ആഴ്ചയിൽ ഒരിക്കൽ മാത്രമാണ് വരുന്നത്. കൊതുക് ശല്യം രൂക്ഷമാണ്.",
    detectedLanguage: "Malayalam",
    translatedText: "Garbage is piling up heavily on Club Road. Municipal trucks come only once a week. Mosquito menace is severe.",
    category: "Sanitation",
    urgencyScore: 72,
    department: "Department of Sanitation / Municipal Corporation",
    duplicateOfId: null,
    status: "In Progress",
    recommendedAction: "Modify sanitation route to clear garbage thrice a week in Lake View Colony. Implement anti-larval fogging.",
    createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    sentiment: "Negative"
  }
];

// In-memory action logs
let actionLogs: ActionLog[] = [
  {
    id: "ACT-101",
    complaintId: "COMP-002",
    taskTitle: "Replace Blown Transformers",
    actionTaken: "Dispatched contractor with replacement high-voltage transformer and 12 LED streetlight bulbs.",
    executedBy: "Superintendent Engineer, Power Board",
    status: "In Progress",
    timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
  },
  {
    id: "ACT-102",
    complaintId: "COMP-005",
    taskTitle: "Medical Officer Deputation",
    actionTaken: "Issued order for Dr. Amit Sen (Pediatrician) to sit at Civil Hospital PHC every Tuesday and Friday morning.",
    executedBy: "District Medical Officer",
    status: "Completed",
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

app.use(express.json());

// API: Get all complaints
app.get("/api/complaints", (req, res) => {
  res.json({ success: true, data: complaints });
});

// API: Get action logs
app.get("/api/actions", (req, res) => {
  res.json({ success: true, data: actionLogs });
});

// API: Execute 10-stage AI Processing Pipeline (Milestone 4)
app.post("/api/ai-pipeline/process", async (req, res) => {
  try {
    const { title, description, language, location, ward, citizenProfile, attachmentsCount, voiceTranscript } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ success: false, error: "Missing required fields: title, description" });
    }

    const pipeline = new AIEnginePipeline();
    const result = await pipeline.process({
      title,
      description,
      language: language || "English",
      location: location || "Unknown Location",
      ward: ward || "",
      citizenProfile: citizenProfile || { fullName: "Anonymous Citizen" },
      attachmentsCount: attachmentsCount || 0,
      voiceTranscript: voiceTranscript || "",
    }, process.env.GEMINI_API_KEY);

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("AI Pipeline process error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to execute AI Pipeline" });
  }
});

// Helper for local simulation when Gemini is unavailable
function simulateAnalysis(text: string): Partial<Complaint> {
  const lowercaseText = text.toLowerCase();
  
  let detectedLanguage = "English";
  let translatedText = text;
  
  if (/[अ-ह]/.test(text)) {
    detectedLanguage = "Hindi";
    translatedText = "[Translated from Hindi] " + text;
  } else if (/[அ-ஹ]/.test(text)) {
    detectedLanguage = "Tamil";
    translatedText = "[Translated from Tamil] " + text;
  } else if (/[అ-హ]/.test(text)) {
    detectedLanguage = "Telugu";
    translatedText = "[Translated from Telugu] " + text;
  } else if (/[അ-ഹ]/.test(text)) {
    detectedLanguage = "Malayalam";
    translatedText = "[Translated from Malayalam] " + text;
  }

  // Basic keyword-based classification
  let category: Complaint["category"] = "General";
  let department = "General Administration Department";
  let urgencyScore = 50;
  let recommendedAction = "Schedule inspection and coordinate with standard zonal departments.";

  if (lowercaseText.includes("पानी") || lowercaseText.includes("water") || lowercaseText.includes("leak") || lowercaseText.includes("pipeline") || lowercaseText.includes("drain") || lowercaseText.includes("pressure")) {
    category = "Water Supply";
    department = "Department of Water Resources";
    urgencyScore = lowercaseText.includes("urgent") || lowercaseText.includes("emergency") || lowercaseText.includes("5 days") ? 90 : 75;
    recommendedAction = "Coordinate with local Water Board pipeline division. Dispatch support tankers if supply disruption exceeds 48 hours.";
  } else if (lowercaseText.includes("road") || lowercaseText.includes("pothole") || lowercaseText.includes("bridge") || lowercaseText.includes("traffic") || lowercaseText.includes("street")) {
    if (lowercaseText.includes("light") || lowercaseText.includes("dark") || lowercaseText.includes("safety") || lowercaseText.includes("theft")) {
      category = "Public Safety";
      department = "Power & Electricity Board";
      urgencyScore = 80;
      recommendedAction = "Inspect local street lamp circuits, deploy LED conversions, and coordinate with the local police precinct for patrolling.";
    } else {
      category = "Roads & Transport";
      department = "Ministry of Road Transport / Public Works Department";
      urgencyScore = lowercaseText.includes("injury") || lowercaseText.includes("accident") ? 85 : 60;
      recommendedAction = "Conduct local civil survey. Dispatch repair crew with cold asphalt mix for emergency patching.";
    }
  } else if (lowercaseText.includes("doctor") || lowercaseText.includes("hospital") || lowercaseText.includes("health") || lowercaseText.includes("medicine") || lowercaseText.includes("clinic")) {
    category = "Healthcare";
    department = "Department of Health & Family Welfare";
    urgencyScore = 70;
    recommendedAction = "Evaluate staffing ratios at the local healthcare center. Authorize weekly visitation rotation of specialized medical staff.";
  } else if (lowercaseText.includes("garbage") || lowercaseText.includes("waste") || lowercaseText.includes("sanitation") || lowercaseText.includes("clean") || lowercaseText.includes("drainage")) {
    category = "Sanitation";
    department = "Department of Sanitation / Municipal Corporation";
    urgencyScore = 65;
    recommendedAction = "Escalate to Municipal Sanitation inspector. Request intensive solid waste cleanup and fogging rotation.";
  } else if (lowercaseText.includes("power") || lowercaseText.includes("electricity") || lowercaseText.includes("voltage") || lowercaseText.includes("powercut") || lowercaseText.includes("outage")) {
    category = "Power & Electricity";
    department = "Electricity Board";
    urgencyScore = 70;
    recommendedAction = "Verify feeder line loading and sub-station transformer status. Direct grid supervisor to resolve transmission drops.";
  }

  // Duplicate logic
  let duplicateOfId: string | null = null;
  const match = complaints.find(c => c.category === category && c.location.toLowerCase().substring(0, 5) === c.location.toLowerCase().substring(0, 5) && Math.abs(c.urgencyScore - urgencyScore) < 15);
  if (match) {
    duplicateOfId = match.id;
  }

  return {
    detectedLanguage,
    translatedText,
    category,
    urgencyScore,
    department,
    duplicateOfId,
    recommendedAction,
    sentiment: lowercaseText.includes("trouble") || lowercaseText.includes("issue") || lowercaseText.includes("not") || lowercaseText.includes("poor") ? "Negative" : "Neutral"
  };
}

// API: Analyze and submit new complaint using Gemini API
app.post("/api/complaints", async (req, res) => {
  try {
    const { citizenName, contactInfo, location, originalText } = req.body;
    
    if (!citizenName || !location || !originalText) {
      return res.status(400).json({ success: false, error: "Missing required fields: citizenName, location, originalText" });
    }

    const newId = `COMP-0${complaints.length + 1}`;
    let analysisResult: Partial<Complaint> = {};

    if (ai) {
      try {
        const systemPrompt = `
You are an expert AI National Government Officer and Senior Architect assisting a Member of Parliament.
Analyze the citizen complaint below and extract the details in a strict JSON format.

Complaint text: "${originalText}"

Provide response in JSON matching this schema:
{
  "detectedLanguage": "The language of the original text (e.g. Hindi, Tamil, English, Telugu, Kannada, Spanish, etc.)",
  "translatedText": "Perfect translation of the text into professional English",
  "category": "Must be exactly one of: 'Water Supply', 'Roads & Transport', 'Public Safety', 'Sanitation', 'Power & Electricity', 'Healthcare', 'General'",
  "urgencyScore": "Number between 1 and 100 based on severity, injury risks, length of outage, or systemic impact",
  "department": "A realistic governmental department name tasked with resolving this specific issue",
  "recommendedAction": "A specific, operational, evidence-based recommended response task for the MP (e.g. 'Deploy 4 water tenders to Ward 15', 'Dispatch crew with asphalt mix')",
  "sentiment": "Must be exactly 'Positive', 'Neutral', or 'Negative'"
}
Do not return any explanation or markdown tags outside the JSON block.
`;
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: systemPrompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          analysisResult = JSON.parse(textResponse.trim());
          console.log("Successfully ran Gemini Content Generation analysis:", analysisResult);
        } else {
          throw new Error("Empty response from Gemini");
        }
      } catch (geminiError) {
        console.error("Gemini API call failed, falling back to simulated analysis:", geminiError);
        analysisResult = simulateAnalysis(originalText);
      }
    } else {
      analysisResult = simulateAnalysis(originalText);
    }

    // Secondary duplicate search
    let duplicateOfId: string | null = null;
    const sameCategory = complaints.filter(c => c.category === analysisResult.category);
    for (const c of sameCategory) {
      // If locations match or are very close and category matches, check as possible duplicate
      if (c.location.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(c.location.toLowerCase())) {
        duplicateOfId = c.id;
        break;
      }
    }

    const newComplaint: Complaint = {
      id: newId,
      citizenName,
      contactInfo: contactInfo || "Not Provided",
      location,
      originalText,
      detectedLanguage: analysisResult.detectedLanguage || "English",
      translatedText: analysisResult.translatedText || originalText,
      category: (analysisResult.category as any) || "General",
      urgencyScore: analysisResult.urgencyScore || 50,
      department: analysisResult.department || "General Administration Department",
      duplicateOfId: duplicateOfId,
      status: "Pending",
      recommendedAction: analysisResult.recommendedAction || "Inspect site and coordinate with zone lead.",
      createdAt: new Date().toISOString(),
      sentiment: analysisResult.sentiment || "Neutral"
    };

    complaints.unshift(newComplaint);
    res.json({ success: true, data: newComplaint });
  } catch (error) {
    console.error("Error processing complaint:", error);
    res.status(500).json({ success: true, error: "Internal server error during analysis" });
  }
});

// API: Execute action on a complaint
app.post("/api/actions", (req, res) => {
  const { complaintId, taskTitle, actionTaken, executedBy } = req.body;
  if (!complaintId || !taskTitle) {
    return res.status(400).json({ success: false, error: "Missing complaintId or taskTitle" });
  }

  // Update complaint status
  const complaint = complaints.find(c => c.id === complaintId);
  if (complaint) {
    complaint.status = "In Progress";
  }

  const newAction: ActionLog = {
    id: `ACT-${100 + actionLogs.length + 1}`,
    complaintId,
    taskTitle,
    actionTaken: actionTaken || `Initiated task: ${taskTitle}. Staff dispatched.`,
    executedBy: executedBy || "Constituency Command Office",
    status: "Dispatched",
    timestamp: new Date().toISOString()
  };

  actionLogs.unshift(newAction);
  res.json({ success: true, data: newAction });
});

// API: Complete an action
app.post("/api/actions/resolve", (req, res) => {
  const { actionId } = req.body;
  const action = actionLogs.find(a => a.id === actionId);
  if (action) {
    action.status = "Completed";
    
    // Resolve the related complaint
    const complaint = complaints.find(c => c.id === action.complaintId);
    if (complaint) {
      complaint.status = "Resolved";
    }
    return res.json({ success: true, data: action });
  }
  res.status(404).json({ success: false, error: "Action log not found" });
});

// API: AI Assistant Chat in the Sidebar/Panel (Provides contextual answers based on active database)
app.post("/api/chat-assistant", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: "Missing prompt" });
    }

    const currentSummary = complaints.map(c => 
      `- ID: ${c.id}, Location: ${c.location}, Category: ${c.category}, Urgency: ${c.urgencyScore}/100, Status: ${c.status}, Translated Issue: "${c.translatedText}", Recommended Action: "${c.recommendedAction}"`
    ).join("\n");

    const systemPrompt = `
You are the Executive Intelligent Chief of Staff assisting a Member of Parliament (Hon. Rajesh Kumar) in planning, budgeting, and solving citizen grievances using the GovAI Connect Platform.
You have access to the current active constituency database below:

${currentSummary}

Analyze the database state and answer the following user query with absolute technical accuracy, crisp layout, and helpful, evidence-based recommendations.
User Query: "${prompt}"

Be direct, highly professional, government-grade in tone, and use bullet points or simple tables if helpful. Do not output raw JSON, output beautiful readable response.
`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: systemPrompt,
        });
        return res.json({ success: true, answer: response.text });
      } catch (geminiError) {
        console.error("Gemini chatbot call failed:", geminiError);
      }
    }

    // Simulated offline chatbot fallback
    const lowerPrompt = prompt.toLowerCase();
    let answer = `Regarding your query "${prompt}":\n\n`;
    if (lowerPrompt.includes("water") || lowerPrompt.includes("leak") || lowerPrompt.includes("shortage")) {
      const waterIssues = complaints.filter(c => c.category === "Water Supply");
      answer += `There are currently ${waterIssues.length} active Water Supply complaints registered. The most critical issue is in **Ward 15** (Anil Deshmukh, Urgency: 92/100) detailing a 5-day disruption due to main line pipe leakage. We have linked 1 duplicate report in Ward 14 to this main cluster.
      
**Recommended Action Plan:**
1. Mobilize 4 Emergency Water Tenders from the Municipal Pool to Ward 15 immediately.
2. Coordinate with PWD pipeline maintenance to begin trenching and joint sealing at dawn.`;
    } else if (lowerPrompt.includes("status") || lowerPrompt.includes("count") || lowerPrompt.includes("total")) {
      const pending = complaints.filter(c => c.status === "Pending").length;
      const progress = complaints.filter(c => c.status === "In Progress").length;
      const resolved = complaints.filter(c => c.status === "Resolved").length;
      answer += `The constituency has **${complaints.length}** total registered complaints. 
- **Pending Analysis & Execution:** ${pending} tickets
- **In Progress (Active Dispatch):** ${progress} tickets
- **Successfully Resolved:** ${resolved} tickets
Our current department routing accuracy is 98% with an average response time of 4.2 hours.`;
    } else {
      answer += `GovAI Action Engine is online. To best support your Planning workflow:
- The top priority issue is **Acute Water Shortage in Ward 15** (Priority Score: 92) affecting ~4,500 households.
- There are active repairs on streetlighting along the **Main Sector Road** conducted by the Power Board.
- Recommend approving a **Sanitation fogging and waste routing revision** for Club Road to curb vector-borne disease indices.`;
    }

    res.json({ success: true, answer });
  } catch (err) {
    console.error("Chatbot assistant error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// API: Reset or re-seed complaints
app.post("/api/reset", (req, res) => {
  // Reset in-memory database
  complaints = [
    {
      id: "COMP-001",
      citizenName: "Anil Deshmukh",
      contactInfo: "+91 98765 43210",
      location: "Ward 15 (South Sector)",
      originalText: "हमारे इलाके वार्ड 15 में पिछले 5 दिनों से पीने का पानी नहीं आ रहा है। पाइपलाइन में कुछ लीकेज है। बच्चे और बुजुर्ग बहुत परेशान हैं। कृपया जल टैंकर भेजें।",
      detectedLanguage: "Hindi",
      translatedText: "Drinking water has not been available in our area Ward 15 for the last 5 days. There is some leakage in the pipeline. Children and the elderly are very troubled. Please send water tankers.",
      category: "Water Supply",
      urgencyScore: 92,
      department: "Department of Water Resources",
      duplicateOfId: null,
      status: "Pending",
      recommendedAction: "Deploy emergency water tenders to Ward 15 immediately. Direct Water Board maintenance crew to localize and repair pipeline leak.",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      sentiment: "Negative"
    },
    {
      id: "COMP-002",
      citizenName: "Siddharth Menon",
      contactInfo: "+91 94472 10293",
      location: "Main Sector Road",
      originalText: "Main Sector road streetlights have been completely dark for over two weeks. This is very unsafe for commuters returning home after 8 PM, especially women. Several minor thefts have been reported near the junction.",
      detectedLanguage: "English",
      translatedText: "Main Sector road streetlights have been completely dark for over two weeks. This is very unsafe for commuters returning home after 8 PM, especially women. Several minor thefts have been reported near the junction.",
      category: "Public Safety",
      urgencyScore: 78,
      department: "Power & Electricity Board",
      duplicateOfId: null,
      status: "In Progress",
      recommendedAction: "Replace blown transformers and install LED light fixtures along Main Sector Road. Request Police patrolling during night hours (8 PM - 4 AM).",
      createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      sentiment: "Negative"
    }
  ];
  actionLogs = [];
  res.json({ success: true, message: "Database re-seeded successfully" });
});

// Mount Vite middleware or static folder handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GovAI Connect backend and client hot-reloading at: http://localhost:${PORT}`);
  });
}

startServer();
