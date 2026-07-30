"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#F8F8F8] border-b border-[#222222] h-24 flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-16 flex justify-between items-center">
        <Link href="/" className="text-3xl font-black text-[#222222] tracking-widest font-epilogue uppercase">
          ACH-DOCH
        </Link>
        
        <nav className="hidden md:flex gap-8">
          {["Dashboard", "Stories", "Journal", "Mastery"].map((item) => (
            <Link
              key={item}
              href="#"
              className={item === "Mastery" 
                ? "font-epilogue font-black uppercase tracking-tighter text-[#222222] border-b-2 border-[#222222] pb-1"
                : "font-epilogue font-black uppercase tracking-tighter text-[#222222]/60 hover:text-[#222222] transition-colors"
              }
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-[#222222] hover:opacity-70 transition-all">
            <span className="material-symbols-outlined text-2xl">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
