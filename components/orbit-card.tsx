'use client';

import Link from 'next/link';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { useState } from 'react';

type Artwork = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  artist_name: string;
};

export function OrbitCard({
  artwork,
  index,
  total,
  orbitAngle,
  radius,
  baseAngle,
  isMounted,
}: {
  artwork: Artwork;
  index: number;
  total: number;
  orbitAngle: MotionValue<number>;
  radius: number;
  baseAngle: number;
  isMounted: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // 🎯 Угол карточки = базовый угол + угол орбиты
  const angle = useTransform(orbitAngle, (a: number) => a + baseAngle);

  // 🎯 X и Y — по кругу
  const x = useTransform(angle, (a: number) =>
    Math.cos((a * Math.PI) / 180) * radius
  );
  const y = useTransform(angle, (a: number) =>
    Math.sin((a * Math.PI) / 180) * radius * 0.4
  );

  // 🎯 Z-глубина
  const z = useTransform(angle, (a: number) =>
    Math.sin((a * Math.PI) / 180)
  );

  // 🎯 Масштаб
  const scale = useTransform(z, [-1, 1], [0.6, 1.2]);

  // 🎯 Прозрачность
  const opacity = useTransform(z, [-1, 1], [0.4, 1]);

  // 🎯 Z-index
  const zIndex = useTransform(z, [-1, 1], [1, 100]);

  // 🎯 Наклон
  const rotate = useTransform(angle, (a: number) => a * 0.1);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        x,
        y,
        scale,
        opacity,
        zIndex,
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: 0,
        scale: 0,
      }}
      animate={
        isMounted
          ? {
              opacity: 1,
              scale: 1,
            }
          : {}
      }
      transition={{
        duration: 1,
        delay: 0.5 + index * 0.15,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      <Link href={`/artwork/${artwork.id}`}>
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            scale: isHovered ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
          style={{
            width: 140,
            height: 180,
            transform: 'translate(-50%, -50%)',
          }}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/20 shadow-2xl shadow-black/50 transition-all hover:border-[#B794F6]"
        >
          <img
            src={artwork.image_url}
            alt={artwork.title}
            className="h-full w-full object-cover"
          />

          <div
            className={`pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h3 className="line-clamp-1 text-xs font-bold text-white">
              {artwork.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-white/60">
              <span>{artwork.artist_name}</span>
              {artwork.price > 0 && (
                <>
                  <span>·</span>
                  <span className="font-bold text-[#B794F6]">
                    от {artwork.price.toLocaleString('ru-RU')}₽
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}