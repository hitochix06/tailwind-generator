import { openai } from "@/src/lib/openai";
import { NextResponse } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { Stream } from "stream";

export const POST = async (req: Request) => {
  const { prompt } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    stream: true,
    messages: [
      { role: "assistant", content: `Write only Tailwind code.` },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
};
