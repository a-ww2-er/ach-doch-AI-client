"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface StoryPreset {
  title: string;
  direction: string;
  category: string;
  theme: string;
  cefr_level: string;
  label: string;
  image: string;
}

const presets: StoryPreset[] = [
  { title: "The Missing Piece", label: "Berlin / thriller", direction: "EN_DE", category: "novel", cefr_level: "A2", theme: "A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring.", image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85" },
  { title: "Last Train Home", label: "Night / connection", direction: "DE_EN", category: "novel", cefr_level: "B1", theme: "Two strangers miss the last train out of Hamburg and discover they may be headed toward the same secret.", image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85" },
  { title: "Café at 7:15", label: "Everyday / dialogue", direction: "EN_DE", category: "modern_genz", cefr_level: "B1", theme: "A regular at a small café finds a handwritten message tucked beneath their usual cup.", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85" },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("The Missing Piece");
  const [direction, setDirection] = useState("EN_DE");
  const [category, setCategory] = useState("novel");
  const [cefrLevel, setCefrLevel] = useState("A2");
  const [theme, setTheme] = useState("A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring.");

  const startStory = async (story: StoryPreset) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.generateStory(story);
      router.push(`/session/${result.story_id}`);
    } catch (err) {
      console.error(err);
      setError("We could not start a session. Check that the server is available and try again.");
      setIsLoading(false);
    }
  };

  const startTestSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await startStory({ title, direction, category, theme, cefr_level: cefrLevel, label: "Custom story", image: "" });
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-gutter">
      <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-12"><h1 className="text-headline-display tracking-widest uppercase">ACH-DOCH</h1><p className="text-body-lg opacity-70 mt-4">Master the nuance of German and English through narrative translation.</p></div>
        <section className="mb-14" aria-labelledby="presets-heading">
          <div className="flex items-end justify-between border-b border-primary-container pb-4 mb-6"><div><span className="text-label-bold uppercase text-on-surface-variant">Start quickly</span><h2 id="presets-heading" className="text-headline-md mt-2">Pick a story.</h2></div><span className="text-label-bold uppercase opacity-50 hidden sm:block">One click to begin</span></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {presets.map((preset) => <button key={preset.title} type="button" disabled={isLoading} onClick={() => startStory(preset)} className="group relative min-h-72 overflow-hidden border border-primary-container text-left disabled:opacity-60" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05) 20%, rgba(0,0,0,0.82) 100%), url(${preset.image})`, backgroundPosition: "center", backgroundSize: "cover" }} aria-label={`Start ${preset.title}`}><span className="absolute inset-0 bg-secondary-container/0 transition-colors group-hover:bg-secondary-container/20" /><span className="absolute bottom-0 left-0 right-0 p-6 text-white"><span className="text-label-bold uppercase opacity-75">{preset.label} / {preset.cefr_level}</span><strong className="block font-epilogue text-2xl mt-2">{preset.title}</strong><span className="mt-4 inline-flex items-center gap-2 text-label-bold uppercase">{isLoading ? "Generating..." : "Start story"}<span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span></span></span></button>)}
          </div>
        </section>
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
