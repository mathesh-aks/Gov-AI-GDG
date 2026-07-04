/**
 * Centralized Prompt Templates for the GovAI Connect AI Pipeline (Milestone 4)
 * Prompts are designed for use with Gemini (e.g. models/gemini-3.5-flash) and expect JSON responses.
 */

export const PROMPT_LANGUAGE_DETECTION = `
You are an expert linguistics engine for the Indian Government.
Identify the primary language of the following text:
"{text}"

Return a JSON object matching this schema:
{
  "language": "Standard language name (e.g. English, Hindi, Tamil, Telugu, Malayalam, Marathi, Kannada, Bengali, etc.)",
  "confidence": "Number between 0.0 and 1.0"
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_TRANSLATION = `
You are an expert translator specializing in government and citizen correspondence.
Translate the following text into highly professional, grammatically correct English:
"{text}"

Return a JSON object matching this schema:
{
  "translatedText": "The fully translated text in English. If the original text is already in English, return it unchanged."
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_CLASSIFICATION = `
You are a senior public grievance triage specialist.
Classify the following citizen complaint based on its title and description:
Title: "{title}"
Description: "{description}"

The category MUST be exactly one of the following official categories:
- "Water Supply"
- "Roads & Transport"
- "Public Safety"
- "Sanitation"
- "Power & Electricity"
- "Healthcare"
- "Education"
- "General"

Return a JSON object matching this schema:
{
  "category": "One of the 8 categories above",
  "reasoning": "Brief technical justification for this classification under 50 words."
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_ENTITY_EXTRACTION = `
You are an AI Named Entity Recognition (NER) pipeline tuned for Indian municipal and rural administration.
Extract administrative and geographic entities from the following text:
"{text}"

Return a JSON object matching this schema:
{
  "roadNames": ["List of roads, streets, lanes, or highways found"],
  "villages": ["List of villages, colonies, sectors, areas, or wards found"],
  "governmentOffices": ["List of government buildings or administrative offices found"],
  "hospitals": ["List of primary health centers, hospitals, or clinics found"],
  "schools": ["List of schools, colleges, or educational centers found"],
  "departments": ["List of departments or ministries mentioned"],
  "landmarks": ["List of notable landmarks, ATMs, shops, temples, mosques, etc. found"]
}
If no entities are found for a category, return an empty array. Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_DUPLICATE_PREPARATION = `
You are a duplicate detection preparation engineer.
Analyze the following complaint details and generate embedding-ready search metadata tags to help find duplicates. Focus purely on technical/physical signatures of the issue, avoiding personal names or dates:
Title: "{title}"
Description: "{description}"
Category: "{category}"
Location: "{location}"

Return a JSON object matching this schema:
{
  "searchKeywords": ["4-6 highly relevant semantic keywords or search terms describing the exact physical concern (e.g. 'sewer overflow', 'street lights dark', 'pothole danger')"],
  "issueSignature": "A concise, standardized semantic signature of the problem (e.g. 'pipe_leak_water_shortage', 'transformer_failure_power_outage')"
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_SEVERITY_ANALYSIS = `
You are a disaster risk assessment and public safety officer.
Perform a severity analysis on this complaint:
Title: "{title}"
Description: "{description}"
Category: "{category}"

Evaluate safety hazards, public health risks, duration of disruption, and number of citizens impacted.
Return a JSON object matching this schema:
{
  "severity": "Must be exactly one of: 'Low', 'Medium', 'High', 'Critical'",
  "factors": [
    "List of 2-3 key contributing factors to this severity assessment (e.g. 'Presents active pedestrian and vehicle collision risks due to absolute darkness on main sector road', 'Impacts approximately 4,500 local households')"
  ]
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_PRIORITY_SCORE = `
You are an enterprise dispatch routing manager.
Calculate a Priority Score from 0 to 100 for this complaint:
Title: "{title}"
Description: "{description}"
Category: "{category}"
Severity: "{severity}"

Higher scores mean higher urgency and faster dispatch requirements. For instance:
- Urgent water supply outages, structural collapses, or severe healthcare hazards: 85-100
- Blocked minor roads, standard trash piles, or local light replacements: 50-84
- Routine administrative questions, minor cleaning, or low-priority items: 0-49

Return a JSON object matching this schema:
{
  "score": 75, // Must be an integer between 0 and 100
  "justification": "Clear, evidence-backed justification for this priority score in 1 sentence."
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_DEPARTMENT_RECOMMENDATION = `
You are an expert on Indian public administration and governance.
Recommend the optimal municipal or state department to resolve this complaint:
Category: "{category}"
Title: "{title}"
Description: "{description}"

Provide a realistic, professional department name (e.g. 'Department of Water Resources', 'Power & Electricity Board', 'Public Works Department (PWD)', 'Municipal Corporation Sanitation Division', 'Department of Health & Family Welfare', etc.).
Return a JSON object matching this schema:
{
  "department": "Name of the recommended department",
  "routingRulesMatched": [
    "List of 1-2 standard administrative routing rules matched (e.g. 'Water leak matching PWD / Water Board division rules', 'Solid waste collection routing to Municipal Sanitation')"
  ]
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_EXECUTIVE_SUMMARY = `
You are the Intelligent Chief of Staff for a Member of Parliament.
Generate a crisp, professional, and action-oriented executive summary of this complaint suitable for presentation directly to the MP:
Title: "{title}"
Description: "{description}"
Category: "{category}"
Location: "{location}"

The summary should frame the core issue, scale, and immediate needs under 120 words.
Return a JSON object matching this schema:
{
  "summary": "Professional executive-ready summary of the complaint.",
  "actionItems": [
    "List of 2-3 immediate recommended actions for the MP or office staff (e.g. 'Approve budget for temporary water tenders in Ward 15', 'Direct power board engineer to deploy field technician')"
  ]
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;

export const PROMPT_AI_CONFIDENCE_SCORE = `
You are an AI Quality Assurance auditor.
Evaluate the overall processing confidence of the pipeline for this complaint based on its processed output stages:
Payload: "{payload}"

Evaluate text clarity, coordinates precision, presence of attachments, and classification consistency.
Return a JSON object matching this schema:
{
  "confidenceScore": 0.95, // Must be a number between 0.00 and 1.00
  "confidenceFactors": [
    "List of 2-3 factors backing this confidence level (e.g. 'Precise GPS coordinate mapping with 12m accuracy', 'Clear physical description with corroborating voice recording')"
  ]
}
Do not include any explanation or markdown formatting. Output pure JSON.
`;
