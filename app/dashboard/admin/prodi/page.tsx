'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Plus, Trash2, Edit3, AlertTriangle, Search, Download } from 'lucide-react';
import { initialProdiList } from '@/lib/mockStore';
import { exportToExcel } from '@/lib/utils/excel';

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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenjang, setFilterJenjang] = useState('semua');
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

  const handleExportProdi = () => {
    exportToExcel(
      [
        {
          sheetName: 'Daftar Prodi',
          data: filteredProdis.map((p) => ({
            'Kode Prodi': p.kode,
            'Nama Program Studi': p.nama,
            Jenjang: p.jenjang,
          })),
        },
      ],
      'Daftar_Prodi_SIAKAL'
    );
  };

  const filteredProdis = prodis.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJenjang = filterJenjang === 'semua' || p.jenjang === filterJenjang;
    return matchSearch && matchJenjang;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Daftar Program Studi</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola jenjang pendidikan, nama program studi, dan kode prodi institusi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportProdi} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm transition-all cursor-pointer">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor .XLSX</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Tambah Program Studi</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Bar Card */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari prodi atau kode..."
            className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100/90 border-slate-300"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 shrink-0">Filter Jenjang:</span>
          <select
            value={filterJenjang}
            onChange={(e) => setFilterJenjang(e.target.value)}
            className="glass-input text-xs font-bold py-2 px-3 rounded-xl bg-slate-100/90 border-slate-300 text-slate-900"
          >
            <option value="semua">Semua Jenjang</option>
            <option value="Diploma III">Diploma III (D3)</option>
            <option value="Diploma IV">Diploma IV (D4)</option>
          </select>
        </div>
      </div>

      {/* 3. Clean & Uniform Table Card */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 tracking-wide">
            Daftar Program Studi Aktif ({filteredProdis.length} Prodi)
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">JENJANG</th>
                <th className="py-3 px-4">NAMA PROGRAM STUDI</th>
                <th className="py-3 px-4">KODE PRODI</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredProdis.length > 0 ? (
                filteredProdis.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-sky-500/10 text-sky-700 border border-sky-500/20">
                        {p.jenjang}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm whitespace-nowrap">
                      {p.nama}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-extrabold text-slate-600 text-xs whitespace-nowrap">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                        {p.kode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingProdi({ ...p })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors cursor-pointer"
                          title="Edit Data Prodi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Hapus Prodi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-semibold text-xs">
                    Tidak ada data program studi yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH PRODI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-500" />
                <span>Tambah Program Studi Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProdi} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Program Studi *</label>
                <input
                  type="text"
                  required
                  value={namaProdi}
                  onChange={(e) => setNamaProdi(e.target.value)}
                  placeholder="Contoh: Studi Nautika"
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                <select
                  value={jenjang}
                  onChange={(e) => setJenjang(e.target.value as any)}
                  className="w-full glass-input text-xs font-semibold"
                >
                  <option value="Diploma III">Diploma III (D3)</option>
                  <option value="Diploma IV">Diploma IV (D4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode Prodi (Unik) *</label>
                <input
                  type="text"
                  required
                  value={kodeProdi}
                  onChange={(e) => setKodeProdi(e.target.value)}
                  placeholder="Contoh: PRODI-NT-01"
                  className="w-full glass-input text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2 px-5">
                  Simpan Program Studi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PRODI */}
      {editingProdi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Program Studi</span>
              </h3>
              <button onClick={() => setEditingProdi(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditProdi} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Program Studi *</label>
                <input
                  type="text"
                  required
                  value={editingProdi.nama}
                  onChange={(e) => setEditingProdi({ ...editingProdi, nama: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Jenjang Pendidikan *</label>
                <select
                  value={editingProdi.jenjang}
                  onChange={(e) => setEditingProdi({ ...editingProdi, jenjang: e.target.value })}
                  className="w-full glass-input text-xs font-semibold"
                >
                  <option value="Diploma III">Diploma III (D3)</option>
                  <option value="Diploma IV">Diploma IV (D4)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kode Prodi *</label>
                <input
                  type="text"
                  required
                  value={editingProdi.kode}
                  onChange={(e) => setEditingProdi({ ...editingProdi, kode: e.target.value })}
                  className="w-full glass-input text-xs font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProdi(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2 px-5">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 text-center space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Prodi</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Apakah Anda yakin ingin menghapus Program Studi ini dari database institusi?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDeleteProdi}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Prodi
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
