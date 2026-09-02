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
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Briefcase className="w-6 h-6 text-sky-500 shrink-0" />
          <span>Magang & PKL MTPD (Durasi 4 Bulan, Berkelompok)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Khusus Mahasiswa MTPD: Informasi kelompok magang, SK Magang PDF, dan unggah Laporan Akhir Magang untuk diverifikasi Pembimbing Lapangan.
        </p>
      </div>

      {/* Informasi Kelompok & SK Magang Card */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-800 border border-sky-500/20 uppercase">
              Kelompok Magang MTPD 01
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1.5">PT PELNI Cabang Palembang</h3>
            <p className="text-xs text-slate-600 font-semibold">Nomor SK: <strong className="text-slate-900 font-mono">SK/MTPD/2026/004</strong></p>
          </div>

          <a
            href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-extrabold text-sky-700 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Lihat SK Magang (PDF)</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-800 font-bold block mb-1.5">Pembimbing Lapangan:</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Hendra Gunawan (PT PELNI)</span>
            </div>
          </div>

          <div>
            <span className="text-slate-800 font-bold block mb-1.5">Anggota Kelompok:</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold">
              Bambang Pratama (2102011), Siti Rahma (2102012)
            </div>
          </div>
        </div>
      </div>

      {/* Form Upload Laporan Akhir Magang & Verifikasi */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Upload Laporan Akhir Magang & PKL (PDF)</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Laporan disahkan oleh Pembimbing Lapangan di akhir masa magang 4 bulan.</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-black border border-emerald-500/20 shadow-sm">
            Status: {statusVerifikasi}
          </span>
        </div>

        {uploadedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black text-center">
            Laporan Akhir Magang berhasil diunggah!
          </div>
        )}

        <form onSubmit={handleSubmitLaporan} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Judul Laporan Akhir *</label>
            <input
              type="text"
              required
              value={judulLaporan}
              onChange={(e) => setJudulLaporan(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">URL / File Laporan Akhir PDF *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={laporanPdfUrl}
                onChange={(e) => setLaporanPdfUrl(e.target.value)}
                className="flex-1 glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
              <a
                href={laporanPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 text-xs font-extrabold flex items-center gap-1.5 shrink-0 border border-slate-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Pratinjau PDF</span>
              </a>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6">
              <Upload className="w-4 h-4" />
              <span>Unggah Laporan Akhir Magang</span>
            </button>
          </div>
        </form>

        {catatanPembimbing && (
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-1 mt-4">
            <div className="font-black text-sky-700">Catatan Evaluasi Pembimbing Lapangan:</div>
            <div className="text-slate-800 font-semibold italic">&ldquo;{catatanPembimbing}&rdquo;</div>
          </div>
        )}
      </div>
    </div>
  );
}
