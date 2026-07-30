const API_BASE = "http://localhost:8000/api/v1";

export const api = {
  async generateStory(params: {
    title: string;
    direction: string;
    category: string;
    theme: string;
    cefr_level: string;
  }) {
    const res = await fetch(`${API_BASE}/stories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to generate story");
    return res.json();
  },

  async getStory(id: string) {
    const res = await fetch(`${API_BASE}/stories/${id}`);
    if (!res.ok) throw new Error("Story not found");
    return res.json();
  },

  async getSessionDetails(storyId: string, sessionNum: number) {
    const res = await fetch(`${API_BASE}/stories/${storyId}/sessions/${sessionNum}`);
    if (!res.ok) throw new Error("Session not found");
    return res.json();
  },

  async evaluateTranslation(data: {
    user_session_id: string;
    sentence_id: string;
    source_sentence: string;
    user_translation: string;
    direction: string;
    cefr_level: string;
  }) {
    const res = await fetch(`${API_BASE}/translate/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Evaluation failed");
    return res.json();
  },

  async lookupWord(word: string, lang: string) {
    const res = await fetch(`${API_BASE}/dictionary/lookup?word=${word}&lang=${lang}`);
    if (!res.ok) return null;
    return res.json();
  }
};
