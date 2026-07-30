"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const startTestSession = async () => {
    setIsLoading(true);
    try {
      const result = await api.generateStory({
        title: "The Missing Piece",
        direction: "EN_DE",
        category: "novel",
        theme: "A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring. She has until sunrise to deliver the real package to the right hands — or people die.",
        cefr_level: "A2"
      });
      router.push(`/session/${result.story_id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start session. Is the backend running?");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-gutter">
      <div className="max-w-2xl text-center space-y-stack-sm animate-in fade-in zoom-in duration-700">
        <h1 className="text-headline-display tracking-widest uppercase">ACH-DOCH</h1>
        <p className="text-body-lg opacity-70">
          Master the nuance of German and English through narrative translation.
        </p>

        <div className="pt-8">
          <button
            onClick={startTestSession}
            disabled={isLoading}
            className="bg-primary-container text-on-primary text-label-bold uppercase px-12 py-5 hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? "Generating Your Story..." : "Start Test Session"}
          </button>
        </div>
      </div>
    </main>
  );
}
