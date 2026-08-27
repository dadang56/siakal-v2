'use client';

import React, { useState } from 'react';
import { UserCheck, FileSpreadsheet, Search, Filter, PieChart, Briefcase, Award } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminAlumniPage() {
  const [alumnis, setAlumnis] = useState([
    {
      id: 'alm-1',
      nim: '2001005',
      nama: 'Deni Kurniawan, A.Md.Tra.',
      prodi: 'Studi Nautika',
      tahunLulus: 2024,
      statusKerja: 'Bekerja',
      perusahaan: 'PT PELNI Cabang Palembang',
      jabatan: 'Perwira Kapal (Third Officer)',
      gaji: 'Rp 10.000.000 - Rp 15.000.000',
      masaTungguBulan: 2,
      keselarasan: 'Sangat Sesuai',
    },
    {
      id: 'alm-2',
      nim: '2002018',
      nama: 'Rina Septiani, A.Md.Tra.',
      prodi: 'MTPD',
      tahunLulus: 2024,
      statusKerja: 'Wirausaha',
      perusahaan: 'CV Logistik Mandiri',
      jabatan: 'Owner / Direktur Utama',
      gaji: '> Rp 15.000.000',
      masaTungguBulan: 1,
      keselarasan: 'Sesuai',
    },
  ]);

  const handleExportExcel = () => {
    const exportData = alumnis.map((a) => ({
      'NIM': a.nim,
      'Nama Alumni': a.nama,
      'Prodi': a.prodi,
      'Tahun Lulus': a.tahunLulus,
      'Status Kerja': a.statusKerja,
      'Nama Perusahaan': a.perusahaan,
      'Jabatan': a.jabatan,
      'Range Gaji': a.gaji,
      'Masa Tunggu (Bulan)': a.masaTungguBulan,
      'Keselarasan Bidang': a.keselarasan,
    }));
    exportToExcel([{ sheetName: 'Database Alumni & Tracer', data: exportData }], 'SIAKAL_Database_Alumni_TracerStudy');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-400" />
            <span>Database Master Alumni & Analytics Tracer Study</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Penelusuran rekam karir alumni, statistik keselarasan kerja, dan pelaporan akreditasi BAN-PT / LAMTEK.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs flex items-center gap-1.5 shrink-0">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Database Alumni (Excel)</span>
        </button>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Response Rate</span>
          <span className="text-2xl font-extrabold text-sky-400 mt-1 block">94.8%</span>
        </div>
        <div className="glass-panel p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bekerja & Wirausaha</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">92.5%</span>
        </div>
        <div className="glass-panel p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rata-rata Masa Tunggu</span>
          <span className="text-2xl font-extrabold text-amber-400 mt-1 block">1.8 Bulan</span>
        </div>
        <div className="glass-panel p-4 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Keselarasan Bidang Studi</span>
          <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">96.0%</span>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Rekam Karir Alumni Terdaftar</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">NIM & Nama Alumni</th>
                <th className="pb-3 px-2">Prodi & Lulus</th>
                <th className="pb-3 px-2">Status Karir</th>
                <th className="pb-3 px-2">Perusahaan / Instansi</th>
                <th className="pb-3 px-2">Jabatan</th>
                <th className="pb-3 px-2 text-center">Masa Tunggu</th>
                <th className="pb-3 px-2">Keselarasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {alumnis.map((a) => (
                <tr key={a.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-bold text-white">
                    {a.nama}
                    <div className="text-[10px] text-slate-400 font-mono font-normal">{a.nim}</div>
                  </td>
                  <td className="py-3 px-2 text-slate-300">
                    {a.prodi}
                    <div className="text-[10px] text-slate-400">Lulus {a.tahunLulus}</div>
                  </td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      {a.statusKerja}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-semibold text-slate-200">{a.perusahaan}</td>
                  <td className="py-3 px-2 text-slate-300">{a.jabatan}</td>
                  <td className="py-3 px-2 text-center font-bold text-amber-400">{a.masaTungguBulan} Bln</td>
                  <td className="py-3 px-2 text-sky-400 font-semibold">{a.keselarasan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
