'use client';

import React, { useState } from 'react';
import { Building2, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function MasterProdiAngkatanPage() {
  const [prodis, setProdis] = useState([
    { id: '1', jenjang: 'Diploma III', namaProdi: 'Studi Nautika', kodeProdi: 'PRODI-NT-01' },
    { id: '2', jenjang: 'Diploma III', namaProdi: 'Permesinan Kapal', kodeProdi: 'PRODI-PK-02' },
    { id: '3', jenjang: 'Diploma III', namaProdi: 'Manajemen Transportasi Perairan Daratan', kodeProdi: 'PRODI-MTPD-03' },
    { id: '4', jenjang: 'Diploma IV', namaProdi: 'Teknik Transportasi SDP', kodeProdi: 'PRODI-TSDP-04' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jenjang, setJenjang] = useState('Diploma III');
  const [namaProdi, setNamaProdi] = useState('');
  const [kodeProdi, setKodeProdi] = useState('');

  const handleAddProdi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProdi || !kodeProdi) return;
    setProdis([
      ...prodis,
      { id: `prodi-${Date.now()}`, jenjang, namaProdi, kodeProdi },
    ]);
    setNamaProdi('');
    setKodeProdi('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-400" />
            <span>Master Data Program Studi & Angkatan (2000 - 2300)</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Kelola jenjang program studi, nama prodi, kode prodi, dan range angkatan akademik.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Tambah Program Studi</span>
        </button>
      </div>

      {/* Program Studi Table */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Daftar Program Studi Terdaftar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Jenjang</th>
                <th className="pb-3 px-2">Nama Program Studi</th>
                <th className="pb-3 px-2">Kode Prodi</th>
                <th className="pb-3 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {prodis.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300">
                      {p.jenjang}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-white">{p.namaProdi}</td>
                  <td className="py-3 px-2 text-slate-400 font-mono">{p.kodeProdi}</td>
                  <td className="py-3 px-2 text-right">
                    <button
                      onClick={() => setProdis(prodis.filter((x) => x.id !== p.id))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Range Angkatan Info */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Range Tahun Angkatan Terkonfigurasi</span>
        </h3>
        <p className="text-xs text-slate-300">
          Sistem secara otomatis telah menyediakan range Tahun Angkatan dari <strong>Tahun 2000 s/d 2300</strong> untuk pemetaan biodata mahasiswa dan penelusuran tracer study alumni.
        </p>
      </div>

      {/* Modal Add Prodi */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Program Studi Baru">
        <form onSubmit={handleAddProdi} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Jenjang Program</label>
            <select
              value={jenjang}
              onChange={(e) => setJenjang(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="Diploma III">Diploma III</option>
              <option value="Diploma IV">Diploma IV</option>
              <option value="Sarjana Terapan">Sarjana Terapan</option>
              <option value="Magister Terapan">Magister Terapan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Program Studi *</label>
            <input
              type="text"
              required
              value={namaProdi}
              onChange={(e) => setNamaProdi(e.target.value)}
              placeholder="Contoh: Studi Nautika"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Kode Prodi *</label>
            <input
              type="text"
              required
              value={kodeProdi}
              onChange={(e) => setKodeProdi(e.target.value)}
              placeholder="Contoh: PRODI-NT-01"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs">
              Simpan Program Studi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
