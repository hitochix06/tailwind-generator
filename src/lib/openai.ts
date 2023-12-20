import OpenAI from "openai";

const openAiKey = process.env.OPENAI_API_KEY;

if (!openAiKey) {
  throw new Error("OPENAI_API_KEY n’est pas défini");
}

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
