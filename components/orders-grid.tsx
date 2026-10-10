// components/orders-grid.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Clock, MessageCircle, Users } from 'lucide-react';
import {
  getCategoryLabel,
  formatOrderBudget,
  formatDeliveryShort,
  timeAgoFull,
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
  created_at: string;
  client: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

export function OrdersGrid({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <div className="mb-4 text-6xl">📝</div>
        <p className="text-lg text-white/60">Пока нет заказов 😢</p>
        <p className="mt-2 text-sm text-white/40">
          Загляни позже или создай свой первый заказ!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {orders.map((order, i) => {
        const deadline = formatDeliveryShort(order.deadline_days);

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
          >
            <Link href={`/orders/${order.id}`}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#4FD1C5]/40 hover:shadow-2xl hover:shadow-[#4FD1C5]/20">
                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#4FD1C5]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white/90">
                        {getCategoryLabel(order.category)}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2.5 py-1 text-xs font-medium text-green-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                        Открыт
                      </span>
                    </div>
                    <span className="text-xs text-white/30">
                      {timeAgoFull(order.created_at)}
                    </span>
                  </div>

                  <h3 className="display-title text-2xl font-bold text-white transition group-hover:text-[#4FD1C5]">
                    {order.title}
                  </h3>

                  {order.description && (
                    <p className="mt-2 line-clamp-3 text-sm text-white/50">
                      {order.description}
                    </p>
                  )}

                  {order.tags && order.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {order.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-white/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
                    {order.client.avatar_url ? (
                      <img
                        src={order.client.avatar_url}
                        alt={order.client.display_name}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#4FD1C5]"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#4FD1C5] to-[#68D391] text-xs font-bold text-white">
                        {order.client.display_name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                      <span
                        className={`truncate text-sm font-medium ${
                          order.client.is_sponsor ? 'gradient-text-gold' : 'text-white/80'
                        }`}
                      >
                        {order.client.display_name}
                      </span>
                        {order.client.is_sponsor && (
                          <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-xs text-white/30">
                        @{order.client.username}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wider text-white/40">
                        Бюджет
                      </div>
                      <div className="text-2xl font-bold text-[#4FD1C5]">
                        {formatOrderBudget(order)}
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-xs text-white/40">
                        {deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {deadline}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {order.responses_count} откликов
                        </span>
                      </div>
                    </div>

                    <button className="group/btn relative overflow-hidden rounded-full border border-[#4FD1C5]/30 bg-[#4FD1C5]/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-all duration-500 hover:border-[#4FD1C5]/60 hover:bg-[#4FD1C5]/20">
                      <span className="relative z-10 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        Откликнуться
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}