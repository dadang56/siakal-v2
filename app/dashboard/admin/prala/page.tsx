'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Search, FileText, CheckCircle2, AlertCircle, Download, ExternalLink, Ship, Building2, User, UserCheck } from 'lucide-react';
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

  const filteredPrala = pralaData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.includes(searchQuery) ||
      item.namaKapal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pembimbingDosen.toLowerCase().includes(searchQuery.toLowerCase());
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
            'Dosen Pembimbing PRALA': p.pembimbingDosen,
          })),
        },
      ],
      'Monitoring_PRALA_1Tahun_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Portal Monitoring PRALA (Praktek Laut 1 Tahun)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Pemantauan Data Kapal, Perusahaan Pelayaran, Perwira Kontak, Dosen Pembimbing, dan TRB PDF Mahasiswa.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-md cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Ekspor Rekap PRALA (.XLSX)</span>
        </button>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIM, nama kapal, atau perusahaan..."
            className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold bg-slate-100/90 border-slate-300 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">Filter Prodi:</span>
          <select
            value={filterProdi}
            onChange={(e) => setFilterProdi(e.target.value)}
            className="glass-input text-xs sm:text-sm font-bold bg-slate-100/90 border-slate-300 text-slate-900"
          >
            <option value="Semua">Semua Prodi PRALA</option>
            <option value="Studi Nautika">Studi Nautika</option>
            <option value="Permesinan Kapal">Permesinan Kapal</option>
          </select>
        </div>
      </div>

      {/* Table Cards List */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide">
          Daftar Mahasiswa PRALA Aktif ({filteredPrala.length} Mahasiswa)
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">MAHASISWA</th>
                <th className="py-3 px-4">PERUSAHAAN & KAPAL</th>
                <th className="py-3 px-4">DOSEN PEMBIMBING</th>
                <th className="py-3 px-4">CONTACT PERWIRA</th>
                <th className="py-3 px-4">STATUS TRB</th>
                <th className="py-3 px-4">PROGRES</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredPrala.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900 text-sm">{p.nama}</div>
                    <div className="text-xs text-slate-500 font-mono">NIM: {p.nim} &bull; {p.prodi}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sky-700 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>{p.perusahaan}</span>
                    </div>
                    <div className="text-slate-800 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Ship className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{p.namaKapal} ({p.tipeKapal})</span>
                    </div>
                  </td>

                  {/* DOSEN PEMBIMBING DISPLAY COLUMN */}
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-indigo-900 flex items-center gap-1.5 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200 w-fit">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{p.pembimbingDosen || 'Belum Ditetapkan'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{p.contactPerson}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">HP: {p.noHpContact}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {p.trbStatus === 'TERUNGGAH' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>TRB Terunggah</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Belum Upload</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: p.progresBimbingan }} />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-600">{p.progresBimbingan} Selesai</span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {p.trbPdfUrl ? (
                      <a
                        href={p.trbPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
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
