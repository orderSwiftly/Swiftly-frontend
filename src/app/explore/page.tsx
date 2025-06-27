// app/explore/page.tsx
'use client';

import ExploreComp from './exploreComp';
import Navigation from '@/components/navigation';

export default function ExplorePage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col">
      {/* Fixed nav */}
      <Navigation />

      {/* Push content down below nav */}
      <div className="flex-1 pt-24 px-4 sm:px-6">
        <ExploreComp />
      </div>
    </main>
  );
}