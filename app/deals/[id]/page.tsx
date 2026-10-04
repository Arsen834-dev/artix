import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { DealPageContent } from '@/components/deal-page-content';

async function DealContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: deal, error } = await supabase
    .from('deals')
    .select(`
      id, title, description, amount, commission_percent, commission_amount, artist_amount,
      status, client_paid, artist_completed, client_confirmed,
      created_at, paid_at, completed_at,
      service_id, order_id,
      client:profiles!deals_client_id_fkey (id, username, display_name, avatar_url),
      artist:profiles!deals_artist_id_fkey (id, username, display_name, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error || !deal) {
    notFound();
  }

  const client = Array.isArray(deal.client) ? deal.client[0] : deal.client;
  const artist = Array.isArray(deal.artist) ? deal.artist[0] : deal.artist;

  // Проверка доступа
  if (client.id !== user.id && artist.id !== user.id) {
    notFound();
  }

  return (
    <DealPageContent
      deal={{
        ...deal,
        client,
        artist,
      }}
      userId={user.id}
      isClient={client.id === user.id}
    />
  );
}

function DealSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
        <div className="h-96 animate-pulse rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}

export default async function DealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<DealSkeleton />}>
      <DealContent id={id} />
    </Suspense>
  );
}