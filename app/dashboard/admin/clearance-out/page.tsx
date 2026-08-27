'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FileCheck, Printer, CheckCircle2, Clock, Search } from 'lucide-react';

export default function AdminClearanceOutPage() {
  const [requests] = useState([
    {
      id: 'co-req-1',
      mahasiswaNama: 'Ahmad Fauzi',
      nim: '2101034',
      prodi: 'Studi Nautika',
      jenisPengajuan: 'PRALA',
      clearedUnitsCount: 14,
      statusKeseluruhan: 'Approved',
    },
    {
      id: 'co-req-2',
      mahasiswaNama: 'Bambang Pratama',
      nim: '2102011',
      prodi: 'MTPD',
      jenisPengajuan: 'LULUS',
      clearedUnitsCount: 11,
      statusKeseluruhan: 'Pending',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-sky-500 dark:text-sky-400" />
          <span>Supervisi & Cetak Presisi Clearance Out FM.AT.01.017-01</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          Monitoring seluruh permohonan bebas administrasi mahasiswa dari ke-14 Unit Verifikator Kampus. Cetak PDF presisi lengkap TTD digital & NIP.
        </p>
      </div>

      {/* Table Requests */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Pengajuan Surat Bebas Administrasi
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-3">Mahasiswa</th>
                <th className="pb-3 px-3">Prodi</th>
                <th className="pb-3 px-3">Jenis Pengajuan</th>
                <th className="pb-3 px-3">Progres 14 Unit</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{r.mahasiswaNama}</div>
                    <div className="text-xs text-slate-500 font-mono font-medium">NIM: {r.nim}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">{r.prodi}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      {r.jenisPengajuan}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400">
                    {r.clearedUnitsCount} / 14 Unit Cleared
                  </td>
                  <td className="py-3.5 px-3">
                    {r.statusKeseluruhan === 'Approved' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Disetujui 100%
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Dalam Verifikasi
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      href="/dashboard/clearance-out/print"
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
                    >
                      <Printer className="w-4 h-4 text-sky-400" />
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
