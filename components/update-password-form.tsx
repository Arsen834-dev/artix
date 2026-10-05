// components/update-password-form.tsx
'use client';

import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import { PasswordInput, checkPasswordStrength } from '@/components/password-input';

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    // 🎯 Проверка сложности
    const strength = checkPasswordStrength(password);
    if (strength.passedCount < 5) {
      setError('Пароль слишком слабый. Выполни все требования.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      // 🎯 FIX: /settings/profile вместо /protected
      router.push('/settings/profile');
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
            <h1 className="display-title text-3xl font-bold text-white">
              Новый <span className="gradient-text">пароль</span>
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Придумай надёжный пароль
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-white/70"
              >
                Новый пароль
              </Label>
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="Новый пароль"
                showStrength={true}
                required
              />
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
                {isLoading ? 'Сохраняем...' : 'Сохранить пароль'}
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}