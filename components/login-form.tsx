'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail } from 'lucide-react';
import { PasswordInput } from '@/components/password-input';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // 🎯 Жёсткий редирект — гарантированно работает
        window.location.href = '/feed';
      } else {
        setError('Не удалось создать сессию');
        setIsLoading(false);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка');
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
        {/* Туманности */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#6C63FF]/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-[#4FD1C5]/15 blur-[80px]" />

        <div className="relative">
          {/* Заголовок */}
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
              С возвращением в{' '}
              <span className="gradient-text">Artix</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Войди, чтобы продолжить
            </p>
          </motion.div>

          {/* Форма */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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

            {/* ПАРОЛЬ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid gap-2"
            >
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-white/70"
                >
                  Пароль
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-white/40 underline-offset-4 transition hover:text-[#B794F6] hover:underline"
                >
                  Забыли пароль?
                </Link>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                required
              />
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
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="group relative w-full overflow-hidden rounded-full border border-white/10 bg-white px-6 py-6 font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-[1.02] disabled:opacity-50"
              >
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  {isLoading ? 'Входим...' : 'Войти'}
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </Button>
            </motion.div>

            {/* РЕГИСТРАЦИЯ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-sm text-white/50"
            >
              Нет аккаунта?{' '}
              <Link
                href="/auth/sign-up"
                className="text-[#B794F6] underline-offset-4 transition hover:text-white hover:underline"
              >
                Зарегистрироваться
              </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}