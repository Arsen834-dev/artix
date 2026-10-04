'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0a0a0f] p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/80 p-8 text-center backdrop-blur-2xl"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-10 w-10 text-red-400" />
        </div>

        <h1 className="display-title text-3xl font-bold text-white">
          Ошибка подтверждения
        </h1>

        <p className="mt-4 text-sm text-white/60">
          Ссылка недействительна или истекла. Попробуй зарегистрироваться снова.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/auth/sign-up"
            className="block rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Зарегистрироваться снова
          </Link>
          <Link
            href="/auth/login"
            className="block text-sm text-white/50 hover:text-[#B794F6]"
          >
            Или войти
          </Link>
        </div>
      </motion.div>
    </div>
  );
}