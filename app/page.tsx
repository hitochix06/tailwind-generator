"use client";

import { Sparkle, Sparkles } from "lucide-react";

export default function Home() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const prompt = formData.get("prompt") as string;

    const result = await fetch("/api/tailwind", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });

    const json = await result.json();

    console.log(json);
  };

  return (
    <main className="h-full flex relative">
      <div className="absolute top-4 left-0 right-0 flex items-center justify-center">
        <progress className="progress w-56"></progress>
      </div>
      <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center">
        <form className="p-4 bg-base-200 max-w-lg w-full">
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
