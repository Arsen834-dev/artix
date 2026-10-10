// components/sponsor-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Star,
  Heart,
  Sparkles,
  Check,
  Crown,
  Zap,
  Copy,
  MessageCircle,
  Wallet,
  Info,
} from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

// 🎯 Реквизиты из ENV (fallback — те же значения)
const SPONSOR_CARD =
  process.env.NEXT_PUBLIC_SPONSOR_CARD || '2202 2088 7480 3472';

/**
 * 🎯 Золотые частицы — floating точки по модалке
 */
function GoldParticles() {
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 8 + 6,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-yellow-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.6)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

/**
 * 🎯 Карта с голограммой и бликом
 */
function GoldenCard({
  cardNumber,
  onCopy,
  copied,
}: {
  cardNumber: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div
      className="group relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl"
      style={{
        background:
          'linear-gradient(135deg, #f6d365 0%, #fda085 25%, #d4af37 50%, #f6d365 75%, #fda085 100%)',
        backgroundSize: '200% 200%',
        animation: 'shine 6s ease-in-out infinite',
        boxShadow:
          '0 20px 60px rgba(251, 191, 36, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Голограмма */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-60"
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, rgba(255, 0, 255, 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(0, 255, 255, 0.4) 0%, transparent 40%)',
            'radial-gradient(circle at 80% 30%, rgba(255, 255, 0, 0.4) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(0, 255, 255, 0.4) 0%, transparent 40%)',
            'radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.4) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Блик при hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </div>

      {/* Верхний ряд: лого + чип */}
      <div className="relative flex items-start justify-between p-5">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 fill-black/80 text-black/80" />
          <span className="text-sm font-bold tracking-wider text-black/80">
            ARTIX
          </span>
        </div>
        {/* Чип */}
        <div className="relative h-8 w-11 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 shadow-inner">
          <div className="absolute inset-0.5 rounded-[4px] border border-yellow-700/30">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-yellow-700/30" />
            <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-yellow-700/30" />
          </div>
        </div>
      </div>

      {/* Середина: номер карты */}
      <div className="relative px-5">
        <div className="mb-1 text-[10px] uppercase tracking-widest text-black/50">
          Номер карты
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-lg font-bold tracking-wider text-black/90 drop-shadow-sm sm:text-xl">
            {cardNumber}
          </span>
          <button
            onClick={onCopy}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/20 text-black transition hover:bg-black/30"
            aria-label="Скопировать"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Нижний ряд: имя + срок */}
      <div className="relative mt-3 flex items-end justify-between px-5 pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-black/50">
            Владелец
          </div>
          <div className="text-sm font-bold tracking-wider text-black/90">
            ARTIX PROJECT
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-black/50">
            Спонсор
          </div>
          <div className="text-sm font-bold tracking-wider text-black/90">
            PRO
          </div>
        </div>
      </div>

      {/* Тиснение */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.3em] text-black/30">
        Artix Sponsor Card
      </div>
    </div>
  );
}

export function SponsorModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');

  useBodyScrollLock(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(SPONSOR_CARD.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/95 p-4 backdrop-blur-md"
        onClick={onClose}
        data-lenis-prevent
        style={{ isolation: 'isolate' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-yellow-400/30 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
          data-lenis-prevent
        >
          {/* 🎯 Золотое свечение сзади */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-yellow-400/30 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-40 right-0 h-64 w-64 rounded-full bg-orange-400/20 blur-[100px]" />

          {/* 🎯 Анимированный коронный фон — вращающийся градиент */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, rgba(251, 191, 36, 0.8) 25%, transparent 50%, rgba(251, 191, 36, 0.8) 75%, transparent 100%)',
              filter: 'blur(40px)',
            }}
          />

          {/* 🎯 Золотые частицы */}
          <GoldParticles />

          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur transition hover:bg-black/80 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Шапка с короной */}
          <div className="relative border-b border-white/5 p-6 pt-10 text-center">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500 shadow-2xl shadow-yellow-400/60"
            >
              <Crown className="h-8 w-8 fill-white text-white" />
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-yellow-400 blur-2xl"
              />
              {/* Орбитальные лучи */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-[-12px]"
              >
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <div
                    key={deg}
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-yellow-300"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-24px)`,
                      boxShadow: '0 0 8px rgba(251, 191, 36, 0.8)',
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="display-title text-3xl font-bold text-white"
            >
              Стань <span className="gradient-text">спонсором</span>
            </motion.h2>
            <p className="mt-2 text-sm text-white/60">
              Поддержи Artix и получи золотой значок PRO
            </p>
          </div>

          <div className="space-y-5 p-5">
            {/* Список перков */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-transparent p-5">
              {/* Пульсирующий ХИТ */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-[10px] font-bold text-black shadow-lg shadow-yellow-400/50"
              >
                <Zap className="h-3 w-3 fill-current" />
                ХИТ
              </motion.div>

              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="display-title text-5xl font-bold text-white">
                    150
                  </span>
                  <span className="text-xl font-bold text-white/60">₽</span>
                </div>
                <div className="mt-1 text-xs font-medium text-yellow-400">
                  разово · навсегда
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                <Perk icon={Crown} text="Золотой значок PRO навсегда" />
                <Perk icon={Sparkles} text="Приоритет в ленте" />
                <Perk icon={Star} text="Отдельный цвет рамки профиля" />
                <Perk icon={Heart} text="Упоминание в списке спонсоров" />
              </ul>
            </div>

            {/* Кнопка «Поддержать» */}
            {step === 'info' && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setStep('payment')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-[length:200%_100%] px-6 py-4 font-bold text-black shadow-2xl shadow-yellow-400/40 transition-all hover:bg-[position:100%_0]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 fill-current" />
                  Поддержать за 150₽
                </span>
              </motion.button>
            )}

            {/* Шаг 2: оплата */}
            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* 🎯 Золотая карта */}
                <GoldenCard
                  cardNumber={SPONSOR_CARD}
                  onCopy={handleCopy}
                  copied={copied}
                />

                {/* 🎯 Текст про личку */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                    <MessageCircle className="h-3.5 w-3.5" />
                    После перевода
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">
                    Напиши мне{' '}
                    <Link
                      href="/messages"
                      onClick={onClose}
                      className="font-medium text-yellow-400 underline-offset-4 transition hover:underline"
                    >
                      в личку на Artix
                    </Link>{' '}
                    — пришли скриншот оплаты. Выдам PRO в течение 24 часов.
                  </p>
                </div>

                {/* Инфо */}
                <div className="flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-[11px] leading-relaxed text-white/60">
                  <Info className="mt-0.5 h-3 w-3 shrink-0 text-yellow-400" />
                  <span>
                    Оплата — прямой перевод на карту. Artix не берёт комиссию.
                    Спонсорство — добровольный донат.
                  </span>
                </div>

                <button
                  onClick={() => setStep('info')}
                  className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
                >
                  ← Назад
                </button>
              </motion.div>
            )}

            {/* Нижний дисклеймер */}
            <p className="text-center text-[10px] text-white/30">
              Спонсорство — добровольная поддержка проекта. Не является
              обязательством или подпиской.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function Perk({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-400/20 shadow-inner">
        <Icon className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      </div>
      <span className="text-white/80">{text}</span>
    </li>
  );
}