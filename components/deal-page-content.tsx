'use client';

import { ReviewModal } from './review-modal';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2,
  Loader2,
  DollarSign,
  Star,
} from 'lucide-react';

type Deal = {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  commission_percent: number;
  commission_amount: number;
  artist_amount: number;
  status: string;
  client_paid: boolean;
  artist_completed: boolean;
  client_confirmed: boolean;
  created_at: string;
  paid_at: string | null;
  completed_at: string | null;
  client: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
  artist: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
  };
};

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; description: string }
> = {
  pending: {
    label: 'Ожидает оплаты',
    color: 'yellow',
    description: 'Клиент ещё не оплатил сделку',
  },
  paid: {
    label: 'Оплачено',
    color: 'blue',
    description: 'Деньги в эскроу, художник может приступать',
  },
  in_progress: {
    label: 'В работе',
    color: 'purple',
    description: 'Художник выполняет работу',
  },
  completed: {
    label: 'Завершено',
    color: 'green',
    description: 'Заказчик подтвердил, деньги переведены художнику',
  },
  disputed: {
    label: 'Спор',
    color: 'red',
    description: 'Открыт спор, разбирается арбитраж',
  },
  cancelled: {
    label: 'Отменено',
    color: 'gray',
    description: 'Сделка отменена',
  },
};

export function DealPageContent({
  deal,
  userId,
  isClient,
}: {
  deal: Deal;
  userId: string;
  isClient: boolean;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false); // ← ПЕРЕНЕСЛИ НАВЕРХ

  const status = STATUS_LABELS[deal.status] || STATUS_LABELS.pending;
  const otherPerson = isClient ? deal.artist : deal.client;

  const handlePay = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('deals')
        .update({
          status: 'paid',
          client_paid: true,
          paid_at: new Date().toISOString(),
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;

      await supabase.from('transactions').insert({
        deal_id: deal.id,
        user_id: userId,
        type: 'payment',
        amount: deal.amount,
        status: 'completed',
        description: `Оплата сделки #${deal.id}`,
      });

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('deals')
        .update({
          status: 'in_progress',
          artist_completed: true,
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from('deals')
        .update({
          status: 'completed',
          client_confirmed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', deal.id);

      if (updateError) throw updateError;

      await supabase.from('transactions').insert({
        deal_id: deal.id,
        user_id: deal.artist.id,
        type: 'payout',
        amount: deal.artist_amount,
        status: 'completed',
        description: `Выплата по сделке #${deal.id}`,
      });

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/deals"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Назад к сделкам
      </Link>

      <div className="mx-auto max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]/60 backdrop-blur-xl"
        >
          <div className="p-8">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-white/40">
                Сделка #{deal.id}
              </span>
              <span className="rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-3 py-1 text-xs font-medium text-[#B794F6]">
                {status.label}
              </span>
            </div>

            <h1 className="display-title mt-4 text-3xl font-bold text-white md:text-4xl">
              {deal.title}
            </h1>

            {deal.description && (
              <p className="mt-4 text-white/60">{deal.description}</p>
            )}

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <Shield className="h-5 w-5 text-[#B794F6]" />
              <p className="text-sm text-white/70">{status.description}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="rounded-3xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-xl">
            <div className="mb-3 text-xs uppercase tracking-wider text-white/40">
              {isClient ? 'Заказчик (ты)' : 'Художник (ты)'}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-lg font-bold text-white">
                {isClient
                  ? deal.client.display_name[0]
                  : deal.artist.display_name[0]}
              </div>
              <div>
                <div className="font-semibold text-white">
                  {isClient
                    ? deal.client.display_name
                    : deal.artist.display_name}
                </div>
                <div className="text-xs text-white/40">
                  @{isClient ? deal.client.username : deal.artist.username}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-xl">
            <div className="mb-3 text-xs uppercase tracking-wider text-white/40">
              {isClient ? 'Художник' : 'Заказчик'}
            </div>
            <Link
              href={`/artist/${otherPerson.username}`}
              className="group flex items-center gap-3"
            >
              {otherPerson.avatar_url ? (
                <img
                  src={otherPerson.avatar_url}
                  alt={otherPerson.display_name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-lg font-bold text-white">
                  {otherPerson.display_name[0]}
                </div>
              )}
              <div>
                <div className="font-semibold text-white group-hover:text-[#B794F6]">
                  {otherPerson.display_name}
                </div>
                <div className="text-xs text-white/40">
                  @{otherPerson.username}
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl"
        >
          <h2 className="display-title mb-6 text-xl font-bold text-white">
            Финансы
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Сумма сделки</span>
              <span className="font-semibold text-white">
                {deal.amount.toLocaleString('ru-RU')}₽
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">
                Комиссия платформы ({deal.commission_percent}%)
              </span>
              <span className="font-semibold text-yellow-400">
                −{deal.commission_amount.toLocaleString('ru-RU')}₽
              </span>
            </div>
            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Художник получит</span>
                <span className="gradient-text text-2xl font-bold">
                  {deal.artist_amount.toLocaleString('ru-RU')}₽
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl"
        >
          <h2 className="display-title mb-6 text-xl font-bold text-white">
            Действия
          </h2>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {deal.status === 'pending' && isClient && (
            <button
              onClick={handlePay}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-4 font-semibold text-white shadow-lg shadow-[#6C63FF]/30 transition hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <DollarSign className="h-5 w-5" />
                )}
                Оплатить {deal.amount.toLocaleString('ru-RU')}₽
              </span>
            </button>
          )}

          {deal.status === 'pending' && !isClient && (
            <div className="flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
              <Clock className="h-5 w-5" />
              Ждём оплаты от заказчика
            </div>
          )}

          {deal.status === 'paid' && !isClient && !deal.artist_completed && (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-4 font-semibold text-white shadow-lg shadow-[#6C63FF]/30 transition hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                Работа выполнена
              </span>
            </button>
          )}

          {deal.status === 'paid' && isClient && (
            <div className="flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-blue-300">
              <Clock className="h-5 w-5" />
              Ожидаем выполнения работы художником
            </div>
          )}

          {deal.status === 'in_progress' && isClient && (
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                Подтвердить и оплатить художнику
              </span>
            </button>
          )}

          {deal.status === 'in_progress' && !isClient && (
            <div className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-sm text-purple-300">
              <Clock className="h-5 w-5" />
              Работа сдана. Ожидаем подтверждения заказчика
            </div>
          )}

          {deal.status === 'completed' && (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                Сделка завершена! Спасибо 🎉
              </div>

              <button
                onClick={() => setShowReview(true)}
                className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black transition-all duration-500 hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-white">
                  <Star className="h-5 w-5" />
                  Оставить отзыв
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </>
          )}
        </motion.div>
      </div>

      {showReview && (
        <ReviewModal
          dealId={deal.id}
          targetId={otherPerson.id}
          targetName={otherPerson.display_name}
          onClose={() => setShowReview(false)}
        />
      )}
    </div>
  );
}