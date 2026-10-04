'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Search, MessageCircle, Upload } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Найди художника',
    description: 'Листай галактику, ищи работы по категориям',
  },
  {
    icon: MessageCircle,
    title: 'Свяжись',
    description: 'Напиши автору, обсуди детали, договорись о цене',
  },
  {
    icon: Upload,
    title: 'Получи работу',
    description: 'Художник создаёт арт, ты получаешь результат',
  },
];

export function HowItWorks() {
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
          <h2 className="display-title mt-3 text-4xl font-bold md:text-6xl">
            Всего <span className="gradient-text">3 шага</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-[#16161f]/40 p-8 backdrop-blur-sm transition hover:border-[#6C63FF]/30"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#B794F6] shadow-lg shadow-[#6C63FF]/30">
                <step.icon className="h-7 w-7 text-white" />
              </div>
              <div className="mb-2 text-sm font-medium text-white/40">
                Шаг {i + 1}
              </div>
              <h3 className="display-title text-2xl font-bold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-white/60">{step.description}</p>

              {/* Свечение при hover */}
              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#6C63FF]/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CallToAction() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-gradient-to-br from-[#16161f] to-[#0a0a0f] p-12 md:p-20"
        >
          {/* Свечения */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-[#6C63FF]/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-[#4FD1C5]/20 blur-[100px]" />

          <div className="relative text-center">
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
              className="display-title mt-6 text-4xl font-bold md:text-6xl"
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
              Тысячи художников уже здесь. Найди своего или покажи свои работы.
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
                className="rounded-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] px-8 py-3 font-medium text-white shadow-lg shadow-[#6C63FF]/30 transition hover:shadow-xl hover:shadow-[#6C63FF]/50 hover:scale-105"
              >
                Начать бесплатно
              </Link>
              <Link
                href="/about"
                className="rounded-full border border-white/10 px-8 py-3 font-medium text-white/80 transition hover:border-white/30 hover:bg-white/5"
              >
                О проекте
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}