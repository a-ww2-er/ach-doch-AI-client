"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";

interface ChatItem { role: "user" | "assistant"; content: string; }

export default function SessionChat({ userSessionId }: { userSessionId: string }) {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    setLoading(true);
    setError(null);
    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setMessage("");
    try {
      const response = await api.sendChatMessage(userSessionId, trimmed);
      setMessages(response.history.filter((item) => item.role === "user" || item.role === "assistant"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "The language coach is unavailable");
    } finally {
      setLoading(false);
    }
  }

  return <section className="mt-14 max-w-3xl border border-primary-container bg-surface p-6 md:p-8"><div className="border-b border-outline-variant pb-5 mb-6"><span className="text-label-bold uppercase text-secondary">Coach chat</span><h2 className="text-headline-md mt-2">Ask about this session.</h2><p className="text-sm opacity-60 mt-2">Ask why a correction was made or how to say something more naturally.</p></div>{messages.length > 0 && <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={item.role === "user" ? "ml-8 bg-primary-container text-on-primary p-4 text-sm" : "mr-8 bg-surface-container-low border-l-4 border-secondary-container p-4 text-sm leading-relaxed"}>{item.content}</div>)}</div>}{error && <p role="alert" className="mb-4 border border-error bg-error-container px-4 py-3 text-sm">{error}</p>}<form onSubmit={submit} className="flex flex-col sm:flex-row gap-3"><input value={message} maxLength={2000} onChange={(event) => setMessage(event.target.value)} placeholder="Ask a language question..." className="flex-1 border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /><button disabled={loading || !message.trim()} className="bg-primary-container text-on-primary text-label-bold uppercase px-6 py-3 disabled:opacity-50">{loading ? "Thinking..." : "Ask coach"}</button></form></section>;
}
