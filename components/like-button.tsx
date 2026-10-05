'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRequireAuth } from './auth-provider';

export function LikeButton({
  artworkId,
  initialCount,
  initialIsLiked = false,
  size = 'md',
  showCount = true,
}: {
  artworkId: number;
  initialCount: number;
  initialIsLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const requireAuth = useRequireAuth();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🎯 Если не залогинен — модалка
    if (!userId) {
      requireAuth(() => {}, 'лайки');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    const supabase = createClient();
    const wasLiked = isLiked;

    setIsLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));

    if (!wasLiked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
    }

    (async () => {
      try {
        if (wasLiked) {
          await supabase
            .from('likes')
            .delete()
            .eq('user_id', userId)
            .eq('artwork_id', artworkId);
        } else {
          await supabase.from('likes').insert({
            user_id: userId,
            artwork_id: artworkId,
          });
        }
      } catch (err) {
        setIsLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : c - 1));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`group relative flex items-center gap-1.5 ${textSizes[size]} transition-all ${
        isLiked ? 'text-red-500' : 'text-white/70 hover:text-red-400'
      }`}
      aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
    >
      <AnimatePresence>
        {showBurst && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="h-4 w-4 rounded-full border-2 border-red-500" />
            </motion.div>

            {[...Array(6)].map((_, i) => {
              const angle = (i * 360) / 6;
              const rad = (angle * Math.PI) / 180;
              const distance = 24;
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(rad) * distance,
                    y: Math.sin(rad) * distance,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      <motion.div
        animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <Heart
          className={`${sizeClasses[size]} transition-all ${
            isLiked ? 'fill-red-500' : 'group-hover:fill-red-400/30'
          }`}
        />
      </motion.div>

      {showCount && <span className="font-medium">{count}</span>}
    </button>
  );
}