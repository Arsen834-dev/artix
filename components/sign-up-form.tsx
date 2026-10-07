// components/sign-up-form.tsx
'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput, checkPasswordStrength } from '@/components/password-input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, ShoppingBag, Sparkles, Mail, AtSign, Check } from 'lucide-react';

type Role = 'artist' | 'client' | 'both';

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [role, setRole] = useState<Role>('artist');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const usernameValid = USERNAME_REGEX.test(username);
  const usernameTouched = username.length > 0;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (!usernameValid) {
      setError(
        'Username: 3–20 символов, только латиница в нижнем регистре, цифры и _.',
      );
      setIsLoading(false);
      return;
    }

    if (!agreed) {
      setError('Нужно согласиться с офертой и политикой конфиденциальности');
      setIsLoading(false);
      return;
    }

    const strength = checkPasswordStrength(password);
    if (strength.passedCount < 5) {
      setError('Пароль слишком слабый. Выполни все требования.');
      setIsLoading(false);
      return;
    }

    if (password !== repeatPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
            role,
            display_name: username,
          },
        },
      });

      if (error) throw error;

      if (role === 'client') {
        router.push('/auth/sign-up-success?role=client');
      } else {
        router.push('/auth/sign-up-success?role=artist');
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/80 p-8 backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#6C63FF]/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#4FD1C5]/15 blur-[80px]" />

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 text-center"
          >
            <div className="mb-4 flex justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40">
                <Sparkles className="h-7 w-7 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] blur-xl opacity-50" />
              </div>
            </div>
            <h1 className="display-title text-3xl font-bold text-white">
              Присоединяйся к <span className="gradient-text">галактике</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Создай аккаунт за 30 секунд
            </p>
          </motion.div>

          <form onSubmit={handleSignUp} className="space-y-6">
            {/* РОЛЬ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Label className="mb-3 block text-sm font-medium text-white/70">
                Я регистрируюсь как:
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                    role === 'artist'
                      ? 'border-[#6C63FF]/60 bg-[#6C63FF]/10 shadow-lg shadow-[#6C63FF]/20'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {role === 'artist' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#6C63FF]"
                    >
                      <Check className="h-2.5 w-2.5 text-white" />
                    </motion.div>
                  )}
                  <Palette
                    className={`mb-2 h-5 w-5 transition-colors ${
                      role === 'artist' ? 'text-[#B794F6]' : 'text-white/40'
                    }`}
                  />
                  <div className="text-sm font-semibold text-white">
                    Художник
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/40">
                    Продавать
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                    role === 'client'
                      ? 'border-[#4FD1C5]/60 bg-[#4FD1C5]/10 shadow-lg shadow-[#4FD1C5]/20'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {role === 'client' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#4FD1C5]"
                    >
                      <Check className="h-2.5 w-2.5 text-white" />
                    </motion.div>
                  )}
                  <ShoppingBag
                    className={`mb-2 h-5 w-5 transition-colors ${
                      role === 'client' ? 'text-[#4FD1C5]' : 'text-white/40'
                    }`}
                  />
                  <div className="text-sm font-semibold text-white">
                    Заказчик
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/40">
                    Заказывать
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('both')}
                  className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
                    role === 'both'
                      ? 'border-yellow-400/60 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  {role === 'both' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400"
                    >
                      <Check className="h-2.5 w-2.5 text-black" />
                    </motion.div>
                  )}
                  <Sparkles
                    className={`mb-2 h-5 w-5 transition-colors ${
                      role === 'both' ? 'text-yellow-400' : 'text-white/40'
                    }`}
                  />
                  <div className="text-sm font-semibold text-white">Оба</div>
                  <div className="mt-0.5 text-[10px] leading-tight text-white/40">
                    И то, и то
                  </div>
                </button>
              </div>
            </motion.div>

            {/* EMAIL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid gap-2"
            >
              <Label
                htmlFor="email"
                className="text-sm font-medium text-white/70"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30 focus:border-[#6C63FF]/50 focus:ring-[#6C63FF]/20"
                />
              </div>
            </motion.div>

            {/* USERNAME */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid gap-2"
            >
              <Label
                htmlFor="username"
                className="text-sm font-medium text-white/70"
              >
                Username
              </Label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <Input
                  id="username"
                  type="text"
                  placeholder="artix_artist"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))
                  }
                  className={`border-white/10 bg-white/[0.03] pl-10 text-white placeholder:text-white/30 focus:ring-[#6C63FF]/20 ${
                    usernameTouched && !usernameValid
                      ? 'border-red-500/40 focus:border-red-500/50'
                      : 'focus:border-[#6C63FF]/50'
                  }`}
                />
              </div>
              {usernameTouched && !usernameValid && (
                <p className="text-xs text-red-400">
                  3–20 символов: a-z, 0-9, _
                </p>
              )}
              {usernameValid && (
                <p className="text-xs text-green-400">@{username}</p>
              )}
            </motion.div>

            {/* ПАРОЛЬ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-2"
            >
              <Label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Пароль
              </Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="Придумай надёжный пароль"
                showStrength={true}
                required
              />
            </motion.div>

            {/* ПОВТОР ПАРОЛЯ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid gap-2"
            >
              <Label
                htmlFor="repeat-password"
                className="text-sm font-medium text-white/70"
              >
                Повторите пароль
              </Label>
              <PasswordInput
                id="repeat-password"
                value={repeatPassword}
                onChange={setRepeatPassword}
                placeholder="Ещё раз"
                required
              />
              {repeatPassword.length > 0 && (
                <div
                  className={`flex items-center gap-1.5 text-xs ${
                    password === repeatPassword
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {password === repeatPassword ? (
                    <>
                      <Check className="h-3 w-3" />
                      Пароли совпадают
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Пароли не совпадают
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* ЧЕКБОКС — СОГЛАСИЕ С ОФЕРТОЙ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <div className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 transition checked:border-[#6C63FF] checked:bg-[#6C63FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30"
                  />
                  {agreed && (
                    <Check className="pointer-events-none absolute h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm leading-relaxed text-white/70">
                  Я согласен с{' '}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="text-[#B794F6] underline-offset-4 hover:underline"
                  >
                    Пользовательским соглашением
                  </Link>{' '}
                  и{' '}
                  <Link
                    href="/privacy"
                    target="_blank"
                    className="text-[#B794F6] underline-offset-4 hover:underline"
                  >
                    Политикой конфиденциальности
                  </Link>
                </span>
              </label>
            </motion.div>

            {/* ОШИБКА */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </motion.div>
            )}

            {/* КНОПКА */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={isLoading || !usernameValid || !agreed}
                className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-6 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  {isLoading
                    ? 'Создаём аккаунт...'
                    : role === 'artist'
                      ? 'Создать аккаунт художника'
                      : role === 'client'
                        ? 'Создать аккаунт заказчика'
                        : 'Создать универсальный аккаунт'}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            </motion.div>

            {/* ВХОД */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-center text-sm text-white/50"
            >
              Уже есть аккаунт?{' '}
              <Link
                href="/auth/login"
                className="text-[#B794F6] underline-offset-4 transition hover:text-white hover:underline"
              >
                Войти
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}