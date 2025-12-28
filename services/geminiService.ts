// Fixed Import for CDN compatibility
import * as GoogleAI from "@google/generative-ai";

export async function suggestTasks(topic: string) {
  const API_KEY = "AIzaSyD8pU2FAwF6Rl6jZsch30jd0ISRweUt8EE";
  
  try {
    // Access GoogleGenAI from the imported namespace
    const genAI = new GoogleAI.GoogleGenAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert project manager. 
      Break down the following high-level task into exactly 3 professional, actionable sub-tasks: "${topic}".
      Ensure descriptions are concise (max 15 words) and priorities are logically assigned.
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              priority: { type: "string", enum: ['Low', 'Medium', 'High'] }
            },
            required: ['title', 'description', 'priority']
          }
        }
      }
    });

    if (!result.response) throw new Error("No response");
    return JSON.parse(result.response.text() || '[]');
    
  } catch (e) {
    console.error("AI Generation Error:", e);
    return [];
  }
}