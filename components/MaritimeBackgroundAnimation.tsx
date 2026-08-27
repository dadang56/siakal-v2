'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG 1: Kapal Tanker Minyak / Kimia (Oil & Chemical Tanker)
function TankerVesselSVG() {
  return (
    <svg className="w-36 h-20 sm:w-44 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Tanker Hull */}
      <path d="M10 52 L25 68 L140 68 L155 52 L145 44 L15 44 Z" opacity="0.95" />
      {/* Waterline Stripe */}
      <path d="M15 62 L25 68 L140 68 L150 62 Z" fill="#38bdf8" opacity="0.6" />
      {/* Deck Piping & Pipe Manifolds */}
      <line x1="30" y1="44" x2="110" y2="44" stroke="currentColor" strokeWidth="2.5" />
      <rect x="40" y="40" width="4" height="6" opacity="0.8" />
      <rect x="60" y="40" width="4" height="6" opacity="0.8" />
      <rect x="80" y="40" width="4" height="6" opacity="0.8" />
      <rect x="100" y="40" width="4" height="6" opacity="0.8" />
      {/* Stern Superstructure Bridge (Belakang Kapal) */}
      <rect x="115" y="24" width="22" height="20" rx="1.5" opacity="0.9" />
      <rect x="120" y="14" width="14" height="10" rx="1" opacity="0.9" />
      {/* Windows & Navigation Bridge */}
      <rect x="122" y="17" width="10" height="3" fill="#fff" opacity="0.7" />
      {/* Funnel & Smoke */}
      <rect x="125" y="6" width="5" height="8" opacity="0.9" />
      <circle cx="127" cy="2" r="2.5" opacity="0.4" />
      <circle cx="123" cy="-3" r="3.5" opacity="0.2" />
      {/* Bow Radar Mast */}
      <line x1="25" y1="44" x2="25" y2="28" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

// SVG 2: Kapal Pesiar Mewah (Luxury Cruise Liner)
function CruiseShipSVG() {
  return (
    <svg className="w-36 h-20 sm:w-44 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Sleek Cruise Hull */}
      <path d="M8 48 C25 48, 20 68, 40 68 L142 68 L155 48 Z" opacity="0.95" />
      {/* Multi-Tiered Passenger Decks & Balconies */}
      <rect x="35" y="38" width="105" height="10" rx="1" opacity="0.85" />
      <rect x="42" y="28" width="92" height="10" rx="1" opacity="0.85" />
      <rect x="52" y="18" width="75" height="10" rx="1" opacity="0.85" />
      {/* Tiered Windows Row */}
      <g fill="#fff" opacity="0.7">
        <circle cx="45" cy="43" r="1.5" /><circle cx="55" cy="43" r="1.5" /><circle cx="65" cy="43" r="1.5" />
        <circle cx="75" cy="43" r="1.5" /><circle cx="85" cy="43" r="1.5" /><circle cx="95" cy="43" r="1.5" />
        <circle cx="105" cy="43" r="1.5" /><circle cx="115" cy="43" r="1.5" /><circle cx="125" cy="43" r="1.5" />
        
        <rect x="50" y="31" width="4" height="4" rx="0.5" />
        <rect x="62" y="31" width="4" height="4" rx="0.5" />
        <rect x="74" y="31" width="4" height="4" rx="0.5" />
        <rect x="86" y="31" width="4" height="4" rx="0.5" />
        <rect x="98" y="31" width="4" height="4" rx="0.5" />
        <rect x="110" y="31" width="4" height="4" rx="0.5" />

        <rect x="60" y="21" width="15" height="4" rx="1" />
        <rect x="82" y="21" width="15" height="4" rx="1" />
        <rect x="104" y="21" width="15" height="4" rx="1" />
      </g>
      {/* Dual Modern Funnels (Cerobong Ganda Pesiar) */}
      <polygon points="75,18 78,8 86,8 83,18" opacity="0.9" />
      <polygon points="95,18 98,8 106,8 103,18" opacity="0.9" />
    </svg>
  );
}

// SVG 3: Kapal Kargo Kontainer (Container Cargo Vessel)
function ContainerShipSVG() {
  return (
    <svg className="w-36 h-20 sm:w-44 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Cargo Hull */}
      <path d="M12 50 L26 66 L140 66 L154 50 Z" opacity="0.95" />
      {/* Stacked Colored Containers */}
      <g stroke="#0f172a" strokeWidth="0.8">
        <rect x="30" y="38" width="18" height="12" fill="#0284c7" opacity="0.9" />
        <rect x="50" y="38" width="18" height="12" fill="#d97706" opacity="0.9" />
        <rect x="70" y="38" width="18" height="12" fill="#16a34a" opacity="0.9" />
        <rect x="90" y="38" width="18" height="12" fill="#dc2626" opacity="0.9" />

        {/* Tier 2 Stack */}
        <rect x="34" y="26" width="18" height="12" fill="#d97706" opacity="0.9" />
        <rect x="54" y="26" width="18" height="12" fill="#0284c7" opacity="0.9" />
        <rect x="74" y="26" width="18" height="12" fill="#9333ea" opacity="0.9" />

        {/* Tier 3 Stack */}
        <rect x="38" y="14" width="18" height="12" fill="#16a34a" opacity="0.9" />
        <rect x="58" y="14" width="18" height="12" fill="#dc2626" opacity="0.9" />
      </g>
      {/* Aft Bridge Tower */}
      <rect x="114" y="22" width="20" height="28" rx="1" opacity="0.9" />
      <rect x="116" y="26" width="16" height="4" fill="#fff" opacity="0.7" />
      <rect x="122" y="12" width="5" height="10" opacity="0.9" />
    </svg>
  );
}

// SVG 4: Kapal Curah / Bulk Carrier (Bulk Carrier Cargo Vessel)
function BulkCarrierSVG() {
  return (
    <svg className="w-36 h-20 sm:w-44 sm:h-24" viewBox="0 0 160 80" fill="currentColor">
      {/* Bulk Carrier Hull */}
      <path d="M10 48 L24 66 L142 66 L156 48 L145 42 L15 42 Z" opacity="0.95" />
      {/* Hatch Covers (Penutup Palka Curah) */}
      <rect x="30" y="40" width="16" height="4" rx="1" opacity="0.7" />
      <rect x="52" y="40" width="16" height="4" rx="1" opacity="0.7" />
      <rect x="74" y="40" width="16" height="4" rx="1" opacity="0.7" />
      <rect x="96" y="40" width="16" height="4" rx="1" opacity="0.7" />
      {/* Deck Cranes (Derrick Cranes Pemuat Curah) */}
      <line x1="41" y1="40" x2="41" y2="24" stroke="currentColor" strokeWidth="2" />
      <line x1="41" y1="24" x2="52" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <line x1="85" y1="40" x2="85" y2="24" stroke="currentColor" strokeWidth="2" />
      <line x1="85" y1="24" x2="96" y2="18" stroke="currentColor" strokeWidth="1.5" />
      {/* Accommodation House */}
      <rect x="118" y="22" width="20" height="20" rx="1" opacity="0.9" />
      <rect x="120" y="25" width="16" height="3" fill="#fff" opacity="0.7" />
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
  const [shipIndex, setShipIndex] = useState(0);

  const CurrentShip = fleetComponents[shipIndex % fleetComponents.length];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-50 dark:opacity-40 transition-opacity duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HIGH-DETAIL ULTRA-SHARP NAUTICAL COMPASS ROSE (Bottom Right)          */}
      {/* ========================================================================= */}
      <div className="absolute -bottom-16 -right-16 text-sky-700/50 dark:text-sky-300/35">
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
            {/* Primary Cardinal Points (N S E W) */}
            <g opacity="0.85">
              <path d="M100 18 L107 86 L100 100 L93 86 Z" fill="currentColor" />
              <path d="M100 182 L107 114 L100 100 L93 114 Z" fill="currentColor" />
              <path d="M182 100 L114 107 L100 100 L114 93 Z" fill="currentColor" />
              <path d="M18 100 L86 107 L100 100 L86 93 Z" fill="currentColor" />
            </g>

            {/* Intercardinal Points (NE SE SW NW) */}
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
      {/* 2. MAJESTIC SLOW SAILING FLEET (85 Seconds Full Screen Width Voyage)     */}
      {/* ========================================================================= */}
      <div className="fixed bottom-12 inset-x-0 h-28 pointer-events-none overflow-hidden z-0">
        <motion.div
          key={shipIndex}
          className="absolute bottom-2 text-sky-700 dark:text-sky-300 flex flex-col items-center"
          initial={{ x: '-220px' }}
          animate={{ x: 'calc(100vw + 220px)' }}
          transition={{
            duration: 85, // Slower, calm, majestic gliding speed across the screen
            repeat: Infinity,
            ease: 'linear',
          }}
          onAnimationComplete={() => {
            // Cycle to the next vessel type (Tanker -> Cruise -> Container -> Bulk Carrier)
            setShipIndex((prev) => prev + 1);
          }}
        >
          {/* Gentle Ship Bobbing / Pitching Motion on Waves */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center"
          >
            {/* Dynamic Fleet Vessel Rendering */}
            <CurrentShip />

            {/* Water Ripple & Bow Wave under Ship */}
            <div className="w-36 h-1 bg-sky-400/45 rounded-full blur-[1px] -mt-1 shadow-sm" />
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
