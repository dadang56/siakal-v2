'use client';

import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Plus, Trash2, CheckCircle2, UserCheck, Search } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';
import { readExcelFile, downloadUserImportTemplate, exportToExcel } from '@/lib/utils/excel';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');

  // Excel Import state
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Single Add User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserAccount['role']>('mahasiswa');
  const [newNim, setNewNim] = useState('');
  const [newNip, setNewNip] = useState('');
  const [newProdi, setNewProdi] = useState('Studi Nautika');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_user_list');
      if (stored) setUsers(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const saveUsers = (newList: UserAccount[]) => {
    setUsers(newList);
    try {
      localStorage.setItem('siakal_user_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
  };

  const handleDownloadTemplate = () => {
    downloadUserImportTemplate();
  };

  const handleExcelFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await readExcelFile(file);
      if (parsedData.length > 0) {
        setImportedPreview(parsedData);
        setShowImportModal(true);
      }
    } catch (err) {
      alert('Gagal membaca file Excel. Pastikan format file .xlsx/.xls sesuai template.');
    }
  };

  const handleConfirmBatchImport = () => {
    const newAccounts: UserAccount[] = importedPreview.map((row, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      email: row['Email'] || `user${idx}@siakal.poltek.ac.id`,
      fullName: row['Nama Lengkap'] || 'Pengguna Baru',
      role: (row['Role']?.toString().toLowerCase().replace(' ', '_') as any) || 'mahasiswa',
      nim: row['Username/NIM/NIP']?.toString(),
      nip: row['Username/NIM/NIP']?.toString(),
      prodi: row['Prodi'],
      isProfileCompleted: true,
    }));

    const updated = [...users, ...newAccounts];
    saveUsers(updated);
    setShowImportModal(false);
    setImportedPreview([]);
    alert(`Berhasil mengimpor ${newAccounts.length} akun pengguna baru ke sistem!`);
  };

  const handleAddSingleUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      nim: newNim,
      nip: newNip,
      prodi: newProdi,
      isProfileCompleted: true,
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    setShowAddModal(false);
    setNewFullName('');
    setNewEmail('');
  };

  const handleExportUsers = () => {
    exportToExcel(
      [
        {
          sheetName: 'Database User SIAKAL',
          data: filteredUsers.map((u) => ({
            'Nama Lengkap': u.fullName,
            Email: u.email,
            Role: u.role,
            NIM: u.nim || '-',
            NIP: u.nip || '-',
            Prodi: u.prodi || '-',
          })),
        },
      ],
      'Database_User_SIAKAL_V2'
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.nim && u.nim.includes(searchQuery)) ||
      (u.nip && u.nip.includes(searchQuery));
    const matchRole = filterRole === 'semua' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Pusat Manajemen User & Import Data Excel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Kelola seluruh akun pengguna (Admin, Mahasiswa, Dosen, Pembimbing Lapangan, Alumni, & 14 Unit Approver). Buat akun massal via Impor Excel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleDownloadTemplate} className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-sky-600 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm border border-slate-300 dark:border-white/10">
            <Download className="w-4 h-4" />
            <span>Unduh Template Excel</span>
          </button>

          <label className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md">
            <Upload className="w-4 h-4" />
            <span>Impor Massal (Excel)</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelFileUpload} className="hidden" />
          </label>

          <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Tambah User</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, NIM, NIP..."
            className="w-full glass-input pl-10 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">Filter Peran:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="glass-input text-xs sm:text-sm"
          >
            <option value="semua">Semua Peran</option>
            <option value="admin">Admin</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
            <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
            <option value="alumni">Alumni</option>
            <option value="unit_approver">Unit Approver</option>
          </select>

          <button onClick={handleExportUsers} className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
            Ekspor .XLSX
          </button>
        </div>
      </div>

      {/* Table List User */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Akun Terdaftar ({filteredUsers.length} Users)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-3">Nama Lengkap</th>
                <th className="pb-3 px-3">Email / NIM / NIP</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Prodi / Unit</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-3 font-extrabold text-slate-900 dark:text-white text-sm">
                    {u.fullName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-mono font-medium">
                    {u.email} {u.nim ? `(${u.nim})` : u.nip ? `(${u.nip})` : ''}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                    {u.prodi || u.namaLengkapGelar || '-'}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Hapus Akun"
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

      {/* Modal Import Excel Preview */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] flex flex-col p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Pratinjau Data Impor Excel ({importedPreview.length} Baris Data)</span>
            </h3>

            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl p-3 bg-slate-50 dark:bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">
                    <th className="p-2">Nama</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">NIM/NIP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {importedPreview.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold text-slate-900 dark:text-white">{row['Nama Lengkap']}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-300">{row['Email']}</td>
                      <td className="p-2 text-sky-600 font-semibold">{row['Role']}</td>
                      <td className="p-2 text-slate-600 dark:text-slate-400">{row['Username/NIM/NIP'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button onClick={handleConfirmBatchImport} className="glass-button text-xs font-bold">
                Konfirmasi & Buat {importedPreview.length} Akun Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Single Add User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Tambah User Manual</h3>

            <form onSubmit={handleAddSingleUser} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Contoh: Capt. Ahmad Subarjo"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Email Official</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@poltek.ac.id"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Peran (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full glass-input"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="dosen">Dosen</option>
                  <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                  <option value="alumni">Alumni</option>
                  <option value="unit_approver">Unit Approver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {newRole === 'mahasiswa' && (
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">NIM Mahasiswa</label>
                  <input
                    type="text"
                    value={newNim}
                    onChange={(e) => setNewNim(e.target.value)}
                    placeholder="2101099"
                    className="w-full glass-input"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold">
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
