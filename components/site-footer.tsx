// components/site-footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Github, Send, Mail } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-[#0a0a0f]/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Лого + описание */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Artix"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="text-xl font-bold">
                <span className="gradient-text">Artix</span>
              </span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-white/50">
              Космическая галерея художников и их заказчиков. Найди своего
              художника или предложи свои работы вселенной.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <div className="mb-4 text-xs uppercase tracking-widest text-white/40">
              Платформа
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/feed"
                  className="text-white/60 transition hover:text-white"
                >
                  Галерея
                </Link>
              </li>
              <li>
                <Link
                  href="/artists"
                  className="text-white/60 transition hover:text-white"
                >
                  Художники
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/60 transition hover:text-white"
                >
                  О проекте
                </Link>
              </li>
            </ul>
          </div>

          {/* Юридическое */}
          <div>
            <div className="mb-4 text-xs uppercase tracking-widest text-white/40">
              Правовое
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-white/60 transition hover:text-white"
                >
                  Пользовательское соглашение
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-white/60 transition hover:text-white"
                >
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-white/60 transition hover:text-white"
                >
                  Войти
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Низ */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-white/40 md:flex-row">
          <div>© 2026 Artix. Вселенная искусств.</div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#B794F6]" />
            Сделано с любовью к космосу
          </div>
        </div>
      </div>
    </footer>
  );
}