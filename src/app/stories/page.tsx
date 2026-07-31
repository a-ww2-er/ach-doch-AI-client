"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, StorySummary } from "@/lib/api";

const storyImages = [
  "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85",
];

function StoryCard({ story, index }: { story: StorySummary; index: number }) {
  const readySession = story.sessions.find((session) => session.status === "ready");
  const ready = Boolean(readySession);
  const image = storyImages[index % storyImages.length];
  const details = <><span className="text-label-bold uppercase opacity-75">{story.category.replace("_", " ")} / {story.cefr_level}</span><strong className="block font-epilogue text-2xl mt-2">{story.title}</strong><p className="text-sm opacity-75 mt-3 line-clamp-2">{story.theme}</p><span className="mt-5 inline-flex items-center gap-2 text-label-bold uppercase">{ready ? "Open story" : "Generating chapter"}<span className="material-symbols-outlined text-base">{ready ? "arrow_forward" : "hourglass_top"}</span></span></>;
  const cardClass = "group relative min-h-80 overflow-hidden border border-primary-container text-left";
  const style = { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.04) 10%, rgba(0,0,0,0.88) 100%), url(${image})`, backgroundPosition: "center", backgroundSize: "cover" };

  return ready ? <Link href={`/session/${story.id}?session=${readySession?.session_number || 1}`} className={`${cardClass} block text-white`} style={style}><span className="absolute inset-0 bg-secondary-container/0 transition-colors group-hover:bg-secondary-container/20" /><span className="absolute bottom-0 left-0 right-0 p-6">{details}</span></Link> : <div className={`${cardClass} text-white opacity-80`} style={style} aria-label={`${story.title} is still generating`}><span className="absolute bottom-0 left-0 right-0 p-6">{details}</span></div>;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      setError(null);
      try {
        setStories(await api.listStories());
      } catch (err) {
        setError(err instanceof Error ? err.message : "We could not load the story library");
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, [retry]);

  return <main className="flex-grow pt-40 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><div className="border-b border-primary-container pb-6 mb-10"><span className="text-label-bold uppercase text-on-surface-variant">Your library</span><h1 className="text-headline-lg mt-3">Stories</h1><p className="text-body-lg opacity-70 mt-3 max-w-2xl">Return to a chapter, or find a new perspective to translate.</p></div>{loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" aria-busy="true">{[1, 2, 3].map((item) => <div key={item} className="min-h-80 bg-surface-container-high animate-pulse" />)}</div> : error ? <div role="alert" className="border border-error bg-error-container p-6 max-w-xl"><p className="text-body-md mb-5">{error}</p><button onClick={() => setRetry((value) => value + 1)} className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-3">Try again</button></div> : stories.length === 0 ? <div className="border border-outline-variant bg-surface-container-low p-10 text-center max-w-2xl mx-auto"><span className="material-symbols-outlined text-4xl opacity-40">auto_stories</span><h2 className="text-headline-md mt-4">Your library is waiting.</h2><p className="text-body-md opacity-70 mt-3 mb-7">Generate your first story to start building a translation habit.</p><Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-7 py-4">Create a story</Link></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">{stories.map((story, index) => <StoryCard key={story.id} story={story} index={index} />)}</div>}<div className="mt-12"><Link href="/" className="text-label-bold uppercase border-b-2 border-primary-container pb-1">Create a custom story</Link></div></main>;
}
