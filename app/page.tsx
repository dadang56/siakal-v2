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

      {/* Top Header Navbar - Pure White Brand Text & Borderless Header */}
      <Navbar hideThemeToggle={true} />

      {/* Minimalist Landing Page Hero & Premium Dark Glass Login Box */}
      <main className="relative z-10 max-w-[1920px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Minimalist Title Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight drop-shadow-xl">
              Sistem Informasi Akademik <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-300 to-blue-400">
                Ketarunaan & Alumni
              </span>
            </h1>

            <div className="pt-2">
              <Link
                href="/kepuasan-pengguna"
                className="inline-flex items-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-sky-300 hover:text-white transition-all shadow-xl"
              >
                <Smile className="w-4.5 h-4.5 text-amber-400" />
                <span>Kuesioner Kepuasan Pengguna Lulusan (Bebas Login)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Dark Glass Embedded Login Card Box */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="glass-panel bg-slate-950/80 backdrop-blur-2xl p-6 sm:p-8 border border-white/20 shadow-2xl rounded-3xl relative overflow-hidden">
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow flex items-center justify-center font-black text-white text-xl">
                  S
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Masuk ke SIAKAL</h2>
                <p className="text-xs text-slate-300 font-semibold mt-0.5">Politeknik Transportasi SDP Palembang</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Email / NIM / NIP / Username ID
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    placeholder="Masukkan NIM, NIP, Email, atau ID Masuk"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-200 mb-1.5 uppercase tracking-wider">
                    Kata Sandi (Password)
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all active:scale-[0.98] cursor-pointer mt-2"
                >
                  <LogIn className="w-4.5 h-4.5" />
                  <span>Masuk ke Sistem</span>
                </button>
              </form>

              {/* Sleek Minimalist Helper */}
              <div className="mt-5 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Masukan ID terdaftar (cth: <code className="text-white font-bold">admin</code>, NIM <code className="text-white font-bold">2101034</code>, NIP Dosen).</span>
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
