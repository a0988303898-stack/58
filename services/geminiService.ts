import { GoogleGenAI } from "@google/genai";
import { GeoLocation, GeminiResult } from "../types";

export const fetchDinnerRecommendations = async (
  location: GeoLocation,
  moodPrompt: string
): Promise<GeminiResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct a natural language prompt based on location and mood
  const prompt = `
    I am currently located at latitude ${location.latitude}, longitude ${location.longitude}.
    It is dinner time. I am in the mood for "${moodPrompt}".
    
    Please recommend 4-5 specific restaurants nearby that fit this vibe.
    For each restaurant, briefly explain why it fits my mood.
    
    IMPORTANT:
    - Use the Google Maps tool to find real places.
    - Provide a friendly, appetizing description.
    - Format the output clearly.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Google Maps Grounding configuration
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        },
        // Note: responseMimeType and responseSchema are NOT allowed with googleMaps
        systemInstruction: "You are a helpful local food guide. You speak Traditional Chinese (Taiwan style). Be concise, fun, and helpful.",
        temperature: 0.7,
      },
    });

    const text = response.text || "抱歉，我無法取得文字回應。";
    
    // Extract grounding chunks (the actual map data)
    // We need to handle the potential structure of candidates safely
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text: text,
      places: chunks
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};