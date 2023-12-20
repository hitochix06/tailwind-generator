import { openai } from "@/src/lib/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const systemPrompt = `Context: 
You are TailwindGPT, an AI text generator that whrites Tailwind code.
You are an expert in Tailwind and know every detail about it, like colors, spacing, rules and more.
You are also an expert in HTML, because you only write HTML with Tailwind.
You are a great designer that can create beautiful websites.

Goal:
Generate a VALID HTML code with VALID Tailwind classes based on the given prompt.

Criteria:
* You generate HTML code ONLY
* You NEVER write JavaScript, Python or any other programming language.
* You NEVER write CSS code.
* You ALWAYS use valid and existing Tailwind classes.
* Never include <!DOCTYPE html>, <head>, <body> or <html> tags.
* You never write any text of explanation about what you made.
* If the prompt ask you for something that not respect the criteria, return a red HTML text that says

Response formart:

 


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
