'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { initialProdiList } from '@/lib/mockStore';

export default function AdminProdiPage() {
  const [prodis, setProdis] = useState(initialProdiList);
  const [showAddModal, setShowAddModal] = useState(false);
  const [namaProdi, setNamaProdi] = useState('');
  const [jenjang, setJenjang] = useState<'Diploma III' | 'Diploma IV'>('Diploma III');
  const [kodeProdi, setKodeProdi] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_prodi_list');
      if (stored) setProdis(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveProdis = (newList: any[]) => {
    setProdis(newList);
    try {
      localStorage.setItem('siakal_prodi_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const handleAddProdi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProdi || !kodeProdi) return;
    const updated = [...prodis, { id: `prodi-${Date.now()}`, nama: namaProdi, jenjang, kode: kodeProdi }];
    saveProdis(updated);
    setNamaProdi('');
    setKodeProdi('');
    setShowAddModal(false);
  };

  const handleDeleteProdi = (id: string) => {
    const updated = prodis.filter((p) => p.id !== id);
    saveProdis(updated);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Master Data Program Studi & Angkatan (2000 - 2300)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Kelola jenjang program studi, nama prodi, kode prodi, dan range angkatan akademik.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Plus className="w-4 h-4" />
          <span>Tambah Program Studi</span>
        </button>
      </div>

      {/* Tabel Program Studi */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">Daftar Program Studi Aktif</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-3">Jenjang</th>
                <th className="pb-3 px-3">Nama Program Studi</th>
                <th className="pb-3 px-3">Kode Prodi</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {prodis.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      {p.jenjang}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{p.nama}</td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-300 font-semibold">{p.kode}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteProdi(p.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Hapus Prodi"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box Angkatan */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          <span>Range Tahun Angkatan Otomatis</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Sistem secara otomatis telah menyediakan range Tahun Angkatan dari <strong className="text-slate-900 dark:text-white">Tahun 2000 s/d 2300</strong> untuk pemetaan biodata mahasiswa dan penelusuran tracer study alumni.
        </p>
      </div>

      {/* Modal Add Prodi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tambah Program Studi Baru</h3>

            <form onSubmit={handleAddProdi} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Program Studi</label>
                <input
                  type="text"
                  required
                  value={namaProdi}
                  onChange={(e) => setNamaProdi(e.target.value)}
                  placeholder="Contoh: Studi Nautika"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Jenjang Pendidikan</label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value as any)}
                  className="w-full glass-input"
                >
                  <option value="Diploma III">Diploma III</option>
                  <option value="Diploma IV">Diploma IV</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Kode Prodi</label>
                <input
                  type="text"
                  required
                  value={kodeProdi}
                  onChange={(e) => setKodeProdi(e.target.value)}
                  placeholder="Contoh: PRODI-NT-01"
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
                  Simpan Prodi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
