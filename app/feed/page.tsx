import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ArtworkCardProps } from "@/components/artwork-card";
import { FeedMain } from "@/components/feeds/feed-main";

const CATEGORIES = [
  { slug: "all", label: "Все" },
  { slug: "portrait", label: "Портреты" },
  { slug: "fantasy", label: "Фэнтези" },
  { slug: "anime", label: "Аниме" },
  { slug: "illustration", label: "Иллюстрации" },
  { slug: "3d", label: "3D" },
  { slug: "pixel", label: "Пиксель-арт" },
  { slug: "scifi", label: "Sci-Fi" },
  { slug: "concept", label: "Концепт-арт" },
  { slug: "sketch", label: "Скетчи" },
  { slug: "nature", label: "Природа" },
  { slug: "architecture", label: "Архитектура" },
  { slug: "other", label: "Другое" },
];

async function FeedContent({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "all";

  const supabase = await createClient();
  let query = supabase
    .from("artworks")
    .select(`
      id, title, image_url, price, likes_count, category,
      artist:profiles!artworks_artist_id_fkey (username, display_name, avatar_url, is_sponsor)
    `)
    .order("created_at", { ascending: false });

  if (activeCategory !== "all") {
    query = query.eq("category", activeCategory);
  }

  const { data, error } = await query;

  if (error) {
    return <div className="py-20 text-center text-white/60">Ошибка загрузки 😢</div>;
  }

  const artworks: ArtworkCardProps[] = (data || []).map((item: any) => ({
    id: item.id,
    title: item.title,
    image_url: item.image_url,
    price: item.price || 0,
    likes_count: item.likes_count || 0,
    category: item.category,
    artist: Array.isArray(item.artist) ? item.artist[0] : item.artist,
  }));

  return <FeedMain artworks={artworks} />;
}

async function CategoryFilters({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "all";

  return (
    <div className="sticky top-16 z-40 border-b border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <a
                key={cat.slug}
                href={cat.slug === "all" ? "/feed" : `/feed?category=${cat.slug}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-[#6C63FF] to-[#B794F6] text-white shadow-lg shadow-[#6C63FF]/30"
                    : "border border-white/5 bg-white/5 text-white/60 hover:border-[#6C63FF]/30 hover:bg-white/10 hover:text-white"
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

function FeedSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-white/5" />
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

export default function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<FiltersSkeleton />}>
        <CategoryFilters searchParams={searchParams} />
      </Suspense>

      <div className="container mx-auto px-4 pt-12 pb-8">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="gradient-text">Галактика</span>{" "}
          <span className="text-white">искусств</span>
        </h1>
        <p className="mt-3 text-white/50">
          Все работы художников со всей вселенной
        </p>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <Suspense fallback={<FeedSkeleton />}>
          <FeedContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}