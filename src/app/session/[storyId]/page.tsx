"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import SentenceCard from "@/components/session/SentenceCard";
import GlossaryPanel from "@/components/session/GlossaryPanel";

export default function SessionPage() {
  const params = useParams();
  const storyId = params.storyId as string;

  const [story, setStory] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [feedbacks, setFeedbacks] = useState<Record<string, any>>({});
  const [dictionaryEntry, setDictionaryEntry] = useState<any>(null);
  const [dictLoading, setDictLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const storyData = await api.getStory(storyId);
        setStory(storyData);
        
        // Load the first session
        const sessionData = await api.getSessionDetails(storyId, 1);
        setSession(sessionData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [storyId]);

  const handleWordClick = async (word: string) => {
    setDictLoading(true);
    try {
      const result = await api.lookupWord(word, session?.source_lang || "DE");
      setDictionaryEntry(result);
    } catch (err) {
      console.error(err);
    } finally {
      setDictLoading(false);
    }
  };

  const handleTranslationSubmit = async (sentenceId: string, sourceText: string, translation: string) => {
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
      setFeedbacks({ ...feedbacks, [sentenceId]: result });
    } catch (err) {
      console.error(err);
      alert("Evaluation failed.");
    } finally {
      setEvaluatingId(null);
    }
  };

  if (loading) return <div className="p-20 text-center text-headline-md">Loading Session...</div>;
  if (!story || !session) return <div className="p-20 text-center">Session not found.</div>;

  const completedCount = Object.keys(feedbacks).length;

  return (
    <div className="flex-grow flex flex-col pt-32 pb-margin-page px-margin-page max-w-[1440px] mx-auto w-full">
      {/* Header Section */}
      <div className="mb-20 border-b border-primary-container pb-6 flex justify-between items-end animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <span className="text-label-bold text-on-surface-variant uppercase mb-2 block">Session {session.session_number.toString().padStart(2, '0')}</span>
          <h1 className="text-headline-display text-on-background">{story.title}</h1>
        </div>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-surface-container-low border border-outline-variant text-label-bold">{(story?.direction || "").replace('_', ' -> ')}</div>
          <div className="px-4 py-2 bg-surface-container-low border border-outline-variant text-label-bold">{completedCount} / {session.sentences.length} Completed</div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* Cards Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {session.sentences.map((sentence: any, index: number) => (
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
          />
        </aside>
      </div>
    </div>
  );
}
