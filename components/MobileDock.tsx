'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, LayoutGroup } from 'framer-motion';
import { LayoutDashboard, Anchor, GraduationCap, FileCheck, Users } from 'lucide-react';

interface MobileDockProps {
  role: string;
}

export function MobileDock({ role }: MobileDockProps) {
  const pathname = usePathname();

  const getDockItems = () => {
    switch (role) {
      case 'admin':
        return [
          { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
          { label: 'User', href: '/dashboard/admin/manajemen-user', icon: Users },
          { label: 'Beasiswa', href: '/dashboard/admin/beasiswa', icon: GraduationCap },
          { label: 'Clearance', href: '/dashboard/admin/clearance-out', icon: FileCheck },
        ];
      case 'mahasiswa':
        return [
          { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
          { label: 'PRALA/Magang', href: '/dashboard/prala/bimbingan', icon: Anchor },
          { label: 'Beasiswa', href: '/dashboard/beasiswa', icon: GraduationCap },
          { label: 'Clearance', href: '/dashboard/clearance-out/pengajuan', icon: FileCheck },
        ];
      default:
        return [
          { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
          { label: 'Clearance', href: '/dashboard/clearance-out/approval', icon: FileCheck },
        ];
    }
  };

  const dockItems = getDockItems();

  return (
    <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
      <div className="glass-panel bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-white/20 shadow-2xl p-1.5 flex items-center justify-around rounded-2xl relative">
        <LayoutGroup id="mobile-dock-nav">
          {dockItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileDockActivePill"
                    className="absolute inset-0 bg-sky-500/15 dark:bg-sky-500/20 rounded-xl border border-sky-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className="w-5 h-5 z-10" />
                <span className="z-10">{item.label}</span>
              </Link>
            );
          })}
        </LayoutGroup>
      </div>
    </div>
  );
}
