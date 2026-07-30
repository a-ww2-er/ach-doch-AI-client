"use client";

import React, { useState } from "react";
// import { cn } from "@/lib/utils";

interface Critique {
  category: string;
  original: string;
  suggestion: string;
  explanation: string;
}

interface SentenceCardProps {
  number: number;
  sourceText: string;
  onWordClick: (word: string) => void;
  onSubmit: (translation: string) => Promise<void>;
  feedback?: {
    score: number;
    critiques: Critique[];
    model_translation: string;
  };
  isLoading?: boolean;
}

export default function SentenceCard({
  number,
  sourceText,
  onWordClick,
  onSubmit,
  feedback,
  isLoading
}: SentenceCardProps) {
  const [translation, setTranslation] = useState("");

  const formattedNumber = number.toString().padStart(2, "0");

  if (feedback) {
    return (
      <article className="bg-surface-container-low border border-outline-variant p-6 relative overflow-hidden transition-all animate-in fade-in slide-in-from-bottom-2">
        <div className="flex justify-between items-start mb-6">
          <span className="text-label-bold text-on-surface-variant">{formattedNumber}</span>
          <div className="px-3 py-1 bg-primary-container text-on-primary text-label-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Score: {feedback.score}/100
          </div>
        </div>

        <div className="mb-8 opacity-70">
          <p className="text-headline-md text-on-background leading-relaxed">
            {sourceText}
          </p>
        </div>

        <div className="border-t border-outline-variant pt-6 mt-6">
          <span className="text-label-bold text-on-surface-variant uppercase mb-2 block">Your Translation</span>
          <p className="text-body-lg text-on-background line-through opacity-70 mb-4">{translation}</p>

          <div className="space-y-4">
            {feedback.critiques.map((critique, idx) => (
              <div key={idx} className="bg-error-container text-on-error-container p-4 border-l-4 border-error">
                <p className="text-body-md">
                  <span className="font-bold uppercase text-[10px] mr-2">Correction:</span>
                  <span className="line-through opacity-60 mr-2">{critique.original}</span>
                  <span className="font-bold underline text-secondary">{critique.suggestion}</span>
                </p>
                <p className="text-sm mt-1 opacity-80">{critique.explanation}</p>
              </div>
            ))}

            <div className="bg-surface-container-high p-4 border-l-4 border-primary">
              <span className="text-label-bold text-on-primary-container uppercase mb-1 block">Refined Translation</span>
              <p className="text-body-lg font-medium italic">{feedback.model_translation}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-surface border border-primary-container p-6 relative overflow-hidden group transition-all shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start mb-6">
        <span className="text-label-bold text-on-surface-variant">{formattedNumber}</span>
        <div className="flex gap-2">
          {/* Actions Placeholder */}
        </div>
      </div>

      <div className="mb-8">
        <p className="text-headline-md text-on-background leading-relaxed select-none">
          {sourceText.split(" ").map((word, idx) => (
            <span
              key={idx}
              onClick={() => onWordClick(word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""))}
              className="cursor-pointer hover:bg-surface-variant px-1 rounded transition-all active:scale-95 inline-block"
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>

      <div className="relative pt-6">
        <label className="text-label-bold text-on-surface-variant uppercase absolute top-0 left-0" htmlFor={`trans-${number}`}>
          Your Translation
        </label>
        <textarea
          className="w-full bg-transparent border-0 border-b border-outline focus:border-primary-container focus:ring-0 text-body-lg text-on-background p-0 pb-2 resize-none transition-all placeholder:opacity-30"
          id={`trans-${number}`}
          placeholder="Begin typing..."
          rows={3}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => onSubmit(translation)}
          disabled={!translation.trim() || isLoading}
          className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4 hover:bg-secondary-container transition-all disabled:opacity-50 disabled:hover:bg-primary-container active:scale-95 flex items-center gap-2"
        >
          {isLoading ? "Analyzing..." : "Submit"}
        </button>
      </div>
    </article>
  );
}
