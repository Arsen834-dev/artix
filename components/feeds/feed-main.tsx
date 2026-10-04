'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Eye, ArrowUpRight } from 'lucide-react';
import { LikeButton } from '../like-button';

export type ArtworkCardProps = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  likes_count: number;
  category: string;
  views_count?: number;
  is_liked?: boolean;
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
// КАРТОЧКА РАБОТЫ — НОВЫЙ ДИЗАЙН
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
      className="group mb-5 break-inside-avoid"
    >
      <Link href={`/artwork/${artwork.id}`} className="block">
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/30">
          {/* КАРТИНКА */}
          <div className="relative w-full overflow-hidden">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />

            {/* 🎯 ГРАДИЕНТ СВЕРХУ для читаемости бейджей */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

            {/* 🎯 ГРАДИЕНТ СНИЗУ при hover */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* БЕЙДЖ КАТЕГОРИИ — сверху слева */}
            <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
              {CATEGORY_LABELS[artwork.category] || artwork.category}
            </span>

            {/* БЕЙДЖ PRO — сверху справа */}
            {artwork.artist.is_sponsor && (
              <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg shadow-yellow-400/40">
                <Star className="h-2.5 w-2.5 fill-current" />
                PRO
              </span>
            )}

            {/* 🎯 ЛАЙК — правый нижний угол */}
            <div className="pointer-events-auto absolute bottom-3 right-3 z-10">
              <div className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 backdrop-blur-md">
                <LikeButton
                  artworkId={artwork.id}
                  initialCount={artwork.likes_count}
                  initialIsLiked={artwork.is_liked || false}
                  size="sm"
                />
              </div>
            </div>

            {/* ИНФО ПРИ HOVER — снизу */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-6 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <h3 className="line-clamp-1 text-base font-bold text-white">
                {artwork.title}
              </h3>
              <div className="mt-2 flex items-center gap-2">
                {artwork.artist.avatar_url ? (
                  <img
                    src={artwork.artist.avatar_url}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover ring-2 ring-white/30"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6]" />
                )}
                <span className="text-xs text-white/70">
                  {artwork.artist.display_name}
                </span>
                {artwork.artist.is_sponsor && (
                  <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                )}
                {artwork.price > 0 && (
                  <span className="ml-auto text-xs font-bold text-[#B794F6]">
                    от {artwork.price.toLocaleString('ru-RU')}₽
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 🎯 ПОДПИСЬ ПОД КАРТИНКОЙ — минимальная, для мобилы */}
          <div className="p-3 md:hidden">
            <h3 className="line-clamp-1 text-sm font-semibold text-white">
              {artwork.title}
            </h3>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-white/50">
                {artwork.artist.display_name}
              </span>
              {artwork.price > 0 && (
                <span className="font-bold text-[#B794F6]">
                  {artwork.price.toLocaleString('ru-RU')}₽
                </span>
              )}
            </div>
          </div>

          {/* 🎯 Стрелка при hover */}
          <div className="pointer-events-none absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4 text-white" />
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
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <div className="mb-4 text-6xl">🎨</div>
        <p className="text-xl text-white/60">Пока нет работ</p>
        <p className="mt-2 text-sm text-white/40">
          Стань первым, кто опубликует работу!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {artworks.map((artwork, i) => (
        <MasonryCard key={artwork.id} artwork={artwork} index={i} />
      ))}
    </div>
  );
}