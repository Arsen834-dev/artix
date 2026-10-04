'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Palette, ShoppingBag } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'artist';
  const isArtist = role === 'artist';

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0a0a0f] p-6">
      {/* Фон */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#6C63FF]/15 blur-[120px]" />
        <div className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full bg-[#4FD1C5]/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/80 p-8 text-center backdrop-blur-2xl"
      >
        {/* Иконка */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40"
        >
          <Mail className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="display-title text-3xl font-bold text-white"
        >
          Проверь <span className="gradient-text">почту</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 text-sm leading-relaxed text-white/60"
        >
          Мы отправили письмо с подтверждением. Перейди по ссылке в письме,
          чтобы активировать аккаунт.
        </motion.p>

        {/* Роль */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3"
        >
          {isArtist ? (
            <Palette className="h-5 w-5 text-[#B794F6]" />
          ) : (
            <ShoppingBag className="h-5 w-5 text-[#4FD1C5]" />
          )}
          <div className="text-left">
            <div className="text-xs text-white/40">Ты регистрируешься как</div>
            <div className="font-semibold text-white">
              {isArtist ? 'Художник 🎨' : 'Заказчик 🛒'}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <Link
            href="/auth/login"
            className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
              Войти после подтверждения
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-4 text-xs text-white/30"
        >
          Не пришло письмо? Проверь спам или{' '}
          <Link
            href="/auth/sign-up"
            className="text-[#B794F6] underline-offset-4 hover:underline"
          >
            зарегистрируйся снова
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-[#0a0a0f]">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#6C63FF]" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}