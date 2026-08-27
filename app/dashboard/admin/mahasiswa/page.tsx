'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Plus, Trash2, Edit3, FileSpreadsheet, Building2, GraduationCap, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { initialAccounts, UserAccount, initialProdiList } from '@/lib/mockStore';
import { exportToExcel } from '@/lib/utils/excel';

export default function AdminMahasiswaDatabasePage() {
  // Load Mahasiswa users
  const [mahasiswas, setMahasiswas] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');
          }
        }
      } catch (e) {}
    }
    return initialAccounts.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProdi, setFilterProdi] = useState('semua');
  const [filterAngkatan, setFilterAngkatan] = useState('semua');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMhs, setEditingMhs] = useState<UserAccount | null>(null);

  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState('Studi Nautika');
  const [angkatan, setAngkatan] = useState('2023');
  const [statusAkademik, setStatusAkademik] = useState<'Aktif' | 'PRALA' | 'Magang' | 'Lulus / Alumni'>('Aktif');
  const [email, setEmail] = useState('');

  const saveAllUsers = (updatedMahasiswas: UserAccount[]) => {
    setMahasiswas(updatedMahasiswas);
    try {
      const stored = localStorage.getItem('siakal_user_list');
      let allUsers: UserAccount[] = initialAccounts;
      if (stored) {
        allUsers = JSON.parse(stored);
      }
      const nonMhs = allUsers.filter((u) => u.role !== 'mahasiswa' && u.role !== 'alumni');
      const newList = [...nonMhs, ...updatedMahasiswas];
      localStorage.setItem('siakal_user_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const handleAddMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nim) return;

    const newMhs: UserAccount = {
      id: `mhs-${Date.now()}`,
      fullName,
      email: email || `${nim}@siakal.poltek.ac.id`,
      role: statusAkademik === 'Lulus / Alumni' ? 'alumni' : 'mahasiswa',
      nim,
      usernameOrId: nim,
      initialPassword: 'SIAKAL2026!',
      prodi,
      angkatan: Number(angkatan) || 2023,
      isProfileCompleted: true,
    };

    const updated = [newMhs, ...mahasiswas];
    saveAllUsers(updated);
    setShowAddModal(false);
    setFullName('');
    setNim('');
  };

  const handleSaveEditMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMhs) return;

    const updatedList = mahasiswas.map((m) => (m.id === editingMhs.id ? editingMhs : m));
    saveAllUsers(updatedList);
    setEditingMhs(null);
  };

  const confirmDeleteMahasiswa = () => {
    if (!deleteTargetId) return;
    const updated = mahasiswas.filter((m) => m.id !== deleteTargetId);
    saveAllUsers(updated);
    setDeleteTargetId(null);
  };

  const handleExport = () => {
    exportToExcel(
      [
        {
          sheetName: 'Database Mahasiswa',
          data: filteredMahasiswas.map((m) => ({
            'NIM / NIP': m.nim || m.usernameOrId,
            'Nama Lengkap': m.fullName,
            'Program Studi': m.prodi || '-',
            Angkatan: m.angkatan || 2023,
            Email: m.email,
            Status: m.role === 'alumni' ? 'Alumni' : 'Mahasiswa Aktif',
          })),
        },
      ],
      'Database_Mahasiswa_SIAKAL'
    );
  };

  const filteredMahasiswas = mahasiswas.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nim && m.nim.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === 'semua' || m.prodi === filterProdi;
    const matchAngkatan = filterAngkatan === 'semua' || (m.angkatan && m.angkatan.toString() === filterAngkatan);
    return matchSearch && matchProdi && matchAngkatan;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-4 sm:p-6 border-l-4 border-l-blue-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400 shrink-0" />
            <span>Pusat Database Mahasiswa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Pencarian biodata, NIM, program studi, status akademik, dan ekspor database mahasiswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button onClick={handleExport} className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm border border-slate-300 dark:border-white/10">
            <Download className="w-4 h-4" />
            <span>Ekspor .XLSX</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="flex-1 sm:flex-none glass-button text-xs sm:text-sm font-bold flex items-center justify-center gap-2 py-2.5 px-4 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>+ Data Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa, NIM..."
            className="w-full glass-input pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Prodi:</span>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="glass-input text-xs w-full">
              <option value="semua">Semua Prodi</option>
              <option value="Studi Nautika">Studi Nautika</option>
              <option value="Permesinan Kapal">Permesinan Kapal</option>
              <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
              <option value="Teknologi Rekayasa Pelayaran & TSDP">TSDP</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Angkatan:</span>
            <select value={filterAngkatan} onChange={(e) => setFilterAngkatan(e.target.value)} className="glass-input text-xs w-full">
              <option value="semua">Semua Angkatan</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="glass-panel p-4 sm:p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Daftar Mahasiswa Terdaftar ({filteredMahasiswas.length} Orang)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-4">NIM</th>
                <th className="pb-3 px-4">NAMA LENGKAP & EMAIL</th>
                <th className="pb-3 px-4">PROGRAM STUDI</th>
                <th className="pb-3 px-4">ANGKATAN</th>
                <th className="pb-3 px-4">STATUS AKADEMIK</th>
                <th className="pb-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-medium">
              {filteredMahasiswas.length > 0 ? (
                filteredMahasiswas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-600 dark:text-sky-400">
                      <span className="bg-sky-500/10 dark:bg-sky-500/20 px-2.5 py-1 rounded-lg border border-sky-500/20">
                        {m.nim || m.usernameOrId || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900 dark:text-white">{m.fullName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{m.prodi || '-'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300 font-bold">{m.angkatan || 2023}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          m.role === 'alumni'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-blue-500/15 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {m.role === 'alumni' ? 'Alumni' : 'AKTIF'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingMhs(m)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors"
                          title="Edit Biodata"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(m.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold text-xs">
                    Tidak ditemukan data mahasiswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH DATA MAHASISWA */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 dark:border-white/20 shadow-2xl relative bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" />
                <span>Tambah Mahasiswa Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMahasiswa} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full glass-input text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">NIM (Nomor Induk) *</label>
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 2023001"
                    className="w-full glass-input text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Angkatan *</label>
                  <select value={angkatan} onChange={(e) => setAngkatan(e.target.value)} className="w-full glass-input text-xs">
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Program Studi *</label>
                <select value={prodi} onChange={(e) => setProdi(e.target.value)} className="w-full glass-input text-xs">
                  <option value="Studi Nautika">D3 Studi Nautika</option>
                  <option value="Permesinan Kapal">D3 Permesinan Kapal</option>
                  <option value="Manajemen Transportasi Perairan Daratan">D3 Manajemen Transportasi Perairan Daratan</option>
                  <option value="Teknologi Rekayasa Pelayaran & TSDP">D4 Teknologi Rekayasa Pelayaran & TSDP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Akademik *</label>
                <select value={statusAkademik} onChange={(e) => setStatusAkademik(e.target.value as any)} className="w-full glass-input text-xs">
                  <option value="Aktif">Mahasiswa Aktif</option>
                  <option value="PRALA">Sedang PRALA</option>
                  <option value="Magang">Sedang Magang MTPD</option>
                  <option value="Lulus / Alumni">Lulus / Alumni</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Institusi (Opsional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Opsional (otomatis nim@siakal.poltek.ac.id)"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2 px-5">
                  Simpan Mahasiswa Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA MAHASISWA */}
      {editingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 dark:border-white/20 shadow-2xl relative bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Biodata Mahasiswa</span>
              </h3>
              <button onClick={() => setEditingMhs(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditMahasiswa} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  value={editingMhs.fullName}
                  onChange={(e) => setEditingMhs({ ...editingMhs, fullName: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">NIM *</label>
                  <input
                    type="text"
                    required
                    value={editingMhs.nim || editingMhs.usernameOrId || ''}
                    onChange={(e) => setEditingMhs({ ...editingMhs, nim: e.target.value, usernameOrId: e.target.value })}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Angkatan *</label>
                  <input
                    type="number"
                    value={editingMhs.angkatan || 2023}
                    onChange={(e) => setEditingMhs({ ...editingMhs, angkatan: Number(e.target.value) })}
                    className="w-full glass-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Program Studi *</label>
                <select
                  value={editingMhs.prodi || 'Studi Nautika'}
                  onChange={(e) => setEditingMhs({ ...editingMhs, prodi: e.target.value })}
                  className="w-full glass-input text-xs"
                >
                  <option value="Studi Nautika">D3 Studi Nautika</option>
                  <option value="Permesinan Kapal">D3 Permesinan Kapal</option>
                  <option value="Manajemen Transportasi Perairan Daratan">D3 Manajemen Transportasi Perairan Daratan</option>
                  <option value="Teknologi Rekayasa Pelayaran & TSDP">D4 Teknologi Rekayasa Pelayaran & TSDP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Status Peran</label>
                <select
                  value={editingMhs.role}
                  onChange={(e) => setEditingMhs({ ...editingMhs, role: e.target.value as any })}
                  className="w-full glass-input text-xs"
                >
                  <option value="mahasiswa">Mahasiswa Aktif / PRALA / Magang</option>
                  <option value="alumni">Alumni / Lulusan</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMhs(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
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
          <div className="glass-panel w-full max-w-sm p-6 text-center space-y-4 border border-slate-300 dark:border-white/20 shadow-2xl relative bg-white dark:bg-slate-950">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Apakah Anda yakin ingin menghapus mahasiswa ini dari database SIAKAL?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDeleteMahasiswa}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
