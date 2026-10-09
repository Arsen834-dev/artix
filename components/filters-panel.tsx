// components/filters-panel.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  ChevronDown,
  X,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

export type SortOption = 'new' | 'popular' | 'cheap' | 'expensive';

export type Filters = {
  category: string;
  priceMin: string;
  priceMax: string;
  sort: SortOption;
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'new', label: 'Новые' },
  { key: 'popular', label: 'Популярные' },
  { key: 'cheap', label: 'Дешёвые' },
  { key: 'expensive', label: 'Дорогие' },
];

export function FiltersPanel({
  filters,
  onChange,
  priceLabel = 'Цена',
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  priceLabel?: string;
}) {
  // 🎯 Скрытая панель по умолчанию
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<Filters>) => {
    onChange({ ...filters, ...patch });
  };

  const reset = () => {
    onChange({
      category: 'all',
      priceMin: '',
      priceMax: '',
      sort: 'new',
    });
  };

  // 🎯 Считаем активные фильтры (для бейджа)
  const activeCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.priceMin || filters.priceMax ? 1 : 0) +
    (filters.sort !== 'new' ? 1 : 0);

  return (
    <div>
      {/* 🎯 Кнопка «Фильтры» */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen((v) => !v)}
          className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
            open || activeCount > 0
              ? 'border-[#6C63FF]/40 bg-[#6C63FF]/10 text-[#B794F6]'
              : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры
          {activeCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6C63FF] px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {activeCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50 transition hover:border-red-500/30 hover:text-red-400"
          >
            <X className="h-3 w-3" />
            Сбросить
          </button>
        )}
      </div>

      {/* 🎯 Раскрывающаяся панель */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              {/* Категории */}
              <div>
                <div className="mb-2 text-xs uppercase tracking-wider text-white/40">
                  Категория
                </div>
                <div className="scrollbar-hide -mx-1 flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const isActive = filters.category === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        onClick={() => update({ category: cat.slug })}
                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#6C63FF] to-[#B794F6] text-white shadow-lg shadow-[#6C63FF]/30'
                            : 'border border-white/5 bg-white/5 text-white/60 hover:border-[#6C63FF]/30 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Сортировка */}
              <div>
                <div className="mb-2 text-xs uppercase tracking-wider text-white/40">
                  Сортировка
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isActive = filters.sort === opt.key;
                    return (
                      <button
                        key={opt.key}
                        onClick={() => update({ sort: opt.key })}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                          isActive
                            ? 'bg-[#6C63FF]/20 text-[#B794F6]'
                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Цена */}
              <div>
                <div className="mb-2 text-xs uppercase tracking-wider text-white/40">
                  {priceLabel}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => update({ priceMin: e.target.value })}
                    placeholder="От"
                    min="0"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20"
                  />
                  <span className="text-white/30">—</span>
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => update({ priceMax: e.target.value })}
                    placeholder="До"
                    min="0"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}