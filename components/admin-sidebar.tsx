// components/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flag,
  Users,
  Handshake,
  ArrowLeft,
} from 'lucide-react';

const ITEMS = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { href: '/admin/reports', label: 'Жалобы', icon: Flag },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/deals', label: 'Споры', icon: Handshake },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/5 bg-[#0a0a0f]/60 p-4 backdrop-blur-xl md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:w-64 md:border-b-0 md:border-r">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        На сайт
      </Link>

      <div className="mb-6 hidden md:block">
        <div className="text-xs uppercase tracking-widest text-white/40">
          Админка
        </div>
        <div className="mt-1 text-lg font-bold">
          <span className="gradient-text">Artix</span>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto md:flex-col">
        {ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-[#6C63FF]/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}