'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileCheck, ShieldCheck, Printer, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { initialClearanceUnits } from '@/lib/mockStore';

export default function StudentClearancePengajuanPage() {
  const [jenisPengajuan, setJenisPengajuan] = useState<'PRALA' | 'LULUS' | 'CUTI' | 'BERHENTI'>('PRALA');
  const [isSubmitted, setIsSubmitted] = useState(true);

  // Mock status of 14 units
  const [unitsStatus, setUnitsStatus] = useState(
    initialClearanceUnits.map((u) => ({
      ...u,
      status: u.unitCode <= 12 ? 'Memenuhi Syarat' : 'Pending',
      approverNama: u.unitCode <= 12 ? 'Dra. Sri Wahyuni, M.IP.' : '-',
      approverNip: u.unitCode <= 12 ? '198704202012011003' : '-',
    }))
  );

  const clearedCount = unitsStatus.filter((u) => u.status === 'Memenuhi Syarat').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-sky-400" />
            <span>Clearance Out Surat Bebas Administrasi Kampus (FM.AT.01.017-01)</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Tracking status persetujuan bebas administrasi dari 14 Unit Verifikator Kampus.
          </p>
        </div>

        {clearedCount === 14 && (
          <Link
            href="/dashboard/clearance-out/print"
            className="glass-button text-xs py-2 px-4 flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Dokumen FM.AT.01.017-01</span>
          </Link>
        )}
      </div>

      {/* Overview Progress Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-300">
            Progres Bebas Administrasi: <strong className="text-sky-400 text-sm">{clearedCount} / 14 Unit Cleared</strong>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Jenis: {jenisPengajuan}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(clearedCount / 14) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid Status 14 Unit */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-white mb-2">Status Persetujuan Real-Time 14 Unit Verifikator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unitsStatus.map((u) => (
            <div
              key={u.unitCode}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                u.status === 'Memenuhi Syarat'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-900/50 border-white/10'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Unit {u.unitCode}</span>
                <div className="font-bold text-xs text-white">{u.name}</div>
                <div className="text-[10px] text-slate-400">{u.approverNama}</div>
              </div>

              <div>
                {u.status === 'Memenuhi Syarat' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Memenuhi
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pending
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
