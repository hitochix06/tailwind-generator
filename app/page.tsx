"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const [htmlCode, setHtmlCode] = useState("");
  const timedHtmlCode = useTimedState(htmlCode, 2000);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const prompt = formData.get("prompt") as string;

    setLoading(true);
    setHtmlCode("");

    const result = await fetch("/api/tailwind", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const body = result.body;
    if (!body) {
      alert("une erreur s'est produite");
      return;
    }

    const reader = body.getReader();
    const readChunk = async () => {
      const { done, value } = await reader.read();
      if (done) {
        setLoading(false);
        //finish
        return;
      }
      const chunk = new TextDecoder().decode(value);
      setHtmlCode((prev) => prev + chunk);
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

      {/* <pre>{htmlCode}</pre> // for debug */}

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
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${timedHtmlCode}
          </body>
          </html>`}
        />
      ) : null}

      <div className="fixed bottom-4 left-0 right-0 flex  items-center justify-center">
        <form
          className="p-4 bg-base-200 max-w-lg w-full rounded-lg shadow-xl "
          onSubmit={handleSubmit}
        >
          <fieldset className="flex gap-4 items-start">
            <textarea
              name="prompt"
              className=" w-full textarea textarea-primary"
            />
            <button className="btn btn-primary btn-sm " type="submit">
              <Sparkles size={20} />
            </button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
