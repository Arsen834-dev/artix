'use client';

import Link from 'next/link';
import { Heart, Star, MessageCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export type ArtworkCardProps = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  likes_count: number;
  category: string;
  artist: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

const CATEGORY_LABELS: Record<string, string> = {
  portrait: 'Портреты',
  fantasy: 'Фэнтези',
  anime: 'Аниме',
  illustration: 'Иллюстрации',
  '3d': '3D',
  pixel: 'Пиксель-арт',
  scifi: 'Sci-Fi',
  concept: 'Концепт-арт',
  sketch: 'Скетчи',
  nature: 'Природа',
  architecture: 'Архитектура',
  other: 'Другое',
};

// ============================================
// КАРТОЧКА РАБОТЫ — MASONRY
// ============================================
function MasonryCard({
  artwork,
  index,
}: {
  artwork: ArtworkCardProps;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="mb-4 break-inside-avoid"
    >
      <Link href={`/artwork/${artwork.id}`}>
        <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/20">
          {/* 🎯 КАРТИНКА БЕЗ ОБРЕЗКИ — сохраняет пропорции */}
          <div className="relative w-full overflow-hidden">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* Градиент при hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Бейдж категории */}
            <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              {CATEGORY_LABELS[artwork.category] || artwork.category}
            </span>

            {/* Бейдж спонсора */}
            {artwork.artist.is_sponsor && (
              <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-400/30">
                <Star className="h-3 w-3 fill-current" />
                PRO
              </span>
            )}

            {/* Инфо при hover */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="line-clamp-2 text-base font-bold text-white">
                {artwork.title}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {artwork.artist.avatar_url ? (
                    <img
                      src={artwork.artist.avatar_url}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-2 ring-white/20"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6]" />
                  )}
                  <span className="text-xs text-white/70">
                    {artwork.artist.display_name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {artwork.likes_count}
                  </span>
                  {artwork.price > 0 && (
                    <span className="font-bold text-[#B794F6]">
                      от {artwork.price.toLocaleString('ru-RU')}₽
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// ГЛАВНАЯ СЕТКА
// ============================================
export function FeedMain({ artworks }: { artworks: ArtworkCardProps[] }) {
  if (artworks.length === 0) {
    return (
      <div className="py-20 text-center text-white/60">
        <p className="text-xl">Пока нет работ 😢</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
      {artworks.map((artwork, i) => (
        <MasonryCard key={artwork.id} artwork={artwork} index={i} />
      ))}
    </div>
  );
}