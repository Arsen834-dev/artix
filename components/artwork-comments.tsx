// components/artwork-comments.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Loader2,
  Trash2,
  Star,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRequireAuth, useUser } from './auth-provider';

type Comment = {
  id: number;
  artwork_id: number;
  author_id: string;
  text: string;
  created_at: string;
  author?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
    is_sponsor: boolean;
  };
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'только что';
  if (diffMin < 60) return `${diffMin} мин назад`;
  if (diffH < 24) return `${diffH} ч назад`;
  if (diffD < 7) return `${diffD} дн назад`;
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function ArtworkComments({
  artworkId,
  artworkOwnerId,
}: {
  artworkId: number;
  artworkOwnerId: string;
}) {
  const user = useUser();
  const requireAuth = useRequireAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 🎯 Загрузка комментариев
  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      const { data, error } = await supabase
        .from('artwork_comments')
        .select(`
          id, artwork_id, author_id, text, created_at,
          author:profiles!artwork_comments_author_id_fkey (username, display_name, avatar_url, is_sponsor)
        `)
        .eq('artwork_id', artworkId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      const formatted = (data || []).map((c: any) => ({
        ...c,
        author: Array.isArray(c.author) ? c.author[0] : c.author,
      }));

      setComments(formatted);
      setIsLoading(false);
    };

    load();

    // 🎯 Realtime — новые комментарии
    const channel = supabase
      .channel(`comments-${artworkId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'artwork_comments',
          filter: `artwork_id=eq.${artworkId}`,
        },
        async (payload) => {
          const newComment = payload.new as Comment;

          // Подгружаем автора
          const { data: author } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url, is_sponsor')
            .eq('id', newComment.author_id)
            .single();

          setComments((prev) => {
            if (prev.some((c) => c.id === newComment.id)) return prev;
            return [{ ...newComment, author: author || undefined }, ...prev];
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'artwork_comments',
          filter: `artwork_id=eq.${artworkId}`,
        },
        (payload) => {
          const deletedId = payload.old.id;
          setComments((prev) => prev.filter((c) => c.id !== deletedId));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [artworkId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setIsSending(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setError('Нужно войти');
        setIsSending(false);
        return;
      }

      // Оптимистично добавляем
      const optimistic: Comment = {
        id: Date.now(),
        artwork_id: artworkId,
        author_id: authUser.id,
        text: trimmed,
        created_at: new Date().toISOString(),
        author: {
          username: '',
          display_name: 'Ты',
          avatar_url: null,
          is_sponsor: false,
        },
      };
      setComments((prev) => [optimistic, ...prev]);
      setText('');

      const { data, error: insertError } = await supabase
        .from('artwork_comments')
        .insert({
          artwork_id: artworkId,
          author_id: authUser.id,
          text: trimmed,
        })
        .select('id, artwork_id, author_id, text, created_at')
        .single();

      if (insertError) throw insertError;

      // Заменяем optimistic на реальный
      setComments((prev) =>
        prev.map((c) =>
          c.id === optimistic.id ? { ...(data as Comment), author: c.author } : c,
        ),
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка отправки');
    } finally {
      setIsSending(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить комментарий?')) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('artwork_comments')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Ошибка: ' + error.message);
      return;
    }

    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleWriteClick = () => {
    requireAuth(() => {
      textareaRef.current?.focus();
    }, 'комментарии');
  };

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[#B794F6]" />
        <h3 className="display-title text-xl font-bold text-white">
          Комментарии
        </h3>
        {comments.length > 0 && (
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/50">
            {comments.length}
          </span>
        )}
      </div>

      {/* Форма отправки */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#16161f]/60 p-4 backdrop-blur-sm">
        {user ? (
          <>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напиши комментарий..."
              rows={3}
              maxLength={1000}
              disabled={isSending}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20 disabled:opacity-50"
            />
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-white/30">
                {text.length}/1000 · Ctrl+Enter — отправить
              </div>
              <button
                onClick={handleSend}
                disabled={!text.trim() || isSending}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-5 py-2 text-sm font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Отправить
              </button>
            </div>
            {error && (
              <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-300">
                {error}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={handleWriteClick}
            className="w-full rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-white/50 transition hover:border-[#6C63FF]/30 hover:bg-white/[0.04] hover:text-white"
          >
            Войди, чтобы оставить комментарий
          </button>
        )}
      </div>

      {/* Список комментариев */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-[#16161f]/40 p-10 text-center">
          <MessageCircle className="mx-auto mb-3 h-10 w-10 text-white/20" />
          <p className="text-sm text-white/50">Пока нет комментариев</p>
          <p className="mt-1 text-xs text-white/30">
            Будь первым, кто оставит отзыв
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {comments.map((comment) => {
              const isAuthor = comment.author_id === user?.id;
              const isOwner = comment.author_id === artworkOwnerId;
              const canDelete = isAuthor || user?.id === artworkOwnerId;

              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="group relative flex items-start gap-3 rounded-2xl border border-white/5 bg-[#16161f]/60 p-4 backdrop-blur-sm transition hover:border-white/10"
                >
                  {/* Аватар */}
                  <Link
                    href={
                      comment.author?.username
                        ? `/artist/${comment.author.username}`
                        : '#'
                    }
                    className="shrink-0"
                  >
                    {comment.author?.avatar_url ? (
                      <img
                        src={comment.author.avatar_url}
                        alt=""
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-sm font-bold text-white">
                        {comment.author?.display_name?.[0]?.toUpperCase() || '?'}
                      </div>
                    )}
                  </Link>

                  {/* Контент */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={
                          comment.author?.username
                            ? `/artist/${comment.author.username}`
                            : '#'
                        }
                        className={`text-sm font-semibold ${
                          comment.author?.is_sponsor
                            ? 'gradient-text-gold'
                            : 'text-white hover:text-[#B794F6]'
                        }`}
                      >
                          {comment.author?.display_name || 'Пользователь'}
                      </Link>
                      {comment.author?.is_sponsor && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                      {isOwner && (
                        <span className="rounded-full bg-[#6C63FF]/20 px-2 py-0.5 text-[10px] font-medium text-[#B794F6]">
                          автор
                        </span>
                      )}
                      <span className="text-xs text-white/30">
                        {timeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-white/80">
                      {comment.text}
                    </p>
                  </div>

                  {/* Удалить */}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/30 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Удалить"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}