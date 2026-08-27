'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Anchor,
  GraduationCap,
  FileCheck,
  Users,
  Menu,
  X,
  Building2,
  Calendar,
  Briefcase,
  Trophy,
  Smile,
  Archive,
  UserCheck,
  Settings,
} from 'lucide-react';

interface MobileDockProps {
  role: string;
  prodi?: string;
}

export function MobileDock({ role, prodi }: MobileDockProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isNautikaOrPermesinan = prodi?.toLowerCase().includes('nautika') || prodi?.toLowerCase().includes('permesinan');
  const isMTPD = prodi?.toLowerCase().includes('mtpd') || prodi?.toLowerCase().includes('manajemen transportasi');

  // All Nav Items per Role for Mobile Drawer Sheet
  const getAllNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Beranda Executive', href: '/dashboard', icon: LayoutDashboard, category: 'Utama' },
          { label: 'Database Mahasiswa', href: '/dashboard/admin/mahasiswa', icon: GraduationCap, category: 'Master Data' },
          { label: 'Manajemen User', href: '/dashboard/admin/manajemen-user', icon: Users, category: 'Master Data' },
          { label: 'Daftar Prodi', href: '/dashboard/admin/prodi', icon: Building2, category: 'Master Data' },
          { label: 'Periode Akademik', href: '/dashboard/admin/periode-akademik', icon: Calendar, category: 'Akademik' },
          { label: 'Monitoring PRALA', href: '/dashboard/admin/prala', icon: Anchor, category: 'Pra-Layar' },
          { label: 'Ploting Magang MTPD', href: '/dashboard/admin/magang', icon: Briefcase, category: 'Magang' },
          { label: 'Manajemen Beasiswa', href: '/dashboard/admin/beasiswa', icon: GraduationCap, category: 'Layanan' },
          { label: 'Verifikasi Prestasi', href: '/dashboard/admin/prestasi', icon: Trophy, category: 'Layanan' },
          { label: 'Supervisi Clearance Out', href: '/dashboard/admin/clearance-out', icon: FileCheck, category: 'Layanan' },
          { label: 'Database Alumni & Tracer', href: '/dashboard/admin/alumni', icon: UserCheck, category: 'Alumni' },
          { label: 'Kepuasan Pengguna Lulusan', href: '/dashboard/admin/kepuasan-lulusan', icon: Smile, category: 'Alumni' },
          { label: 'Arsip Database Akademik', href: '/dashboard/admin/arsip', icon: Archive, category: 'Sistem' },
          { label: 'Pengaturan Branding', href: '/dashboard/admin/pengaturan-aplikasi', icon: Settings, category: 'Sistem' },
        ];

      case 'mahasiswa':
        const items = [
          { label: 'Beranda & Hall of Fame', href: '/dashboard', icon: LayoutDashboard },
        ];
        if (isNautikaOrPermesinan || !prodi) {
          items.push({ label: 'Data Kapal & Perusahaan PRALA', href: '/dashboard/prala/data-kapal', icon: Anchor });
          items.push({ label: 'Bimbingan & Unggah TRB PDF', href: '/dashboard/prala/bimbingan', icon: Anchor });
        }
        if (isMTPD || !prodi) {
          items.push({ label: 'Status Ploting Magang MTPD', href: '/dashboard/magang', icon: Briefcase });
        }
        items.push({ label: 'Pengajuan Beasiswa', href: '/dashboard/beasiswa', icon: GraduationCap });
        items.push({ label: 'Input Prestasi Mahasiswa', href: '/dashboard/prestasi', icon: Trophy });
        items.push({ label: 'Surat Bebas Administrasi', href: '/dashboard/clearance-out/pengajuan', icon: FileCheck });
        items.push({ label: 'Tracer Study Alumni', href: '/dashboard/tracer-study', icon: UserCheck });
        return items;

      case 'dosen':
        return [
          { label: 'Beranda Dosen', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Bimbingan TRB PRALA', href: '/dashboard/prala/bimbingan', icon: Anchor },
          { label: 'Clearance Out Verification', href: '/dashboard/clearance-out/approval', icon: FileCheck },
        ];

      case 'pembimbing_lapangan':
        return [
          { label: 'Beranda Pembimbing', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Monitoring Magang MTPD', href: '/dashboard/pembimbing-lapangan', icon: Briefcase },
        ];

      case 'alumni':
        return [
          { label: 'Beranda Alumni', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Pengisian Tracer Study', href: '/dashboard/tracer-study', icon: UserCheck },
          { label: 'Surat Bebas Administrasi', href: '/dashboard/clearance-out/pengajuan', icon: FileCheck },
        ];

      case 'unit_approver':
        return [
          { label: 'Beranda Unit Verifikator', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Persetujuan Clearance Out', href: '/dashboard/clearance-out/approval', icon: FileCheck },
          { label: 'Profil & Spesimen TTD', href: '/dashboard/profil-unit', icon: Settings },
        ];

      default:
        return [{ label: 'Beranda', href: '/dashboard', icon: LayoutDashboard }];
    }
  };

  const allNavItems = getAllNavItems();

  // Quick 4 items for bottom dock bar
  const quickDockItems = [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: role === 'admin' ? 'Mahasiswa' : 'Prala/Magang', href: role === 'admin' ? '/dashboard/admin/mahasiswa' : '/dashboard/prala/bimbingan', icon: role === 'admin' ? Users : Anchor },
    { label: role === 'admin' ? 'Clearance' : 'Beasiswa', href: role === 'admin' ? '/dashboard/admin/clearance-out' : '/dashboard/beasiswa', icon: role === 'admin' ? FileCheck : GraduationCap },
  ];

  return (
    <>
      {/* FULL RESPONSIVE LIQUID GLASS MOBILE NAVIGATION DRAWER SHEET */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />

            {/* Bottom Drawer Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-t border-slate-200 dark:border-white/20 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                    S
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Menu Navigasi SIAKAL</h3>
                    <p className="text-[11px] text-sky-600 dark:text-sky-400 font-bold capitalize">Akses Sebagai: {role.replace('_', ' ')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Grid Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-2xl text-xs font-bold transition-all border ${
                        isActive
                          ? 'bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border-sky-500/40 shadow-sm'
                          : 'bg-slate-100/70 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-sky-500/30'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400 font-medium border-t border-slate-200 dark:border-white/10">
                Politeknik Transportasi SDP Palembang &bull; SIAKAL Mobile 2026
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING MOBILE DOCK BAR AT BOTTOM OF SCREEN */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40">
        <div className="glass-panel bg-white/90 dark:bg-slate-950/90 border border-slate-200 dark:border-white/20 shadow-2xl p-1.5 flex items-center justify-around rounded-2xl relative">
          {quickDockItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-bold transition-colors ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-extrabold bg-sky-500/10 rounded-xl'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* 1-TAP ALL MENU NAVIGATOR BUTTON */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-extrabold text-sky-600 dark:text-sky-400 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 transition-all cursor-pointer"
          >
            <Menu className="w-5 h-5 text-sky-500" />
            <span>Semua Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
