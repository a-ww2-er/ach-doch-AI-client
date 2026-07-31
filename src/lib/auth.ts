import { useSyncExternalStore } from "react";

const TOKEN_KEY = "ach-doch-token";
const AUTH_EVENT = "ach-doch-auth-change";

function getToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(AUTH_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(AUTH_EVENT, listener);
  };
}

export function useAuth() {
  const token = useSyncExternalStore(subscribe, getToken, () => null);
  return { isAuthenticated: Boolean(token), token };
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuthToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}
