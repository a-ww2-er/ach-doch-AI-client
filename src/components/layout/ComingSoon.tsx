import Link from "next/link";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return <main className="flex-grow pt-40 px-6 md:px-16 max-w-[1440px] mx-auto w-full"><span className="text-label-bold uppercase text-on-surface-variant">Your learning space</span><h1 className="text-headline-lg mt-3 mb-5">{title}</h1><p className="text-body-lg max-w-xl opacity-70 mb-8">{description}</p><Link href="/" className="text-label-bold uppercase border-b-2 border-[#222222] pb-1">Start a translation session</Link></main>;
}
