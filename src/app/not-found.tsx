import Link from "next/link";

export default function NotFound() {
  return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 text-center"><p className="text-label-bold uppercase mb-4">404 / Page not found</p><h1 className="text-headline-lg mb-6">This page went missing.</h1><Link href="/" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Return home</Link></main>;
}
