'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  Loader2,
  Check,
  Palette,
  ShoppingBag,
  Briefcase,
} from 'lucide-react';

const CATEGORIES = [
  { slug: 'portrait', label: 'Портреты' },
  { slug: 'fantasy', label: 'Фэнтези' },
  { slug: 'anime', label: 'Аниме' },
  { slug: 'illustration', label: 'Иллюстрации' },
  { slug: '3d', label: '3D' },
  { slug: 'pixel', label: 'Пиксель-арт' },
  { slug: 'scifi', label: 'Sci-Fi' },
  { slug: 'concept', label: 'Концепт-арт' },
  { slug: 'sketch', label: 'Скетчи' },
  { slug: 'nature', label: 'Природа' },
  { slug: 'architecture', label: 'Архитектура' },
  { slug: 'other', label: 'Другое' },
];

type Tab = 'artwork' | 'service' | 'order';

export function UploadForm({
  userId,
  artistName,
  role,
}: {
  userId: string;
  artistName: string;
  role: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Какие табы показывать
  const canPostArtwork = role === 'artist' || role === 'both';
  const canPostService = role === 'artist' || role === 'both';
  const canPostOrder = role === 'client' || role === 'both';

  const defaultTab: Tab = canPostArtwork
    ? 'artwork'
    : canPostService
      ? 'service'
      : 'order';

  const [tab, setTab] = useState<Tab>(defaultTab);

  // Общие поля
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('fantasy');
  const [tags, setTags] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // 🎯 Работа — БЕЗ цены (убрано)

  // Услуга
  const [servicePrice, setServicePrice] = useState('');
  const [servicePriceType, setServicePriceType] = useState('from');
  const [servicePriceTo, setServicePriceTo] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('3');

  // Заказ
  const [budget, setBudget] = useState('');
  const [budgetType, setBudgetType] = useState('up_to');
  const [budgetTo, setBudgetTo] = useState('');
  const [deadlineDays, setDeadlineDays] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 🎯 Обработка файла
  const handleFile = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.type.startsWith('image/')) {
      setError('Можно загружать только картинки');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Картинка должна быть меньше 10MB');
      return;
    }
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 🎯 Отправка
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (tab !== 'order' && !file) {
      setError('Загрузи картинку');
      return;
    }
    if (!title.trim()) {
      setError('Введи название');
      return;
    }

    setIsLoading(true);
    setProgress(10);

    const supabase = createClient();

    try {
      let publicUrl: string | null = null;

      // Загружаем картинку
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        setProgress(30);

        const { error: uploadError } = await supabase.storage
          .from('artworks')
          .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        setProgress(60);

        const {
          data: { publicUrl: url },
        } = supabase.storage.from('artworks').getPublicUrl(fileName);

        publicUrl = url;
      }

      setProgress(75);

      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      let redirectPath = '';

      // 🎯 ARTWORK — БЕЗ ЦЕНЫ
      if (tab === 'artwork') {
        const { data, error: insertError } = await supabase
          .from('artworks')
          .insert({
            artist_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            image_url: publicUrl,
            category,
            tags: tagsArray.length > 0 ? tagsArray : null,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        redirectPath = `/artwork/${data.id}`;
      }

      // 🎯 SERVICE
      if (tab === 'service') {
        if (!servicePrice || parseInt(servicePrice) < 0) {
          throw new Error('Введи корректную цену');
        }

        const { data, error: insertError } = await supabase
          .from('services')
          .insert({
            artist_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            image_url: publicUrl,
            category,
            price: parseInt(servicePrice),
            price_type: servicePriceType,
            price_to:
              servicePriceType === 'range' && servicePriceTo
                ? parseInt(servicePriceTo)
                : null,
            delivery_days: parseInt(deliveryDays) || 3,
            tags: tagsArray.length > 0 ? tagsArray : null,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        redirectPath = `/service/${data.id}`;
      }

      // 🎯 ORDER
      if (tab === 'order') {
        if (!budget || parseInt(budget) < 0) {
          throw new Error('Введи корректный бюджет');
        }

        const { data, error: insertError } = await supabase
          .from('orders')
          .insert({
            client_id: userId,
            title: title.trim(),
            description: description.trim() || null,
            image_url: publicUrl,
            category,
            budget: parseInt(budget),
            budget_type: budgetType,
            budget_to:
              budgetType === 'range' && budgetTo ? parseInt(budgetTo) : null,
            deadline_days: deadlineDays ? parseInt(deadlineDays) : null,
            tags: tagsArray.length > 0 ? tagsArray : null,
            status: 'open',
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        redirectPath = `/order/${data.id}`;
      }

      setProgress(100);
      setSuccess(true);

      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка загрузки');
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Успех
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]/60 p-16 text-center backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-400 shadow-2xl shadow-green-500/40"
        >
          <Check className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="display-title text-3xl font-bold text-white">
          {tab === 'artwork' && (
            <>
              Работа <span className="gradient-text">опубликована!</span>
            </>
          )}
          {tab === 'service' && (
            <>
              Услуга <span className="gradient-text">опубликована!</span>
            </>
          )}
          {tab === 'order' && (
            <>
              Заказ <span className="gradient-text">создан!</span>
            </>
          )}
        </h2>
        <p className="mt-4 text-white/60">Перенаправляем...</p>
      </motion.div>
    );
  }

  const tabs = [
    canPostArtwork && { key: 'artwork', label: 'Работа', icon: Palette },
    canPostService && { key: 'service', label: 'Услуга', icon: Briefcase },
    canPostOrder && { key: 'order', label: 'Заказ', icon: ShoppingBag },
  ].filter(Boolean) as Array<{ key: Tab; label: string; icon: any }>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto max-w-3xl"
    >
      {/* Заголовок */}
      <div className="mb-10 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40"
        >
          <Upload className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
          Опубликовать
        </h1>
        <p className="mt-3 text-white/50">
          Привет, {artistName}! Что хочешь опубликовать сегодня?
        </p>
      </div>

      {/* ТАБЫ */}
      {tabs.length > 1 && (
        <div className="mb-8 flex justify-center gap-2">
          <div className="glass inline-flex gap-1 rounded-full p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTab(t.key);
                    setError(null);
                  }}
                  className={`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] shadow-lg shadow-[#6C63FF]/30"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ФОРМА */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl"
      >
        {/* ЗАГРУЗКА КАРТИНКИ */}
        <div>
          <label className="mb-3 block text-sm font-medium text-white/70">
            {tab === 'artwork' && 'Картинка работы *'}
            {tab === 'service' && 'Превью услуги *'}
            {tab === 'order' && 'Референс (необязательно)'}
          </label>

          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-auto max-h-[400px] w-full bg-black/40 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur transition hover:bg-red-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-[#6C63FF] bg-[#6C63FF]/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-[#6C63FF]/40 hover:bg-white/[0.04]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/20"
                >
                  <ImageIcon className="h-8 w-8 text-[#B794F6]" />
                </motion.div>
                <div className="text-lg font-semibold text-white">
                  {isDragging ? 'Отпусти картинку' : 'Перетащи картинку'}
                </div>
                <p className="mt-2 text-sm text-white/40">
                  или нажми, чтобы выбрать файл
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* НАЗВАНИЕ */}
        <div>
          <label
            htmlFor="title"
            className="mb-3 block text-sm font-medium text-white/70"
          >
            {tab === 'artwork' && 'Название работы *'}
            {tab === 'service' && 'Название услуги *'}
            {tab === 'order' && 'Что нужно сделать? *'}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              tab === 'artwork'
                ? 'Дракон в ночи'
                : tab === 'service'
                  ? 'Нарисую дракона'
                  : 'Нужен арт дракона'
            }
            maxLength={100}
            required
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
          />
          <div className="mt-1 text-right text-xs text-white/30">
            {title.length}/100
          </div>
        </div>

        {/* ОПИСАНИЕ */}
        <div>
          <label
            htmlFor="description"
            className="mb-3 block text-sm font-medium text-white/70"
          >
            Описание
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              tab === 'order'
                ? 'Опиши, что нужно: стиль, референсы, детали...'
                : 'Расскажи подробнее...'
            }
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
          />
          <div className="mt-1 text-right text-xs text-white/30">
            {description.length}/500
          </div>
        </div>

        {/* КАТЕГОРИЯ */}
        <div>
          <label
            htmlFor="category"
            className="mb-3 block text-sm font-medium text-white/70"
          >
            Категория *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug} className="bg-[#16161f]">
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* 🎯 ARTWORK — БЕЗ ЦЕНЫ (блок удалён) */}

        {/* SERVICE — цена + срок */}
        {tab === 'service' && (
          <>
            <div>
              <label className="mb-3 block text-sm font-medium text-white/70">
                Тип цены *
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'from', label: 'От' },
                  { key: 'exact', label: 'Точная' },
                  { key: 'range', label: 'Диапазон' },
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setServicePriceType(type.key)}
                    className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      servicePriceType === type.key
                        ? 'border-[#6C63FF]/60 bg-[#6C63FF]/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="servicePrice"
                  className="mb-3 block text-sm font-medium text-white/70"
                >
                  {servicePriceType === 'range'
                    ? 'Цена от (₽) *'
                    : 'Цена (₽) *'}
                </label>
                <input
                  id="servicePrice"
                  type="number"
                  value={servicePrice}
                  onChange={(e) => setServicePrice(e.target.value)}
                  placeholder="5000"
                  min="0"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
                />
              </div>

              {servicePriceType === 'range' && (
                <div>
                  <label
                    htmlFor="servicePriceTo"
                    className="mb-3 block text-sm font-medium text-white/70"
                  >
                    Цена до (₽) *
                  </label>
                  <input
                    id="servicePriceTo"
                    type="number"
                    value={servicePriceTo}
                    onChange={(e) => setServicePriceTo(e.target.value)}
                    placeholder="15000"
                    min="0"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="deliveryDays"
                className="mb-3 block text-sm font-medium text-white/70"
              >
                Срок выполнения (дней) *
              </label>
              <input
                id="deliveryDays"
                type="number"
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(e.target.value)}
                placeholder="3"
                min="1"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>
          </>
        )}

        {/* ORDER — бюджет + срок */}
        {tab === 'order' && (
          <>
            <div>
              <label className="mb-3 block text-sm font-medium text-white/70">
                Тип бюджета *
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'up_to', label: 'До' },
                  { key: 'exact', label: 'Точный' },
                  { key: 'range', label: 'Диапазон' },
                ].map((type) => (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setBudgetType(type.key)}
                    className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      budgetType === type.key
                        ? 'border-[#4FD1C5]/60 bg-[#4FD1C5]/10 text-white'
                        : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="budget"
                  className="mb-3 block text-sm font-medium text-white/70"
                >
                  {budgetType === 'range' ? 'Бюджет от (₽) *' : 'Бюджет (₽) *'}
                </label>
                <input
                  id="budget"
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="8000"
                  min="0"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
                />
              </div>

              {budgetType === 'range' && (
                <div>
                  <label
                    htmlFor="budgetTo"
                    className="mb-3 block text-sm font-medium text-white/70"
                  >
                    Бюджет до (₽) *
                  </label>
                  <input
                    id="budgetTo"
                    type="number"
                    value={budgetTo}
                    onChange={(e) => setBudgetTo(e.target.value)}
                    placeholder="15000"
                    min="0"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="deadlineDays"
                className="mb-3 block text-sm font-medium text-white/70"
              >
                Желаемый срок (дней)
              </label>
              <input
                id="deadlineDays"
                type="number"
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(e.target.value)}
                placeholder="7"
                min="1"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#4FD1C5]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#4FD1C5]/20"
              />
            </div>
          </>
        )}

        {/* ТЕГИ */}
        <div>
          <label
            htmlFor="tags"
            className="mb-3 block text-sm font-medium text-white/70"
          >
            Теги <span className="text-white/30">(через запятую)</span>
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="дракон, ночь, фэнтези"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
          />
          {tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t.length > 0)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
                  >
                    #{tag}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* ОШИБКА */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ПРОГРЕСС */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-white/40">
                <span>Загружаем...</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* КНОПКА */}
        <button
          type="submit"
          disabled={isLoading || (tab !== 'order' && !file)}
          className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-white">
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Загружаем...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                {tab === 'artwork' && 'Опубликовать работу'}
                {tab === 'service' && 'Опубликовать услугу'}
                {tab === 'order' && 'Создать заказ'}
              </>
            )}
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
        </button>
      </form>
    </motion.div>
  );
}