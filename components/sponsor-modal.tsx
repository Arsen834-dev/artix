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
  Crown,
  Zap,
} from 'lucide-react';

const BOOSTY_URL = 'https://boosty.to/artix';

export function SponsorModal({ onClose }: { onClose: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

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
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto overflow-x-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
        >
          {/* 🎯 Свечение сверху */}
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-400/30 blur-[100px]" />

          {/* 🎯 Лучи */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <motion.div
                  key={deg}
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: [0.1, 0.3, 0.1], scaleY: [1, 1.3, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: deg / 360,
                  }}
                  className="absolute left-1/2 top-1/2 h-32 w-px origin-bottom bg-gradient-to-t from-transparent via-yellow-400/40 to-transparent"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Заголовок */}
          <div className="relative border-b border-white/5 p-8 text-center">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-2xl shadow-yellow-400/50"
            >
              <Crown className="h-10 w-10 fill-white text-white" />
              {/* Искры */}
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-yellow-400 blur-xl"
              />
            </motion.div>

            <h2 className="display-title text-3xl font-bold text-white">
              Стань <span className="gradient-text">спонсором</span>
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Поддержи Artix и получи золотой значок
            </p>
          </div>

          {/* Контент */}
          <div className="space-y-5 p-6">
            {/* 🎯 Единственный тариф 150₽ */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-transparent p-6"
            >
              {/* Бейдж «Популярный» */}
              <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-bold text-black shadow-lg">
                <Zap className="h-3 w-3 fill-current" />
                ХИТ
              </div>

              {/* Цена */}
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="display-title text-6xl font-bold text-white">
                    150
                  </span>
                  <span className="text-2xl font-bold text-white/60">₽</span>
                </div>
                <div className="mt-1 text-sm font-medium text-yellow-400">
                  разово
                </div>
              </div>

              {/* Перки */}
              <ul className="mt-6 space-y-3">
                <Perk icon={Crown} text="Золотой значок PRO навсегда" />
                <Perk icon={Sparkles} text="Приоритет в ленте" />
                <Perk icon={Star} text="Отдельный цвет рамки профиля" />
                <Perk icon={Heart} text="Упоминание в списке спонсоров" />
              </ul>

              {/* Кнопка */}
              <button
                onClick={handleGoToBoosty}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 font-bold text-black shadow-2xl shadow-yellow-400/40 transition-all hover:scale-[1.02]"
              >
                {/* Анимированный блеск */}
                <motion.div
                  animate={{
                    x: isHovered ? [0, 400] : -400,
                  }}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                  className="absolute inset-y-0 w-20 bg-white/40 blur-md"
                />
                <Heart className="relative z-10 h-5 w-5 fill-current" />
                <span className="relative z-10">Поддержать на Boosty</span>
                <ExternalLink className="relative z-10 h-4 w-4" />
              </button>
            </motion.div>

            {/* Инфо */}
            <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />
              <p className="text-xs leading-relaxed text-white/60">
                После оплаты напиши нам в{' '}
                <a
                  href="https://t.me/artix_support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 underline-offset-2 hover:underline"
                >
                  Telegram
                </a>{' '}
                — выдадим значок PRO в течение 24 часов.
              </p>
            </div>

            <p className="text-center text-[10px] text-white/30">
              Оплата через Boosty. Безопасно и легально.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Perk({
  icon: Icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400/20">
        <Icon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      </div>
      <span className="text-white/80">{text}</span>
    </li>
  );
}