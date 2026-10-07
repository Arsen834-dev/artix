// components/search-bar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Поиск...',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);

  // 🎯 Debounce: обновляем родителя через 300 мс
  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local]);

  // Синхронизация извне (если value меняется извне)
  useEffect(() => {
    setLocal(value);
  }, [value]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
      <input
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-10 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
      />
      {local && (
        <button
          onClick={() => {
            setLocal('');
            onChange('');
          }}
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/50 transition hover:bg-white/20 hover:text-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}