'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Search, FileText, CheckCircle2, AlertCircle, Download, ExternalLink, Ship, Building2, User, UserCheck, Calendar, Clock, AlertTriangle, Eye, X } from 'lucide-react';
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
      tanggalMulaiPrala: '2025-09-01',
      pembimbingDosen: 'Capt. Budi Santoso, M.Mar.',
      reports: [
        { stageNumber: 1, title: 'Laporan TRB 1 (Bulan Ke-3)', deadlineDate: '2025-12-01', uploadedDate: '2025-11-28', isOnTime: true, statusDosen: 'DISENTUJUI', catatanDosen: 'Jurnal harian pelayaran dan olah gerak kapal lengkap.' },
        { stageNumber: 2, title: 'Laporan TRB 2 (Bulan Ke-6)', deadlineDate: '2026-03-01', uploadedDate: '2026-03-05', isOnTime: false, statusDosen: 'DISENTUJUI', catatanDosen: 'Laporan disetujui. Perhatikan ketepatan waktu pelaporan.' },
        { stageNumber: 3, title: 'Laporan TRB 3 (Bulan Ke-9)', deadlineDate: '2026-06-01', uploadedDate: undefined, isOnTime: undefined, statusDosen: 'MENUNGGU_VERIFIKASI', catatanDosen: undefined },
        { stageNumber: 4, title: 'Laporan TRB 4 (Bulan Ke-12)', deadlineDate: '2026-09-01', uploadedDate: undefined, isOnTime: undefined, statusDosen: 'MENUNGGU_VERIFIKASI', catatanDosen: undefined },
      ],
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
      tanggalMulaiPrala: '2025-10-15',
      pembimbingDosen: 'Hendra Gunawan, M.Mar.E.',
      reports: [
        { stageNumber: 1, title: 'Laporan TRB 1 (Bulan Ke-3)', deadlineDate: '2026-01-15', uploadedDate: '2026-01-10', isOnTime: true, statusDosen: 'DISENTUJUI', catatanDosen: 'Logbook dinas jaga mesin lengkap.' },
        { stageNumber: 2, title: 'Laporan TRB 2 (Bulan Ke-6)', deadlineDate: '2026-04-15', uploadedDate: undefined, isOnTime: undefined, statusDosen: 'MENUNGGU_VERIFIKASI', catatanDosen: undefined },
        { stageNumber: 3, title: 'Laporan TRB 3 (Bulan Ke-9)', deadlineDate: '2026-07-15', uploadedDate: undefined, isOnTime: undefined, statusDosen: 'MENUNGGU_VERIFIKASI', catatanDosen: undefined },
        { stageNumber: 4, title: 'Laporan TRB 4 (Bulan Ke-12)', deadlineDate: '2026-10-15', uploadedDate: undefined, isOnTime: undefined, statusDosen: 'MENUNGGU_VERIFIKASI', catatanDosen: undefined },
      ],
    },
  ]);

  // Modal Detail Monitoring State
  const [selectedStudentMonitoring, setSelectedStudentMonitoring] = useState<any | null>(null);

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
          sheetName: 'Monitoring 4 TRB PRALA',
          data: filteredPrala.map((p) => {
            const rep1 = p.reports[0];
            const rep2 = p.reports[1];
            const rep3 = p.reports[2];
            const rep4 = p.reports[3];

            return {
              NIM: p.nim,
              'Nama Mahasiswa': p.nama,
              'Program Studi': p.prodi,
              'Perusahaan Pelayaran': p.perusahaan,
              'Nama Kapal': p.namaKapal,
              'Tanggal Mulai PRALA': p.tanggalMulaiPrala,
              'Dosen Pembimbing': p.pembimbingDosen,
              'Laporan 1 Status': rep1.uploadedDate ? (rep1.isOnTime ? 'On-Time' : 'Terlambat') : 'Belum Upload',
              'Laporan 2 Status': rep2.uploadedDate ? (rep2.isOnTime ? 'On-Time' : 'Terlambat') : 'Belum Upload',
              'Laporan 3 Status': rep3.uploadedDate ? (rep3.isOnTime ? 'On-Time' : 'Terlambat') : 'Belum Upload',
              'Laporan 4 Status': rep4.uploadedDate ? (rep4.isOnTime ? 'On-Time' : 'Terlambat') : 'Belum Upload',
            };
          }),
        },
      ],
      'Monitoring_PRALA_4Laporan_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Portal Monitoring Unit PRALA (Monitoring 4 Laporan TRB)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Pemantauan ketepatan waktu (On-Time vs Terlambat) pelaporan TRB 4 kali per 3 bulan oleh Unit PRALA.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-md cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Ekspor Rekap 4 TRB (.XLSX)</span>
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
            placeholder="Cari nama, NIM, nama kapal, dosen..."
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
          Daftar Mahasiswa PRALA & Progres 4 Tahap Laporan ({filteredPrala.length} Mahasiswa)
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">MAHASISWA & TGL MULAI</th>
                <th className="py-3 px-4">PERUSAHAAN & KAPAL</th>
                <th className="py-3 px-4">DOSEN PEMBIMBING</th>
                <th className="py-3 px-4">STATUS 4 STAGE TRB (3 BULANAN)</th>
                <th className="py-3 px-4 text-center">AKSI MONITORING</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredPrala.map((p) => {
                const uploadedCount = p.reports.filter((r) => r.uploadedDate).length;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900 text-sm">{p.nama}</div>
                      <div className="text-xs text-slate-500 font-mono">NIM: {p.nim} • {p.prodi}</div>
                      <div className="text-[11px] font-bold text-sky-700 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-sky-500" />
                        <span>Mulai PRALA: {p.tanggalMulaiPrala}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                        <span>{p.perusahaan}</span>
                      </div>
                      <div className="text-slate-700 font-semibold flex items-center gap-1.5 mt-0.5">
                        <Ship className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{p.namaKapal}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-indigo-900 flex items-center gap-1.5 bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200 w-fit">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{p.pembimbingDosen || 'Belum Ditetapkan'}</span>
                      </div>
                    </td>

                    {/* 4 STAGE TRB STATUS BADGES */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          {p.reports.map((rep) => (
                            <span
                              key={rep.stageNumber}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${
                                rep.uploadedDate
                                  ? rep.isOnTime
                                    ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30'
                                    : 'bg-red-500/10 text-red-800 border-red-500/30'
                                  : 'bg-slate-100 text-slate-500 border-slate-300'
                              }`}
                              title={`Laporan ${rep.stageNumber} (${rep.deadlineDate}): ${
                                rep.uploadedDate ? (rep.isOnTime ? 'On-Time' : 'Terlambat') : 'Belum Upload'
                              }`}
                            >
                              L{rep.stageNumber}: {rep.uploadedDate ? (rep.isOnTime ? 'On-Time' : 'Late') : 'Belum'}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] font-extrabold text-slate-600">
                          Progres: {uploadedCount}/4 Laporan TRB Selesai ({Math.round((uploadedCount / 4) * 100)}%)
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentMonitoring(p)}
                        className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Detail 4 Laporan</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL MONITORING 4 LAPORAN TRB FOR UNIT PRALA & ADMIN */}
      {selectedStudentMonitoring && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl p-6 sm:p-7 space-y-5 border border-slate-300 shadow-2xl relative bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Anchor className="w-5 h-5 text-sky-500" />
                <span>Monitoring 4 Stage Laporan TRB — {selectedStudentMonitoring.nama}</span>
              </h3>
              <button onClick={() => setSelectedStudentMonitoring(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">NIM & Prodi:</span>
                <span className="font-bold text-slate-900">{selectedStudentMonitoring.nim} • {selectedStudentMonitoring.prodi}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Kapal & Perusahaan:</span>
                <span className="font-bold text-slate-900">{selectedStudentMonitoring.namaKapal} ({selectedStudentMonitoring.perusahaan})</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Dosen Pembimbing:</span>
                <span className="font-bold text-indigo-900">{selectedStudentMonitoring.pembimbingDosen}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-black text-sm text-slate-900">Rincian Status Pelaporan 3 Bulan Sekali:</h4>

              <div className="space-y-3">
                {selectedStudentMonitoring.reports.map((rep: any) => (
                  <div key={rep.stageNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900 text-xs sm:text-sm">{rep.title}</span>
                      {rep.uploadedDate ? (
                        rep.isOnTime ? (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                            🟢 On-Time (Tepat Waktu)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-800 border border-red-500/20">
                            🔴 Terlambat (Late)
                          </span>
                        )
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20">
                          ⚪ Belum Mengunggah
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-semibold text-slate-600">
                      <div>Deadline: <strong className="font-mono text-slate-900">{rep.deadlineDate}</strong></div>
                      <div>Tanggal Upload: <strong className="font-mono text-slate-900">{rep.uploadedDate || '-'}</strong></div>
                      <div>Verifikasi Dosen: <strong className="text-indigo-900">{rep.statusDosen?.replace('_', ' ')}</strong></div>
                    </div>

                    {rep.catatanDosen && (
                      <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-slate-700 italic">
                        Catatan Dosen: &ldquo;{rep.catatanDosen}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedStudentMonitoring(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Tutup Monitoring
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
