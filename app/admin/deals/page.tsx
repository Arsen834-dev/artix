// app/admin/deals/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { AlertTriangle } from 'lucide-react';

async function DealsContent() {
  const supabase = await createClient();

  const { data: deals, error } = await supabase
    .from('deals')
    .select(`
      id, title, amount, status, created_at,
      client:profiles!deals_client_id_fkey (username, display_name),
      artist:profiles!deals_artist_id_fkey (username, display_name)
    `)
    .eq('status', 'disputed')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <p className="text-lg text-white/60">Споров нет</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {deals.map((d: any) => {
        const client = Array.isArray(d.client) ? d.client[0] : d.client;
        const artist = Array.isArray(d.artist) ? d.artist[0] : d.artist;

        return (
          <Link
            key={d.id}
            href={`/deals/${d.id}`}
            className="block rounded-2xl border border-red-500/30 bg-red-500/5 p-5 transition hover:border-red-500/50"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-xs uppercase tracking-wider text-red-400">
                Спор
              </span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-white">
              #{d.id} · {d.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/60">
              <span>
                Заказчик: <span className="text-white">{client?.display_name}</span>
              </span>
              <span>
                Художник: <span className="text-white">{artist?.display_name}</span>
              </span>
              <span>
                Сумма:{' '}
                <span className="text-[#4FD1C5]">
                  {d.amount.toLocaleString('ru-RU')}₽
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminDealsPage() {
  return (
    <div className="py-8">
      <h1 className="display-title mb-8 text-3xl font-bold text-white">
        Споры по сделкам
      </h1>
      <Suspense
        fallback={<div className="h-64 animate-pulse rounded-2xl bg-white/5" />}
      >
        <DealsContent />
      </Suspense>
    </div>
  );
}