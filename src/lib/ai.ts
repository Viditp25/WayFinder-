import { CareerRoadmap } from '@/types/roadmap';
import { GoogleGenAI } from '@google/genai';

const WAYFINDER_SYSTEM_PROMPT = `
You are the WayFinder AI, an expert career counselor specialized in the Indian education system. 
Your goal is to generate a dynamic, node-based career roadmap for a student from Class 6 to Professional level.

CRITICAL INSTRUCTIONS:
1. Provide the output STRICTLY as a JSON object adhering to this schema format exactly (excluding userId). Do NOT wrap it in Markdown formatting.
{
  "targetCareer": "...", 
  "targetState": "...",
  "startingClass": "...",
  "dayInTheLifeSnippet": "50 word snapshot of a typical professional day...",
  "estimatedEducationCost": 100000, 
  "estimatedFutureSalary": 500000,
  "estimatedFutureSalary": 500000,
  "globalResources": [
    { "title": "Top YouTube Channel", "url": "https://...", "type": "youtube" },
    { "title": "Official Authority Website", "url": "https://...", "type": "official_site" }
  ],
  "nodes": [
    {
      "id": "1",
      "title": "node title",
      "phase": "preparation",
      "examDate": "MM/YYYY",
      "actionItems": [
         { "id": "a1", "title": "...", "description": "...", "monthStart": "Jan 2026", "isCompleted": false }
      ],
      "resources": [
         { "title": "...", "url": "https://...", "type": "youtube" },
         { "title": "...", "url": "https://...", "type": "book" },
         { "title": "...", "url": "https://...", "type": "official_site" }
      ]
    }
  ]
}
2. **TIMELINE MAP**: Construct the nodes chronologically as milestones: Class 6/8 Foundation -> Class 10 Boards -> Class 12 Boards & Entrance -> UG -> PG (if applicable) -> Job.
3. **REAL-TIME DATA**: When discussing Exams (National/State/Private) and Financials (Tuition Fees Govt vs Private/Salaries), you must utilize your search capabilities to provide accurate 2026/27 dates and figures in INR (Integer only).
4. **CREATIVE PATHS**: If the chosen career is in the Creative Arts (Singer, Dancer, Actor, etc.), replace traditional exam milestones with 'Portfolio Building', 'Platform Growth', and 'Auditions/Workshops'.
5. EVERY single node MUST have EXACTLY 3 'resources' provided. Whenever possible, link to free resources like YouTube, NPTEL, or official document sites.
6. Provide exactly 5 highly rated 'globalResources' at the root level representing the best YouTube Channels, general websites, or document hubs for this career overall.
`;

export async function generateRoadmap(
    career: string,
    state: string,
    currentClass: string
): Promise<CareerRoadmap | null> {
    try {
        console.log("Checking GEMINI_API_KEY in production. Exists:", !!process.env.GEMINI_API_KEY, "Length:", process.env.GEMINI_API_KEY?.length);
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY. Cannot generate dynamic roadmap.");
            throw new Error("Missing GEMINI API KEY");
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `Generate a career roadmap for a student currently in ${currentClass} standard in ${state} aspiring to become a ${career}.

STRICT TEMPORAL RULES:
- Since the student is currently in ${currentClass}, the VERY FIRST node in your roadmap MUST start from ${currentClass}.
- Do NOT generate past/historical nodes (e.g., if they are in Class 12, do not include Class 10 Board prep).
- The roadmap MUST culminate in them becoming a professional ${career}.

STRICT GEOGRAPHIC RULES:
- If State is not 'All India', you MUST prioritize state-level entrance exams, quotas, and universities specific to ${state}.
- If State is 'All India', provide a comprehensive pan-India overview of the top options.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: WAYFINDER_SYSTEM_PROMPT,
                tools: [{ googleSearch: {} }]
            }
        });

        let jsonString = response.text;
        if (!jsonString) throw new Error("No response from Gemini");

        // Extract the JSON object using regex to ignore any surrounding conversational text
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonString = jsonMatch[0];
        } else {
            // Fallback: Clean out possible markdown code blocks if regex fails
            jsonString = jsonString.replace(/```json/gi, '').replace(/```/g, '').trim();
        }

        const parsed = JSON.parse(jsonString);
        parsed.userId = "anon"; // Fallback userId
        return parsed as CareerRoadmap;

    } catch (error: any) {
        console.error("Error generating roadmap:", error);
        if (error?.message?.includes('429') || error?.message?.includes('EXHAUSTED')) {
            console.log("Using Mock Fallback due to rate limit.");
            return getFallbackRoadmap(career, state, currentClass);
        }
        throw error;
    }
}

function getFallbackRoadmap(career: string, state: string, currentClass: string): CareerRoadmap {
    return {
        userId: "anon",
        targetCareer: career,
        targetState: state,
        startingClass: currentClass,
        dayInTheLifeSnippet: `As a ${career}, you'll start your day reviewing industry trends, collaborating with peers, and solving high-impact problems. (Note: This is a fallback roadmap generated because the AI API quota was exceeded).`,
        estimatedEducationCost: 150000,
        estimatedFutureSalary: 600000,
        globalResources: [
            { title: "Generic Career Advice", url: "https://youtube.com", type: "youtube" },
            { title: "National Education Portal", url: "https://education.gov.in", type: "official_site" },
            { title: "Student Communities", url: "https://reddit.com/r/IndianAcademia", type: "official_site" }
        ],
        nodes: [
            {
                id: "1",
                title: `${currentClass} Foundations`,
                phase: "preparation",
                examDate: "Mar 2026",
                actionItems: [
                    { id: "a1", title: "Core Skills", description: `Master the fundamental subjects required for ${career}.`, monthStart: "Present", isCompleted: false },
                    { id: "a2", title: "Research", description: `Research top colleges for this path in ${state}.`, monthStart: "Next Month", isCompleted: false }
                ],
                resources: [
                    { title: "NPTEL Basics", url: "https://nptel.ac.in", type: "official_site" },
                    { title: "Subject Overview", url: "https://youtube.com", type: "youtube" },
                    { title: "NCERT Books", url: "https://ncert.nic.in", type: "book" }
                ]
            },
            {
                id: "2",
                title: "Undergraduation",
                phase: "examination",
                examDate: "Jul 2028",
                actionItems: [
                    { id: "b1", title: "Enroll", description: "Get admitted into a relevant Bachelor's program.", monthStart: "Aug 2028", isCompleted: false },
                    { id: "b2", title: "Internships", description: "Complete two summer internships.", monthStart: "Jun 2030", isCompleted: false }
                ],
                resources: [
                    { title: "Internshala", url: "https://internshala.com", type: "official_site" },
                    { title: "Career Guidance", url: "https://youtube.com", type: "youtube" },
                    { title: "Industry Reports", url: "https://google.com", type: "book" }
                ]
            },
            {
                id: "3",
                title: "Professional Entry",
                phase: "counseling",
                examDate: "",
                actionItems: [
                    { id: "c1", title: "First Job", description: `Secure an entry-level position as a ${career}.`, monthStart: "Post-Graduation", isCompleted: false }
                ],
                resources: [
                    { title: "LinkedIn Jobs", url: "https://linkedin.com", type: "official_site" },
                    { title: "Resume Tips", url: "https://youtube.com", type: "youtube" },
                    { title: "Interview Prep", url: "https://youtube.com", type: "youtube" }
                ]
            }
        ]
    };
}
