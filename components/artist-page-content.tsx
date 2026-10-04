'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Calendar,
  Palette,
  Send,
  Instagram,
  Globe,
  ExternalLink,
  Music2,
  DollarSign,
  Gamepad2,
  Briefcase,
  Clock,
  ShoppingBag,
  Users,
} from 'lucide-react';

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  is_sponsor: boolean;
  price_range: string | null;
  created_at: string;
  cover_url: string | null;
  telegram_url: string | null;
  instagram_url: string | null;
  vk_url: string | null;
  behance_url: string | null;
  artstation_url: string | null;
  website_url: string | null;
  boosty_url: string | null;
  discord_url: string | null;
  tiktok_url: string | null;
};

type Artwork = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  likes_count: number;
  category: string;
};

type Service = {
  id: number;
  title: string;
  image_url: string | null;
  price: number;
  price_type: string;
  price_to: number | null;
  category: string;
  delivery_days: number;
  tags: string[] | null;
};

type Order = {
  id: number;
  title: string;
  image_url: string | null;
  budget: number;
  budget_type: string;
  budget_to: number | null;
  category: string;
  deadline_days: number | null;
  tags: string[] | null;
  status: string;
  responses_count: number;
  created_at: string;
};

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

function formatServicePrice(service: Service): string {
  if (service.price_type === 'from') {
    return `от ${service.price.toLocaleString('ru-RU')}₽`;
  }
  if (service.price_type === 'range' && service.price_to) {
    return `${service.price.toLocaleString('ru-RU')}–${service.price_to.toLocaleString('ru-RU')}₽`;
  }
  return `${service.price.toLocaleString('ru-RU')}₽`;
}

function formatOrderBudget(order: Order): string {
  if (order.budget_type === 'up_to') {
    return `до ${order.budget.toLocaleString('ru-RU')}₽`;
  }
  if (order.budget_type === 'range' && order.budget_to) {
    return `${order.budget.toLocaleString('ru-RU')}–${order.budget_to.toLocaleString('ru-RU')}₽`;
  }
  return `${order.budget.toLocaleString('ru-RU')}₽`;
}

function formatDelivery(days: number): string {
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

// ============================================
// СОЦСЕТИ
// ============================================
function SocialLinks({ profile }: { profile: Profile }) {
  const links = [
    { url: profile.telegram_url, label: 'Telegram', icon: Send, color: 'hover:text-[#0088cc] hover:border-[#0088cc]/40' },
    { url: profile.instagram_url, label: 'Instagram', icon: Instagram, color: 'hover:text-[#E1306C] hover:border-[#E1306C]/40' },
    { url: profile.tiktok_url, label: 'TikTok', icon: Music2, color: 'hover:text-[#FF0050] hover:border-[#FF0050]/40' },
    { url: profile.vk_url, label: 'VK', icon: Globe, color: 'hover:text-[#0077FF] hover:border-[#0077FF]/40' },
    { url: profile.discord_url, label: 'Discord', icon: Gamepad2, color: 'hover:text-[#5865F2] hover:border-[#5865F2]/40' },
    { url: profile.boosty_url, label: 'Boosty', icon: DollarSign, color: 'hover:text-[#FF6B00] hover:border-[#FF6B00]/40' },
    { url: profile.behance_url, label: 'Behance', icon: Palette, color: 'hover:text-[#1769FF] hover:border-[#1769FF]/40' },
    { url: profile.artstation_url, label: 'ArtStation', icon: Palette, color: 'hover:text-[#13AFF0] hover:border-[#13AFF0]/40' },
    { url: profile.website_url, label: 'Сайт', icon: Globe, color: 'hover:text-[#B794F6] hover:border-[#B794F6]/40' },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start">
      {links.map((link, i) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.label}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
            className={`group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:scale-105 ${link.color}`}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
            <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
          </motion.a>
        );
      })}
    </div>
  );
}

// ============================================
// КАРТОЧКА РАБОТЫ
// ============================================
function ArtworkCard({ artwork, index }: { artwork: Artwork; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/artwork/${artwork.id}`}>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-[#16161f]/60 transition-all duration-500 hover:-translate-y-1 hover:border-[#6C63FF]/40">
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="line-clamp-1 text-sm font-semibold text-white">
              {artwork.title}
            </h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-white/50">
                {CATEGORY_LABELS[artwork.category] || artwork.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/60">
                <Heart className="h-3 w-3" />
                {artwork.likes_count}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// КАРТОЧКА УСЛУГИ
// ============================================
function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/service/${service.id}`}>
        <div className="group h-full overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/20">
          <div className="relative aspect-video overflow-hidden bg-[#0a0a0f]">
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/10">
                <Briefcase className="h-12 w-12 text-[#B794F6] opacity-40" />
              </div>
            )}
            <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white/90">
              {CATEGORY_LABELS[service.category] || service.category}
            </span>
          </div>
          <div className="p-5">
            <h3 className="display-title text-lg font-bold text-white transition group-hover:text-[#B794F6]">
              {service.title}
            </h3>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="gradient-text text-xl font-bold">
                  {formatServicePrice(service)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
                  <Clock className="h-3 w-3" />
                  {formatDelivery(service.delivery_days)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// КАРТОЧКА ЗАКАЗА
// ============================================
function OrderCard({ order, index }: { order: Order; index: number }) {
  const isOpen = order.status === 'open';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/order/${order.id}`}>
        <div className="group h-full overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#4FD1C5]/40 hover:shadow-2xl hover:shadow-[#4FD1C5]/20">
          <div className="mb-3 flex items-center justify-between">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
              {CATEGORY_LABELS[order.category] || order.category}
            </span>
            {isOpen ? (
              <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                Открыт
              </span>
            ) : (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-white/40">
                Закрыт
              </span>
            )}
          </div>

          <h3 className="display-title text-xl font-bold text-white transition group-hover:text-[#4FD1C5]">
            {order.title}
          </h3>

          <div className="mt-5 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40">
                Бюджет
              </div>
              <div className="text-2xl font-bold text-[#4FD1C5]">
                {formatOrderBudget(order)}
              </div>
              <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                {order.deadline_days && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDelivery(order.deadline_days)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {order.responses_count}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export function ArtistPageContent({
  profile,
  artworks,
  services,
  orders,
  totalLikes,
}: {
  profile: Profile;
  artworks: Artwork[];
  services: Service[];
  orders: Order[];
  totalLikes: number;
}) {
  const joinDate = new Date(profile.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });

  const isArtist = profile.role === 'artist' || profile.role === 'both';
  const isClient = profile.role === 'client' || profile.role === 'both';

  // 🎯 Собираем табы
  const tabs: Array<{
    key: 'artworks' | 'services' | 'orders';
    label: string;
    icon: any;
    count: number;
  }> = [];

  if (isArtist) {
    tabs.push({
      key: 'artworks',
      label: 'Работы',
      icon: ImageIcon,
      count: artworks.length,
    });
    tabs.push({
      key: 'services',
      label: 'Услуги',
      icon: Briefcase,
      count: services.length,
    });
  }

  if (isClient) {
    tabs.push({
      key: 'orders',
      label: 'Заказы',
      icon: ShoppingBag,
      count: orders.length,
    });
  }

  const [activeTab, setActiveTab] = useState(tabs[0]?.key || 'artworks');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Назад */}
      <Link
        href="/feed"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <svg
          className="h-4 w-4 transition-transform group-hover:-translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Назад в галактику
      </Link>

      {/* ШАПКА ПРОФИЛЯ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]/60 backdrop-blur-sm"
      >
        {/* Обложка */}
        <div className="relative h-48 md:h-64">
          {profile.cover_url ? (
            <img
              src={profile.cover_url}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#6C63FF] via-[#B794F6] to-[#4FD1C5]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161f] via-[#16161f]/60 to-transparent" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#6C63FF]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#4FD1C5]/20 blur-[100px]" />
        </div>

        {/* Контент */}
        <div className="relative -mt-20 px-8 pb-8 md:-mt-24 md:px-12 md:pb-12">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-end">
            {/* Аватар */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative shrink-0"
            >
              <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] opacity-50 blur-2xl" />
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name}
                  className="relative h-32 w-32 rounded-full border-4 border-[#16161f] object-cover shadow-2xl md:h-40 md:w-40"
                />
              ) : (
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#16161f] bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-5xl font-bold text-white md:h-40 md:w-40">
                  {profile.display_name[0]?.toUpperCase()}
                </div>
              )}
              {profile.is_sponsor && (
                <div className="absolute -right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50">
                  <Star className="h-5 w-5 fill-black text-black" />
                </div>
              )}
            </motion.div>

            {/* Информация */}
            <div className="flex-1 text-center md:pb-2 md:text-left">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="display-title text-4xl font-bold text-white md:text-5xl"
              >
                {profile.display_name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start"
              >
                <span className="text-lg text-white/40">
                  @{profile.username}
                </span>
                {isArtist && (
                  <span className="flex items-center gap-1 rounded-full bg-[#6C63FF]/20 px-3 py-1 text-xs font-medium text-[#B794F6]">
                    <Palette className="h-3 w-3" />
                    Художник
                  </span>
                )}
                {isClient && (
                  <span className="flex items-center gap-1 rounded-full bg-[#4FD1C5]/20 px-3 py-1 text-xs font-medium text-[#4FD1C5]">
                    <ShoppingBag className="h-3 w-3" />
                    Заказчик
                  </span>
                )}
                {profile.is_sponsor && (
                  <span className="flex items-center gap-1 rounded-full bg-yellow-400/20 px-3 py-1 text-xs font-medium text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    Спонсор
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* Био + соцсети + статистика */}
          <div className="mt-8">
            {profile.bio && (
              <p className="mx-auto max-w-3xl text-center text-white/60 md:mx-0 md:text-left">
                {profile.bio}
              </p>
            )}

            <SocialLinks profile={profile} />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 md:justify-start">
              {isArtist && (
                <>
                  <div className="flex items-center gap-2 text-white/70">
                    <ImageIcon className="h-4 w-4 text-[#B794F6]" />
                    <span className="font-semibold text-white">
                      {artworks.length}
                    </span>
                    <span className="text-sm">работ</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/70">
                    <Briefcase className="h-4 w-4 text-[#B794F6]" />
                    <span className="font-semibold text-white">
                      {services.length}
                    </span>
                    <span className="text-sm">услуг</span>
                  </div>
                </>
              )}
              {isClient && (
                <div className="flex items-center gap-2 text-white/70">
                  <ShoppingBag className="h-4 w-4 text-[#4FD1C5]" />
                  <span className="font-semibold text-white">
                    {orders.length}
                  </span>
                  <span className="text-sm">заказов</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-white/70">
                <Heart className="h-4 w-4 text-[#F687B3]" />
                <span className="font-semibold text-white">{totalLikes}</span>
                <span className="text-sm">лайков</span>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <Calendar className="h-4 w-4 text-[#4FD1C5]" />
                <span className="text-sm">с {joinDate}</span>
              </div>
            </div>

            {/* Цена + кнопка */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              {profile.price_range && (
                <div>
                  <div className="text-xs uppercase tracking-wider text-white/40">
                    Цены
                  </div>
                  <div className="gradient-text text-2xl font-bold">
                    {profile.price_range}
                  </div>
                </div>
              )}
              <button className="group relative overflow-hidden rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-500 hover:scale-105">
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                  <MessageCircle className="h-4 w-4" />
                  Написать
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ТАБЫ */}
      {tabs.length > 1 && (
        <div className="mb-8 flex justify-center md:justify-start">
          <div className="glass inline-flex gap-1 overflow-x-auto rounded-full p-1 scrollbar-hide">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="artist-tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] shadow-lg shadow-[#6C63FF]/30"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {t.label}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        isActive
                          ? 'bg-white/20'
                          : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {t.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* КОНТЕНТ ТАБА */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {/* РАБОТЫ */}
          {activeTab === 'artworks' && (
            <>
              {artworks.length === 0 ? (
                <EmptyState
                  icon={ImageIcon}
                  title="Пока нет работ"
                  subtitle="Художник ещё не загрузил работы"
                />
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {artworks.map((artwork, i) => (
                    <ArtworkCard key={artwork.id} artwork={artwork} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* УСЛУГИ */}
          {activeTab === 'services' && (
            <>
              {services.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="Пока нет услуг"
                  subtitle="Художник ещё не предложил услуги"
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ЗАКАЗЫ */}
          {activeTab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <EmptyState
                  icon={ShoppingBag}
                  title="Пока нет заказов"
                  subtitle="Заказчик ещё не создал заказы"
                />
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {orders.map((order, i) => (
                    <OrderCard key={order.id} order={order} index={i} />
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================
// ПУСТОЕ СОСТОЯНИЕ
// ============================================
function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
      <Icon className="mx-auto mb-4 h-12 w-12 text-white/20" />
      <p className="text-lg text-white/60">{title}</p>
      <p className="mt-2 text-sm text-white/40">{subtitle}</p>
    </div>
  );
}