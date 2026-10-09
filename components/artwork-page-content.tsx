// components/artwork-page-content.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Star, MessageCircle, Eye, Tag } from 'lucide-react';
import { LikeButton } from './like-button';
import { DeleteButton } from './delete-button';
import { getCategoryLabel } from '@/lib/constants';
import { ArtworkComments } from './artwork-comments';

type Artwork = {
  id: number;
  title: string;
  description: string | null;
  image_url: string;
  price: number;
  likes_count: number;
  views_count: number;
  category: string;
  tags: string[] | null;
  created_at: string;
  is_liked?: boolean;
  artist: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    is_sponsor: boolean;
    price_range: string | null;
  };
};

type SimilarArtwork = {
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

export function ArtworkPageContent({
  artwork,
  similar,
  userId,
}: {
  artwork: Artwork;
  similar: SimilarArtwork[];
  userId: string;
}) {
  const isOwner = artwork.artist.id === userId;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Link
        href="/feed"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Назад в галактику
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 gap-10 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <div className="group relative">
            <div className="absolute inset-0 scale-95 rounded-3xl bg-gradient-to-br from-[#6C63FF]/40 to-[#4FD1C5]/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]">
              <img
                src={artwork.image_url}
                alt={artwork.title}
                className="h-auto w-full object-cover"
              />

              <div className="absolute bottom-4 right-4 z-10">
                <div className="rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">
                  <LikeButton
                    artworkId={artwork.id}
                    initialCount={artwork.likes_count}
                    initialIsLiked={artwork.is_liked || false}
                    size="lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {artwork.description && (
            <div className="mt-8">
              <h3 className="display-title mb-3 text-xl text-white">
                Описание
              </h3>
              <p className="whitespace-pre-wrap leading-relaxed text-white/60">
                {artwork.description}
              </p>
            </div>
          )}

          {artwork.tags && artwork.tags.length > 0 && (
            <div className="mt-8">
              <div className="mb-3 flex items-center gap-2 text-sm text-white/40">
                <Tag className="h-4 w-4" />
                Теги
              </div>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:border-[#6C63FF]/30 hover:text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
              {getCategoryLabel(artwork.category)}
            </span>
            {artwork.artist.is_sponsor && (
              <span className="flex items-center gap-1 rounded-full bg-yellow-400/95 px-3 py-1 text-xs font-medium text-black">
                <Star className="h-3 w-3 fill-current" />
                Спонсор
              </span>
            )}
          </div>

          <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
            {artwork.title}
          </h1>

          <div className="flex items-center gap-6 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              {artwork.likes_count}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {artwork.views_count}
            </span>
          </div>

          {artwork.price > 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-wider text-white/40">
                Цена от
              </div>
              <div className="gradient-text mt-1 text-4xl font-bold">
                {artwork.price.toLocaleString('ru-RU')}₽
              </div>

              {!isOwner && (
                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-3 font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6C63FF]/50">
                  <MessageCircle className="h-4 w-4" />
                  Написать автору
                </button>
              )}
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
            <div className="mb-4 text-xs uppercase tracking-wider text-white/40">
              Автор
            </div>
            <Link
              href={`/artist/${artwork.artist.username}`}
              className="group flex items-center gap-3"
            >
              {artwork.artist.avatar_url ? (
                <img
                  src={artwork.artist.avatar_url}
                  alt={artwork.artist.display_name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xl font-bold text-white">
                  {artwork.artist.display_name[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="truncate font-semibold text-white">
                    {artwork.artist.display_name}
                  </span>
                  {artwork.artist.is_sponsor && (
                    <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <div className="text-sm text-white/40">
                  @{artwork.artist.username}
                </div>
              </div>
            </Link>
            {artwork.artist.bio && (
              <p className="mt-4 line-clamp-3 text-sm text-white/50">
                {artwork.artist.bio}
              </p>
            )}
          </div>

          {isOwner && (
            <DeleteButton
              table="artworks"
              id={artwork.id}
              redirectTo="/feed"
              label="Удалить работу"
            />
          )}
        </div>
      </motion.div>
            {/* 🎯 Комментарии */}
      <ArtworkComments
        artworkId={artwork.id}
        artworkOwnerId={artwork.artist.id}
      />
      {similar.length > 0 && (
        <div className="mt-20">
          <h2 className="display-title mb-8 text-3xl font-bold text-white md:text-4xl">
            Похожие работы
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {similar.map((item) => (
              <Link
                key={item.id}
                href={`/artwork/${item.id}`}
                className="group block overflow-hidden rounded-2xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-[#6C63FF]/30"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-semibold transition group-hover:text-[#B794F6]">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="truncate text-white/40">
                      {item.artist.display_name}
                    </span>
                    {item.price > 0 && (
                      <span className="gradient-text font-bold">
                        от {item.price.toLocaleString('ru-RU')}₽
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}