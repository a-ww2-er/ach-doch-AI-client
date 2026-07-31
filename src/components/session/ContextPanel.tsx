interface CulturalNote {
  sentence_id: string;
  term: string;
  explanation: string;
}

interface IdiomNote {
  sentence_id: string;
  idiom: string;
  meaning: string;
  equivalent: string;
}

interface ContextPanelProps {
  culturalNotes: CulturalNote[];
  idioms: IdiomNote[];
}

export default function ContextPanel({ culturalNotes, idioms }: ContextPanelProps) {
  if (!culturalNotes.length && !idioms.length) return null;

  return <section className="mt-6 bg-surface border border-outline-variant p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-label-bold uppercase text-on-surface-variant tracking-widest">Story context</h3><span className="material-symbols-outlined text-outline">auto_stories</span></div><div className="space-y-7">
    {idioms.length > 0 && <div><span className="text-label-bold uppercase text-secondary">Idioms in this chapter</span><div className="mt-3 space-y-4">{idioms.map((item) => <article key={`${item.sentence_id}-${item.idiom}`} className="border-l-4 border-secondary-container pl-4"><div className="flex items-start justify-between gap-3"><h4 className="font-epilogue text-xl font-bold">{item.idiom}</h4><span className="text-label-bold opacity-40">{item.sentence_id}</span></div><p className="text-sm mt-1">{item.meaning}</p><p className="text-sm opacity-60 mt-2"><span className="font-bold">Natural equivalent:</span> {item.equivalent}</p></article>)}</div></div>}
    {culturalNotes.length > 0 && <div className={idioms.length > 0 ? "border-t border-outline-variant pt-6" : ""}><span className="text-label-bold uppercase text-secondary">Cultural notes</span><div className="mt-3 space-y-4">{culturalNotes.map((item) => <article key={`${item.sentence_id}-${item.term}`} className="bg-surface-container-low p-4"><div className="flex items-start justify-between gap-3"><h4 className="font-bold">{item.term}</h4><span className="text-label-bold opacity-40">{item.sentence_id}</span></div><p className="text-sm opacity-75 mt-2 leading-relaxed">{item.explanation}</p></article>)}</div></div>}
  </div></section>;
}
