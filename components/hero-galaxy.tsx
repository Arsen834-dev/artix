'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
  className = '',
}: {
  text: string;
  delay?: number;
  speed?: number;
  isVisible: boolean;
  className?: string;
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
    <span className={className}>
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
function AnimatedLetters({
  text,
  delay = 0,
  isVisible,
}: {
  text: string;
  delay?: number;
  isVisible: boolean;
}) {
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
    Array<{
      x: number;
      y: number;
      size: number;
      opacity: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(generated);
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
            scale: [1, 1.3, 1],
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
// ЛУНА — ПЛАВНАЯ + ГРАНИЦЫ
// ============================================
function Moon({ velocityRef }: { velocityRef: React.MutableRefObject<number> }) {
  const moonRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const lastVelocityRef = useRef(0);

  useEffect(() => {
    let animationId: number;
    const RANGE = window.innerHeight + 800; // цикл

    const animate = () => {
      if (moonRef.current) {
        lastVelocityRef.current +=
          (velocityRef.current - lastVelocityRef.current) * 0.06;
        positionRef.current -= lastVelocityRef.current * 0.15;

        // 🎯 Зацикливание
        let y = positionRef.current;
        while (y < -RANGE) y += RANGE;
        while (y > RANGE) y -= RANGE;
        positionRef.current = y;

        moonRef.current.style.transform = `translate(-50%, ${positionRef.current}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [velocityRef]);
  
  return (
    <motion.div
      ref={moonRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="pointer-events-none absolute left-1/2 top-[72%] z-[3]"
      style={{ transform: 'translate(-50%, 0%)' }}
    >
      <div className="relative">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            width: '85vw',
            height: '85vw',
            background:
              'radial-gradient(circle, rgba(108, 99, 255, 0.5) 0%, rgba(183, 148, 246, 0.2) 40%, transparent 70%)',
          }}
        />

        <div
          className="relative overflow-hidden rounded-full"
          style={{
            width: '80vw',
            height: '80vw',
            background: `radial-gradient(circle at 50% 25%, #e8dcff 0%, #d4c4ff 8%, #b794f6 22%, #6C63FF 48%, #3a2a7a 72%, #15102a 92%, #0a0a0f 100%)`,
            boxShadow: `
              inset -50px -50px 100px rgba(0, 0, 0, 0.8),
              inset 50px 50px 100px rgba(183, 148, 246, 0.5),
              inset 0 -80px 120px rgba(0, 0, 0, 0.6),
              0 -40px 120px rgba(108, 99, 255, 0.6),
              0 0 200px rgba(108, 99, 255, 0.3)
            `,
          }}
        >
          <div className="absolute rounded-full" style={{ width: '18%', height: '18%', left: '20%', top: '32%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.6) 0%, rgba(80, 60, 140, 0.3) 50%, transparent 100%)', boxShadow: 'inset 6px 6px 16px rgba(0,0,0,0.5), inset -4px -4px 12px rgba(183, 148, 246, 0.2)' }} />
          <div className="absolute rounded-full" style={{ width: '12%', height: '12%', left: '62%', top: '22%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.5) 0%, rgba(80, 60, 140, 0.2) 60%, transparent 100%)', boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.45)' }} />
          <div className="absolute rounded-full" style={{ width: '8%', height: '8%', left: '42%', top: '58%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.5) 0%, transparent 100%)', boxShadow: 'inset 3px 3px 8px rgba(0,0,0,0.4)' }} />
          <div className="absolute rounded-full" style={{ width: '6%', height: '6%', left: '72%', top: '55%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.4) 0%, transparent 100%)', boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.4)' }} />
          <div className="absolute rounded-full" style={{ width: '10%', height: '10%', left: '30%', top: '68%', background: 'radial-gradient(circle, rgba(60, 40, 100, 0.5) 0%, transparent 100%)', boxShadow: 'inset 4px 4px 10px rgba(0,0,0,0.45)' }} />

          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full opacity-40 blur-2xl"
            style={{
              width: '50%',
              height: '15%',
              background:
                'radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
          style={{ width: '70vw' }}
        >
          <h1
            className="select-none text-center font-bold leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
              fontSize: 'clamp(5rem, 14vw, 18rem)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(183,148,246,0.5) 40%, rgba(108,99,255,0.2) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter:
                'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 40px rgba(108, 99, 255, 0.4))',
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
// КАРТОЧКА — ДВИЖЕТСЯ САМА + СКРОЛЛ УСКОРЯЕТ
// ============================================
function FlyingCard({
  artwork,
  index,
  scrollRef,
}: {
  artwork: Artwork;
  index: number;
  scrollRef: React.MutableRefObject<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const autoScrollRef = useRef(0);

  const config = [
    { y: 22, size: 280, offset: 0, z: 8, speed: 0.15 },
    { y: 48, size: 340, offset: 700, z: 10, speed: 0.12 },
    { y: 18, size: 260, offset: 1400, z: 6, speed: 0.18 },
    { y: 58, size: 320, offset: 2100, z: 9, speed: 0.1 },
    { y: 38, size: 360, offset: 2800, z: 11, speed: 0.14 },
    { y: 65, size: 280, offset: 3500, z: 7, speed: 0.16 },
  ];

  const c = config[index % config.length];
  const RANGE = 4200;

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      if (cardRef.current) {
        autoScrollRef.current += c.speed;

        const raw = c.offset - autoScrollRef.current - scrollRef.current * 0.5;
        const wrappedX = ((raw % RANGE) + RANGE) % RANGE;

        const xPercent = (wrappedX / RANGE) * 160 - 30;

        const phase = wrappedX / RANGE;
        const arcY = Math.sin(phase * Math.PI * 2) * 18;
        const yPercent = c.y + arcY;

        const distanceFromCenter = Math.abs(xPercent - 50);
        const scale = Math.max(0.7, 1.1 - (distanceFromCenter / 100) * 0.4);

        let opacity = 1;
        if (xPercent < 0) opacity = Math.max(0, (xPercent + 30) / 30);
        if (xPercent > 100) opacity = Math.max(0, (130 - xPercent) / 30);

        const z = c.z + (scale > 1 ? 5 : 0);

        cardRef.current.style.left = `${xPercent}%`;
        cardRef.current.style.top = `${yPercent}%`;
        cardRef.current.style.opacity = `${opacity}`;
        cardRef.current.style.zIndex = `${z}`;
        cardRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [c, scrollRef]);

  return (
    <div
      ref={cardRef}
      className="absolute"
      style={{
        left: '-30%',
        top: `${c.y}%`,
        opacity: 0,
        willChange: 'left, top, opacity, transform',
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: c.size,
          height: c.size * 1.3,
          boxShadow: `
            0 4px 8px rgba(0, 0, 0, 0.3),
            0 16px 32px rgba(108, 99, 255, 0.15),
            0 32px 64px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2)
          `,
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
        className="group relative cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105 hover:border-[#B794F6]/40"
      >
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="h-full w-full object-cover"
        />

        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0%, transparent 100%)',
          }}
        />

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10, 10, 15, 0.95) 0%, rgba(10, 10, 15, 0.7) 50%, transparent 100%)',
            }}
          />
          <div className="relative p-4">
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              автор
            </div>
            <div className="mt-0.5 font-serif text-sm italic text-[#B794F6]">
              {artwork.artist_name}
            </div>
          </div>
        </div>
      </div>
    </div>
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
  const scrollRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      velocityRef.current += e.deltaY * 0.4;
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      scrollRef.current += velocityRef.current;
      velocityRef.current *= 0.94;
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0f]">
      <Stars />

      {/* ЛОГО + ARTIX СВЕРХУ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute left-1/2 top-10 z-30 flex -translate-x-1/2 items-center gap-3"
      >
        <Image
          src="/logo.png"
          alt="Artix"
          width={48}
          height={48}
          className="object-contain drop-shadow-[0_0_16px_rgba(108,99,255,0.8)]"
        />
        <span className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Artix</span>
        </span>
      </motion.div>

      {/* ВОЛНИСТАЯ ЛИНИЯ */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute left-1/2 top-24 z-20 -translate-x-1/2"
      >
        <svg width="260" height="12" viewBox="0 0 260 12">
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

      {/* КАРТОЧКИ */}
      <div className="absolute inset-0 z-[5]">
        {heroArtworks.slice(0, 6).map((art, i) => (
          <FlyingCard key={art.id} artwork={art} index={i} scrollRef={scrollRef} />
        ))}
      </div>

      {/* ЛУНА */}
      <Moon velocityRef={velocityRef} />

      {/* ЦЕНТРАЛЬНЫЙ ТЕКСТ */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center pb-64">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-6 flex items-center gap-4"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px w-16 origin-right bg-gradient-to-l from-[#B794F6]/60 to-transparent"
          />
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-[#B794F6]/80 md:text-sm">
            добро пожаловать в
          </span>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={isVisible ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px w-16 origin-left bg-gradient-to-r from-[#B794F6]/60 to-transparent"
          />
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-96 rounded-full bg-[#6C63FF]/20 blur-[80px] md:h-32" />
          </div>
          <h2
            className="gradient-text relative text-center text-5xl font-bold leading-none md:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            <TypewriterText
              text="Галактику"
              delay={0.6}
              speed={140}
              isVisible={isVisible}
            />
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 2.4 }}
          className="my-4 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[#B794F6]/30" />
          <span className="font-serif text-sm italic text-white/40 md:text-base">
            где рождаются
          </span>
          <span className="h-px w-8 bg-[#B794F6]/30" />
        </motion.div>

        <div className="relative">
          <h2
            className="relative text-center text-5xl font-bold leading-none text-white md:text-6xl lg:text-7xl"
            style={{
              fontFamily: 'var(--font-unbounded), system-ui, sans-serif',
              letterSpacing: '-0.03em',
            }}
          >
            <TypewriterText
              text="искусства"
              delay={2.8}
              speed={140}
              isVisible={isVisible}
            />
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 4.8 }}
          className="mt-8 max-w-lg text-center"
        >
          <p className="font-serif text-sm italic leading-relaxed text-white/40 md:text-base">
            <AnimatedLetters
              text="Открой для себя художников со всей вселенной"
              delay={4.9}
              isVisible={isVisible}
            />
          </p>
        </motion.div>

        {/* КНОПКИ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 5.8 }}
          className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3"
        >
          <a
            href="/feed"
            className="group relative overflow-hidden rounded-full border border-white/10 bg-white px-8 py-4 text-sm font-semibold text-black shadow-2xl shadow-white/10 transition-all duration-500 hover:scale-105"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
              Смотреть галактику
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#6C63FF] to-[#B794F6] transition-transform duration-500 group-hover:translate-x-0" />
          </a>

          <a
            href="/auth/sign-up"
            className="group relative overflow-hidden rounded-full border border-[#6C63FF]/30 bg-[#6C63FF]/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all duration-500 hover:border-[#6C63FF]/60 hover:bg-[#6C63FF]/20"
          >
            <span className="relative z-10">Присоединиться</span>
          </a>
        </motion.div>
      </div>

      {/* ПОДСКАЗКА */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : {}}
        transition={{ delay: 6.6, duration: 1 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2"
      >
        <motion.div
          animate={{ x: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs uppercase tracking-widest text-white/40"
        >
          Скролль мышкой →
        </motion.div>
      </motion.div>
    </div>
  );
}