// app/artwork/[id]/page.tsx
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ArtworkPageContent } from '@/components/artwork-page-content';

async function ArtworkContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Работа
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      id, title, description, image_url, price, likes_count, views_count,
      category, tags, created_at,
      artist:profiles!artworks_artist_id_fkey (
        id, username, display_name, avatar_url, bio, is_sponsor, price_range
      )
    `)
    .eq('id', id)
    .single();

  if (error || !artwork) {
    notFound();
  }

  // 🎯 Честный просмотр: только для залогиненных, только один раз
  if (user) {
    await supabase.rpc('register_artwork_view', {
      p_artwork_id: parseInt(id),
    });
  }

  const artist = Array.isArray(artwork.artist)
    ? artwork.artist[0]
    : artwork.artist;

  // Проверяем лайк
  let isLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('artwork_id', id)
      .maybeSingle();
    isLiked = !!like;
  }

  // Похожие
  const { data: similar } = await supabase
    .from('artworks')
    .select(`
      id, title, image_url, price, likes_count, category,
      artist:profiles!artworks_artist_id_fkey (username, display_name, avatar_url, is_sponsor)
    `)
    .eq('category', artwork.category)
    .neq('id', artwork.id)
    .limit(4);

  return (
    <ArtworkPageContent
      artwork={{
        ...artwork,
        artist,
        is_liked: isLiked,
      }}
      similar={(similar || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        image_url: item.image_url,
        price: item.price || 0,
        likes_count: item.likes_count || 0,
        category: item.category,
        artist: Array.isArray(item.artist) ? item.artist[0] : item.artist,
      }))}
      userId={user?.id || ''}
    />
  );
}

function ArtworkSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="h-8 w-32 animate-pulse rounded bg-white/5" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="aspect-[4/5] w-full animate-pulse rounded-3xl bg-white/5 lg:col-span-2" />
        <div className="space-y-6">
          <div className="h-12 w-3/4 animate-pulse rounded bg-white/5" />
          <div className="h-20 w-full animate-pulse rounded bg-white/5" />
          <div className="h-40 w-full animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<ArtworkSkeleton />}>
      <ArtworkContent id={id} />
    </Suspense>
  );
}