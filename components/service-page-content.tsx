'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  Clock,
  MessageCircle,
  Eye,
  Tag,
  Palette,
  Shield,
} from 'lucide-react';
import { DealModal } from './deal-modal';
import { StartChatButton } from './start-chat-button';

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

type Service = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  category: string;
  price: number;
  price_type: string;
  price_to: number | null;
  delivery_days: number;
  tags: string[] | null;
  views_count: number;
  created_at: string;
  artist: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    is_sponsor: boolean;
    price_range: string | null;
  };
};

type SimilarService = {
  id: number;
  title: string;
  image_url: string | null;
  price: number;
  price_type: string;
  price_to: number | null;
  category: string;
  artist: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

function formatPrice(service: {
  price: number;
  price_type: string;
  price_to: number | null;
}): string {
  if (service.price_type === 'from') {
    return `от ${service.price.toLocaleString('ru-RU')}₽`;
  }
  if (service.price_type === 'range' && service.price_to) {
    return `${service.price.toLocaleString('ru-RU')}–${service.price_to.toLocaleString('ru-RU')}₽`;
  }
  return `${service.price.toLocaleString('ru-RU')}₽`;
}

function formatDelivery(days: number): string {
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

export function ServicePageContent({
  service,
  similar,
}: {
  service: Service;
  similar: SimilarService[];
}) {
  const [showDeal, setShowDeal] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Назад */}
        <Link
          href="/services"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Назад к услугам
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* Картинка + описание */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute inset-0 scale-95 rounded-3xl bg-gradient-to-br from-[#6C63FF]/40 to-[#B794F6]/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/10">
                    <span className="text-8xl opacity-40">🎨</span>
                  </div>
                )}
              </div>
            </div>

            {service.description && (
              <div className="mt-8">
                <h3 className="display-title mb-3 text-xl text-white">
                  Описание
                </h3>
                <p className="whitespace-pre-wrap leading-relaxed text-white/60">
                  {service.description}
                </p>
              </div>
            )}

            {service.tags && service.tags.length > 0 && (
              <div className="mt-8">
                <div className="mb-3 flex items-center gap-2 text-sm text-white/40">
                  <Tag className="h-4 w-4" />
                  Теги
                </div>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/5 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:border-[#6C63FF]/30 hover:text-white"
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
                {CATEGORY_LABELS[service.category] || service.category}
              </span>
              {service.artist.is_sponsor && (
                <span className="flex items-center gap-1 rounded-full bg-yellow-400/95 px-3 py-1 text-xs font-medium text-black">
                  <Star className="h-3 w-3 fill-current" />
                  Спонсор
                </span>
              )}
            </div>

            <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
              {service.title}
            </h1>

            <div className="flex items-center gap-6 text-sm text-white/50">
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {service.views_count}
              </span>
            </div>

            {/* Цена */}
            <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-wider text-white/40">
                Стоимость
              </div>
              <div className="gradient-text mt-1 text-4xl font-bold">
                {formatPrice(service)}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 text-[#4FD1C5]" />
                Срок: {formatDelivery(service.delivery_days)}
              </div>

              {/* 🎯 ГЛАВНАЯ КНОПКА — ЗАКАЗАТЬ */}
              <button
                onClick={() => setShowDeal(true)}
                className="group relative mt-5 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-3 font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#6C63FF]/50"
              >
                <Shield className="h-4 w-4" />
                Заказать безопасно
              </button>
              <StartChatButton
                targetUserId={service.artist.id}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 font-medium text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Написать художнику
              </StartChatButton>

              {/* Мелкая подпись */}
              <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-white/40">
                <Shield className="h-3 w-3" />
                Деньги защищены платформой
              </div>
            </div>

            {/* Автор */}
            <div className="rounded-2xl border border-white/10 bg-[#16161f]/60 p-6 backdrop-blur-sm">
              <div className="mb-4 text-xs uppercase tracking-wider text-white/40">
                Художник
              </div>
              <Link
                href={`/artist/${service.artist.username}`}
                className="group flex items-center gap-3"
              >
                {service.artist.avatar_url ? (
                  <img
                    src={service.artist.avatar_url}
                    alt={service.artist.display_name}
                    className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xl font-bold text-white">
                    {service.artist.display_name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-white">
                      {service.artist.display_name}
                    </span>
                    {service.artist.is_sponsor && (
                      <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/40">
                    @{service.artist.username}
                  </div>
                </div>
              </Link>
              {service.artist.bio && (
                <p className="mt-4 line-clamp-3 text-sm text-white/50">
                  {service.artist.bio}
                </p>
              )}
              <Link
                href={`/artist/${service.artist.username}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-full border border-white/10 py-2.5 text-sm text-white/70 transition hover:border-[#6C63FF]/40 hover:text-white"
              >
                <Palette className="h-4 w-4" />
                Профиль художника
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Похожие */}
        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="display-title mb-8 text-3xl font-bold text-white md:text-4xl">
              Похожие услуги
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <Link key={item.id} href={`/service/${item.id}`}>
                  <div className="group h-full overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#6C63FF]/40">
                    <div className="relative aspect-video overflow-hidden bg-[#0a0a0f]">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/10">
                          <span className="text-5xl opacity-40">🎨</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-1 text-lg font-bold text-white transition group-hover:text-[#B794F6]">
                        {item.title}
                      </h3>
                      <div className="mt-3 flex items-center gap-2">
                        {item.artist.avatar_url ? (
                          <img
                            src={item.artist.avatar_url}
                            alt=""
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6]" />
                        )}
                        <span className="text-sm text-white/50">
                          {item.artist.display_name}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-white/40">
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                        <span className="gradient-text text-lg font-bold">
                          {formatPrice(item)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🎯 МОДАЛКА СДЕЛКИ */}
      {showDeal && (
        <DealModal
          artistId={service.artist.id}
          artistName={service.artist.display_name}
          serviceId={service.id}
          defaultAmount={service.price}
          defaultTitle={service.title}
          onClose={() => setShowDeal(false)}
        />
      )}
    </>
  );
}