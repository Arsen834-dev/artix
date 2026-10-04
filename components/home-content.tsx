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
    document.body.dataset.page = 'home';
    document.body.style.overflow = 'hidden';

    if (isLoading) {
      document.body.dataset.loading = 'true';
      setShowHero(false);
    } else {
      document.body.dataset.loading = 'false';
      // 🎯 Просто показываем hero, без завесы
      setShowHero(true);
    }

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