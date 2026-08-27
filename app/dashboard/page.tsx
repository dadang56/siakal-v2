'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialAchievements, Achievement, UserAccount } from '@/lib/mockStore';
import { Trophy, Anchor, Briefcase, GraduationCap, FileCheck, Sparkles, Award, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function DashboardOverviewPage() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('siakal_user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    // Load approved achievements for Hall of Fame Showcase
    const approved = initialAchievements.filter((a) => a.statusVerifikasi === 'APPROVED');
    setAchievements(approved);
  }, []);

  const getTrophyColor = (capaian: string) => {
    if (capaian.includes('1') || capaian.toLowerCase().includes('emas')) return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    if (capaian.includes('2') || capaian.toLowerCase().includes('perak')) return 'text-slate-600 dark:text-slate-300 bg-slate-400/10 border-slate-400/30';
    return 'text-amber-700 bg-amber-600/10 border-amber-600/30';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Welcome Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Selamat Datang di SIAKAL V2</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Halo, {currentUser?.fullName || 'Pengguna SIAKAL'}!
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              Peran: <strong className="text-sky-600 dark:text-sky-400 capitalize">{currentUser?.role.replace('_', ' ')}</strong> {currentUser?.prodi ? `• ${currentUser.prodi}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
              Periode: <strong className="text-sky-600 dark:text-sky-400">2025/2026 Ganjil</strong>
            </span>
          </div>
        </div>
      </div>

      {/* HALL OF FAME: Showcase Galeri Prestasi Taruna / Mahasiswa */}
      <div className="glass-panel p-6 border border-amber-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Galeri Prestasi Mahasiswa (Hall of Fame)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pajangan apresiasi kebanggaan atas prestasi mahasiswa terverifikasi</p>
            </div>
          </div>

          <Link href="/dashboard/prestasi" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-semibold flex items-center gap-1">
            <span>Lihat Semua</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              onClick={() => setSelectedAchievement(ach)}
              className="p-4 rounded-xl bg-white/60 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-amber-500/40 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl border ${getTrophyColor(ach.capaian)}`}>
                  <Award className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
                  Tingkat {ach.tingkat}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                {ach.namaEvent}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{ach.mahasiswaNama}</p>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px]">
                <span className="text-amber-600 dark:text-amber-400 font-bold">{ach.capaian}</span>
                <span className="text-slate-400 dark:text-slate-500">{ach.tanggalKegiatan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Menu Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/clearance-out/pengajuan" className="glass-panel p-5 hover:border-sky-400/40 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300">Clearance Out (FM.AT.01.017-01)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Permohonan Bebas Administrasi 14 Unit</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/beasiswa" className="glass-panel p-5 hover:border-sky-400/40 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Program Beasiswa</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Penawaran & Rapat Seleksi Beasiswa</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/prala/data-kapal" className="glass-panel p-5 hover:border-sky-400/40 transition-all group">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-300">PRALA & Data Kapal</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Studi Nautika & Permesinan (1 Tahun)</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Modal Preview Certificate / Bukti Prestasi */}
      <Modal
        isOpen={!!selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
        title="Detail Prestasi & Pratinjau Bukti Sertifikat"
      >
        {selectedAchievement && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-1">
              <div className="text-base font-bold text-slate-900 dark:text-white">{selectedAchievement.namaEvent}</div>
              <div className="text-sky-600 dark:text-sky-400 font-semibold">{selectedAchievement.mahasiswaNama}</div>
              <div className="text-slate-600 dark:text-slate-400">Penyelenggara: {selectedAchievement.penyelenggara}</div>
              <div className="text-amber-600 dark:text-amber-400 font-bold mt-2">Capaian: {selectedAchievement.capaian} ({selectedAchievement.tingkat})</div>
            </div>

            <div className="border border-slate-200 dark:border-white/10 rounded-xl p-4 bg-slate-50 dark:bg-slate-950 text-center space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 block">Pratinjau File Bukti / Sertifikat Resmi</span>
              <a
                href={selectedAchievement.fileBuktiUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 glass-button text-xs"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Dokumen Bukti (PDF / Foto)</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
