const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: { id: string; email: string; display_name: string | null };
}

export interface StorySummary {
  id: string;
  title: string;
  theme: string;
  direction: string;
  category: string;
  cefr_level: string;
  is_system: boolean;
  sessions: { session_number: number; status: string }[];
}

export interface VocabularyEntry {
  id: string;
  word_form: string;
  lemma: string;
  language: "EN" | "DE";
  pos: string | null;
  meanings: { definition: string; example?: string }[];
  source_session_id: string | null;
  encounter_count: number;
  mastery_score: number;
  last_seen_at: string | null;
}

export interface ProgressOverview {
  total_sessions: number;
  completed_sessions: number;
  average_score: number | null;
  total_attempts: number;
  error_categories: { category: string; count: number }[];
  recent_sessions: { user_session_id: string; story_id: string; story_title: string; session_number: number; status: string; overall_score: number | null; completed_at: string | null }[];
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = window.localStorage.getItem("ach-doch-token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  async register(data: { email: string; password: string; display_name?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.detail || "Registration failed");
    return res.json() as Promise<AuthResponse>;
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error((await res.json().catch(() => null))?.detail || "Login failed");
    return res.json() as Promise<AuthResponse>;
  },

  async me() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Authentication required");
    return res.json() as Promise<AuthResponse["user"]>;
  },

  async listStories() {
    const res = await fetch(`${API_BASE}/stories/`, { headers: authHeaders() });
    if (!res.ok) throw new ApiError("We could not load the story library", res.status);
    return res.json() as Promise<StorySummary[]>;
  },

  async listVocabulary(params: { language?: string; search?: string } = {}) {
    const query = new URLSearchParams();
    if (params.language) query.set("language", params.language);
    if (params.search?.trim()) query.set("search", params.search.trim());
    const res = await fetch(`${API_BASE}/vocabulary/?${query.toString()}`, { headers: authHeaders() });
    if (!res.ok) throw new ApiError("We could not load your journal", res.status);
    return res.json() as Promise<VocabularyEntry[]>;
  },

  async saveVocabulary(data: { word_form: string; lemma: string; language: string; pos?: string; meanings: { definition: string; example?: string }[]; source_session_id?: string }) {
    const res = await fetch(`${API_BASE}/vocabulary/`, { method: "POST", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify(data) });
    if (!res.ok) throw new ApiError("We could not save that word", res.status);
    return res.json() as Promise<VocabularyEntry>;
  },

  async reviewVocabulary(id: string, mastery_score: number) {
    const res = await fetch(`${API_BASE}/vocabulary/${id}/review`, { method: "PATCH", headers: { "Content-Type": "application/json", ...authHeaders() }, body: JSON.stringify({ mastery_score }) });
    if (!res.ok) throw new ApiError("We could not update that word", res.status);
    return res.json() as Promise<VocabularyEntry>;
  },

  async deleteVocabulary(id: string) {
    const res = await fetch(`${API_BASE}/vocabulary/${id}`, { method: "DELETE", headers: authHeaders() });
    if (!res.ok) throw new ApiError("We could not remove that word", res.status);
  },

  async generateStory(params: {
    title: string;
    direction: string;
    category: string;
    theme: string;
    cefr_level: string;
  }) {
    const res = await fetch(`${API_BASE}/stories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Failed to generate story");
    return res.json();
  },

  async getStory(id: string) {
    const res = await fetch(`${API_BASE}/stories/${id}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Story not found");
    return res.json();
  },

  async getSessionDetails(storyId: string, sessionNum: number) {
    const res = await fetch(`${API_BASE}/stories/${storyId}/sessions/${sessionNum}`, { headers: authHeaders() });
    if (!res.ok) throw new Error("Session not found");
    return res.json();
  },

  async completeSession(userSessionId: string) {
    const res = await fetch(`${API_BASE}/sessions/${userSessionId}/complete`, { method: "POST", headers: authHeaders() });
    if (!res.ok) throw new ApiError((await res.json().catch(() => null))?.detail || "We could not complete this session", res.status);
    return res.json();
  },

  async getProgressOverview() {
    const res = await fetch(`${API_BASE}/progress/overview`, { headers: authHeaders() });
    if (!res.ok) throw new ApiError("We could not load your progress", res.status);
    return res.json() as Promise<ProgressOverview>;
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
      headers: { "Content-Type": "application/json", ...authHeaders() },
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
