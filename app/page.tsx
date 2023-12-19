import { Sparkle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="h-full flex relative">
      <div className="fixed bottom-4 left-0 right-0 flex items-center justify-center">
        <form className="p-4 bg-base-200 max-w-lg w-full">
          <fieldset className="flex gap-4 items-start">
            <textarea className="textarea textarea-primary" />
            <button className="btn btn-primary btn-sm">
              <Sparkles size={16} />
            </button>
          </fieldset>
        </form>
      </div>
    </main>
  );
}
