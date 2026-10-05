// lib/supabase/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Если env vars не заданы — пропускаем (для локальной разработки без Supabase)
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Обновляем сессию (refresh cookies). НЕ ставим между createServerClient и getClaims
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  // 🎯 Если залогинен и открывает /auth/login или /auth/sign-up — редиректим на /feed
  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/sign-up");

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  // ⚠️ НЕ редиректим гостей отсюда.
  // Защита приватных страниц — на уровне серверных компонентов
  // (app/upload/page.tsx, app/settings/profile/page.tsx, app/deals/page.tsx,
  //  app/messages/page.tsx, app/chat/[id]/page.tsx — там уже есть redirect('/auth/login')).

  return supabaseResponse;
}