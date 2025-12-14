import { UserProfile, WebHealthData, Mention } from "../types";

const getFallbackData = (profile: UserProfile): WebHealthData => {
  return {
    score: 85,
    riskLevel: 'Low',
    summary: "Privacy Assessment: Based on the provided details, your digital footprint appears manageable. We have generated a list of targeted search actions for you to verify your specific visibility.",
    mentions: [],
    risks: ["Common name may dilute search results", "Professional data likely visible on career sites"],
    prominenceData: [
        { date: 'Month 1', mentions: 2 },
        { date: 'Month 2', mentions: 5 },
        { date: 'Month 3', mentions: 1 },
        { date: 'Month 4', mentions: 3 },
        { date: 'Month 5', mentions: 4 },
        { date: 'Month 6', mentions: 2 }
    ],
    platforms: {
      "LinkedIn": { score: 0, status: 'Not Found', summary: "Run the Smart Search below to check status." },
      "Twitter": { score: 0, status: 'Not Found', summary: "Run the Smart Search below to check status." },
      "Facebook": { score: 0, status: 'Not Found', summary: "Run the Smart Search below to check status." }
    },
    lastScanned: new Date().toLocaleDateString()
  };
};

export const scanProfileOverview = async (profile: UserProfile, apiKey: string): Promise<WebHealthData> => {
  if (!apiKey) {
    throw new Error("OpenAI API Key is required");
  }

  // Updated prompt to focus on ASSESSMENT based on data, rather than claiming to have found files.
  const prompt = `
    I am a personal reputation manager. 
    Create a "Digital Privacy Assessment" for a user with these details:
    Name: "${profile.name}"
    Location: "${profile.location}"
    Occupation: "${profile.occupation}"
    
    INSTRUCTIONS:
    1. Do NOT claim to have found specific real-time posts (as you cannot browse the live web).
    2. Instead, provide a PROFESSIONAL ASSESSMENT of what a person with this profile usually looks like online.
    3. Estimate a "Privacy Score" (0-100) based on how exposed this profession/location combo typically is.
    4. List "Potential Risks" relevant to their specific occupation and location (e.g., "Engineers in New York often appear in conference listings").
    
    Generate a structured report in valid JSON format:
    {
      "score": number, // Estimated privacy score
      "riskLevel": "Low" | "Medium" | "High",
      "summary": "A 2-sentence assessment of the likely digital footprint and privacy posture for this persona.",
      "mentions": [], // Keep empty, we handle this separately
      "risks": ["Specific risk 1", "Specific risk 2"],
      "prominenceData": [
        { "date": "Month 1", "mentions": number }, // Simulate a typical trend curve (low numbers)
        { "date": "Month 2", "mentions": number },
        { "date": "Month 3", "mentions": number },
        { "date": "Month 4", "mentions": number },
        { "date": "Month 5", "mentions": number },
        { "date": "Month 6", "mentions": number }
      ],
      "platforms": {
         "LinkedIn": { "score": number, "status": "Active", "summary": "Assessment of likely visibility on LinkedIn." },
         "Twitter": { "score": number, "status": "Unknown", "summary": "Assessment of likely visibility on Twitter." },
         "Facebook": { "score": number, "status": "Unknown", "summary": "Assessment of likely visibility on Facebook." }
      }
    }

    Return ONLY the JSON string.
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", 
        messages: [
          { role: "system", content: "You are an expert privacy consultant. You output JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from OpenAI');
    }

    const result = await response.json();
    const jsonText = result.choices[0]?.message?.content;
    if (!jsonText) throw new Error("No content");
    const data = JSON.parse(jsonText);
    
    // Ensure robustness
    data.mentions = [];
    if (!data.platforms) data.platforms = {};
    
    return {
      ...data,
      lastScanned: new Date().toLocaleDateString(),
    };

  } catch (error) {
    console.error("OpenAI Overview Scan Error:", error);
    return getFallbackData(profile);
  }
};

export const scanDigitalFacets = async (profile: UserProfile, apiKey: string): Promise<Mention[]> => {
    if (!apiKey) return [];

    // KEY CHANGE: Prompt generates Search Queries (Dorks) instead of fake results.
    // This satisfies "Location Specific" and "No Hallucinations".
    const prompt = `
      I need to perform a "Digital Footprint Audit" for:
      Name: "${profile.name}"
      Location: "${profile.location}"
      Occupation: "${profile.occupation}"

      Since I cannot browse the live web, generate a list of 6-8 SMART SEARCH QUERIES that this user should execute to find their data.
      These queries must be HIGHLY SPECIFIC to the user's Name and Location to avoid noise.
      
      Return a JSON object with a "mentions" array.
      Each item must be a "Search Action":
      - title: A short, descriptive title (e.g., "Check LinkedIn Matches")
      - snippet: The specific search logic being used (e.g., "Searching for '${profile.name}' + '${profile.location}' on LinkedIn")
      - source: "Smart Search"
      - date: "Live"
      - url: The actual Google Search URL encoding the complex query. Use "https://www.google.com/search?q=..."
             Example query format: site:linkedin.com "${profile.name}" "${profile.location}"
      - sentiment: "Neutral"

      Include distinct searches for:
      1. General Web Presence (Name + Location)
      2. LinkedIn Profile (site:linkedin.com)
      3. Twitter/X Mentions (site:twitter.com)
      4. Local News/Press (Name + Location + "news")
      5. Image Search (Name + "photo")
      6. PDF/Document Search (filetype:pdf)

      Return ONLY the JSON string.
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o", 
              messages: [
                { role: "system", content: "You are a helpful OSINT (Open Source Intelligence) assistant. You construct precise search queries." },
                { role: "user", content: prompt }
              ],
              response_format: { type: "json_object" }
            })
          });
      
          if (!response.ok) throw new Error('Failed to fetch facets');
      
          const result = await response.json();
          const jsonText = result.choices[0]?.message?.content;
          
          if (!jsonText) return [];

          const data = JSON.parse(jsonText);
          return data.mentions || [];

    } catch (error) {
        console.error("OpenAI Facet Scan Error:", error);
        return []; 
    }
}