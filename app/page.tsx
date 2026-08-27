'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { LogIn, Smile, ArrowRight } from 'lucide-react';
import { initialAccounts } from '@/lib/mockStore';

export default function LandingPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'admin' | 'mahasiswa' | 'dosen' | 'pembimbing_lapangan' | 'alumni' | 'unit_approver'>('mahasiswa');
  const [emailOrNim, setEmailOrNim] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const rolePills = [
    { role: 'admin', label: 'Admin' },
    { role: 'mahasiswa', label: 'Mahasiswa' },
    { role: 'dosen', label: 'Dosen' },
    { role: 'pembimbing_lapangan', label: 'Pembimbing Lapangan' },
    { role: 'alumni', label: 'Alumni' },
    { role: 'unit_approver', label: 'Unit Approver' },
  ] as const;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const userAcc = initialAccounts.find((a) => a.role === selectedRole);
    if (userAcc) {
      try {
        localStorage.setItem('siakal_user', JSON.stringify(userAcc));
      } catch (err) {}

      if (userAcc.role === 'mahasiswa' && userAcc.isProfileCompleted === false) {
        router.push('/dashboard/mahasiswa/lengkapi-biodata');
      } else {
        router.push('/dashboard');
      }
    } else {
      setErrorMsg('Akun tidak ditemukan untuk peran ini.');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100 bg-slate-950 font-sans">
      {/* Dynamic Background Photo Carousel Slider */}
      <LandingSlider />

      {/* Top Header Navbar */}
      <Navbar />

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
              
              <div className="text-center mb-5">
                <div className="w-11 h-11 mx-auto mb-2 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow flex items-center justify-center font-bold text-white text-lg">
                  S
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">Masuk ke SIAKAL V2</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">Politeknik Transportasi SDP Palembang</p>
              </div>

              {/* Role Selector Pills */}
              <div className="mb-5">
                <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  PILIH PERAN AKUN ANDA:
                </label>
                <div className="grid grid-cols-3 gap-1.5 bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner">
                  {rolePills.map((pill) => (
                    <button
                      key={pill.role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(pill.role);
                        setErrorMsg('');
                      }}
                      className={`py-2 px-1 rounded-lg text-[10px] font-extrabold transition-all ${
                        selectedRole === pill.role
                          ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 border border-sky-400'
                          : 'text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
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
                    Email / NIM / NIP
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    placeholder={`Masukkan ${selectedRole === 'mahasiswa' ? 'NIM / Email' : 'NIP / Email'}`}
                    className="w-full glass-input"
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
                    className="w-full glass-input"
                  />
                </div>

                <button type="submit" className="w-full glass-button text-xs sm:text-sm py-3 mt-2 font-bold shadow-lg">
                  <LogIn className="w-4 h-4" />
                  <span>Masuk ke Sistem</span>
                </button>
              </form>

            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-400 font-medium">
        &copy; 2026 SIAKAL V2 &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
