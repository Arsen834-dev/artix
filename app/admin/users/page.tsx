// app/admin/users/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { UsersTable } from '@/components/admin/users-table';

async function UsersContent() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from('profiles')
    .select(
      'id, username, display_name, avatar_url, role, is_sponsor, is_admin, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  const { data: activeBans } = await supabase
    .from('bans')
    .select('user_id')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  const bannedIds = new Set((activeBans || []).map((b) => b.user_id));

  const withBans = (users || []).map((u) => ({
    ...u,
    is_banned: bannedIds.has(u.id),
  }));

  return <UsersTable users={withBans} />;
}

export default function AdminUsersPage() {
  return (
    <div className="py-8">
      <h1 className="display-title mb-8 text-3xl font-bold text-white">
        Пользователи
      </h1>
      <Suspense
        fallback={<div className="h-96 animate-pulse rounded-2xl bg-white/5" />}
      >
        <UsersContent />
      </Suspense>
    </div>
  );
}