import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileEditForm } from '@/components/profile-edit-form';

export default async function ProfileSettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      id, username, display_name, avatar_url, bio, role, price_range,
      cover_url, telegram_url, instagram_url, vk_url, behance_url,
      artstation_url, website_url, boosty_url, discord_url, tiktok_url
    `)
    .eq('id', user.id)
    .single();

  if (!profile) {
    redirect('/');
  }

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#6C63FF]/15 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[#4FD1C5]/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <ProfileEditForm profile={profile} userId={user.id} />
      </div>
    </div>
  );
}