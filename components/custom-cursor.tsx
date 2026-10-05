'use client';

import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      const target = e.target as HTMLElement;
      const clickable = target.closest('a, button, [role="button"]');
      isHovering.current = !!clickable;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationId: number;

    const animate = () => {
      // 🎯 Плавно догоняем курсор (шлейф)
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
        trailRef.current.style.background = isHovering.current
          ? 'rgba(183, 148, 246, 0.15)'
          : 'transparent';
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <>
      {/* 🎯 Шлейф — плавно следует за курсором */}
      <div
        ref={trailRef}
        className="pointer-events-none fixed left-0 top-0 z-[999998] rounded-full border border-[#B794F6]/50 transition-[width,height,background] duration-300"
        style={{ width: 24, height: 24 }}
      />

      {/* 🎯 Точка — мгновенно на курсоре */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[999999]"
      >
        <div className="h-2 w-2 rounded-full bg-[#B794F6]" />
      </div>
    </>
  );
}