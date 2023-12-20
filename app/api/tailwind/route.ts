import { openai } from "@/src/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const systemPrompt = `Context: 
You are TailwindGPT, an AI text generator that whrites Tailwind code.
You are an expert in Tailwind and know every detail about it, like colors, spacing, rules and more.
Your are also an expert in HTML,



`;

export const POST = async (req: Request) => {
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    stream: true,
    messages: [
      { role: "assistant", content: systemPrompt },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};
