'use client';

import React, { useState } from 'react';
import { Briefcase, FileText, Upload, CheckCircle2, UserCheck, Clock, ExternalLink } from 'lucide-react';

export default function StudentMagangPage() {
  const [judulLaporan, setJudulLaporan] = useState('Laporan Akhir Magang MTPD: Efisiensi Logistik Pelabuhan');
  const [laporanPdfUrl, setLaporanPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [statusVerifikasi, setStatusVerifikasi] = useState<'Pending' | 'Diterima' | 'Revisi'>('Diterima');
  const [catatanPembimbing, setCatatanPembimbing] = useState('Laporan akhir sangat baik dan memenuhi standar teknis operasional.');
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadedSuccess(true);
    setTimeout(() => setUploadedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-sky-400" />
          <span>Magang & PKL MTPD (Durasi 4 Bulan, Berkelompok)</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Khusus Mahasiswa Prodi MTPD: Informasi kelompok magang, SK Magang PDF, dan unggah Laporan Akhir Magang untuk diverifikasi Pembimbing Lapangan.
        </p>
      </div>

      {/* Informasi Kelompok & SK Magang Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 uppercase">
              Kelompok Magang MTPD 01
            </span>
            <h3 className="text-base font-bold text-white mt-1">PT PELNI Cabang Palembang</h3>
            <p className="text-xs text-slate-400">Nomor SK: <strong className="text-slate-200">SK/MTPD/2026/004</strong></p>
          </div>

          <a
            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-sky-400 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Lihat SK Magang (PDF)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block mb-1">Pembimbing Lapangan:</span>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-medium text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Hendra Gunawan (PT PELNI)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">Anggota Kelompok:</span>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300">
              Bambang Pratama (2102011), Siti Rahma (2102012)
            </div>
          </div>
        </div>
      </div>

      {/* Form Upload Laporan Akhir Magang & Verifikasi */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Upload Laporan Akhir Magang & PKL (PDF)</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">Laporan disahkan oleh Pembimbing Lapangan di akhir masa magang 4 bulan.</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Status: {statusVerifikasi}
          </span>
        </div>

        {uploadedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
            Laporan Akhir Magang berhasil diunggah!
          </div>
        )}

        <form onSubmit={handleSubmitLaporan} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Judul Laporan Akhir *</label>
            <input
              type="text"
              required
              value={judulLaporan}
              onChange={(e) => setJudulLaporan(e.target.value)}
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">URL / File Laporan Akhir PDF *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={laporanPdfUrl}
                onChange={(e) => setLaporanPdfUrl(e.target.value)}
                className="flex-1 glass-input text-xs"
              />
              <a
                href={laporanPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 text-sky-400 text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Pratinjau PDF</span>
              </a>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Unggah Laporan Akhir Magang</span>
            </button>
          </div>
        </form>

        {catatanPembimbing && (
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs space-y-1 mt-4">
            <div className="font-bold text-sky-300">Catatan Evaluasi Pembimbing Lapangan:</div>
            <div className="text-slate-300 italic">&ldquo;{catatanPembimbing}&rdquo;</div>
          </div>
        )}
      </div>
    </div>
  );
}
