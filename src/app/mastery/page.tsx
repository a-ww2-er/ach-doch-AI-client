"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, api, ProgressOverview } from "@/lib/api";
import { clearAuthToken, useAuth } from "@/lib/auth";

export default function MasteryPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-32 text-center"><p className="text-label-bold uppercase mb-4">Your progress</p><h1 className="text-headline-md mb-5">Log in to see your mastery.</h1><Link href="/login" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Log in</Link></main>;
  return <AuthenticatedMastery />;
}

function AuthenticatedMastery() {
  const [progress, setProgress] = useState<ProgressOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    api.getProgressOverview().then((result) => { if (active) setProgress(result); }).catch((err) => { if (!active) return; if (err instanceof ApiError && err.status === 401) { clearAuthToken(); return; } setError(err instanceof Error ? err.message : "We could not load your mastery data"); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [retry]);

  if (loading) return <main className="flex-grow pt-40 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><div className="h-16 w-72 bg-surface-container-high animate-pulse" /><div className="h-64 bg-surface-container-high animate-pulse mt-10" /></main>;
  if (error) return <main className="flex-grow flex items-center justify-center px-6 pt-32"><div role="alert" className="border border-error bg-error-container p-6"><p className="text-body-md mb-5">{error}</p><button onClick={() => { setLoading(true); setRetry((value) => value + 1); }} className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-3">Try again</button></div></main>;
  const categories = progress?.error_categories || [];
  const maxCount = Math.max(...categories.map((item) => item.count), 1);
  return <main className="flex-grow pt-40 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><div className="border-b border-primary-container pb-6 mb-10"><span className="text-label-bold uppercase text-on-surface-variant">Your progress</span><h1 className="text-headline-lg mt-3">Mastery</h1><p className="text-body-lg opacity-70 mt-3">See where your translations are getting stronger and where to focus next.</p></div><section className="grid grid-cols-2 md:grid-cols-4 gap-5"><div className="bg-primary-container text-on-primary p-6"><span className="text-label-bold uppercase opacity-70">Average score</span><p className="text-headline-md mt-4">{progress?.average_score ? Math.round(progress.average_score) : "--"}<span className="text-sm opacity-60">{progress?.average_score ? "/100" : ""}</span></p></div><div className="bg-surface-container-low border border-outline-variant p-6"><span className="text-label-bold uppercase text-on-surface-variant">Completed</span><p className="text-headline-md mt-4">{progress?.completed_sessions || 0}</p></div><div className="bg-surface-container-low border border-outline-variant p-6"><span className="text-label-bold uppercase text-on-surface-variant">Attempts</span><p className="text-headline-md mt-4">{progress?.total_attempts || 0}</p></div><div className="bg-surface-container-low border border-outline-variant p-6"><span className="text-label-bold uppercase text-on-surface-variant">Error types</span><p className="text-headline-md mt-4">{categories.length}</p></div></section><section className="mt-14 max-w-3xl"><div className="border-b border-outline-variant pb-4 mb-6"><h2 className="text-headline-md">Focus areas</h2><p className="text-sm opacity-60 mt-2">Recurring categories from your submitted translations.</p></div>{categories.length ? <div className="space-y-5">{categories.map((item) => <div key={item.category}><div className="flex justify-between text-label-bold uppercase mb-2"><span>{item.category}</span><span>{item.count}</span></div><div className="h-3 bg-surface-container-high"><div className="h-full bg-secondary-container" style={{ width: `${(item.count / maxCount) * 100}%` }} /></div></div>)}</div> : <div className="border border-outline-variant bg-surface-container-low p-8"><p className="text-body-md opacity-70">Complete a translation session to reveal your focus areas.</p></div>}</section><Link href="/journal" className="inline-block mt-12 text-label-bold uppercase border-b-2 border-primary-container pb-1">Review vocabulary journal</Link></main>;
}
