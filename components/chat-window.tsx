'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Send, Star, Loader2 } from 'lucide-react';

type Message = {
  id: number;
  sender_id: string;
  text: string;
  created_at: string;
};

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_sponsor: boolean;
};

export function ChatWindow({
  chatId,
  userId,
  other,
  initialMessages,
}: {
  chatId: number;
  userId: string;
  other: Profile;
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Скролл вниз
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 🎯 Realtime подписка
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`chat-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  // 🎯 Отправка
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    // Оптимистично добавляем
    const tempId = Date.now();
    const optimistic: Message = {
      id: tempId,
      sender_id: userId,
      text: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText('');

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          text: trimmed,
        })
        .select()
        .single();

      if (error) throw error;

      // Заменяем temp на реальный
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Message) : m))
      );
    } catch (err) {
      console.error(err);
      // Удаляем оптимистичное
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setText(trimmed);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f]">
      {/* HEADER */}
      <div className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/messages"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <Link
            href={`/artist/${other.username}`}
            className="group flex items-center gap-3"
          >
            {other.avatar_url ? (
              <img
                src={other.avatar_url}
                alt={other.display_name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-sm font-bold text-white">
                {other.display_name[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white transition group-hover:text-[#B794F6]">
                  {other.display_name}
                </span>
                {other.is_sponsor && (
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                )}
              </div>
              <div className="text-xs text-white/40">
                @{other.username}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl space-y-3 px-4 py-6">
          {messages.length === 0 && (
            <div className="py-20 text-center">
              <div className="mb-4 text-5xl">💬</div>
              <p className="text-white/60">Начни диалог!</p>
              <p className="mt-2 text-sm text-white/40">
                Напиши первое сообщение
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isMine = msg.sender_id === userId;
            const prevMsg = messages[i - 1];
            const showAvatar = !isMine && (!prevMsg || prevMsg.sender_id !== msg.sender_id);

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                {/* Аватар собеседника */}
                {!isMine && showAvatar && (
                  <div className="shrink-0">
                    {other.avatar_url ? (
                      <img
                        src={other.avatar_url}
                        alt=""
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-[10px] font-bold text-white">
                        {other.display_name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                )}
                {!isMine && !showAvatar && <div className="w-7" />}

                {/* Пузырь */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? 'rounded-br-sm bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-white'
                      : 'rounded-bl-sm border border-white/5 bg-[#16161f]/80 text-white/90'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                  <div
                    className={`mt-1 text-[10px] ${
                      isMine ? 'text-white/60' : 'text-white/30'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* INPUT */}
      <div className="border-t border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-end gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-[#6C63FF]/50 focus-within:ring-2 focus-within:ring-[#6C63FF]/20">
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напиши сообщение..."
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{
                minHeight: '36px',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-white shadow-lg shadow-[#6C63FF]/30 transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] text-white/30">
            Enter — отправить, Shift+Enter — новая строка
          </div>
        </div>
      </div>
    </div>
  );
}