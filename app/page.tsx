'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { LogIn, Smile, ArrowRight, ShieldCheck } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function LandingPage() {
  const router = useRouter();
  const [emailOrNim, setEmailOrNim] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = emailOrNim.trim().toLowerCase();
    if (!inputClean) {
      setErrorMsg('Mohon masukkan Email, NIM, NIP, atau Username ID.');
      return;
    }

    // 1. Get current accounts list from localStorage or fallback initialAccounts
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

    // 2. Find user matching email, nim, nip, usernameOrId, or fullName
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

    // 3. Smart Demo Keyword Matcher Fallback for instant testing
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

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100 bg-slate-950 font-sans">
      {/* Dynamic Background Photo Carousel Slider */}
      <LandingSlider />

      {/* Top Header Navbar - Borderless & No Theme Switcher on Landing Page */}
      <Navbar hideThemeToggle={true} />

      {/* Minimalist Landing Page Hero & Direct Embedded Login Box */}
      <main className="relative z-10 max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Minimalist Title Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-lg">
              Sistem Informasi Akademik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
                Ketarunaan & Alumni
              </span>
            </h1>

            <div className="pt-2">
              <Link
                href="/kepuasan-pengguna"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-sky-300 hover:text-white transition-all shadow-lg"
              >
                <Smile className="w-4.5 h-4.5 text-amber-400" />
                <span>Kuesioner Kepuasan Pengguna Lulusan (Bebas Login)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Direct Embedded Login Card Box */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-panel bg-white/95 dark:bg-slate-900/90 p-6 sm:p-8 border border-slate-200/90 dark:border-white/20 shadow-2xl relative overflow-hidden">
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow flex items-center justify-center font-bold text-white text-xl">
                  S
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Masuk ke SIAKAL</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Politeknik Transportasi SDP Palembang</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Email / NIM / NIP / Username ID
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    placeholder="Masukkan NIM, NIP, Email, atau ID Masuk"
                    className="w-full glass-input font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input font-medium"
                  />
                </div>

                <button type="submit" className="w-full glass-button text-xs sm:text-sm py-3 mt-2 font-bold shadow-lg">
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </button>
              </form>

              {/* Demo Hint Helper */}
              <div className="mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Petunjuk Akses Login Otomatis:</span>
                </div>
                <p className="leading-normal font-medium">
                  Masukan ID/NIM/Email terdaftar di Manajemen User (cth: <code className="text-slate-900 dark:text-white font-bold">admin</code>, NIM <code className="text-slate-900 dark:text-white font-bold">2101034</code>, NIP Dosen <code className="text-slate-900 dark:text-white font-bold">19850315...</code>). Peran akun otomatis terdeteksi.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-400 font-medium">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
