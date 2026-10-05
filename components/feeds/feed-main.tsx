// components/feeds/feed-main.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { LikeButton } from '../like-button';
import { useRef, useState } from 'react';
import { getCategoryLabel } from '@/lib/constants';

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

function MasonryCard({
  artwork,
  index,
}: {
  artwork: ArtworkCardProps;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * -8;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05 }}
      className="mb-5 break-inside-avoid"
    >
      <Link href={`/artwork/${artwork.id}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transition: 'transform 0.15s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-[#6C63FF]/20"
        >
          <div className="relative w-full overflow-hidden">
            <img
              src={artwork.image_url}
              alt={artwork.title}
              className="h-auto w-full object-cover"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />

            <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-md">
              {getCategoryLabel(artwork.category)}
            </span>

            {artwork.artist.is_sponsor && (
              <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg shadow-yellow-400/40">
                <Star className="h-2.5 w-2.5 fill-current" />
                PRO
              </span>
            )}

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

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
        </div>
      </Link>
    </motion.div>
  );
}

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