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
      // Remove all mahasiswas/alumnis and append updated
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
          sheetName: 'Database Mahasiswa & Taruna',
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
      'Database_Mahasiswa_Taruna_SIAKAL'
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
      <div className="glass-panel p-6 border-l-4 border-l-blue-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            <span>Pusat Database Mahasiswa & Taruna</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-semibold">
            Pencarian biodata, NIM, program studi, status akademik, dan ekspor database mahasiswa.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleExport} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm border border-slate-300 dark:border-white/10">
            <Download className="w-4 h-4" />
            <span>Ekspor .XLSX</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-2.5 px-4 shadow-lg">
            <Plus className="w-4 h-4" />
            <span>+ Tambah Data Mahasiswa</span>
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

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Prodi:</span>
            <select value={filterProdi} onChange={(e) => setFilterProdi(e.target.value)} className="glass-input text-xs">
              <option value="semua">Semua Prodi</option>
              <option value="Studi Nautika">Studi Nautika</option>
              <option value="Permesinan Kapal">Permesinan Kapal</option>
              <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
              <option value="Teknologi Rekayasa Pelayaran & TSDP">TSDP</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Angkatan:</span>
            <select value={filterAngkatan} onChange={(e) => setFilterAngkatan(e.target.value)} className="glass-input text-xs">
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
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mb-4">
          Daftar Mahasiswa & Taruna Terdaftar ({filteredMahasiswas.length} Orang)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-4">NIM</th>
                <th className="pb-3 px-4">Nama Lengkap & Email</th>
                <th className="pb-3 px-4">Program Studi</th>
                <th className="pb-3 px-4">Angkatan</th>
                <th className="pb-3 px-4">Status Akademik</th>
                <th className="pb-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredMahasiswas.map((m) => (
                <tr key={m.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 text-xs">
                      {m.nim || m.usernameOrId || '-'}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">{m.fullName}</div>
                    <div className="text-xs text-slate-500 font-mono font-medium">{m.email}</div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-slate-800 dark:text-slate-200 font-bold">
                    {m.prodi || 'Studi Nautika'}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap font-mono font-bold text-slate-600 dark:text-slate-300">
                    {m.angkatan || 2023}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                      m.role === 'alumni'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                        : 'bg-sky-500/10 text-sky-600 border-sky-500/30'
                    }`}>
                      {m.role === 'alumni' ? 'Lulus / Alumni' : 'Aktif'}
                    </span>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-right space-x-1.5">
                    <button
                      onClick={() => setEditingMhs({ ...m })}
                      className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 transition-colors inline-flex items-center border border-sky-500/20"
                      title="Edit Biodata Mahasiswa"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(m.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors inline-flex items-center"
                      title="Hapus Data Mahasiswa"
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

      {/* Modal Add Mahasiswa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tambah Data Mahasiswa Baru</h3>

            <form onSubmit={handleAddMahasiswa} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Lengkap Mahasiswa / Taruna</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi, A.Md.Tra."
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">NIM (ID Masuk Log In)</label>
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 2101034"
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tahun Angkatan</label>
                  <input
                    type="number"
                    required
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Program Studi</label>
                <select value={prodi} onChange={(e) => setProdi(e.target.value)} className="w-full glass-input font-semibold">
                  <option value="Studi Nautika">Studi Nautika</option>
                  <option value="Permesinan Kapal">Permesinan Kapal</option>
                  <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
                  <option value="Teknologi Rekayasa Pelayaran & TSDP">TSDP</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Email Official</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mahasiswa@siakal.poltek.ac.id"
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
                  Simpan Mahasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Mahasiswa */}
      {editingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit Biodata Mahasiswa</h3>

            <form onSubmit={handleSaveEditMahasiswa} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Lengkap Mahasiswa</label>
                <input
                  type="text"
                  required
                  value={editingMhs.fullName}
                  onChange={(e) => setEditingMhs({ ...editingMhs, fullName: e.target.value })}
                  className="w-full glass-input font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">NIM</label>
                  <input
                    type="text"
                    required
                    value={editingMhs.nim || editingMhs.usernameOrId || ''}
                    onChange={(e) => setEditingMhs({ ...editingMhs, nim: e.target.value, usernameOrId: e.target.value })}
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Angkatan</label>
                  <input
                    type="number"
                    required
                    value={editingMhs.angkatan || 2023}
                    onChange={(e) => setEditingMhs({ ...editingMhs, angkatan: Number(e.target.value) })}
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Program Studi</label>
                <select
                  value={editingMhs.prodi || 'Studi Nautika'}
                  onChange={(e) => setEditingMhs({ ...editingMhs, prodi: e.target.value })}
                  className="w-full glass-input font-semibold"
                >
                  <option value="Studi Nautika">Studi Nautika</option>
                  <option value="Permesinan Kapal">Permesinan Kapal</option>
                  <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
                  <option value="Teknologi Rekayasa Pelayaran & TSDP">TSDP</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMhs(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Data Mahasiswa</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin menghapus data Mahasiswa ini?
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
                onClick={confirmDeleteMahasiswa}
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
