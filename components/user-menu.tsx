'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User as UserIcon, Settings, LogOut, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function UserMenu() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url')
          .eq('id', user.id)
          .single();
        setProfile(profile);
      }
      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadUser());

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="h-9 w-20 animate-pulse rounded-full bg-white/5" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="hidden rounded-full border border-white/10 px-4 py-1.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white sm:block"
        >
          Войти
        </Link>
        <Link
          href="/auth/sign-up"
          className="rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-4 py-1.5 text-sm font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition hover:shadow-xl hover:shadow-[#6C63FF]/50"
        >
          Начать
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 transition hover:border-white/20"
      >
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name}
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-xs font-bold text-white">
            {profile?.display_name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <span className="hidden text-sm font-medium text-white/80 sm:block">
          {profile?.display_name || 'Профиль'}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#16161f]/95 backdrop-blur-xl"
            >
              <div className="border-b border-white/5 p-4">
                <div className="font-semibold text-white">
                  {profile?.display_name}
                </div>
                <div className="text-xs text-white/40">
                  @{profile?.username}
                </div>
              </div>
              <div className="p-2">
                <Link
                  href={`/artist/${profile?.username}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <UserIcon className="h-4 w-4" />
                  Мой профиль
                </Link>
                <Link
                  href="/upload"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <Upload className="h-4 w-4" />
                  Опубликовать
                </Link>
                <Link
                  href="/settings/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Настройки
                </Link>
              </div>
              <div className="border-t border-white/5 p-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}