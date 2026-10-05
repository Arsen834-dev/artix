// components/auth-required-modal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock';

export function AuthRequiredModal({
  onClose,
  action = 'это действие',
}: {
  onClose: () => void;
  action?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useBodyScrollLock(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-md"
        onClick={onClose}
        data-lenis-prevent
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-[#6C63FF]/30 bg-gradient-to-b from-[#1a1620] to-[#0f0d14] p-8"
        >
          <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#6C63FF]/40 blur-[100px]" />

          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <h2 className="display-title text-center text-2xl font-bold text-white">
            Требуется <span className="gradient-text">вход</span>
          </h2>
          <p className="mt-3 text-center text-sm text-white/60">
            Чтобы использовать {action}, нужно войти или создать аккаунт. Это
            займёт 30 секунд.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/auth/login"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all duration-500 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                <LogIn className="h-4 w-4" />
                Войти
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
            </Link>

            <Link
              href="/auth/sign-up"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-500 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/20"
            >
              <UserPlus className="h-4 w-4" />
              Зарегистрироваться
            </Link>
          </div>

          <p className="mt-5 text-center text-[10px] text-white/30">
            Регистрация бесплатна. Займёт меньше минуты.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}