'use client';

import React, { useState } from 'react';
import { Trophy, Plus, CheckCircle2, XCircle, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { initialAchievements, Achievement } from '@/lib/mockStore';
import { exportToExcel } from '@/lib/utils/excel';
import { Modal } from '@/components/Modal';

export default function AdminPrestasiPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mahasiswaNama, setMahasiswaNama] = useState('');
  const [namaEvent, setNamaEvent] = useState('');
  const [jenisPrestasi, setJenisPrestasi] = useState<'Akademik' | 'Non-Akademik'>('Akademik');
  const [tingkat, setTingkat] = useState<'Lokal' | 'Regional' | 'Nasional' | 'Internasional'>('Nasional');
  const [capaian, setCapaian] = useState('Juara 1');

  const handleAddDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mahasiswaNama || !namaEvent) return;
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      mahasiswaId: 'user-mhs-1',
      mahasiswaNama,
      namaEvent,
      jenisPrestasi,
      tingkat,
      capaian,
      penyelenggara: 'Panitia Penyelenggara',
      tanggalKegiatan: new Date().toISOString().split('T')[0],
      fileBuktiUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      statusVerifikasi: 'APPROVED',
    };
    setAchievements([...achievements, newAch]);
    setMahasiswaNama('');
    setNamaEvent('');
    setIsModalOpen(false);
  };

  const handleSetStatus = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setAchievements(achievements.map((a) => (a.id === id ? { ...a, statusVerifikasi: newStatus } : a)));
  };

  const handleExportExcel = () => {
    const exportData = achievements.map((a) => ({
      'Nama Mahasiswa': a.mahasiswaNama,
      'Nama Event/Lomba': a.namaEvent,
      'Jenis Prestasi': a.jenisPrestasi,
      'Tingkat': a.tingkat,
      'Capaian': a.capaian,
      'Penyelenggara': a.penyelenggara,
      'Tanggal': a.tanggalKegiatan,
      'Status Verifikasi': a.statusVerifikasi,
    }));
    exportToExcel([{ sheetName: 'Data Prestasi Mahasiswa', data: exportData }], 'SIAKAL_Data_Prestasi_Mahasiswa');
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Pencatatan & Verifikasi Prestasi Mahasiswa</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Input langsung prestasi mahasiswa atau verifikasi pengajuan mandiri untuk dipajang di Dashboard Hall of Fame.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExportExcel} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5">
            <Plus className="w-4 h-4" />
            <span>Input Prestasi Direct</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Pengajuan & Record Prestasi</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Mahasiswa</th>
                <th className="pb-3 px-2">Nama Event</th>
                <th className="pb-3 px-2">Kategori</th>
                <th className="pb-3 px-2">Tingkat</th>
                <th className="pb-3 px-2">Capaian</th>
                <th className="pb-3 px-2">Status</th>
                <th className="pb-3 px-2 text-right">Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {achievements.map((ach) => (
                <tr key={ach.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-bold text-white">{ach.mahasiswaNama}</td>
                  <td className="py-3 px-2 text-slate-300">{ach.namaEvent}</td>
                  <td className="py-3 px-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/20 text-sky-300 font-semibold">
                      {ach.jenisPrestasi}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{ach.tingkat}</td>
                  <td className="py-3 px-2 font-bold text-amber-400">{ach.capaian}</td>
                  <td className="py-3 px-2">
                    {ach.statusVerifikasi === 'APPROVED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold">
                        Terverifikasi
                      </span>
                    )}
                    {ach.statusVerifikasi === 'REJECTED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300 font-bold">
                        Ditolak
                      </span>
                    )}
                    {ach.statusVerifikasi === 'Pending' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-right space-x-1">
                    <button
                      onClick={() => handleSetStatus(ach.id, 'APPROVED')}
                      className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                      title="Setuju (Approve)"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSetStatus(ach.id, 'REJECTED')}
                      className="p-1 rounded bg-red-600 hover:bg-red-500 text-white"
                      title="Tolak"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Direct */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Prestasi Mahasiswa (Direct Admin)">
        <form onSubmit={handleAddDirect} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Mahasiswa *</label>
            <input
              type="text"
              required
              value={mahasiswaNama}
              onChange={(e) => setMahasiswaNama(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Lomba / Event *</label>
            <input
              type="text"
              required
              value={namaEvent}
              onChange={(e) => setNamaEvent(e.target.value)}
              placeholder="Contoh: National Maritime Debate Championship"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">Jenis Prestasi</label>
              <select
                value={jenisPrestasi}
                onChange={(e: any) => setJenisPrestasi(e.target.value)}
                className="w-full glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Akademik">Akademik</option>
                <option value="Non-Akademik">Non-Akademik</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Tingkat</label>
              <select
                value={tingkat}
                onChange={(e: any) => setTingkat(e.target.value)}
                className="w-full glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Lokal">Lokal</option>
                <option value="Regional">Regional</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Capaian / Juara</label>
            <input
              type="text"
              value={capaian}
              onChange={(e) => setCapaian(e.target.value)}
              placeholder="Contoh: Juara 1 / Medali Emas"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs">
              Simpan & Publikasikan ke Hall of Fame
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
