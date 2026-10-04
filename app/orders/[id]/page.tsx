import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { OrderPageContent } from '@/components/order-page-content';

async function OrderContent({ id }: { id: string }) {
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from('orders')
    .select(`
      id, title, description, image_url, category,
      budget, budget_type, budget_to, deadline_days, tags,
      status, responses_count, views_count, created_at,
      client:profiles!orders_client_id_fkey (
        id, username, display_name, avatar_url, bio, is_sponsor
      )
    `)
    .eq('id', id)
    .single();

  if (error || !order) {
    notFound();
  }

  const client = Array.isArray(order.client) ? order.client[0] : order.client;

  return (
    <OrderPageContent
      order={{
        ...order,
        client,
      }}
    />
  );
}

function OrderSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="h-12 w-3/4 animate-pulse rounded bg-white/5" />
          <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
        </div>
        <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<OrderSkeleton />}>
      <OrderContent id={id} />
    </Suspense>
  );
}