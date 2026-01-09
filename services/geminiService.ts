
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FoodItem, DietPlan } from "../types";

// The API key is obtained exclusively from process.env.API_KEY
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFoodImage = async (base64Data: string, mimeType: string): Promise<FoodItem[]> => {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: "Analyze this food image. Return a JSON array of food items with name, calories, protein, carbs, fats, and portion. Focus on South Asian/Bengali food if detected." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fats: { type: Type.NUMBER },
              portion: { type: Type.STRING }
            },
            required: ["name", "calories", "protein", "carbs", "fats", "portion"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateDietPlan = async (profile: UserProfile): Promise<DietPlan> => {
  const ai = getAIClient();
  
  const prompt = `Generate a weight loss diet plan for a ${profile.age}y/o ${profile.gender}, weight: ${profile.weight}kg, target: ${profile.targetWeight}kg, activity: ${profile.activityLevel}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
  } catch (error) {
    console.error("Gemini Diet Plan Error:", error);
    throw error;
  }
};
