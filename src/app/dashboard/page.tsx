"use client";

import Link from "next/link";
import ComingSoon from "@/components/layout/ComingSoon";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <main className="flex-grow flex flex-col items-center justify-center px-6 pt-32 text-center"><p className="text-label-bold uppercase mb-4">Private learning space</p><h1 className="text-headline-md mb-5">Log in to view your dashboard.</h1><p className="text-body-md opacity-70 mb-7">Your progress and session history will be tied to your account.</p><Link href="/login" className="bg-primary-container text-on-primary text-label-bold uppercase px-8 py-4">Log in</Link></main>;
  return <ComingSoon title="Dashboard" description="Your recent sessions and next practice steps will live here." />;
}
