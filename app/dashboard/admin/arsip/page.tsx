'use client';

import React, { useState } from 'react';
import { Archive, Download, FileText, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { createAcademicArchiveZip } from '@/lib/utils/zip';

export default function AdminArsipPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportZip = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);

    try {
      // Mock data to include in ZIP archive
      const summaryStats = [
        { Parameter: 'Total Program Studi', Value: 4 },
        { Parameter: 'Total Mahasiswa Terdaftar', Value: 420 },
        { Parameter: 'Total Mahasiswa PRALA', Value: 110 },
        { Parameter: 'Total Magang MTPD', Value: 85 },
        { Parameter: 'Serapan Alumni', Value: '94.2%' },
        { Parameter: 'Tanggal Ekspor Arsip', Value: new Date().toLocaleDateString('id-ID') },
      ];

      await createAcademicArchiveZip('2025-2026', 'Ganjil', { Ringkasan_Akademik: summaryStats });
      setDownloadSuccess(true);
    } catch (err) {
      alert('Gagal membuat paket arsip ZIP. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-purple-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="w-6 h-6 text-purple-500 dark:text-purple-400" />
            <span>Arsip Database Akademik (Format ZIP / PDF / Excel)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Unduh seluruh arsip cadangan (backup) data akademik institusi dalam 1 paket file terkompresi ZIP.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold text-center shadow-lg">
          ✓ Paket Arsip Database Akademik (.ZIP) Berhasil Diunduh ke Komputer Anda!
        </div>
      )}

      <div className="glass-panel p-8 space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
          <Database className="w-8 h-8" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Ekspor Paket Arsip Cadangan (.ZIP)</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Paket ini berisi ringkasan data statistik akademik (CSV), dokumen pendukung, dan manifest lisensi sistem SIAKAL.
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleExportZip}
            disabled={isExporting}
            className="glass-button py-3.5 px-8 text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            <span>{isExporting ? 'Membuat Paket ZIP...' : 'Unduh Arsip Cadangan Akademik (.ZIP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
