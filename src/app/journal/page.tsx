"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ApiError, api, VocabularyEntry } from "@/lib/api";
import { clearAuthToken, useAuth } from "@/lib/auth";

export default function JournalPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-32 text-center"><p className="text-label-bold uppercase mb-4">Private vocabulary journal</p><h1 className="text-headline-md mb-5">Log in to keep the words you discover.</h1><p className="text-body-md opacity-70 mb-7">Save words from any session and build a review habit.</p><Link href="/login" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Log in</Link></main>;
  return <AuthenticatedJournal />;
}

function AuthenticatedJournal() {
  const [entries, setEntries] = useState<VocabularyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<"ALL" | "EN" | "DE">("ALL");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadJournal() {
      try {
        const result = await api.listVocabulary();
        if (active) setEntries(result);
      } catch (err) {
        if (!active) return;
        if (err instanceof ApiError && err.status === 401) {
          clearAuthToken();
          return;
        }
        setError(err instanceof Error ? err.message : "We could not load your journal");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadJournal();
    return () => { active = false; };
  }, []);

  const filteredEntries = useMemo(() => entries.filter((entry) => (language === "ALL" || entry.language === language) && (!search.trim() || `${entry.lemma} ${entry.word_form}`.toLowerCase().includes(search.trim().toLowerCase()))), [entries, language, search]);

  const reviewEntry = async (entry: VocabularyEntry) => {
    setBusyId(entry.id);
    try {
      const updated = await api.reviewVocabulary(entry.id, Math.min(100, entry.mastery_score + 20));
      setEntries((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update this word");
    } finally {
      setBusyId(null);
    }
  };

  const removeEntry = async (entry: VocabularyEntry) => {
    setBusyId(entry.id);
    try {
      await api.deleteVocabulary(entry.id);
      setEntries((current) => current.filter((item) => item.id !== entry.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove this word");
    } finally {
      setBusyId(null);
    }
  };

  return <main className="flex-grow pt-40 pb-24 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><div className="border-b border-primary-container pb-6 mb-8"><span className="text-label-bold uppercase text-on-surface-variant">Your vocabulary</span><h1 className="text-headline-lg mt-3">Journal</h1><p className="text-body-lg opacity-70 mt-3">Words worth remembering, collected from your translations.</p></div>{error && <div role="alert" className="mb-7 border border-error bg-error-container px-5 py-4 text-sm">{error}</div>}{loading ? <div className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-busy="true">{[1, 2, 3, 4].map((item) => <div key={item} className="h-48 bg-surface-container-high animate-pulse" />)}</div> : <><div className="flex flex-col md:flex-row gap-4 mb-8"><input aria-label="Search journal" placeholder="Search words..." value={search} onChange={(event) => setSearch(event.target.value)} className="flex-1 border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /><div className="flex border border-outline-variant">{(["ALL", "EN", "DE"] as const).map((option) => <button key={option} onClick={() => setLanguage(option)} className={`px-4 py-3 text-label-bold uppercase ${language === option ? "bg-primary-container text-on-primary" : "hover:bg-surface-container-low"}`}>{option}</button>)}</div></div>{filteredEntries.length === 0 ? <div className="border border-outline-variant bg-surface-container-low p-10 text-center"><span className="material-symbols-outlined text-4xl opacity-40">menu_book</span><h2 className="text-headline-md mt-4">{entries.length ? "No matching words." : "Your journal is empty."}</h2><p className="text-body-md opacity-70 mt-3 mb-7">{entries.length ? "Try another search or language filter." : "Click a word during a session and save it here."}</p>{!entries.length && <Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-7 py-4">Start translating</Link>}</div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{filteredEntries.map((entry) => <article key={entry.id} className="bg-surface border border-outline-variant p-6"><div className="flex justify-between items-start gap-4"><div><span className="text-label-bold uppercase text-secondary">{entry.language} / {entry.pos || "word"}</span><h2 className="font-epilogue text-3xl font-bold mt-2">{entry.lemma}</h2></div><span className="text-label-bold uppercase opacity-50">{Math.round(entry.mastery_score)}%</span></div><div className="h-2 bg-surface-container-high mt-5"><div className="h-full bg-secondary-container" style={{ width: `${Math.min(100, Math.max(0, entry.mastery_score))}%` }} /></div><p className="text-body-md mt-5">{entry.meanings[0]?.definition || "No definition saved."}</p>{entry.meanings[0]?.example && <p className="text-sm opacity-60 italic mt-2">&quot;{entry.meanings[0].example}&quot;</p>}<div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-outline-variant"><button disabled={busyId === entry.id || entry.mastery_score >= 100} onClick={() => reviewEntry(entry)} className="text-label-bold uppercase border-b-2 border-primary-container pb-1 disabled:opacity-40">{entry.mastery_score >= 100 ? "Mastered" : busyId === entry.id ? "Updating..." : "Mark practiced"}</button><button disabled={busyId === entry.id} onClick={() => removeEntry(entry)} className="text-label-bold uppercase text-error opacity-70 hover:opacity-100 disabled:opacity-40">Remove</button></div></article>)}</div>}</>}</main>;
}
