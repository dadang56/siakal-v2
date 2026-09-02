'use client';

import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Plus, Trash2, CheckCircle2, Search, Key, Copy, Eye, EyeOff, Check, AlertTriangle, FileSpreadsheet, Edit3 } from 'lucide-react';
import { initialAccounts, UserAccount, initialProdiList } from '@/lib/mockStore';
import { readExcelFile, downloadUserImportTemplate, exportToExcel } from '@/lib/utils/excel';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return initialAccounts;
  });

  // Dynamic Master Data Prodi List
  const [prodiList, setProdiList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_prodi_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return initialProdiList;
  });

  useEffect(() => {
    try {
      const storedProdis = localStorage.getItem('siakal_prodi_list');
      if (storedProdis) {
        const parsed = JSON.parse(storedProdis);
        if (Array.isArray(parsed) && parsed.length > 0) setProdiList(parsed);
      }
    } catch (e) {}
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pop-up modals
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Single Add User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserAccount['role']>('mahasiswa');
  const [newUsernameOrId, setNewUsernameOrId] = useState('');
  const [newPassword, setNewPassword] = useState('SIAKAL2026!');
  const [newProdi, setNewProdi] = useState(prodiList[0]?.nama || 'Studi Nautika');

  const saveUsers = (newList: UserAccount[]) => {
    setUsers(newList);
    try {
      localStorage.setItem('siakal_user_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const confirmDeleteUser = () => {
    if (!deleteTargetId) return;
    const updated = users.filter((u) => u.id !== deleteTargetId);
    saveUsers(updated);
    setDeleteTargetId(null);
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyCredentials = (u: UserAccount) => {
    const loginId = u.usernameOrId || u.nim || u.nip || u.email;
    const pwd = u.initialPassword || 'SIAKAL2026!';
    const textToCopy = `ID Masuk: ${loginId}\nPassword: ${pwd}\nEmail: ${u.email}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 2500);
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
    const newAccounts: UserAccount[] = importedPreview.map((row, idx) => {
      const r = (row['Role']?.toString().toLowerCase().replace(' ', '_') as any) || 'mahasiswa';
      const isMhsOrAlumni = r === 'mahasiswa' || r === 'alumni';

      return {
        id: `imported-${Date.now()}-${idx}`,
        email: row['Email'] || `user${idx}@siakal.poltek.ac.id`,
        fullName: row['Nama Lengkap'] || 'Pengguna Baru',
        role: r,
        usernameOrId: row['Username/NIM/NIP']?.toString() || row['Email'],
        initialPassword: row['Password Initial']?.toString() || 'SIAKAL2026!',
        nim: r === 'mahasiswa' ? row['Username/NIM/NIP']?.toString() : undefined,
        nip: r === 'dosen' ? row['Username/NIM/NIP']?.toString() : undefined,
        prodi: isMhsOrAlumni ? (row['Prodi'] || prodiList[0]?.nama) : undefined,
        isProfileCompleted: true,
      };
    });

    const updated = [...users, ...newAccounts];
    saveUsers(updated);
    setShowImportModal(false);
    setImportedPreview([]);
    alert(`Berhasil mengimpor ${newAccounts.length} akun pengguna baru ke sistem!`);
  };

  const handleAddSingleUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newUsernameOrId || !newPassword) {
      alert('Mohon isi Nama, Username/ID Masuk, dan Password!');
      return;
    }

    const isMhsOrAlumni = newRole === 'mahasiswa' || newRole === 'alumni';

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: newFullName,
      email: newEmail || `${newUsernameOrId}@siakal.poltek.ac.id`,
      role: newRole,
      usernameOrId: newUsernameOrId,
      initialPassword: newPassword,
      nim: newRole === 'mahasiswa' ? newUsernameOrId : undefined,
      nip: newRole === 'dosen' ? newUsernameOrId : undefined,
      prodi: isMhsOrAlumni ? newProdi : undefined,
      isProfileCompleted: true,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    setShowAddModal(false);
    setNewFullName('');
    setNewUsernameOrId('');
    setNewEmail('');
    alert(`Akun (${newFullName}) berhasil dibuat & tersimpan di sistem!`);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const isMhsOrAlumni = editingUser.role === 'mahasiswa' || editingUser.role === 'alumni';
    const updatedUser = {
      ...editingUser,
      prodi: isMhsOrAlumni ? editingUser.prodi : undefined,
    };

    const updatedList = users.map((u) => (u.id === editingUser.id ? updatedUser : u));
    saveUsers(updatedList);
    setEditingUser(null);
    alert(`Perubahan akun (${editingUser.fullName}) berhasil disimpan!`);
  };

  const handleExportUsers = () => {
    exportToExcel(
      [
        {
          sheetName: 'Manajemen User',
          data: filteredUsers.map((u) => ({
            'ID Masuk (NIM/NIP)': u.usernameOrId || u.nim || u.nip || u.email,
            'Nama Lengkap': u.fullName,
            Email: u.email,
            Role: u.role.toUpperCase(),
            'Password Initial': u.initialPassword || 'SIAKAL2026!',
            'Program Studi / Unit': u.prodi || '-',
          })),
        },
      ],
      'Manajemen_User_SIAKAL'
    );
  };

  const filteredUsers = users.filter((u) => {
    const loginId = u.usernameOrId || u.nim || u.nip || '';
    const matchSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loginId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'semua' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Manajemen User & Hak Akses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola akun pengguna, ID Masuk (NIM/NIP), dan kata sandi login sistem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelFileUpload} className="hidden" />
          </label>

          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Tambah User</span>
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
            placeholder="Cari nama, ID masuk, email..."
            className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100/90 border-slate-300"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 shrink-0">Filter Role:</span>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="glass-input text-xs font-bold py-2 px-3 rounded-xl bg-slate-100/90 border-slate-300 text-slate-900"
          >
            <option value="semua">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="dosen">Dosen</option>
            <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
            <option value="alumni">Alumni</option>
            <option value="unit_approver">Unit Approver</option>
          </select>

          <button onClick={handleExportUsers} className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs shrink-0 flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Ekspor .XLSX</span>
          </button>
        </div>
      </div>

      {/* 3. Table List User Card */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900 tracking-wide">
            Daftar Akun Terdaftar ({filteredUsers.length} Users)
          </h3>
          <button
            onClick={handleDownloadTemplate}
            className="text-xs font-extrabold text-sky-600 hover:underline flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-500" />
            <span>Download Template Excel Impor</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">NAMA LENGKAP & EMAIL</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">ID MASUK</th>
                <th className="py-3 px-4">KATA SANDI</th>
                <th className="py-3 px-4">PROGRAM STUDI</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const loginId = u.usernameOrId || u.nim || u.nip || u.email;
                  const isPassVisible = visiblePasswords[u.id];

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-black text-slate-900">{u.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            u.role === 'admin'
                              ? 'bg-sky-500/10 text-sky-700 border border-sky-500/20'
                              : u.role === 'mahasiswa'
                              ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                              : u.role === 'dosen'
                              ? 'bg-indigo-500/10 text-indigo-700 border border-indigo-500/20'
                              : u.role === 'alumni'
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-sky-700">
                        <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                          {loginId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs font-bold">
                            {isPassVisible ? u.initialPassword || 'SIAKAL2026!' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(u.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title={isPassVisible ? 'Sembunyikan Password' : 'Lihat Password'}
                          >
                            {isPassVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>

                      {/* PROGRAM STUDI ONLY DISPLAYED FOR MAHASISWA & ALUMNI */}
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {u.role === 'mahasiswa' || u.role === 'alumni' ? u.prodi || '-' : '-'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setEditingUser({ ...u })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors"
                            title="Edit Akun User"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleCopyCredentials(u)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              copiedId === u.id
                                ? 'text-emerald-600 bg-emerald-500/20'
                                : 'text-slate-500 hover:text-sky-600 hover:bg-sky-500/10'
                            }`}
                            title="Salin ID & Password"
                          >
                            {copiedId === u.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => setDeleteTargetId(u.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                            title="Hapus Akun User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold text-xs">
                    Tidak ditemukan akun pengguna yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH USER SINGLE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-500" />
                <span>Tambah Akun User Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSingleUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Contoh: Capt. Budi Santoso"
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full glass-input text-xs font-semibold"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="admin">Administrator</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                    <option value="alumni">Alumni</option>
                    <option value="unit_approver">Unit Approver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ID Masuk (Username/NIM/NIP) *</label>
                  <input
                    type="text"
                    required
                    value={newUsernameOrId}
                    onChange={(e) => setNewUsernameOrId(e.target.value)}
                    placeholder="Contoh: 198503152010121002"
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>
              </div>

              {/* PROGRAM STUDI FIELD IS COMPLETELY HIDDEN IF ROLE IS NON-MAHASISWA */}
              <div className={`grid grid-cols-1 ${newRole === 'mahasiswa' || newRole === 'alumni' ? 'sm:grid-cols-2' : ''} gap-3`}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password Initial *</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>

                {(newRole === 'mahasiswa' || newRole === 'alumni') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi *</label>
                    <select
                      value={newProdi}
                      onChange={(e) => setNewProdi(e.target.value)}
                      className="w-full glass-input text-xs font-semibold"
                    >
                      {prodiList.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Opsional (otomatis id@siakal.poltek.ac.id)"
                  className="w-full glass-input text-xs font-semibold"
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
                  Simpan User Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Akun User</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role Akun *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full glass-input text-xs font-semibold"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="admin">Administrator</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                    <option value="alumni">Alumni</option>
                    <option value="unit_approver">Unit Approver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ID Masuk (NIM/NIP) *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.usernameOrId || editingUser.nim || editingUser.nip || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, usernameOrId: e.target.value, nim: e.target.value, nip: e.target.value })}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>
              </div>

              {/* PROGRAM STUDI FIELD IS COMPLETELY HIDDEN IF ROLE IS NON-MAHASISWA */}
              <div className={`grid grid-cols-1 ${editingUser.role === 'mahasiswa' || editingUser.role === 'alumni' ? 'sm:grid-cols-2' : ''} gap-3`}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password Initial *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.initialPassword || 'SIAKAL2026!'}
                    onChange={(e) => setEditingUser({ ...editingUser, initialPassword: e.target.value })}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>

                {(editingUser.role === 'mahasiswa' || editingUser.role === 'alumni') && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi *</label>
                    <select
                      value={editingUser.prodi || prodiList[0]?.nama}
                      onChange={(e) => setEditingUser({ ...editingUser, prodi: e.target.value })}
                      className="w-full glass-input text-xs font-semibold"
                    >
                      {prodiList.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Akun</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Apakah Anda yakin ingin menghapus akun pengguna ini dari sistem?
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
                onClick={confirmDeleteUser}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus User
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
