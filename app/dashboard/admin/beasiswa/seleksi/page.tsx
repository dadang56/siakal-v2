'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Upload, FileText, CheckCircle2, XCircle, Bell, ArrowLeft } from 'lucide-react';

export default function AdminBeasiswaSeleksiPage() {
  const router = useRouter();

  // Document uploads for the meeting decision
  const [notulenUrl, setNotulenUrl] = useState('');
  const [daftarHadirUrl, setDaftarHadirUrl] = useState('');
  const [beritaAcaraUrl, setBeritaAcaraUrl] = useState('');
  const [docsUploaded, setDocsUploaded] = useState(false);

  // Applicants list
  const [applicants, setApplicants] = useState([
    { id: 'app-1', mhsNama: 'Ahmad Fauzi', nim: '2101034', prodi: 'Studi Nautika', status: 'Diajukan' },
    { id: 'app-2', mhsNama: 'Bambang Pratama', nim: '2102011', prodi: 'MTPD', status: 'Diajukan' },
  ]);

  const [notificationSent, setNotificationSent] = useState(false);

  const handleUploadRapatDocs = (e: React.FormEvent) => {
    e.preventDefault();
    setDocsUploaded(true);
  };

  const handleSetStatus = (appId: string, newStatus: 'DITERIMA' | 'TIDAK_DITERIMA') => {
    setApplicants(applicants.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
  };

  const handleFinalizeAndNotify = () => {
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-white">Portal Seleksi Rapat & Berkas Beasiswa</h1>
          <p className="text-xs text-slate-300">Beasiswa Unggulan Transportasi Laut 2026</p>
        </div>
      </div>

      {notificationSent && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" />
          <span>Hasil Seleksi Resmi Ditetapkan! Notifikasi Ucapan Selamat & Pemberitahuan Telah Terkirim ke Seluruh Akun Pendaftar.</span>
        </div>
      )}

      {/* Upload 3 Dokumen Keputusan Rapat Seleksi */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Dokumen Dasar Keputusan Rapat Seleksi Beasiswa</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Wajib mengunggah Notulen Rapat, Daftar Hadir Rapat, dan Berita Acara Keputusan sebelum menetapkan kelulusan.
            </p>
          </div>
          {docsUploaded && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3 Berkas Rapat Lengkap
            </span>
          )}
        </div>

        <form onSubmit={handleUploadRapatDocs} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">1. Notulen Rapat (PDF)</label>
            <input
              type="text"
              required
              value={notulenUrl}
              onChange={(e) => setNotulenUrl(e.target.value)}
              placeholder="Masukkan URL/File Notulen.pdf"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">2. Daftar Hadir Rapat (PDF)</label>
            <input
              type="text"
              required
              value={daftarHadirUrl}
              onChange={(e) => setDaftarHadirUrl(e.target.value)}
              placeholder="Masukkan URL/File Daftar_Hadir.pdf"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">3. Berita Acara Rapat (PDF)</label>
            <input
              type="text"
              required
              value={beritaAcaraUrl}
              onChange={(e) => setBeritaAcaraUrl(e.target.value)}
              placeholder="Masukkan URL/File Berita_Acara.pdf"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="glass-button text-xs flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              <span>Simpan Berkas Rapat Seleksi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Applicants List & Decision */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Pendaftar Beasiswa & Penetapan Hasil</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Nama Mahasiswa</th>
                <th className="pb-3 px-2">NIM</th>
                <th className="pb-3 px-2">Prodi</th>
                <th className="pb-3 px-2">Status Hasil Seleksi</th>
                <th className="pb-3 px-2 text-right">Aksi Penetapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-bold text-white">{app.mhsNama}</td>
                  <td className="py-3 px-2 text-slate-300 font-mono">{app.nim}</td>
                  <td className="py-3 px-2 text-slate-400">{app.prodi}</td>
                  <td className="py-3 px-2">
                    {app.status === 'DITERIMA' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        DITERIMA
                      </span>
                    )}
                    {app.status === 'TIDAK_DITERIMA' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                        TIDAK TERPILIH
                      </span>
                    )}
                    {app.status === 'Diajukan' && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        Dalam Proses
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => handleSetStatus(app.id, 'DITERIMA')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px]"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleSetStatus(app.id, 'TIDAK_DITERIMA')}
                      className="px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white font-semibold text-[10px]"
                    >
                      Tidak Terpilih
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button onClick={handleFinalizeAndNotify} className="glass-button text-xs flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Finalisasi & Pendistribusian Notifikasi Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
