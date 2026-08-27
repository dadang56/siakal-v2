'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MaritimeBackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-50 dark:opacity-30 transition-opacity duration-300">
      {/* 1. Kemudi Kapal (Ship's Wheel) - Rotating slowly top right */}
      <motion.div
        className="absolute -top-12 -right-12 text-sky-700/35 dark:text-sky-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-80 h-80 sm:w-96 sm:h-96" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="22" />
          <circle cx="50" cy="50" r="6" />
          {/* 8 Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 6 * Math.cos(rad);
            const y1 = 50 + 6 * Math.sin(rad);
            const x2 = 50 + 42 * Math.cos(rad);
            const y2 = 50 + 42 * Math.sin(rad);
            const handleX = 50 + 46 * Math.cos(rad);
            const handleY = 50 + 46 * Math.sin(rad);
            return (
              <g key={angle}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.8" />
                <circle cx={handleX} cy={handleY} r="2.5" fill="currentColor" />
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* 2. Kompas Maritim (Compass Rose) - Rotating counter-clockwise bottom left */}
      <motion.div
        className="absolute bottom-10 -left-16 text-blue-700/30 dark:text-sky-300/15"
        animate={{ rotate: -360 }}
        transition={{ duration: 75, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-96 h-96 sm:w-[450px] sm:h-[450px]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="50" cy="50" r="45" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="38" />
          <circle cx="50" cy="50" r="28" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
          {/* Compass Star Points */}
          <path d="M50 5 L54 44 L50 50 L46 44 Z" fill="currentColor" opacity="0.6" />
          <path d="M50 95 L54 56 L50 50 L46 56 Z" fill="currentColor" opacity="0.6" />
          <path d="M5 50 L44 46 L50 50 L44 54 Z" fill="currentColor" opacity="0.6" />
          <path d="M95 50 L56 46 L50 50 L56 54 Z" fill="currentColor" opacity="0.6" />
          {/* Cardinal Labels */}
          <text x="50" y="14" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">N</text>
          <text x="50" y="90" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">S</text>
          <text x="12" y="52" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">W</text>
          <text x="88" y="52" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">E</text>
        </svg>
      </motion.div>

      {/* 3. Propeller Kapal (Ship's Propeller) - Spinning steadily mid right */}
      <motion.div
        className="absolute top-1/2 right-12 text-sky-600/25 dark:text-sky-400/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-56 h-56 sm:w-72 sm:h-72" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="8" />
          {/* 4 Propeller Blades */}
          <path d="M50 42 C40 25, 45 10, 50 8 C55 10, 60 25, 50 42 Z" opacity="0.75" />
          <path d="M50 58 C65 68, 80 63, 82 58 C80 53, 65 48, 50 58 Z" opacity="0.75" />
          <path d="M50 58 C40 75, 45 90, 50 92 C55 90, 60 75, 50 58 Z" opacity="0.75" />
          <path d="M50 42 C35 32, 20 37, 18 42 C20 47, 35 52, 50 42 Z" opacity="0.75" />
        </svg>
      </motion.div>

      {/* 4. Jangkar Floating (Anchor) - Gently bobbing top center */}
      <motion.div
        className="absolute top-16 left-1/3 text-sky-700/25 dark:text-sky-400/15"
        animate={{ y: [-10, 10, -10], rotate: [-4, 4, -4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="50" cy="18" r="8" />
          <line x1="50" y1="26" x2="50" y2="82" strokeWidth="3" />
          <line x1="30" y1="38" x2="70" y2="38" strokeWidth="3" />
          <path d="M20 60 C20 85, 80 85, 80 60" strokeWidth="3" />
          <path d="M15 58 L20 62 L25 58" strokeWidth="2.5" fill="currentColor" />
          <path d="M75 58 L80 62 L85 58" strokeWidth="2.5" fill="currentColor" />
        </svg>
      </motion.div>

      {/* 5. Subtle Gelombang Laut (Maritime Waves) at the bottom */}
      <div className="absolute bottom-0 inset-x-0 h-32 text-sky-600/15 dark:text-sky-400/10 overflow-hidden">
        <motion.svg
          className="w-[200%] h-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <path
            d="M0 40 Q 150 80 300 40 T 600 40 T 900 40 T 1200 40 L 1200 120 L 0 120 Z"
            fill="currentColor"
          />
        </motion.svg>
      </div>
    </div>
  );
}
