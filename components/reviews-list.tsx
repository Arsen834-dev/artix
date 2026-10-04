'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MessageSquare } from 'lucide-react';

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  author: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <MessageSquare className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg text-white/60">Пока нет отзывов</p>
        <p className="mt-2 text-sm text-white/40">
          Отзывы появятся после завершённых сделок
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review, i) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-3xl border border-white/5 bg-[#16161f]/60 p-6 backdrop-blur-sm"
        >
          {/* Автор + звёзды */}
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/artist/${review.author.username}`}
              className="group flex items-center gap-3"
            >
              {review.author.avatar_url ? (
                <img
                  src={review.author.avatar_url}
                  alt={review.author.display_name}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-sm font-bold text-white">
                  {review.author.display_name[0]?.toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-white transition group-hover:text-[#B794F6]">
                    {review.author.display_name}
                  </span>
                  {review.author.is_sponsor && (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                <span className="text-xs text-white/40">
                  @{review.author.username}
                </span>
              </div>
            </Link>

            {/* Звёзды */}
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-white/15'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Текст */}
          {review.comment && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-white/70">
              {review.comment}
            </p>
          )}

          {/* Дата */}
          <div className="mt-4 text-xs text-white/30">
            {new Date(review.created_at).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}