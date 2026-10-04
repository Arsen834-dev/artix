'use client';

import { useEffect, useRef, useState } from 'react';

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Звёзды на canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let stars: Array<{ x: number; y: number; z: number; size: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 0.5 + 0.5,
        size: Math.random() * 1.5 + 0.3,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2);
        const opacity = star.z * 0.7;
        ctx.fillStyle = `rgba(200, 200, 255, ${opacity})`;
        ctx.fill();

        star.y += 0.08 * star.z;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Слежение за мышью для свечения
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Звёзды */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        style={{ opacity: 0.5 }}
      />

      {/* Туманности (статичные градиенты) */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Фиолетовая туманность — левый верх */}
        <div
          className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-40 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(108, 99, 255, 0.5) 0%, transparent 70%)',
            animation: 'float1 20s ease-in-out infinite',
          }}
        />
        {/* Бирюзовая туманность — правый низ */}
        <div
          className="absolute -right-40 -bottom-40 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(79, 209, 197, 0.5) 0%, transparent 70%)',
            animation: 'float2 25s ease-in-out infinite',
          }}
        />
        {/* Розовая туманность — центр */}
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, rgba(183, 148, 246, 0.6) 0%, transparent 70%)',
            animation: 'float3 30s ease-in-out infinite',
          }}
        />
      </div>

      {/* Свечение вокруг курсора — усиленное */}
      <div
        className="pointer-events-none fixed z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px] transition-all duration-500 ease-out"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          background:
            'radial-gradient(circle, rgba(108, 99, 255, 0.8) 0%, rgba(183, 148, 246, 0.4) 30%, transparent 70%)',
        }}
      />      
    </>
  );
}