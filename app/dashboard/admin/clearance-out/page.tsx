'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileCheck, ShieldCheck, Printer, CheckCircle2, Clock } from 'lucide-react';
import { initialClearanceUnits } from '@/lib/mockStore';

export default function AdminClearanceOutPage() {
  const [requests, setRequests] = useState([
    {
      id: 'co-req-1',
      mahasiswaNama: 'Ahmad Fauzi',
      nim: '2101034',
      prodi: 'Studi Nautika',
      jenisPengajuan: 'PRALA',
      statusKeseluruhan: 'Approved',
      clearedCount: 14,
      tanggal: '2026-08-20',
    },
    {
      id: 'co-req-2',
      mahasiswaNama: 'Bambang Pratama',
      nim: '2102011',
      prodi: 'MTPD',
      jenisPengajuan: 'LULUS',
      statusKeseluruhan: 'Pending',
      clearedCount: 11,
      tanggal: '2026-08-22',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-sky-400" />
          <span>Supervisi Clearance Out (Dokumen Standar FM.AT.01.017-01)</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Monitoring seluruh permohonan bebas administrasi mahasiswa dari ke-14 Unit Verifikator Kampus.
        </p>
      </div>

      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Permohonan Clearance Out</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Mahasiswa</th>
                <th className="pb-3 px-2">Prodi</th>
                <th className="pb-3 px-2">Jenis Pengajuan</th>
                <th className="pb-3 px-2">Progres 14 Unit</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-bold text-white">
                    {r.mahasiswaNama}
                    <div className="text-[10px] text-slate-400 font-mono font-normal">{r.nim}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{r.prodi}</td>
                  <td className="py-3 px-2 font-bold text-sky-300">{r.jenisPengajuan}</td>
                  <td className="py-3 px-2">
                    <span className="font-bold text-amber-400">{r.clearedCount} / 14 Unit Cleared</span>
                  </td>
                  <td className="py-3 px-2">
                    {r.statusKeseluruhan === 'Approved' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                        Disetujui 100%
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                        Dalam Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link
                      href="/dashboard/clearance-out/print"
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-sky-400 font-semibold text-xs inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak PDF Presisi</span>
                    </Link>
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
