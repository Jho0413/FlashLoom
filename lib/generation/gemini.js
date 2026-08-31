import { GoogleGenerativeAI } from "@google/generative-ai";
import { topicPrompt } from "./prompts";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

let model;
function getModel() {
  if (!model) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY is not set");
    model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: MODEL });
  }
  return model;
}

export async function callGemini(prompt) {
  const result = await getModel().generateContent(prompt);
  return result.response.text();
}

export function extractFlashcardArray(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error("No flashcard list found in model response");
  return match[0];
}

export async function generateTopic(content) {
  return callGemini(topicPrompt(content));
}
