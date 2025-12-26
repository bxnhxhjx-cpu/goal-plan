import { GoogleGenAI, Type } from "@google/genai";
import { Goal, TimeSession, AIAdvice } from "../types.ts";

const SYSTEM_INSTRUCTION = `
You are GoldenHour, a world-class productivity coach and time strategist. 
Your goal is to help the user align their daily time expenditure with their long-term "Gold" goals.
Analyze their data rigorously. Be concise, motivating, and brutally honest if they are wasting time.
Focus on "Deep Work" and long-term compounding effort.
`;

export const getSmartAdvice = async (
  goals: Goal[],
  recentSessions: TimeSession[]
): Promise<AIAdvice> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare context
    const context = {
      goals: goals.map(g => ({
        title: g.title,
        target: g.targetHours,
        progress: g.accumulatedHours,
        percentComplete: ((g.accumulatedHours / g.targetHours) * 100).toFixed(1) + '%'
      })),
      recentActivity: recentSessions.slice(0, 20).map(s => ({
        goalId: s.goalId,
        durationMinutes: (s.durationSeconds / 60).toFixed(0),
        date: s.startTime
      }))
    };

    const prompt = `
      Here is my current time investment portfolio (Goals) and my recent trading activity (Sessions).
      Analyze my performance. Am I investing enough in my high-value long-term goals?
      
      Data: ${JSON.stringify(context)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 2-sentence summary of my current momentum." },
            efficiencyScore: { type: Type.NUMBER, description: "A score from 0-100 based on focus and consistency." },
            actionableTips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "3 specific, short tips to improve immediately."
            },
            neglectedGoals: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Names of goals that are falling behind."
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAdvice;
    }
    
    throw new Error("No response from AI");

  } catch (error) {
    console.error("AI Coach Error:", error);
    return {
      summary: "I'm having trouble connecting to your strategy channels right now. Keep tracking your time!",
      efficiencyScore: 0,
      actionableTips: ["Ensure your internet connection is active", "Continue tracking your deep work sessions"],
      neglectedGoals: []
    };
  }
};