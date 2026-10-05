// app/orders/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { OrdersGrid } from '@/components/orders-grid';
import { CATEGORIES } from '@/lib/constants';

async function OrdersContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  const supabase = await createClient();

  let query = supabase
    .from('orders')
    .select(`
      id, title, description, image_url, category,
      budget, budget_type, budget_to, deadline_days, tags, status, responses_count, created_at,
      client:profiles!orders_client_id_fkey (username, display_name, avatar_url, is_sponsor)
    `)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Orders error:', error);
    return (
      <div className="py-20 text-center text-white/60">
        Ошибка загрузки 😢
      </div>
    );
  }

  const orders = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    category: item.category,
    budget: item.budget,
    budget_type: item.budget_type || 'up_to',
    budget_to: item.budget_to,
    deadline_days: item.deadline_days,
    tags: item.tags,
    status: item.status,
    responses_count: item.responses_count || 0,
    created_at: item.created_at,
    client: Array.isArray(item.client) ? item.client[0] : item.client,
  }));

  return <OrdersGrid orders={orders} />;
}

async function CategoryFilters({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <a
                key={cat.slug}
                href={
                  cat.slug === 'all' ? '/orders' : `/orders?category=${cat.slug}`
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#4FD1C5] to-[#68D391] text-white shadow-lg shadow-[#4FD1C5]/30'
                    : 'border border-white/5 bg-white/5 text-white/60 hover:border-[#4FD1C5]/30 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-3xl bg-white/5" />
      ))}
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 animate-pulse rounded-full bg-white/5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<FiltersSkeleton />}>
        <CategoryFilters searchParams={searchParams} />
      </Suspense>

      <div className="container mx-auto px-4 pb-8 pt-12">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="text-[#4FD1C5]">Заказы</span>{' '}
          <span className="text-white">от клиентов</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/50">
          Художники, найдите заказ по душе. Клиенты ищут исполнителей прямо сейчас.
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<OrdersSkeleton />}>
          <OrdersContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}