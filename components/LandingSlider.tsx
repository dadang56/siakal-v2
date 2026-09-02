'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGoogleDriveDirectLink } from '@/lib/googleDrive';
import { DEFAULT_BACKGROUND_SLIDES } from '@/lib/defaultBranding';

export function LandingSlider() {
  const [images, setImages] = useState<string[]>(DEFAULT_BACKGROUND_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadCustomBgs = () => {
    try {
      const stored = localStorage.getItem('siakal_custom_backgrounds');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validList = parsed.filter((url) => typeof url === 'string' && url.trim().length > 0);
          if (validList.length > 0) {
            setImages(validList);
            return;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
    setImages(DEFAULT_BACKGROUND_SLIDES);
  };

  useEffect(() => {
    loadCustomBgs();

    const handleBrandingUpdate = () => {
      loadCustomBgs();
      setCurrentIndex(0);
    };

    window.addEventListener('siakal_branding_updated', handleBrandingUpdate);
    return () => window.removeEventListener('siakal_branding_updated', handleBrandingUpdate);
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images]);

  const rawBg = images[currentIndex] || DEFAULT_BACKGROUND_SLIDES[0];
  const activeBg = getGoogleDriveDirectLink(rawBg);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={activeBg}
            alt="Landing Page Background"
            className="w-full h-full object-cover font-sans brightness-105 contrast-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BACKGROUND_SLIDES[0];
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Light Glass Overlay for High Contrast Readable Text without Darkening Photos */}
      <div className="absolute inset-0 bg-white/20 bg-gradient-to-t from-slate-100/80 via-white/20 to-slate-900/10 pointer-events-none" />

      {/* Slider Indicators / Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-sky-600 shadow-md' : 'w-2.5 bg-slate-800/40 hover:bg-slate-800/80'
              }`}
              title={`Foto ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
