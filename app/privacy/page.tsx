// app/privacy/page.tsx
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { PRIVACY_VERSION, PRIVACY_UPDATED } from '@/lib/legal-texts';

export const metadata = {
  title: 'Политика конфиденциальности — Artix',
  description: 'Как Artix обрабатывает персональные данные',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <Link
        href="/"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        На главную
      </Link>

      <div className="mx-auto max-w-3xl">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="display-title text-3xl font-bold text-white md:text-4xl">
              Политика конфиденциальности
            </h1>
            <p className="mt-1 text-sm text-white/40">
              Версия {PRIVACY_VERSION} · Обновлено {PRIVACY_UPDATED}
            </p>
          </div>
        </div>

        <div className="space-y-6 text-white/70">
          <Section title="1. Общие положения">
            <p>
              1.1. Настоящая Политика описывает, какие персональные данные
              собирает платформа Artix, как их использует и защищает.
            </p>
            <p>
              1.2. Используя Платформу, Пользователь соглашается с условиями
              настоящей Политики.
            </p>
          </Section>

          <Section title="2. Какие данные мы собираем">
            <p>2.1. При регистрации:</p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>адрес электронной почты (email);</li>
              <li>пароль (хранится в зашифрованном виде);</li>
              <li>username (публичный никнейм).</li>
            </ul>
            <p className="mt-4">
              2.2. При использовании Платформы (по желанию Пользователя):
            </p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>отображаемое имя, аватар, обложка профиля;</li>
              <li>биография, диапазон цен;</li>
              <li>ссылки на соцсети (Telegram, Instagram, Behance и др.);</li>
              <li>работы, услуги, заказы, отзывы.</li>
            </ul>
            <p className="mt-4">2.3. Автоматически:</p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>
                технические данные: IP-адрес, тип браузера, время визита
                (хранятся в логах хостинга);
              </li>
              <li>
                cookies для аутентификации и сохранения сессии.
              </li>
            </ul>
          </Section>

          <Section title="3. Зачем мы собираем данные">
            <p>3.1. Для предоставления функционала Платформы:</p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>регистрация и аутентификация;</li>
              <li>отображение профиля, работ, услуг, заказов;</li>
              <li>обмен сообщениями, работа сделок;</li>
              <li>уведомления о событиях.</li>
            </ul>
            <p className="mt-4">
              3.2. Мы <span className="font-semibold text-white">не продаём</span>{' '}
              и <span className="font-semibold text-white">не передаём</span>{' '}
              персональные данные третьим лицам, кроме случаев,
              предусмотренных законодательством РФ.
            </p>
          </Section>

          <Section title="4. Где хранятся данные">
            <p>
              4.1. Платформа использует сторонние сервисы для хранения данных:
            </p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>
                <span className="text-white">Supabase</span> — база данных и
                аутентификация (серверы в США/ЕС);
              </li>
              <li>
                <span className="text-white">Vercel</span> — хостинг
                приложения (CDN по всему миру).
              </li>
            </ul>
            <p className="mt-4">
              4.2. Данные передаются по защищённому протоколу HTTPS.
            </p>
          </Section>

          <Section title="5. Cookies">
            <p>
              5.1. Платформа использует cookies для аутентификации сессии.
              Cookies — это небольшие текстовые файлы, которые сохраняются в
              браузере.
            </p>
            <p>
              5.2. Пользователь может отключить cookies в настройках браузера,
              но это может нарушить работу Платформы.
            </p>
          </Section>

          <Section title="6. Права Пользователя">
            <p>6.1. Пользователь имеет право:</p>
            <ul className="ml-4 list-disc space-y-2 text-white/60">
              <li>получить информацию о том, какие данные о нём хранятся;</li>
              <li>исправить свои данные через настройки профиля;</li>
              <li>
                удалить аккаунт и все связанные с ним данные через настройки
                профиля (или через Discord-обращение).
              </li>
            </ul>
          </Section>

          <Section title="7. Изменения">
            <p>
              8.1. Мы можем обновлять настоящую Политику. Актуальная версия
              всегда доступна по адресу{' '}
              <Link
                href="/privacy"
                className="text-[#B794F6] hover:underline"
              >
                /privacy
              </Link>
              .
            </p>
          </Section>

          <Section title="8. Контакты">
            <p>
              9.1. По вопросам обработки данных обращайтесь через Discord:{' '}
              <span className="text-white">
                {process.env.NEXT_PUBLIC_SPONSOR_DISCORD || 'fl4wer834'}
              </span>
            </p>
          </Section>

          <div className="mt-12 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-6 text-sm">
            <p className="text-yellow-300">
              ⚠️ Настоящий документ является типовым шаблоном и не заменяет
              юридическую консультацию.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="display-title text-xl font-bold text-white">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}