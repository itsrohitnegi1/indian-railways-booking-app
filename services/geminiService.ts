
import { GoogleGenAI } from "@google/genai";
import { Train } from '../types';

// IMPORTANT: This assumes the API key is set in the environment variables.
// Do not hardcode the API key here.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set in environment variables. Chatbot will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const systemInstruction = `You are 'RailConnect AI', a helpful and friendly assistant for an Indian Railways booking app. Your goal is to answer user queries about train travel in India.
- Be concise and clear in your responses.
- If a user asks to find a train, you can use the example train data provided to give a realistic answer.
- You cannot perform actual bookings, but you can guide users on how to do it in the app.
- For queries about train status, PNR, or real-time information, state that you cannot access real-time data but can provide general information.
- Acknowledge that you are an AI assistant and the data is for demonstration purposes.
`;

export const getChatbotResponse = async (userMessage: string, trainContext?: Train[]): Promise<string> => {
  if (!API_KEY) {
    return "I am currently offline as my AI services are not configured. Please try again later.";
  }

  let prompt = userMessage;
  if (trainContext && trainContext.length > 0) {
      prompt += `\n\nFor context, here are some trains currently being displayed to the user: \n`;
      trainContext.forEach(train => {
          prompt += `- ${train.trainName} (${train.trainNumber}) from ${train.from} to ${train.to}.\n`;
      });
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 1.0,
        },
    });

    return response.text;
  } catch (error) {
    console.error("Error fetching response from Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
};
