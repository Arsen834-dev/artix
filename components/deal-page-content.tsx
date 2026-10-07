// components/deal-page-content.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  MessageCircle,
  Handshake,
  XCircle,
  Circle,
} from 'lucide-react';
import { ReviewModal } from './review-modal';
import { StartChatButton } from './start-chat-button';
import { DEAL_STATUS_LABELS } from '@/lib/constants';

type Deal = {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  client_paid: boolean;
  artist_completed: boolean;
  client_confirmed: boolean;
  created_at: string;
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

type HistoryEntry = {
  id: number;
  from_status: string | null;
  to_status: string;
  comment: string | null;
  created_at: string;
  changed_by: string | null;
};

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  in_progress: Loader2,
  completed: CheckCircle2,
  disputed: AlertTriangle,
  cancelled: XCircle,
};

export function DealPageContent({
  deal,
  userId,
  isClient,
  history = [],
}: {
  deal: Deal;
  userId: string;
  isClient: boolean;
  history?: HistoryEntry[];
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);

  const status = DEAL_STATUS_LABELS[deal.status] || DEAL_STATUS_LABELS.pending;
  const otherPerson = isClient ? deal.artist : deal.client;
  const StatusIcon = STATUS_ICONS[deal.status] || Circle;

  // 🎯 Универсальный вызов RPC
  const callRpc = async (fn: string, args: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc(fn, args);
      if (rpcError) throw rpcError;
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWork = () =>
    callRpc('transition_deal', {
      p_deal_id: deal.id,
      p_to_status: 'in_progress',
      p_comment: null,
    });

  const handleConfirmComplete = () =>
    callRpc('transition_deal', {
      p_deal_id: deal.id,
      p_to_status: 'completed',
      p_comment: null,
    });

  const handleMarkWorkDone = () =>
    callRpc('mark_deal_work_completed', { p_deal_id: deal.id });

  const handleDispute = () =>
    callRpc('transition_deal', {
      p_deal_id: deal.id,
      p_to_status: 'disputed',
      p_comment: 'Спор открыт',
    });

  const handleCancel = () =>
    callRpc('transition_deal', {
      p_deal_id: deal.id,
      p_to_status: 'cancelled',
      p_comment: 'Сделка отменена',
    });

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <Link
        href="/deals"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Назад к сделкам
      </Link>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Заголовок */}
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
              <StatusIcon className="h-5 w-5 text-[#B794F6]" />
              <p className="text-sm text-white/70">{status.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Стороны */}
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

        {/* Финансы */}
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
            <div className="border-t border-white/5 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Художник получает</span>
                <span className="gradient-text text-2xl font-bold">
                  {deal.amount.toLocaleString('ru-RU')}₽
                </span>
              </div>
              <p className="mt-2 text-xs text-white/40">
                Комиссия платформы — 0%. Artix не берёт процент.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Действия */}
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

          {/* pending + клиент → Начать работу */}
          {deal.status === 'pending' && isClient && (
            <button
              onClick={handleStartWork}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-4 font-semibold text-white shadow-lg shadow-[#6C63FF]/30 transition hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Handshake className="h-5 w-5" />
                )}
                Начать работу
              </span>
            </button>
          )}

          {/* pending + художник → ждём */}
          {deal.status === 'pending' && !isClient && (
            <div className="flex items-center gap-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-300">
              <Clock className="h-5 w-5" />
              Ждём, пока заказчик подтвердит начало работы
            </div>
          )}

          {/* in_progress + художник + не отметил → Работа выполнена */}
          {deal.status === 'in_progress' &&
            !isClient &&
            !deal.artist_completed && (
              <button
                onClick={handleMarkWorkDone}
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

          {/* in_progress + художник + отметил → ждём подтверждения */}
          {deal.status === 'in_progress' &&
            !isClient &&
            deal.artist_completed && (
              <div className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-sm text-purple-300">
                <Clock className="h-5 w-5" />
                Работа сдана. Ждём подтверждения заказчика (авто-подтверждение
                через 7 дней)
              </div>
            )}

          {/* in_progress + клиент → Подтвердить */}
          {deal.status === 'in_progress' && isClient && (
            <button
              onClick={handleConfirmComplete}
              disabled={isLoading}
              className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-green-500 to-emerald-400 px-6 py-4 font-semibold text-white shadow-lg shadow-green-500/30 transition hover:scale-[1.02] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-5 w-5" />
                )}
                Подтвердить завершение
              </span>
            </button>
          )}

          {/* in_progress → спор */}
          {deal.status === 'in_progress' && (
            <button
              onClick={handleDispute}
              disabled={isLoading}
              className="mt-3 w-full rounded-full border border-red-500/20 bg-red-500/10 px-6 py-3 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 disabled:opacity-50"
            >
              Открыть спор
            </button>
          )}

          {/* pending → отмена */}
          {deal.status === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="mt-3 w-full rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              Отменить сделку
            </button>
          )}

          {/* completed → отзыв */}
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
                  <CheckCircle2 className="h-5 w-5" />
                  Оставить отзыв
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </>
          )}

          {/* disputed */}
          {deal.status === 'disputed' && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <AlertTriangle className="h-5 w-5" />
              Открыт спор. Платформа разберётся в течение 3 рабочих дней.
            </div>
          )}

          {/* cancelled */}
          {deal.status === 'cancelled' && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              <XCircle className="h-5 w-5" />
              Сделка отменена
            </div>
          )}

          {/* Чат — всегда доступен */}
          {otherPerson && (
            <div className="mt-4">
              <StartChatButton
                targetUserId={otherPerson.id}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />
                Открыть чат
              </StartChatButton>
            </div>
          )}
        </motion.div>

        {/* История статусов */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl"
          >
            <h2 className="display-title mb-6 text-xl font-bold text-white">
              История сделки
            </h2>

            <div className="space-y-4">
              {history.map((entry, i) => {
                const label =
                  DEAL_STATUS_LABELS[entry.to_status]?.label ||
                  entry.to_status;
                const Icon = STATUS_ICONS[entry.to_status] || Circle;

                return (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6C63FF]/20">
                        <Icon className="h-4 w-4 text-[#B794F6]" />
                      </div>
                      {i < history.length - 1 && (
                        <div className="mt-1 w-px flex-1 bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="text-sm font-medium text-white">
                        {label}
                      </div>
                      {entry.comment && (
                        <div className="mt-1 text-xs text-white/50">
                          {entry.comment}
                        </div>
                      )}
                      <div className="mt-1 text-xs text-white/30">
                        {new Date(entry.created_at).toLocaleString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
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