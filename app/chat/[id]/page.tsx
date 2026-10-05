import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ChatWindow } from '@/components/chat-window';

async function ChatContent({ id }: { id: string }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: chat, error } = await supabase
    .from('chats')
    .select('id, user1_id, user2_id, created_at')
    .eq('id', id)
    .single();

  if (error || !chat) notFound();

  if (chat.user1_id !== user.id && chat.user2_id !== user.id) notFound();

  const otherId = chat.user1_id === user.id ? chat.user2_id : chat.user1_id;

  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, is_sponsor, last_seen_at')
    .eq('id', otherId)
    .single();

  if (!otherProfile) notFound();

  const { data: messages } = await supabase
    .from('messages')
    .select('id, sender_id, text, image_url, message_type, created_at')
    .eq('chat_id', chat.id)
    .order('created_at', { ascending: true });

  const isUser1 = chat.user1_id === user.id;
  await supabase
    .from('chats')
    .update(isUser1 ? { user1_unread: 0 } : { user2_unread: 0 })
    .eq('id', chat.id);

  return (
    <ChatWindow
      chatId={chat.id}
      userId={user.id}
      other={otherProfile}
      initialMessages={(messages || []) as any}
    />
  );
}

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#6C63FF]" />
        </div>
      }
    >
      <ChatContent id={id} />
    </Suspense>
  );
}