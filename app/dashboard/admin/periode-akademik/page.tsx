'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AcademicPeriodPage() {
  const [activeTahun, setActiveTahun] = useState('2025/2026');
  const [activeSemester, setActiveSemester] = useState('Ganjil');
  const [statusMsg, setStatusMsg] = useState('');

  const handleActivatePeriod = (tahun: string, sem: string) => {
    setActiveTahun(tahun);
    setActiveSemester(sem);
    setStatusMsg(`Periode ${tahun} ${sem} berhasil diaktifkan. Seluruh data transaksi otomatis dikelompokkan ke periode ini.`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const periods = [
    { tahun: '2024/2025', semester: 'Ganjil' },
    { tahun: '2024/2025', semester: 'Genap' },
    { tahun: '2025/2026', semester: 'Ganjil' },
    { tahun: '2025/2026', semester: 'Genap' },
    { tahun: '2026/2027', semester: 'Ganjil' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-sky-400" />
          <span>Manajemen & Saklar Aktivasi Periode Akademik</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Tentukan Tahun Akademik dan Semester aktif. Data transaksi seperti PRALA, TRB, Clearance Out, dan Beasiswa akan ter-tag secara otomatis.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
          {statusMsg}
        </div>
      )}

      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Periode Akademik</h3>

        <div className="space-y-3">
          {periods.map((p, idx) => {
            const isActive = p.tahun === activeTahun && p.semester === activeSemester;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  isActive
                    ? 'bg-sky-500/10 border-sky-500/40 shadow-glow'
                    : 'bg-slate-900/40 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold text-sm text-white">Tahun Akademik {p.tahun}</div>
                    <div className="text-xs text-slate-400">Semester {p.semester}</div>
                  </div>
                </div>

                <div>
                  {isActive ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Periode Aktif
                    </span>
                  ) : (
                    <button
                      onClick={() => handleActivatePeriod(p.tahun, p.semester)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-sky-600 hover:text-white border border-white/10 text-xs font-semibold text-slate-300 transition-all"
                    >
                      Aktifkan Periode Ini
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
