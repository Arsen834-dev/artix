// components/custom-cursor.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  // 🎯 Рендерим только на устройствах с точным указателем (мышь/трекпад)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);

    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"]');
      isHovering.current = !!clickable;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const animate = () => {
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.15;
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px) translate(-50%, -50%)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailPos.current.x}px, ${trailPos.current.y}px) translate(-50%, -50%)`;

        const size = isHovering.current ? 40 : 24;
        trailRef.current.style.width = `${size}px`;
        trailRef.current.style.height = `${size}px`;
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Шлейф — плавно следует */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[999998] rounded-full border border-[#B794F6]/50 transition-[width,height] duration-300"
        style={{ width: 24, height: 24 }}
      />

      {/* Точка — мгновенно */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999999]"
      >
        <div className="h-2 w-2 rounded-full bg-[#B794F6]" />
      </div>
    </>
  );
}