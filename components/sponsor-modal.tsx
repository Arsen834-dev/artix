// components/sponsor-modal.tsx
'use client';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  CreditCard,
  MessageCircle,
} from 'lucide-react';

// 🎯 Реквизиты из ENV (fallback — на случай, если не заданы)
const SPONSOR_CARD =
  process.env.NEXT_PUBLIC_SPONSOR_CARD || '2202 2088 7480 3472';
const SPONSOR_DISCORD =
  process.env.NEXT_PUBLIC_SPONSOR_DISCORD || 'fl4wer834';

export function SponsorModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');

useBodyScrollLock(true);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
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
        className="fixed inset-0 z-[99999] overflow-y-auto bg-black/90 backdrop-blur-md"
        onClick={onClose}
        data-lenis-prevent
        style={{ isolation: 'isolate' }}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-yellow-400/20 bg-gradient-to-b from-[#1a1620] to-[#0f0d14]"
            data-lenis-prevent
          >
            <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-400/30 blur-[100px]" />

            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/60 backdrop-blur transition hover:bg-black/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative border-b border-white/5 p-6 pt-8 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-2xl shadow-yellow-400/50"
              >
                <Crown className="h-7 w-7 fill-white text-white" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-yellow-400 blur-xl"
                />
              </motion.div>

              <h2 className="display-title text-2xl font-bold text-white">
                Стань <span className="gradient-text">спонсором</span>
              </h2>
              <p className="mt-1 text-xs text-white/60">
                Поддержи Artix и получи золотой значок
              </p>
            </div>

            <div className="space-y-4 p-5">
              <div className="relative overflow-hidden rounded-2xl border-2 border-yellow-400/40 bg-gradient-to-br from-yellow-400/10 via-orange-400/5 to-transparent p-5">
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-lg">
                  <Zap className="h-3 w-3 fill-current" />
                  ХИТ
                </div>

                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="display-title text-5xl font-bold text-white">
                      150
                    </span>
                    <span className="text-xl font-bold text-white/60">₽</span>
                  </div>
                  <div className="mt-1 text-xs font-medium text-yellow-400">
                    разово
                  </div>
                </div>

                <ul className="mt-5 space-y-2.5">
                  <Perk icon={Crown} text="Золотой значок PRO навсегда" />
                  <Perk icon={Sparkles} text="Приоритет в ленте" />
                  <Perk icon={Star} text="Отдельный цвет рамки профиля" />
                  <Perk icon={Heart} text="Упоминание в списке спонсоров" />
                </ul>
              </div>

              {step === 'info' && (
                <button
                  onClick={() => setStep('payment')}
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3.5 font-bold text-black shadow-2xl shadow-yellow-400/40 transition-all hover:scale-[1.02]"
                >
                  <Heart className="mr-2 inline-block h-5 w-5 fill-current" />
                  Поддержать за 150₽
                </button>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                      <CreditCard className="h-3.5 w-3.5" />
                      Номер карты
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-white">
                        {SPONSOR_CARD}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400/20 text-yellow-400 transition hover:bg-yellow-400/30"
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                      <MessageCircle className="h-3.5 w-3.5" />
                      После перевода
                    </div>
                    <p className="text-xs text-white/70">
                      Напиши в Discord{' '}
                      <span className="font-medium text-yellow-400">
                        {SPONSOR_DISCORD}
                      </span>{' '}
                      — пришли скриншот и username. Выдадим PRO в течение 24
                      часов.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('info')}
                    className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-medium text-white/60 transition hover:border-white/20 hover:text-white"
                  >
                    ← Назад
                  </button>
                </motion.div>
              )}

              <p className="text-center text-[10px] text-white/30">
                Оплата — прямой перевод. Мы не берём комиссию.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}

function Perk({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-400/20">
        <Icon className="h-3 w-3 fill-yellow-400 text-yellow-400" />
      </div>
      <span className="text-white/80">{text}</span>
    </li>
  );
}