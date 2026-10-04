'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Heart,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';

const BOOSTY_URL = 'https://boosty.to/artix';

type Tier = {
  amount: number;
  label: string;
  months: number;
  perks: string[];
  isPopular?: boolean;
};

const TIERS: Tier[] = [
  {
    amount: 199,
    label: 'Разовый',
    months: 1,
    perks: ['Значок PRO на 1 месяц', 'Поддержка проекта'],
  },
  {
    amount: 499,
    label: 'Популярный',
    months: 3,
    perks: ['Значок PRO на 3 месяца', 'Приоритет в ленте', 'Ранний доступ к фичам'],
    isPopular: true,
  },
  {
    amount: 999,
    label: 'Про',
    months: 6,
    perks: [
      'Значок PRO на 6 месяцев',
      'Приоритет в ленте',
      'Ранний доступ',
      'Имя в списке спонсоров',
    ],
  },
];

export function SponsorModal({ onClose }: { onClose: () => void }) {
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[1]);

  const handleGoToBoosty = () => {
    window.open(BOOSTY_URL, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#16161f]"
        >
          {/* Заголовок */}
          <div className="relative overflow-hidden border-b border-white/5 p-8 text-center">
            {/* Свечение */}
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-yellow-400/30 blur-[80px]" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-2xl shadow-yellow-400/40">
                <Star className="h-8 w-8 fill-white text-white" />
              </div>
              <h2 className="display-title text-3xl font-bold text-white">
                Стать <span className="gradient-text">спонсором</span>
              </h2>
              <p className="mt-2 text-sm text-white/60">
                Поддержи Artix и получи значок PRO ⭐
              </p>
            </div>
          </div>

          {/* Тиры */}
          <div className="space-y-4 p-6">
            {TIERS.map((tier) => {
              const isSelected = selectedTier.amount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  onClick={() => setSelectedTier(tier)}
                  className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-yellow-400/60 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {tier.isPopular && (
                    <span className="absolute right-4 top-4 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold text-black">
                      ПОПУЛЯРНЫЙ
                    </span>
                  )}

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400"
                    >
                      <Check className="h-3 w-3 text-black" />
                    </motion.div>
                  )}

                  <div className={isSelected ? 'ml-7' : ''}>
                    <div className="flex items-baseline gap-2">
                      <span className="display-title text-2xl font-bold text-white">
                        {tier.amount}₽
                      </span>
                      <span className="text-sm text-white/40">
                        / {tier.months}{' '}
                        {tier.months === 1 ? 'месяц' : 'месяца'}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-medium text-[#B794F6]">
                      {tier.label}
                    </div>
                    <ul className="mt-3 space-y-1">
                      {tier.perks.map((perk, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs text-white/60"
                        >
                          <Sparkles className="h-3 w-3 text-yellow-400" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              );
            })}

            {/* Кнопка Boosty */}
            <button
              onClick={handleGoToBoosty}
              className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-4 font-semibold text-black shadow-2xl shadow-orange-500/30 transition-all duration-500 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Heart className="h-5 w-5" />
                Поддержать на Boosty
                <ExternalLink className="h-4 w-4" />
              </span>
            </button>

            <p className="text-center text-xs text-white/40">
              После оплаты напиши нам в Telegram — мы выдадим значок PRO
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}