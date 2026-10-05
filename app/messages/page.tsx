import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ChatsList } from '@/components/chats-list';

async function ChatsContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Чаты, где я участник
  const { data: chats, error } = await supabase
    .from('chats')
    .select(`
      id, user1_id, user2_id, last_message, last_message_at,
      user1_unread, user2_unread, created_at
    `)
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error(error);
    return <div className="text-center text-white/60">Ошибка загрузки</div>;
  }

  // Профили вторых участников
  const otherIds = (chats || [])
    .map((c: any) => (c.user1_id === user.id ? c.user2_id : c.user1_id))
    .filter((id, i, arr) => arr.indexOf(id) === i);

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, is_sponsor')
    .in('id', otherIds);

  const profilesMap = new Map((profiles || []).map((p: any) => [p.id, p]));

  // 🎯 Загружаем последнее сообщение из каждого чата
  const chatIds = (chats || []).map((c: any) => c.id);

  const { data: lastMessages } = await supabase
    .from('messages')
    .select('id, chat_id, sender_id, is_read, created_at')
    .in('chat_id', chatIds)
    .order('created_at', { ascending: false });

  // 🎯 Для каждого чата — последнее сообщение
  const lastMessageMap = new Map<number, any>();
  (lastMessages || []).forEach((m: any) => {
    if (!lastMessageMap.has(m.chat_id)) {
      lastMessageMap.set(m.chat_id, m);
    }
  });

  const formatted = (chats || []).map((c: any) => {
    const isUser1 = c.user1_id === user.id;
    const otherId = isUser1 ? c.user2_id : c.user1_id;
    const other = profilesMap.get(otherId);
    const unread = isUser1 ? c.user1_unread : c.user2_unread;
    const lastMsg = lastMessageMap.get(c.id);

    return {
      id: c.id,
      other,
      last_message: c.last_message,
      last_message_at: c.last_message_at,
      unread,
      last_sender_id: lastMsg?.sender_id || null,
      is_read: lastMsg?.is_read || false,
    };
  });

  return <ChatsList chats={formatted} currentUserId={user.id} />;
}

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="mb-12">
        <h1 className="display-title text-5xl font-bold md:text-6xl">
          <span className="gradient-text">Сообщения</span>
        </h1>
        <p className="mt-3 text-white/50">
          Общайся с художниками и заказчиками
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        }
      >
        <ChatsContent />
      </Suspense>
    </div>
  );
}