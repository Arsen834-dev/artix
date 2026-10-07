// app/orders/page.tsx
import { Suspense } from 'react';
import { OrdersContent } from '@/components/orders-content';

export default function OrdersPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-12">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="text-[#4FD1C5]">Заказы</span>{' '}
          <span className="text-white">от клиентов</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/50">
          Художники, найдите заказ по душе. Клиенты ищут исполнителей прямо
          сейчас.
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
        <OrdersContent />
      </Suspense>
    </div>
  );
}