// components/admin/users-table.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Ban, Star, Shield, Loader2 } from 'lucide-react';
import { BanModal } from '../ban-modal';

type User = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  role: string;
  is_sponsor: boolean;
  is_admin: boolean;
  created_at: string;
  is_banned?: boolean;
};

export function UsersTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [banUser, setBanUser] = useState<User | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleUnban = async (userId: string) => {
    setProcessingId(userId);
    const supabase = createClient();
    const { error } = await supabase.rpc('unban_user', { p_user_id: userId });
    if (error) alert(error.message);
    router.refresh();
    setProcessingId(null);
  };

  const handleToggleSponsor = async (userId: string, current: boolean) => {
    setProcessingId(userId);
    const supabase = createClient();
    const { error } = await supabase.rpc('set_sponsor', {
      p_user_id: userId,
      p_is_sponsor: !current,
    });
    if (error) alert(error.message);
    router.refresh();
    setProcessingId(null);
  };

  return (
    <>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по username или имени..."
        className="mb-4 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#6C63FF]/50"
      />

      <div className="space-y-2">
        {filtered.map((user) => {
          const isProcessing = processingId === user.id;

          return (
            <div
              key={user.id}
              className={`flex flex-wrap items-center gap-4 rounded-2xl border p-4 ${
                user.is_banned
                  ? 'border-red-500/30 bg-red-500/5'
                  : 'border-white/5 bg-[#16161f]/60'
              }`}
            >
              <Link
                href={`/artist/${user.username}`}
                className="flex min-w-0 flex-1 items-center gap-3"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-sm font-bold text-white">
                    {user.display_name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-white">
                      {user.display_name}
                    </span>
                    {user.is_sponsor && (
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    )}
                    {user.is_admin && (
                      <Shield className="h-3 w-3 text-[#6C63FF]" />
                    )}
                  </div>
                  <div className="text-xs text-white/40">
                    @{user.username} · {user.role}
                  </div>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                {user.is_banned ? (
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
                    Забанен
                  </span>
                ) : null}

                <button
                  onClick={() => handleToggleSponsor(user.id, user.is_sponsor)}
                  disabled={isProcessing}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
                    user.is_sponsor
                      ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {user.is_sponsor ? 'Снять PRO' : 'Выдать PRO'}
                </button>

                {user.is_banned ? (
                  <button
                    onClick={() => handleUnban(user.id)}
                    disabled={isProcessing}
                    className="rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 transition hover:bg-green-500/30 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      'Разбанить'
                    )}
                  </button>
                ) : (
                  !user.is_admin && (
                    <button
                      onClick={() => setBanUser(user)}
                      className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/30"
                    >
                      <Ban className="mr-1 inline h-3 w-3" />
                      Забанить
                    </button>
                  )
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/5 bg-[#16161f]/60 p-12 text-center text-white/50">
            Ничего не найдено
          </div>
        )}
      </div>

      {banUser && (
        <BanModal
          userId={banUser.id}
          username={banUser.username}
          onClose={() => setBanUser(null)}
        />
      )}
    </>
  );
}