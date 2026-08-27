'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MaritimeBackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-50 dark:opacity-35 transition-opacity duration-300">
      {/* 1. ANIMASI NAVIGASI - Compass Rose & Waypoint Coordinates (Top Right) */}
      <div className="absolute -top-12 -right-12 text-sky-600/30 dark:text-sky-400/20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="w-80 h-80 sm:w-96 sm:h-96" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="46" strokeDasharray="2 2" />
            <circle cx="50" cy="50" r="38" />
            <circle cx="50" cy="50" r="28" />
            <circle cx="50" cy="50" r="4" fill="currentColor" />

            {/* Compass Star Points */}
            <path d="M50 8 L54 44 L50 50 L46 44 Z" fill="currentColor" opacity="0.7" />
            <path d="M50 92 L54 56 L50 50 L46 56 Z" fill="currentColor" opacity="0.7" />
            <path d="M8 50 L44 46 L50 50 L44 54 Z" fill="currentColor" opacity="0.7" />
            <path d="M92 50 L56 46 L50 50 L56 54 Z" fill="currentColor" opacity="0.7" />

            {/* Cardinal Navigation Labels */}
            <text x="50" y="15" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">N</text>
            <text x="50" y="89" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">S</text>
            <text x="13" y="52" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">W</text>
            <text x="87" y="52" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor">E</text>
          </svg>
        </motion.div>
      </div>

      {/* 2. ANIMASI KAPAL - Sailing Ship Traveling Across Ocean Waves (Left to Right) */}
      <div className="absolute bottom-16 inset-x-0 h-24 overflow-hidden">
        <motion.div
          className="absolute bottom-2 text-sky-700 dark:text-sky-400 flex flex-col items-center"
          initial={{ x: '-15%' }}
          animate={{ x: '115%' }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Gentle Ship Bobbing / Pitching Motion on Waves */}
          <motion.div
            animate={{
              y: [-3, 3, -3],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center"
          >
            {/* Kapal Pelayaran / Vessel Graphic */}
            <svg className="w-24 h-16 sm:w-32 sm:h-20" viewBox="0 0 120 70" fill="currentColor">
              {/* Ship Hull */}
              <path d="M10 45 L25 60 L95 60 L115 45 Z" opacity="0.9" />
              {/* Ship Superstructure / Deck / Bridge */}
              <rect x="35" y="25" width="40" height="20" rx="2" opacity="0.8" />
              <rect x="45" y="15" width="20" height="10" rx="1" opacity="0.8" />
              {/* Funnel / Cerobong Kapal */}
              <rect x="52" y="5" width="6" height="10" opacity="0.9" />
              {/* Smoke / Asap Cerobong */}
              <circle cx="48" cy="2" r="2.5" opacity="0.4" />
              <circle cx="42" cy="-2" r="3.5" opacity="0.3" />
              {/* Windows */}
              <rect x="40" y="30" width="6" height="4" rx="1" fill="#fff" opacity="0.6" />
              <rect x="52" y="30" width="6" height="4" rx="1" fill="#fff" opacity="0.6" />
              <rect x="64" y="30" width="6" height="4" rx="1" fill="#fff" opacity="0.6" />
            </svg>
            {/* Water Ripple under Ship */}
            <div className="w-28 h-1 bg-sky-400/30 rounded-full blur-[1px] -mt-1" />
          </motion.div>
        </motion.div>
      </div>

      {/* 3. ANIMASI OMBAK - 3-Layered Fluid Ocean Wave Ripples at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-32 overflow-hidden">
        {/* Deep Back Wave */}
        <motion.svg
          className="w-[200%] h-full text-blue-600/15 dark:text-sky-500/10 absolute bottom-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 40 Q 150 80 300 40 T 600 40 T 900 40 T 1200 40 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>

        {/* Mid Wave */}
        <motion.svg
          className="w-[200%] h-full text-sky-600/20 dark:text-sky-400/15 absolute -bottom-2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [-600, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 50 Q 150 10 300 50 T 600 50 T 900 50 T 1200 50 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>

        {/* Foreground Crest Wave */}
        <motion.svg
          className="w-[200%] h-full text-sky-500/25 dark:text-sky-300/15 absolute -bottom-4"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 60 Q 150 90 300 60 T 600 60 T 900 60 T 1200 60 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>
      </div>
    </div>
  );
}
