'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, ArrowRight } from 'lucide-react';

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
  created_at: string;
  artist: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
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
  other: 'Другое',
};

// 🎯 Форматирование цены
function formatPrice(service: Service): string {
  if (service.price_type === 'from') {
    return `от ${service.price.toLocaleString('ru-RU')}₽`;
  }
  if (service.price_type === 'range' && service.price_to) {
    return `${service.price.toLocaleString('ru-RU')}–${service.price_to.toLocaleString('ru-RU')}₽`;
  }
  return `${service.price.toLocaleString('ru-RU')}₽`;
}

// 🎯 Форматирование срока
function formatDelivery(days: number): string {
  if (days === 1) return '1 день';
  if (days < 5) return `${days} дня`;
  return `${days} дней`;
}

export function ServicesGrid({ services }: { services: Service[] }) {
  if (services.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <div className="mb-4 text-6xl">🎨</div>
        <p className="text-lg text-white/60">Пока нет услуг 😢</p>
        <p className="mt-2 text-sm text-white/40">
          Стань первым, кто предложит свои услуги!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => (
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
        >
          <Link href={`/service/${service.id}`}>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/20">
              {/* Превью */}
              <div className="relative aspect-video overflow-hidden bg-[#0a0a0f]">
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/10">
                    <span className="text-5xl opacity-40">🎨</span>
                  </div>
                )}

                {/* Бейдж категории */}
                <span className="glass absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-white/90">
                  {CATEGORY_LABELS[service.category] || service.category}
                </span>

                {/* Бейдж спонсора */}
                {service.artist.is_sponsor && (
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-black shadow-lg shadow-yellow-400/30">
                    <Star className="h-3 w-3 fill-current" />
                    PRO
                  </span>
                )}

                {/* Градиент снизу */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#16161f] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              {/* Контент */}
              <div className="flex flex-col p-5">
                {/* Название */}
                <h3 className="display-title text-xl font-bold text-white transition group-hover:text-[#B794F6]">
                  {service.title}
                </h3>

                {/* Описание */}
                {service.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-white/50">
                    {service.description}
                  </p>
                )}

                {/* Теги */}
                {service.tags && service.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-white/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Автор */}
                <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
                  {service.artist.avatar_url ? (
                    <img
                      src={service.artist.avatar_url}
                      alt={service.artist.display_name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xs font-bold text-white">
                      {service.artist.display_name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="truncate text-sm font-medium text-white/80">
                        {service.artist.display_name}
                      </span>
                      {service.artist.is_sponsor && (
                        <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span className="text-xs text-white/30">
                      @{service.artist.username}
                    </span>
                  </div>
                </div>

                {/* Цена + срок + стрелка */}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="gradient-text text-2xl font-bold">
                      {formatPrice(service)}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
                      <Clock className="h-3 w-3" />
                      {formatDelivery(service.delivery_days)}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/40 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:from-[#6C63FF] group-hover:to-[#B794F6] group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}