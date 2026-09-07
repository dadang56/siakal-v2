'use client';

import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, ShieldCheck, User } from 'lucide-react';
import { ClearanceRequest, initialClearanceUnits } from '@/lib/mockStore';
import { getCurrentUser, STORAGE_KEYS } from '@/lib/dbStorage';
import { usePersistentState } from '@/lib/usePersistentState';

export default function UnitApproverClearancePage() {
  const currentUser = getCurrentUser();
  const store = usePersistentState<ClearanceRequest[]>(STORAGE_KEYS.CLEARANCE_REQUESTS, []);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const unitCode = currentUser?.usernameOrId?.match(/(\d+)$/)?.[1] ? Number(currentUser.usernameOrId.match(/(\d+)$/)?.[1]) : 3;
  const unitName = initialClearanceUnits.find((unit) => unit.unitCode === unitCode)?.name || `Unit ${unitCode}`;
  const requests = store.value;

  const handleApprove = async (id: string, newStatus: 'Memenuhi Syarat' | 'Tidak Memenuhi Syarat', catatanText: string) => {
    const updated = requests.map((request) => {
      if (request.id !== id) return request;
      const approvals = request.approvals.map((approval) => approval.unitCode === unitCode ? {
        ...approval,
        status: newStatus,
        catatan: catatanText,
        approverNama: currentUser?.namaLengkapGelar || currentUser?.fullName,
        approverNip: currentUser?.nip,
        approvedAt: new Date().toISOString(),
      } : approval);
      const statusKeseluruhan = approvals.some((approval) => approval.status === 'Tidak Memenuhi Syarat')
        ? 'Rejected' as const
        : approvals.every((approval) => approval.status === 'Memenuhi Syarat') ? 'Approved' as const : 'Pending' as const;
      return { ...request, approvals, statusKeseluruhan };
    });
    await store.persist(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-sky-400" />
          <span>Portal Verifikasi Clearance Out ({unitName})</span>
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Verifikasi permohonan bebas administrasi mahasiswa. Penandatanganan digital (TTD PNG) dan NIP Anda akan otomatis dipatrikan pada formulir FM.AT.01.017-01 saat dicetak.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Antrean Permohonan Masuk Unit Anda</h3>

        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{req.mahasiswaNama}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{req.nim}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Prodi: {req.prodi} &bull; Pengajuan: <strong className="text-sky-700">{req.jenisPengajuan}</strong></div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                    req.approvals.find((approval) => approval.unitCode === unitCode)?.status === 'Memenuhi Syarat'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {req.approvals.find((approval) => approval.unitCode === unitCode)?.status || 'Pending'}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={notes[req.id] ?? req.approvals.find((approval) => approval.unitCode === unitCode)?.catatan ?? ''}
                  onChange={(e) => setNotes((current) => ({ ...current, [req.id]: e.target.value }))}
                  placeholder="Catatan verifikasi (optional)..."
                  className="w-full glass-input text-xs"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApprove(req.id, 'Tidak Memenuhi Syarat', notes[req.id] || 'Belum memenuhi persyaratan unit.')}
                    className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Memenuhi Syarat</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id, 'Memenuhi Syarat', notes[req.id] || 'Memenuhi syarat.')}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui (Memenuhi Syarat)</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
