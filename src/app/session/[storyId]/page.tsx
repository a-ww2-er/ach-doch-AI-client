"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import SentenceCard from "@/components/session/SentenceCard";
import GlossaryPanel from "@/components/session/GlossaryPanel";
import ContextPanel from "@/components/session/ContextPanel";
import { useAuth } from "@/lib/auth";

interface Story { title: string; direction: string; cefr_level: string; }
interface Sentence { id: string; source_text: string; }
interface Session { id: string; session_number: number; user_session_id: string; source_lang?: string; sentences: Sentence[]; cultural_notes?: { sentence_id: string; term: string; explanation: string }[]; idioms?: { sentence_id: string; idiom: string; meaning: string; equivalent: string }[]; attempts?: Feedback[]; }
interface Feedback { sentence_id?: string; user_translation?: string; score: number; critiques: { category: string; original: string; suggestion: string; explanation: string }[]; model_translation: string; }

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const storyId = params.storyId as string;
  const requestedSession = Number(searchParams.get("session") || "1");
  const sessionNumber = Number.isInteger(requestedSession) && requestedSession > 0 ? requestedSession : 1;

  const [story, setStory] = useState<Story | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, Feedback>>({});
  const [dictionaryEntry, setDictionaryEntry] = useState<Parameters<typeof GlossaryPanel>[0]["entry"]>(null);
  const [dictLoading, setDictLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const storyData = await api.getStory(storyId);
        setStory(storyData);
        
        // Load the first session
        const sessionData = await api.getSessionDetails(storyId, sessionNumber);
        setSession(sessionData);
        setFeedbacks(Object.fromEntries((sessionData.attempts || []).filter((attempt: Feedback) => attempt.sentence_id).map((attempt: Feedback) => [attempt.sentence_id, attempt])));
      } catch (err) {
        console.error(err);
        setError("We could not load this session. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storyId, sessionNumber]);

  const handleWordClick = async (word: string) => {
    setDictLoading(true);
    setSaveMessage(null);
    try {
      const result = await api.lookupWord(word, session?.source_lang || "DE");
      setDictionaryEntry(result);
    } catch (err) {
      console.error(err);
    } finally {
      setDictLoading(false);
    }
  };

  const handleSaveWord = async () => {
    if (!dictionaryEntry || !session) return;
    setSaveLoading(true);
    setSaveMessage(null);
    try {
      await api.saveVocabulary({
        word_form: dictionaryEntry.lemma,
        lemma: dictionaryEntry.lemma,
        language: session.source_lang || "DE",
        pos: dictionaryEntry.partOfSpeech,
        meanings: dictionaryEntry.meanings,
        source_session_id: session.id,
      });
      setSaveMessage("Saved to journal");
    } catch (err) {
      console.error(err);
      setSaveMessage("Could not save word");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleTranslationSubmit = async (sentenceId: string, sourceText: string, translation: string) => {
    if (!session || !story) return;
    setEvaluatingId(sentenceId);
    try {
      const result = await api.evaluateTranslation({
        user_session_id: session.user_session_id,
        sentence_id: sentenceId,
        source_sentence: sourceText,
        user_translation: translation,
        direction: story.direction,
        cefr_level: story.cefr_level,
      });
      setFeedbacks((current) => ({ ...current, [sentenceId]: result }));
    } catch (err) {
      console.error(err);
      setError("We could not evaluate that translation. Please try again.");
    } finally {
      setEvaluatingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center text-headline-md">Loading Session...</div>;
  if (!story || !session) return <div className="p-20 text-center" role="alert">{error || "Session not found."}</div>;

  const completedCount = Object.keys(feedbacks).length;
  const totalSentences = session.sentences.length;

  const finishSession = async () => {
    if (!session) return;
    setFinishing(true);
    setError(null);
    try {
      await api.completeSession(session.user_session_id);
      window.sessionStorage.setItem(`ach-doch-summary-${storyId}-${sessionNumber}`, JSON.stringify({ story, session, feedbacks }));
      router.push(`/session/${storyId}/summary?session=${sessionNumber}&userSessionId=${encodeURIComponent(session.user_session_id)}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "We could not complete this session.");
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col pt-32 pb-margin-page px-margin-page max-w-[1440px] mx-auto w-full">
      {error && <p role="alert" className="mb-6 border border-error bg-error-container px-4 py-3 text-sm">{error}</p>}
      {/* Header Section */}
      <div className="mb-20 border-b border-primary-container pb-6 flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <span className="text-label-bold text-on-surface-variant uppercase mb-2 block">Session {session.session_number.toString().padStart(2, '0')}</span>
          <h1 className="text-headline-display text-on-background">{story.title}</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-low border border-outline-variant text-label-bold">{(story?.direction || "").replace('_', ' -> ')}</div>
           <div className="px-4 py-2 bg-surface-container-low border border-outline-variant text-label-bold">{completedCount} / {totalSentences} Completed</div>
        </div>
      </div>

      <div className="mb-10">
        <div className="h-2 bg-surface-container-high overflow-hidden" aria-label={`${completedCount} of ${totalSentences} sentences completed`} role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalSentences}>
          <div className="h-full bg-secondary-container transition-all duration-500" style={{ width: `${totalSentences ? (completedCount / totalSentences) * 100 : 0}%` }} />
        </div>
        {completedCount === totalSentences && totalSentences > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-primary-container bg-surface-container-low p-5">
            <div><p className="text-label-bold uppercase mb-1">Session complete</p><p className="text-sm opacity-70">Review your translation feedback and recurring errors.</p></div>
            <button onClick={finishSession} disabled={finishing} className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-4 disabled:opacity-50">{finishing ? "Saving..." : "View Summary"}</button>
          </div>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Cards Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {session.sentences.map((sentence, index) => (
            <SentenceCard
              key={sentence.id}
              number={index + 1}
              sourceText={sentence.source_text}
              onWordClick={handleWordClick}
              onSubmit={(val) => handleTranslationSubmit(sentence.id, sentence.source_text, val)}
              isLoading={evaluatingId === sentence.id}
              feedback={feedbacks[sentence.id]}
            />
          ))}
        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 sticky top-32">
           <GlossaryPanel 
             entry={dictionaryEntry} 
             isLoading={dictLoading}
             isAuthenticated={isAuthenticated}
             onSave={handleSaveWord}
             isSaving={saveLoading}
             saveMessage={saveMessage}
           />
           <ContextPanel culturalNotes={session.cultural_notes || []} idioms={session.idioms || []} />
         </aside>
      </div>
    </div>
  );
}
