'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-4">
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
        Chart Your Path to Mastery
      </h1>
      <p className="mt-6 text-lg text-slate-300 max-w-2xl">
        Your personalized guide through the complex world of technology. Choose a roadmap, track your progress, and achieve your learning goals.
      </p>
      <Link href="/register" className="mt-8 bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Get Started for Free
      </Link>
    </main>
  );
}