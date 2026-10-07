// app/about/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  MessageCircle,
  Upload,
  Palette,
  ShoppingBag,
  Briefcase,
  Star,
  Heart,
  Zap,
  ArrowRight,
  Handshake,
  Info,
  Wallet,
} from 'lucide-react';

// ============================================
// СЕКЦИЯ 1: HERO
// ============================================
function AboutHero() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#6C63FF]/20 blur-[120px]" />
        <div className="absolute -right-40 top-40 h-[600px] w-[600px] rounded-full bg-[#4FD1C5]/15 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-2xl shadow-[#6C63FF]/40"
        >
          <Sparkles className="h-10 w-10 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="display-title text-5xl font-bold text-white md:text-7xl"
          style={{ fontFamily: 'var(--font-unbounded), system-ui, sans-serif' }}
        >
          О проекте <span className="gradient-text">Artix</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
        >
          Artix — это космическая галерея и фриланс-биржа для художников.
          Здесь творцы показывают работы, продают услуги и находят заказы.
          А заказчики — находят таланты для любых задач.
        </motion.p>
      </div>
    </section>
  );
}

// ============================================
// СЕКЦИЯ 2: КАК ЭТО РАБОТАЕТ
// ============================================
function HowItWorks() {
  const artistSteps = [
    {
      icon: Palette,
      title: 'Регистрируйся',
      description: 'Создай аккаунт художника за 30 секунд',
    },
    {
      icon: Upload,
      title: 'Загружай',
      description: 'Публикуй работы в портфолио и услуги с ценами',
    },
    {
      icon: MessageCircle,
      title: 'Получай заказы',
      description: 'Общайся с заказчиками и выполняй работы',
    },
  ];

  const clientSteps = [
    {
      icon: Search,
      title: 'Ищи',
      description: 'Найди художника по стилю, цене или категории',
    },
    {
      icon: MessageCircle,
      title: 'Связывайся',
      description: 'Напиши автору или создай свой заказ',
    },
    {
      icon: Star,
      title: 'Получай результат',
      description: 'Художник создаёт арт, ты получаешь работу',
    },
  ];

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-sm uppercase tracking-widest text-[#B794F6]">
            Как это работает
          </span>
          <h2 className="display-title mt-3 text-4xl font-bold text-white md:text-5xl">
            Для <span className="gradient-text">художников</span> и{' '}
            <span className="text-[#4FD1C5]">заказчиков</span>
          </h2>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Художники */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-lg shadow-[#6C63FF]/30">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="display-title text-2xl font-bold text-white">
                  Я художник
                </h3>
                <p className="text-sm text-white/40">
                  Продавай работы и услуги
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {artistSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#16161f]/40 p-5 backdrop-blur-sm transition hover:border-[#6C63FF]/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6C63FF]/20 text-lg font-bold text-[#B794F6]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="mt-1 text-sm text-white/50">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Заказчики */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4FD1C5] to-[#68D391] shadow-lg shadow-[#4FD1C5]/30">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="display-title text-2xl font-bold text-white">
                  Я заказчик
                </h3>
                <p className="text-sm text-white/40">
                  Находи художников и заказывай
                </p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {clientSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-[#16161f]/40 p-5 backdrop-blur-sm transition hover:border-[#4FD1C5]/30"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4FD1C5]/20 text-lg font-bold text-[#4FD1C5]">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="mt-1 text-sm text-white/50">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// СЕКЦИЯ 3: КАК РАБОТАЕТ ОПЛАТА (честный блок)
// ============================================
function HowPaymentWorks() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-sm uppercase tracking-widest text-[#B794F6]">
            Оплата
          </span>
          <h2 className="display-title mt-3 text-4xl font-bold text-white md:text-5xl">
            Как работает <span className="gradient-text">оплата</span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/20">
                <Info className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="display-title text-xl font-bold text-white">
                Artix — трекер сделок, не платёжная система
              </h3>
            </div>

            <div className="space-y-4 text-white/70">
              <p>
                <span className="font-semibold text-white">
                  Мы не проводим оплату.
                </span>{' '}
                Artix помогает найти друг друга, зафиксировать договорённость и
                отслеживать статус работы.
              </p>

              <p>
                <span className="font-semibold text-white">
                  Оплата — напрямую между вами.
                </span>{' '}
                Заказчик и художник договариваются о способе перевода в чате
                (СБП, банковская карта, что угодно). Artix не участвует в
                переводе и не берёт процент.
              </p>

              <p>
                <span className="font-semibold text-white">
                  Зачем тогда сделка?
                </span>{' '}
                Чтобы у обеих сторон была чёткая фиксация: что делаем, за
                сколько, к какому сроку. И чтобы был трекер статуса — от
                «обсуждаем» до «завершено».
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 rounded-3xl border border-white/10 bg-[#16161f]/40 p-8"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6C63FF]/20">
                <Handshake className="h-6 w-6 text-[#B794F6]" />
              </div>
              <h3 className="display-title text-xl font-bold text-white">
                Сделки — бесплатны
              </h3>
            </div>

            <div className="space-y-4 text-white/70">
              <p>
                Artix не берёт комиссию. Художник получает всю сумму, которую
                вы обсудили.
              </p>

              <p>
                Если хочешь поддержать развитие проекта — стань{' '}
                <Link
                  href="/auth/sign-up"
                  className="text-[#B794F6] underline-offset-4 hover:underline"
                >
                  спонсором
                </Link>{' '}
                за 150 ₽. Это добровольный донат, не обязательство.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================
// СЕКЦИЯ 4: ЧТО ВНУТРИ
// ============================================
function Features() {
  const features = [
    {
      icon: Palette,
      title: 'Работы',
      description: 'Галерея артов — портфолио художников',
      color: '#6C63FF',
    },
    {
      icon: Briefcase,
      title: 'Услуги',
      description: 'Художники предлагают услуги с ценами и сроками',
      color: '#B794F6',
    },
    {
      icon: ShoppingBag,
      title: 'Заказы',
      description: 'Заказчики публикуют задачи с бюджетом',
      color: '#4FD1C5',
    },
    {
      icon: Handshake,
      title: 'Сделки',
      description: 'Трекер договорённостей со статусами',
      color: '#68D391',
    },
    {
      icon: Star,
      title: 'Отзывы',
      description: 'Заказчики оценивают художников после сделки',
      color: '#F6AD55',
    },
    {
      icon: Heart,
      title: 'Спонсорство',
      description: 'Значок PRO для поддерживающих платформу',
      color: '#F687B3',
    },
  ];

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-sm uppercase tracking-widest text-[#B794F6]">
            Что внутри
          </span>
          <h2 className="display-title mt-3 text-4xl font-bold text-white md:text-5xl">
            Всё для <span className="gradient-text">творчества</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/40 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:border-white/10"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`,
                  }}
                >
                  <Icon
                    className="h-6 w-6"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="display-title text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-white/50">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ============================================
// СЕКЦИЯ 5: FAQ
// ============================================
function FAQ() {
  const faqs = [
    {
      q: 'Сколько стоит пользоваться Artix?',
      a: 'Регистрация, публикация работ, услуг, заказов и сделки — бесплатно. Мы не берём комиссию. Хочешь поддержать проект — стань спонсором за 150 ₽ и получи золотую звезду в профиле.',
    },
    {
      q: 'Как проходят оплаты?',
      a: 'Artix не проводит оплату и не хранит деньги. Заказчик и художник договариваются о способе перевода напрямую в чате (СБП, карта). Сделка на Artix — это трекер: вы фиксируете договорённость и отслеживаете статус работы.',
    },
    {
      q: 'Что делать, если что-то пошло не так?',
      a: 'В сделке есть кнопка «Открыть спор». Обе стороны могут её нажать, если возникли проблемы. Платформа подключается и разбирается в течение 3 рабочих дней.',
    },
    {
      q: 'Можно быть и художником, и заказчиком?',
      a: 'Да. При регистрации выбери роль «Оба» — и ты сможешь и публиковать работы и услуги, и создавать заказы. Роль можно сменить в настройках профиля.',
    },
    {
      q: 'Кто может выкладывать работы?',
      a: 'Любой, кто зарегистрировался. Загружай картинку, выбирай категорию, добавляй теги — и работа в галактике.',
    },
    {
      q: 'Кто может оставлять отзывы?',
      a: 'Только заказчик и только после завершения сделки. Один отзыв на одну сделку. Художник отзыв о заказчике не оставляет.',
    },
    {
      q: 'Что за золотая звезда?',
      a: 'Значок спонсора. Появляется рядом с именем в ленте, профиле и на всех карточках. Так проект отмечает тех, кто поддерживает его развитие.',
    },
  ];

  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-sm uppercase tracking-widest text-[#B794F6]">
            Частые вопросы
          </span>
          <h2 className="display-title mt-3 text-4xl font-bold text-white md:text-5xl">
            Всё, что нужно <span className="gradient-text">знать</span>
          </h2>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/5 bg-[#16161f]/40 p-6 backdrop-blur-sm transition hover:border-[#6C63FF]/20"
            >
              <h3 className="display-title text-lg font-bold text-white">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {faq.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// СЕКЦИЯ 6: CTA
// ============================================
function FinalCTA() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#16161f] to-[#0a0a0f] p-12 text-center md:p-20"
        >
          <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#6C63FF]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#4FD1C5]/20 blur-[100px]" />

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="mx-auto h-12 w-12 text-[#B794F6]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="display-title mt-6 text-4xl font-bold text-white md:text-6xl"
            >
              Присоединяйся к{' '}
              <span className="gradient-text">галактике</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mt-4 max-w-xl text-white/60"
            >
              Тысячи художников и заказчиков уже здесь. Найди своё место в
              Artix.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/auth/sign-up"
                className="group relative overflow-hidden rounded-full border border-white/10 bg-white px-8 py-4 text-sm font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover:text-white">
                  Создать аккаунт
                  <ArrowRight className="h-4 w-4" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
              </Link>
              <Link
                href="/feed"
                className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white/80 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
              >
                Смотреть галактику
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      <AboutHero />
      <HowItWorks />
      <HowPaymentWorks />
      <Features />
      <FAQ />
      <FinalCTA />
    </div>
  );
}