'use client';

import React, { useState } from 'react';
import { Smile, Download, FileCheck, Save } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminKepuasanLulusanPage() {
  const [surveyResults, setSurveyResults] = useState([
    { id: 1, aspek: 'Etika, Integritas, dan Kedisiplinan', sangatBaik: 96.6, baik: 3.4, cukup: 0.0, kurang: 0.0, rtl: 'Mempertahankan pembinaan etika, disiplin, integritas, dan kepatuhan keselamatan pelayanan transportasi SDP.' },
    { id: 2, aspek: 'Keahlian Berdasarkan Bidang Ilmu (Komp. Inti)', sangatBaik: 96.7, baik: 3.3, cukup: 0.0, kurang: 0.0, rtl: 'Meningkatkan penguatan kompetensi inti melalui review kurikulum dan RPS berbasis masukan pengguna lulusan.' },
    { id: 3, aspek: 'Kemampuan Bahasa Inggris Terapan', sangatBaik: 97.1, baik: 2.9, cukup: 0.0, kurang: 0.0, rtl: 'Meningkatkan program pembelajaran Bahasa Inggris terapan yang relevan dengan percakapan profesional.' },
    { id: 4, aspek: 'Penggunaan Teknologi Informasi', sangatBaik: 97.1, baik: 2.9, cukup: 0.0, kurang: 0.0, rtl: 'Memperkuat literasi dan keterampilan teknologi informasi melalui pemanfaatan LMS dan software transportasi.' },
    { id: 5, aspek: 'Kemampuan Berkomunikasi', sangatBaik: 96.9, baik: 3.1, cukup: 0.0, kurang: 0.0, rtl: 'Meningkatkan kemampuan komunikasi lisan dan tulisan mahasiswa melalui presentasi dan public speaking.' },
    { id: 6, aspek: 'Kerjasama Tim & Kepemimpinan', sangatBaik: 97.1, baik: 2.9, cukup: 0.0, kurang: 0.0, rtl: 'Mempertahankan dan memperkuat kemampuan kerja sama tim melalui pembelajaran kolaboratif dan posko.' },
  ]);

  const [savedRtl, setSavedRtl] = useState(false);

  const handleRtlChange = (id: number, val: string) => {
    setSurveyResults(surveyResults.map((item) => (item.id === id ? { ...item, rtl: val } : item)));
  };

  const handleSaveRtl = () => {
    setSavedRtl(true);
    setTimeout(() => setSavedRtl(false), 3000);
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Kepuasan Pengguna Lulusan',
          data: surveyResults.map((r) => ({
            No: r.id,
            'Jenis Kemampuan': r.aspek,
            'Sangat Baik (%)': `${r.sangatBaik}%`,
            'Baik (%)': `${r.baik}%`,
            'Cukup (%)': `${r.cukup}%`,
            'Kurang (%)': `${r.kurang}%`,
            'Rencana Tindak Lanjut (RTL) UPPS/PS': r.rtl,
          })),
        },
      ],
      'Hasil_Kepuasan_Pengguna_Lulusan_RTL_LAMTEK'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Smile className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <span>Hasil Survei Kepuasan Pengguna Lulusan & Editor RTL</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Rekapitulasi otomatis persentase kepuasan atasan alumni dan editor Rencana Tindak Lanjut oleh UPPS/PS.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Download className="w-4 h-4" />
          <span>Export Excel Rekapitulasi</span>
        </button>
      </div>

      {savedRtl && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold text-center shadow-lg">
          ✓ Rencana Tindak Lanjut (RTL) Berhasil Disimpan!
        </div>
      )}

      {/* Tabel Survei & RTL */}
      <div className="glass-panel p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Tabel Evaluasi Kepuasan Pengguna Lulusan (Persentase Per Aspek)
          </h3>
          <button onClick={handleSaveRtl} className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan RTL</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-200/80 dark:bg-slate-900/80 border-b border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">
                <th className="p-3 text-center w-12 border-r border-slate-300 dark:border-white/10">NO</th>
                <th className="p-3 border-r border-slate-300 dark:border-white/10">JENIS KEMAMPUAN</th>
                <th className="p-3 text-center text-emerald-600 dark:text-emerald-400 border-r border-slate-300 dark:border-white/10">SANGAT BAIK</th>
                <th className="p-3 text-center text-sky-600 dark:text-sky-400 border-r border-slate-300 dark:border-white/10">BAIK</th>
                <th className="p-3 text-center text-amber-600 dark:text-amber-400 border-r border-slate-300 dark:border-white/10">CUKUP</th>
                <th className="p-3 text-center text-red-600 dark:text-red-400 border-r border-slate-300 dark:border-white/10">KURANG</th>
                <th className="p-3">RENCANA TINDAK LANJUT OLEH UPPS/PS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {surveyResults.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 text-center font-bold text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/5">{r.id}</td>
                  <td className="p-3 font-extrabold text-slate-900 dark:text-white border-r border-slate-200 dark:border-white/5">{r.aspek}</td>
                  <td className="p-3 text-center font-extrabold text-emerald-600 dark:text-emerald-400 border-r border-slate-200 dark:border-white/5">{r.sangatBaik}%</td>
                  <td className="p-3 text-center font-extrabold text-sky-600 dark:text-sky-400 border-r border-slate-200 dark:border-white/5">{r.baik}%</td>
                  <td className="p-3 text-center font-extrabold text-amber-600 dark:text-amber-400 border-r border-slate-200 dark:border-white/5">{r.cukup}%</td>
                  <td className="p-3 text-center font-extrabold text-red-600 dark:text-red-400 border-r border-slate-200 dark:border-white/5">{r.kurang}%</td>
                  <td className="p-2">
                    <textarea
                      rows={2}
                      value={r.rtl}
                      onChange={(e) => handleRtlChange(r.id, e.target.value)}
                      className="w-full glass-input text-xs font-medium"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
