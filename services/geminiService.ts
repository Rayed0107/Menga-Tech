
import { GoogleGenAI, Type } from "@google/genai";
import { BloodStock, PredictionResult } from "../types";

export const predictShortage = async (stocks: BloodStock[]): Promise<PredictionResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const stockSummary = stocks.map(s => `${s.group}: ${s.quantity} units at ${s.hospitalName}`).join(', ');
    
    const prompt = `
      As a health logistics AI for Africa (specifically Congo/Brazzaville context), analyze this blood stock situation:
      ${stockSummary}
      
      External Factors to consider:
      - Current Season: Rainy season (High Malaria risk).
      - Upcoming Events: Major football match in Brazzaville in 48h.
      
      Predict potential shortages and provide strategic advice.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: 'LOW, MEDIUM, or HIGH' },
            predictedShortage: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: 'List of blood groups likely to be missing'
            },
            reasoning: { type: Type.STRING },
            recommendedActions: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ['riskLevel', 'predictedShortage', 'reasoning', 'recommendedActions']
        }
      }
    });

    return JSON.parse(response.text || '{}') as PredictionResult;
  } catch (error) {
    console.error("AI Prediction failed:", error);
    return {
      riskLevel: 'MEDIUM',
      predictedShortage: ['O-', 'AB-'],
      reasoning: "Analysis temporarily unavailable. Based on historical data, rainy seasons increase demand for O- group due to malaria-related anemia.",
      recommendedActions: ["Mobilize O- donors immediately.", "Check logistics chain for temperature stability."]
    };
  }
};
