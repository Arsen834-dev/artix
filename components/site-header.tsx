// components/site-header.tsx
'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Image as ImageIcon,
  Briefcase,
  ShoppingBag,
  Users,
  Info,
  MessageCircle,
  Handshake,
} from 'lucide-react';
import { UserMenu } from './user-menu';
import { NotificationsBell } from './notifications-bell';
import { useUser } from './auth-provider';

export function SiteHeader() {
  const pathname = usePathname();
  const user = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === '/';
  const isChat = pathname.startsWith('/chat/');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Не рендерим на главной и в чате
  if (isHome || isChat) return null;

  const navItems = [
    { href: '/feed', label: 'Работы', icon: ImageIcon },
    { href: '/services', label: 'Услуги', icon: Briefcase },
    { href: '/orders', label: 'Заказы', icon: ShoppingBag },
    { href: '/deals', label: 'Сделки', icon: Handshake, requiresAuth: true },
    { href: '/artists', label: 'Художники', icon: Users },
    { href: '/about', label: 'О проекте', icon: Info },
  ];

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresAuth || user,
  );

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[60] transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/5 bg-[#0a0a0f]/95 py-3 backdrop-blur-xl'
            : 'bg-[#0a0a0f]/70 py-4 backdrop-blur-md'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between gap-4 px-4">
          {/* ЛОГО */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <NextImage
                src="/logo.png"
                alt="Artix"
                width={32}
                height={32}
                className="object-contain drop-shadow-[0_0_10px_rgba(108,99,255,0.5)]"
                priority
              />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Artix</span>
            </span>
          </Link>

          {/* НАВИГАЦИЯ — DESKTOP */}
          <nav className="hidden items-center gap-1 md:flex">
            {visibleNavItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 lg:px-4 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="header-active"
                      className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-[#B794F6] to-transparent"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ДЕЙСТВИЯ */}
          <div className="flex items-center gap-2">
            <NotificationsBell />

            <Link
              href="/messages"
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white"
              aria-label="Сообщения"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>

            <div className="hidden sm:block">
              <UserMenu />
            </div>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white md:hidden"
              aria-label="Меню"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* МОБИЛЬНОЕ МЕНЮ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-[80] h-full w-72 border-l border-white/10 bg-[#0a0a0f]/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex h-full flex-col p-6">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-lg font-bold">
                    <span className="gradient-text">Artix</span>
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <nav className="flex-1 space-y-1">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                  >
                    <Home className="h-4 w-4" />
                    Главная
                  </Link>
                  {visibleNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                          isActive
                            ? 'bg-[#6C63FF]/10 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-white/5 pt-4">
                  <UserMenu />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}