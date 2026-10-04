import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { UploadForm } from '@/components/upload-form';

export default async function UploadPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, role')
    .eq('id', user.id)
    .single();

  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#6C63FF]/15 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-[#4FD1C5]/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <UploadForm
          userId={user.id}
          artistName={profile?.display_name || 'Друг'}
          role={profile?.role || 'artist'}
        />
      </div>
    </div>
  );
}