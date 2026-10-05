'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll } from 'framer-motion';
import { OrbitCard } from './orbit-card';

type Artwork = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  artist_name: string;
};

// ============================================
// ПЕЧАТАНИЕ
// ============================================
function TypewriterText({
  text,
  delay = 0,
  speed = 120,
  isVisible,
}: {
  text: string;
  delay?: number;
  speed?: number;
  isVisible: boolean;
}) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isVisible) {
      setDisplayed('');
      return;
    }

    let timeout: NodeJS.Timeout;
    let index = 0;

    const startTyping = () => {
      const type = () => {
        if (index < text.length) {
          setDisplayed(text.slice(0, index + 1));
          index++;
          timeout = setTimeout(type, speed);
        }
      };
      type();
    };

    timeout = setTimeout(startTyping, delay * 1000);

    return () => clearTimeout(timeout);
  }, [text, delay, speed, isVisible]);

  return (
    <span>
      {displayed}
      {isVisible && displayed.length < text.length && displayed.length > 0 && (
        <span
          className="ml-1 inline-block h-[0.85em] w-[3px] bg-[#B794F6]"
          style={{ verticalAlign: 'middle' }}
        />
      )}
    </span>
  );
}

// ============================================
// АНИМАЦИЯ БУКВ
// ============================================
function AnimatedLetters({ text, delay = 0, isVisible }: { text: string; delay?: number; isVisible: boolean }) {
  return (
    <span className="inline-block">
      {text.split('').map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: isVisible ? delay + i * 0.03 : 0,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="inline-block"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================
// ЗВЁЗДЫ
// ============================================
function Stars() {
  const [stars, setStars] = useState<
    Array<{ x: number; y: number; size: number; opacity: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 80 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      }))
    );
  }, []);

  if (stars.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// ЛУНА
// ============================================
function Moon({ size = 80, rotateValue }: { size?: number; rotateValue: any }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/2 z-[5]"
      style={{
        width: `${size}vw`,
        height: `${size}vw`,
        maxWidth: '600px',
        maxHeight: '600px',
        x: '-50%',
        y: '-50%',
        rotate: rotateValue,
      }}
    >
      <div className="relative h-full w-full">
        {/* Свечение */}
        <div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(108, 99, 255, 0.6) 0%, transparent 70%)',
          }}
        />

        {/* Луна */}
        <div
          className="relative h-full w-full overflow-hidden rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 25%, #e8dcff 0%, #d4c4ff 8%, #b794f6 22%, #6C63FF 48%, #3a2a7a 72%, #15102a 92%, #0a0a0f 100%)`,
            boxShadow: `
              inset -50px -50px 100px rgba(0, 0, 0, 0.8),
              inset 50px 50px 100px rgba(183, 148, 246, 0.5),
              0 0 200px rgba(108, 99, 255, 0.5)
            `,
          }}
        >
          {/* Кратеры */}
          <div className="absolute rounded-full" style={{ width: '18%', height: '18%', left: '20%', top: '32%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.6), transparent 100%)' }} />
          <div className="absolute rounded-full" style={{ width: '12%', height: '12%', left: '62%', top: '22%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.5), transparent 100%)' }} />
          <div className="absolute rounded-full" style={{ width: '8%', height: '8%', left: '42%', top: '58%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.5), transparent 100%)' }} />
        </div>

        {/* ARTIX на луне */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1
            className="select-none text-center font-bold leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
              fontSize: 'clamp(3rem, 10vw, 12rem)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(183,148,246,0.5) 50%, rgba(108,99,255,0.2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6))',
            }}
          >
            ARTIX
          </h1>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ
// ============================================
export function HeroGalaxy({
  heroArtworks,
  isVisible,
}: {
  heroArtworks: Artwork[];
  isVisible: boolean;
}) {
  // 🎯 Угол орбиты — управляется скроллом
  const scrollVelocity = useRef(0);
  const orbitAngle = useMotionValue(0);
  const [isMounted, setIsMounted] = useState(false);

  // 🎯 Постоянное вращение + ускорение от скролла
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // 🎯 Базовая скорость 5°/сек + скролл
      const baseSpeed = 5;
      const scrollBoost = Math.abs(scrollVelocity.current) * 3;

      orbitAngle.set(orbitAngle.get() + (baseSpeed + scrollBoost) * delta);

      // 🎯 Затухание скорости скролла
      scrollVelocity.current *= 0.95;

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [orbitAngle]);

  // 🎯 Запуск «влёта» после загрузки
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsMounted(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // 🎯 Скролл — добавляет velocity
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollVelocity.current += e.deltaY * 0.3;
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // 🎯 Поворот луны — медленный, независимый
  const moonRotate = useMotionValue(0);
  useEffect(() => {
    let animationId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      moonRotate.set(moonRotate.get() + 2 * delta);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [moonRotate]);

  const cards = heroArtworks.slice(0, 12);
  const total = cards.length;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0f]">
      <Stars />

      {/* ЛОГО СВЕРХУ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-1/2 top-8 z-30 flex -translate-x-1/2 items-center gap-2"
      >
        <Image
          src="/logo.png"
          alt="Artix"
          width={32}
          height={32}
          className="object-contain drop-shadow-[0_0_16px_rgba(108,99,255,0.8)]"
        />
        <span className="text-xl font-bold tracking-tight">
          <span className="gradient-text">Artix</span>
        </span>
      </motion.div>

      {/* ВОЛНИСТАЯ ЛИНИЯ */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 top-20 z-20 -translate-x-1/2"
      >
        <svg width="220" height="12" viewBox="0 0 260 12">
          <path
            d="M2 6 Q 35 1 65 6 T 130 6 T 195 6 T 258 6"
            stroke="url(#wave-gradient)"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6C63FF" stopOpacity="0" />
              <stop offset="50%" stopColor="#B794F6" stopOpacity="1" />
              <stop offset="100%" stopColor="#4FD1C5" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 🎯 ЛУНА В ЦЕНТРЕ */}
      <Moon size={50} rotateValue={moonRotate} />

      {/* 🎯 КАРТОЧКИ НА ОРБИТЕ */}
      <div className="absolute inset-0 z-[10]">
        {cards.map((artwork, i) => (
          <OrbitCard
            key={artwork.id}
            artwork={artwork}
            index={i}
            total={total}
            orbitAngle={orbitAngle}
            radius={Math.min(window.innerWidth * 0.35, 450)}
            baseAngle={(i / total) * 360}
            isMounted={isMounted}
          />
        ))}
      </div>

      {/* ЦЕНТРАЛЬНЫЙ ТЕКСТ — СНИЗУ ОТ ЛУНЫ */}
      <div className="pointer-events-none absolute bottom-12 left-1/2 z-[15] flex -translate-x-1/2 flex-col items-center text-center md:bottom-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h2
            className="gradient-text text-3xl font-bold md:text-5xl"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
            }}
          >
            <TypewriterText
              text="Галактика"
              delay={1.2}
              speed={120}
              isVisible={isVisible}
            />
          </h2>
          <h2
            className="text-3xl font-bold text-white md:text-5xl"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
            }}
          >
            <TypewriterText
              text="искусств"
              delay={2.4}
              speed={120}
              isVisible={isVisible}
            />
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 4 }}
            className="mt-4 max-w-md text-xs text-white/50 md:text-sm"
          >
            <AnimatedLetters
              text="Скролли мышкой, чтобы крутить кольцо"
              delay={4.1}
              isVisible={isVisible}
            />
          </motion.p>
        </motion.div>
      </div>

      {/* КНОПКИ — ВНИЗУ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 5 }}
        className="pointer-events-auto absolute bottom-4 left-1/2 z-[20] flex -translate-x-1/2 gap-2 md:bottom-6 md:gap-3"
      >
        <a
          href="/feed"
          className="group relative overflow-hidden rounded-full border border-white/10 bg-white px-5 py-2.5 text-xs font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-105 md:px-6 md:py-3 md:text-sm"
        >
          <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
            Смотреть галактику
          </span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
        </a>

        <a
          href="/auth/sign-up"
          className="rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur transition-all duration-500 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/20 md:px-6 md:py-3 md:text-sm"
        >
          Присоединиться
        </a>
      </motion.div>
    </div>
  );
}