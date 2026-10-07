// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminSidebar } from '@/components/admin-sidebar';

export const metadata = {
  title: 'Админка — Artix',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    redirect('/feed');
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto flex flex-col gap-4 px-4 md:flex-row md:gap-0">
        <AdminSidebar />
        <main className="min-w-0 flex-1 md:pl-6">{children}</main>
      </div>
    </div>
  );
}