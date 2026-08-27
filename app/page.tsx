'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { ShieldCheck, GraduationCap, Trophy, Smile, FileCheck, ArrowRight, Sparkles, LogIn } from 'lucide-react';
import { initialScholarshipOffers, initialAchievements } from '@/lib/mockStore';

export default function LandingPage() {
  const activeScholarship = initialScholarshipOffers[0];
  const topAchievements = initialAchievements.filter((a) => a.statusVerifikasi === 'APPROVED');

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100">
      {/* Background Auto-Crossfade Slider */}
      <LandingSlider />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Text Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 backdrop-blur-md text-sky-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>SIAKAL V2 - Liquid Glass Mobile-First PWA</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Sistem Informasi Akademik <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
                Ketarunaan & Alumni
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Platform layanan terpadu Politeknik Transportasi SDP Palembang. Memfasilitasi Bimbingan PRALA (1 Tahun), Magang & PKL MTPD (4 Bulan), Beasiswa, Prestasi, Clearance Out Bebas Administrasi (FM.AT.01.017-01), dan Tracer Study.
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/login" className="glass-button text-sm flex items-center gap-2 shadow-lg">
                <LogIn className="w-4 h-4" />
                <span>Portal Masuk Sistem</span>
              </Link>
              <Link
                href="/kepuasan-pengguna"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-sm font-semibold text-white flex items-center gap-2 transition-all hover:border-sky-400/50"
              >
                <Smile className="w-4 h-4 text-amber-400" />
                <span>Kepuasan Pengguna Lulusan (Bebas Login)</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </Link>
            </div>
          </div>

          {/* Quick Highlight Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Scholarship Card */}
            {activeScholarship && (
              <div className="glass-panel p-5 border-l-4 border-l-sky-500">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4" />
                    <span>Penawaran Beasiswa Aktif</span>
                  </div>
                  <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full font-medium">
                    Kuota: {activeScholarship.kuota}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{activeScholarship.namaBeasiswa}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{activeScholarship.ketentuan}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tutup: {activeScholarship.tanggalTutup}</span>
                  <Link href="/login" className="text-sky-400 hover:underline font-semibold">
                    Daftar via Portal &rarr;
                  </Link>
                </div>
              </div>
            )}

            {/* Achievement Preview */}
            {topAchievements.length > 0 && (
              <div className="glass-panel p-5 border-l-4 border-l-amber-500">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Trophy className="w-4 h-4" />
                  <span>Galeri Prestasi Mahasiswa (Hall of Fame)</span>
                </div>
                <div className="space-y-2">
                  {topAchievements.slice(0, 2).map((ach) => (
                    <div key={ach.id} className="flex items-center justify-between text-xs bg-slate-900/40 p-2.5 rounded-xl border border-white/5">
                      <div>
                        <div className="font-semibold text-white">{ach.namaEvent}</div>
                        <div className="text-[10px] text-slate-400">{ach.mahasiswaNama} &bull; {ach.capaian}</div>
                      </div>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                        {ach.tingkat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 SIAKAL V2 &bull; Politeknik Transportasi SDP Palembang</span>
          <div className="flex items-center gap-4">
            <Link href="/kepuasan-pengguna" className="hover:text-sky-400">Kuesioner Pengguna Lulusan</Link>
            <Link href="/login" className="hover:text-sky-400">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
