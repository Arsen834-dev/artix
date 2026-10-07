// components/report-modal.tsx
'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { X, AlertTriangle, Loader2, Check } from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

type TargetType = 'artwork' | 'service' | 'order' | 'profile' | 'response' | 'message';

const REASONS = [
  { key: 'spam', label: 'Спам', description: 'Реклама, накрутка, мусор' },
  { key: 'abuse', label: 'Оскорбления', description: 'Мат, угрозы, хамство' },
  { key: 'nsfw', label: '18+ контент', description: 'NSFW, шок-контент' },
  { key: 'plagiarism', label: 'Плагиат', description: 'Чужие работы' },
  { key: 'fraud', label: 'Мошенничество', description: 'Обман, скам' },
  { key: 'other', label: 'Другое', description: 'Опиши в комментарии' },
];

export function ReportModal({
  targetType,
  targetId,
  targetName,
  onClose,
}: {
  targetType: TargetType;
  targetId: number | string;
  targetName: string;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string>('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useBodyScrollLock(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason) {
      setError('Выбери причину');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Нужно войти');
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from('reports').insert({
        reporter_id: user.id,
        target_type: targetType,
        target_id: String(targetId),        
        reason,
        comment: comment.trim() || null,
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
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
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/20 blur-[100px]" />

          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {success ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400 shadow-2xl shadow-green-500/40">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h2 className="display-title text-2xl font-bold text-white">
                Жалоба отправлена
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Админ рассмотрит её в ближайшее время
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
                  <AlertTriangle className="h-7 w-7 text-red-400" />
                </div>
                <h2 className="display-title text-xl font-bold text-white">
                  Пожаловаться
                </h2>
                <p className="mt-1 line-clamp-1 text-xs text-white/50">
                  {targetName}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Причина *
                  </label>
                  <div className="space-y-1.5">
                    {REASONS.map((r) => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setReason(r.key)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                          reason === r.key
                            ? 'border-red-500/50 bg-red-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                        }`}
                      >
                        <div
                          className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition ${
                            reason === r.key
                              ? 'border-red-400 bg-red-400'
                              : 'border-white/20'
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white">
                            {r.label}
                          </div>
                          <div className="text-xs text-white/40">
                            {r.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Комментарий
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Опиши проблему подробнее..."
                    rows={3}
                    maxLength={500}
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !reason}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-3.5 font-semibold text-white shadow-2xl shadow-red-500/30 transition hover:scale-[1.02] disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Отправить жалобу
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