// components/forgot-password-form.tsx
'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Mail, Check } from 'lucide-react';

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
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
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
            </div>

            {success ? (
              <>
                <h1 className="display-title text-3xl font-bold text-white">
                  Проверь <span className="gradient-text">почту</span>
                </h1>
                <p className="mt-3 text-sm text-white/60">
                  Если ты регистрировался через email, мы отправили письмо со
                  ссылкой для сброса пароля. Проверь папку «Спам».
                </p>
              </>
            ) : (
              <>
                <h1 className="display-title text-3xl font-bold text-white">
                  Сброс <span className="gradient-text">пароля</span>
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  Введи email — пришлём ссылку для сброса
                </p>
              </>
            )}
          </div>

          {success ? (
            <Link
              href="/auth/login"
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white px-6 py-4 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                <Check className="h-5 w-5" />
                Вернуться ко входу
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
            </Link>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="grid gap-2">
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
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-6 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  {isLoading ? 'Отправляем...' : 'Отправить ссылку'}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </Button>

              <div className="text-center text-sm text-white/50">
                Вспомнил пароль?{' '}
                <Link
                  href="/auth/login"
                  className="text-[#B794F6] underline-offset-4 transition hover:text-white hover:underline"
                >
                  Войти
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}