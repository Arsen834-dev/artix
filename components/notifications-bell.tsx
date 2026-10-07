// components/notifications-bell.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Handshake, MessageCircle, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './auth-provider';

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

const TYPE_ICONS: Record<string, any> = {
  deal_created: Handshake,
  deal_status_change: Handshake,
  deal_work_completed: Check,
  deal_auto_confirmed: CheckCheck,
  message: MessageCircle,
  review: Star,
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'сейчас';
  if (diffMin < 60) return `${diffMin} мин`;
  if (diffH < 24) return `${diffH} ч`;
  if (diffD < 7) return `${diffD} дн`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export function NotificationsBell() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🎯 Загружаем последние 10 уведомлений + счётчик
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    const load = async () => {
      const [listRes, countRes] = await Promise.all([
        supabase
          .from('notifications')
          .select('id, type, title, message, link, is_read, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.rpc('get_unread_notifications_count'),
      ]);

      setNotifications(listRes.data || []);
      setUnreadCount(Number(countRes.data) || 0);
      setIsLoading(false);
    };

    load();

    // 🎯 Realtime — новые уведомления
    const channel = supabase
      .channel('notifications-bell')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const n = payload.new as Notification;
          setNotifications((prev) => [n, ...prev].slice(0, 10));
          setUnreadCount((c) => c + 1);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 🎯 Закрытие по клику вне
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [open]);

  const handleMarkAllRead = async () => {
    const supabase = createClient();
    await supabase.rpc('mark_all_notifications_read');
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const handleClickNotification = async (n: Notification) => {
    const supabase = createClient();
    if (!n.is_read) {
      await supabase.rpc('mark_notification_read', {
        p_notification_id: n.id,
      });
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.link) {
      router.push(n.link);
    }
  };

  // Если не залогинен — не показываем колокольчик
  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🎯 Колокольчик */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition hover:border-white/20 hover:text-white"
        aria-label="Уведомления"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] px-1.5 text-[10px] font-bold text-white shadow-lg shadow-[#6C63FF]/50"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* 🎯 Дропдаун */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-[100] mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#16161f]/95 backdrop-blur-xl shadow-2xl"
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between border-b border-white/5 p-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Уведомления</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#6C63FF]/20 px-2 py-0.5 text-xs font-medium text-[#B794F6]">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-white/40 transition hover:text-[#B794F6]"
                >
                  Прочитать все
                </button>
              )}
            </div>

            {/* Список */}
            <div className="max-h-96 overflow-y-auto" data-lenis-prevent>
              {isLoading ? (
                <div className="space-y-2 p-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 animate-pulse rounded-xl bg-white/5"
                    />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto mb-3 h-10 w-10 text-white/20" />
                  <p className="text-sm text-white/50">Пока нет уведомлений</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((n) => {
                    const Icon = TYPE_ICONS[n.type] || Bell;
                    return (
                      <button
                        key={n.id}
                        onClick={() => handleClickNotification(n)}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-white/5 ${
                          !n.is_read ? 'bg-[#6C63FF]/5' : ''
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            !n.is_read
                              ? 'bg-[#6C63FF]/20 text-[#B794F6]'
                              : 'bg-white/5 text-white/50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm ${
                              !n.is_read
                                ? 'font-semibold text-white'
                                : 'text-white/70'
                            }`}
                          >
                            {n.title}
                          </div>
                          {n.message && (
                            <div className="mt-0.5 line-clamp-2 text-xs text-white/50">
                              {n.message}
                            </div>
                          )}
                          <div className="mt-1 text-[10px] text-white/30">
                            {timeAgo(n.created_at)}
                          </div>
                        </div>
                        {!n.is_read && (
                          <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#6C63FF]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="block border-t border-white/5 p-3 text-center text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
              >
                Все уведомления
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}