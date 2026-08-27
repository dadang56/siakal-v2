'use client';

import React, { useState } from 'react';
import { FileCheck, CheckCircle2, XCircle, ShieldCheck, User } from 'lucide-react';

export default function UnitApproverClearancePage() {
  const [requests, setRequests] = useState([
    {
      id: 'req-1',
      mahasiswaNama: 'Ahmad Fauzi',
      nim: '2101034',
      prodi: 'Studi Nautika',
      jenisPengajuan: 'PRALA',
      status: 'Pending',
      catatan: '',
    },
    {
      id: 'req-2',
      mahasiswaNama: 'Bambang Pratama',
      nim: '2102011',
      prodi: 'MTPD',
      jenisPengajuan: 'LULUS',
      status: 'Memenuhi Syarat',
      catatan: 'Bebas pinjaman perpustakaan.',
    },
  ]);

  const handleApprove = (id: string, newStatus: 'Memenuhi Syarat' | 'Tidak Memenuhi Syarat', catatanText: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: newStatus, catatan: catatanText } : r)));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-sky-400" />
          <span>Portal Verifikasi Clearance Out (Unit Perpustakaan)</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Verifikasi permohonan bebas administrasi mahasiswa. Penandatanganan digital (TTD PNG) dan NIP Anda akan otomatis dipatrikan pada formulir FM.AT.01.017-01 saat dicetak.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-white mb-2">Antrean Permohonan Masuk Unit Anda</h3>

        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{req.mahasiswaNama}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{req.nim}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Prodi: {req.prodi} &bull; Pengajuan: <strong className="text-sky-300">{req.jenisPengajuan}</strong></div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                    req.status === 'Memenuhi Syarat'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <input
                  type="text"
                  value={req.catatan}
                  onChange={(e) => setRequests(requests.map((r) => (r.id === req.id ? { ...r, catatan: e.target.value } : r)))}
                  placeholder="Catatan verifikasi (optional)..."
                  className="w-full glass-input text-xs"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleApprove(req.id, 'Tidak Memenuhi Syarat', req.catatan || 'Masih ada penunggakan.')}
                    className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tidak Memenuhi Syarat</span>
                  </button>
                  <button
                    onClick={() => handleApprove(req.id, 'Memenuhi Syarat', req.catatan || 'Memenuhi syarat.')}
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
