// components/deal-modal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  X,
  RussianRuble,
  Info,
  Loader2,
  Check,
  Handshake,
} from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

type DealModalProps = {
  artistId: string;
  artistName: string;
  serviceId?: number;
  orderId?: number;
  defaultAmount?: number;
  defaultTitle?: string;
  onClose: () => void;
};

export function DealModal({
  artistId,
  artistName,
  serviceId,
  orderId,
  defaultAmount = 5000,
  defaultTitle = '',
  onClose,
}: DealModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🎯 Хук — на верхнем уровне
  useBodyScrollLock(true);

  const amountNum = parseInt(amount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      setError('Введи название сделки');
      setIsLoading(false);
      return;
    }

    if (amountNum < 0) {
      setError('Сумма не может быть отрицательной');
      setIsLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Нужно войти');
      setIsLoading(false);
      return;
    }

    if (user.id === artistId) {
      setError('Нельзя создать сделку с самим собой');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('deals')
        .insert({
          client_id: user.id,
          artist_id: artistId,
          service_id: serviceId || null,
          order_id: orderId || null,
          title: title.trim(),
          description: description.trim() || null,
          amount: amountNum,
          commission_percent: 0,
          commission_amount: 0,
          artist_amount: amountNum,
          status: 'pending',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/deals/${data.id}`);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка создания');
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
              Сделка создана!
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Перенаправляем на страницу сделки...
            </p>
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
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]"
        >
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div>
              <h2 className="display-title text-xl font-bold text-white">
                Создать сделку
              </h2>
              <p className="mt-1 text-sm text-white/50">с {artistName}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Название сделки *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Арт дракона для обложки"
                maxLength={100}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Описание
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Что нужно сделать, детали, референсы..."
                rows={3}
                maxLength={500}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Сумма сделки (₽)
              </label>
              <div className="relative">
                <RussianRuble className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  min="0"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
                />
              </div>
              <p className="mt-2 text-xs text-white/40">
                Можешь указать 0, если работа бесплатная.
              </p>
            </div>

            {/* 🎯 Честное предупреждение */}
            <div className="flex gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
              <Info className="h-5 w-5 shrink-0 text-yellow-400" />
              <div className="text-xs leading-relaxed text-white/70">
                <div className="mb-1 font-semibold text-yellow-400">
                  Artix — трекер сделки, не платёжная система
                </div>
                Платформа <span className="text-white">не проводит оплату</span>.
                Вы договариваетесь о способе перевода напрямую в чате (СБП,
                карта — как удобно). Здесь вы фиксируете договорённость,
                обсуждаете детали и отслеживаете статус.
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
                    Создаём...
                  </>
                ) : (
                  <>
                    <Handshake className="h-5 w-5" />
                    Создать сделку
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