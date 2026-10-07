// components/feed-content.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SearchBar } from './search-bar';
import { FiltersPanel, type Filters } from './filters-panel';
import { FeedMain, type ArtworkCardProps } from './feeds/feed-main';

const PAGE_SIZE = 20;

export function FeedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎯 Инициализация из URL
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<Filters>({
    category: searchParams.get('category') || 'all',
    priceMin: searchParams.get('price_min') || '',
    priceMax: searchParams.get('price_max') || '',
    sort: (searchParams.get('sort') as any) || 'new',
  });

  const [artworks, setArtworks] = useState<ArtworkCardProps[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 🎯 Загрузка первой страницы при изменении query/filters
  const load = useCallback(
    async (offset = 0) => {
      const supabase = createClient();

      if (offset === 0) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('search_artworks', {
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

      const mapped: ArtworkCardProps[] = rows.map((r: any) => ({
        id: r.id,
        title: r.title,
        image_url: r.image_url,
        price: r.price || 0,
        likes_count: r.likes_count || 0,
        category: r.category,
        artist: {
          username: r.artist_username,
          display_name: r.artist_display_name,
          avatar_url: r.artist_avatar_url,
          is_sponsor: r.artist_is_sponsor,
        },
      }));

      if (offset === 0) {
        setArtworks(mapped);
        setTotal(rows[0]?.total_count ?? 0);
      } else {
        setArtworks((prev) => [...prev, ...mapped]);
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [query, filters],
  );

  // 🎯 Обновляем URL при смене query/filters (чтобы можно было шарить ссылку)
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.priceMin) params.set('price_min', filters.priceMin);
    if (filters.priceMax) params.set('price_max', filters.priceMax);
    if (filters.sort !== 'new') params.set('sort', filters.sort);

    const newUrl = `/feed${params.toString() ? `?${params}` : ''}`;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters]);

  // 🎯 Первая загрузка + при смене фильтров
  useEffect(() => {
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, filters.category, filters.priceMin, filters.priceMax, filters.sort]);

  // 🎯 Бесконечный скролл
  useEffect(() => {
    if (isLoading || isLoadingMore) return;
    if (artworks.length >= total) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load(artworks.length);
        }
      },
      { rootMargin: '300px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, isLoadingMore, artworks.length, total, load]);

  return (
    <div>
      {/* Поиск + фильтры */}
      <div className="sticky top-[60px] z-40 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl md:top-[64px]">
        <div className="container mx-auto space-y-3 px-4 py-3">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Поиск работ по названию, описанию, тегам..."
          />
          <FiltersPanel filters={filters} onChange={setFilters} priceLabel="Цена" />
        </div>
      </div>

      {/* Контент */}
      <div className="container mx-auto px-4 pb-16 pt-8">
        {isLoading ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="mb-5 break-inside-avoid"
                style={{ height: `${200 + (i * 30) % 200}px` }}
              >
                <div className="h-full animate-pulse rounded-3xl bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center text-red-400">
            Ошибка: {error}
          </div>
        ) : artworks.length === 0 ? (
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

            <FeedMain artworks={artworks} />

            {/* Триггер загрузки */}
            {artworks.length < total && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-white/40">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Загружаем...
                  </div>
                ) : (
                  <button
                    onClick={() => load(artworks.length)}
                    className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    Загрузить ещё
                  </button>
                )}
              </div>
            )}

            {artworks.length >= total && total > PAGE_SIZE && (
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