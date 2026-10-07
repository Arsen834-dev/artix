// app/notifications/page.tsx
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NotificationsList } from '@/components/notifications-list';

async function NotificationsContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('id, type, title, message, link, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error(error);
    return <div className="text-center text-white/60">Ошибка загрузки</div>;
  }

  return (
    <NotificationsList notifications={notifications || []} userId={user.id} />
  );
}

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="mb-10">
        <h1 className="display-title text-5xl font-bold md:text-6xl">
          <span className="gradient-text">Уведомления</span>
        </h1>
        <p className="mt-3 text-white/50">
          Все события по сделкам, чатам и отзывам
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        }
      >
        <NotificationsContent />
      </Suspense>
    </div>
  );
}