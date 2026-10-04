import Link from "next/link";
import { Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6C63FF]/20 to-[#B794F6]/20 backdrop-blur">
          <Sparkles className="h-12 w-12 text-[#6C63FF]" />
        </div>

        <h1 className="display-title gradient-text text-7xl font-bold md:text-9xl">404</h1>
        <p className="mt-4 text-xl text-white/60">
          Эта планета ещё не открыта
        </p>
        <p className="mt-2 text-sm text-white/40">
          Страница потерялась в глубинах космоса
        </p>

        <Link
          href="/feed"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-6 py-3 font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition-all hover:shadow-xl hover:shadow-[#6C63FF]/50 hover:scale-105"
        >
          <Home className="h-4 w-4" />
          Вернуться в галактику
        </Link>
      </div>
    </div>
  );
}