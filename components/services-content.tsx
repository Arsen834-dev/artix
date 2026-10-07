// components/services-content.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchBar } from './search-bar';
import { FiltersPanel, type Filters } from './filters-panel';
import { ServicesGrid } from './services-grid';

const PAGE_SIZE = 20;

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

export function ServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') || 'all',
    priceMin: searchParams.get('price_min') || '',
    priceMax: searchParams.get('price_max') || '',
    sort: (searchParams.get('sort') as any) || 'new',
  });

  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  const load = useCallback(
    async (offset = 0) => {
      const supabase = createClient();

      if (offset === 0) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('search_services', {
        p_query: query || null,
        p_category: filters.category === 'all' ? null : filters.category,
        p_price_min: filters.priceMin ? parseInt(filters.priceMin) : null,
        p_price_max: filters.priceMax ? parseInt(filters.priceMax) : null,
        p_sort: filters.sort,
        p_limit: PAGE_SIZE,
        p_offset: offset,
      });

      if (rpcError) {
        console.error(rpcError);
        setError(rpcError.message);
        setIsLoading(false);
        setIsLoadingMore(false);
        return;
      }

      const rows = data || [];

      const mapped: Service[] = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        image_url: r.image_url,
        category: r.category,
        price: r.price,
        price_type: r.price_type || 'from',
        price_to: r.price_to,
        delivery_days: r.delivery_days || 3,
        tags: r.tags,
        created_at: r.created_at,
        artist: {
          username: r.artist_username,
          display_name: r.artist_display_name,
          avatar_url: r.artist_avatar_url,
          is_sponsor: r.artist_is_sponsor,
        },
      }));

      if (offset === 0) {
        setServices(mapped);
        setTotal(rows[0]?.total_count ?? 0);
      } else {
        setServices((prev) => [...prev, ...mapped]);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [query, filters],
  );

  // Обновляем URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.priceMin) params.set('price_min', filters.priceMin);
    if (filters.priceMax) params.set('price_max', filters.priceMax);
    if (filters.sort !== 'new') params.set('sort', filters.sort);

    const newUrl = `/services${params.toString() ? `?${params}` : ''}`;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.category, filters.priceMin, filters.priceMax, filters.sort]);

  // Бесконечный скролл
  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    if (services.length >= total) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load(services.length);
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, services.length, total, load]);

  return (
    <div>
      <div className="sticky top-16 z-40 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="container mx-auto space-y-3 px-4 py-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Поиск услуг по названию, описанию, тегам..."
          />
          <FiltersPanel
            filters={filters}
            onChange={setFilters}
            priceLabel="Цена"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 pt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-96 animate-pulse rounded-3xl bg-white/5"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-400">Ошибка: {error}</div>
        ) : services.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
            <div className="mb-4 text-6xl">🔍</div>
            <p className="text-xl text-white/60">Ничего не найдено</p>
            <p className="mt-2 text-sm text-white/40">
              Попробуй изменить запрос или фильтры
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 text-sm text-white/40">
              Найдено: <span className="text-white">{total}</span>
            </div>

            <ServicesGrid services={services} />

            {services.length < total && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Загружаем...
                  </div>
                ) : (
                  <button
                    onClick={() => load(services.length)}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Загрузить ещё
                  </button>
                )}
              </div>
            )}

            {services.length >= total && total > PAGE_SIZE && (
              <div className="mt-8 text-center text-sm text-white/30">
                Это всё
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}