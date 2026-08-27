'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Anchor,
  Briefcase,
  UserCheck,
  FileCheck,
  Trophy,
  PieChart,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import { initialAchievements, Achievement } from '@/lib/mockStore';

export default function MainDashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [achievements] = useState<Achievement[]>(initialAchievements);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('siakal_user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser({ fullName: 'Administrator SIAKAL', role: 'admin' });
      }
    } catch (e) {
      setCurrentUser({ fullName: 'Administrator SIAKAL', role: 'admin' });
    }
  }, []);

  const role = currentUser?.role || 'admin';
  const isAdmin = role === 'admin';

  // Approved Hall of Fame items
  const approvedAchievements = achievements.filter((a) => a.statusVerifikasi === 'APPROVED');

  return (
    <div className="space-y-6">
      {/* Top Minimalist Header */}
      <div className="glass-panel p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Dashboard Executive
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
            Politeknik Transportasi SDP Palembang
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-extrabold text-sky-600 dark:text-sky-400 shrink-0 font-mono">
          2025/2026 Ganjil
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. MINIMALIST DASHBOARD UNTUK ADMIN                                      */}
      {/* ========================================================================= */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* A. CLEAN METRICS STAT CARDS (6 METRIKS UTAMA) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-sky-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">PRODI</span>
                <Building2 className="w-4 h-4 text-sky-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">4</div>
            </div>

            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">MAHASISWA</span>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">420</div>
            </div>

            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">TARUNA PRALA</span>
                <Anchor className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">110</div>
            </div>

            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">MAGANG MTPD</span>
                <Briefcase className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">85</div>
            </div>

            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">SERAPAN ALUMNI</span>
                <UserCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">94.2%</div>
            </div>

            <div className="glass-panel p-4 space-y-1 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">CLEARANCE OUT</span>
                <FileCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">88%</div>
            </div>
          </div>

          {/* B. MINIMALIST CHARTS & PROGRESS BARS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Grafik 1: Distribusi Mahasiswa */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-sky-500" />
                <span>Distribusi Mahasiswa per Prodi</span>
              </h3>

              <div className="space-y-3.5 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 Studi Nautika</span>
                    <span className="font-mono text-sky-500">150</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '35.7%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 Permesinan Kapal</span>
                    <span className="font-mono text-blue-500">130</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '31.0%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 MTPD</span>
                    <span className="font-mono text-amber-500">100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '23.8%' }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D4 TSDP</span>
                    <span className="font-mono text-purple-500">40</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '9.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Grafik 2: Status PRALA & Magang */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4.5 h-4.5 text-indigo-500" />
                <span>Status PRALA & Magang</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* PRALA Card */}
                <Link href="/dashboard/admin/prala" className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3 hover:border-sky-500 transition-all block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Anchor className="w-4 h-4 text-sky-500" /> PRALA
                    </span>
                    <span className="text-xs font-mono font-extrabold text-sky-500">110 Taruna</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '77%' }} />
                    <div className="bg-amber-500 h-full" style={{ width: '23%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-emerald-500">77% TRB Terunggah</span>
                    <span className="text-amber-500">23% Belum</span>
                  </div>
                </Link>

                {/* Magang Card */}
                <Link href="/dashboard/admin/magang" className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3 hover:border-amber-500 transition-all block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-amber-500" /> Magang MTPD
                    </span>
                    <span className="text-xs font-mono font-extrabold text-amber-500">85 Mahasiswa</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '85%' }} />
                    <div className="bg-amber-500 h-full" style={{ width: '15%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-emerald-500">85% Terploting</span>
                    <span className="text-amber-500">15% Pending</span>
                  </div>
                </Link>
              </div>
            </div>

          </div>

          {/* C. CLEAN MINIMALIST PINTASAN AKSI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/dashboard/admin/prala" className="glass-panel p-4 flex items-center justify-between hover:border-sky-500 transition-all group">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Monitoring PRALA</span>
              <Anchor className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
            </Link>

            <Link href="/dashboard/admin/magang" className="glass-panel p-4 flex items-center justify-between hover:border-amber-500 transition-all group">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Ploting Magang</span>
              <Briefcase className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
            </Link>

            <Link href="/dashboard/admin/clearance-out" className="glass-panel p-4 flex items-center justify-between hover:border-emerald-500 transition-all group">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Clearance Out</span>
              <FileCheck className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
            </Link>

            <Link href="/dashboard/admin/manajemen-user" className="glass-panel p-4 flex items-center justify-between hover:border-purple-500 transition-all group">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">Manajemen User</span>
              <Users className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. TAMPILAN BERANDA NON-ADMIN                                            */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Galeri Prestasi Mahasiswa (Hall of Fame)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {approvedAchievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      Tingkat {ach.tingkat}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{ach.tanggalKegiatan}</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{ach.namaEvent}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{ach.mahasiswaNama} &bull; <strong className="text-amber-600">{ach.capaian}</strong></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
