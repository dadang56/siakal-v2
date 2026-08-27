'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
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
          { label: 'Database Mahasiswa & Taruna', href: '/dashboard/admin/mahasiswa', icon: GraduationCap },
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

  const navItems = getNavItems();

  return (
    <aside className="w-72 hidden md:block shrink-0">
      <div className="glass-panel p-4 sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
        <div className="px-3 py-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Menu Navigation ({role.replace('_', ' ')})
          </span>
        </div>

        <LayoutGroup id="desktop-sidebar-nav">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-colors relative ${
                    isActive
                      ? 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/30 shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-colors ${isActive ? 'text-sky-500' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeSidebarIndicator"
                      className="absolute left-0 w-1 h-6 bg-sky-500 rounded-r-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </LayoutGroup>
      </div>
    </aside>
  );
}
