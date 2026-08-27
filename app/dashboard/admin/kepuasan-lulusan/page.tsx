'use client';

import React, { useState } from 'react';
import { Smile, FileSpreadsheet, Save, CheckCircle2 } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminKepuasanLulusanPage() {
  const [tindakLanjut, setTindakLanjut] = useState<{ [key: number]: string }>({
    1: 'Mempertahankan pembinaan etika, disiplin, integritas, dan kepatuhan keselamatan pelayanan transportasi SDP.',
    2: 'Meningkatkan penguatan kompetensi inti melalui review kurikulum dan RPS berbasis masukan pengguna lulusan.',
    3: 'Meningkatkan program pembelajaran Bahasa Inggris terapan yang relevan dengan percakapan profesional.',
    4: 'Memperkuat literasi dan keterampilan teknologi informasi melalui pemanfaatan LMS dan software transportasi.',
    5: 'Meningkatkan kemampuan komunikasi lisan dan tulisan mahasiswa melalui presentasi dan public speaking.',
    6: 'Mempertahankan dan memperkuat kemampuan kerja sama tim melalui pembelajaran kolaboratif dan posko.',
    7: 'Mendorong pengembangan diri mahasiswa melalui sertifikasi kompetensi dan pelatihan tambahan.',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const rekapData = [
    { no: 1, indikator: 'Etika', sangatBaik: '96.60%', baik: '3.40%', cukup: '0.00%', kurang: '0.00%' },
    { no: 2, indikator: 'Keahlian pada bidang ilmu (kompetensi utama)', sangatBaik: '96.70%', baik: '3.30%', cukup: '0.00%', kurang: '0.00%' },
    { no: 3, indikator: 'Kemampuan berbahasa asing', sangatBaik: '97.10%', baik: '2.90%', cukup: '0.00%', kurang: '0.00%' },
    { no: 4, indikator: 'Penggunaan teknologi informasi', sangatBaik: '97.10%', baik: '2.90%', cukup: '0.00%', kurang: '0.00%' },
    { no: 5, indikator: 'Kemampuan berkomunikasi', sangatBaik: '96.90%', baik: '3.10%', cukup: '0.00%', kurang: '0.00%' },
    { no: 6, indikator: 'Kerjasama tim', sangatBaik: '97.10%', baik: '2.90%', cukup: '0.00%', kurang: '0.00%' },
    { no: 7, indikator: 'Pengembangan diri', sangatBaik: '96.70%', baik: '3.30%', cukup: '0.00%', kurang: '0.00%' },
  ];

  const handleSaveTindakLanjut = () => {
    localStorage.setItem('siakal_tindak_lanjut_lamtek', JSON.stringify(tindakLanjut));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportExcel = () => {
    const exportData = rekapData.map((r) => ({
      'No': r.no,
      'Jenis Kemampuan': r.indikator,
      'Sangat Baik (%)': r.sangatBaik,
      'Baik (%)': r.baik,
      'Cukup (%)': r.cukup,
      'Kurang (%)': r.kurang,
      'Rencana Tindak Lanjut oleh UPPS/PS': tindakLanjut[r.no] || '',
    }));
    exportToExcel([{ sheetName: 'Kepuasan Pengguna Lulusan', data: exportData }], 'SIAKAL_Kepuasan_Pengguna_Lulusan');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Smile className="w-6 h-6 text-amber-400" />
            <span>Kepuasan Pengguna Lulusan & Rencana Tindak Lanjut</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Rekapitulasi otomatis persentase kepuasan atasan alumni dan editor Rencana Tindak Lanjut oleh UPPS/PS.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs flex items-center gap-1.5 shrink-0">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Excel Rekapitulasi</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
          Rencana Tindak Lanjut UPPS/PS berhasil disimpan!
        </div>
      )}

      {/* Table Rekapitulasi */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Tabel Rekapitulasi Penilaian 7 Indikator Kepuasan</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/80 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="p-3 border-r border-white/10 w-12 text-center">No</th>
                <th className="p-3 border-r border-white/10 min-w-[200px]">Jenis Kemampuan</th>
                <th className="p-3 border-r border-white/10 text-center bg-emerald-500/10 text-emerald-300">Sangat Baik</th>
                <th className="p-3 border-r border-white/10 text-center bg-sky-500/10 text-sky-300">Baik</th>
                <th className="p-3 border-r border-white/10 text-center bg-amber-500/10 text-amber-300">Cukup</th>
                <th className="p-3 border-r border-white/10 text-center bg-red-500/10 text-red-300">Kurang</th>
                <th className="p-3 min-w-[300px]">Rencana Tindak Lanjut oleh UPPS/PS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rekapData.map((row) => (
                <tr key={row.no} className="hover:bg-slate-900/40">
                  <td className="p-3 text-center border-r border-white/10 font-bold text-slate-400">{row.no}</td>
                  <td className="p-3 border-r border-white/10 font-bold text-white">{row.indikator}</td>
                  <td className="p-3 border-r border-white/10 text-center font-extrabold text-emerald-400">{row.sangatBaik}</td>
                  <td className="p-3 border-r border-white/10 text-center font-extrabold text-sky-400">{row.baik}</td>
                  <td className="p-3 border-r border-white/10 text-center font-bold text-amber-400">{row.cukup}</td>
                  <td className="p-3 border-r border-white/10 text-center font-bold text-red-400">{row.kurang}</td>
                  <td className="p-2">
                    <textarea
                      value={tindakLanjut[row.no] || ''}
                      onChange={(e) => setTindakLanjut({ ...tindakLanjut, [row.no]: e.target.value })}
                      rows={3}
                      className="w-full glass-input text-xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
          <button onClick={handleSaveTindakLanjut} className="glass-button text-xs flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Simpan Rencana Tindak Lanjut</span>
          </button>
        </div>
      </div>
    </div>
  );
}
