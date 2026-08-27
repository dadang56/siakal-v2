'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { LogIn, Smile, ArrowRight } from 'lucide-react';
import { initialAccounts } from '@/lib/mockStore';

export default function LoginPage() {
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
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-950">
      <LandingSlider />
      <Navbar />

      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="glass-panel w-full p-6 sm:p-8 border border-slate-200 dark:border-white/20 shadow-2xl relative overflow-hidden">
          
          {/* Header Branding */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-0.5 shadow-glow flex items-center justify-center font-bold text-white text-xl">
              S
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Portal Masuk SIAKAL V2</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Sistem Informasi Akademik Ketarunaan & Alumni</p>
          </div>

          {/* Role Selector Pills */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Pilih Peran Akun Anda:
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 dark:bg-slate-950/60 p-1.5 rounded-xl border border-slate-300 dark:border-white/10">
              {rolePills.map((pill) => (
                <button
                  key={pill.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(pill.role);
                    setErrorMsg('');
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                    selectedRole === pill.role
                      ? 'bg-sky-500 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email / NIM / NIP
              </label>
              <input
                type="text"
                required
                value={emailOrNim}
                onChange={(e) => setEmailOrNim(e.target.value)}
                placeholder={`Masukkan ${selectedRole === 'mahasiswa' ? 'NIM / Email' : 'NIP / Email'}`}
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi (Password)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input text-xs"
              />
            </div>

            <button type="submit" className="w-full glass-button text-xs py-3 mt-2 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Masuk ke Sistem</span>
            </button>
          </form>

          {/* Public Survey Shortcut */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/10 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">Anda Pengguna Lulusan / Atasan Tempat Kerja Alumni?</p>
            <Link
              href="/kepuasan-pengguna"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border border-slate-300 dark:border-white/15 text-xs font-medium text-sky-600 dark:text-sky-300 flex items-center justify-center gap-2 transition-all"
            >
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Kuesioner Kepuasan Pengguna (Bebas Login)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; 2026 SIAKAL V2 &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
