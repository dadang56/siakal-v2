'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// SVG 1: Kapal Tanker Minyak (Haluan Depan menghadap KANAN)
function TankerVesselSVG() {
  return (
    <svg className="w-36 h-20 sm:w-48 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Tanker Hull - Bow on RIGHT (x=150), Stern on LEFT (x=10) */}
      <path d="M5 52 L20 44 L145 44 L155 52 L140 68 L25 68 Z" className="text-slate-800 dark:text-slate-300" opacity="0.95" />
      {/* Red Waterline Bottom */}
      <path d="M10 62 L25 68 L140 68 L148 62 Z" fill="#ef4444" opacity="0.8" />
      
      {/* Stern Superstructure Bridge (Belakang Kapal di KIRI) */}
      <rect x="20" y="24" width="22" height="20" rx="1.5" className="text-slate-700 dark:text-slate-200" opacity="0.95" />
      <rect x="24" y="14" width="14" height="10" rx="1" className="text-slate-700 dark:text-slate-200" opacity="0.95" />
      {/* Windows & Navigation Bridge */}
      <rect x="26" y="17" width="10" height="3" fill="#38bdf8" />
      {/* Funnel & Smoke */}
      <rect x="28" y="6" width="5" height="8" fill="#dc2626" />
      <circle cx="30" cy="2" r="2.5" fill="#94a3b8" opacity="0.5" />
      <circle cx="26" cy="-3" r="3.5" fill="#94a3b8" opacity="0.3" />

      {/* Deck Piping & Pipe Manifolds along Deck to the Right */}
      <line x1="45" y1="44" x2="135" y2="44" stroke="#0284c7" strokeWidth="3" />
      <rect x="55" y="38" width="6" height="8" fill="#0284c7" />
      <rect x="75" y="38" width="6" height="8" fill="#0284c7" />
      <rect x="95" y="38" width="6" height="8" fill="#0284c7" />
      <rect x="115" y="38" width="6" height="8" fill="#0284c7" />

      {/* Bow Radar Mast at Front (RIGHT) */}
      <line x1="140" y1="44" x2="140" y2="28" stroke="currentColor" strokeWidth="2" />
      
      {/* Label Badge */}
      <text x="75" y="60" fontSize="7" fontWeight="bold" fill="#fff" letterSpacing="0.5">OIL TANKER</text>
    </svg>
  );
}

// SVG 2: Kapal Pesiar Mewah (Haluan Depan menghadap KANAN)
function CruiseShipSVG() {
  return (
    <svg className="w-40 h-22 sm:w-52 sm:h-28" viewBox="0 0 170 85" fill="currentColor">
      {/* Sleek Cruise Hull - Bow on RIGHT (x=165), Stern on LEFT (x=5) */}
      <path d="M5 50 L20 70 L130 70 C150 70, 145 50, 162 50 Z" className="text-sky-900 dark:text-slate-200" opacity="0.95" />
      <path d="M10 62 L20 70 L135 70 L155 62 Z" fill="#0284c7" opacity="0.8" />

      {/* Multi-Tiered Passenger Decks & Balconies */}
      <rect x="23" y="40" width="112" height="10" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
      <rect x="30" y="30" width="98" height="10" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
      <rect x="36" y="20" width="82" height="10" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />

      {/* Glowing Cabin Windows Row */}
      <g fill="#0284c7">
        <circle cx="35" cy="45" r="1.5" /><circle cx="45" cy="45" r="1.5" /><circle cx="55" cy="45" r="1.5" />
        <circle cx="65" cy="45" r="1.5" /><circle cx="75" cy="45" r="1.5" /><circle cx="85" cy="45" r="1.5" />
        <circle cx="95" cy="45" r="1.5" /><circle cx="105" cy="45" r="1.5" /><circle cx="115" cy="45" r="1.5" />
        
        <rect x="40" y="33" width="4" height="4" rx="0.5" />
        <rect x="52" y="33" width="4" height="4" rx="0.5" />
        <rect x="64" y="33" width="4" height="4" rx="0.5" />
        <rect x="76" y="33" width="4" height="4" rx="0.5" />
        <rect x="88" y="33" width="4" height="4" rx="0.5" />
        <rect x="100" y="33" width="4" height="4" rx="0.5" />

        <rect x="48" y="23" width="14" height="4" rx="1" fill="#38bdf8" />
        <rect x="70" y="23" width="14" height="4" rx="1" fill="#38bdf8" />
        <rect x="92" y="23" width="14" height="4" rx="1" fill="#38bdf8" />
      </g>
      {/* Dual Red Funnels (Cerobong Pesiar) */}
      <polygon points="65,20 68,10 76,10 73,20" fill="#dc2626" />
      <polygon points="85,20 88,10 96,10 93,20" fill="#dc2626" />

      {/* Label Badge */}
      <text x="75" y="63" fontSize="7" fontWeight="bold" fill="#fff" letterSpacing="0.5">CRUISE LINER</text>
    </svg>
  );
}

// SVG 3: Kapal Kontainer Kargo (Haluan Depan menghadap KANAN)
function ContainerShipSVG() {
  return (
    <svg className="w-38 h-20 sm:w-50 sm:h-26" viewBox="0 0 165 80" fill="currentColor">
      {/* Cargo Hull - Bow on RIGHT (x=155), Stern on LEFT (x=8) */}
      <path d="M7 50 L23 68 L140 68 L155 50 Z" className="text-slate-900 dark:text-slate-300" opacity="0.95" />

      {/* Aft Bridge Tower (Anjungan Belakang di KIRI) */}
      <rect x="25" y="22" width="22" height="28" rx="1.5" fill="#475569" />
      <rect x="27" y="26" width="18" height="4" fill="#38bdf8" />
      <rect x="33" y="12" width="6" height="10" fill="#dc2626" />

      {/* Stacked Colorful Containers towards the Front (RIGHT) */}
      <g stroke="#0f172a" strokeWidth="0.8">
        {/* Row 1 */}
        <rect x="55" y="38" width="18" height="12" fill="#0284c7" />
        <rect x="75" y="38" width="18" height="12" fill="#d97706" />
        <rect x="95" y="38" width="18" height="12" fill="#16a34a" />
        <rect x="115" y="38" width="18" height="12" fill="#dc2626" />

        {/* Row 2 Stack */}
        <rect x="59" y="26" width="18" height="12" fill="#ea580c" />
        <rect x="79" y="26" width="18" height="12" fill="#2563eb" />
        <rect x="99" y="26" width="18" height="12" fill="#9333ea" />
        <rect x="119" y="26" width="18" height="12" fill="#16a34a" />

        {/* Row 3 Top Stack */}
        <rect x="63" y="14" width="18" height="12" fill="#16a34a" />
        <rect x="83" y="14" width="18" height="12" fill="#dc2626" />
        <rect x="103" y="14" width="18" height="12" fill="#0284c7" />
      </g>

      {/* Label Badge */}
      <text x="80" y="61" fontSize="7" fontWeight="bold" fill="#fff" letterSpacing="0.5">CONTAINER SHIP</text>
    </svg>
  );
}

// SVG 4: Kapal Curah / Bulk Carrier (Haluan Depan menghadap KANAN)
function BulkCarrierSVG() {
  return (
    <svg className="w-36 h-20 sm:w-48 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Bulk Carrier Hull - Bow on RIGHT (x=150), Stern on LEFT (x=4) */}
      <path d="M4 48 L15 42 L145 42 L156 48 L136 66 L18 66 Z" className="text-slate-800 dark:text-slate-300" opacity="0.95" />

      {/* Accommodation House at Belakang (LEFT) */}
      <rect x="20" y="22" width="22" height="20" rx="1.5" fill="#475569" />
      <rect x="22" y="25" width="18" height="3" fill="#38bdf8" />

      {/* Hatch Covers (Penutup Palka ke arah KANAN) */}
      <rect x="48" y="40" width="16" height="4" fill="#d97706" rx="1" />
      <rect x="70" y="40" width="16" height="4" fill="#d97706" rx="1" />
      <rect x="92" y="40" width="16" height="4" fill="#d97706" rx="1" />
      <rect x="114" y="40" width="16" height="4" fill="#d97706" rx="1" />

      {/* 3 Tall Deck Cranes */}
      <g stroke="#0284c7" strokeWidth="2.5">
        <line x1="59" y1="40" x2="59" y2="22" />
        <line x1="59" y1="22" x2="72" y2="16" />
        
        <line x1="81" y1="40" x2="81" y2="22" />
        <line x1="81" y1="22" x2="94" y2="16" />

        <line x1="103" y1="40" x2="103" y2="22" />
        <line x1="103" y1="22" x2="116" y2="16" />
      </g>

      {/* Label Badge */}
      <text x="75" y="58" fontSize="7" fontWeight="bold" fill="#fff" letterSpacing="0.5">BULK CARRIER</text>
    </svg>
  );
}

const fleetComponents = [
  TankerVesselSVG,
  CruiseShipSVG,
  ContainerShipSVG,
  BulkCarrierSVG,
];

export function MaritimeBackgroundAnimation() {
  const [activeShipIndex, setActiveShipIndex] = useState(0);

  const CurrentShip = fleetComponents[activeShipIndex % fleetComponents.length];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-50 dark:opacity-40 transition-opacity duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HIGH-DETAIL ULTRA-SHARP NAUTICAL COMPASS ROSE (Bottom Right)          */}
      {/* ========================================================================= */}
      <div className="absolute -bottom-16 -right-16 text-sky-700/60 dark:text-sky-300/40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: 'linear' }}
        >
          <svg className="w-80 h-80 sm:w-[460px] sm:h-[460px]" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            {/* Outer Degree Azimuth Scale Ring */}
            <circle cx="100" cy="100" r="95" strokeWidth="1.8" />
            <circle cx="100" cy="100" r="88" strokeWidth="1" strokeDasharray="2 3" />
            <circle cx="100" cy="100" r="78" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="62" strokeWidth="1" />
            <circle cx="100" cy="100" r="18" strokeWidth="1.2" />
            <circle cx="100" cy="100" r="4" fill="currentColor" />

            {/* 360-Degree Azimuth Tick Marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 100 + 88 * Math.cos(rad);
              const y1 = 100 + 88 * Math.sin(rad);
              const x2 = 100 + 95 * Math.cos(rad);
              const y2 = 100 + 95 * Math.sin(rad);
              const textX = 100 + 83 * Math.cos(rad);
              const textY = 100 + 83 * Math.sin(rad) + 2;
              return (
                <g key={deg}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.5" />
                  <text
                    x={textX}
                    y={textY}
                    fontSize="5.5"
                    fontWeight="bold"
                    fontFamily="serif"
                    textAnchor="middle"
                    fill="currentColor"
                    opacity="0.9"
                  >
                    {deg}°
                  </text>
                </g>
              );
            })}

            {/* 16-Point 3D Shaded Nautical Compass Star */}
            <g opacity="0.85">
              <path d="M100 18 L107 86 L100 100 L93 86 Z" fill="currentColor" />
              <path d="M100 182 L107 114 L100 100 L93 114 Z" fill="currentColor" />
              <path d="M182 100 L114 107 L100 100 L114 93 Z" fill="currentColor" />
              <path d="M18 100 L86 107 L100 100 L86 93 Z" fill="currentColor" />
            </g>

            <g opacity="0.5">
              <path d="M158 42 L112 90 L100 100 L110 88 Z" fill="currentColor" />
              <path d="M158 158 L110 112 L100 100 L112 110 Z" fill="currentColor" />
              <path d="M42 158 L88 110 L100 100 L90 112 Z" fill="currentColor" />
              <path d="M42 42 L90 88 L100 100 L88 90 Z" fill="currentColor" />
            </g>

            {/* Serif Cardinal Direction Labels */}
            <text x="100" y="32" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="serif" fill="currentColor">N</text>
            <text x="100" y="176" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="serif" fill="currentColor">S</text>
            <text x="24" y="104" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="serif" fill="currentColor">W</text>
            <text x="176" y="104" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="serif" fill="currentColor">E</text>

            <text x="144" y="58" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="serif" fill="currentColor" opacity="0.75">NE</text>
            <text x="144" y="148" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="serif" fill="currentColor" opacity="0.75">SE</text>
            <text x="56" y="148" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="serif" fill="currentColor" opacity="0.75">SW</text>
            <text x="56" y="58" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="serif" fill="currentColor" opacity="0.75">NW</text>
          </svg>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SINGLE SHIP SAILING FORWARD (BOW FACING RIGHT, MOVING LEFT TO RIGHT)   */}
      {/* ========================================================================= */}
      <div className="fixed bottom-12 inset-x-0 h-28 pointer-events-none overflow-hidden z-0">
        <motion.div
          key={activeShipIndex}
          className="absolute bottom-2 flex flex-col items-center"
          initial={{ x: '-250px' }}
          animate={{ x: 'calc(100vw + 250px)' }}
          transition={{
            duration: 65, // Majestic calm forward sailing speed
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            // When current single ship exits completely past right edge, change to NEXT ship type!
            setActiveShipIndex((prev) => prev + 1);
          }}
        >
          {/* Gentle Ship Bobbing / Pitching Motion on Waves */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center"
          >
            {/* Render 1 Single Vessel (Tanker -> Cruise -> Container -> Bulk Carrier) */}
            <CurrentShip />

            {/* Water Ripple & Bow Wave under Ship */}
            <div className="w-36 h-1 bg-sky-400/40 rounded-full blur-[1px] -mt-1 shadow-sm" />
          </motion.div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. 3-LAYERED FLUID OCEAN WAVES AT BOTTOM                                  */}
      {/* ========================================================================= */}
      <div className="absolute bottom-0 inset-x-0 h-32 overflow-hidden">
        {/* Deep Back Wave */}
        <motion.svg
          className="w-[200%] h-full text-blue-600/15 dark:text-sky-500/10 absolute bottom-0"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 40 Q 150 80 300 40 T 600 40 T 900 40 T 1200 40 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>

        {/* Mid Wave */}
        <motion.svg
          className="w-[200%] h-full text-sky-600/20 dark:text-sky-400/15 absolute -bottom-2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [-600, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 50 Q 150 10 300 50 T 600 50 T 900 50 T 1200 50 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>

        {/* Foreground Crest Wave */}
        <motion.svg
          className="w-[200%] h-full text-sky-500/25 dark:text-sky-300/15 absolute -bottom-4"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          animate={{ x: [0, -600] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        >
          <path d="M0 60 Q 150 90 300 60 T 600 60 T 900 60 T 1200 60 L 1200 120 L 0 120 Z" fill="currentColor" />
        </motion.svg>
      </div>

    </div>
  );
}
