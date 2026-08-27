'use client';

import React, { useState } from 'react';
import { Trophy, CheckCircle2, XCircle, Download, ExternalLink, Plus } from 'lucide-react';
import { initialAchievements, Achievement } from '@/lib/mockStore';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminPrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [showAddModal, setShowAddModal] = useState(false);

  const [mhsNama, setMhsNama] = useState('');
  const [namaEvent, setNamaEvent] = useState('');
  const [jenisPrestasi, setJenisPrestasi] = useState<'Akademik' | 'Non-Akademik'>('Akademik');
  const [tingkat, setTingkat] = useState<'Lokal' | 'Regional' | 'Nasional' | 'Internasional'>('Nasional');
  const [capaian, setCapaian] = useState('Juara 1');
  const [penyelenggara, setPenyelenggara] = useState('');

  const handleSetStatus = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setAchievements(achievements.map((a) => (a.id === id ? { ...a, statusVerifikasi: status } : a)));
  };

  const handleAddDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      mahasiswaId: 'mhs-direct',
      mahasiswaNama: mhsNama,
      namaEvent,
      jenisPrestasi,
      tingkat,
      capaian,
      penyelenggara,
      tanggalKegiatan: new Date().toISOString().split('T')[0],
      fileBuktiUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      statusVerifikasi: 'APPROVED',
    };

    setAchievements([...achievements, newAch]);
    setShowAddModal(false);
    setMhsNama('');
    setNamaEvent('');
  };

  const handleExportExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Verifikasi Prestasi',
          data: achievements.map((a) => ({
            'Nama Mahasiswa': a.mahasiswaNama,
            'Nama Event': a.namaEvent,
            Kategori: a.jenisPrestasi,
            Tingkat: a.tingkat,
            Capaian: a.capaian,
            Penyelenggara: a.penyelenggara,
            'Status Verifikasi': a.statusVerifikasi,
          })),
        },
      ],
      'Rekap_Prestasi_Mahasiswa_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            <span>Verifikasi & Input Prestasi Mahasiswa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Input langsung prestasi mahasiswa atau verifikasi pengajuan mandiri untuk dipajang di Dashboard Hall of Fame.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 font-bold text-xs sm:text-sm shadow-sm border border-slate-300 dark:border-white/10 flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>Input Prestasi Direct</span>
          </button>
        </div>
      </div>

      {/* Table List Prestasi */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Usulan & Data Prestasi ({achievements.length} Data)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-3">Mahasiswa</th>
                <th className="pb-3 px-3">Nama Event</th>
                <th className="pb-3 px-3">Kategori</th>
                <th className="pb-3 px-3">Tingkat</th>
                <th className="pb-3 px-3">Capaian</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3 text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {achievements.map((a) => (
                <tr key={a.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white text-sm">{a.mahasiswaNama}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">{a.namaEvent}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      {a.jenisPrestasi}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">{a.tingkat}</td>
                  <td className="py-3.5 px-3 font-bold text-amber-600 dark:text-amber-400">{a.capaian}</td>
                  <td className="py-3.5 px-3">
                    {a.statusVerifikasi === 'APPROVED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Terverifikasi
                      </span>
                    ) : a.statusVerifikasi === 'REJECTED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30">
                        Ditolak
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleSetStatus(a.id, 'APPROVED')}
                      className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm"
                      title="Setuju & Pajang di Hall of Fame"
                    >
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleSetStatus(a.id, 'REJECTED')}
                      className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-sm"
                      title="Tolak Usulan"
                    >
                      <XCircle className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Direct */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Input Prestasi Mahasiswa Direct</h3>

            <form onSubmit={handleAddDirect} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Mahasiswa</label>
                <input
                  type="text"
                  required
                  value={mhsNama}
                  onChange={(e) => setMhsNama(e.target.value)}
                  placeholder="Nama Lengkap Mahasiswa"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Event / Kompetisi</label>
                <input
                  type="text"
                  required
                  value={namaEvent}
                  onChange={(e) => setNamaEvent(e.target.value)}
                  placeholder="Nama Event Kompetisi"
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Kategori</label>
                  <select
                    value={jenisPrestasi}
                    onChange={(e) => setJenisPrestasi(e.target.value as any)}
                    className="w-full glass-input"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Non-Akademik">Non-Akademik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tingkat</label>
                  <select
                    value={tingkat}
                    onChange={(e) => setTingkat(e.target.value as any)}
                    className="w-full glass-input"
                  >
                    <option value="Lokal">Lokal</option>
                    <option value="Regional">Regional</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Internasional">Internasional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Capaian Juara</label>
                <input
                  type="text"
                  required
                  value={capaian}
                  onChange={(e) => setCapaian(e.target.value)}
                  placeholder="Contoh: Juara 1 / Emas"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Penyelenggara</label>
                <input
                  type="text"
                  required
                  value={penyelenggara}
                  onChange={(e) => setPenyelenggara(e.target.value)}
                  placeholder="Contoh: BPSDM Perhub / Kemendikbud"
                  className="w-full glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold">
                  Simpan & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
