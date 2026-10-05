// app/service/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ServicePageContent } from '@/components/service-page-content';

async function ServiceContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: service, error } = await supabase
    .from('services')
    .select(`
      id, title, description, image_url, category,
      price, price_type, price_to, delivery_days, tags, views_count, created_at,
      artist:profiles!services_artist_id_fkey (
        id, username, display_name, avatar_url, bio, is_sponsor, price_range
      )
    `)
    .eq('id', id)
    .single();

  if (error || !service) {
    notFound();
  }

  // 🎯 Честный просмотр
  if (user) {
    await supabase.rpc('register_service_view', {
      p_service_id: parseInt(id),
    });
  }

  const artist = Array.isArray(service.artist)
    ? service.artist[0]
    : service.artist;

  const { data: similar } = await supabase
    .from('services')
    .select(`
      id, title, image_url, price, price_type, price_to, category,
      artist:profiles!services_artist_id_fkey (username, display_name, avatar_url, is_sponsor)
    `)
    .eq('category', service.category)
    .eq('is_active', true)
    .neq('id', service.id)
    .limit(3);

  return (
    <ServicePageContent
      service={{
        ...service,
        artist,
      }}
      similar={(similar || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        price: item.price,
        price_type: item.price_type,
        price_to: item.price_to,
        category: item.category,
        artist: Array.isArray(item.artist) ? item.artist[0] : item.artist,
      }))}
      userId={user?.id || ''}
    />
  );
}

function ServiceSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="aspect-video animate-pulse rounded-3xl bg-white/5 lg:col-span-2" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-white/5" />
          <div className="h-32 animate-pulse rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ServiceSkeleton />}>
      <ServiceContent id={id} />
    </Suspense>
  );
}