"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("The Missing Piece");
  const [direction, setDirection] = useState("EN_DE");
  const [category, setCategory] = useState("novel");
  const [cefrLevel, setCefrLevel] = useState("A2");
  const [theme, setTheme] = useState("A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring.");

  const startTestSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.generateStory({
        title,
        direction,
        category,
        theme,
        cefr_level: cefrLevel,
      });
      router.push(`/session/${result.story_id}`);
    } catch (err) {
      console.error(err);
      setError("We could not start a session. Check that the server is available and try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-gutter">
      <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12"><h1 className="text-headline-display tracking-widest uppercase">ACH-DOCH</h1><p className="text-body-lg opacity-70 mt-4">Master the nuance of German and English through narrative translation.</p></div>
        <form onSubmit={startTestSession} className="bg-surface border border-primary-container p-6 md:p-10 text-left">
          <div className="border-b border-outline-variant pb-5 mb-8"><span className="text-label-bold uppercase text-on-surface-variant">Build your session</span><h2 className="text-headline-md mt-2">Choose a story to translate.</h2></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label htmlFor="title" className="text-label-bold uppercase block mb-2">Story title</label><input id="title" required value={title} onChange={(event) => setTitle(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /></div>
            <div><label htmlFor="direction" className="text-label-bold uppercase block mb-2">Translation direction</label><select id="direction" value={direction} onChange={(event) => setDirection(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="EN_DE">English to German</option><option value="DE_EN">German to English</option></select></div>
            <div><label htmlFor="level" className="text-label-bold uppercase block mb-2">Level</label><select id="level" value={cefrLevel} onChange={(event) => setCefrLevel(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="A2">A2 / Elementary</option><option value="B1">B1 / Intermediate</option><option value="B2">B2 / Upper intermediate</option><option value="C1">C1 / Advanced</option></select></div>
            <div><label htmlFor="category" className="text-label-bold uppercase block mb-2">Story style</label><select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="novel">Novel</option><option value="modern_genz">Modern / Gen Z</option></select></div>
            <div className="md:col-span-2"><label htmlFor="theme" className="text-label-bold uppercase block mb-2">Premise or theme</label><textarea id="theme" required rows={3} value={theme} onChange={(event) => setTheme(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none resize-none focus:border-primary-container" /></div>
          </div>
          {error && <p role="alert" className="mt-6 border border-error bg-error-container px-4 py-3 text-sm">{error}</p>}
          <div className="mt-8 flex justify-end"><button type="submit" disabled={isLoading} className="bg-primary-container text-on-primary text-label-bold uppercase px-10 py-5 hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50">{isLoading ? "Generating Your Story..." : "Start Translation"}</button></div>
        </form>
      </div>
    </main>
  );
}
