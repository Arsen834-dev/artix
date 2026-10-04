'use client';

import Link from "next/link";
import { Heart, Star } from "lucide-react";

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
  portrait: "Портреты",
  fantasy: "Фэнтези",
  anime: "Аниме",
  illustration: "Иллюстрации",
  "3d": "3D",
  pixel: "Пиксель-арт",
  scifi: "Sci-Fi",
  concept: "Концепт-арт",
  sketch: "Скетчи",
  nature: "Природа",
  architecture: "Архитектура",
  other: "Другое",
};

export function ArtworkCard({ artwork }: { artwork: ArtworkCardProps }) {
  return (
    <Link
      href={`/artwork/${artwork.id}`}
      className="group block mb-4 break-inside-avoid"
    >
      <div className="relative overflow-hidden rounded-xl bg-muted transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        {/* Картинка */}
        <div className="relative w-full">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>

        {/* Лайк поверх картинки */}
        <button
          className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
          onClick={(e) => {
            e.preventDefault();
            // TODO: лайк (позже)
          }}
        >
          <Heart className="h-3.5 w-3.5" />
          {artwork.likes_count}
        </button>
      </div>

      {/* Информация снизу */}
      <div className="mt-2 px-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
          {artwork.title}
        </h3>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          {artwork.artist.avatar_url && (
            <img
              src={artwork.artist.avatar_url}
              alt={artwork.artist.display_name}
              className="h-4 w-4 rounded-full object-cover"
            />
          )}
          <span className="line-clamp-1">
            {artwork.artist.display_name}
          </span>
          {artwork.artist.is_sponsor && (
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          )}
        </div>

        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {CATEGORY_LABELS[artwork.category] || artwork.category}
          </span>
          {artwork.price > 0 && (
            <span className="font-medium text-[#6C63FF]">
              от {artwork.price.toLocaleString("ru-RU")}₽
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}