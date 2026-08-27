'use client';

import React, { useState } from 'react';
import { UserCheck, Search, Download, GraduationCap, Briefcase, Building2, MapPin } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminAlumniDatabasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProdi, setFilterProdi] = useState('Semua');

  const [alumnis] = useState([
    {
      id: 'alm-1',
      nama: 'Deni Kurniawan, A.Md.Tra.',
      nim: '2001015',
      prodi: 'Studi Nautika',
      tahunLulus: 2024,
      statusKerja: 'Bekerja Sesuai Bidang',
      perusahaan: 'PT Samudera Indonesia Tbk',
      jabatan: 'Officer Perwira Kapal',
      masaTungguBulan: 2,
      keselarasan: 'Sangat Selaras',
    },
    {
      id: 'alm-2',
      nama: 'Siti Nurhaliza, A.Md.Tra.',
      nim: '2003022',
      prodi: 'Manajemen Transportasi Perairan Daratan',
      tahunLulus: 2024,
      statusKerja: 'Bekerja Sesuai Bidang',
      perusahaan: 'PT Pelindo Regional 2',
      jabatan: 'Staf Operasional Pelabuhan',
      masaTungguBulan: 3,
      keselarasan: 'Sangat Selaras',
    },
  ]);

  const filteredAlumnis = alumnis.filter((a) => {
    const matchSearch =
      a.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nim.includes(searchQuery) ||
      a.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === 'Semua' || a.prodi === filterProdi;
    return matchSearch && matchProdi;
  });

  const handleExportExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Database Alumni',
          data: filteredAlumnis.map((a) => ({
            NIM: a.nim,
            'Nama Alumni': a.nama,
            'Program Studi': a.prodi,
            'Tahun Lulus': a.tahunLulus,
            'Status Pekerjaan': a.statusKerja,
            Perusahaan: a.perusahaan,
            Jabatan: a.jabatan,
            'Masa Tunggu (Bulan)': a.masaTungguBulan,
            Keselarasan: a.keselarasan,
          })),
        },
      ],
      'Database_Alumni_Tracer_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Master Database Alumni & Tracer Study</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Direktori data kelulusan alumni, penelusuran karir tempat kerja, masa tunggu dapat kerja, dan evaluasi keselarasan bidang studi.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Download className="w-4 h-4" />
          <span>Ekspor Database (.XLSX)</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama alumni, NIM, atau perusahaan..."
            className="w-full glass-input pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">Filter Prodi:</span>
          <select
            value={filterProdi}
            onChange={(e) => setFilterProdi(e.target.value)}
            className="glass-input text-xs sm:text-sm"
          >
            <option value="Semua">Semua Prodi</option>
            <option value="Studi Nautika">Studi Nautika</option>
            <option value="Permesinan Kapal">Permesinan Kapal</option>
            <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
          </select>
        </div>
      </div>

      {/* Table Cards List */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Alumni Terdata ({filteredAlumnis.length} Lulusan)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-3">Nama Alumni</th>
                <th className="pb-3 px-3">Prodi & Lulus</th>
                <th className="pb-3 px-3">Status Karir & Instansi</th>
                <th className="pb-3 px-3">Masa Tunggu</th>
                <th className="pb-3 px-3">Keselarasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredAlumnis.map((a) => (
                <tr key={a.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white text-sm">
                    {a.nama}
                    <div className="text-xs text-slate-500 font-mono font-normal">NIM: {a.nim}</div>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {a.prodi}
                    <div className="text-xs text-slate-500 font-normal">Lulusan {a.tahunLulus}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{a.perusahaan}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-medium text-xs mt-0.5">{a.jabatan}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                    {a.masaTungguBulan} Bulan
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {a.keselarasan}
                    </span>
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
