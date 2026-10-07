// app/feed/page.tsx
import { Suspense } from 'react';
import { FeedContent } from '@/components/feed-content';

export default function FeedPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-8">
        <h1 className="display-title text-4xl font-bold md:text-6xl">
          <span className="gradient-text">Галактика</span>{' '}
          <span className="text-white">искусств</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/50 md:text-base">
          Лучшие работы художников со всей вселенной
        </p>
      </div>

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-white/5" />
            <div className="mt-4 h-64 w-full animate-pulse rounded-2xl bg-white/5" />
          </div>
        }
      >
        <FeedContent />
      </Suspense>
    </div>
  );
}