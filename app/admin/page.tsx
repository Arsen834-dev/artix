// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server';
import {
  Users,
  Image as ImageIcon,
  Briefcase,
  ShoppingBag,
  Handshake,
  MessageSquare,
  Flag,
  Ban,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: stats, error } = await supabase.rpc('get_admin_stats');
  const row = stats?.[0];

  const items = [
    { label: 'Пользователи', value: row?.total_users ?? 0, icon: Users, color: '#6C63FF' },
    { label: 'Работы', value: row?.total_artworks ?? 0, icon: ImageIcon, color: '#B794F6' },
    { label: 'Услуги', value: row?.total_services ?? 0, icon: Briefcase, color: '#4FD1C5' },
    { label: 'Заказы', value: row?.total_orders ?? 0, icon: ShoppingBag, color: '#68D391' },
    { label: 'Сделки', value: row?.total_deals ?? 0, icon: Handshake, color: '#F6AD55' },
    { label: 'Отклики', value: row?.total_responses ?? 0, icon: MessageSquare, color: '#F687B3' },
    { label: 'Жалобы (ожидают)', value: row?.pending_reports ?? 0, icon: Flag, color: '#F56565', highlight: (row?.pending_reports ?? 0) > 0 },
    { label: 'Активные баны', value: row?.active_bans ?? 0, icon: Ban, color: '#E53E3E' },
  ];

  return (
    <div className="py-8">
      <h1 className="display-title mb-8 text-3xl font-bold text-white">
        Дашборд
      </h1>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
          Ошибка загрузки: {error.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm ${
                item.highlight
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-white/5 bg-[#16161f]/60'
              }`}
            >
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                }}
              >
                <Icon className="h-5 w-5" style={{ color: item.color }} />
              </div>
              <div className="text-3xl font-bold text-white">{item.value}</div>
              <div className="mt-1 text-xs text-white/40">{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}