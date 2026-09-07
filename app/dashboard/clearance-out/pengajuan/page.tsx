'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileCheck, ShieldCheck, Printer, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClearanceRequest, initialClearanceUnits } from '@/lib/mockStore';
import { getCurrentUser, STORAGE_KEYS } from '@/lib/dbStorage';
import { usePersistentState } from '@/lib/usePersistentState';

export default function StudentClearancePengajuanPage() {
  const [jenisPengajuan, setJenisPengajuan] = useState<'PRALA' | 'LULUS' | 'CUTI' | 'BERHENTI'>('PRALA');
  const currentUser = getCurrentUser();
  const requestsStore = usePersistentState<ClearanceRequest[]>(STORAGE_KEYS.CLEARANCE_REQUESTS, []);
  const request = requestsStore.value.find((item) => item.mahasiswaId === currentUser?.id);
  const unitsStatus = initialClearanceUnits.map((unit) => ({
    ...unit,
    ...(request?.approvals.find((approval) => approval.unitCode === unit.unitCode) || { status: 'Pending', catatan: '', approverNama: '-' }),
  }));

  const submitRequest = async () => {
    if (!currentUser) return;
    const next: ClearanceRequest = {
      id: `clearance-${Date.now()}`,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.fullName,
      nim: currentUser.nim || currentUser.usernameOrId || '-',
      prodi: currentUser.prodi || '-',
      jenisPengajuan,
      createdAt: new Date().toISOString(),
      approvals: initialClearanceUnits.map((unit) => ({ unitCode: unit.unitCode, status: 'Pending', catatan: '' })),
      statusKeseluruhan: 'Pending',
    };
    const others = requestsStore.value.filter((item) => item.mahasiswaId !== currentUser.id);
    await requestsStore.persist([...others, next]);
  };

  const clearedCount = unitsStatus.filter((u) => u.status === 'Memenuhi Syarat').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-sky-400" />
            <span>Clearance Out Surat Bebas Administrasi Kampus (FM.AT.01.017-01)</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Tracking status persetujuan bebas administrasi dari 14 Unit Verifikator Kampus.
          </p>
        </div>

        {request && clearedCount === initialClearanceUnits.length && (
          <Link
            href={`/dashboard/clearance-out/print?id=${request.id}`}
            className="glass-button text-xs py-2 px-4 flex items-center gap-2 shrink-0 shadow-lg"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Dokumen FM.AT.01.017-01</span>
          </Link>
        )}
      </div>

      {!request && (
        <div className="glass-panel p-6 flex flex-col sm:flex-row gap-3 sm:items-end">
          <label className="flex-1 text-xs font-bold text-slate-700">Jenis pengajuan
            <select value={jenisPengajuan} onChange={(e) => setJenisPengajuan(e.target.value as typeof jenisPengajuan)} className="glass-input mt-1 w-full">
              <option value="PRALA">PRALA</option><option value="LULUS">Lulus</option><option value="CUTI">Cuti</option><option value="BERHENTI">Berhenti</option>
            </select>
          </label>
          <button onClick={submitRequest} className="glass-button">Ajukan Clearance</button>
        </div>
      )}

      {/* Overview Progress Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-700">
            Progres Bebas Administrasi: <strong className="text-sky-600 text-sm">{clearedCount} / {initialClearanceUnits.length} Unit</strong>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Jenis: {request?.jenisPengajuan || jenisPengajuan}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${(clearedCount / initialClearanceUnits.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Grid Status 14 Unit */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Status Persetujuan Real-Time Unit Verifikator</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {unitsStatus.map((u) => (
            <div
              key={u.unitCode}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                u.status === 'Memenuhi Syarat'
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400">Unit {u.unitCode}</span>
                <div className="font-bold text-xs text-slate-900">{u.name}</div>
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
