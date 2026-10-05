'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useRequireAuth } from './auth-provider';

export function StartChatButton({
  targetUserId,
  className = '',
  children = 'Написать',
}: {
  targetUserId: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const requireAuth = useRequireAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    requireAuth(async () => {
      setIsLoading(true);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/auth/login');
          return;
        }

        if (user.id === targetUserId) {
          alert('Это твой профиль');
          setIsLoading(false);
          return;
        }

        const [user1, user2] =
          user.id < targetUserId
            ? [user.id, targetUserId]
            : [targetUserId, user.id];

        const { data: existing } = await supabase
          .from('chats')
          .select('id')
          .eq('user1_id', user1)
          .eq('user2_id', user2)
          .single();

        if (existing) {
          router.push(`/chat/${existing.id}`);
          return;
        }

        const { data: newChat, error } = await supabase
          .from('chats')
          .insert({
            user1_id: user1,
            user2_id: user2,
          })
          .select('id')
          .single();

        if (error) throw error;

        router.push(`/chat/${newChat.id}`);
      } catch (err) {
        console.error(err);
        alert('Ошибка');
      } finally {
        setIsLoading(false);
      }
    }, 'чат');
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ||
        'group relative overflow-hidden rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-500 hover:scale-105 disabled:opacity-50'
      }
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Открываем...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          {children}
        </span>
      )}
    </button>
  );
}