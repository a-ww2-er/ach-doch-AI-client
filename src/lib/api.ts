const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: { id: string; email: string; display_name: string | null };
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
