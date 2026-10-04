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

  // 🎯 Скрыть скролл на главной
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.dataset.page = 'home';

    return () => {
      document.body.style.overflow = '';
      delete document.body.dataset.page;
    };
  }, []);

  // 🎯 Лоадер → hero
  useEffect(() => {
    if (!isLoading) {
      setShowHero(true);
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showHero ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ pointerEvents: showHero ? 'auto' : 'none' }}
      >
        <HeroGalaxy heroArtworks={heroArtworks} isVisible={showHero} />
      </motion.div>
    </>
  );
}