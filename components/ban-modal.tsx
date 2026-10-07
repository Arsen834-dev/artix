// components/ban-modal.tsx
'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { X, Ban, Loader2, Check } from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

const DURATIONS = [
  { key: '1', label: '1 день', days: 1 },
  { key: '7', label: '7 дней', days: 7 },
  { key: '30', label: '30 дней', days: 30 },
  { key: 'forever', label: 'Навсегда', days: null },
];

export function BanModal({
  userId,
  username,
  onClose,
}: {
  userId: string;
  username: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState<string>('7');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useBodyScrollLock(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason.trim()) {
      setError('Укажи причину');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const dur = DURATIONS.find((d) => d.key === duration);

    const { error: rpcError } = await supabase.rpc('ban_user', {
      p_user_id: userId,
      p_reason: reason.trim(),
      p_days: dur?.days ?? null,
    });

    if (rpcError) {
      setError(rpcError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.refresh();
      onClose();
    }, 1500);
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-md"
        onClick={onClose}
        data-lenis-prevent
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {success ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="display-title text-2xl font-bold text-white">
                Забанен
              </h2>
              <p className="mt-2 text-sm text-white/60">@{username}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
                  <Ban className="h-7 w-7 text-red-400" />
                </div>
                <h2 className="display-title text-xl font-bold text-white">
                  Забанить
                </h2>
                <p className="mt-1 text-sm text-white/50">@{username}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Причина *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Опиши причину бана..."
                    rows={3}
                    required
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Срок
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATIONS.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        onClick={() => setDuration(d.key)}
                        className={`rounded-xl border px-3 py-2 text-sm transition ${
                          duration === d.key
                            ? 'border-red-500/50 bg-red-500/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
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
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3.5 font-semibold text-white shadow-2xl shadow-red-500/30 transition hover:scale-[1.02] disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Бан...
                    </>
                  ) : (
                    <>
                      <Ban className="h-4 w-4" />
                      Забанить
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}