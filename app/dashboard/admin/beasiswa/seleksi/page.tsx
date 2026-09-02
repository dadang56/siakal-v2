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
        <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Portal Seleksi Rapat & Berkas Beasiswa</h1>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">Beasiswa Unggulan Transportasi Laut 2026</p>
        </div>
      </div>

      {notificationSent && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black text-center flex items-center justify-center gap-2 shadow-sm">
          <Bell className="w-5 h-5 text-emerald-600" />
          <span>Hasil Seleksi Resmi Ditetapkan! Notifikasi Ucapan Selamat & Pemberitahuan Telah Terkirim ke Seluruh Akun Pendaftar.</span>
        </div>
      )}

      {/* Upload 3 Dokumen Keputusan Rapat Seleksi Card */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Dokumen Dasar Keputusan Rapat Seleksi Beasiswa</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Wajib mengunggah Notulen Rapat, Daftar Hadir Rapat, dan Berita Acara Keputusan sebelum menetapkan kelulusan.
            </p>
          </div>
          {docsUploaded && (
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-black border border-emerald-500/20 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3 Berkas Rapat Lengkap
            </span>
          )}
        </div>

        <form onSubmit={handleUploadRapatDocs} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">1. Notulen Rapat (PDF)</label>
            <input
              type="text"
              required
              value={notulenUrl}
              onChange={(e) => setNotulenUrl(e.target.value)}
              placeholder="Masukkan URL/File Notulen.pdf"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">2. Daftar Hadir Rapat (PDF)</label>
            <input
              type="text"
              required
              value={daftarHadirUrl}
              onChange={(e) => setDaftarHadirUrl(e.target.value)}
              placeholder="Masukkan URL/File Daftar_Hadir.pdf"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">3. Berita Acara Rapat (PDF)</label>
            <input
              type="text"
              required
              value={beritaAcaraUrl}
              onChange={(e) => setBeritaAcaraUrl(e.target.value)}
              placeholder="Masukkan URL/File Berita_Acara.pdf"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6 shadow-md cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Simpan Berkas Rapat Seleksi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Applicants List & Decision Card */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide">Daftar Pendaftar Beasiswa & Penetapan Hasil</h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Nama Mahasiswa</th>
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">Prodi</th>
                <th className="py-3 px-4">Status Hasil Seleksi</th>
                <th className="py-3 px-4 text-center">Aksi Penetapan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {applicants.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900">{app.mhsNama}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sky-700">{app.nim}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-700">{app.prodi}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        app.status === 'DITERIMA'
                          ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20'
                          : app.status === 'TIDAK_DITERIMA'
                          ? 'bg-red-500/10 text-red-800 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleSetStatus(app.id, 'DITERIMA')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-sm transition-all"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleSetStatus(app.id, 'TIDAK_DITERIMA')}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-sm transition-all"
                      >
                        Tolak
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleFinalizeAndNotify}
            disabled={!docsUploaded}
            className={`px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 ${
              docsUploaded
                ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Kirim Notifikasi Hasil Seleksi ke Seluruh Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}
