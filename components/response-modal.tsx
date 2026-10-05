'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  X,
  Send,
  DollarSign,
  Clock,
  Loader2,
  Check,
  MessageCircle,
} from 'lucide-react';

export function ResponseModal({
  orderId,
  orderTitle,
  orderBudget,
  onClose,
}: {
  orderId: number;
  orderTitle: string;
  orderBudget: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(orderBudget.toString());
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!message.trim()) {
      setError('Напиши сообщение заказчику');
      return;
    }
    if (!price || parseInt(price) < 100) {
      setError('Минимальная цена — 100₽');
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
      const { error: insertError } = await supabase
        .from('responses')
        .insert({
          order_id: orderId,
          artist_id: user.id,
          message: message.trim(),
          price: parseInt(price),
          delivery_days: parseInt(deliveryDays) || 3,
        });

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message.includes('duplicate')
          ? 'Ты уже откликнулся на этот заказ'
          : err.message || 'Ошибка'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

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
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#4FD1C5]/30 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#4FD1C5]/30 blur-[100px]" />

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
                Отклик отправлен!
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Заказчик получит уведомление
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4FD1C5] to-[#68D391] shadow-2xl shadow-[#4FD1C5]/40">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <h2 className="display-title text-xl font-bold text-white">
                  Откликнуться
                </h2>
                <p className="mt-1 line-clamp-1 text-xs text-white/50">
                  {orderTitle}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    Сообщение заказчику *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Привет! Возьмусь за эту работу. Вот мой опыт..."
                    rows={4}
                    maxLength={500}
                    required
                    className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
                  />
                  <div className="mt-1 text-right text-xs text-white/30">
                    {message.length}/500
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Твоя цена (₽) *
                    </label>
                    <div className="relative">
                      <DollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min="100"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/70">
                      Срок (дней) *
                    </label>
                    <div className="relative">
                      <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        type="number"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(e.target.value)}
                        min="1"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
                      />
                    </div>
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
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#68D391] px-6 py-4 font-semibold text-white shadow-2xl shadow-[#4FD1C5]/30 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Отправляем...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Отправить отклик
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}