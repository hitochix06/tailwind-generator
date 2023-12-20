"use client";

import { Sparkles, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

const useTimedState = (state: unknown, delay: 2000) => {
  const [timedState, setTimedState] = useState(state);

  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    if (Date.now() - lastUpdateRef.current > delay) {
      setTimedState(state);
      lastUpdateRef.current = Date.now();
      return;
    }

    const timeout = setTimeout(() => {
      setTimedState(state);
      lastUpdateRef.current = Date.now();
    }, delay - (Date.now() - lastUpdateRef.current));
    return () => clearTimeout(timeout);
  }, [state, delay]);

  return timedState;
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [htmlCode, setHtmlCode] = useState("");
  const timedHtmlCode = useTimedState(htmlCode, 2000);
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const prompt = formData.get("prompt") as string;

    setLoading(true);
    setHtmlCode("");
    const newMessages: ChatCompletionMessageParam[] = [
      ...messages,
      {
        content: prompt,
        role: "user",
      },
    ];

    setMessages(newMessages);

    const result = await fetch("/api/tailwind", {
      method: "POST",
      body: JSON.stringify({ messages: newMessages }),
    });

    const body = result.body;
    if (!body) {
      alert("une erreur s'est produite");
      return;
    }

    const reader = body.getReader();

    let html = "";

    const readChunk = async () => {
      const { done, value } = await reader.read();
      if (done) {
        setLoading(false);
        setMessages((current) => {
          const newCurrent = current.filter((c) => c.role !== "assistant");
          return [
            ...newCurrent,
            {
              content: html,
              role: "assistant",
            },
          ];
        });
        return;
      }
      const chunk = new TextDecoder().decode(value);
      html += chunk;
      setHtmlCode(html);
      await readChunk();
    };
    await readChunk();
  };

  return (
    <main className="h-full flex relative">
      {loading ? (
        <div className="absolute top-4 left-0 right-0 flex items-center justify-center">
          <progress className="progress w-56"></progress>
        </div>
      ) : null}

      {showCode ? <pre>{htmlCode}</pre> : null}

      {timedHtmlCode ? (
        <iframe
          className="w-full h-full"
          // add tailwind cdn <script src="https://cdn.tailwindcss.com"></script> and htmlcode
          srcDoc={`<!DOCTYPE html> 
          <html lang="fr">
          <head>
            <meta charset="UTF-8" />
            <title>Document</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body>
            ${timedHtmlCode}
          </body>
          <script src="https://cdn.tailwindcss.com"></script>
          </html>`}
        />
      ) : null}

      <div className="fixed bottom-4 left-0 right-0 flex  items-center justify-center">
        <div className="p-4 bg-base-200 max-w-lg w-full rounded-lg shadow-xl ">
          <div
            className="max-w-full overflow-auto flex flex-col gap-1"
            style={{ maxHeight: 150 }}
          >
            {messages
              .filter((m) => m.role === "user")
              .map((message, index) => (
                <div key={index}>You: {String(message.content)}</div>
              ))}
          </div>

          <form onSubmit={handleSubmit}>
            <fieldset className="flex gap-4 items-start">
              <textarea
                name="prompt"
                className=" w-full textarea textarea-primary"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <button className="btn btn-primary btn-sm " type="submit">
                  <Sparkles size={20} />
                </button>
                <button
                  className="btn btn-neutral btn-sm "
                  type="button"
                  onClick={() => {
                    setMessages([]);
                    setHtmlCode("");
                    setPrompt("");
                  }}
                >
                  <Trash2 size={20} />
                </button>
                <button
                  className="btn btn-neutral btn-sm "
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? 'Cacher le code' : 'Afficher le code'}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
}
