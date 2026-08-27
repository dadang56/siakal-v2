'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, LogOut } from 'lucide-react';

interface NavbarProps {
  currentUser?: {
    name?: string;
    role?: string;
    email?: string;
  };
  onLogout?: () => void;
  hideThemeToggle?: boolean;
}

export function Navbar({ currentUser, onLogout, hideThemeToggle = false }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [customLogo, setCustomLogo] = useState<string>('');

  const isLandingPage = pathname === '/';

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
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-colors duration-200 ${
        isLandingPage
          ? 'bg-slate-950/40 border-none shadow-none'
          : 'bg-white/95 dark:bg-slate-950/90 border-b border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          {customLogo ? (
            <img src={customLogo} alt="Logo Kampus Resmi" className="h-10 w-auto max-w-[160px] object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-lg shadow-inner">
                S
              </div>
            </div>
          )}
          <div className="flex flex-col">
            <span
              className={`font-black text-lg sm:text-xl tracking-wider transition-colors ${
                isLandingPage ? 'text-white drop-shadow-md' : 'text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400'
              }`}
            >
              SIAKAL
            </span>
            <span
              className={`text-[11px] font-semibold ${
                isLandingPage ? 'text-slate-200 drop-shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Ketarunaan & Alumni Poltektrans SDP Palembang
            </span>
          </div>
        </Link>

        {/* Right Section: Theme Switcher & User Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Switcher Toggle (Sun / Moon) */}
          {!hideThemeToggle && (
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm cursor-pointer"
              title="Ganti Mode Terang / Gelap"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          )}

          {/* User Info / Profile */}
          {currentUser && currentUser.name && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userName}</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 capitalize font-bold">{userRole.replace('_', ' ')}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
