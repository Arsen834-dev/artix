// app/auth/error/page.tsx
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center overflow-hidden bg-[#0a0a0f] p-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-red-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0f]/80 p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>

        <h1 className="display-title text-2xl font-bold text-white">
          Что-то пошло не так
        </h1>

        <p className="mt-4 text-sm text-white/60">
          {params?.error
            ? `Ошибка: ${params.error}`
            : 'Неизвестная ошибка. Попробуй ещё раз.'}
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/auth/login"
            className="block rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Вернуться ко входу
          </Link>
          <Link
            href="/"
            className="block text-sm text-white/50 hover:text-[#B794F6]"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}