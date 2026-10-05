'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 🎯 Определяем направление перехода (главные вкладки)
  const getTransition = () => {
    if (pathname === '/') {
      return { initial: { opacity: 0, scale: 1.05 }, animate: { opacity: 1, scale: 1 } };
    }
    if (pathname.startsWith('/feed')) {
      return { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } };
    }
    if (pathname.startsWith('/services')) {
      return { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } };
    }
    if (pathname.startsWith('/orders')) {
      return { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
    }
    if (pathname.startsWith('/artist')) {
      return { initial: { opacity: 0, scale: 0.98 }, animate: { opacity: 1, scale: 1 } };
    }
    if (pathname.startsWith('/messages') || pathname.startsWith('/chat')) {
      return { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } };
    }
    // Default
    return { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } };
  };

  const transition = getTransition();

  return (
    <motion.div
      key={pathname}
      initial={transition.initial}
      animate={transition.animate}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}