"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, api, StorySummary } from "@/lib/api";
import { clearAuthToken, useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-32 text-center"><p className="text-label-bold uppercase mb-4">Private learning space</p><h1 className="text-headline-md mb-5">Log in to view your dashboard.</h1><p className="text-body-md opacity-70 mb-7">Your progress and session history will be tied to your account.</p><Link href="/login" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Log in</Link></main>;
  return <AuthenticatedDashboard />;
}

function AuthenticatedDashboard() {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      setLoading(true);
      setError(null);
      try {
        const result = await api.listStories();
        if (active) setStories(result);
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          clearAuthToken();
          return;
        }
        setError(err instanceof Error ? err.message : "We could not load your dashboard");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDashboard();
    return () => { active = false; };
  }, [retry]);

  const readyChapters = stories.reduce((count, story) => count + story.sessions.filter((session) => session.status === "ready").length, 0);
  const resumeStory = stories.find((story) => story.sessions.some((session) => session.status === "ready"));
  const resumeSession = resumeStory?.sessions.find((session) => session.status === "ready")?.session_number || 1;

  return <main className="flex-grow pt-40 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-primary-container pb-6 mb-10"><div><span className="text-label-bold uppercase text-on-surface-variant">Your learning space</span><h1 className="text-headline-lg mt-3">Dashboard</h1></div><Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-4 text-center">New story</Link></div>{loading ? <div className="space-y-10" aria-busy="true"><div className="h-44 bg-surface-container-high animate-pulse" /><div className="grid grid-cols-2 md:grid-cols-3 gap-5"><div className="h-28 bg-surface-container-high animate-pulse" /><div className="h-28 bg-surface-container-high animate-pulse" /><div className="h-28 bg-surface-container-high animate-pulse" /></div></div> : error ? <div role="alert" className="border border-error bg-error-container p-6 max-w-xl"><p className="text-body-md mb-5">{error}</p><button onClick={() => setRetry((value) => value + 1)} className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-3">Try again</button></div> : stories.length === 0 ? <div className="border border-outline-variant bg-surface-container-low p-10 text-center max-w-2xl mx-auto"><span className="material-symbols-outlined text-4xl opacity-40">explore</span><h2 className="text-headline-md mt-4">Your next chapter starts here.</h2><p className="text-body-md opacity-70 mt-3 mb-7">Create a story and your recent work will appear on this dashboard.</p><Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-7 py-4">Create a story</Link></div> : <><section className="bg-primary-container text-on-primary p-7 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-7"><div><span className="text-label-bold uppercase opacity-70">Continue translating</span><h2 className="text-headline-md mt-3">{resumeStory ? resumeStory.title : "Choose a story"}</h2><p className="text-sm opacity-70 mt-3">{resumeStory ? `Chapter ${resumeSession.toString().padStart(2, "0")} is ready when you are.` : "Your stories are still being prepared."}</p></div>{resumeStory && <Link href={`/session/${resumeStory.id}?session=${resumeSession}`} className="bg-secondary-container text-on-primary text-label-bold uppercase px-6 py-4 text-center">Resume chapter</Link>}</section><section className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8"><div className="bg-surface-container-low border border-outline-variant p-6"><span className="text-label-bold uppercase text-on-surface-variant">Stories</span><p className="text-headline-md mt-3">{stories.length}</p></div><div className="bg-surface-container-low border border-outline-variant p-6"><span className="text-label-bold uppercase text-on-surface-variant">Ready chapters</span><p className="text-headline-md mt-3">{readyChapters}</p></div><div className="bg-surface-container-low border border-outline-variant p-6 col-span-2 md:col-span-1"><span className="text-label-bold uppercase text-on-surface-variant">Next step</span><p className="text-body-md mt-3">Translate one sentence today.</p></div></section><section className="mt-12"><div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-5"><h2 className="text-headline-md">Your stories</h2><Link href="/stories" className="text-label-bold uppercase underline">View all</Link></div><div className="space-y-3">{stories.slice(0, 4).map((story) => { const ready = story.sessions.find((session) => session.status === "ready"); return <div key={story.id} className="border border-outline-variant bg-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h3 className="font-epilogue text-xl font-bold">{story.title}</h3><p className="text-sm opacity-60 mt-1">{story.cefr_level} / {story.direction.replace("_", " -> ")}</p></div>{ready ? <Link href={`/session/${story.id}?session=${ready.session_number}`} className="text-label-bold uppercase border-b-2 border-primary-container pb-1 self-start sm:self-auto">Open chapter</Link> : <span className="text-label-bold uppercase opacity-50">Generating</span>}</div>; })}</div></section></>}</main>;
}
