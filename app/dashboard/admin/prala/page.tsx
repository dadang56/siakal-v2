'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Search, FileText, CheckCircle2, AlertCircle, Download, ExternalLink, Ship, Building2, User } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminMonitoringPralaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProdi, setFilterProdi] = useState('Semua');

  const [pralaData, setPralaData] = useState([
    {
      id: 'prala-1',
      nim: '2101034',
      nama: 'Ahmad Fauzi',
      prodi: 'Studi Nautika',
      angkatan: 2023,
      perusahaan: 'PT PELNI (Persero)',
      namaKapal: 'KM Kelud',
      tipeKapal: 'Kapal Penumpang (Passenger Vessel)',
      contactPerson: 'Perwira Handoko (Crewing Officer)',
      noHpContact: '081234567890',
      trbStatus: 'TERUNGGAH',
      trbPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      progresBimbingan: '80%',
      pembimbingDosen: 'Capt. Budi Santoso, M.Mar.',
    },
    {
      id: 'prala-2',
      nim: '2102088',
      nama: 'Rizky Ramadhan',
      prodi: 'Permesinan Kapal',
      angkatan: 2023,
      perusahaan: 'PT Meratus Line',
      namaKapal: 'MV Meratus Jaya',
      tipeKapal: 'Kapal Kontainer (Container Ship)',
      contactPerson: 'Perwira Irwan (KKK / Masinis 1)',
      noHpContact: '081987654321',
      trbStatus: 'BELUM_TERUNGGAH',
      trbPdfUrl: '',
      progresBimbingan: '40%',
      pembimbingDosen: 'Hendra Gunawan, M.Mar.E.',
    },
  ]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_prala_admin');
      if (stored) setPralaData(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveState = (updated: any) => {
    setPralaData(updated);
    try {
      localStorage.setItem('siakal_prala_admin', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredPrala = pralaData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.includes(searchQuery) ||
      item.namaKapal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === 'Semua' || item.prodi === filterProdi;
    return matchSearch && matchProdi;
  });

  const handleExportExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Monitoring PRALA',
          data: filteredPrala.map((p) => ({
            NIM: p.nim,
            'Nama Mahasiswa': p.nama,
            'Program Studi': p.prodi,
            Angkatan: p.angkatan,
            'Perusahaan Pelayaran': p.perusahaan,
            'Nama Kapal': p.namaKapal,
            'Tipe Kapal': p.tipeKapal,
            'Contact Person Officer': p.contactPerson,
            'No HP Contact': p.noHpContact,
            'Status TRB': p.trbStatus,
            'Progres Bimbingan': p.progresBimbingan,
            Dosen: p.pembimbingDosen,
          })),
        },
      ],
      'Monitoring_PRALA_1Tahun_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Anchor className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Portal Monitoring PRALA (Praktek Laut 1 Tahun)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Pemantauan Data Kapal, Perusahaan Pelayaran, Perwira Kontak, dan Unggahan TRB PDF Mahasiswa Studi Nautika & Permesinan Kapal.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Download className="w-4 h-4" />
          <span>Ekspor Rekap PRALA (.XLSX)</span>
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
            placeholder="Cari nama, NIM, nama kapal, atau perusahaan..."
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
            <option value="Semua">Semua Prodi PRALA</option>
            <option value="Studi Nautika">Studi Nautika</option>
            <option value="Permesinan Kapal">Permesinan Kapal</option>
          </select>
        </div>
      </div>

      {/* Table Cards List */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Mahasiswa PRALA Aktif ({filteredPrala.length} Mahasiswa)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Mahasiswa</th>
                <th className="pb-3 px-3">Perusahaan & Kapal</th>
                <th className="pb-3 px-3">Contact Person Perwira</th>
                <th className="pb-3 px-3">Status TRB</th>
                <th className="pb-3 px-3">Progres</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredPrala.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{p.nama}</div>
                    <div className="text-xs text-slate-500 font-mono">NIM: {p.nim} &bull; {p.prodi}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{p.perusahaan}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1 mt-0.5">
                      <Ship className="w-3.5 h-3.5 text-amber-500" />
                      <span>{p.namaKapal} ({p.tipeKapal})</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.contactPerson}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">HP: {p.noHpContact}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    {p.trbStatus === 'TERUNGGAH' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>TRB Terunggah</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Belum Upload</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="w-28 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-1">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: p.progresBimbingan }} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{p.progresBimbingan} Selesai</span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {p.trbPdfUrl ? (
                      <a
                        href={p.trbPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-300 border border-sky-500/30 text-xs font-bold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Lihat TRB PDF</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Tidak ada berkas</span>
                    )}
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
