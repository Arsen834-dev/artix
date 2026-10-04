'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { X, Star, Loader2, Check } from 'lucide-react';

export function ReviewModal({
  dealId,
  targetId,
  targetName,
  onClose,
}: {
  dealId?: number;
  targetId: string;
  targetName: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Нужно войти');
      setIsLoading(false);
      return;
    }

    if (user.id === targetId) {
      setError('Нельзя оставить отзыв себе');
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('reviews').insert({
        author_id: user.id,
        target_id: targetId,
        deal_id: dealId || null,
        rating,
        comment: comment.trim() || null,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-[#16161f] p-10 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400 shadow-2xl shadow-green-500/40">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="display-title text-2xl font-bold text-white">
              Отзыв отправлен!
            </h2>
            <p className="mt-2 text-sm text-white/60">Спасибо за фидбек 🙏</p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]"
        >
          {/* Заголовок */}
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div>
              <h2 className="display-title text-xl font-bold text-white">
                Оставить отзыв
              </h2>
              <p className="mt-1 text-sm text-white/50">{targetName}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Звёзды */}
            <div className="text-center">
              <div className="mb-3 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 transition-all ${
                          isActive
                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                            : 'text-white/20'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-sm font-medium text-white">
                {rating === 5 && 'Отлично! ⭐'}
                {rating === 4 && 'Хорошо'}
                {rating === 3 && 'Нормально'}
                {rating === 2 && 'Плохо'}
                {rating === 1 && 'Ужасно'}
              </div>
            </div>

            {/* Комментарий */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Комментарий
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Расскажи о своём опыте..."
                rows={4}
                maxLength={500}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
              <div className="mt-1 text-right text-xs text-white/30">
                {comment.length}/500
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black transition-all duration-500 hover:scale-[1.02] disabled:opacity-40"
            >
              <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-white">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Star className="h-5 w-5" />
                    Отправить отзыв
                  </>
                )}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}