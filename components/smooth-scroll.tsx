'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // 🎯 Отключаем Lenis для элементов с data-lenis-prevent
      prevent: (node) => {
        // Проверяем сам элемент и его родителей
        let el: HTMLElement | null = node;
        while (el) {
          if (el.hasAttribute('data-lenis-prevent')) return true;
          el = el.parentElement;
        }
        return false;
      },
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}