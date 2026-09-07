'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileDock } from '@/components/MobileDock';
import { MaritimeBackgroundAnimation } from '@/components/MaritimeBackgroundAnimation';
import { UserAccount } from '@/lib/mockStore';
import { getCurrentUser } from '@/lib/dbStorage';

const rolePrefixes: Record<UserAccount['role'], string[]> = {
  admin: ['/dashboard'],
  mahasiswa: ['/dashboard', '/dashboard/mahasiswa', '/dashboard/prala', '/dashboard/magang', '/dashboard/beasiswa', '/dashboard/prestasi', '/dashboard/clearance-out/pengajuan', '/dashboard/clearance-out/print'],
  dosen: ['/dashboard', '/dashboard/prala/bimbingan', '/dashboard/clearance-out/approval'],
  pembimbing_lapangan: ['/dashboard', '/dashboard/pembimbing-lapangan'],
  alumni: ['/dashboard', '/dashboard/tracer-study', '/dashboard/clearance-out/pengajuan', '/dashboard/clearance-out/print'],
  unit_approver: ['/dashboard', '/dashboard/clearance-out/approval', '/dashboard/profil-unit'],
};

function canAccess(user: UserAccount, path: string) {
  if (user.role === 'admin') return true;
  if (path.startsWith('/dashboard/admin')) return false;
  return rolePrefixes[user.role].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Synchronous State Initializer to prevent re-render flashes during navigation
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const user = getCurrentUser();
      if (!user) {
        router.replace('/');
        return;
      }
      setCurrentUser(user);
      if (!canAccess(user, pathname)) {
        router.replace('/dashboard');
        return;
      }

      if (
          user.role === 'mahasiswa' &&
          user.isProfileCompleted === false &&
          pathname !== '/dashboard/mahasiswa/lengkapi-biodata'
      ) {
        router.replace('/dashboard/mahasiswa/lengkapi-biodata');
      }
      setReady(true);
    } catch (err) {
      console.error(err);
    }
  }, [pathname, router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('siakal_user');
    } catch (e) {}
    router.push('/login');
  };

  if (!ready || !currentUser) {
    return <div className="min-h-screen grid place-items-center bg-slate-950 text-white font-bold">Memeriksa sesi dan hak akses…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Dynamic Maritime Animated Background (Kemudi Kapal, Kompas, Propeller, Jangkar) */}
      <MaritimeBackgroundAnimation />

      <Navbar
        currentUser={{ name: currentUser.fullName, role: currentUser.role, email: currentUser.email }}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 gap-6 lg:gap-8 relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar role={currentUser.role} prodi={currentUser.prodi} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6 flex flex-col">{children}</main>
      </div>

      {/* Mobile Floating Dock Navigation */}
      <MobileDock role={currentUser.role} prodi={currentUser.prodi} />
    </div>
  );
}
