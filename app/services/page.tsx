// app/services/page.tsx
import { Suspense } from 'react';
import { ServicesContent } from '@/components/services-content';

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-12">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="gradient-text">Услуги</span>{' '}
          <span className="text-white">художников</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/50">
          Закажи арт у лучших художников галактики. Выбери стиль, цену и срок.
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
        <ServicesContent />
      </Suspense>
    </div>
  );
}