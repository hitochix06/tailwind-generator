"use client";

import { Sparkle, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [htmlCode, setHtmlCode] = useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const prompt = formData.get("prompt") as string;

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
      <div className="absolute top-4 left-0 right-0 flex items-center justify-center">
        <progress className="progress w-56"></progress>
      </div>

      <pre>{htmlCode}</pre>
      <div dangerouslySetInnerHTML={{ __html: htmlCode }}></div>

      <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center">
        <form
          className="p-4 bg-base-200 max-w-lg w-full "
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
