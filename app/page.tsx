'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { LogIn, Smile, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';
import { getUserList, setStoredItem } from '@/lib/dbStorage';

export default function LandingPage() {
  const router = useRouter();
  const [emailOrNim, setEmailOrNim] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = emailOrNim.trim().toLowerCase();
    if (!inputClean) {
      setErrorMsg('Mohon masukkan Email, NIM, NIP, atau Username ID.');
      return;
    }

    const userList: UserAccount[] = getUserList();

    const matchedUser = userList.find(
      (u) =>
        u.email.toLowerCase() === inputClean ||
        (u.nim && u.nim.toLowerCase() === inputClean) ||
        (u.nip && u.nip.toLowerCase() === inputClean) ||
        (u.usernameOrId && u.usernameOrId.toLowerCase() === inputClean)
    );

    if (matchedUser && password === matchedUser.initialPassword) {
      if (!await setStoredItem('siakal_user', matchedUser)) {
        setErrorMsg('Sesi tidak dapat disimpan di perangkat ini. Periksa izin penyimpanan browser.');
        return;
      }

      if (matchedUser.role === 'mahasiswa' && matchedUser.isProfileCompleted === false) {
        router.push('/dashboard/mahasiswa/lengkapi-biodata');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    setErrorMsg('ID masuk atau kata sandi tidak sesuai.');
  };

  const handleQuickDemo = async (targetRole: UserAccount['role']) => {
    const userList: UserAccount[] = getUserList();

    const demoAcc = userList.find((a) => a.role === targetRole) || initialAccounts.find((a) => a.role === targetRole) || initialAccounts[0];

    if (!await setStoredItem('siakal_user', demoAcc)) return;

    if (demoAcc.role === 'mahasiswa' && demoAcc.isProfileCompleted === false) {
      router.push('/dashboard/mahasiswa/lengkapi-biodata');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-white bg-slate-950 font-sans transition-colors duration-200">
      {/* Dynamic Ultra-Sharp Background Photo Carousel Slider */}
      <LandingSlider />

      {/* 100% Liquid Glass Top Header Navbar */}
      <Navbar hideThemeToggle={true} />

      {/* Landing Page Hero & Liquid Glass Login Card Box */}
      <main className="relative z-10 max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 flex-1 flex items-center min-w-0">
        <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Minimalist Title Headline */}
          <div className="lg:col-span-7 min-w-0 space-y-5 sm:space-y-6 text-left">
            <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight break-words">
              <span className="block">Sistem Informasi Akademik</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
                Ketarunaan & Alumni
              </span>
            </h1>

            <div className="pt-2">
              <Link
                href="/kepuasan-pengguna"
                className="flex sm:inline-flex w-full sm:w-auto min-w-0 items-center gap-2 py-3 px-4 sm:px-5 rounded-2xl bg-white/20 hover:bg-white/35 backdrop-blur-xl border border-white/40 text-[11px] sm:text-sm font-extrabold text-white transition-all shadow-xl hover:scale-[1.02]"
              >
                <Smile className="w-4 h-4 shrink-0 text-amber-300" />
                <span className="min-w-0 leading-snug">Kuesioner Kepuasan Pengguna Lulusan (Bebas Login)</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-sky-300" />
              </Link>
            </div>
          </div>

          {/* Right Column: 100% TRANSPARENT LIQUID GLASS LOGIN CARD BOX */}
          <div className="lg:col-span-5 w-full min-w-0 max-w-md mx-auto">
            <div className="w-full min-w-0 bg-white/25 backdrop-blur-2xl p-5 sm:p-8 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl relative space-y-5 text-white">
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Logo Poltektrans SDP Palembang"
                    className="max-h-16 max-w-16 object-contain drop-shadow-lg"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-md">Masuk ke SIAKAL</h2>
                <p className="text-xs font-semibold text-slate-100 drop-shadow-sm mt-0.5">Politeknik Transportasi SDP Palembang</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold shadow-sm">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-white drop-shadow-sm mb-1.5 uppercase tracking-wider">
                    Email / NIM / NIP / Username ID
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    placeholder="Masukkan NIM, NIP, Email, atau ID Masuk"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 text-white placeholder-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-300 focus:bg-white/35 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-white drop-shadow-sm mb-1.5 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 text-white placeholder-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-300 focus:bg-white/35 transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/30 transition-all active:scale-[0.98] cursor-pointer mt-1"
                >
                  <LogIn className="w-4.5 h-4.5" />
                  <span>Masuk ke Sistem</span>
                </button>
              </form>

              {/* Demo shortcuts are deliberately unavailable in production. */}
              {process.env.NEXT_PUBLIC_ENABLE_DEMO === 'true' && <div className="pt-4 border-t border-white/20 space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-amber-300 uppercase tracking-wider drop-shadow-sm">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Uji Coba Mode Demo (Klik 1-Kali Login):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Administrator"
                  >
                    🛡️ Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('mahasiswa')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Mahasiswa"
                  >
                    🎓 Mahasiswa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('dosen')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Dosen Pembimbing"
                  >
                    👨‍🏫 Dosen
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('pembimbing_lapangan')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Pembimbing Lapangan"
                  >
                    ⚓ Pembimbing
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('alumni')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Alumni"
                  >
                    👨‍🎓 Alumni
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('unit_approver')}
                    className="py-2 px-2 rounded-xl bg-white/20 hover:bg-white/35 text-white border border-white/30 backdrop-blur-md transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Unit Approver"
                  >
                    🏛️ Approver
                  </button>
                </div>
              </div>}

            </div>
          </div>

        </div>
      </main>

      {/* 100% Liquid Glass Footbar (Footer) */}
      <footer className="relative z-10 border-t border-white/25 bg-white/20 backdrop-blur-md py-4 px-4 text-center text-[11px] sm:text-xs leading-relaxed text-white font-bold shadow-sm">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
