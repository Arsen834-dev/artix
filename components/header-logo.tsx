'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function HeaderLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <motion.div
        className="relative flex h-10 w-10 items-center justify-center"
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        {/* Пульсирующее свечение */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#6C63FF]/40 blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <Image
          src="/logo.png"
          alt="Artix"
          width={40}
          height={40}
          className="relative object-contain drop-shadow-[0_0_12px_rgba(108,99,255,0.6)] transition-all duration-500 group-hover:drop-shadow-[0_0_24px_rgba(108,99,255,1)]"
          priority
        />
      </motion.div>
      <span className="text-xl font-bold tracking-tight">
        <span className="gradient-text">Artix</span>
      </span>
    </Link>
  );
}