import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { UserProfile, WebHealthData, Mention } from "../types";

// Initialize Gemini Client with Environment Variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getFallbackData = (profile: UserProfile): WebHealthData => {
  return {
    score: 85,
    riskLevel: 'Low',
    summary: "Privacy Assessment: Unable to connect to the analysis engine. Based on the provided details, your digital footprint appears manageable, though we could not verify specific live data at this time.",
    mentions: [],
    risks: ["Professional data likely visible on career sites", "Public directories may list location info"],
    prominenceData: [
      { date: 'Month 1', mentions: 2 },
      { date: 'Month 2', mentions: 5 },
      { date: 'Month 3', mentions: 1 },
      { date: 'Month 4', mentions: 3 },
      { date: 'Month 5', mentions: 4 },
      { date: 'Month 6', mentions: 2 }
    ],
    platforms: {
      "LinkedIn": { score: 0, status: 'Not Found', summary: "Could not verify." },
      "Twitter": { score: 0, status: 'Not Found', summary: "Could not verify." },
      "Facebook": { score: 0, status: 'Not Found', summary: "Could not verify." }
    },
    lastScanned: new Date().toLocaleDateString()
  };
};

export const scanProfileOverview = async (profile: UserProfile): Promise<WebHealthData> => {
  const modelId = "gemini-2.5-flash"; 
  
  // Prompt for a general assessment based on the persona, without live search
  const prompt = `
    I am a personal reputation manager. 
    Create a "Digital Privacy Assessment" for a user with these details:
    Name: "${profile.name}"
    Location: "${profile.location}"
    Occupation: "${profile.occupation}"
    Keywords/Handles: "${profile.keywords || 'None provided'}"
    
    INSTRUCTIONS:
    1. Provide a PROFESSIONAL ASSESSMENT of what a person with this profile usually looks like online.
    2. Consider the provided Keywords/Handles. If they look like unique usernames, note the risk of "identity correlation" across platforms.
    3. Estimate a "Privacy Score" (0-100) based on how exposed this profession/location combo typically is. Higher score = Better Privacy.
    4. List "Potential Risks" relevant to their specific occupation and location.
    5. Do NOT hallucinate specific files or leaks.
    
    Generate a structured report in valid JSON format:
    {
      "score": number, 
      "riskLevel": "Low" | "Medium" | "High",
      "summary": "A 2-sentence assessment of the likely digital footprint and privacy posture for this persona.",
      "mentions": [], // Keep empty, we handle this separately
      "risks": ["Specific risk 1", "Specific risk 2"],
      "prominenceData": [
        { "date": "Month 1", "mentions": number }, 
        { "date": "Month 2", "mentions": number },
        { "date": "Month 3", "mentions": number },
        { "date": "Month 4", "mentions": number },
        { "date": "Month 5", "mentions": number },
        { "date": "Month 6", "mentions": number }
      ],
      "platforms": {
         "LinkedIn": { "score": number, "status": "Active"|"Unknown", "summary": "Assessment of likely visibility." },
         "Twitter": { "score": number, "status": "Active"|"Unknown", "summary": "Assessment of likely visibility." },
         "Facebook": { "score": number, "status": "Active"|"Unknown", "summary": "Assessment of likely visibility." }
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);
    
    if (!data.platforms) data.platforms = {};
    if (!data.mentions) data.mentions = [];
    
    return {
      ...data,
      lastScanned: new Date().toLocaleDateString(),
    };

  } catch (error) {
    console.error("Gemini Overview Error:", error);
    return getFallbackData(profile);
  }
};

export const scanDigitalFacets = async (profile: UserProfile): Promise<Mention[]> => {
    const modelId = "gemini-2.5-flash";

    const prompt = `
      Search the web for the following individual to find their "Digital Facets" (public mentions, profiles, articles):
      NAME: "${profile.name}"
      LOCATION: "${profile.location}"
      OCCUPATION: "${profile.occupation}"
      SPECIFIC KEYWORDS: "${profile.keywords || ''}"

      INSTRUCTIONS:
      1. You MUST use the googleSearch tool to find REAL results.
      2. Search specifically for "${profile.name}" AND "${profile.location}".
      3. IF "SPECIFIC KEYWORDS" are provided, you MUST include them in your search queries to find mentions linking the user to those terms (e.g. "${profile.name}" "${profile.keywords}").
      4. Return a JSON array of "mentions" based STRICTLY on the search results.
      5. DO NOT hallucinate. If you find no results, return an empty array.
      6. Extract the Source, Title, Snippet, Date, and URL from the search grounding.

      Output JSON format:
      [
        {
          "title": "Page Title",
          "snippet": "Relevant text snippet...",
          "source": "Source Name (e.g. LinkedIn, New York Times)",
          "date": "Date or 'Recent'",
          "url": "https://...",
          "sentiment": "Positive" | "Negative" | "Neutral"
        }
      ]
      
      Return ONLY the JSON array.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }], // Enable Live Search
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                ],
            }
        });

        let jsonText = response.text || "[]";
        
        // Clean up markdown if present (e.g. ```json ... ```)
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');

        // Attempt to find array in text if surrounding text exists
        const arrayMatch = jsonText.match(/\[.*\]/s);
        if (arrayMatch) {
            jsonText = arrayMatch[0];
        }

        try {
            const mentions = JSON.parse(jsonText);
            if (Array.isArray(mentions)) {
                return mentions;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse mentions JSON", e);
            return [];
        }

    } catch (error) {
        console.error("Gemini Facet Scan Error:", error);
        return []; 
    }
}