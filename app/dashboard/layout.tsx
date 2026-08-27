'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { MobileDock } from '@/components/MobileDock';
import { MaritimeBackgroundAnimation } from '@/components/MaritimeBackgroundAnimation';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Synchronous State Initializer to prevent re-render flashes during navigation
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user');
        if (stored) {
          return JSON.parse(stored) as UserAccount;
        }
      } catch (e) {}
    }
    return initialAccounts[0];
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_user');
      if (stored) {
        const user = JSON.parse(stored) as UserAccount;
        if (user.id !== currentUser.id) {
          setCurrentUser(user);
        }

        if (
          user.role === 'mahasiswa' &&
          user.isProfileCompleted === false &&
          pathname !== '/dashboard/mahasiswa/lengkapi-biodata'
        ) {
          router.push('/dashboard/mahasiswa/lengkapi-biodata');
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [pathname, router, currentUser.id]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('siakal_user');
    } catch (e) {}
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 relative overflow-x-hidden">
      {/* Dynamic Maritime Animated Background (Kemudi Kapal, Kompas, Propeller, Jangkar) */}
      <MaritimeBackgroundAnimation />

      <Navbar
        currentUser={{ name: currentUser.fullName, role: currentUser.role, email: currentUser.email }}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-10 py-6 gap-8 relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar role={currentUser.role} prodi={currentUser.prodi} />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 pb-20 md:pb-6 flex flex-col">{children}</main>
      </div>

      {/* Mobile Floating Dock Navigation */}
      <MobileDock role={currentUser.role} />
    </div>
  );
}
