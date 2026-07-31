"use client";

import React from "react";
import Link from "next/link";

interface Meaning {
  definition: string;
  example?: string;
}

interface DictionaryEntry {
  lemma: string;
  phonetic?: string;
  partOfSpeech: string;
  meanings: Meaning[];
}

interface GlossaryPanelProps {
  entry: DictionaryEntry | null;
  isLoading?: boolean;
  isAuthenticated?: boolean;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
  saveMessage?: string | null;
}

export default function GlossaryPanel({ entry, isLoading, isAuthenticated, onSave, isSaving, saveMessage }: GlossaryPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-outline-variant p-6 animate-pulse">
        <div className="h-4 w-24 bg-surface-container-high mb-6"></div>
        <div className="h-8 w-32 bg-surface-container-high mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 w-full bg-surface-container-high"></div>
          <div className="h-4 w-full bg-surface-container-high"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-outline-variant p-6 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-label-bold uppercase text-on-surface-variant tracking-widest">Glossary Context</h3>
        <span className="material-symbols-outlined text-outline">menu_book</span>
      </div>

      {!entry ? (
        <div className="py-12 text-center opacity-40">
           <p className="text-sm">Click any word in a sentence to see definition and context.</p>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div>
            <h4 className="text-headline-md text-primary-container mb-1">{entry.lemma}</h4>
            <p className="text-body-md text-on-surface-variant italic mb-2">
              {entry.partOfSpeech} {entry.phonetic && `• ${entry.phonetic}`}
            </p>
            <ul className="text-body-md text-on-background space-y-3 mt-4">
              {entry.meanings.map((m, i) => (
                <li key={i} className="flex gap-2 leading-tight">
                  <span className="text-secondary-container mt-1">•</span>
                  <div>
                    <span>{m.definition}</span>
                    {m.example && (
                       <p className="text-sm opacity-60 italic mt-1">&quot;{m.example}&quot;</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {isAuthenticated ? <button onClick={onSave} disabled={isSaving || !onSave} className="mt-6 w-full border border-primary-container px-4 py-3 text-label-bold uppercase hover:bg-primary-container hover:text-on-primary disabled:opacity-50">{isSaving ? "Saving..." : saveMessage || "Save to journal"}</button> : <Link href="/login" className="mt-6 block text-center border border-primary-container px-4 py-3 text-label-bold uppercase hover:bg-primary-container hover:text-on-primary">Log in to save</Link>}
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
             <p className="text-label-sm text-on-surface-variant leading-relaxed">
               <strong className="text-on-background mr-1">Context Tip:</strong>
               Results are fetched via Free Dictionary API and reflect standard usage. Check the story context for nuances.
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
