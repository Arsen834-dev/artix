'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  X,
  DollarSign,
  Clock,
  Shield,
  Info,
  Loader2,
  Check,
} from 'lucide-react';

type DealModalProps = {
  artistId: string;
  artistName: string;
  serviceId?: number;
  orderId?: number;
  defaultAmount?: number;
  defaultTitle?: string;
  onClose: () => void;
};

const COMMISSION_PERCENT = 5; // комиссия платформы

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

  const amountNum = parseInt(amount) || 0;
  const commission = Math.round((amountNum * COMMISSION_PERCENT) / 100);
  const artistReceives = amountNum - commission;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      setError('Введи название сделки');
      setIsLoading(false);
      return;
    }
    if (amountNum < 500) {
      setError('Минимальная сумма — 500₽');
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
          commission_percent: COMMISSION_PERCENT,
          commission_amount: commission,
          artist_amount: artistReceives,
          status: 'pending',
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        router.push(`/deal/${data.id}`);
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
          {/* Заголовок */}
          <div className="flex items-center justify-between border-b border-white/5 p-6">
            <div>
              <h2 className="display-title text-xl font-bold text-white">
                Создать сделку
              </h2>
              <p className="mt-1 text-sm text-white/50">
                с {artistName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Название */}
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

            {/* Описание */}
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

            {/* Сумма */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Сумма сделки (₽) *
              </label>
              <div className="relative">
                <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000"
                  min="500"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
                />
              </div>
            </div>

            {/* Расчёт */}
            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Сумма сделки</span>
                <span className="font-semibold text-white">
                  {amountNum.toLocaleString('ru-RU')}₽
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-white/60">
                  Комиссия платформы ({COMMISSION_PERCENT}%)
                  <Info className="h-3 w-3" />
                </span>
                <span className="font-semibold text-yellow-400">
                  −{commission.toLocaleString('ru-RU')}₽
                </span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Художник получит
                  </span>
                  <span className="gradient-text text-xl font-bold">
                    {artistReceives.toLocaleString('ru-RU')}₽
                  </span>
                </div>
              </div>
            </div>

            {/* Инфо */}
            <div className="flex gap-3 rounded-2xl border border-[#6C63FF]/20 bg-[#6C63FF]/5 p-4">
              <Shield className="h-5 w-5 shrink-0 text-[#B794F6]" />
              <div className="text-xs leading-relaxed text-white/70">
                <div className="mb-1 font-semibold text-white">
                  Безопасная сделка
                </div>
                Деньги резервируются на платформе. Художник получит их после
                того, как ты подтвердишь работу. Если что-то пойдёт не так —
                арбитраж.
              </div>
            </div>

            {/* Ошибка */}
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Кнопка */}
            <button
              type="submit"
              disabled={isLoading || amountNum < 500}
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
                    <Shield className="h-5 w-5" />
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