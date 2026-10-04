'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  MessageCircle,
  Eye,
  Tag,
  Users,
  Calendar,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  portrait: 'Портреты',
  fantasy: 'Фэнтези',
  anime: 'Аниме',
  illustration: 'Иллюстрации',
  '3d': '3D',
  pixel: 'Пиксель-арт',
  scifi: 'Sci-Fi',
  concept: 'Концепт-арт',
  sketch: 'Скетчи',
  nature: 'Природа',
  architecture: 'Архитектура',
  other: 'Другое',
};

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

function formatBudget(order: Order): string {
  if (order.budget_type === 'up_to') {
    return `до ${order.budget.toLocaleString('ru-RU')}₽`;
  }
  if (order.budget_type === 'range' && order.budget_to) {
    return `${order.budget.toLocaleString('ru-RU')}–${order.budget_to.toLocaleString('ru-RU')}₽`;
  }
  return `${order.budget.toLocaleString('ru-RU')}₽`;
}

function formatDeadline(days: number | null): string {
  if (!days) return 'Не указан';
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

export function OrderPageContent({ order }: { order: Order }) {
  const createdDate = new Date(order.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8">
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
        {/* Левая часть — заказ */}
        <div className="lg:col-span-2">
          {/* Бейджи */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
              {CATEGORY_LABELS[order.category] || order.category}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
              Открыт для откликов
            </span>
          </div>

          {/* Название */}
          <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
            {order.title}
          </h1>

          {/* Дата */}
          <div className="mt-3 flex items-center gap-4 text-sm text-white/40">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {createdDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {order.views_count} просмотров
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {order.responses_count} откликов
            </span>
          </div>

          {/* Картинка-референс */}
          {order.image_url && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]">
              <img
                src={order.image_url}
                alt={order.title}
                className="w-full object-cover"
              />
            </div>
          )}

          {/* Описание */}
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

          {/* Теги */}
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
        </div>

        {/* Правая часть */}
        <div className="space-y-6">
          {/* Блок бюджета */}
          <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-wider text-white/40">
              Бюджет
            </div>
            <div className="mt-1 text-4xl font-bold text-[#4FD1C5]">
              {formatBudget(order)}
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4 text-[#4FD1C5]" />
              Срок: {formatDeadline(order.deadline_days)}
            </div>

            <button className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#4FD1C5] to-[#68D391] px-6 py-3 font-medium text-white shadow-lg shadow-[#4FD1C5]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4FD1C5]/50">
              <MessageCircle className="h-4 w-4" />
              Откликнуться
            </button>

            <div className="mt-3 text-center text-xs text-white/30">
              {order.responses_count} художников уже откликнулись
            </div>
          </div>

          {/* Блок клиента */}
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
        </div>
      </motion.div>
    </div>
  );
}