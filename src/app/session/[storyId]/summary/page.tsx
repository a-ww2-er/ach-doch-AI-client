"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface SummaryData {
  story: { title: string };
  feedbacks: Record<string, { score: number; critiques: { category: string }[] }>;
}

export default function SessionSummaryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const [summary] = useState<SummaryData | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.sessionStorage.getItem(`ach-doch-summary-${storyId}`);
    return saved ? JSON.parse(saved) as SummaryData : null;
  });

  if (!summary) {
    return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 text-center"><p className="text-label-bold uppercase mb-4">Summary unavailable</p><p className="text-body-md opacity-70 mb-6">Complete a session first to see its results.</p><Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Start a session</Link></main>;
  }

  const feedback = Object.values(summary.feedbacks);
  const average = Math.round(feedback.reduce((total, item) => total + item.score, 0) / feedback.length);
  const categories = feedback.flatMap((item) => item.critiques.map((critique) => critique.category));
  const recurring = [...new Set(categories)].sort((a, b) => categories.filter((category) => category === b).length - categories.filter((category) => category === a).length).slice(0, 3);

  return <main className="flex-grow pt-40 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto w-full">
    <div className="border-b border-primary-container pb-6 mb-12"><span className="text-label-bold uppercase text-on-surface-variant">Session complete</span><h1 className="text-headline-lg mt-3">{summary.story.title}</h1></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      <div className="bg-primary-container text-on-primary p-7"><span className="text-label-bold uppercase opacity-70">Overall score</span><p className="text-headline-lg mt-4">{average}<span className="text-2xl">/100</span></p></div>
      <div className="bg-surface-container-low border border-outline-variant p-7"><span className="text-label-bold uppercase text-on-surface-variant">Sentences reviewed</span><p className="text-headline-lg mt-4">{feedback.length}</p></div>
      <div className="bg-surface-container-low border border-outline-variant p-7"><span className="text-label-bold uppercase text-on-surface-variant">Corrections found</span><p className="text-headline-lg mt-4">{categories.length}</p></div>
    </div>
    <section className="max-w-2xl"><h2 className="text-headline-md mb-5">Focus next</h2>{recurring.length ? <ul className="space-y-3">{recurring.map((category) => <li key={category} className="border-l-4 border-secondary-container bg-surface-container-low px-5 py-4 text-body-md">{category}</li>)}</ul> : <p className="text-body-lg opacity-70">No recurring error patterns this time. Keep going.</p>}</section>
    <div className="mt-12 flex flex-wrap gap-6"><Link href={`/session/${storyId}`} className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Review session</Link><Link href="/" className="text-label-bold uppercase border-b-2 border-primary-container py-4">Start another</Link></div>
  </main>;
}
