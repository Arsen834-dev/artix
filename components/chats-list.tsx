'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Star } from 'lucide-react';

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
};

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} мин`;
  if (diffH < 24) return `${diffH} ч`;
  if (diffD < 7) return `${diffD} дн`;
  return date.toLocaleDateString('ru-RU');
}

export function ChatsList({ chats }: { chats: Chat[] }) {
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

        return (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <Link href={`/chat/${chat.id}`}>
              <div className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#16161f]/40 p-4 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#6C63FF]/40 hover:bg-[#16161f]/60">
                <div className="relative shrink-0">
                  {chat.other.avatar_url ? (
                    <img
                      src={chat.other.avatar_url}
                      alt={chat.other.display_name}
                      className="h-14 w-14 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xl font-bold text-white">
                      {chat.other.display_name[0]?.toUpperCase()}
                    </div>
                  )}
                  {chat.unread > 0 && (
                    <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6C63FF] px-1 text-[10px] font-bold text-white">
                      {chat.unread}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-semibold text-white">
                        {chat.other.display_name}
                      </span>
                      {chat.other.is_sponsor && (
                        <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-white/40">
                      {timeAgo(chat.last_message_at)}
                    </span>
                  </div>
                  <p
                    className={`mt-1 line-clamp-1 text-sm ${
                      chat.unread > 0
                        ? 'font-medium text-white'
                        : 'text-white/50'
                    }`}
                  >
                    {chat.last_message || 'Нет сообщений'}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}