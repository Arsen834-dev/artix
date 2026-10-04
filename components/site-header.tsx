'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { UserMenu } from './user-menu';

export function SiteHeader() {
  const pathname = usePathname();

  // Скрываем на главной и загрузке
  const isHome = pathname === '/';
  if (isHome) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="flex items-center justify-center">
        <Link href="/" className="group flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center transition-transform duration-500 group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Artix"
              width={28}
              height={28}
              className="object-contain drop-shadow-[0_0_8px_rgba(108,99,255,0.5)] transition-all duration-500 group-hover:drop-shadow-[0_0_16px_rgba(108,99,255,0.8)]"
              priority
            />
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="gradient-text">Artix</span>
          </span>
        </Link>
      </div>
        {/* ДЕЙСТВИЯ */}
        <UserMenu />
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white sm:block"
          >
            Войти
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition hover:shadow-xl hover:shadow-[#6C63FF]/50"
          >
            Начать
          </Link>
        </div>
    </header>
  );
}