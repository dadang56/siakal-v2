'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, LogOut, User } from 'lucide-react';

interface NavbarProps {
  currentUser?: {
    name?: string;
    role?: string;
    email?: string;
  };
  onLogout?: () => void;
}

export function Navbar({ currentUser, onLogout }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const [customLogo, setCustomLogo] = useState<string>('');

  const loadCustomLogo = () => {
    try {
      const stored = localStorage.getItem('siakal_custom_logo');
      if (stored) setCustomLogo(stored);
      else setCustomLogo('');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCustomLogo();
    const handleBrandingUpdate = () => loadCustomLogo();
    window.addEventListener('siakal_branding_updated', handleBrandingUpdate);
    return () => window.removeEventListener('siakal_branding_updated', handleBrandingUpdate);
  }, []);

  const isDark = theme === 'dark';
  const userName = currentUser?.name || 'Pengguna';
  const userRole = currentUser?.role || 'User';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          {customLogo ? (
            <img src={customLogo} alt="Logo Kampus Resmi" className="h-10 w-auto max-w-[140px] object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow">
              <div className="w-full h-full bg-slate-900 dark:bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-sky-400 text-lg">
                S
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wider text-slate-900 dark:text-slate-100 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
              SIAKAL <span className="text-sky-600 dark:text-sky-400 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30">V2</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Ketarunaan & Alumni SDP Palembang</span>
          </div>
        </Link>

        {/* Right Section: Theme Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher Toggle (Sun / Moon) */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all active:scale-95 shadow-sm cursor-pointer"
            title="Ganti Mode Terang / Gelap"
          >
            {isDark ? (
              <Sun className="w-4.5 h-4.5 text-amber-400" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-slate-700" />
            )}
          </button>

          {/* User Info / Profile */}
          {currentUser && currentUser.name ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{userName}</span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 capitalize font-medium">{userRole.replace('_', ' ')}</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <Link href="/login" className="glass-button text-xs flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <span>Portal Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
