// components/filters-panel.tsx
'use client';

import { CATEGORIES } from '@/lib/constants';
import { SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export type SortOption = 'new' | 'popular' | 'cheap' | 'expensive';

export type Filters = {
  category: string; // 'all' | slug
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
  const [showPrice, setShowPrice] = useState(false);

  const update = (patch: Partial<Filters>) => {
    onChange({ ...filters, ...patch });
  };

  const hasPriceFilter = filters.priceMin || filters.priceMax;

  return (
    <div className="space-y-3">
      {/* Категории — горизонтальный скролл */}
      <div className="scrollbar-hide -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => update({ category: cat.slug })}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
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

      {/* Сортировка + Фильтр цены */}
      <div className="flex flex-wrap items-center gap-2">
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

        <button
          onClick={() => setShowPrice((v) => !v)}
          className={`ml-auto flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
            hasPriceFilter
              ? 'bg-[#6C63FF]/20 text-[#B794F6]'
              : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="h-3 w-3" />
          {priceLabel}
          {hasPriceFilter && (
            <span className="rounded-full bg-[#6C63FF] px-1.5 text-[10px] text-white">
              •
            </span>
          )}
        </button>
      </div>

      {/* Цена — раскрывается */}
      <AnimatePresence>
        {showPrice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">
                  От
                </label>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => update({ priceMin: e.target.value })}
                  placeholder="0"
                  min="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-[10px] uppercase tracking-wider text-white/40">
                  До
                </label>
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => update({ priceMax: e.target.value })}
                  placeholder="∞"
                  min="0"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none transition focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/20"
                />
              </div>
              {hasPriceFilter && (
                <button
                  onClick={() => update({ priceMin: '', priceMax: '' })}
                  className="mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/40 transition hover:bg-red-500/20 hover:text-red-400"
                  aria-label="Сбросить цену"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}