// components/deals-list.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Handshake, User } from 'lucide-react';
import { DEAL_STATUS_BADGE, DEAL_STATUS_LABELS } from '@/lib/constants';

type Deal = {
  id: number;
  title: string;
  description: string | null;
  amount: number;
  status: string;
  created_at: string;
  client: any;
  artist: any;
  isClient: boolean;
};

export function DealsList({
  deals,
  userId,
}: {
  deals: Deal[];
  userId: string;
}) {
  if (deals.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <Handshake className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg text-white/60">Пока нет сделок 😢</p>
        <p className="mt-2 text-sm text-white/40">
          Создай сделку на странице услуги или заказа
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {deals.map((deal, i) => {
        const status = DEAL_STATUS_LABELS[deal.status] || DEAL_STATUS_LABELS.pending;
        const badge = DEAL_STATUS_BADGE[deal.status] || DEAL_STATUS_BADGE.pending;
        const otherPerson = deal.isClient ? deal.artist : deal.client;

        return (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link href={`/deals/${deal.id}`}>
              <div className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/20">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    #{deal.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge}`}
                  >
                    {status.label}
                  </span>
                </div>

                <h3 className="display-title text-xl font-bold text-white transition group-hover:text-[#B794F6]">
                  {deal.title}
                </h3>

                {deal.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-white/50">
                    {deal.description}
                  </p>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <User className="h-4 w-4 text-white/30" />
                  <span className="text-xs text-white/40">
                    {deal.isClient ? 'Художник' : 'Заказчик'}:
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      otherPerson?.is_sponsor ? 'gradient-text-gold' : 'text-white/70'
                    }`}
                  >
                    {otherPerson?.display_name}
                  </span> 
                </div>
                <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
                  <div>
                    <div className="text-xs text-white/40">Сумма сделки</div>
                    <div className="gradient-text text-xl font-bold">
                      {deal.amount.toLocaleString('ru-RU')}₽
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-white/30">
                    <Clock className="ml-auto h-3 w-3" />
                    {new Date(deal.created_at).toLocaleDateString('ru-RU')}
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