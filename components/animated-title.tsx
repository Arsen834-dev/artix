'use client';

import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export function AnimatedTitle({ text, className = '', delay = 0 }: AnimatedTitleProps) {
  const letters = text.split('');

  return (
    <span className={className}>
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          initial={{ opacity: 0, y: 80, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.05,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="inline-block"
          style={{ transformOrigin: 'bottom' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </span>
  );
}