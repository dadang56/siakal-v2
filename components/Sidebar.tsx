'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Anchor,
  Briefcase,
  GraduationCap,
  Trophy,
  FileCheck,
  Smile,
  Archive,
  UserCheck,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  role: string;
  prodi?: string;
}

export function Sidebar({ role, prodi }: SidebarProps) {
  const pathname = usePathname();

  const isNautikaOrPermesinan = prodi?.toLowerCase().includes('nautika') || prodi?.toLowerCase().includes('permesinan');
  const isMTPD = prodi?.toLowerCase().includes('mtpd') || prodi?.toLowerCase().includes('manajemen transportasi');

  // Navigation Items per Role
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Beranda Admin', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Manajemen User', href: '/dashboard/admin/manajemen-user', icon: Users },
          { label: 'Master Data Prodi & Angkatan', href: '/dashboard/admin/prodi', icon: Building2 },
          { label: 'Periode Akademik', href: '/dashboard/admin/periode-akademik', icon: Calendar },
          { label: 'Monitoring PRALA', href: '/dashboard/admin/prala', icon: Anchor },
          { label: 'Ploting Magang MTPD', href: '/dashboard/admin/magang', icon: Briefcase },
          { label: 'Manajemen Beasiswa', href: '/dashboard/admin/beasiswa', icon: GraduationCap },
          { label: 'Verifikasi Prestasi', href: '/dashboard/admin/prestasi', icon: Trophy },
          { label: 'Supervisi Clearance Out', href: '/dashboard/admin/clearance-out', icon: FileCheck },
          { label: 'Database Alumni & Tracer', href: '/dashboard/admin/alumni', icon: UserCheck },
          { label: 'Kepuasan Pengguna Lulusan', href: '/dashboard/admin/kepuasan-lulusan', icon: Smile },
          { label: 'Arsip Database Akademik', href: '/dashboard/admin/arsip', icon: Archive },
          { label: 'Pengaturan Branding', href: '/dashboard/admin/pengaturan-aplikasi', icon: Settings },
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
          items.push({ label: 'Magang & PKL MTPD (4 Bulan)', href: '/dashboard/magang', icon: Briefcase });
        }
        items.push({ label: 'Pengajuan Beasiswa', href: '/dashboard/beasiswa', icon: GraduationCap });
        items.push({ label: 'Prestasi Akademik & Non-Akademik', href: '/dashboard/prestasi', icon: Trophy });
        items.push({ label: 'Clearance Out (FM.AT.01.017-01)', href: '/dashboard/clearance-out/pengajuan', icon: FileCheck });
        return items;

      case 'dosen':
        return [
          { label: 'Beranda Dosen', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Bimbingan & Reviu TRB PRALA', href: '/dashboard/prala/bimbingan', icon: Anchor },
        ];

      case 'pembimbing_lapangan':
        return [
          { label: 'Beranda Pembimbing', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Verifikasi Laporan Akhir Magang', href: '/dashboard/pembimbing-lapangan', icon: Briefcase },
        ];

      case 'alumni':
        return [
          { label: 'Beranda Alumni', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Form Tracer Study Alumni', href: '/dashboard/tracer-study', icon: GraduationCap },
        ];

      case 'unit_approver':
        return [
          { label: 'Beranda Permit', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Pengaturan Profil NIP & TTD PNG', href: '/dashboard/profil-unit', icon: Settings },
          { label: 'Portal Verifikasi Permit CO', href: '/dashboard/clearance-out/approval', icon: FileCheck },
        ];

      default:
        return [{ label: 'Beranda Utama', href: '/dashboard', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="hidden md:flex flex-col w-64 glass-panel border border-slate-200 dark:border-white/10 p-4 shrink-0 min-h-[calc(100vh-5rem)]">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 px-3 mb-3">
        MENU NAVIGATION ({role.replace('_', ' ')})
      </div>
      <nav className="flex flex-col gap-1 flex-1 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors duration-150 group ${
                isActive
                  ? 'text-sky-600 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {/* Active Pill Smooth Layout Animation */}
              {isActive && (
                <motion.div
                  layoutId="sidebarActivePill"
                  className="absolute inset-0 bg-sky-500/15 dark:bg-sky-500/20 border border-sky-500/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}

              <Icon className={`w-4 h-4 z-10 ${isActive ? 'text-sky-500 dark:text-sky-400' : 'text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`} />
              <span className="z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
