// components/loader.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MatterType = typeof import('matter-js');

const COLORS = [
  '#6C63FF',
  '#B794F6',
  '#4FD1C5',
  '#F6AD55',
  '#C9A6FF',
  '#F687B3',
  '#68D391',
  '#FBD38D',
];

export function Loader({ onComplete }: { onComplete: () => void }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [Matter, setMatter] = useState<MatterType | null>(null);
  const completedRef = useRef(false);

  // 🎯 Прогресс 0 → 100
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 6 + 1.5, 100);
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // 🎯 Когда progress достиг 100 — запускаем завершение (один раз)
  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;

    // 🎯 FIX: сначала сообщаем HomeContent, что мы готовы,
    // чтобы hero смонтировался ПОД лоадером (без мигания пустоты).
    const t1 = setTimeout(() => {
      onComplete();
      // Небольшая задержка — даём hero отрендериться под лоадером
      const t2 = setTimeout(() => {
        setIsDone(true);
      }, 150);
      return () => clearTimeout(t2);
    }, 400);

    return () => clearTimeout(t1);
  }, [progress, onComplete]);

  // 🎯 Динамическая загрузка Matter.js
  useEffect(() => {
    let mounted = true;
    import('matter-js').then((mod) => {
      if (mounted) setMatter(mod);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // 🎯 Физика
  useEffect(() => {
    if (!Matter || !sceneRef.current || isDone) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    const engine = Matter.Engine.create();
    engine.gravity.y = 5;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      },
    });

    const walls = [
      Matter.Bodies.rectangle(width / 2, height + 100, width, 200, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(-100, height / 2, 200, height, {
        isStatic: true,
        render: { visible: false },
      }),
      Matter.Bodies.rectangle(width + 100, height / 2, 200, height, {
        isStatic: true,
        render: { visible: false },
      }),
    ];
    Matter.Composite.add(engine.world, walls);

    const createBody = (x: number, y: number) => {
      const size = 100 + Math.random() * 400;
      const isCircle = Math.random() > 0.5;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const shapeIndex = Math.floor(Math.random() * 8);

      const options: any = {
        restitution: 0.2,
        friction: 0.5,
        density: 0.002,
        render: {
          fillStyle: color,
          strokeStyle: 'transparent',
          lineWidth: 0,
        },
      };

      const body = isCircle
        ? Matter.Bodies.circle(x, y, size / 2, options)
        : Matter.Bodies.rectangle(x, y, size, size, {
            ...options,
            chamfer: { radius: 20 },
          });

      (body as any).customData = { size, color, shapeIndex };
      return body;
    };

    const spawnInterval = setInterval(() => {
      const x = Math.random() * (width - 800) + 400;
      const y = -600;
      const body = createBody(x, y);
      Matter.Composite.add(engine.world, body);
    }, 150);

    const afterRenderHandler = () => {
      const ctx = render.context;
      const bodies = Matter.Composite.allBodies(engine.world) as any[];

      bodies.forEach((body) => {
        const data = body.customData;
        if (!data) return;

        ctx.save();
        ctx.translate(body.position.x, body.position.y);
        ctx.rotate(body.angle);

        const { size, color, shapeIndex } = data;
        ctx.fillStyle = color;
        const half = size / 2;

        switch (shapeIndex) {
          case 0: // Планета с кольцом
            ctx.beginPath();
            ctx.arc(0, 0, half, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.ellipse(0, 0, half * 1.15, half * 0.3, -0.3, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.15)';
            ctx.beginPath();
            ctx.arc(half * 0.3, -half * 0.2, half * 0.25, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-half * 0.3, half * 0.3, half * 0.15, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 1: // Ракета
            ctx.beginPath();
            ctx.moveTo(0, -half);
            ctx.lineTo(half * 0.5, -half * 0.3);
            ctx.lineTo(half * 0.5, half * 0.5);
            ctx.lineTo(0, half);
            ctx.lineTo(-half * 0.5, half * 0.5);
            ctx.lineTo(-half * 0.5, -half * 0.3);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.arc(0, -half * 0.3, half * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#F6AD55';
            ctx.beginPath();
            ctx.moveTo(-half * 0.3, half);
            ctx.lineTo(0, half * 1.4);
            ctx.lineTo(half * 0.3, half);
            ctx.closePath();
            ctx.fill();
            break;
          case 2: // Звезда
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
              const radius = i % 2 === 0 ? half : half * 0.4;
              const angle = (i * Math.PI) / 5 - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, half * 0.2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 3: // Луна
            ctx.beginPath();
            ctx.arc(0, 0, half, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.beginPath();
            ctx.arc(-half * 0.3, -half * 0.2, half * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(half * 0.2, half * 0.3, half * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-half * 0.1, half * 0.4, half * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 4: // Комета
            ctx.beginPath();
            ctx.arc(half * 0.3, -half * 0.3, half * 0.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(half * 0.3, -half * 0.3);
            ctx.lineTo(-half, half * 0.7);
            ctx.lineTo(-half * 0.8, half);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            break;
          case 5: // Сатурн
            ctx.beginPath();
            ctx.arc(0, 0, half * 0.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.7;
            ctx.beginPath();
            ctx.ellipse(0, 0, half * 1.15, half * 0.25, -0.2, 0, Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 6;
            ctx.stroke();
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.ellipse(0, 0, half * 1.3, half * 0.3, -0.2, 0, Math.PI * 2);
            ctx.lineWidth = 3;
            ctx.stroke();
            break;
          case 6: // Астероид
            ctx.beginPath();
            const points = 12;
            for (let i = 0; i < points; i++) {
              const radius = half * (0.7 + ((i * 7) % 10) / 25);
              const angle = (i * Math.PI * 2) / points;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.arc(-half * 0.2, -half * 0.1, half * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(half * 0.25, half * 0.2, half * 0.1, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 7: // НЛО
            ctx.beginPath();
            ctx.ellipse(0, half * 0.1, half, half * 0.35, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.9;
            ctx.beginPath();
            ctx.moveTo(-half * 0.6, 0);
            ctx.quadraticCurveTo(0, -half * 0.8, half * 0.6, 0);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#FBD38D';
            ctx.beginPath();
            ctx.arc(-half * 0.4, half * 0.1, half * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, half * 0.15, half * 0.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(half * 0.4, half * 0.1, half * 0.08, 0, Math.PI * 2);
            ctx.fill();
            break;
        }

        ctx.restore();
      });
    };

    Matter.Events.on(render, 'afterRender', afterRenderHandler);

    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    return () => {
      clearInterval(spawnInterval);
      Matter.Events.off(render, 'afterRender', afterRenderHandler);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, [Matter, isDone]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#0a0a0f]"
        >
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-64 w-64 rounded-full bg-[#6C63FF]/30 blur-[100px] md:h-96 md:w-96" />
              </div>

              <div className="relative flex items-baseline">
                <span
                  className="display-title font-bold leading-none"
                  style={{
                    fontSize: 'clamp(8rem, 25vw, 20rem)',
                    background:
                      'linear-gradient(135deg, #6C63FF 0%, #B794F6 50%, #4FD1C5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 0 40px rgba(108, 99, 255, 0.6))',
                  }}
                >
                  {Math.floor(progress)}
                </span>
                <span
                  className="display-title font-bold leading-none text-white/30"
                  style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
                >
                  %
                </span>
              </div>
            </motion.div>
          </div>

          <div ref={sceneRef} className="absolute inset-0 z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}