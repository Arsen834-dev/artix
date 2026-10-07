// components/notifications-list.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  Bell,
  Check,
  CheckCheck,
  Handshake,
  MessageCircle,
  Star,
} from 'lucide-react';

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} минут назад`;
  if (diffH < 24) return `${diffH} часов назад`;
  if (diffD < 7) return `${diffD} дней назад`;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NotificationsList({
  notifications: initialNotifications,
  userId,
}: {
  notifications: Notification[];
  userId: string;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleClick = async (n: Notification) => {
    const supabase = createClient();
    if (!n.is_read) {
      await supabase.rpc('mark_notification_read', {
        p_notification_id: n.id,
      });
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)),
      );
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  const handleMarkAllRead = async () => {
    const supabase = createClient();
    await supabase.rpc('mark_all_notifications_read');
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const handleDelete = async (id: number) => {
    const supabase = createClient();
    await supabase.from('notifications').delete().eq('id', id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (notifications.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <Bell className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg text-white/60">Пока нет уведомлений</p>
        <p className="mt-2 text-sm text-white/40">
          Здесь появятся события по твоим сделкам
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Кнопка «Прочитать все» */}
      {unreadCount > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-white/50">
            Непрочитанных: <span className="text-white">{unreadCount}</span>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-[#B794F6] transition hover:text-white"
          >
            Прочитать все
          </button>
        </div>
      )}

      {/* Список */}
      <div className="space-y-2">
        {notifications.map((n, i) => {
          const Icon = TYPE_ICONS[n.type] || Bell;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className={`group relative flex items-start gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                !n.is_read
                  ? 'border-[#6C63FF]/40 bg-[#6C63FF]/5'
                  : 'border-white/5 bg-[#16161f]/40 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => handleClick(n)}
                className="flex flex-1 items-start gap-4 text-left"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    !n.is_read
                      ? 'bg-[#6C63FF]/20 text-[#B794F6]'
                      : 'bg-white/5 text-white/50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm ${
                      !n.is_read
                        ? 'font-semibold text-white'
                        : 'text-white/80'
                    }`}
                  >
                    {n.title}
                  </div>
                  {n.message && (
                    <div className="mt-1 text-sm text-white/50">
                      {n.message}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-white/30">
                    {formatDate(n.created_at)}
                  </div>
                </div>

                {!n.is_read && (
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#6C63FF]" />
                )}
              </button>

              {/* Кнопка удалить — при hover */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n.id);
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/30 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Удалить"
              >
                ×
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}