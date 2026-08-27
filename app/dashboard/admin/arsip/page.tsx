'use client';

import React, { useState } from 'react';
import { Archive, Download, Calendar, FileSpreadsheet, CheckCircle2, FileArchive } from 'lucide-react';
import { createAcademicArchiveZip } from '@/lib/utils/zip';
import { exportToExcel } from '@/lib/utils/excel';
import { initialAccounts, initialAchievements, initialScholarshipOffers } from '@/lib/mockStore';

export default function AcademicArchivePage() {
  const [selectedTahun, setSelectedTahun] = useState('2025/2026');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil');
  const [downloading, setDownloading] = useState(false);

  const mockArchiveData = {
    '01_Data_Mahasiswa': [
      { NIM: '2101034', Nama: 'Ahmad Fauzi', Prodi: 'Studi Nautika', Angkatan: 2023, Status: 'Aktif' },
      { NIM: '2102011', Nama: 'Bambang Pratama', Prodi: 'MTPD', Angkatan: 2023, Status: 'Aktif' },
    ],
    '02_Bimbingan_PRALA': [
      { Tanggal: '2025-10-12', Mahasiswa: 'Ahmad Fauzi', Judul: 'Evaluasi Perawatan Mesin', Status: 'Approved' },
    ],
    '03_TRB_Upload_Progress': [
      { Mahasiswa: 'Ahmad Fauzi', FilePDF: 'TRB_Ahmad_Fauzi_2025.pdf', StatusVerifikasi: 'Approved' },
    ],
    '04_Clearance_Out_Permits': [
      { Mahasiswa: 'Ahmad Fauzi', Jenis: 'PRALA', StatusKeseluruhan: 'Approved', TotalUnitCleared: '14/14' },
    ],
    '05_Tracer_Study_Alumni': [
      { Alumni: 'Deni Kurniawan', StatusKerja: 'Bekerja', Perusahaan: 'PT PELNI', Jabatan: 'Perwira Kapal', MasaTungguBulan: 2 },
    ],
    '06_Kepuasan_Pengguna_Lulusan': [
      { Atasan: 'Capt. Hendra Gunawan', Perusahaan: 'PT PELNI', Alumni: 'Ahmad Fauzi', NilaiEtika: 'Sangat Baik' },
    ],
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    await createAcademicArchiveZip(selectedTahun, selectedSemester, mockArchiveData);
    setDownloading(false);
  };

  const handleDownloadExcelMultiSheet = () => {
    const sheets = Object.entries(mockArchiveData).map(([name, data]) => ({
      sheetName: name,
      data,
    }));
    exportToExcel(sheets, `SIAKAL_Arsip_${selectedTahun.replace('/', '-')}_${selectedSemester}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Archive className="w-6 h-6 text-sky-400" />
          <span>Pusat Arsip Database Akademik per Semester</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Pilih Tahun Akademik dan Semester untuk mengunduh rekapitulasi data komprehensif dalam format Excel Multi-Sheet atau ZIP.
        </p>
      </div>

      {/* Filter Card */}
      <div className="glass-panel p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Tahun Akademik</span>
            </label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Semester</span>
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </div>

        {/* Contents Checklist */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
          <span className="text-xs font-bold text-sky-300 block mb-1">Rincian Paket Arsip Terintegrasi:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 01. Data Biodata Mahasiswa
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 02. Bimbingan PRALA & Log
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 03. Upload Progress TRB PDF
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 04. Clearance Out 14 Unit Permits
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 05. Tracer Study Alumni
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 06. Kepuasan Pengguna Lulusan
            </span>
          </div>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            onClick={handleDownloadExcelMultiSheet}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-bold text-white flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download Multi-Sheet Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="glass-button text-xs py-2.5 px-5 flex items-center gap-2"
          >
            <FileArchive className="w-4 h-4" />
            <span>{downloading ? 'Membuat ZIP...' : 'Download Paket ZIP Arsip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
