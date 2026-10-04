import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DealsList } from '@/components/deals-list';

async function DealsContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Сделки где я клиент или художник
  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      id, title, description, amount, commission_amount, artist_amount,
      status, created_at,
      client:profiles!deals_client_id_fkey (id, username, display_name, avatar_url),
      artist:profiles!deals_artist_id_fkey (id, username, display_name, avatar_url)
    `)
    .or(`client_id.eq.${user.id},artist_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return <div className="text-center text-white/60">Ошибка загрузки</div>;
  }

  const formatted = (deals || []).map((d: any) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    amount: d.amount,
    commission_amount: d.commission_amount,
    artist_amount: d.artist_amount,
    status: d.status,
    created_at: d.created_at,
    client: Array.isArray(d.client) ? d.client[0] : d.client,
    artist: Array.isArray(d.artist) ? d.artist[0] : d.artist,
    isClient: d.client?.id === user.id,
  }));

  return <DealsList deals={formatted} userId={user.id} />;
}

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="gradient-text">Сделки</span>
        </h1>
        <p className="mt-4 text-lg text-white/50">
          Безопасные сделки с комиссией {5}%
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-3xl bg-white/5"
              />
            ))}
          </div>
        }
      >
        <DealsContent />
      </Suspense>
    </div>
  );
}