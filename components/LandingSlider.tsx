'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultImages = [
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80',
];

export function LandingSlider() {
  const [images, setImages] = useState<string[]>(defaultImages);
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
    setImages(defaultImages);
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
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  const activeBg = images[currentIndex] || defaultImages[0];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={activeBg}
            alt="Landing Page Background"
            className="w-full h-full object-cover font-sans"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dimmed Dark Overlay (NO BLUR - Crystal Clear & Sharp Background Image) */}
      <div className="absolute inset-0 bg-slate-950/50 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/35 pointer-events-none" />

      {/* Slider Indicators / Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-sky-400' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              title={`Foto ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
