// app/banned/page.tsx
import Link from 'next/link';
import { Ban } from 'lucide-react';

export default function BannedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
          <Ban className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="display-title text-4xl font-bold text-white">
          Аккаунт заблокирован
        </h1>
        <p className="mt-4 text-white/60">
          Ты не можешь использовать Artix. Если считаешь блокировку
          несправедливой — напиши нам.
        </p>
        <div className="mt-8">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            Связаться в Discord
          </a>
        </div>
      </div>
    </div>
  );
}