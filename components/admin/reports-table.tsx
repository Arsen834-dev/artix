// components/admin/reports-table.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Check, X, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Report = {
  id: number;
  reporter_id: string;
  target_type: string;
  target_id: number;
  reason: string;
  comment: string | null;
  status: string;
  admin_comment: string | null;
  created_at: string;
  reporter: { username: string; display_name: string } | null;
};

const REASON_LABELS: Record<string, string> = {
  spam: 'Спам',
  abuse: 'Оскорбления',
  nsfw: '18+',
  plagiarism: 'Плагиат',
  fraud: 'Мошенничество',
  other: 'Другое',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Ожидает',
  reviewed: 'Просмотрено',
  resolved: 'Решено',
  rejected: 'Отклонено',
};

function getTargetLink(type: string, id: number): string | null {
  switch (type) {
    case 'artwork': return `/artwork/${id}`;
    case 'service': return `/services/${id}`;
    case 'order': return `/orders/${id}`;
    case 'message': return null;
    default: return null;
  }
}

export function ReportsTable({ reports }: { reports: Report[] }) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [adminComments, setAdminComments] = useState<Record<number, string>>({});

  const handleResolve = async (id: number, status: string) => {
    setProcessingId(id);
    const supabase = createClient();

    const { error } = await supabase.rpc('resolve_report', {
      p_report_id: id,
      p_status: status,
      p_admin_comment: adminComments[id] || null,
    });

    if (error) {
      alert('Ошибка: ' + error.message);
      setProcessingId(null);
      return;
    }

    router.refresh();
    setProcessingId(null);
  };

  if (reports.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#16161f]/40 p-16 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <p className="text-lg text-white/60">Жалоб нет</p>
        <p className="mt-2 text-sm text-white/40">Всё чисто</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report, i) => {
        const isProcessing = processingId === report.id;
        const targetLink = getTargetLink(report.target_type, report.target_id);

        return (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02 }}
            className={`rounded-2xl border p-5 ${
              report.status === 'pending'
                ? 'border-yellow-500/30 bg-yellow-500/5'
                : 'border-white/5 bg-[#16161f]/60'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
                    {REASON_LABELS[report.reason] || report.reason}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                    {report.target_type} #{report.target_id}
                  </span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                    {STATUS_LABELS[report.status] || report.status}
                  </span>
                </div>

                <div className="mt-3 text-sm">
                  <span className="text-white/40">От: </span>
                  <span className="text-white">
                    @{report.reporter?.username || 'unknown'}
                  </span>
                </div>

                {report.comment && (
                  <p className="mt-2 text-sm text-white/60">
                    {report.comment}
                  </p>
                )}

                <div className="mt-2 text-xs text-white/30">
                  {new Date(report.created_at).toLocaleString('ru-RU')}
                </div>

                {targetLink && (
                  <Link
                    href={targetLink}
                    target="_blank"
                    className="mt-3 inline-flex items-center gap-1 text-xs text-[#B794F6] hover:underline"
                  >
                    Открыть цель
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>

              {report.status === 'pending' && (
                <div className="flex w-full shrink-0 flex-col gap-2 md:w-80">
                  <textarea
                    value={adminComments[report.id] || ''}
                    onChange={(e) =>
                      setAdminComments((prev) => ({
                        ...prev,
                        [report.id]: e.target.value,
                      }))
                    }
                    placeholder="Комментарий админа (опционально)"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white placeholder:text-white/30 outline-none focus:border-[#6C63FF]/50"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(report.id, 'resolved')}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-green-500/20 px-3 py-2 text-xs font-medium text-green-400 transition hover:bg-green-500/30 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                      Решено
                    </button>
                    <button
                      onClick={() => handleResolve(report.id, 'rejected')}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/10 disabled:opacity-50"
                    >
                      <X className="h-3 w-3" />
                      Отклонить
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}