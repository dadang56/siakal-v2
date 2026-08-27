'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function MaritimeBackgroundAnimation() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-60 dark:opacity-40 transition-opacity duration-300">
      {/* 1. High-Tech Maritime Radar Sweep (Top Right) */}
      <div className="absolute -top-16 -right-16 w-[420px] h-[420px] sm:w-[520px] sm:h-[520px]">
        {/* Concentric Radar Rings */}
        <svg className="w-full h-full text-sky-600/30 dark:text-sky-400/20" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="100" cy="100" r="90" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="70" />
          <circle cx="100" cy="100" r="50" strokeDasharray="2 2" />
          <circle cx="100" cy="100" r="30" />
          <circle cx="100" cy="100" r="10" />
          <line x1="10" y1="100" x2="190" y2="100" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="100" y1="10" x2="100" y2="190" strokeWidth="0.5" strokeDasharray="2 2" />
          {/* Coordinates label */}
          <text x="105" y="22" fontSize="5" fontWeight="bold" fill="currentColor" opacity="0.7">PALEMBANG 02°59'S 104°47'E</text>
        </svg>

        {/* Continuous 360-degree Radar Beam Sweep Line */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-500/40 to-sky-400 opacity-80 origin-left transform translate-x-1/2 shadow-glow" />
        </motion.div>
      </div>

      {/* 2. Detailed Ship's Wheel / Compass Rose (Bottom Left) */}
      <motion.div
        className="absolute bottom-6 -left-20 text-blue-600/35 dark:text-sky-300/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-96 h-96 sm:w-[480px] sm:h-[480px]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
          {/* Outer Wheel Ring */}
          <circle cx="50" cy="50" r="46" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="40" strokeDasharray="1 2" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="10" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />

          {/* 8 Ship Wheel Handles & Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 10 * Math.cos(rad);
            const y1 = 50 + 10 * Math.sin(rad);
            const x2 = 50 + 46 * Math.cos(rad);
            const y2 = 50 + 46 * Math.sin(rad);
            const handleX = 50 + 49 * Math.cos(rad);
            const handleY = 50 + 49 * Math.sin(rad);
            return (
              <g key={angle}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />
                <circle cx={handleX} cy={handleY} r="2" fill="currentColor" />
              </g>
            );
          })}

          {/* Compass Points */}
          <path d="M50 8 L53 38 L50 42 L47 38 Z" fill="currentColor" opacity="0.6" />
          <path d="M50 92 L53 62 L50 58 L47 62 Z" fill="currentColor" opacity="0.6" />
          <path d="M8 50 L38 47 L42 50 L38 53 Z" fill="currentColor" opacity="0.6" />
          <path d="M92 50 L62 47 L58 50 L62 53 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </motion.div>

      {/* 3. Floating Propeller / Turbine Icon (Middle Right) */}
      <motion.div
        className="absolute top-1/2 right-16 text-sky-500/30 dark:text-sky-400/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <svg className="w-56 h-56 sm:w-64 sm:h-64" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
          {/* 4 Curved Aerodynamic Propeller Blades */}
          <path d="M50 41 C40 20, 48 5, 52 5 C56 5, 60 20, 50 41 Z" opacity="0.75" />
          <path d="M59 50 C80 40, 95 48, 95 52 C95 56, 80 60, 59 50 Z" opacity="0.75" />
          <path d="M50 59 C60 80, 52 95, 48 95 C44 95, 40 80, 50 59 Z" opacity="0.75" />
          <path d="M41 50 C20 60, 5 52, 5 48 C5 44, 20 40, 41 50 Z" opacity="0.75" />
        </svg>
      </motion.div>

      {/* 4. Floating Luminescent Particles (Rising Spars & Bubbles) */}
      <div className="absolute inset-0">
        {[
          { left: '15%', top: '30%', size: 8, delay: 0 },
          { left: '35%', top: '70%', size: 12, delay: 2 },
          { left: '60%', top: '25%', size: 10, delay: 1 },
          { left: '75%', top: '65%', size: 14, delay: 3 },
          { left: '88%', top: '40%', size: 6, delay: 1.5 },
        ].map((pt, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full bg-sky-400/40 dark:bg-sky-300/30 blur-[1px]"
            style={{ left: pt.left, top: pt.top, width: pt.size, height: pt.size }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.9, 1.2, 0.9],
            }}
            transition={{
              duration: 6 + idx * 2,
              repeat: Infinity,
              delay: pt.delay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 5. Dual Layer Fluid Ocean Wave Motion at Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-36 overflow-hidden">
        <motion.svg
          className="w-[200%] h-full text-sky-600/15 dark:text-sky-400/10 absolute bottom-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 30 Q 150 70 300 30 T 600 30 T 900 30 T 1200 30 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>

        <motion.svg
          className="w-[200%] h-full text-blue-600/20 dark:text-sky-300/15 absolute -bottom-2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [-600, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 50 Q 150 10 300 50 T 600 50 T 900 50 T 1200 50 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>
      </div>
    </div>
  );
}
