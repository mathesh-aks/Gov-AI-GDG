import { GoogleGenAI } from "@google/genai";
import * as templates from "./promptTemplates";

// Types matching the output requirements
export interface ExtractedEntities {
  roadNames: string[];
  villages: string[];
  governmentOffices: string[];
  hospitals: string[];
  schools: string[];
  departments: string[];
  landmarks: string[];
}

export interface DuplicatePrep {
  searchKeywords: string[];
  issueSignature: string;
}

export interface SeverityAnalysis {
  severity: "Low" | "Medium" | "High" | "Critical";
  factors: string[];
}

export interface PriorityScoreInfo {
  score: number;
  justification: string;
}

export interface DepartmentRecommendationInfo {
  department: string;
  routingRulesMatched: string[];
}

export interface ExecutiveSummaryInfo {
  summary: string;
  actionItems: string[];
}

export interface AIConfidenceInfo {
  confidenceScore: number;
  confidenceFactors: string[];
}

export interface PipelineStageLog {
  stageName: string;
  status: "Completed" | "Simulated" | "Failed";
  durationMs: number;
  output: any;
  error?: string;
}

export interface AIPipelineInput {
  title: string;
  description: string;
  language: string;
  location: string;
  ward?: string;
  citizenProfile?: {
    fullName: string;
    preferredLanguage?: string;
  };
  attachmentsCount?: number;
  voiceTranscript?: string;
}

export interface AIPipelineOutput {
  id: string;
  originalLanguage: string;
  translatedText: string;
  detectedCategory: "Water Supply" | "Roads & Transport" | "Public Safety" | "Sanitation" | "Power & Electricity" | "Healthcare" | "Education" | "General";
  extractedEntities: ExtractedEntities;
  severity: "Low" | "Medium" | "High" | "Critical";
  priorityScore: number;
  recommendedDepartment: string;
  executiveSummary: string;
  confidenceScore: number;
  processingTimeMs: number;
  
  // Additional diagnostic data for the AI Inspector
  languageConfidence: number;
  detectedLanguage: string;
  duplicatePrep: DuplicatePrep;
  severityFactors: string[];
  priorityJustification: string;
  departmentRoutingRules: string[];
  executiveActionItems: string[];
  confidenceFactors: string[];
  stagesLog: PipelineStageLog[];
}

/**
 * Interface representing a replaceable AI Processing pipeline stage
 */
export interface PipelineStage<TInput, TOutput> {
  name: string;
  run(input: TInput, aiClient: GoogleGenAI | null): Promise<{
    output: TOutput;
    status: "Completed" | "Simulated";
    error?: string;
  }>;
}

/**
 * Stage 1: Language Detection
 */
export class LanguageDetectionStage implements PipelineStage<string, { language: string; confidence: number }> {
  name = "Language Detection";

  async run(text: string, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_LANGUAGE_DETECTION.replace("{text}", text);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              language: result.language || "English",
              confidence: parseFloat(result.confidence) || 0.9,
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    // High fidelity offline simulation
    return {
      output: this.simulate(text),
      status: "Simulated" as const,
    };
  }

  private simulate(text: string) {
    let language = "English";
    let confidence = 0.95;

    if (/[अ-ह]/.test(text)) {
      language = "Hindi";
      confidence = 0.92;
    } else if (/[அ-ஹ]/.test(text)) {
      language = "Tamil";
      confidence = 0.94;
    } else if (/[అ-హ]/.test(text)) {
      language = "Telugu";
      confidence = 0.91;
    } else if (/[അ-ഹ]/.test(text)) {
      language = "Malayalam";
      confidence = 0.93;
    } else if (/[ಕ-ಹ]/.test(text)) {
      language = "Kannada";
      confidence = 0.90;
    }

    return { language, confidence };
  }
}

/**
 * Stage 2: Translation to English (when required)
 */
export class TranslationStage implements PipelineStage<{ text: string; sourceLanguage: string }, string> {
  name = "English Translation";

  async run(input: { text: string; sourceLanguage: string }, aiClient: GoogleGenAI | null) {
    if (input.sourceLanguage.toLowerCase() === "english") {
      return {
        output: input.text,
        status: "Completed" as const,
      };
    }

    if (aiClient) {
      try {
        const prompt = templates.PROMPT_TRANSLATION.replace("{text}", input.text);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: result.translatedText || input.text,
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.text, input.sourceLanguage),
      status: "Simulated" as const,
    };
  }

  private simulate(text: string, language: string): string {
    const translationMap: Record<string, string> = {
      "हमारे इलाके वार्ड 15 में पिछले 5 दिनों से पीने का पानी नहीं आ रहा है। पाइपलाइन में कुछ लीकेज है। बच्चे और बुजुर्ग बहुत परेशान हैं। कृपया जल टैंकर भेजें।":
        "Drinking water has not been available in our area Ward 15 for the last 5 days. There is some leakage in the pipeline. Children and the elderly are very troubled. Please send water tankers.",
      "వార్డు 14 లో పైప్‌లైన్ పగిలిపోయి మంచినీరంతా మురుగు కాలువలోకి వృధాగా పోతోంది. ప్రెషర్ అస్సలు లేదు.":
        "In Ward 14, the pipeline is broken and all the drinking water is going waste into the drain. There is no pressure at all.",
      "ക്ലബ്ബ് റോഡിൽ മാലിന്യം വൻതോതില കെട്ടിക്കിടക്കുന്നു. മുൻസിപ്പൽ വണ്ടികൾ ആഴ്ചയിൽ ഒരിക്കൽ മാത്രമാണ് വരുന്നത്. കൊതുക് ശല്യം രൂക്ഷമാണ്.":
        "Garbage is piling up heavily on Club Road. Municipal trucks come only once a week. Mosquito menace is severe.",
    };

    // If matches any known pre-seeds exactly
    const trimmed = text.trim();
    if (translationMap[trimmed]) {
      return translationMap[trimmed];
    }

    return `[Translated from ${language}] ${text}`;
  }
}

/**
 * Stage 3: Complaint Classification
 */
export class ClassificationStage implements PipelineStage<{ title: string; description: string }, { category: string; reasoning: string }> {
  name = "Complaint Classification";

  async run(input: { title: string; description: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_CLASSIFICATION
          .replace("{title}", input.title)
          .replace("{description}", input.description);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              category: result.category || "General",
              reasoning: result.reasoning || "Standard routing rules applied.",
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string) {
    const text = `${title} ${description}`.toLowerCase();
    let category = "General";
    let reasoning = "Matches default classification fallback rules.";

    if (text.includes("water") || text.includes("leak") || text.includes("pipeline") || text.includes("drain") || text.includes("पानी") || text.includes("పైప్‌లైన్")) {
      category = "Water Supply";
      reasoning = "Identified keywords associated with water infrastructure failure.";
    } else if (text.includes("road") || text.includes("pothole") || text.includes("bridge") || text.includes("traffic") || text.includes("street")) {
      if (text.includes("light") || text.includes("dark") || text.includes("safety") || text.includes("theft")) {
        category = "Public Safety";
        reasoning = "Concerns street-level light maintenance with secondary criminal safety implications.";
      } else {
        category = "Roads & Transport";
        reasoning = "References asphalt erosion and road connectivity damage.";
      }
    } else if (text.includes("garbage") || text.includes("waste") || text.includes("sanitation") || text.includes("trash") || text.includes("മാലിന്യം")) {
      category = "Sanitation";
      reasoning = "References waste dumping and municipal sanitation frequency deficits.";
    } else if (text.includes("power") || text.includes("electricity") || text.includes("outage") || text.includes("load") || text.includes("voltage")) {
      category = "Power & Electricity";
      reasoning = "Relates to electrical distribution grid stability and hardware replacement.";
    } else if (text.includes("doctor") || text.includes("hospital") || text.includes("health") || text.includes("clinic") || text.includes("pediatrician")) {
      category = "Healthcare";
      reasoning = "References primary healthcare center staffing shortages and travel delays.";
    } else if (text.includes("school") || text.includes("teacher") || text.includes("education") || text.includes("college")) {
      category = "Education";
      reasoning = "Identified educational facility operations and teacher resources.";
    }

    return { category, reasoning };
  }
}

/**
 * Stage 4: Entity Extraction
 */
export class EntityExtractionStage implements PipelineStage<string, ExtractedEntities> {
  name = "Entity Extraction";

  async run(text: string, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_ENTITY_EXTRACTION.replace("{text}", text);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              roadNames: result.roadNames || [],
              villages: result.villages || [],
              governmentOffices: result.governmentOffices || [],
              hospitals: result.hospitals || [],
              schools: result.schools || [],
              departments: result.departments || [],
              landmarks: result.landmarks || [],
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(text),
      status: "Simulated" as const,
    };
  }

  private simulate(text: string): ExtractedEntities {
    const textLower = text.toLowerCase();
    const entities: ExtractedEntities = {
      roadNames: [],
      villages: [],
      governmentOffices: [],
      hospitals: [],
      schools: [],
      departments: [],
      landmarks: [],
    };

    if (textLower.includes("ward 15")) entities.villages.push("Ward 15");
    if (textLower.includes("ward 14")) entities.villages.push("Ward 14");
    if (textLower.includes("club road")) entities.roadNames.push("Club Road");
    if (textLower.includes("main sector road")) entities.roadNames.push("Main Sector Road");
    if (textLower.includes("market junction")) {
      entities.roadNames.push("Market Junction Road");
      entities.landmarks.push("Market Junction");
    }
    if (textLower.includes("lake view")) entities.villages.push("Lake View Garden Colony");
    if (textLower.includes("hospital") || textLower.includes("phc") || textLower.includes("health center")) {
      entities.hospitals.push("Primary Health Center (PHC)");
      entities.governmentOffices.push("Civil Hospital Sub-center");
    }
    if (textLower.includes("water resources") || textLower.includes("water board")) {
      entities.departments.push("Department of Water Resources");
    }
    if (textLower.includes("power") || textLower.includes("electricity")) {
      entities.departments.push("Power & Electricity Board");
    }

    // Extrapolation for arbitrary inputs
    if (entities.villages.length === 0) {
      const wardMatch = text.match(/Ward\s+\d+/i);
      if (wardMatch) entities.villages.push(wardMatch[0]);
    }

    return entities;
  }
}

/**
 * Stage 5: Duplicate Detection Preparation
 */
export class DuplicateDetectionPrepStage implements PipelineStage<{ title: string; description: string; category: string; location: string }, DuplicatePrep> {
  name = "Duplicate Prep";

  async run(input: { title: string; description: string; category: string; location: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_DUPLICATE_PREPARATION
          .replace("{title}", input.title)
          .replace("{description}", input.description)
          .replace("{category}", input.category)
          .replace("{location}", input.location);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              searchKeywords: result.searchKeywords || [],
              issueSignature: result.issueSignature || "general_complaint_remedy",
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description, input.category, input.location),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string, category: string, location: string): DuplicatePrep {
    const words = `${title} ${description}`.toLowerCase();
    let searchKeywords = ["municipal", "public", "complaint"];
    let issueSignature = "general_unclassified_issue";

    if (category === "Water Supply") {
      searchKeywords = ["drinking water leakage", "pipeline burst", "no water pressure", "water tanker request", location];
      issueSignature = "pipeline_leakage_water_disruption";
    } else if (category === "Public Safety") {
      searchKeywords = ["streetlights dark", "women safety risk", "unlit junction hazard", "theft reports", location];
      issueSignature = "dark_streetlights_security_risk";
    } else if (category === "Roads & Transport") {
      searchKeywords = ["road pothole damage", "traffic jam junction", "slip vehicle injuries", "paving restoration", location];
      issueSignature = "pothole_asphalt_structural_erosion";
    } else if (category === "Sanitation") {
      searchKeywords = ["garbage dump accumulation", "municipal clearing deficit", "mosquito breeding hazard", "unhygienic", location];
      issueSignature = "garbage_solid_waste_clogging";
    } else if (category === "Power & Electricity") {
      searchKeywords = ["power cutout blackouts", "voltage fluctuation harm", "transformer blowout fuse", "electricity stability", location];
      issueSignature = "grid_electrical_distribution_failure";
    } else if (category === "Healthcare") {
      searchKeywords = ["phc clinical understaffing", "no medical officer", "travel 30km distance", "gynecologist pediatrician", location];
      issueSignature = "phc_staff_shortage_healthcare_access";
    }

    return { searchKeywords, issueSignature };
  }
}

/**
 * Stage 6: Severity Analysis
 */
export class SeverityAnalysisStage implements PipelineStage<{ title: string; description: string; category: string }, SeverityAnalysis> {
  name = "Severity Analysis";

  async run(input: { title: string; description: string; category: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_SEVERITY_ANALYSIS
          .replace("{title}", input.title)
          .replace("{description}", input.description)
          .replace("{category}", input.category);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              severity: result.severity || "Medium",
              factors: result.factors || [],
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description, input.category),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string, category: string): SeverityAnalysis {
    const text = `${title} ${description}`.toLowerCase();
    let severity: SeverityAnalysis["severity"] = "Medium";
    let factors = ["Standard service level grievance requiring standard zonal remediation."];

    if (category === "Water Supply") {
      if (text.includes("5 days") || text.includes("leakage")) {
        severity = "High";
        factors = [
          "Disruption of essential drinking supply has exceeded 96 hours.",
          "High leakage is causing massive civil resource waste.",
          "Affects over 4,500 residents including child and elder cohorts."
        ];
      } else {
        severity = "Medium";
        factors = ["Low pressure reports indicating local feeder pipe corrosion or localized blockage."];
      }
    } else if (category === "Public Safety") {
      severity = "High";
      factors = [
        "Complete visual blackout of streetlights on a main transport corridor.",
        "Increases target opportunity rates for local thefts and burglaries.",
        "Compromises active safety standards for female late-hour commuters."
      ];
    } else if (category === "Roads & Transport" && (text.includes("slipped") || text.includes("injur") || text.includes("accident"))) {
      severity = "High";
      factors = [
        "Unpaved monsoon potholes have directly triggered physical two-wheeler crashes and injuries.",
        "Generates persistent traffic gridlock delays along commercial hub intersections."
      ];
    } else if (category === "Healthcare") {
      severity = "High";
      factors = [
        "Complete absence of essential maternal and pediatric coverage during outpatient routines.",
        "Forces low-income residents to bear costly 30 km transport transits to main district clinics."
      ];
    } else if (category === "Sanitation" && text.includes("mosquito")) {
      severity = "Medium";
      factors = [
        "Heavily accumulated organic street waste is acting as a rapid breeding vector for mosquito vectors.",
        "Poses local breakout risks for dengue/malaria if fogging routines are delayed."
      ];
    }

    return { severity, factors };
  }
}

/**
 * Stage 7: Priority Score (0-100)
 */
export class PriorityScoreStage implements PipelineStage<{ title: string; description: string; category: string; severity: string }, PriorityScoreInfo> {
  name = "Priority Score";

  async run(input: { title: string; description: string; category: string; severity: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_PRIORITY_SCORE
          .replace("{title}", input.title)
          .replace("{description}", input.description)
          .replace("{category}", input.category)
          .replace("{severity}", input.severity);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              score: Math.min(100, Math.max(0, parseInt(result.score) || 50)),
              justification: result.justification || "Determined via pipeline model parameters.",
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description, input.category, input.severity),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string, category: string, severity: string): PriorityScoreInfo {
    const text = `${title} ${description}`.toLowerCase();
    let score = 50;
    let justification = "Standard municipal queue priority applied.";

    if (category === "Water Supply") {
      if (text.includes("5 days")) {
        score = 92;
        justification = "Emergency escalation triggered due to absolute supply cessation exceeding 48 hours for vulnerable demographics.";
      } else {
        score = 82;
        justification = "Pipeline rupture causing continuous fresh water loss and localized waterlogging.";
      }
    } else if (category === "Public Safety") {
      score = 78;
      justification = "Unlit streetlights on main thoroughfare leading to elevated criminal activity rates and active traffic safety hazards.";
    } else if (category === "Roads & Transport") {
      if (text.includes("injur") || text.includes("crash") || text.includes("slip")) {
        score = 80;
        justification = "Active pothole configuration has already caused traffic slip injuries and demands emergency cold-mix laying.";
      } else {
        score = 62;
        justification = "Significant road surface degradation causing persistent congestion during commuter hours.";
      }
    } else if (category === "Healthcare") {
      score = 75;
      justification = "Staffing vacuum at rural sub-center forcing vulnerable demographics into major economic transport transits.";
    } else if (category === "Sanitation") {
      score = 72;
      justification = "Unmanaged garbage dumps causing immediate public health threat from mosquito vectors and environmental runoff.";
    } else if (severity === "High") {
      score = 75;
      justification = "High severity rating automatically escalates priority queue positioning.";
    }

    return { score, justification };
  }
}

/**
 * Stage 8: Department Recommendation
 */
export class DepartmentRecommendationStage implements PipelineStage<{ title: string; description: string; category: string }, DepartmentRecommendationInfo> {
  name = "Department Routing";

  async run(input: { title: string; description: string; category: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_DEPARTMENT_RECOMMENDATION
          .replace("{title}", input.title)
          .replace("{description}", input.description)
          .replace("{category}", input.category);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              department: result.department || "General Administration Department",
              routingRulesMatched: result.routingRulesMatched || [],
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description, input.category),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string, category: string): DepartmentRecommendationInfo {
    let department = "General Administration Department";
    let routingRulesMatched = ["Default municipal dispatch rules applied."];

    if (category === "Water Supply") {
      department = "Department of Water Resources";
      routingRulesMatched = [
        "Water infrastructure and municipal supply pipeline rule matched.",
        "Emergency tanker routing parameters matched."
      ];
    } else if (category === "Public Safety") {
      department = "Power & Electricity Board";
      routingRulesMatched = [
        "Streetlighting and outdoor lighting grid maintenance rule matched.",
        "Coordinated with Police Department for night patrolling oversight."
      ];
    } else if (category === "Roads & Transport") {
      department = "Public Works Department (PWD)";
      routingRulesMatched = [
        "Major arterial road potholes and asphalt repair protocol matched.",
        "Traffic junction structural maintenance rule matched."
      ];
    } else if (category === "Sanitation") {
      department = "Municipal Corporation Sanitation Division";
      routingRulesMatched = [
        "Solid waste clearance and garbage routing rules matched.",
        "Public health anti-larval chemical fogging dispatch rule matched."
      ];
    } else if (category === "Power & Electricity") {
      department = "Power & Electricity Board";
      routingRulesMatched = ["High-voltage feeder grid repair and transformer replacement protocols matched."];
    } else if (category === "Healthcare") {
      department = "Department of Health & Family Welfare";
      routingRulesMatched = ["Rural healthcare center staff recruitment and sub-center rotation guidelines matched."];
    } else if (category === "Education") {
      department = "Department of School Education";
      routingRulesMatched = ["Primary school resource allocation and staff vacancy matching."];
    }

    return { department, routingRulesMatched };
  }
}

/**
 * Stage 9: Executive Summary
 */
export class ExecutiveSummaryStage implements PipelineStage<{ title: string; description: string; category: string; location: string }, ExecutiveSummaryInfo> {
  name = "Executive Summary";

  async run(input: { title: string; description: string; category: string; location: string }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const prompt = templates.PROMPT_EXECUTIVE_SUMMARY
          .replace("{title}", input.title)
          .replace("{description}", input.description)
          .replace("{category}", input.category)
          .replace("{location}", input.location);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              summary: result.summary || "No summary generated.",
              actionItems: result.actionItems || [],
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.title, input.description, input.category, input.location),
      status: "Simulated" as const,
    };
  }

  private simulate(title: string, description: string, category: string, location: string): ExecutiveSummaryInfo {
    let summary = `A citizen has reported a significant grievance regarding ${category} at ${location}. Detailed survey is required.`;
    let actionItems = ["Direct standard field teams to visit the site.", "Liaise with the zonal administrative supervisor."];

    if (category === "Water Supply") {
      summary = `Vulnerable demographics in ${location} have faced an absolute lack of potable water for over 5 days due to a high-volume leak in the main distribution pipeline. Pipeline water pressure is zero, completely cutting off primary supply and creating localized swamp hazards near the breach point.`;
      actionItems = [
        "Authorize immediate deployment of 4 municipal water tenders to satisfy immediate potable demand.",
        "Instruct Chief Engineer at Department of Water Resources to dispatch pipeline weld technicians to secure the leak.",
        "Authorize contingency funds for local pump house upgrades."
      ];
    } else if (category === "Public Safety") {
      summary = `Critical safety blackout along ${location} due to non-functional streetlighting extending over a fortnight. Residents report dark corridors are actively exploiting opportunities for minor theft, drastically compromising security guidelines for commuters returning after dark.`;
      actionItems = [
        "Escalate streetlight repair task orders with high-priority status to the Power & Electricity Board.",
        "Liaise with the local Police Inspector to request active night patrolling between 8:00 PM and 4:00 AM.",
        "Approve the rapid solar LED streetlighting pilot program budget."
      ];
    } else if (category === "Roads & Transport") {
      summary = `Severe asphalt erosion near ${location} has manifested into deep pothole hazards that are severely delaying commuter traffic flow and have directly triggered multiple vehicle slips resulting in civilian injuries.`;
      actionItems = [
        "Order Public Works Department (PWD) road crew to mobilize emergency cold-asphalt compound repairs.",
        "Request District Road Safety Committee to audit the intersection's drainage runoff pattern.",
        "Propose comprehensive re-metalling of the sector road in the upcoming constituency budget."
      ];
    } else if (category === "Sanitation") {
      summary = `Heavy organic and dry waste piling on ${location} due to municipal waste collection dropping to once-weekly rotations. Residents face terrible odor and severe mosquito infestation risks close to residential blocks.`;
      actionItems = [
        "Instruct Municipal Sanitation Supervisor to restructure collection routes to three times weekly.",
        "Order local health officers to perform chemical anti-larval fogging at the disposal junction.",
        "Deploy modular steel waste bins to discourage street littering."
      ];
    } else if (category === "Healthcare") {
      summary = `Primary Health Center sub-center at ${location} is operating with severe staff deficits, lacking general, gynecological, or pediatric coverage during critical morning hours, forcing residents to undertake costly transits to main district clinics.`;
      actionItems = [
        "Liaise with District Medical Officer to approve weekly rotation coverage by pediatric and maternal specialists.",
        "Draft administrative request to State Ministry of Health to fill standard staff vacancies on priority."
      ];
    }

    return { summary, actionItems };
  }
}

/**
 * Stage 10: AI Confidence Score
 */
export class AIConfidenceScoreStage implements PipelineStage<{ input: AIPipelineInput; outputs: Partial<AIPipelineOutput> }, AIConfidenceInfo> {
  name = "QA & Confidence Assessment";

  async run(input: { input: AIPipelineInput; outputs: Partial<AIPipelineOutput> }, aiClient: GoogleGenAI | null) {
    if (aiClient) {
      try {
        const payloadString = JSON.stringify({
          title: input.input.title,
          description: input.input.description,
          detectedCategory: input.outputs.detectedCategory,
          severity: input.outputs.severity,
          priorityScore: input.outputs.priorityScore,
          recommendedDepartment: input.outputs.recommendedDepartment,
        });

        const prompt = templates.PROMPT_AI_CONFIDENCE_SCORE.replace("{payload}", payloadString);
        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text.trim());
          return {
            output: {
              confidenceScore: Math.min(1.0, Math.max(0.0, parseFloat(result.confidenceScore) || 0.85)),
              confidenceFactors: result.confidenceFactors || [],
            },
            status: "Completed" as const,
          };
        }
      } catch (err: any) {
        console.warn(`${this.name} API execution failed, falling back to Simulation.`, err);
      }
    }

    return {
      output: this.simulate(input.input, input.outputs),
      status: "Simulated" as const,
    };
  }

  private simulate(input: AIPipelineInput, outputs: Partial<AIPipelineOutput>): AIConfidenceInfo {
    let confidenceScore = 0.88;
    const confidenceFactors = [
      "Explicit issue description provided by citizen.",
      "Identified clear location and ward constraints."
    ];

    if (input.attachmentsCount && input.attachmentsCount > 0) {
      confidenceScore += 0.05;
      confidenceFactors.push(`Verified evidence attachments count: ${input.attachmentsCount}.`);
    }

    if (input.voiceTranscript) {
      confidenceScore += 0.04;
      confidenceFactors.push("Corroborated text context using voice-to-text transcript.");
    }

    if (outputs.detectedCategory && outputs.detectedCategory !== "General") {
      confidenceScore += 0.03;
      confidenceFactors.push("High-accuracy category mapping match.");
    }

    confidenceScore = Math.min(0.99, confidenceScore);
    return { confidenceScore, confidenceFactors };
  }
}

/**
 * AI Intelligence Engine Pipeline coordinator
 */
export class AIEnginePipeline {
  private stages: {
    language: LanguageDetectionStage;
    translation: TranslationStage;
    classification: ClassificationStage;
    entities: EntityExtractionStage;
    duplicatePrep: DuplicateDetectionPrepStage;
    severity: SeverityAnalysisStage;
    priority: PriorityScoreStage;
    department: DepartmentRecommendationStage;
    summary: ExecutiveSummaryStage;
    confidence: AIConfidenceScoreStage;
  };

  constructor(
    language = new LanguageDetectionStage(),
    translation = new TranslationStage(),
    classification = new ClassificationStage(),
    entities = new EntityExtractionStage(),
    duplicatePrep = new DuplicateDetectionPrepStage(),
    severity = new SeverityAnalysisStage(),
    priority = new PriorityScoreStage(),
    department = new DepartmentRecommendationStage(),
    summary = new ExecutiveSummaryStage(),
    confidence = new AIConfidenceScoreStage()
  ) {
    this.stages = {
      language,
      translation,
      classification,
      entities,
      duplicatePrep,
      severity,
      priority,
      department,
      summary,
      confidence,
    };
  }

  /**
   * Execute the full modular AI pipeline sequentially
   */
  async process(input: AIPipelineInput, apiKey: string | undefined): Promise<AIPipelineOutput> {
    const totalStart = Date.now();
    const stagesLog: PipelineStageLog[] = [];

    // Safe lazy initialization of GoogleGenAI Client
    let aiClient: GoogleGenAI | null = null;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
      } catch (err) {
        console.error("Failed to construct GoogleGenAI client inside Pipeline:", err);
      }
    }

    const fullText = `${input.title} ${input.description}`;

    // 1. Language Detection
    const lStart = Date.now();
    const lRes = await this.stages.language.run(fullText, aiClient);
    stagesLog.push({
      stageName: this.stages.language.name,
      status: lRes.status,
      durationMs: Date.now() - lStart,
      output: lRes.output,
    });

    const originalLanguage = lRes.output.language;
    const languageConfidence = lRes.output.confidence;

    // 2. Translation to English
    const tStart = Date.now();
    const tRes = await this.stages.translation.run(
      { text: input.description, sourceLanguage: originalLanguage },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.translation.name,
      status: tRes.status,
      durationMs: Date.now() - tStart,
      output: tRes.output,
    });

    const translatedText = tRes.output;

    // 3. Complaint Classification
    const cStart = Date.now();
    const cRes = await this.stages.classification.run(
      { title: input.title, description: translatedText },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.classification.name,
      status: cRes.status,
      durationMs: Date.now() - cStart,
      output: cRes.output,
    });

    const detectedCategory = (cRes.output.category as any) || "General";

    // 4. Entity Extraction
    const eStart = Date.now();
    const eRes = await this.stages.entities.run(translatedText, aiClient);
    stagesLog.push({
      stageName: this.stages.entities.name,
      status: eRes.status,
      durationMs: Date.now() - eStart,
      output: eRes.output,
    });

    const extractedEntities = eRes.output;

    // 5. Duplicate Detection Preparation
    const dStart = Date.now();
    const dRes = await this.stages.duplicatePrep.run(
      {
        title: input.title,
        description: translatedText,
        category: detectedCategory,
        location: input.location,
      },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.duplicatePrep.name,
      status: dRes.status,
      durationMs: Date.now() - dStart,
      output: dRes.output,
    });

    const duplicatePrep = dRes.output;

    // 6. Severity Analysis
    const sStart = Date.now();
    const sRes = await this.stages.severity.run(
      { title: input.title, description: translatedText, category: detectedCategory },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.severity.name,
      status: sRes.status,
      durationMs: Date.now() - sStart,
      output: sRes.output,
    });

    const severity = sRes.output.severity;
    const severityFactors = sRes.output.factors;

    // 7. Priority Score
    const pStart = Date.now();
    const pRes = await this.stages.priority.run(
      { title: input.title, description: translatedText, category: detectedCategory, severity },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.priority.name,
      status: pRes.status,
      durationMs: Date.now() - pStart,
      output: pRes.output,
    });

    const priorityScore = pRes.output.score;
    const priorityJustification = pRes.output.justification;

    // 8. Department Recommendation
    const rStart = Date.now();
    const rRes = await this.stages.department.run(
      { title: input.title, description: translatedText, category: detectedCategory },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.department.name,
      status: rRes.status,
      durationMs: Date.now() - rStart,
      output: rRes.output,
    });

    const recommendedDepartment = rRes.output.department;
    const departmentRoutingRules = rRes.output.routingRulesMatched;

    // 9. Executive Summary
    const xStart = Date.now();
    const xRes = await this.stages.summary.run(
      {
        title: input.title,
        description: translatedText,
        category: detectedCategory,
        location: input.location,
      },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.summary.name,
      status: xRes.status,
      durationMs: Date.now() - xStart,
      output: xRes.output,
    });

    const executiveSummary = xRes.output.summary;
    const executiveActionItems = xRes.output.actionItems;

    // 10. AI Confidence Score
    const qStart = Date.now();
    const qRes = await this.stages.confidence.run(
      {
        input,
        outputs: {
          detectedCategory,
          severity,
          priorityScore,
          recommendedDepartment,
        },
      },
      aiClient
    );
    stagesLog.push({
      stageName: this.stages.confidence.name,
      status: qRes.status,
      durationMs: Date.now() - qStart,
      output: qRes.output,
    });

    const confidenceScore = qRes.output.confidenceScore;
    const confidenceFactors = qRes.output.confidenceFactors;

    const processingTimeMs = Date.now() - totalStart;

    return {
      id: `AI-LOG-${Math.floor(100000 + Math.random() * 900000)}`,
      originalLanguage,
      translatedText,
      detectedCategory,
      extractedEntities,
      severity,
      priorityScore,
      recommendedDepartment,
      executiveSummary,
      confidenceScore,
      processingTimeMs,
      
      // Additional Inspector diagnostic metadata
      languageConfidence,
      detectedLanguage: originalLanguage,
      duplicatePrep,
      severityFactors,
      priorityJustification,
      departmentRoutingRules,
      executiveActionItems,
      confidenceFactors,
      stagesLog,
    };
  }
}
