// components/chat-window.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  Send,
  Star,
  Loader2,
  ChevronDown,
  Smile,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { OnlineIndicator } from './online-indicator';

type Message = {
  id: number;
  sender_id: string;
  text: string | null;
  image_url: string | null;
  message_type: string;
  created_at: string;
};

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  is_sponsor: boolean;
  last_seen_at?: string | null;
};

const EMOJIS = [
  '😀', '😂', '🥰', '😎', '🤔', '😴', '🥳', '😢',
  '😡', '🤯', '😱', '🤗', '🙃', '😇', '🤩', '😋',
  '👍', '👎', '👏', '🙏', '💪', '✌️', '🤝', '👋',
  '❤️', '🔥', '✨', '⭐', '💯', '🎉', '🎨', '🚀',
  '🐱', '🐶', '🦊', '🐉', '🌙', '🌌', '🪐', '👽',
];

const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 дней

// 🎯 Создаём supabase-клиент один раз на модуль
let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = createClient();
  }
  return supabaseClient;
}

/**
 * Получить отображаемый URL для картинки.
 * - Если это полный http(s) URL — старые данные, используем как есть.
 * - Если это path (chatId/file.jpg) — генерируем signed URL.
 */
async function resolveImageUrl(raw: string): Promise<string> {
  if (!raw) return raw;
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  const supabase = getSupabase();
  const { data } = await supabase.storage
    .from('chat-images')
    .createSignedUrl(raw, SIGNED_URL_TTL);
  return data?.signedUrl || raw;
}

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 🎯 Кеш signed URL: raw → displayUrl
  const [imageUrlCache, setImageUrlCache] = useState<Record<string, string>>({});

  useEffect(() => {
    document.body.dataset.page = 'chat';
    return () => {
      delete document.body.dataset.page;
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingChannelRef = useRef<ReturnType<
    ReturnType<typeof getSupabase>['channel']
  > | null>(null);

  // 🎯 Резолвим signed URL для всех картинок
  useEffect(() => {
    let mounted = true;
    const toResolve = messages
      .filter((m) => m.message_type === 'image' && m.image_url)
      .map((m) => m.image_url!)
      .filter((raw) => !imageUrlCache[raw] && !raw.startsWith('http'));

    if (toResolve.length === 0) return;

    (async () => {
      const updates: Record<string, string> = {};
      for (const raw of toResolve) {
        const url = await resolveImageUrl(raw);
        updates[raw] = url;
      }
      if (mounted) {
        setImageUrlCache((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎯 Realtime — новые сообщения
  useEffect(() => {
    const supabase = getSupabase();

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

          // 🎯 Если это чужое сообщение — помечаем прочитанным
          if (newMessage.sender_id !== userId) {
            supabase.rpc('mark_chat_messages_read', { p_chat_id: chatId });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, userId]);

  // 🎯 Помечаем прочитанным при открытии чата
  useEffect(() => {
    const supabase = getSupabase();
    supabase.rpc('mark_chat_messages_read', { p_chat_id: chatId });
  }, [chatId]);

  // 🎯 Индикатор «печатает» — канал в useRef, один раз
  useEffect(() => {
    const supabase = getSupabase();

    const channel = supabase.channel(`typing-${chatId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.userId !== userId) {
          setOtherTyping(true);

          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }

          typingTimeoutRef.current = setTimeout(() => {
            setOtherTyping(false);
          }, 2000);
        }
      })
      .subscribe();

    typingChannelRef.current = channel;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
      typingChannelRef.current = null;
    };
  }, [chatId, userId]);

  // 🎯 Закрыть эмодзи-пикер при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showEmojiPicker]);

  // 🎯 Отправка текста
  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);

    const tempId = Date.now();
    const optimistic: Message = {
      id: tempId,
      sender_id: userId,
      text: trimmed,
      image_url: null,
      message_type: 'text',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText('');

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          text: trimmed,
          message_type: 'text',
        })
        .select('id, sender_id, text, image_url, message_type, created_at')
        .single();

      if (error) throw error;

      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Message) : m)),
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setText(trimmed);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  // 🎯 Отправка картинки
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Только картинки');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Максимум 5MB');
      return;
    }

    setUploadingImage(true);

    try {
      const supabase = getSupabase();
      const fileExt = file.name.split('.').pop();
      // 🎯 Храним PATH, а не URL
      const filePath = `${chatId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 🎯 В БД сохраняем PATH. Signed URL сгенерируем при рендере.
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          sender_id: userId,
          text: null,
          image_url: filePath,
          message_type: 'image',
        })
        .select('id, sender_id, text, image_url, message_type, created_at')
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data as Message]);
    } catch (err: any) {
      console.error(err);
      alert('Ошибка загрузки: ' + err.message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 🎯 Вставка смайлика
  const insertEmoji = (emoji: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    const newText = text.slice(0, start) + emoji + text.slice(end);
    setText(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

  // 🎯 Broadcast «печатает» — через useRef-канал
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    typingChannelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 🎯 Получить отображаемый URL картинки
  const getDisplayUrl = (raw: string | null): string | null => {
    if (!raw) return null;
    if (raw.startsWith('http')) return raw;
    return imageUrlCache[raw] || null;
  };

  return (
    <div className="flex h-screen flex-col bg-[#0a0a0f] pt-16">
      {/* HEADER */}
      <div className="border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="container mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/messages"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <Link
            href={`/artist/${other.username}`}
            className="group flex flex-1 items-center gap-3"
          >
            <div className="relative">
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
              <OnlineIndicator lastSeenAt={other.last_seen_at} />
            </div>
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
                {otherTyping ? (
                  <span className="text-[#B794F6]">печатает...</span>
                ) : (
                  `@${other.username}`
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* MESSAGES */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
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
            const showAvatar =
              !isMine && (!prevMsg || prevMsg.sender_id !== msg.sender_id);
            const isImage = msg.message_type === 'image' && msg.image_url;
            const displayUrl = isImage ? getDisplayUrl(msg.image_url) : null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-end gap-2 ${
                  isMine ? 'justify-end' : 'justify-start'
                }`}
              >
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

                {isImage ? (
                  <div
                    className="group relative max-w-[60%] cursor-pointer overflow-hidden rounded-2xl border border-white/10"
                    onClick={() => displayUrl && setPreviewImage(displayUrl)}
                  >
                    {displayUrl ? (
                      <img
                        src={displayUrl}
                        alt=""
                        className="max-h-80 w-full object-cover transition group-hover:opacity-90"
                      />
                    ) : (
                      <div className="flex h-40 w-60 items-center justify-center bg-white/5">
                        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
                      </div>
                    )}
                    <div className="absolute bottom-1 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white/80 backdrop-blur">
                      {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine
                        ? 'rounded-br-sm bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-white'
                        : 'rounded-bl-sm border border-white/5 bg-[#16161f]/80 text-white/90'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {msg.text || ''}
                    </p>
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
                )}
              </motion.div>
            );
          })}

          {otherTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-end gap-2"
            >
              {other.avatar_url && (
                <img
                  src={other.avatar_url}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
              )}
              <div className="rounded-2xl rounded-bl-sm border border-white/5 bg-[#16161f]/80 px-4 py-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="h-1.5 w-1.5 rounded-full bg-white/40"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="h-1.5 w-1.5 rounded-full bg-white/40"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="h-1.5 w-1.5 rounded-full bg-white/40"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Кнопка «Вниз» */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-32 right-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#16161f] text-white shadow-2xl transition hover:bg-[#6C63FF]"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* INPUT */}
      <div className="relative border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              ref={emojiPickerRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-4 mb-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#16161f] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 p-3">
                <span className="text-xs font-medium text-white/70">
                  Смайлики
                </span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div
                className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto p-3"
                data-lenis-prevent
              >
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:scale-125 hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-end gap-1 rounded-3xl border border-white/10 bg-white/[0.03] p-2 focus-within:border-[#6C63FF]/50 focus-within:ring-2 focus-within:ring-[#6C63FF]/20">
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white ${
                showEmojiPicker ? 'bg-[#6C63FF]/20 text-[#B794F6]' : ''
              }`}
              aria-label="Смайлики"
            >
              <Smile className="h-5 w-5" />
            </button>

            <button              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              aria-label="Картинка"
            >
              {uploadingImage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <textarea
              ref={inputRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Напиши сообщение..."
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white placeholder:text-white/30 outline-none"
              style={{ minHeight: '36px' }}
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

      {/* Просмотр картинки */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={previewImage}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}