// components/chats-list.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Star, Check, CheckCheck } from 'lucide-react';
import { timeAgo } from '@/lib/constants';

type Chat = {
  id: number;
  other: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  } | null;
  last_message: string | null;
  last_message_at: string | null;
  unread: number;
  last_sender_id?: string | null;
  is_read?: boolean;
};

export function ChatsList({
  chats,
  currentUserId,
}: {
  chats: Chat[];
  currentUserId?: string;
}) {
  if (chats.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <MessageCircle className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg text-white/60">Пока нет чатов</p>
        <p className="mt-2 text-sm text-white/40">
          Начни общение на странице услуги или заказа
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat, i) => {
        if (!chat.other) return null;

        const hasUnread = chat.unread > 0;
        const isMineLast = chat.last_sender_id === currentUserId;
        const isReadByOther = chat.is_read;

        return (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Link href={`/chat/${chat.id}`}>
              <div
                className={`group relative flex items-center gap-4 rounded-2xl border p-4 backdrop-blur-sm transition-all hover:-translate-y-0.5 ${
                  hasUnread
                    ? 'border-[#6C63FF]/40 bg-[#6C63FF]/5 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/10'
                    : 'border-white/5 bg-[#16161f]/40 hover:border-white/10 hover:bg-[#16161f]/60'
                }`}
              >
                <div className="relative shrink-0">
                  {chat.other.avatar_url ? (
                    <img
                      src={chat.other.avatar_url}
                      alt={chat.other.display_name}
                      className={`h-14 w-14 rounded-full object-cover ring-2 transition group-hover:ring-[#6C63FF] ${
                        hasUnread ? 'ring-[#6C63FF]/60' : 'ring-white/10'
                      }`}
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xl font-bold text-white">
                      {chat.other.display_name[0]?.toUpperCase()}
                    </div>
                  )}

                  {hasUnread && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] px-1.5 text-[10px] font-bold text-white shadow-lg shadow-[#6C63FF]/50"
                    >
                      {chat.unread > 99 ? '99+' : chat.unread}
                    </motion.div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span
                        className={`truncate ${
                          hasUnread
                            ? 'font-bold text-white'
                            : 'font-semibold text-white/90'
                        }`}
                      >
                        {chat.other.display_name}
                      </span>
                      {chat.other.is_sponsor && (
                        <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span
                      className={`shrink-0 text-xs ${
                        hasUnread ? 'font-medium text-[#B794F6]' : 'text-white/40'
                      }`}
                    >
                      {timeAgo(chat.last_message_at)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    {isMineLast && (
                      <span className="shrink-0">
                        {isReadByOther ? (
                          <CheckCheck className="h-3.5 w-3.5 text-[#4FD1C5]" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-white/40" />
                        )}
                      </span>
                    )}

                    <p
                      className={`line-clamp-1 text-sm ${
                        hasUnread
                          ? 'font-medium text-white'
                          : 'text-white/50'
                      }`}
                    >
                      {chat.last_message || 'Нет сообщений'}
                    </p>
                  </div>
                </div>

                {hasUnread && (
                  <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-[#6C63FF] to-[#B794F6]" />
                )}
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}