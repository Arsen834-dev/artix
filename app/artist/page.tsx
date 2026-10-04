import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Star, Palette } from 'lucide-react';

async function ArtistsList() {
  const supabase = await createClient();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio, is_sponsor, role')
    .in('role', ['artist', 'both'])
    .order('is_sponsor', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !profiles) {
    return (
      <div className="py-20 text-center text-white/60">Ошибка загрузки 😢</div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <Palette className="mx-auto mb-4 h-12 w-12 text-white/20" />
        <p className="text-lg text-white/60">Пока нет художников</p>
        <p className="mt-2 text-sm text-white/40">
          Стань первым, кто присоединится!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {profiles.map((profile) => (
        <Link
          key={profile.id}
          href={`/artist/${profile.username}`}
          className="group"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/60 p-6 text-center transition-all duration-500 hover:-translate-y-1 hover:border-[#6C63FF]/40 hover:shadow-2xl hover:shadow-[#6C63FF]/20">
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#6C63FF]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative">
              <div className="relative mx-auto mb-4 h-24 w-24">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="h-full w-full rounded-full object-cover ring-2 ring-white/10 transition group-hover:ring-[#6C63FF]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-3xl font-bold text-white">
                    {profile.display_name[0]?.toUpperCase()}
                  </div>
                )}
                {profile.is_sponsor && (
                  <div className="absolute -right-1 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-black text-black" />
                  </div>
                )}
              </div>

              <h3 className="display-title text-xl font-bold text-white transition group-hover:text-[#B794F6]">
                {profile.display_name}
              </h3>
              <p className="mt-1 text-sm text-white/40">@{profile.username}</p>

              {profile.bio && (
                <p className="mt-4 line-clamp-2 text-sm text-white/60">
                  {profile.bio}
                </p>
              )}

              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="flex items-center gap-1 rounded-full bg-[#6C63FF]/20 px-3 py-1 text-xs font-medium text-[#B794F6]">
                  <Palette className="h-3 w-3" />
                  Художник
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ArtistsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded-3xl bg-white/5" />
      ))}
    </div>
  );
}

export default function ArtistsPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <div className="mb-12 text-center">
        <h1 className="display-title text-5xl font-bold md:text-7xl">
          <span className="gradient-text">Художники</span>
        </h1>
        <p className="mt-4 text-lg text-white/50">
          Все таланты галактики в одном месте
        </p>
      </div>

      <Suspense fallback={<ArtistsSkeleton />}>
        <ArtistsList />
      </Suspense>
    </div>
  );
}