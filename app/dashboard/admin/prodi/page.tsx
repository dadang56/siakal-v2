'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit3, CheckCircle2, AlertTriangle } from 'lucide-react';
import { initialProdiList } from '@/lib/mockStore';

export default function AdminProdiPage() {
  const [prodis, setProdis] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_prodi_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return initialProdiList;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingProdi, setEditingProdi] = useState<any | null>(null);

  // Form State
  const [namaProdi, setNamaProdi] = useState('');
  const [jenjang, setJenjang] = useState<'Diploma III' | 'Diploma IV'>('Diploma III');
  const [kodeProdi, setKodeProdi] = useState('');

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

  const handleSaveEditProdi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProdi) return;
    const updatedList = prodis.map((p) => (p.id === editingProdi.id ? editingProdi : p));
    saveProdis(updatedList);
    setEditingProdi(null);
  };

  const confirmDeleteProdi = () => {
    if (!deleteTargetId) return;
    const updated = prodis.filter((p) => p.id !== deleteTargetId);
    saveProdis(updated);
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Daftar Program Studi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Kelola jenjang pendidikan, nama program studi, dan kode prodi institusi.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg py-2.5 px-4">
          <Plus className="w-4 h-4" />
          <span>+ Tambah Program Studi</span>
        </button>
      </div>

      {/* Tabel Program Studi */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Daftar Program Studi Aktif ({prodis.length} Prodi)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-4">Jenjang</th>
                <th className="pb-3 px-4">Nama Program Studi</th>
                <th className="pb-3 px-4">Kode Prodi</th>
                <th className="pb-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {prodis.map((p) => (
                <tr key={p.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      {p.jenjang}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white text-sm whitespace-nowrap">{p.nama}</td>
                  <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300 font-bold whitespace-nowrap">{p.kode}</td>
                  <td className="py-4 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => setEditingProdi({ ...p })}
                      className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors inline-flex items-center border border-sky-500/20"
                      title="Edit Data Prodi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(p.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors inline-flex items-center"
                      title="Hapus Prodi"
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

      {/* Info Box Angkatan */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1.5">
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

            <form onSubmit={handleAddProdi} className="space-y-3.5 text-xs sm:text-sm">
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
                  className="w-full glass-input font-bold"
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
                  className="w-full glass-input font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
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

      {/* Modal Edit Prodi */}
      {editingProdi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-sky-500" />
              <span>Edit Data Program Studi</span>
            </h3>

            <form onSubmit={handleSaveEditProdi} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Program Studi</label>
                <input
                  type="text"
                  required
                  value={editingProdi.nama}
                  onChange={(e) => setEditingProdi({ ...editingProdi, nama: e.target.value })}
                  className="w-full glass-input font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Jenjang Pendidikan</label>
                <select
                  value={editingProdi.jenjang}
                  onChange={(e) => setEditingProdi({ ...editingProdi, jenjang: e.target.value })}
                  className="w-full glass-input font-bold"
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
                  value={editingProdi.kode}
                  onChange={(e) => setEditingProdi({ ...editingProdi, kode: e.target.value })}
                  className="w-full glass-input font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProdi(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI HAPUS */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-sm p-6 space-y-4 shadow-2xl border border-red-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Prodi</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin menghapus Program Studi ini? Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteProdi}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
