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
  const [showCurtain, setShowCurtain] = useState(false);

  useEffect(() => {
    document.body.dataset.page = 'home';
    document.body.style.overflow = 'hidden';

    if (isLoading) {
      document.body.dataset.loading = 'true';
      setShowHero(false);
    } else {
      document.body.dataset.loading = 'false';
      // 🎯 Завеса + hero
      setShowCurtain(true);
      setTimeout(() => {
        setShowHero(true);
        setShowCurtain(false);
      }, 300);
    }

    return () => {
      delete document.body.dataset.page;
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Loader key="loader" onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* 🎯 ЗАВЕСА между лоадером и hero */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-[9998] bg-gradient-to-b from-[#0a0a0f] via-[#16161f] to-[#0a0a0f]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div className="display-title gradient-text text-4xl font-bold md:text-6xl">
                  Галактика
                </div>
                <div className="mt-2 font-serif text-sm italic text-white/40">
                  загрузка...
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
        animate={
          showHero
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : { opacity: 0, scale: 1.1, filter: 'blur(20px)' }
        }
        transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{ pointerEvents: showHero ? 'auto' : 'none' }}
      >
        <HeroGalaxy heroArtworks={heroArtworks} isVisible={showHero} />
      </motion.div>
    </>
  );
}