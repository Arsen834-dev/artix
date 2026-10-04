import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ServicesGrid } from '@/components/services-grid';

const CATEGORIES = [
  { slug: 'all', label: 'Все' },
  { slug: 'portrait', label: 'Портреты' },
  { slug: 'fantasy', label: 'Фэнтези' },
  { slug: 'anime', label: 'Аниме' },
  { slug: 'illustration', label: 'Иллюстрации' },
  { slug: '3d', label: '3D' },
  { slug: 'pixel', label: 'Пиксель-арт' },
  { slug: 'scifi', label: 'Sci-Fi' },
  { slug: 'concept', label: 'Концепт-арт' },
  { slug: 'sketch', label: 'Скетчи' },
  { slug: 'nature', label: 'Природа' },
  { slug: 'other', label: 'Другое' },
];

type Service = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  price: number;
  price_type: string;
  price_to: number | null;
  delivery_days: number;
  tags: string[] | null;
  created_at: string;
  artist: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

async function ServicesContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  const supabase = await createClient();

  let query = supabase
    .from('services')
    .select(`
      id, title, description, image_url, category,
      price, price_type, price_to, delivery_days, tags, created_at,
      artist:profiles!services_artist_id_fkey (username, display_name, avatar_url, is_sponsor)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Services error:', error);
    return (
      <div className="py-20 text-center text-white/60">
        Ошибка загрузки 😢
      </div>
    );
  }

  const services: Service[] = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    category: item.category,
    price: item.price,
    price_type: item.price_type || 'from',
    price_to: item.price_to,
    delivery_days: item.delivery_days || 3,
    tags: item.tags,
    created_at: item.created_at,
    artist: Array.isArray(item.artist) ? item.artist[0] : item.artist,
  }));

  return <ServicesGrid services={services} />;
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
                href={cat.slug === 'all' ? '/services' : `/services?category=${cat.slug}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#B794F6] text-white shadow-lg shadow-[#6C63FF]/30'
                    : 'border border-white/5 bg-white/5 text-white/60 hover:border-[#6C63FF]/30 hover:bg-white/10 hover:text-white'
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

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-96 animate-pulse rounded-3xl bg-white/5" />
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
            <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<FiltersSkeleton />}>
        <CategoryFilters searchParams={searchParams} />
      </Suspense>

      {/* Заголовок */}
      <div className="container mx-auto px-4 pb-8 pt-12">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="gradient-text">Услуги</span>{' '}
          <span className="text-white">художников</span>
        </h1>
        <p className="mt-3 max-w-2xl text-white/50">
          Закажи арт у лучших художников галактики. Выбери стиль, цену и срок.
        </p>
      </div>

      {/* Лента */}
      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<ServicesSkeleton />}>
          <ServicesContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}