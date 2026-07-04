import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Briefcase, 
  ChevronRight, 
  X,
  Map,
  PlusCircle,
  Database,
  Building2,
  ShieldAlert,
  DollarSign,
  Calendar,
  ThumbsUp,
  Check,
  Cpu,
  FileText,
  BarChart3,
  ArrowUpRight,
  Users,
  Award,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  Settings
} from "lucide-react";
import { Complaint, ActionLog } from "../types";

// Enhanced Complaint structure for Milestones 4 & 5
interface RichComplaint extends Complaint {
  citizenSummary: string;
  aiSummary: string;
  confidence: number;
  affectedArea: string;
  populationImpact: string;
  suggestedScheme: "Jal Jeevan Mission" | "PMGSY" | "Swachh Bharat Mission" | "PMAY" | "AMRUT" | "Smart Cities Mission";
  schemeReason: string;
  budgetEstimate: "Low" | "Medium" | "High";
  budgetNumeric: string;
  timelineEstimate: string;
  resourcesRequired: string;
  executionComplexity: "Low" | "Medium" | "High";
  priorityReasons: string[];
  modelReasoning: string;
  evidence: {
    images: string[];
    voiceTranscript: string;
    documents: string[];
    timeline: { step: string; date: string; status: string }[];
    aiAnalysis: string;
  };
  actions: {
    immediate: string;
    nextWeek: string;
    longTerm: string;
    budgetSuggestions: string;
    coordination: string;
  };
}

export interface EvidenceDetails {
  priorityScore: number;
  confidenceScore: number;
  whyPrioritized: string[];
  explanation: string;
  relatedSubmissionsCount: number;
  trendText: string;
  populationImpact: string;
  nearbyAssets: string[];
  severityLevel: "Low" | "Medium" | "High" | "Critical";
  suggestedDepartment: string;
  suggestedScheme: string;
  budgetEstimate: string;
  implementationTimeline: string;
  recommendedNextAction: string;
}

export const getEvidenceCardDetails = (comp: RichComplaint): EvidenceDetails => {
  if (comp.id === "COMP-001") {
    return {
      priorityScore: 92,
      confidenceScore: 96,
      whyPrioritized: [
        "Absolute water starvation logged continuously for 120+ hours.",
        "Elderly care ward and preschool located within 60 meters of pressure failure zone.",
        "Adjacency to non-potable drainage canal presents immediate ground-contamination safety hazard."
      ],
      explanation: "Based on 18 related citizen submissions over the past 5 days, our geospatial AI has detected a significant pipeline main joint rupture at the Ward 15 South Sector Pipeline Hub. Due to the proximity of highly vulnerable communities including a preschool and elderly care ward, this issue is prioritized as a critical public health risk with a priority score of 92/100 and 96% confidence score.",
      relatedSubmissionsCount: 18,
      trendText: "+28% increase week-over-week (Critical Acceleration)",
      populationImpact: "12,500 active residents",
      nearbyAssets: ["St. Jude's Preschool (60m)", "Sovereign Elderly Care Ward (60m)", "South Sector Canal Aqueduct (110m)"],
      severityLevel: "Critical",
      suggestedDepartment: "Department of Water Resources",
      suggestedScheme: "Jal Jeevan Mission",
      budgetEstimate: "₹1,85,000 (Medium Grade)",
      implementationTimeline: "48 Hours",
      recommendedNextAction: "Dispatch 6 high-capacity water tankers immediately to central Ward 15 community centers to secure clean hydration."
    };
  }
  if (comp.id === "COMP-002") {
    return {
      priorityScore: 78,
      confidenceScore: 91,
      whyPrioritized: [
        "Unlit transit corridor logged continuously for over 14 days.",
        "Two recorded minor night robberies near the junction in the past week.",
        "Crucial bus stop transit path for late-shift female workers."
      ],
      explanation: "Our computer vision and regional crime mapping logs indicate that Main Sector Road in Ward 12 has been completely unlit for 14 days. This dark zone has directly resulted in a 300% surge in localized nighttime safety threats, including two minor thefts. With late-shift female commuters relying on this crucial bus stop transit path, this public safety concern has been escalated to a High severity level.",
      relatedSubmissionsCount: 12,
      trendText: "+14% upward trend in security complaints near Ward 12",
      populationImpact: "8,200 nightly commuters",
      nearbyAssets: ["Sector 12 Police Beat Post (400m)", "Ward 12 Primary School (150m)", "Central Sector Zonal Bus Terminal (20m)"],
      severityLevel: "High",
      suggestedDepartment: "Power & Electricity Board",
      suggestedScheme: "Smart Cities Mission",
      budgetEstimate: "₹65,000 (Low Grade)",
      implementationTimeline: "24 Hours",
      recommendedNextAction: "Deploy a mobile emergency solar lighting mast to illuminate the bus stop junction tonight."
    };
  }
  if (comp.id === "COMP-003") {
    return {
      priorityScore: 80,
      confidenceScore: 94,
      whyPrioritized: [
        "Active physical injury accidents logged (two two-wheeler slips in 24h).",
        "Severe economic loss from 45-minute daily average traffic congestion delays.",
        "Unmitigated water pooling will accelerate crater degradation of underlying subgrade."
      ],
      explanation: "Following heavy pre-monsoon showers, the pavement near Market Junction (Ward 3) has suffered extreme physical breakdown with 8 active craters exceeding 15cm depth. With a critical traffic volume of 25,000 daily transit units, these deep craters have already caused two minor motorcycle slips and severe 45-minute traffic delays, presenting a direct physical safety hazard and economic bottleneck.",
      relatedSubmissionsCount: 22,
      trendText: "+45% post-monsoon pothole surge (Urgent Attention)",
      populationImpact: "25,000 daily transit units",
      nearbyAssets: ["Market Square Secondary School (80m)", "Ward 3 Post Office (120m)", "City Cooperative Bank (50m)"],
      severityLevel: "High",
      suggestedDepartment: "Public Works Department",
      suggestedScheme: "PMGSY",
      budgetEstimate: "₹3,50,000 (Medium Grade)",
      implementationTimeline: "5 Days",
      recommendedNextAction: "Authorize rapid cold-patch road maintenance truck to fill the 8 deep craters within 24 hours."
    };
  }
  if (comp.id === "COMP-004") {
    return {
      priorityScore: 68,
      confidenceScore: 89,
      whyPrioritized: [
        "Lapse in essential municipal service (once-weekly trash collection instead of alternate day).",
        "Humid weather accelerating decay of organic household refuse.",
        "High danger of breeding dengue/malaria vectors near local residential park."
      ],
      explanation: "Due to a localized municipal collection truck route failure, organic solid waste has piled up massively on Club Road in Ward 18. Combined with pre-monsoon high humidity (92%), these decaying organic piles have triggered an extreme mosquito and vector breeding hazard directly adjacent to a residential community park, posing an imminent dengue/malaria threat.",
      relatedSubmissionsCount: 8,
      trendText: "+5% steady increase in sanitation-related reports in Ward 18",
      populationImpact: "3,100 housing residents",
      nearbyAssets: ["Club Road Community Park (50m)", "Zonal Anganwadi Health Center (110m)", "Mother's Pride Kindergarten (200m)"],
      severityLevel: "Medium",
      suggestedDepartment: "Municipal Sanitation Department",
      suggestedScheme: "Swachh Bharat Mission",
      budgetEstimate: "₹12,000 (Low Grade)",
      implementationTimeline: "24 Hours",
      recommendedNextAction: "Dispatch a heavy-duty compactor truck to clear the Club Road garbage pileup within 12 hours."
    };
  }
  if (comp.id === "COMP-005") {
    return {
      priorityScore: 72,
      confidenceScore: 93,
      whyPrioritized: [
        "Inaccessible specialized maternal care within a 30 km geographical radius.",
        "Overload on central district hospitals from trivial pediatric transfers.",
        "Crucial vaccination drive targets are lagging due to lack of a resident pediatrician."
      ],
      explanation: "West Sector Primary Health Center in Ward 8 is suffering an acute specialized staffing deficit. There is currently no pediatrician or gynecologist available, forcing pregnant mothers and children to travel 30 km to the central district hospital. This barrier is actively delaying critical infant vaccination schedules and increasing maternal health vulnerability indices.",
      relatedSubmissionsCount: 15,
      trendText: "Stable (Long-term systemic understaffing complaint)",
      populationImpact: "18,000 ward residents",
      nearbyAssets: ["Ward 8 Public Primary School (100m)", "Zonal Veterinary Clinic (500m)", "West Sector Panchayat Ghar (600m)"],
      severityLevel: "High",
      suggestedDepartment: "Department of Health & Family Welfare",
      suggestedScheme: "AMRUT",
      budgetEstimate: "₹12,00,000 (High Grade)",
      implementationTimeline: "14 Days",
      recommendedNextAction: "Approve temporary deputation of a civil pediatrician and gynecologist twice a week to start immediately."
    };
  }

  const score = comp.urgencyScore || 50;
  const confidence = comp.confidence || 85;
  const reasons = comp.priorityReasons && comp.priorityReasons.length > 0 
    ? comp.priorityReasons 
    : ["High concentration of community interest signals.", "Requires inter-departmental planning alignment."];
  const severity: "Low" | "Medium" | "High" | "Critical" = 
    score >= 85 ? "Critical" :
    score >= 70 ? "High" :
    score >= 40 ? "Medium" : "Low";

  return {
    priorityScore: score,
    confidenceScore: confidence,
    whyPrioritized: reasons,
    explanation: `This issue has been processed by the GovAI system and categorized under ${comp.category || "General Development"}. Based on the location details at ${comp.location || "unspecified region"} and user-submitted data, the priority score of ${score}/100 was computed. This recommendation is routed to ${comp.department || "the respective administrative division"} for planning under modern municipal guidelines.`,
    relatedSubmissionsCount: Math.floor(Math.random() * 10) + 1,
    trendText: "Stable Trend (Developing Local Signal)",
    populationImpact: comp.populationImpact || "Local community scope",
    nearbyAssets: ["District Public Road System", "Local Ward Assembly Point"],
    severityLevel: severity,
    suggestedDepartment: comp.department || "General Public Services Division",
    suggestedScheme: comp.suggestedScheme || "Smart Cities Mission",
    budgetEstimate: `${comp.budgetNumeric || "₹50,000"} (${comp.budgetEstimate || "Low Grade"})`,
    implementationTimeline: comp.timelineEstimate || "3-7 Days",
    recommendedNextAction: comp.recommendedAction || "Schedule a departmental survey review of the reported site area."
  };
};

export default function MPDashboardPage() {
  // Rich complaints database satisfying Sections 1-10
  const [complaints, setComplaints] = useState<RichComplaint[]>([
    {
      id: "COMP-001",
      citizenName: "Anil Deshmukh",
      contactInfo: "+91 98765 43210",
      location: "Ward 15 (South Sector Pipeline Hub)",
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
      sentiment: "Negative",
      citizenSummary: "Zero drinking water supply for 5 consecutive days in Ward 15 due to pipeline leakage. High vulnerability risk for elders and children.",
      aiSummary: "Critical potable water distribution infrastructure blowout. Localized system pressure drop and high contamination seepage risk near major sector canal.",
      confidence: 96,
      affectedArea: "Ward 15 South Sector (Pipeline Hub Junction)",
      populationImpact: "12,500 active residents",
      suggestedScheme: "Jal Jeevan Mission",
      schemeReason: "The Jal Jeevan Mission specializes in rural/semi-urban household piped water connectivity, emergency pipe restoration funding, and modernizing community filtration valves.",
      budgetEstimate: "Medium",
      budgetNumeric: "₹1,85,000",
      timelineEstimate: "48 Hours",
      resourcesRequired: "Subsurface acoustic leak locator, replacement 500mm cast-iron flange joint, 1x diesel trenching excavator, 4-man hydraulic repair team.",
      executionComplexity: "Medium",
      priorityReasons: [
        "Absolute water starvation logged continuously for 120+ hours.",
        "Elderly care ward and preschool located within 60 meters of pressure failure zone.",
        "Adjacency to non-potable drainage canal presents immediate ground-contamination safety hazard."
      ],
      modelReasoning: "Calculated priority of 92/100 triggers automated immediate dispatch. Priority score is heavily weighted by the continuous downtime duration and the density of local medical facilities dependent on central pipeline supply.",
      evidence: {
        images: [
          "https://images.unsplash.com/photo-1542044896530-05d85be9b11a?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
        ],
        voiceTranscript: "We have had absolutely no drinking water since Monday! Old people are dehydration-prone and children are missing primary school. Please send municipal water tankers and fix this pipeline leak today!",
        documents: ["Ward15_Hydraulic_Sewer_Overlap.pdf", "Main_Supply_Telemetry_Log.xlsx"],
        timeline: [
          { step: "Grievance filed via Regional WhatsApp Helpline", date: "June 28, 2026, 09:15 AM", status: "Logged" },
          { step: "AI Translation & Category Routing Completed", date: "June 28, 2026, 09:16 AM", status: "Processed" },
          { step: "Assigned to Department of Water Resources", date: "June 28, 2026, 11:30 AM", status: "Dispatched" }
        ],
        aiAnalysis: "Acoustic sensor logs confirmed 4.2 bar drop at Junction W15-A. Ground satellite radar maps confirm a 12-meter wet-ground moisture plume, pointing to a severe underground main valve rupture."
      },
      actions: {
        immediate: "Dispatch 6 high-capacity water tankers to central Ward 15 community centers within 2 hours.",
        nextWeek: "Execute complete ultrasonic inspection of the adjacent 4.2 km loop of pipeline corridor in Ward 14 & 15 to map micro-leaks.",
        longTerm: "Upgrade existing cast-iron junctions to heavy-duty high-density polyethylene (HDPE) lines under the modern central layout budget.",
        budgetSuggestions: "Allocate ₹1.85 Lakhs from current Disaster Mitigation contingency funds to cover rapid labor & excavation contract.",
        coordination: "Joint action meeting required between Water Board Executive Engineer and District Health Council to monitor potential vector seepage."
      }
    },
    {
      id: "COMP-002",
      citizenName: "Siddharth Menon",
      contactInfo: "+91 94472 10293",
      location: "Main Sector Road (Ward 12)",
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
      sentiment: "Negative",
      citizenSummary: "Major dark zone stretching 1.2 km on Main Sector Road due to transformer failure. High security threat after sunset.",
      aiSummary: "Grid substation infrastructure blackout. Heightens vulnerability indices for women's transport transit safety and commercial retail zone safety.",
      confidence: 91,
      affectedArea: "Main Sector Commercial Transit Road (Ward 12)",
      populationImpact: "8,200 nightly commuters",
      suggestedScheme: "Smart Cities Mission",
      schemeReason: "The Smart Cities Mission specifically funds modernized LED street lighting grids, ambient security camera poles, and centralized energy monitoring sub-systems.",
      budgetEstimate: "Low",
      budgetNumeric: "₹65,000",
      timelineEstimate: "24 Hours",
      resourcesRequired: "1x 25kVA step-down pole transformer, 14x high-lumen weatherproof LED cobra head fittings, hydraulic lift truck.",
      executionComplexity: "Low",
      priorityReasons: [
        "Unlit transit corridor logged continuously for over 14 days.",
        "Two recorded minor night robberies near the junction in the past week.",
        "Crucial bus stop transit path for late-shift female workers."
      ],
      modelReasoning: "Priority rating of 78/100 is generated due to localized security metrics showing a 300% crime probability spike under unlit zones. This triggers an urgent public safety infrastructure response.",
      evidence: {
        images: [
          "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&auto=format&fit=crop&q=80"
        ],
        voiceTranscript: "It is pitch black on the Main Sector Road after 7 PM. All shopkeepers are closing early because of theft fears. Women are terrified to take the local buses. Please fix these streetlights immediately.",
        documents: ["Sect12_Grid_Substation_Layout.pdf"],
        timeline: [
          { step: "Grievance filed via Portal Web Form", date: "June 27, 2026, 04:30 PM", status: "Logged" },
          { step: "Classified & Safety Priority Flagged", date: "June 27, 2026, 05:00 PM", status: "Processed" },
          { step: "Work order dispatched to Power Board", date: "June 28, 2026, 08:00 AM", status: "Dispatched" }
        ],
        aiAnalysis: "Smart meter diagnostics verify localized grid blackout downstream of transformer #12-C. Automatic trip was likely caused by pre-monsoon lightning surges."
      },
      actions: {
        immediate: "Deploy a mobile emergency solar lighting mast to illuminate the bus stop junction tonight.",
        nextWeek: "Install the new 25kVA pole transformer and replace all 14 burnt-out bulbs with energy-efficient LED nodes.",
        longTerm: "Integrate Ward 12 streetlights into the centralized Smart City IoT dashboard for automated filament outage alerts.",
        budgetSuggestions: "Disburse ₹65,000 under the Urban Electrification Maintenance budget allocation.",
        coordination: "Request the Local Ward 12 Police Beat Officer to increase motorcycle patrols between 8 PM and midnight."
      }
    },
    {
      id: "COMP-003",
      citizenName: "Ramesh Solanki",
      contactInfo: "+91 70123 98451",
      location: "Market Junction (Ward 3)",
      originalText: "Road near Market Junction is completely filled with massive potholes after the pre-monsoon showers. It leads to huge traffic jams daily. A couple of two-wheelers slipped yesterday causing injuries.",
      detectedLanguage: "English",
      translatedText: "Road near Market Junction is completely filled with massive potholes after the pre-monsoon showers. It leads to huge traffic jams daily. A couple of two-wheelers slipped yesterday causing injuries.",
      category: "Roads & Transport",
      urgencyScore: 80,
      department: "Public Works Department",
      duplicateOfId: null,
      status: "Pending",
      recommendedAction: "Authorize emergency cold-mix pothole filling for Market Junction. Schedule complete re-metalling of the sector after monsoon.",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      sentiment: "Negative",
      citizenSummary: "Widespread road potholes and severe cratering at the busy Market Junction after early showers. Active accident spot for motorbikes.",
      aiSummary: "Key logistical and commercial intersection gridlock. Highly hazardous pavement conditions generating transit delays and commuter health safety liabilities.",
      confidence: 94,
      affectedArea: "Market Junction central roundabout (Ward 3)",
      populationImpact: "25,000 daily transit units",
      suggestedScheme: "PMGSY",
      schemeReason: "The Pradhan Mantri Gram Sadak Yojana (and matching state schemes) supports constructing weather-resistant highways, high-load pavement grading, and rainwater runoff drainage channels.",
      budgetEstimate: "Medium",
      budgetNumeric: "₹3,50,000",
      timelineEstimate: "5 Days",
      resourcesRequired: "24 Metric Tons of cold asphalt aggregate mix, 1x asphalt spreader, road-vibrating roller, traffic barricading cones.",
      executionComplexity: "Medium",
      priorityReasons: [
        "Active physical injury accidents logged (two two-wheeler slips in 24h).",
        "Severe economic loss from 45-minute daily average traffic congestion delays.",
        "Unmitigated water pooling will accelerate crater degradation of underlying subgrade."
      ],
      modelReasoning: "Calculated priority of 80/100. Potholes in isolation score medium, but the addition of active bodily injury logs and high mercantile transit volume escalates this concern into an immediate administrative mandate.",
      evidence: {
        images: [
          "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80"
        ],
        voiceTranscript: "The road is completely ruined at the Market Junction. It looks like a battlefield. My neighbor fell from his scooter yesterday and sprained his ankle because of a deep hidden crater. It is extremely dangerous.",
        documents: ["PWD_Road_Quality_Report_W3.pdf", "Market_Junction_Accident_Log.csv"],
        timeline: [
          { step: "Grievance filed with photos on Citizen Portal", date: "June 29, 2026, 11:00 AM", status: "Logged" },
          { step: "AI Vision Module maps pothole severity", date: "June 29, 2026, 11:05 AM", status: "Processed" },
          { step: "Escalated to PWD Zonal Office", date: "June 29, 2026, 01:45 PM", status: "Dispatched" }
        ],
        aiAnalysis: "AI Vision analysis of citizen photos indicates 8 heavy craters exceeding 15cm depth. Mobile GPS speed telemetry indicates average speeds through the roundabout have plummeted from 28 km/h to 4 km/h."
      },
      actions: {
        immediate: "Dispatch a rapid cold-patch road maintenance truck to fill the 8 major deep craters within 24 hours.",
        nextWeek: "Install reflective safety markers around the junction perimeter and clear the clogged side rainwater drains.",
        longTerm: "Re-metal the entire 500-meter junction with high-durability polymer bituminous compound once monsoon recedes.",
        budgetSuggestions: "Disburse ₹3.50 Lakhs from PWD Local Maintenance reserve funds for immediate contract labor.",
        coordination: "Coordinate with the City Traffic Control Bureau to implement temporary one-way routing during night asphalt laying."
      }
    },
    {
      id: "COMP-004",
      citizenName: "Gopal Kurup",
      contactInfo: "+91 81290 44556",
      location: "Club Road Colony (Ward 18)",
      originalText: "ക്ലബ്ബ് റോഡിൽ മാലിന്യങ്ങൾ വൻതോതിൽ കെട്ടിക്കിടക്കുന്നു. മുൻസിപ്പൽ വണ്ടികൾ ആഴ്ചയിൽ ഒരിക്കൽ മാത്രമാണ് വരുന്നത്. കൊതുക് ശല്യം രൂക്ഷമാണ്.",
      detectedLanguage: "Malayalam",
      translatedText: "Garbage is piling up on Club Road in huge quantities. Municipal trucks come only once a week. The mosquito menace is extremely severe.",
      category: "Sanitation",
      urgencyScore: 68,
      department: "Municipal Sanitation Department",
      duplicateOfId: null,
      status: "Investigating",
      recommendedAction: "Schedule bi-weekly waste collection cycles on Club Road. Conduct vector insecticidal fogging to halt mosquito breeding.",
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      sentiment: "Negative",
      citizenSummary: "Massive solid waste accumulation on Club Road. Infrequent waste truck collection cycles causing severe vector and foul odor problems.",
      aiSummary: "Municipal waste collection route failure. Uncollected organic refuse pileups near residential zone creating a vector breeding vector.",
      confidence: 89,
      affectedArea: "Club Road Residential Sector (Ward 18)",
      populationImpact: "3,100 housing residents",
      suggestedScheme: "Swachh Bharat Mission",
      schemeReason: "The Swachh Bharat Mission is the gold standard for municipal hygiene, solid waste processing plants, local trash segregation, and open dump clearing.",
      budgetEstimate: "Low",
      budgetNumeric: "₹12,000",
      timelineEstimate: "24 Hours",
      resourcesRequired: "1x 15-ton mechanical waste loader compactor, 10 liters of bio-enzymatic sanitizer spray, vector fogging machine.",
      executionComplexity: "Low",
      priorityReasons: [
        "Lapse in essential municipal service (once-weekly trash collection instead of alternate day).",
        "Humid weather accelerating decay of organic household refuse.",
        "High danger of breeding dengue/malaria vectors near local residential park."
      ],
      modelReasoning: "Priority rating of 68/100. Lower on physical injury risk, but the proximity of decomposing waste piles to domestic water storage tanks requires rapid localized sanitation spray.",
      evidence: {
        images: [
          "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80"
        ],
        voiceTranscript: "The stench is making our lives miserable. Dogs are tearing the plastic bags and scattering trash all over Club Road. Mosquitoes are swarming everywhere. We need municipal garbage clearing now.",
        documents: ["Ward18_Sanitation_Route_Log.xlsx"],
        timeline: [
          { step: "Grievance logged via Malayalam Helpline", date: "June 26, 2026, 08:30 AM", status: "Logged" },
          { step: "AI NLP translation to administrative English", date: "June 26, 2026, 08:31 AM", status: "Processed" },
          { step: "Assigned to Ward 18 Sanitation Supervisor", date: "June 26, 2026, 10:15 AM", status: "Dispatched" }
        ],
        aiAnalysis: "Spatial imagery confirms open dump volume has increased by 150% in the last 4 days. Micro-climate sensors record local humidity at 92%, optimal for mosquito larvae hatching."
      },
      actions: {
        immediate: "Dispatch a heavy-duty loader truck to clear the Club Road pileup within 12 hours.",
        nextWeek: "Re-route waste collection trucks to visit Club Road three times weekly (Mon/Wed/Fri) instead of weekly.",
        longTerm: "Install a modern, covered community compost bin and set up CCTV surveillance to fine unauthorized dumping.",
        budgetSuggestions: "Utilize ₹12,000 from current Municipal Solid Waste operations budget.",
        coordination: "Instruct the Health Inspector to conduct insecticidal thermal fogging across a 500m radius of the dump spot."
      }
    },
    {
      id: "COMP-005",
      citizenName: "Dr. Sunita Sharma",
      contactInfo: "+91 99887 76655",
      location: "Ward 8 (West Sector PHC)",
      originalText: "The Primary Health Center (PHC) is understaffed. No gynecologist or pediatrician is available during morning outpatient hours. Patients have to travel 30 km to the main city hospital.",
      detectedLanguage: "English",
      translatedText: "The Primary Health Center (PHC) is understaffed. No gynecologist or pediatrician is available during morning outpatient hours. Patients have to travel 30 km to the main city hospital.",
      category: "Healthcare",
      urgencyScore: 72,
      department: "Department of Health & Family Welfare",
      duplicateOfId: null,
      status: "Resolved",
      recommendedAction: "Approved temporary deputation of a medical officer and pediatrician twice a week. Initiated recruitments for full-time doctors.",
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      sentiment: "Neutral",
      citizenSummary: "Primary Health Center (PHC) is severely understaffed, lacking a pediatrician and gynecologist. Patients must travel 30 km for basic consults.",
      aiSummary: "Rural essential medical care delivery deficit. Gaps in maternal and pediatric specialized staffing affecting regional child immunization indices.",
      confidence: 93,
      affectedArea: "West Sector Primary Health Center (Ward 8)",
      populationImpact: "18,000 ward residents",
      suggestedScheme: "AMRUT",
      schemeReason: "The AMRUT (and central health mission schemes) supports structural upgrade of public social infrastructure, medical staff accommodation units, and pediatric care equipment.",
      budgetEstimate: "High",
      budgetNumeric: "₹12,00,000",
      timelineEstimate: "14 Days",
      resourcesRequired: "Specialized clinical consultant contract, pediatrician equipment kit, transport travel stipend.",
      executionComplexity: "High",
      priorityReasons: [
        "Inaccessible specialized maternal care within a 30 km geographical radius.",
        "Overload on central district hospitals from trivial pediatric transfers.",
        "Crucial vaccination drive targets are lagging due to lack of a resident pediatrician."
      ],
      modelReasoning: "Priority rating of 72/100 is generated. While classified as non-accidental, the high demographic vulnerability of rural infant health raises social security indices, requiring temporary doctor deputation.",
      evidence: {
        images: [
          "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80"
        ],
        voiceTranscript: "Pregnant mothers have to travel in crowded local buses for over two hours to reach town. We need a basic female doctor and pediatrician at least twice a week. It is a fundamental right.",
        documents: ["West_PHC_Staff_Audit.pdf", "District_Health_Budget_2026.xlsx"],
        timeline: [
          { step: "Grievance filed by local medical practitioner", date: "June 22, 2026, 10:00 AM", status: "Logged" },
          { step: "Escalated to District Health Board", date: "June 23, 2026, 02:00 PM", status: "Processed" },
          { step: "Deputation orders signed by District Medical Officer", date: "June 25, 2026, 04:15 PM", status: "Completed" }
        ],
        aiAnalysis: "Public health intake log analysis indicates 45+ mothers travel weekly from Ward 8 specifically for pediatric consults, creating severe economic and transport distress."
      },
      actions: {
        immediate: "Depute a Pediatrician and Gynecologist from Civil Hospital to sit at Ward 8 PHC every Tuesday and Friday morning.",
        nextWeek: "Install a specialized medical equipment kit (fetal monitor, infant weighing scale, emergency oxygen) at the PHC.",
        longTerm: "Initiate permanent recruitment contracts for two resident doctors with housing incentives in the upcoming budget.",
        budgetSuggestions: "Allocate ₹12 Lakhs annual budget under the National Health Mission (NHM) state staff allocation.",
        coordination: "Direct the District Transport Office to align local minibus timing to match the PHC specialized OPD hours."
      }
    }
  ]);

  const [actionLogs, setActionLogs] = useState<ActionLog[]>([
    {
      id: "ACT-101",
      complaintId: "COMP-001",
      taskTitle: "Dispatched Emergency Tankers",
      actionTaken: "Approved and deployed 6 municipal drinking water tankers to central squares in Ward 15 South Sector.",
      executedBy: "District Magistrate Water Division",
      status: "Completed",
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    {
      id: "ACT-102",
      complaintId: "COMP-002",
      taskTitle: "Substation Breaker Reset",
      actionTaken: "Sent repair contractor to main power substation for grid physical evaluation and lightning arrester inspection.",
      executedBy: "Superintendent Engineer, Power Board",
      status: "In Progress",
      timestamp: new Date(Date.now() - 18 * 3600 * 1000).toISOString()
    }
  ]);

  // Selected complaint for the master-detail Decision Intelligence panel
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>("COMP-001");

  // Tab state for the detailed view panel ("brief" or "evidence")
  const [activeDetailTab, setActiveDetailTab] = useState<"brief" | "evidence">("brief");

  // Selected complaint memo
  const selectedComplaint = useMemo(() => {
    return complaints.find(c => c.id === selectedComplaintId) || complaints[0];
  }, [complaints, selectedComplaintId]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  // Modal State for Action Dispatches
  const [dispatchingComplaint, setDispatchingComplaint] = useState<RichComplaint | null>(null);
  const [dispatchTaskTitle, setDispatchTaskTitle] = useState("");
  const [dispatchInstructions, setDispatchInstructions] = useState("");
  const [dispatchExecutor, setDispatchExecutor] = useState("");
  const [isDispatching, setIsDispatching] = useState(false);

  // Computed filters
  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchesSearch = 
        c.citizenName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === "All" || c.category === categoryFilter;
      const matchesWard = !selectedWard || c.location.toLowerCase().includes(selectedWard.toLowerCase());

      return matchesSearch && matchesCategory && matchesWard;
    });
  }, [complaints, searchQuery, categoryFilter, selectedWard]);

  // Executive Action handler
  const openDispatchForm = (comp: RichComplaint) => {
    setDispatchingComplaint(comp);
    setDispatchTaskTitle(`Work Order: Emergency ${comp.category} Resolution`);
    setDispatchInstructions(comp.actions.immediate);
    setDispatchExecutor(comp.department);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingComplaint) return;

    setIsDispatching(true);
    setTimeout(() => {
      const newAction: ActionLog = {
        id: `ACT-${300 + actionLogs.length}`,
        complaintId: dispatchingComplaint.id,
        taskTitle: dispatchTaskTitle,
        actionTaken: dispatchInstructions,
        executedBy: dispatchExecutor,
        status: "Dispatched",
        timestamp: new Date().toISOString()
      };

      // Set state to In Progress
      setComplaints(prev => prev.map(c => {
        if (c.id === dispatchingComplaint.id) {
          return { ...c, status: "In Progress" };
        }
        return c;
      }));

      setActionLogs([newAction, ...actionLogs]);
      setIsDispatching(false);
      setDispatchingComplaint(null);
    }, 1200);
  };

  // Department Performance statistics (Section 6)
  const departmentPerformance = [
    { name: "Department of Water Resources", assigned: 4, resolved: 2, pending: 1, avgResolution: "3.5 Days", escalations: 0, score: 94 },
    { name: "Power & Electricity Board", assigned: 3, resolved: 2, pending: 1, avgResolution: "1.8 Days", escalations: 0, score: 96 },
    { name: "Public Works Department", assigned: 5, resolved: 2, pending: 3, avgResolution: "6.2 Days", escalations: 1, score: 78 },
    { name: "Municipal Sanitation Department", assigned: 6, resolved: 4, pending: 2, avgResolution: "1.2 Days", escalations: 0, score: 89 },
    { name: "Department of Health & Family Welfare", assigned: 2, resolved: 2, pending: 0, avgResolution: "14 Days", escalations: 0, score: 91 }
  ];

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 bg-slate-950 text-slate-100 font-sans min-h-screen relative overflow-hidden" id="mp-command-center">
      {/* Absolute Ambient High-Tech Orbs */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-900 pb-6 z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] uppercase font-black tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-md">
              DECISION PLATFORM
            </span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
            <span className="text-[10px] text-slate-500 font-bold font-mono">MP COMMAND ENGINE ACTIVE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Good Morning Hon. Member of Parliament
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Helping you answer the vital daily question: <strong className="text-indigo-400">"What should I act on today?"</strong> with deep administrative and budget intelligence.
          </p>
        </div>

        {/* Quick Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search constituency issues..." 
              className="bg-slate-900/95 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-64 text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* SECTION 1: AI Executive Briefing */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 z-10">
        
        {/* Today's AI Executive Brief (8 Columns) */}
        <div className="xl:col-span-8 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Sparkles className="w-40 h-40 text-indigo-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
              <h2 className="text-xs uppercase font-black tracking-widest text-slate-300">Today's AI Executive Brief</h2>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-xl">
              <strong>Ward 15 Water Outage</strong> remains the highest risk vector, impacting over 12,000 residents and presenting serious public sanitation and contaminant threat profiles. <strong>Streetlight Blackout in Ward 12</strong> has been flagged for nighttime safety patrols. Immediate physical work orders have been prepared and are ready for validation.
            </p>
            
            {/* Split statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">New Since Yesterday</p>
                <p className="text-xl font-black text-rose-400 font-mono">+4 issues</p>
              </div>
              <div className="bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Resolved Issues</p>
                <p className="text-xl font-black text-emerald-400 font-mono">2 resolved</p>
              </div>
              <div className="bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Risk Trend</p>
                <p className="text-xs font-bold text-slate-300 flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                  Upward in Ward 15
                </p>
              </div>
              <div className="bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Weekly Progress</p>
                <p className="text-xl font-black text-indigo-400 font-mono">+15% rate</p>
              </div>
            </div>

            {/* AI Recommended Actions */}
            <div className="space-y-2 pt-2">
              <h3 className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1">
                <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" />
                AI Recommended Actions (Immediate Attention)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-xs flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5"></span>
                  <p className="text-slate-300 leading-normal font-medium">
                    Authorize emergency water tenders to central squares in Ward 15 to secure clean hydration.
                  </p>
                </div>
                <div className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl text-xs flex gap-2.5 items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
                  <p className="text-slate-300 leading-normal font-medium">
                    Approve local energy utility cold-patch work orders to replace damaged power breaker grids.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Constituency Health Score (4 Columns) */}
        <div className="xl:col-span-4 bg-slate-900/40 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-md">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Activity className="w-4.5 h-4.5 text-indigo-400" />
            <h2 className="text-xs uppercase font-black tracking-widest text-slate-300">Overall Health Score</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="72" 
                  cy="72" 
                  r="62" 
                  stroke="url(#indigo-grad)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray="389.5"
                  strokeDashoffset={389.5 - (389.5 * 78) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="indigo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="text-center z-10">
                <span className="text-4xl font-black font-mono text-white tracking-tighter">78</span>
                <span className="text-slate-500 text-xs font-bold block">/ 100 MAX</span>
              </div>
            </div>
            <div className="text-center mt-4 space-y-0.5">
              <span className="text-xs text-indigo-400 font-extrabold block">UP +3.5% THIS WEEK</span>
              <span className="text-[10px] text-slate-500 font-medium">Dynamic constituency metric across all 16 wards</span>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 font-bold leading-normal">
              Weekly progress registers <strong>+15.4%</strong> response rate hike with 2 active departmental closures yesterday.
            </p>
          </div>
        </div>

      </div>

      {/* SECTION 2: Constituency Intelligence */}
      <div className="space-y-4 z-10">
        <div className="flex items-center gap-2 pb-1">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xs uppercase font-black tracking-widest text-slate-300">Constituency Intelligence</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4" id="constituency-intelligence-row">
          
          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Highest Risk Ward</p>
            <p className="text-sm font-black text-white">Ward 15</p>
            <span className="text-[9px] text-rose-400 font-semibold block mt-1">Critical leaks</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Fastest Growing</p>
            <p className="text-sm font-black text-white">Water Crises</p>
            <span className="text-[9px] text-amber-400 font-semibold block mt-1">+12% reports</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Most Complained</p>
            <p className="text-sm font-black text-white">Water Supply</p>
            <span className="text-[9px] text-indigo-400 font-semibold block mt-1">45% total volume</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Most Responsive</p>
            <p className="text-sm font-black text-white">Power Board</p>
            <span className="text-[9px] text-emerald-400 font-semibold block mt-1">1.8d average</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Least Responsive</p>
            <p className="text-sm font-black text-white">Sanitation</p>
            <span className="text-[9px] text-rose-400 font-semibold block mt-1">Lapsing visits</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Resolution Time</p>
            <p className="text-sm font-black text-white font-mono">3.2 Days</p>
            <span className="text-[9px] text-indigo-400 font-semibold block mt-1">District average</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">AI Confidence</p>
            <p className="text-sm font-black text-white font-mono">94.2%</p>
            <span className="text-[9px] text-emerald-400 font-semibold block mt-1">Weighted metric</span>
          </div>

          <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-xl backdrop-blur-xs">
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-wider mb-1.5">Satisfaction</p>
            <p className="text-sm font-black text-white font-mono">82%</p>
            <span className="text-[9px] text-indigo-400 font-semibold block mt-1">Citizen poll log</span>
          </div>

        </div>
      </div>

      {/* Main Grid: Left side list of Top Critical Issues, Right side full detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        
        {/* Left Side: Top 5 Critical Issues List (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-800">
              <h2 className="text-xs uppercase font-black tracking-widest text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                Top 5 Critical Issues (Immediate Attention)
              </h2>
              <span className="px-2 py-0.5 text-[8px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black rounded uppercase">
                CRITICAL RADAR
              </span>
            </div>

            {/* Ingestion Stream Feed list */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredComplaints.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No issues matches active filters.
                </div>
              ) : (
                filteredComplaints.map((comp) => {
                  const isSelected = comp.id === selectedComplaintId;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedComplaintId(comp.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSelected 
                          ? "bg-indigo-950/20 border-indigo-500/80 ring-1 ring-indigo-500/30" 
                          : "bg-slate-950/60 border-slate-900 hover:bg-slate-900/70"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                              {comp.id}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{comp.location}</span>
                          </div>
                          <h4 className="font-extrabold text-sm text-white mt-1.5">{comp.citizenName}</h4>
                        </div>

                        <div className="text-right">
                          <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                            comp.urgencyScore >= 80 ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}>
                            Score: {comp.urgencyScore}
                          </span>
                          <span className={`block text-[9px] font-semibold uppercase mt-1 ${
                            comp.status === "Pending" ? "text-amber-400" :
                            comp.status === "In Progress" ? "text-indigo-400" : "text-emerald-400"
                          }`}>
                            {comp.status}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 mt-2.5 font-serif italic line-clamp-2 leading-relaxed">
                        "{comp.originalText}"
                      </p>

                      <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-900/80 text-[10px] text-slate-400">
                        <span className="font-semibold">{comp.category}</span>
                        <span className="font-mono">{new Date(comp.createdAt).toLocaleDateString()}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick instructions widget */}
          <div className="bg-indigo-950/10 border border-indigo-500/10 rounded-2xl p-5 space-y-2.5">
            <h4 className="text-xs uppercase font-black tracking-widest text-indigo-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              Decision Engine Note
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              Selecting any grievance card automatically populates the right-side Command dashboard with translated regional summaries, estimated budget requirements, eligible government schemes, and model reasoning logs.
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Decision intelligence dashboard (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-6 backdrop-blur-md">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-widest">
                  DECISION ENGINE OUTPUT
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  {selectedComplaint.citizenName} ({selectedComplaint.id})
                </h3>
              </div>
              <button 
                onClick={() => openDispatchForm(selectedComplaint)}
                disabled={selectedComplaint.status === "Resolved"}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-black tracking-wide uppercase transition-all flex items-center gap-1.5 cursor-pointer border border-indigo-500/20"
                id="dispatch-executive-btn"
              >
                <PlusCircle className="w-4 h-4" />
                Dispatch Action
              </button>
            </div>

            {/* Tab Selection */}
            <div className="flex border-b border-slate-800 p-1 bg-slate-950/40 rounded-xl max-w-md">
              <button
                onClick={() => setActiveDetailTab("brief")}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  activeDetailTab === "brief"
                    ? "bg-indigo-600 text-white shadow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Intelligence Brief
              </button>
              <button
                onClick={() => setActiveDetailTab("evidence")}
                className={`flex-1 py-2 text-center text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeDetailTab === "evidence"
                    ? "bg-indigo-600 text-white shadow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                AI Evidence Card
              </button>
            </div>

            {activeDetailTab === "brief" ? (
              <>
                {/* SECTION 3: Issue Intelligence Feed Summary Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider">Citizen Summary</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {selectedComplaint.citizenSummary}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                    <span className="text-[9px] uppercase font-black text-indigo-400 tracking-wider">AI Summary</span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {selectedComplaint.aiSummary}
                    </p>
                  </div>

                </div>

                {/* Standard Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/40 p-4 border border-slate-900 rounded-xl">
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-500">Original Language</span>
                    <p className="text-xs font-black text-white mt-1">{selectedComplaint.detectedLanguage}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-500">Affected Area</span>
                    <p className="text-xs font-black text-white mt-1 truncate">{selectedComplaint.affectedArea}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-500">Population Impact</span>
                    <p className="text-xs font-black text-white mt-1">{selectedComplaint.populationImpact}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-black text-slate-500">Recommended Dept.</span>
                    <p className="text-xs font-black text-indigo-300 mt-1 truncate">{selectedComplaint.department}</p>
                  </div>
                </div>

                {/* Translation Box */}
                <div className="space-y-1 bg-slate-950/50 p-3.5 border border-slate-900 rounded-xl text-xs">
                  <span className="text-[9px] uppercase font-black text-slate-500 block">Translated Summary</span>
                  <p className="text-slate-300 leading-relaxed font-serif italic mt-1">
                    "{selectedComplaint.translatedText}"
                  </p>
                </div>

                {/* SECTION 4: Government Scheme Recommendation */}
                <div className="bg-slate-950/50 border border-slate-900 p-5 rounded-xl space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-300 uppercase tracking-widest">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      Government Scheme Recommendation
                    </div>
                    <span className="px-2 py-0.5 text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-black rounded uppercase">
                      {selectedComplaint.suggestedScheme}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {selectedComplaint.schemeReason}
                  </p>
                  
                  <div className="pt-2">
                    <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">Eligible Central Schemes Analyzed</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["Jal Jeevan Mission", "PMGSY", "Swachh Bharat Mission", "PMAY", "AMRUT", "Smart Cities Mission"].map((scheme) => (
                        <span 
                          key={scheme} 
                          className={`px-2 py-0.5 text-[9px] font-black rounded uppercase ${
                            selectedComplaint.suggestedScheme === scheme
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-900 text-slate-500"
                          }`}
                        >
                          {scheme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SECTION 5: Budget & Resources Intelligence */}
                <div className="bg-slate-950/50 border border-slate-900 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-900">
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                    Budget & Execution Intelligence
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-slate-950 p-3 border border-slate-900 rounded-lg text-center">
                      <span className="text-[9px] uppercase font-black text-slate-500">Approx. Budget</span>
                      <p className="text-sm font-black text-white mt-1">{selectedComplaint.budgetNumeric}</p>
                      <span className={`px-1.5 py-0.2 text-[8px] font-black rounded uppercase mt-1 inline-block ${
                        selectedComplaint.budgetEstimate === "High" ? "bg-rose-500/15 text-rose-400" :
                        selectedComplaint.budgetEstimate === "Medium" ? "bg-amber-500/15 text-amber-400" : "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {selectedComplaint.budgetEstimate} Grade
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 border border-slate-900 rounded-lg text-center">
                      <span className="text-[9px] uppercase font-black text-slate-500">Estimated Timeline</span>
                      <p className="text-sm font-black text-indigo-300 mt-1">{selectedComplaint.timelineEstimate}</p>
                    </div>

                    <div className="bg-slate-950 p-3 border border-slate-900 rounded-lg text-center">
                      <span className="text-[9px] uppercase font-black text-slate-500">Execution Complexity</span>
                      <p className="text-sm font-black text-white mt-1">{selectedComplaint.executionComplexity}</p>
                    </div>

                    <div className="bg-slate-950 p-3 border border-slate-900 rounded-lg text-center">
                      <span className="text-[9px] uppercase font-black text-slate-500">AI Confidence</span>
                      <p className="text-sm font-black text-emerald-400 mt-1 font-mono">{selectedComplaint.confidence}%</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Resources Required</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950 p-3 border border-slate-900 rounded-lg">
                      {selectedComplaint.resourcesRequired}
                    </p>
                  </div>
                </div>

                {/* SECTION 7: Explainable AI & Model Reasoning */}
                <div className="bg-slate-950/50 border border-slate-900 p-5 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-900">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    Explainable AI (Priority Diagnostic Audit)
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Why this issue received this priority score:</span>
                    <div className="space-y-1.5">
                      {selectedComplaint.priorityReasons.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="w-4 h-4 rounded-full bg-indigo-500/15 text-indigo-400 font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="leading-relaxed font-medium">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-900/80">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Model Reasoning Logs</span>
                    <p className="text-xs text-indigo-300 leading-relaxed font-mono bg-slate-950 p-3 border border-slate-900 rounded-lg">
                      {selectedComplaint.modelReasoning}
                    </p>
                  </div>
                </div>

                {/* SECTION 8: Evidence Panel */}
                <div className="bg-slate-950/50 border border-slate-900 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-300 uppercase tracking-widest pb-2 border-b border-slate-900">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    Evidence Panel & Diagnostics
                  </div>

                  {/* Uploaded Images */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Uploaded Images / On-Site Photos</span>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedComplaint.evidence.images.map((img, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-900 h-32 bg-slate-900">
                          <img 
                            src={img} 
                            alt="Evidence snapshot" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 text-[8px] font-bold bg-slate-950/85 text-white rounded">
                            Evidence #{i + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice Transcript */}
                  <div className="space-y-1 bg-slate-950 p-3 border border-slate-900 rounded-lg text-xs">
                    <span className="text-[9px] uppercase font-black text-slate-500 block mb-1">Voice Transcript Audio Log</span>
                    <p className="text-slate-300 leading-relaxed font-medium italic">
                      "{selectedComplaint.evidence.voiceTranscript}"
                    </p>
                  </div>

                  {/* Documents & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-black text-slate-500 block">Documents Attached</span>
                      <div className="space-y-1 text-xs">
                        {selectedComplaint.evidence.documents.map((doc) => (
                          <div key={doc} className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-300 flex items-center gap-1.5 font-mono text-[10px]">
                            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase font-black text-slate-500 block">Zonal Location Metrics</span>
                      <div className="p-2 bg-slate-950 border border-slate-900 rounded-lg text-slate-300 flex flex-col gap-1 text-[11px]">
                        <p><strong>Coordinates:</strong> 17.385° N, 78.486° E</p>
                        <p><strong>Region Scope:</strong> {selectedComplaint.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-2 pt-2 border-t border-slate-900/80">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Status Timeline</span>
                    <div className="space-y-2.5">
                      {selectedComplaint.evidence.timeline.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-xs items-start">
                          <div className="relative flex flex-col items-center shrink-0">
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                            {idx < selectedComplaint.evidence.timeline.length - 1 && (
                              <div className="w-0.5 h-6 bg-slate-800"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-slate-200 font-extrabold">{item.step}</p>
                            <p className="text-[10px] text-slate-500">{item.date} • {item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Analysis */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-900/80">
                    <span className="text-[9px] uppercase font-black text-slate-500 block">Sensory AI Analysis</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-950 p-3 border border-slate-900 rounded-lg">
                      {selectedComplaint.evidence.aiAnalysis}
                    </p>
                  </div>
                </div>

                {/* SECTION 9: AI Action Center */}
                <div className="bg-indigo-950/10 border border-indigo-500/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-400 uppercase tracking-widest pb-2 border-b border-indigo-500/15">
                    <Sparkles className="w-4 h-4" />
                    AI Action Center (Resolution Pathways)
                  </div>

                  <div className="space-y-3.5 text-xs">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-lg space-y-1">
                        <span className="text-[9px] uppercase font-black text-rose-400">Immediate Action Item</span>
                        <p className="text-slate-200 leading-relaxed font-semibold">
                          {selectedComplaint.actions.immediate}
                        </p>
                      </div>

                      <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-lg space-y-1">
                        <span className="text-[9px] uppercase font-black text-indigo-400">Next Week Agenda</span>
                        <p className="text-slate-200 leading-relaxed font-semibold">
                          {selectedComplaint.actions.nextWeek}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-lg space-y-1">
                      <span className="text-[9px] uppercase font-black text-slate-400">Long-term Strategic Planning</span>
                      <p className="text-slate-200 leading-relaxed font-semibold">
                        {selectedComplaint.actions.longTerm}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-lg space-y-1">
                        <span className="text-[9px] uppercase font-black text-slate-400">Budget Allocation Suggestion</span>
                        <p className="text-slate-200 leading-relaxed font-semibold">
                          {selectedComplaint.actions.budgetSuggestions}
                        </p>
                      </div>

                      <div className="bg-slate-950/60 p-3.5 border border-slate-900 rounded-lg space-y-1">
                        <span className="text-[9px] uppercase font-black text-slate-400">Cross-Department Coordination</span>
                        <p className="text-slate-200 leading-relaxed font-semibold">
                          {selectedComplaint.actions.coordination}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              </>
            ) : (() => {
              const evidence = getEvidenceCardDetails(selectedComplaint);
              return (
                <div className="space-y-6 animate-fadeIn" id={`evidence-card-${selectedComplaint.id}`}>
                  {/* Card Header Seal */}
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-indigo-400">
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] uppercase font-mono font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded tracking-widest">
                            Official Legislative Audit
                          </span>
                          <span className="text-[9px] uppercase font-mono text-slate-400">
                            ID: {selectedComplaint.id}-EVID
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-white mt-1">
                          GovAI Evidence-Based Development Priority
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          alert(`EXPORT SUCCESS: PDF Audit Document for ${selectedComplaint.id} has been prepared for local storage download.`);
                        }}
                        className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-[11px] font-bold text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        Export Audit PDF
                      </button>
                    </div>
                  </div>

                  {/* Priority & Confidence Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Priority Score Gauge */}
                    <div className="p-5 bg-gradient-to-br from-slate-950/80 to-slate-900/40 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-indigo-400" />
                          Priority Index Score
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white leading-none">
                            {evidence.priorityScore}
                          </span>
                          <span className="text-xs font-bold text-slate-500">/100</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            evidence.severityLevel === "Critical" ? "bg-red-500 animate-pulse" :
                            evidence.severityLevel === "High" ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                          <span className="text-[11px] font-bold text-slate-300">
                            {evidence.severityLevel} Urgency Rating
                          </span>
                        </div>
                      </div>
                      
                      {/* Circular Gauge visualization */}
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-850" strokeWidth="4" fill="transparent" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-indigo-500" strokeWidth="4" fill="transparent" 
                            strokeDasharray={175} 
                            strokeDashoffset={175 - (175 * evidence.priorityScore) / 100} 
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="absolute text-[11px] font-mono font-bold text-indigo-400">
                          {evidence.priorityScore}%
                        </span>
                      </div>
                    </div>

                    {/* Confidence Score Gauge */}
                    <div className="p-5 bg-gradient-to-br from-slate-950/80 to-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-400" />
                          AI Confidence Level
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white leading-none">
                            {evidence.confidenceScore}
                          </span>
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          Multimodal translation & geospatial data alignment rating
                        </p>
                      </div>

                      {/* Custom visual confidence bars */}
                      <div className="flex flex-col gap-1 w-16 justify-center">
                        <div className="h-1.5 bg-slate-850 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${evidence.confidenceScore}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-center text-slate-400 font-bold uppercase">
                          High Match
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Explainable AI Plain-Language Reason */}
                  <div className="p-5 bg-indigo-950/20 border border-indigo-500/10 rounded-xl space-y-3">
                    <span className="text-[10px] uppercase font-black text-indigo-400 tracking-widest block">
                      Explainable AI (XAI) Pavement & Community Analysis
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {evidence.explanation}
                    </p>
                    <div className="text-[10px] text-slate-500 italic font-medium flex items-center gap-1.5 pt-1 border-t border-slate-850">
                      <span>Source Evidence:</span>
                      <span>NLP Translation Vector Mesh • Spatial Overlay Diagnostics • Automated Crime Mapping</span>
                    </div>
                  </div>

                  {/* Bento Grid: Evidence Factors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Submission Metrics */}
                    <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          Community Engagement Volume
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-slate-900/30 rounded-lg">
                          <span className="text-[9px] uppercase text-slate-500 block">Related Cases</span>
                          <span className="text-lg font-black text-white leading-none">
                            {evidence.relatedSubmissionsCount} Submissions
                          </span>
                        </div>
                        <div className="p-2.5 bg-slate-900/30 rounded-lg">
                          <span className="text-[9px] uppercase text-slate-500 block">Sentiment Trend</span>
                          <span className="text-xs font-bold text-amber-500 block mt-1.5 leading-tight">
                            {evidence.trendText}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Impact Demographics */}
                    <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                          Estimated Affected Population
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900/30 rounded-lg">
                        <span className="text-lg font-black text-white">
                          {evidence.populationImpact}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Calculated based on local municipal demographic censuses and active residential density.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Nearby Public Assets */}
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                      Geographic Proximity Validation (Nearby Public Assets)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {evidence.nearbyAssets.map((asset, i) => (
                        <span key={i} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Why Prioritized List */}
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                      Core Prioritization Evidence Factors
                    </span>
                    <ul className="space-y-2.5">
                      {evidence.whyPrioritized.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed font-normal">
                          <span className="text-indigo-400 font-black mt-0.5">•</span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Execution Blueprint */}
                  <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl space-y-3">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">
                      AI Execution & Budget Proposal
                    </span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-lg">
                        <span className="text-[9px] uppercase text-slate-500 block">Department</span>
                        <span className="text-xs font-black text-white mt-1 block">
                          {evidence.suggestedDepartment}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-lg">
                        <span className="text-[9px] uppercase text-slate-500 block">Sovereign Scheme</span>
                        <span className="text-xs font-black text-amber-500 mt-1 block">
                          {evidence.suggestedScheme}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-lg">
                        <span className="text-[9px] uppercase text-slate-500 block">Budget Target</span>
                        <span className="text-xs font-black text-emerald-400 mt-1 block">
                          {evidence.budgetEstimate}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-lg">
                        <span className="text-[9px] uppercase text-slate-500 block">Timeline</span>
                        <span className="text-xs font-black text-indigo-400 mt-1 block">
                          {evidence.implementationTimeline}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Next Action */}
                  <div className="p-5 bg-gradient-to-r from-indigo-900/30 to-indigo-950/10 border border-indigo-500/20 rounded-xl space-y-2">
                    <span className="text-[9px] uppercase font-mono font-black text-indigo-400 tracking-widest flex items-center gap-1">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      Immediate Recommended Legislative Action
                    </span>
                    <p className="text-sm font-black text-white">
                      {evidence.recommendedNextAction}
                    </p>
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={() => openDispatchForm(selectedComplaint)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        Sign & Dispatch Order
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

          </div>

        </div>

      </div>

      {/* SECTION 6: Department Performance Panel */}
      <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 space-y-4 z-10 backdrop-blur-md">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Building2 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xs uppercase font-black tracking-widest text-slate-300">Department Performance Statistics</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/50 text-[10px] font-black uppercase text-slate-500 border border-slate-900">
              <tr>
                <th className="p-3">Department</th>
                <th className="p-3">Assigned</th>
                <th className="p-3">Resolved</th>
                <th className="p-3">Pending</th>
                <th className="p-3">Average Resolution</th>
                <th className="p-3">Escalations</th>
                <th className="p-3">Performance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900">
              {departmentPerformance.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-950/30 transition-all">
                  <td className="p-3 font-extrabold text-white">{dept.name}</td>
                  <td className="p-3 font-mono text-slate-400">{dept.assigned}</td>
                  <td className="p-3 font-mono text-emerald-400">{dept.resolved}</td>
                  <td className="p-3 font-mono text-amber-400">{dept.pending}</td>
                  <td className="p-3 text-slate-400">{dept.avgResolution}</td>
                  <td className="p-3 font-mono text-rose-400">{dept.escalations}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${dept.score}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold text-white">{dept.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Work Order Dispatch popup overlay */}
      <AnimatePresence>
        {dispatchingComplaint && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
              id="dispatch-dialog-panel"
            >
              <div className="p-5 bg-slate-950 border-b border-slate-850 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-sm">Dispatch Executive Work Order</h3>
                </div>
                <button onClick={() => setDispatchingComplaint(null)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmDispatch} className="p-5 space-y-4">
                
                <div className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl text-xs space-y-1">
                  <p className="font-black text-indigo-400">{dispatchingComplaint.id} • {dispatchingComplaint.citizenName}</p>
                  <p className="text-slate-400 italic">"{dispatchingComplaint.translatedText}"</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 block">Work Order Title</label>
                  <input 
                    type="text" 
                    required
                    value={dispatchTaskTitle}
                    onChange={(e) => setDispatchTaskTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 block">Assigned Executive Department</label>
                  <input 
                    type="text" 
                    required
                    value={dispatchExecutor}
                    onChange={(e) => setDispatchExecutor(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 block">Executive Dispatch Instructions</label>
                  <textarea 
                    rows={4}
                    required
                    value={dispatchInstructions}
                    onChange={(e) => setDispatchInstructions(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setDispatchingComplaint(null)}
                    className="px-4 py-2 border border-slate-800 text-slate-400 hover:bg-slate-950 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isDispatching}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {isDispatching ? (
                      <>
                        <Activity className="w-3.5 h-3.5 animate-spin" />
                        Syncing API...
                      </>
                    ) : (
                      "Confirm & Dispatch"
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Banner */}
      <div className="pt-6 border-t border-slate-900 text-center z-10">
        <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest leading-none">
          GOVAI CONNECT MP INTEL PLATFORM • STRICTLY CONFIDENTIAL MEMBER CONSTITUENCY COMMANDS
        </p>
      </div>

    </div>
  );
}
