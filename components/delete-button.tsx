// components/delete-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

type Table = 'artworks' | 'services' | 'orders';

export function DeleteButton({
  table,
  id,
  redirectTo,
  className = '',
  label = 'Удалить',
}: {
  table: Table;
  id: number;
  redirectTo: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useBodyScrollLock(showConfirm);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // 🎯 FIX: router.push + refresh вместо window.location.href
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка удаления');
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className={
          className ||
          'flex w-full items-center justify-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20'
        }
      >
        <Trash2 className="h-4 w-4" />
        {label}
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => !isDeleting && setShowConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-[#16161f]"
            >
              <button
                onClick={() => !isDeleting && setShowConfirm(false)}
                disabled={isDeleting}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>

                <h2 className="display-title text-2xl font-bold text-white">
                  Удалить навсегда?
                </h2>
                <p className="mt-3 text-sm text-white/60">
                  Это действие нельзя отменить. Данные будут удалены из базы
                  навсегда.
                </p>

                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Удаляем...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Удалить
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}