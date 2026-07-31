"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { storyPresets, StoryPreset } from "@/lib/storyPresets";

export default function StartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("The Missing Piece");
  const [direction, setDirection] = useState("EN_DE");
  const [category, setCategory] = useState("novel");
  const [cefrLevel, setCefrLevel] = useState("A2");
  const [theme, setTheme] = useState("A bike courier in Berlin accidentally picks up the wrong package and becomes the target of a smuggling ring.");

  const startStory = async (story: StoryPreset) => {
    setIsLoading(true);
    setActivePreset(story.title);
    setError(null);
    try {
      const result = await api.generateStory(story);
      router.push(`/session/${result.story_id}`);
    } catch (err) {
      console.error(err);
      setError("We could not start that story. Check that the server is available and try again.");
      setIsLoading(false);
      setActivePreset(null);
    }
  };

  const startCustomStory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await startStory({ title, direction, category, theme, cefr_level: cefrLevel, label: "Custom story", image: "" });
  };

  return <main className="flex-grow bg-[#f5f2ec] pt-32 pb-24 px-6 md:px-12"><div className="max-w-[1280px] mx-auto"><div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-primary-container pb-6 mb-12"><div><span className="text-label-bold uppercase text-on-surface-variant">The translation lab</span><h1 className="text-headline-lg mt-3">Choose your first chapter.</h1></div><p className="max-w-sm text-sm opacity-65">Enter as a guest or log in to keep every correction, word, and breakthrough.</p></div><section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">{storyPresets.map((preset) => <button key={preset.title} type="button" disabled={isLoading} onClick={() => startStory(preset)} className="group relative min-h-80 overflow-hidden border border-primary-container text-left disabled:opacity-60" style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.86) 100%), url(${preset.image})`, backgroundPosition: "center", backgroundSize: "cover" }}><span className="absolute inset-0 bg-secondary-container/0 transition-colors group-hover:bg-secondary-container/20" /><span className="absolute bottom-0 left-0 right-0 p-6 text-white"><span className="text-label-bold uppercase opacity-75">{preset.label} / {preset.cefr_level}</span><strong className="block font-epilogue text-2xl mt-2">{preset.title}</strong><span className="mt-4 inline-flex items-center gap-2 text-label-bold uppercase">{activePreset === preset.title ? "Generating..." : "Begin chapter"}<span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_forward</span></span></span></button>)}</section>{error && <p role="alert" className="mb-8 border border-error bg-error-container px-4 py-3 text-sm">{error}</p>}<form onSubmit={startCustomStory} className="bg-surface border border-primary-container p-6 md:p-10 text-left max-w-4xl"><div className="border-b border-outline-variant pb-5 mb-8"><span className="text-label-bold uppercase text-on-surface-variant">Or make it yours</span><h2 className="text-headline-md mt-2">Build a custom story.</h2></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="md:col-span-2"><label htmlFor="title" className="text-label-bold uppercase block mb-2">Story title</label><input id="title" required value={title} onChange={(event) => setTitle(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /></div><div><label htmlFor="direction" className="text-label-bold uppercase block mb-2">Translation direction</label><select id="direction" value={direction} onChange={(event) => setDirection(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="EN_DE">English to German</option><option value="DE_EN">German to English</option></select></div><div><label htmlFor="level" className="text-label-bold uppercase block mb-2">Level</label><select id="level" value={cefrLevel} onChange={(event) => setCefrLevel(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="A2">A2 / Elementary</option><option value="B1">B1 / Intermediate</option><option value="B2">B2 / Upper intermediate</option><option value="C1">C1 / Advanced</option></select></div><div><label htmlFor="category" className="text-label-bold uppercase block mb-2">Story style</label><select id="category" value={category} onChange={(event) => setCategory(event.target.value)} className="w-full border-b border-outline bg-transparent py-3 outline-none"><option value="novel">Novel</option><option value="modern_genz">Modern / Gen Z</option></select></div><div className="md:col-span-2"><label htmlFor="theme" className="text-label-bold uppercase block mb-2">Premise or theme</label><textarea id="theme" required rows={3} value={theme} onChange={(event) => setTheme(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none resize-none focus:border-primary-container" /></div></div><div className="mt-8 flex justify-end"><button type="submit" disabled={isLoading} className="bg-primary-container text-on-primary text-label-bold uppercase px-10 py-5 hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50">{activePreset === "Custom story" ? "Generating..." : "Start custom story"}</button></div></form></div></main>;
}
