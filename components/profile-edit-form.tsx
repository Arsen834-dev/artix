'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { ImageCropModal } from './image-crop-modal';
import {
  Camera,
  Image as ImageIcon,
  Check,
  Loader2,
  Save,
  Send,
  Instagram,
  Globe,
  Palette,
  Music2,
  DollarSign,
  Gamepad2,
  User,
} from 'lucide-react';

type Profile = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: string;
  price_range: string | null;
  cover_url: string | null;
  telegram_url: string | null;
  instagram_url: string | null;
  vk_url: string | null;
  behance_url: string | null;
  artstation_url: string | null;
  website_url: string | null;
  boosty_url: string | null;
  discord_url: string | null;
  tiktok_url: string | null;
};

type CropState = {
  type: 'avatar' | 'cover';
  image: string;
} | null;

export function ProfileEditForm({
  profile,
  userId,
}: {
  profile: Profile;
  userId: string;
}) {
  const router = useRouter();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [coverUrl, setCoverUrl] = useState(profile.cover_url);
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [bio, setBio] = useState(profile.bio || '');
  const [priceRange, setPriceRange] = useState(profile.price_range || '');

  const [telegramUrl, setTelegramUrl] = useState(profile.telegram_url || '');
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url || '');
  const [tiktokUrl, setTiktokUrl] = useState(profile.tiktok_url || '');
  const [vkUrl, setVkUrl] = useState(profile.vk_url || '');
  const [discordUrl, setDiscordUrl] = useState(profile.discord_url || '');
  const [boostyUrl, setBoostyUrl] = useState(profile.boosty_url || '');
  const [behanceUrl, setBehanceUrl] = useState(profile.behance_url || '');
  const [artstationUrl, setArtstationUrl] = useState(
    profile.artstation_url || ''
  );
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || '');

  const [cropState, setCropState] = useState<CropState>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  // 🎯 Выбор файла → открыть модалку кропа
  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Только картинки');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Максимум 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropState({
        type: 'avatar',
        image: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);

    // Сбрасываем input
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleCoverSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Только картинки');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('Максимум 15MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCropState({
        type: 'cover',
        image: e.target?.result as string,
      });
    };
    reader.readAsDataURL(file);

    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  // 🎯 После кропа — загрузка в Supabase
  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!cropState) return;

    const isAvatar = cropState.type === 'avatar';
    if (isAvatar) setIsUploadingAvatar(true);
    else setIsUploadingCover(true);

    setCropState(null);

    try {
      const fileName = `${userId}/${cropState.type}-${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, croppedBlob, {
          upsert: true,
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(fileName);

      if (isAvatar) setAvatarUrl(publicUrl);
      else setCoverUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ошибка загрузки');
    } finally {
      if (isAvatar) setIsUploadingAvatar(false);
      else setIsUploadingCover(false);
    }
  };

  // 🎯 Сохранение профиля
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim() || null,
          avatar_url: avatarUrl,
          cover_url: coverUrl,
          price_range: priceRange.trim() || null,
          telegram_url: telegramUrl.trim() || null,
          instagram_url: instagramUrl.trim() || null,
          tiktok_url: tiktokUrl.trim() || null,
          vk_url: vkUrl.trim() || null,
          discord_url: discordUrl.trim() || null,
          boosty_url: boostyUrl.trim() || null,
          behance_url: behanceUrl.trim() || null,
          artstation_url: artstationUrl.trim() || null,
          website_url: websiteUrl.trim() || null,
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const socialInputs = [
    { key: 'telegram', label: 'Telegram', placeholder: 'https://t.me/username', value: telegramUrl, setter: setTelegramUrl, icon: Send, color: '#0088cc' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/username', value: instagramUrl, setter: setInstagramUrl, icon: Instagram, color: '#E1306C' },
    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@username', value: tiktokUrl, setter: setTiktokUrl, icon: Music2, color: '#FF0050' },
    { key: 'vk', label: 'VK', placeholder: 'https://vk.com/username', value: vkUrl, setter: setVkUrl, icon: Globe, color: '#0077FF' },
    { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/invite', value: discordUrl, setter: setDiscordUrl, icon: Gamepad2, color: '#5865F2' },
    { key: 'boosty', label: 'Boosty', placeholder: 'https://boosty.to/username', value: boostyUrl, setter: setBoostyUrl, icon: DollarSign, color: '#FF6B00' },
    { key: 'behance', label: 'Behance', placeholder: 'https://behance.net/username', value: behanceUrl, setter: setBehanceUrl, icon: Palette, color: '#1769FF' },
    { key: 'artstation', label: 'ArtStation', placeholder: 'https://artstation.com/username', value: artstationUrl, setter: setArtstationUrl, icon: Palette, color: '#13AFF0' },
    { key: 'website', label: 'Личный сайт', placeholder: 'https://example.com', value: websiteUrl, setter: setWebsiteUrl, icon: Globe, color: '#B794F6' },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl"
      >
        {/* Заголовок */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40">
            <User className="h-8 w-8 text-white" />
          </div>
          <h1 className="display-title text-4xl font-bold text-white md:text-5xl">
            Редактировать <span className="gradient-text">профиль</span>
          </h1>
          <p className="mt-3 text-white/50">
            Обнови аватар, био и соцсети
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* ОБЛОЖКА */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#16161f]/60 backdrop-blur-xl">
            <div className="relative h-40 md:h-56">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#6C63FF] via-[#B794F6] to-[#4FD1C5]" />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16161f] via-transparent to-transparent" />

              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="absolute bottom-3 right-3 z-10 flex items-center gap-2 rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black/90 disabled:opacity-50"
              >
                {isUploadingCover ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                {isUploadingCover ? 'Загружаем...' : 'Сменить обложку'}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                className="hidden"
              />
            </div>

            <div className="relative -mt-16 px-6 pb-6 md:-mt-20 md:px-8 md:pb-8">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-28 w-28 rounded-full border-4 border-[#16161f] object-cover shadow-2xl md:h-32 md:w-32"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#16161f] bg-gradient-to-br from-[#6C63FF] to-[#B794F6] text-4xl font-bold text-white md:h-32 md:w-32">
                      {displayName[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#6C63FF] text-white shadow-lg transition hover:scale-110 disabled:opacity-50"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </div>

                <div className="text-center md:pb-2 md:text-left">
                  <div className="text-sm text-white/40">
                    @{profile.username}
                  </div>
                  <div className="mt-1 text-xs text-white/30">
                    Username нельзя изменить
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ОСНОВНОЕ */}
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl">
            <h2 className="display-title text-xl font-bold text-white">
              Основное
            </h2>

            <div>
              <label
                htmlFor="displayName"
                className="mb-3 block text-sm font-medium text-white/70"
              >
                Отображаемое имя *
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Как тебя зовут?"
                maxLength={50}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>

            <div>
              <label
                htmlFor="bio"
                className="mb-3 block text-sm font-medium text-white/70"
              >
                О себе
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Расскажи о своём стиле, опыте, любимых темах..."
                rows={4}
                maxLength={300}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
              <div className="mt-1 text-right text-xs text-white/30">
                {bio.length}/300
              </div>
            </div>

            <div>
              <label
                htmlFor="priceRange"
                className="mb-3 block text-sm font-medium text-white/70"
              >
                Диапазон цен{' '}
                <span className="text-white/30">(например, 3000-15000₽)</span>
              </label>
              <input
                id="priceRange"
                type="text"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="3000-15000₽"
                maxLength={30}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
              />
            </div>
          </div>

          {/* СОЦСЕТИ */}
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[#16161f]/60 p-8 backdrop-blur-xl">
            <div>
              <h2 className="display-title text-xl font-bold text-white">
                Соцсети
              </h2>
              <p className="mt-1 text-sm text-white/40">
                Заполни только те, что используешь
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {socialInputs.map((social) => {
                const Icon = social.icon;
                return (
                  <div key={social.key}>
                    <label
                      htmlFor={social.key}
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-white/70"
                    >
                      <Icon
                        className="h-4 w-4"
                        style={{
                          color: social.value ? social.color : undefined,
                        }}
                      />
                      {social.label}
                    </label>
                    <input
                      id={social.key}
                      type="url"
                      value={social.value}
                      onChange={(e) => social.setter(e.target.value)}
                      placeholder={social.placeholder}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#6C63FF]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#6C63FF]/20"
                    />
                  </div>
                );
              })}
            </div>
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

          {/* УСПЕХ */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300"
              >
                <Check className="h-5 w-5" />
                Профиль успешно сохранён!
              </motion.div>
            )}
          </AnimatePresence>

          {/* КНОПКА */}
          <button
            type="submit"
            disabled={isSaving || isUploadingAvatar || isUploadingCover}
            className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-white">
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Сохраняем...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Сохранить изменения
                </>
              )}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </form>
      </motion.div>

      {/* МОДАЛКА КРОПА */}
      {cropState && (
        <ImageCropModal
          image={cropState.image}
          aspect={cropState.type === 'avatar' ? 1 : 4}
          shape={cropState.type === 'avatar' ? 'round' : 'rect'}
          title={
            cropState.type === 'avatar'
              ? 'Обрежь аватарку'
              : 'Обрежь обложку'
          }
          onCancel={() => setCropState(null)}
          onComplete={handleCropComplete}
        />
      )}
    </>
  );
}