'use client';

import React, { useState } from 'react';
import { Archive, Download, FileSpreadsheet, FileArchive, CheckCircle2 } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';
import { createAcademicArchiveZip } from '@/lib/utils/zip';

export default function AdminArsipPage() {
  const [selectedTahun, setSelectedTahun] = useState('2025/2026');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil');
  const [downloadingZip, setDownloadingZip] = useState(false);

  const handleExportMultiSheetExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Ringkasan Akademik',
          data: [
            { Parameter: 'Tahun Akademik', Value: selectedTahun },
            { Parameter: 'Semester', Value: selectedSemester },
            { Parameter: 'Total Mahasiswa Aktif', Value: 420 },
            { Parameter: 'Total Taruna PRALA', Value: 110 },
            { Parameter: 'Total Mahasiswa Magang MTPD', Value: 85 },
          ],
        },
        {
          sheetName: 'Rekap PRALA',
          data: [
            { NIM: '2101034', Nama: 'Ahmad Fauzi', Prodi: 'Studi Nautika', Kapal: 'KM Kelud', Perusahaan: 'PT PELNI', StatusTRB: 'Terunggah' },
          ],
        },
        {
          sheetName: 'Rekap Magang MTPD',
          data: [
            { Kelompok: 'Kelompok 01', TematMagang: 'PT Pelindo Regional 2', StatusLaporan: 'Pending' },
          ],
        },
      ],
      `Arsip_MultiSheet_SIAKAL_${selectedTahun.replace('/', '_')}_${selectedSemester}`
    );
  };

  const handleExportZip = async () => {
    setDownloadingZip(true);
    try {
      await createAcademicArchiveZip(selectedTahun, selectedSemester, {
        Biodata_Mahasiswa: [{ NIM: '2101034', Nama: 'Ahmad Fauzi', Prodi: 'Studi Nautika' }],
        Bimbingan_PRALA: [{ NIM: '2101034', Progres: '80%', Dosen: 'Capt. Budi Santoso' }],
        Clearance_Out: [{ NIM: '2101034', Status: 'Approved 14/14 Units' }],
        Tracer_Study: [{ NIM: '2001015', Nama: 'Deni Kurniawan', Status: 'Bekerja Sesuai Bidang' }],
      });
    } catch (e) {
      console.error(e);
    }
    setDownloadingZip(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Archive className="w-6 h-6 text-sky-500 dark:text-sky-400" />
          <span>Pusat Arsip Database Akademik, PRALA, Magang & Beasiswa</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          Pilih Tahun Akademik dan Semester untuk mengunduh rekapitulasi data komprehensif dalam format Excel Multi-Sheet atau ZIP.
        </p>
      </div>

      {/* Form Seleksi Periode Arsip */}
      <div className="glass-panel p-6 max-w-2xl mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">Tahun Akademik</label>
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full glass-input"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2026/2027">2026/2027</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full glass-input"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </div>

        {/* Info Box Paket Arsip */}
        <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-2">
          <h4 className="font-extrabold text-xs sm:text-sm text-sky-700 dark:text-sky-300">Rincian Paket Arsip Terintegrasi:</h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>01. Data Biodata Mahasiswa</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>02. Bimbingan PRALA & Log</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>03. Upload Progress TRB PDF</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>04. Clearance Out 14 Unit Permits</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>05. Tracer Study Alumni</span>
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>06. Kepuasan Pengguna Lulusan</span>
            </li>
          </ul>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleExportMultiSheetExcel}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <FileSpreadsheet className="w-4.5 h-4.5 text-emerald-400" />
            <span>Download Multi-Sheet Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportZip}
            disabled={downloadingZip}
            className="w-full sm:w-auto glass-button text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <FileArchive className="w-4.5 h-4.5" />
            <span>{downloadingZip ? 'Mempersiapkan ZIP...' : 'Download Paket ZIP Arsip'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
