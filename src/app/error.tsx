"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-24 text-center"><p className="text-label-bold uppercase mb-4 text-error">Something went wrong</p><h1 className="text-headline-md mb-6">We could not load this page.</h1><button onClick={reset} className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Try again</button></main>;
}
