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
  GraduationCap,
  PieChart,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Smile,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
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
        // Fallback default admin
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
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
            Selamat Datang di Portal Utama SIAKAL
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            Halo, {currentUser?.fullName || 'Pengguna'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
            Peran Akun: <span className="capitalize text-sky-600 dark:text-sky-400 font-extrabold">{role.replace('_', ' ')}</span> &bull; Politeknik Transportasi SDP Palembang
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-right shrink-0">
          <span className="text-xs text-slate-500 font-medium block">Periode Akademik Aktif</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">2025/2026 Ganjil</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. KHUSUS TAMPILAN BERANDA ADMIN: STATISTIK DATABASE & GRAFIK MONITORING  */}
      {/* ========================================================================= */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* A. STATISTIK METRICS CARDS (6 STATISTIK KUNCI) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Card 1: Jumlah Prodi */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-sky-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PRODI AKTIF</span>
                <Building2 className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">4</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Program Studi</span>
              </div>
              <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">D3 Nautika, PK, MTPD, D4 TSDP</span>
            </div>

            {/* Card 2: Jumlah Mahasiswa */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">MAHASISWA</span>
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">420</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Mahasiswa</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> 100% Aktif Terdaftar
              </span>
            </div>

            {/* Card 3: Taruna PRALA */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TARUNA PRALA</span>
                <Anchor className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">110</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Praktek Laut</span>
              </div>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">85 TRB PDF Terunggah</span>
            </div>

            {/* Card 4: Magang MTPD */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">MAGANG MTPD</span>
                <Briefcase className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">85</span>
                <span className="text-xs font-bold text-slate-500 ml-1">Mahasiswa</span>
              </div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">72 Terploting Pelindo</span>
            </div>

            {/* Card 5: Tracer Study Alumni */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">SERAPAN ALUMNI</span>
                <UserCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">94.2%</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Masa Tunggu 2.4 Bulan</span>
            </div>

            {/* Card 6: Clearance Out */}
            <div className="glass-panel p-4 flex flex-col justify-between space-y-2 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CLEARANCE OUT</span>
                <FileCheck className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">88%</span>
              </div>
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">14 Unit Approval Clear</span>
            </div>
          </div>

          {/* B. PANEL GRAFIK & ANALYTICS MONITORING */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* GRAFIK 1: DISTRIBUSI MAHASISWA PER PROGRAM STUDI */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-500" />
                  <span>Grafik Distribusi Mahasiswa per Program Studi</span>
                </h3>
                <span className="text-xs font-mono font-bold text-slate-500">Total: 420</span>
              </div>

              <div className="space-y-3 pt-1">
                {/* Prodi 1: D3 Studi Nautika */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 Studi Nautika</span>
                    <span className="font-mono text-sky-600 dark:text-sky-400">150 Mahasiswa (35.7%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: '35.7%' }} />
                  </div>
                </div>

                {/* Prodi 2: D3 Permesinan Kapal */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 Permesinan Kapal</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400">130 Mahasiswa (31.0%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '31.0%' }} />
                  </div>
                </div>

                {/* Prodi 3: D3 MTPD */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D3 Manajemen Transportasi Perairan Daratan (MTPD)</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">100 Mahasiswa (23.8%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '23.8%' }} />
                  </div>
                </div>

                {/* Prodi 4: D4 TSDP */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>D4 Teknologi Rekayasa Pelayaran & TSDP</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">40 Mahasiswa (9.5%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '9.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* GRAFIK 2: MONITORING UNGGAH TRB PRALA & PLOTING MAGANG */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-500" />
                  <span>Monitoring Progres PRALA (1 Tahun) & Magang (4 Bulan)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* PRALA Monitoring Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Anchor className="w-4 h-4 text-sky-500" /> Taruna PRALA
                    </span>
                    <span className="text-xs font-mono font-extrabold text-sky-600">110 Taruna</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>TRB PDF Terunggah:</span>
                      <span className="font-bold text-emerald-600">85 Taruna (77.3%)</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>Belum Unggah:</span>
                      <span className="font-bold text-amber-600">25 Taruna (22.7%)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '77.3%' }} />
                    <div className="bg-amber-500 h-full" style={{ width: '22.7%' }} />
                  </div>

                  <Link href="/dashboard/admin/prala" className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1">
                    <span>Detail Monitoring PRALA</span> <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Magang MTPD Monitoring Box */}
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-amber-500" /> Magang MTPD
                    </span>
                    <span className="text-xs font-mono font-extrabold text-amber-600">85 Mahasiswa</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>Ploting SK Disetujui:</span>
                      <span className="font-bold text-emerald-600">72 Mahasiswa (84.7%)</span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-700 dark:text-slate-300">
                      <span>Pending Ploting:</span>
                      <span className="font-bold text-amber-600">13 Mahasiswa (15.3%)</span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full" style={{ width: '84.7%' }} />
                    <div className="bg-amber-500 h-full" style={{ width: '15.3%' }} />
                  </div>

                  <Link href="/dashboard/admin/magang" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                    <span>Detail Ploting Magang</span> <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* C. QUICK ACCESSIBLE MENU LINKS UNTUK EXECUTIVE ADMIN */}
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">Pintasan Kontrol & Monitoring Admin</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/dashboard/admin/prala" className="p-4 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Monitoring PRALA (1 Thn)</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Kapal, TRB PDF & Pembimbing</p>
                </div>
                <Anchor className="w-6 h-6 text-sky-500 group-hover:scale-110 transition-transform" />
              </Link>

              <Link href="/dashboard/admin/magang" className="p-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Ploting Magang MTPD</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">SK Magang & Pembimbing</p>
                </div>
                <Briefcase className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
              </Link>

              <Link href="/dashboard/admin/clearance-out" className="p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Clearance Out 14 Unit</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Supervisi Surat Bebas</p>
                </div>
                <FileCheck className="w-6 h-6 text-emerald-500 group-hover:scale-110 transition-transform" />
              </Link>

              <Link href="/dashboard/admin/manajemen-user" className="p-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all flex items-center justify-between group">
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Manajemen User & Password</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Akun & Impor Excel</p>
                </div>
                <Users className="w-6 h-6 text-purple-500 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. TAMPILAN BERANDA NON-ADMIN (MAHASISWA/DOSEN/ALUMNI/UNIT APPROVER)     */
        /* ========================================================================= */
        <div className="space-y-6">
          {/* Galeri Prestasi Hall of Fame */}
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
