import Link from "next/link";

export default function LandingFooter() {
  return <footer className="bg-[#f5f2ec] border-t border-primary-container px-6 md:px-12 py-10"><div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6"><Link href="/" className="font-epilogue text-2xl font-black tracking-widest uppercase">ACH-DOCH<span className="text-secondary-container">.</span></Link><div className="flex flex-wrap gap-x-6 gap-y-3 text-label-bold uppercase"><Link href="/start" className="hover:text-secondary">Start translating</Link><Link href="/stories" className="hover:text-secondary">Stories</Link><a href="#faq" className="hover:text-secondary">FAQ</a></div><p className="text-xs opacity-50">Narrative practice for English and German.</p></div></footer>;
}
