// lib/use-body-scroll-lock.ts
'use client';

import { useEffect } from 'react';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

function lock() {
  if (typeof document === 'undefined') return;

  lockCount += 1;

  if (lockCount === 1) {
    // Запоминаем оригинальные значения
    originalOverflow = document.body.style.overflow;
    originalPaddingRight = document.body.style.paddingRight;

    // Компенсируем ширину скроллбара, чтобы не было «прыжка»
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
}

function unlock() {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  }
}

export function useBodyScrollLock(active: boolean = true) {
  useEffect(() => {
    if (!active) return;

    lock();
    return () => {
      unlock();
    };
  }, [active]);
}