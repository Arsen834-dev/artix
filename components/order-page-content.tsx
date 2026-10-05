// components/order-page-content.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  Eye,
  Tag,
  Users,
  Calendar,
  Shield,
  MessageCircle,
  Check,
} from 'lucide-react';
import { DeleteButton } from './delete-button';
import { ResponseModal } from './response-modal';
import { useRequireAuth } from './auth-provider';
import { StartChatButton } from './start-chat-button';
import {
  getCategoryLabel,
  formatOrderBudget,
  formatDelivery,
} from '@/lib/constants';

type Order = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  budget: number;
  budget_type: string;
  budget_to: number | null;
  deadline_days: number | null;
  tags: string[] | null;
  status: string;
  responses_count: number;
  views_count: number;
  created_at: string;
  client: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    is_sponsor: boolean;
  };
};

type Response = {
  id: number;
  message: string;
  price: number;
  delivery_days: number;
  status: string;
  created_at: string;
  artist: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

export function OrderPageContent({
  order,
  responses = [],
  userId,
}: {
  order: Order;
  responses?: Response[];
  userId: string;
}) {
  const [showResponse, setShowResponse] = useState(false);
  const isOwner = order.client.id === userId;
  const requireAuth = useRequireAuth();

  const createdDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hasResponded = responses.some((r) => r.artist.id === userId);

  const handleRespond = () => {
    requireAuth(() => setShowResponse(true), 'отклики на заказы');
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-24">
        <Link
          href="/orders"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Назад к заказам
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
                {getCategoryLabel(order.category)}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Открыт для откликов
              </span>
            </div>

            <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
              {order.title}
            </h1>

            <div className="mt-3 flex items-center gap-4 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {createdDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {order.views_count}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {order.responses_count} откликов
              </span>
            </div>

            {order.image_url && (
              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]">
                <img
                  src={order.image_url}
                  alt={order.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {order.description && (
              <div className="mt-8">
                <h3 className="display-title mb-3 text-xl text-white">
                  Описание заказа
                </h3>
                <p className="whitespace-pre-wrap leading-relaxed text-white/60">
                  {order.description}
                </p>
              </div>
            )}

            {order.tags && order.tags.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2 text-sm text-white/40">
                  <Tag className="h-4 w-4" />
                  Теги
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:border-[#4FD1C5]/30 hover:text-white"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {responses.length > 0 && (
              <div className="mt-12">
                <h3 className="display-title mb-6 text-2xl font-bold text-white">
                  Отклики ({responses.length})
                </h3>
                <div className="space-y-4">
                  {responses.map((response, i) => (
                    <motion.div
                      key={response.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`rounded-3xl border p-6 backdrop-blur-sm transition ${
                        response.status === 'accepted'
                          ? 'border-green-500/40 bg-green-500/5'
                          : response.status === 'rejected'
                            ? 'border-red-500/20 bg-red-500/5 opacity-60'
                            : 'border-white/10 bg-[#16161f]/60 hover:border-[#4FD1C5]/30'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Link
                          href={`/artist/${response.artist.username}`}
                          className="flex flex-1 items-center gap-3"
                        >
                          {response.artist.avatar_url ? (
                            <img
                              src={response.artist.avatar_url}
                              alt={response.artist.display_name}
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/10"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#4FD1C5] to-[#68D391] text-lg font-bold text-white">
                              {response.artist.display_name[0]}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-white">
                                {response.artist.display_name}
                              </span>
                              {response.artist.is_sponsor && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              )}
                            </div>
                            <span className="text-xs text-white/40">
                              @{response.artist.username}
                            </span>
                          </div>
                        </Link>

                        {response.status === 'accepted' && (
                          <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                            Выбран
                          </span>
                        )}
                      </div>

                      <p className="mt-4 whitespace-pre-wrap text-sm text-white/70">
                        {response.message}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                        <div>
                          <div className="text-xs text-white/40">Цена</div>
                          <div className="text-lg font-bold text-[#4FD1C5]">
                            {response.price.toLocaleString('ru-RU')}₽
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/40">Срок</div>
                          <div className="font-medium text-white">
                            {formatDelivery(response.delivery_days)}
                          </div>
                        </div>
                      </div>

                      {isOwner && response.status === 'pending' && (
                        <div className="mt-4 flex gap-2">
                          <StartChatButton
                            targetUserId={response.artist.id}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/10"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Написать
                          </StartChatButton>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-wider text-white/40">
                Бюджет
              </div>
              <div className="mt-1 text-4xl font-bold text-[#4FD1C5]">
                {formatOrderBudget(order)}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 text-[#4FD1C5]" />
                Срок: {formatDelivery(order.deadline_days)}
              </div>

              {!isOwner && !hasResponded && (
                <button
                  onClick={handleRespond}
                  className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#68D391] px-6 py-3 font-medium text-white shadow-lg shadow-[#4FD1C5]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4FD1C5]/50"
                >
                  <Shield className="h-4 w-4" />
                  Откликнуться
                </button>
              )}

              {!isOwner && hasResponded && (
                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/5 p-3 text-sm text-green-400">
                  <Check className="h-4 w-4" />
                  Ты уже откликнулся
                </div>
              )}

              {isOwner && (
                <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[#4FD1C5]/20 bg-[#4FD1C5]/5 p-3 text-sm text-[#4FD1C5]">
                  <Star className="h-4 w-4" />
                  Это твой заказ
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
              <div className="mb-4 text-xs uppercase tracking-wider text-white/40">
                Заказчик
              </div>
              <Link
                href={`/artist/${order.client.username}`}
                className="group flex items-center gap-3"
              >
                {order.client.avatar_url ? (
                  <img
                    src={order.client.avatar_url}
                    alt={order.client.display_name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#4FD1C5]"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#4FD1C5] to-[#68D391] text-xl font-bold text-white">
                    {order.client.display_name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-white">
                      {order.client.display_name}
                    </span>
                    {order.client.is_sponsor && (
                      <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/40">
                    @{order.client.username}
                  </div>
                </div>
              </Link>
              {order.client.bio && (
                <p className="mt-4 line-clamp-3 text-sm text-white/50">
                  {order.client.bio}
                </p>
              )}
            </div>

            {isOwner && (
              <DeleteButton
                table="orders"
                id={order.id}
                redirectTo="/orders"
                label="Удалить заказ"
              />
            )}
          </div>
        </motion.div>
      </div>

      {showResponse && (
        <ResponseModal
          orderId={order.id}
          orderTitle={order.title}
          orderBudget={order.budget}
          onClose={() => setShowResponse(false)}
        />
      )}
    </>
  );
}