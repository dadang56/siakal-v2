'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, FileText, CheckCircle2, XCircle, ExternalLink, Upload, PenTool, Check, Save, Image, ShieldCheck } from 'lucide-react';

export interface MagangActivityLog {
  id: string;
  hariTanggal: string; // e.g. "Senin, 02 Maret 2026"
  aktivitas: string; // e.g. "Pengamatan Operasional Bongkar Muat Petikemas"
  fotoUrl?: string; // photo documentation URL
  catatan?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  supervisorName?: string;
  supervisorTtdUrl?: string;
}

export default function FieldSupervisorPage() {
  // Supervisor Profile & Signature State
  const [supervisorName, setSupervisorName] = useState('Hendra Gunawan, S.T.');
  const [supervisorJabatan, setSupervisorJabatan] = useState('Pembimbing Lapangan PT Pelindo Regional 2');
  const [supervisorTtdUrl, setSupervisorTtdUrl] = useState(
    'https://api.dicebear.com/7.x/identicon/svg?seed=SignatureHendra'
  );
  const [profileSaved, setProfileSaved] = useState(false);

  // Group Activities Log State
  const [activities, setActivities] = useState<MagangActivityLog[]>([
    {
      id: 'act-1',
      hariTanggal: 'Senin, 02 Maret 2026',
      aktivitas: 'Pengamatan & Pengawasan Operasional Crane Bongkar Muat Petikemas di Dermaga Pelabuhan Pelindo 2',
      fotoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop&q=60',
      catatan: 'Mahasiswa sangat disiplin menerapkan APD lengkap K3.',
      isVerified: true,
      verifiedAt: '2026-03-02 16:30',
      supervisorName: 'Hendra Gunawan, S.T.',
      supervisorTtdUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SignatureHendra',
    },
    {
      id: 'act-2',
      hariTanggal: 'Selasa, 03 Maret 2026',
      aktivitas: 'Inspeksi & Verifikasi Dokumen Manifest Kontainer Impor Bersama Tim Syahbandar & Bea Cukai',
      fotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
      catatan: 'Pengenalan alur dokumen ekspor impor pelabuhan.',
      isVerified: false,
    },
  ]);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('siakal_pembimbing_profile');
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        if (p.supervisorName) setSupervisorName(p.supervisorName);
        if (p.supervisorJabatan) setSupervisorJabatan(p.supervisorJabatan);
        if (p.supervisorTtdUrl) setSupervisorTtdUrl(p.supervisorTtdUrl);
      }

      const storedLogs = localStorage.getItem('siakal_magang_activity_logs');
      if (storedLogs) setActivities(JSON.parse(storedLogs));
    } catch (e) {}
  }, []);

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const prof = { supervisorName, supervisorJabatan, supervisorTtdUrl };
    try {
      localStorage.setItem('siakal_pembimbing_profile', JSON.stringify(prof));
    } catch (e) {}
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const saveLogs = (updatedLogs: MagangActivityLog[]) => {
    setActivities(updatedLogs);
    try {
      localStorage.setItem('siakal_magang_activity_logs', JSON.stringify(updatedLogs));
    } catch (e) {}
  };

  const handleVerifyActivity = (actId: string) => {
    const updated = activities.map((a) => {
      if (a.id === actId) {
        return {
          ...a,
          isVerified: true,
          verifiedAt: new Date().toLocaleString('id-ID'),
          supervisorName,
          supervisorTtdUrl,
        };
      }
      return a;
    });
    saveLogs(updated);
    alert('Aktivitas berhasil diverifikasi! TTD Digital & Nama Anda telah otomatis ditempelkan pada laporan.');
  };

  const handleUnverifyActivity = (actId: string) => {
    const updated = activities.map((a) => {
      if (a.id === actId) {
        return {
          ...a,
          isVerified: false,
          verifiedAt: undefined,
          supervisorName: undefined,
          supervisorTtdUrl: undefined,
        };
      }
      return a;
    });
    saveLogs(updated);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <UserCheck className="w-6 h-6 text-sky-500 shrink-0" />
          <span>Portal Pembimbing Lapangan (Magang & PKL MTPD)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Pengaturan profil, TTD Digital Pembimbing, dan Verifikasi Aktivitas Magang Bulanan Mahasiswa.
        </p>
      </div>

      {/* CARD 1: PENGATURAN TTD DIGITAL & PROFIL PEMBIMBING */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-600" />
            <span>Pengaturan TTD Digital & Identitas Pembimbing Lapangan</span>
          </h3>
          {profileSaved && (
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <Check className="w-4 h-4 text-emerald-600" /> TTD & Profil Tersimpan
            </span>
          )}
        </div>

        <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Nama Lengkap & Gelar *</label>
            <input
              type="text"
              required
              value={supervisorName}
              onChange={(e) => setSupervisorName(e.target.value)}
              placeholder="Contoh: Hendra Gunawan, S.T."
              className="w-full glass-input font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Jabatan / Instansi *</label>
            <input
              type="text"
              required
              value={supervisorJabatan}
              onChange={(e) => setSupervisorJabatan(e.target.value)}
              placeholder="Contoh: Supervisor Operasional Pelindo"
              className="w-full glass-input font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">URL / Upload File Gambar TTD Digital *</label>
            <input
              type="text"
              required
              value={supervisorTtdUrl}
              onChange={(e) => setSupervisorTtdUrl(e.target.value)}
              placeholder="https://... / Gambar_TTD.png"
              className="w-full glass-input font-mono text-xs py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div className="md:col-span-3 flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Pratinjau TTD Digital:</span>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 h-12 w-28 flex items-center justify-center">
                {supervisorTtdUrl ? (
                  <img src={supervisorTtdUrl} alt="TTD Pembimbing" className="max-h-9 max-w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-slate-400 italic">Belum ada TTD</span>
                )}
              </div>
            </div>

            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6 cursor-pointer shadow-md">
              <Save className="w-4 h-4" />
              <span>Simpan TTD & Identitas</span>
            </button>
          </div>
        </form>
      </div>

      {/* CARD 2: DAFTAR VERIFIKASI AKTIVITAS MAGANG MAHASISWA */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide flex items-center justify-between">
          <span>Daftar Aktivitas Magang Bulanan Mahasiswa (Perlu Verifikasi)</span>
          <span className="text-xs font-bold text-slate-500">Kelompok MTPD 01 - Pelindo</span>
        </h3>

        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <span className="text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-mono">
                  {act.hariTanggal}
                </span>

                {act.isVerified ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terverifikasi TTD Pembimbing</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 inline-flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-600" />
                    <span>Menunggu Verifikasi</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900">{act.aktivitas}</h4>
                {act.catatan && (
                  <p className="text-xs text-slate-600 font-semibold mt-1">Catatan: &ldquo;{act.catatan}&rdquo;</p>
                )}
              </div>

              {act.fotoUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Foto Dokumentasi Kegiatan:</span>
                  <a href={act.fotoUrl} target="_blank" rel="noreferrer" className="inline-block group">
                    <img src={act.fotoUrl} alt="Dokumentasi" className="h-28 w-44 object-cover rounded-xl border border-slate-300 shadow-sm group-hover:opacity-90 transition-opacity" />
                  </a>
                </div>
              )}

              {/* TTD STAMP IF VERIFIED */}
              {act.isVerified && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {act.supervisorTtdUrl && (
                      <img src={act.supervisorTtdUrl} alt="TTD Stamp" className="h-10 w-20 object-contain border-r border-slate-200 pr-2" />
                    )}
                    <div>
                      <div className="font-black text-slate-900">{act.supervisorName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Verified: {act.verifiedAt}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnverifyActivity(act.id)}
                    className="text-xs text-slate-400 hover:text-red-600 font-bold underline cursor-pointer"
                  >
                    Batalkan Verifikasi
                  </button>
                </div>
              )}

              {/* ACTION BUTTON */}
              {!act.isVerified && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleVerifyActivity(act.id)}
                    className="glass-button text-xs font-black py-2.5 px-5 flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi & Tempel TTD Digital</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
