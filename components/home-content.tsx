'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroGalaxy } from './hero-galaxy';
import { Loader } from './loader';

type HeroArtwork = {
  id: number;
  title: string;
  image_url: string;
  price: number;
  artist_name: string;
};

export function HomeContent({
  heroArtworks,
}: {
  heroArtworks: HeroArtwork[];
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showHero, setShowHero] = useState(false);

useEffect(() => {
  // 🎯 Помечаем, что мы на главной — скролл выключен
  document.body.dataset.page = 'home';
  document.body.style.overflow = 'hidden';

  if (isLoading) {
    document.body.dataset.loading = 'true';
    setShowHero(false);
  } else {
    document.body.dataset.loading = 'false';
    const timer = setTimeout(() => setShowHero(true), 100);
    return () => clearTimeout(timer);
  }

  // 🎯 При уходе с главной — снимаем метку и включаем скролл
  return () => {
    delete document.body.dataset.page;
    document.body.style.overflow = '';
  };
}, [isLoading]);
  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Hero монтируется СРАЗУ, но visible=false */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
        animate={
          showHero
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
        }
        transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{ pointerEvents: showHero ? 'auto' : 'none' }}
      >
        {/* 🎯 КЛЮЧЕВОЕ: передаём isVisible — печатание начнётся ТОЛЬКО когда true */}
        <HeroGalaxy heroArtworks={heroArtworks} isVisible={showHero} />
      </motion.div>
    </>
  );
}