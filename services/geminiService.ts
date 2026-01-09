
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FoodItem, DietPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeFoodImage = async (base64Data: string, mimeType: string): Promise<FoodItem[]> => {
  const model = 'gemini-3-flash-preview';
  
  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `Analyze this food image with high precision. 
          1. Identify all food items, especially focusing on South Asian/Bengali dishes if present.
          2. Estimate portion sizes based on the plate or surrounding objects for scale.
          3. Calculate calories, protein, carbs, and fats by considering typical cooking methods (e.g., if it looks oily, account for higher fats).
          4. Return a list of items in English.
          Accuracy is critical for health tracking.` }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the food" },
            calories: { type: Type.NUMBER, description: "Total calories" },
            protein: { type: Type.NUMBER, description: "Protein in grams" },
            carbs: { type: Type.NUMBER, description: "Carbs in grams" },
            fats: { type: Type.NUMBER, description: "Fats in grams" },
            portion: { type: Type.STRING, description: "Estimated portion (e.g., 1 cup, 200g)" }
          },
          required: ["name", "calories", "protein", "carbs", "fats", "portion"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const model = 'gemini-3-flash-preview';
  const prompt = `
    Generate a highly accurate personalized weight loss diet plan for a ${profile.age} year old ${profile.gender}.
    Current Weight: ${profile.weight}kg, Height: ${profile.height}cm, Target Weight: ${profile.targetWeight}kg.
    Activity Level: ${profile.activityLevel}.
    Focus on healthy, culturally relevant (South Asian/Global) food options that are easily available.
    Provide the response in English.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dailyCalories: { type: Type.NUMBER },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                label: { type: Type.STRING },
                suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                approxCalories: { type: Type.NUMBER }
              },
              required: ["time", "label", "suggestions", "approxCalories"]
            }
          },
          advice: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["dailyCalories", "meals", "advice"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
