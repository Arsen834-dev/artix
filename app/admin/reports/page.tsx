// app/admin/reports/page.tsx
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { ReportsTable } from '@/components/admin/reports-table';

async function ReportsContent() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from('reports')
    .select(`
      id, reporter_id, target_type, target_id, reason, comment,
      status, admin_comment, created_at,
      reporter:profiles!reports_reporter_id_fkey (username, display_name)
    `)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
        Ошибка: {error.message}
      </div>
    );
  }

  const formatted = (reports || []).map((r: any) => ({
    ...r,
    reporter: Array.isArray(r.reporter) ? r.reporter[0] : r.reporter,
  }));

  return <ReportsTable reports={formatted} />;
}

export default function AdminReportsPage() {
  return (
    <div className="py-8">
      <h1 className="display-title mb-8 text-3xl font-bold text-white">
        Жалобы
      </h1>
      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        }
      >
        <ReportsContent />
      </Suspense>
    </div>
  );
}