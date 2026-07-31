"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = mode === "register" ? await api.register({ email, password, display_name: displayName || undefined }) : await api.login({ email, password });
      setAuthToken(result.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to authenticate");
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex-grow flex items-center justify-center px-6 pt-32 pb-16"><div className="w-full max-w-md"><span className="text-label-bold uppercase text-on-surface-variant">ACH-DOCH account</span><h1 className="text-headline-lg mt-3 mb-8">{mode === "login" ? "Welcome back." : "Start your account."}</h1><form onSubmit={submit} className="space-y-6">{mode === "register" && <div><label htmlFor="display-name" className="text-label-bold uppercase block mb-2">Name</label><input id="display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /></div>}<div><label htmlFor="email" className="text-label-bold uppercase block mb-2">Email</label><input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /></div><div><label htmlFor="password" className="text-label-bold uppercase block mb-2">Password</label><input id="password" type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border-b border-outline bg-transparent px-0 py-3 outline-none focus:border-primary-container" /></div>{error && <p role="alert" className="border border-error bg-error-container px-4 py-3 text-sm">{error}</p>}<button disabled={loading} className="w-full bg-primary-container text-on-primary text-label-bold uppercase px-6 py-4 disabled:opacity-50">{loading ? "Working..." : mode === "login" ? "Log in" : "Create account"}</button></form><p className="text-sm opacity-70 mt-8">{mode === "login" ? "New to ACH-DOCH?" : "Already have an account?"} <Link href={mode === "login" ? "/register" : "/login"} className="font-bold text-on-background underline">{mode === "login" ? "Create one" : "Log in"}</Link></p></div></main>;
}
