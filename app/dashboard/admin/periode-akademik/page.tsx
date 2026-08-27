'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { initialPeriodeList } from '@/lib/mockStore';

export default function AdminPeriodePage() {
  const [periodes, setPeriodes] = useState(initialPeriodeList);

  const handleSetActive = (id: string) => {
    setPeriodes(periodes.map((p) => ({ ...p, isAktif: p.id === id })));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-sky-500 dark:text-sky-400" />
          <span>Manajemen & Saklar Aktivasi Periode Akademik</span>
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
          Tentukan Tahun Akademik dan Semester aktif. Data transaksi seperti PRALA, TRB, Clearance Out, dan Beasiswa akan ter-tag secara otomatis.
        </p>
      </div>

      {/* List Periode Card Items */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Daftar Periode Akademik</h3>

        <div className="grid grid-cols-1 gap-3">
          {periodes.map((p) => (
            <div
              key={p.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                p.isAktif
                  ? 'bg-sky-500/10 border-sky-500/40 dark:bg-sky-500/15 shadow-md'
                  : 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    p.isAktif
                      ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/10'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Tahun Akademik {p.tahun}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Semester {p.semester}</p>
                </div>
              </div>

              <div>
                {p.isAktif ? (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Periode Aktif</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetActive(p.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    Aktifkan Periode Ini
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
