'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { LogIn, Smile, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function LandingPage() {
  const router = useRouter();
  const [emailOrNim, setEmailOrNim] = useState('admin');
  const [password, setPassword] = useState('SIAKAL2026!');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = emailOrNim.trim().toLowerCase();
    if (!inputClean) {
      setErrorMsg('Mohon masukkan Email, NIM, NIP, atau Username ID.');
      return;
    }

    let userList: UserAccount[] = initialAccounts;
    try {
      const stored = localStorage.getItem('siakal_user_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          userList = parsed;
        }
      }
    } catch (err) {}

    const matchedUser = userList.find(
      (u) =>
        u.email.toLowerCase() === inputClean ||
        (u.nim && u.nim.toLowerCase() === inputClean) ||
        (u.nip && u.nip.toLowerCase() === inputClean) ||
        (u.usernameOrId && u.usernameOrId.toLowerCase() === inputClean) ||
        u.fullName.toLowerCase().includes(inputClean)
    );

    if (matchedUser) {
      try {
        localStorage.setItem('siakal_user', JSON.stringify(matchedUser));
      } catch (err) {}

      if (matchedUser.role === 'mahasiswa' && matchedUser.isProfileCompleted === false) {
        router.push('/dashboard/mahasiswa/lengkapi-biodata');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    let fallbackRole: UserAccount['role'] = 'mahasiswa';
    if (inputClean.includes('admin')) fallbackRole = 'admin';
    else if (inputClean.includes('dosen')) fallbackRole = 'dosen';
    else if (inputClean.includes('super') || inputClean.includes('pembimbing') || inputClean.includes('pelni')) fallbackRole = 'pembimbing_lapangan';
    else if (inputClean.includes('alumni')) fallbackRole = 'alumni';
    else if (inputClean.includes('unit') || inputClean.includes('perpus') || inputClean.includes('approver')) fallbackRole = 'unit_approver';

    const fallbackAcc = userList.find((a) => a.role === fallbackRole) || initialAccounts[0];
    try {
      localStorage.setItem('siakal_user', JSON.stringify(fallbackAcc));
    } catch (err) {}

    router.push('/dashboard');
  };

  const handleQuickDemo = (targetRole: UserAccount['role']) => {
    let userList: UserAccount[] = initialAccounts;
    try {
      const stored = localStorage.getItem('siakal_user_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          userList = parsed;
        }
      }
    } catch (err) {}

    const demoAcc = userList.find((a) => a.role === targetRole) || initialAccounts.find((a) => a.role === targetRole) || initialAccounts[0];

    try {
      localStorage.setItem('siakal_user', JSON.stringify(demoAcc));
    } catch (err) {}

    if (demoAcc.role === 'mahasiswa' && demoAcc.isProfileCompleted === false) {
      router.push('/dashboard/mahasiswa/lengkapi-biodata');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-900 bg-slate-50 font-sans transition-colors duration-200">
      {/* Dynamic Bright Background Photo Carousel Slider */}
      <LandingSlider />

      {/* Top Header Navbar */}
      <Navbar hideThemeToggle={true} />

      {/* Landing Page Hero & Bright Light Glass Login Card Box */}
      <main className="relative z-10 max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Minimalist Title Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 drop-shadow-md leading-tight">
              Sistem Informasi Akademik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-blue-700">
                Ketarunaan & Alumni
              </span>
            </h1>

            <div className="pt-2">
              <Link
                href="/kepuasan-pengguna"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/90 text-xs sm:text-sm font-extrabold text-slate-900 transition-all shadow-lg hover:shadow-xl"
              >
                <Smile className="w-4.5 h-4.5 text-amber-500" />
                <span>Kuesioner Kepuasan Pengguna Lulusan (Bebas Login)</span>
                <ArrowRight className="w-4 h-4 text-sky-600" />
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Bright Light Glass Embedded Login Card Box */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-panel bg-white/95 backdrop-blur-2xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-3xl relative space-y-5 text-slate-900">
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow flex items-center justify-center font-black text-white text-xl">
                  S
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900">Masuk ke SIAKAL</h2>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">Politeknik Transportasi SDP Palembang</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-bold shadow-sm">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email / NIM / NIP / Username ID
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    placeholder="Masukkan NIM, NIP, Email, atau ID Masuk"
                    className="w-full px-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] cursor-pointer mt-1"
                >
                  <LogIn className="w-4.5 h-4.5" />
                  <span>Masuk ke Sistem</span>
                </button>
              </form>

              {/* QUICK DEMO ACCOUNT BUTTONS FOR ALL ROLES */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-sky-700 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Uji Coba Mode Demo (Klik 1-Kali Login):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="py-2 px-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Administrator"
                  >
                    🛡️ Admin
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('mahasiswa')}
                    className="py-2 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Mahasiswa"
                  >
                    🎓 Mahasiswa
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('dosen')}
                    className="py-2 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Dosen Pembimbing"
                  >
                    👨‍🏫 Dosen
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('pembimbing_lapangan')}
                    className="py-2 px-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Pembimbing Lapangan"
                  >
                    ⚓ Pembimbing
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('alumni')}
                    className="py-2 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Alumni"
                  >
                    👨‍🎓 Alumni
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('unit_approver')}
                    className="py-2 px-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-sm"
                    title="Login sebagai Unit Approver"
                  >
                    🏛️ Approver
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Bright Footbar (Footer) */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 text-center text-xs text-slate-600 font-bold shadow-sm">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
