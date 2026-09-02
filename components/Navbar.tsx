'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { DEFAULT_POLTEKTRANS_LOGO } from '@/lib/defaultBranding';
import { getGoogleDriveDirectLink } from '@/lib/googleDrive';

interface NavbarProps {
  currentUser?: {
    name?: string;
    role?: string;
    email?: string;
  };
  onLogout?: () => void;
  hideThemeToggle?: boolean;
}

export function Navbar({ currentUser, onLogout }: NavbarProps) {
  const pathname = usePathname();
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

  const userName = currentUser?.name || 'Pengguna';
  const userRole = currentUser?.role || 'User';

  const logoSource = getGoogleDriveDirectLink(customLogo || DEFAULT_POLTEKTRANS_LOGO);

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl transition-all duration-200 ${
        isPublicPage
          ? 'bg-white/20 border-b border-white/35 text-white shadow-sm'
          : 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-3 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
          <img
            src={logoSource}
            alt="Logo Resmi Kampus Poltektrans SDP Palembang"
            className="h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[170px] object-contain drop-shadow-md transition-transform group-hover:scale-105 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_POLTEKTRANS_LOGO;
            }}
          />

          <div className="flex flex-col justify-center min-w-0">
            <span
              className={`font-black text-base sm:text-xl tracking-wider leading-none transition-colors ${
                isPublicPage ? 'text-white drop-shadow-md' : 'text-slate-900 group-hover:text-sky-600'
              }`}
            >
              SIAKAL
            </span>
            <span
              className={`hidden sm:block text-[11px] font-bold leading-tight mt-0.5 truncate ${
                isPublicPage ? 'text-slate-100 drop-shadow-sm' : 'text-slate-600'
              }`}
            >
              Ketarunaan & Alumni Poltektrans SDP Palembang
            </span>
            <span
              className={`sm:hidden text-[9px] font-extrabold leading-tight mt-0.5 truncate ${
                isPublicPage ? 'text-slate-100' : 'text-slate-600'
              }`}
            >
              Poltektrans SDP
            </span>
          </div>
        </Link>

        {/* Right Section: User Profile & Prominent Red Logout Button */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {currentUser && currentUser.name && (
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-300">
              <div className="hidden sm:flex flex-col text-right">
                <span className={`text-xs sm:text-sm font-black leading-tight ${isPublicPage ? 'text-white drop-shadow-sm' : 'text-slate-900'}`}>{userName}</span>
                <span className={`text-[10px] sm:text-xs font-extrabold capitalize leading-tight ${isPublicPage ? 'text-sky-300' : 'text-sky-600'}`}>{userRole.replace('_', ' ')}</span>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-xs sm:text-base shadow-md shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
                  title="Keluar dari Sistem (Logout)"
                >
                  <LogOut className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
