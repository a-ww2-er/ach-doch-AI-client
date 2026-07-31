"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LandingHeader() {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [{ label: "Method", href: "#method" }, { label: "Inside the lab", href: "#examples" }, { label: "FAQ", href: "#faq" }];

  return <header className="absolute top-0 left-0 w-full z-50 h-24 flex items-center text-[#f5f2ec]"><div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex items-center justify-between"><Link href="/" className="font-epilogue text-2xl sm:text-3xl font-black tracking-widest uppercase">ACH-DOCH<span className="text-secondary-container">.</span></Link><nav className="hidden md:flex items-center gap-8">{links.map((link) => <a key={link.href} href={link.href} className="font-epilogue font-black uppercase tracking-tighter text-[#f5f2ec]/65 hover:text-[#f5f2ec] transition-colors">{link.label}</a>)}</nav><div className="flex items-center gap-4"><Link href={isAuthenticated ? "/dashboard" : "/login"} className="hidden sm:inline-block text-label-bold uppercase border-b border-[#f5f2ec]/50 pb-1 hover:border-[#f5f2ec]">{isAuthenticated ? "Dashboard" : "Log in"}</Link><Link href="/start" className="hidden sm:inline-block bg-secondary-container text-on-primary text-label-bold uppercase px-5 py-3 hover:bg-[#ff7a4d] transition-colors">Start</Link><button aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="md:hidden"><span className="material-symbols-outlined text-2xl">{menuOpen ? "close" : "menu"}</span></button></div></div>{menuOpen && <nav className="absolute top-24 left-0 right-0 bg-[#161616] border-y border-[#f5f2ec]/20 px-6 py-6 flex flex-col gap-6 md:hidden">{links.map((link) => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-epilogue font-black uppercase tracking-tighter">{link.label}</a>)}<Link href="/start" onClick={() => setMenuOpen(false)} className="bg-secondary-container text-on-primary text-label-bold uppercase px-5 py-4 text-center">Start translating</Link></nav>}</header>;
}
