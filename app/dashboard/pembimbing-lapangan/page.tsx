'use client';

import React, { useState } from 'react';
import { UserCheck, FileText, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';

export default function FieldSupervisorPage() {
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      kelompokNama: 'Kelompok MTPD 01 - PT PELNI Palembang',
      judul: 'Laporan Akhir Magang MTPD: Efisiensi Logistik Pelabuhan',
      anggota: 'Bambang Pratama (2102011), Siti Rahma (2102012)',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      status: 'Pending',
      catatan: '',
    },
  ]);

  const handleVerify = (id: string, status: 'Diterima' | 'Revisi', catatanText: string) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status, catatan: catatanText } : r)));
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-sky-400" />
          <span>Portal Verifikasi Pembimbing Lapangan (Magang & PKL MTPD)</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Penilaian & Verifikasi Laporan Akhir Magang & PKL 4 Bulan milik kelompok Mahasiswa MTPD di instansi/perusahaan tempat magang.
        </p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.id} className="glass-panel p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300">
                  {rep.kelompokNama}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{rep.judul}</h3>
                <p className="text-xs text-slate-400">Anggota: <strong className="text-slate-200">{rep.anggota}</strong></p>
              </div>

              <a
                href={rep.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-sky-400 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Buka Laporan (PDF)</span>
              </a>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-300">Catatan Evaluasi Pembimbing Lapangan:</label>
              <textarea
                value={rep.catatan}
                onChange={(e) => setReports(reports.map((r) => (r.id === rep.id ? { ...r, catatan: e.target.value } : r)))}
                rows={2}
                placeholder="Berikan masukan atau catatan evaluasi untuk mahasiswa..."
                className="w-full glass-input text-xs"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Status Saat Ini: <strong className="text-amber-400">{rep.status}</strong></span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerify(rep.id, 'Revisi', rep.catatan || 'Perlu perbaikan pada bab pembahasan.')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Minta Revisi</span>
                  </button>
                  <button
                    onClick={() => handleVerify(rep.id, 'Diterima', rep.catatan || 'Laporan diterima dan memenuhi syarat.')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verifikasi DITERIMA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
