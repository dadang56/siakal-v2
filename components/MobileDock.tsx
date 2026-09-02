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
  Grid,
  X,
  Building2,
  Calendar,
  Briefcase,
  Trophy,
  Smile,
  Archive,
  UserCheck,
  Settings,
  ChevronRight,
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

  const quickDockItems = [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: role === 'admin' ? 'Mahasiswa' : 'PRALA', href: role === 'admin' ? '/dashboard/admin/mahasiswa' : '/dashboard/prala/bimbingan', icon: role === 'admin' ? Users : Anchor },
    { label: role === 'admin' ? 'Clearance' : 'Beasiswa', href: role === 'admin' ? '/dashboard/admin/clearance-out' : '/dashboard/beasiswa', icon: role === 'admin' ? FileCheck : GraduationCap },
  ];

  return (
    <>
      {/* ULTRA-CLEAN LIGHT APPLE-STYLE MOBILE NAVIGATION SHEET */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            {/* Apple iOS Light Style Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 bg-white/98 backdrop-blur-2xl border-t border-slate-200 rounded-t-[32px] p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4 text-slate-900"
            >
              {/* Drag Pill Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-2 mb-3" />

              {/* Sheet Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
                    S
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Menu Navigasi Mobile</h3>
                    <p className="text-xs text-sky-600 font-extrabold capitalize">Role: {role.replace('_', ' ')}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Grid Links */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {allNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                        isActive
                          ? 'bg-sky-500/15 text-sky-700 border-sky-500/40 shadow-sm'
                          : 'bg-slate-100/90 text-slate-800 border-slate-200 hover:bg-slate-200/80 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${isActive ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>

                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </div>

              <div className="pt-3 text-center text-[11px] text-slate-500 font-bold border-t border-slate-200">
                Politeknik Transportasi SDP Palembang &bull; SIAKAL V2
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING LIGHT APPLE DOCK PILL BAR AT BOTTOM OF MOBILE SCREEN */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-40">
        <div className="glass-panel bg-white/95 border border-slate-200 shadow-2xl p-1.5 flex items-center justify-around rounded-2xl relative max-w-md mx-auto">
          {quickDockItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-bold transition-colors ${
                  isActive
                    ? 'text-sky-600 font-extrabold bg-sky-500/10'
                    : 'text-slate-600 hover:text-slate-900'
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
            className="flex flex-col items-center gap-1 py-1.5 px-3.5 rounded-xl text-[10px] font-extrabold text-sky-600 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 transition-all cursor-pointer active:scale-95"
          >
            <Grid className="w-5 h-5 text-sky-500" />
            <span>Semua Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
