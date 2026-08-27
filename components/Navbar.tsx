'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Sun, Moon, LogOut } from 'lucide-react';
import { DEFAULT_POLTEKTRANS_LOGO } from '@/lib/defaultBranding';

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
  const [customLogo, setCustomLogo] = useState<string>(DEFAULT_POLTEKTRANS_LOGO);

  const isPublicPage = pathname === '/' || pathname === '/kepuasan-pengguna' || pathname === '/login';

  const loadCustomLogo = () => {
    try {
      const stored = localStorage.getItem('siakal_custom_logo');
      if (stored && stored.trim().length > 0) {
        setCustomLogo(stored);
        return;
      }
    } catch (e) {
      console.error(e);
    }
    setCustomLogo(DEFAULT_POLTEKTRANS_LOGO);
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
      className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-200 ${
        isPublicPage
          ? 'bg-slate-950/30 dark:bg-slate-950/40 border-b border-white/15 text-white shadow-sm'
          : 'bg-white/95 dark:bg-slate-950/90 border-b border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-none'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-3 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <img
            src={customLogo || DEFAULT_POLTEKTRANS_LOGO}
            alt="Logo Resmi Kampus Poltektrans SDP Palembang"
            className="h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[170px] object-contain drop-shadow-md transition-transform group-hover:scale-105"
            onError={(e) => {
              // Fallback if uploaded image URL fails
              (e.target as HTMLImageElement).src = DEFAULT_POLTEKTRANS_LOGO;
            }}
          />

          <div className="flex flex-col justify-center">
            <span
              className={`font-black text-base sm:text-xl tracking-wider leading-none transition-colors ${
                isPublicPage ? 'text-white drop-shadow-md' : 'text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400'
              }`}
            >
              SIAKAL
            </span>
            <span
              className={`text-[9px] sm:text-[11px] font-bold leading-tight mt-0.5 truncate max-w-[140px] sm:max-w-none ${
                isPublicPage ? 'text-slate-200 drop-shadow-sm' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Poltektrans SDP Palembang
            </span>
          </div>
        </Link>

        {/* Right Section: Theme Switcher & User Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theme Switcher Toggle (Sun / Moon) */}
          {!hideThemeToggle && (
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className={`p-2 sm:p-2.5 rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer border ${
                isPublicPage
                  ? 'bg-white/20 hover:bg-white/35 text-white border-white/30 backdrop-blur-md'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/80 dark:hover:bg-slate-800'
              }`}
              title="Ganti Mode Terang / Gelap"
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${isPublicPage ? 'text-white' : 'text-slate-700'}`} />
              )}
            </button>
          )}

          {/* User Info / Profile */}
          {currentUser && currentUser.name && (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200 dark:border-white/10">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{userName}</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 capitalize font-bold">{userRole.replace('_', ' ')}</span>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
