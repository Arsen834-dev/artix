import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ArtistPageContent } from '@/components/artist-page-content';

async function ArtistContent({ username }: { username: string }) {
  const supabase = await createClient();

  // Профиль
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(`
      id, username, display_name, avatar_url, bio, role, is_sponsor, price_range, created_at,
      cover_url, telegram_url, instagram_url, vk_url, behance_url, artstation_url, website_url,
      boosty_url, discord_url, tiktok_url
    `)
    .eq('username', username)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // Работы
  const { data: artworks } = await supabase
    .from('artworks')
    .select('id, title, image_url, price, likes_count, category')
    .eq('artist_id', profile.id)
    .order('created_at', { ascending: false });

  // Услуги
  const { data: services } = await supabase
    .from('services')
    .select('id, title, image_url, price, price_type, price_to, category, delivery_days, tags')
    .eq('artist_id', profile.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Заказы
  const { data: orders } = await supabase
    .from('orders')
    .select('id, title, image_url, budget, budget_type, budget_to, category, deadline_days, tags, status, responses_count, created_at')
    .eq('client_id', profile.id)
    .order('created_at', { ascending: false });

  // Отзывы
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at,
      author:profiles!reviews_author_id_fkey (id, username, display_name, avatar_url, is_sponsor)
    `)
    .eq('target_id', profile.id)
    .order('created_at', { ascending: false });

  // Средний рейтинг
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  // Статистика
  const totalLikes = (artworks || []).reduce(
    (sum, art) => sum + (art.likes_count || 0),
    0
  );

  return (
    <ArtistPageContent
      profile={profile}
      artworks={(artworks || []).map((art) => ({
        id: art.id,
        title: art.title,
        image_url: art.image_url,
        price: art.price || 0,
        likes_count: art.likes_count || 0,
        category: art.category,
      }))}
      services={(services || []).map((s) => ({
        id: s.id,
        title: s.title,
        image_url: s.image_url,
        price: s.price,
        price_type: s.price_type || 'from',
        price_to: s.price_to,
        category: s.category,
        delivery_days: s.delivery_days || 3,
        tags: s.tags,
      }))}
      orders={(orders || []).map((o) => ({
        id: o.id,
        title: o.title,
        image_url: o.image_url,
        budget: o.budget,
        budget_type: o.budget_type || 'up_to',
        budget_to: o.budget_to,
        category: o.category,
        deadline_days: o.deadline_days,
        tags: o.tags,
        status: o.status,
        responses_count: o.responses_count || 0,
        created_at: o.created_at,
      }))}
      reviews={(reviews || []).map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        author: Array.isArray(r.author) ? r.author[0] : r.author,
      }))}
      avgRating={avgRating}
      totalLikes={totalLikes}
    />
  );
}

function ArtistSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 h-64 animate-pulse rounded-3xl bg-white/5" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <Suspense fallback={<ArtistSkeleton />}>
      <ArtistContent username={username} />
    </Suspense>
  );
}