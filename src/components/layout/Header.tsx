"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearAuthToken, useAuth } from "@/lib/auth";

const navigation = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Stories", href: "/stories" },
  { label: "Journal", href: "/journal" },
  { label: "Mastery", href: "/mastery" },
];

export default function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#F8F8F8] border-b border-[#222222] h-24 flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-16 flex justify-between items-center">
        <Link href="/" className="text-3xl font-black text-[#222222] tracking-widest font-epilogue uppercase">
          ACH-DOCH
        </Link>
        
        <nav className="hidden md:flex gap-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href)
                ? "font-epilogue font-black uppercase tracking-tighter text-[#222222] border-b-2 border-[#222222] pb-1"
                : "font-epilogue font-black uppercase tracking-tighter text-[#222222]/60 hover:text-[#222222] transition-colors"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? <button onClick={clearAuthToken} className="hidden sm:block text-label-bold uppercase text-[#222222]/60 hover:text-[#222222]">Log out</button> : <Link href="/login" aria-label="Account" className="hidden sm:block text-[#222222] hover:opacity-70 transition-all"><span className="material-symbols-outlined text-2xl">account_circle</span></Link>}
          <button
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#222222]"
          >
            <span className="material-symbols-outlined text-2xl">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden absolute top-24 left-0 right-0 bg-[#F8F8F8] border-b border-[#222222] px-6 py-5 flex flex-col gap-5">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="font-epilogue font-black uppercase tracking-tighter">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
