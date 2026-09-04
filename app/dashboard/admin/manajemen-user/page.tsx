'use client';

import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Plus, Trash2, CheckCircle2, Search, Key, Copy, Eye, EyeOff, Check, AlertTriangle, FileSpreadsheet, Edit3, RefreshCw, UserCheck, UserPlus, X } from 'lucide-react';
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
  const [newAngkatan, setNewAngkatan] = useState('2026');
  const [selectedMhsId, setSelectedMhsId] = useState('');
  const [newDosenBimbingans, setNewDosenBimbingans] = useState<string[]>([]);
  const [bimbinganSearchQuery, setBimbinganSearchQuery] = useState('');

  // Extract list of Mahasiswas from database
  const existingMahasiswas = users.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');

  // Extended mock students list for easy search testing
  const allSearchableStudents = [
    ...existingMahasiswas.map((m) => ({ id: m.id, fullName: m.fullName, nim: m.nim || m.usernameOrId || 'N/A', prodi: m.prodi || 'Studi Nautika' })),
    { id: 'mhs-mock-1', fullName: 'Ahmad Fauzi', nim: '111111', prodi: 'Studi Nautika' },
    { id: 'mhs-mock-2', fullName: 'Rizky Ramadhan', nim: '2102088', prodi: 'Permesinan Kapal' },
    { id: 'mhs-mock-3', fullName: 'Bambang Pratama', nim: '2102011', prodi: 'MTPD' },
    { id: 'mhs-mock-4', fullName: 'Deni Kurniawan', nim: '2001015', prodi: 'Studi Nautika' },
    { id: 'mhs-mock-5', fullName: 'Siti Rahmawati', nim: '2101099', prodi: 'Permesinan Kapal' },
  ].filter((item, index, self) => index === self.findIndex((t) => t.fullName === item.fullName));

  const filteredSearchMhs = allSearchableStudents.filter(
    (m) =>
      bimbinganSearchQuery.trim() !== '' &&
      (m.fullName.toLowerCase().includes(bimbinganSearchQuery.toLowerCase()) ||
        m.nim.toLowerCase().includes(bimbinganSearchQuery.toLowerCase()) ||
        m.prodi.toLowerCase().includes(bimbinganSearchQuery.toLowerCase()))
  );

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

  // Sync selection when choosing existing student from dropdown
  const handleSelectExistingMhs = (mhsId: string) => {
    setSelectedMhsId(mhsId);
    if (!mhsId) return;
    const mhs = existingMahasiswas.find((m) => m.id === mhsId);
    if (mhs) {
      setNewFullName(mhs.fullName);
      setNewUsernameOrId(mhs.nim || mhs.usernameOrId || '');
      setNewEmail(mhs.email);
      setNewProdi(mhs.prodi || prodiList[0]?.nama);
      setNewAngkatan(mhs.angkatan ? mhs.angkatan.toString() : '2026');
    }
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
        nim: isMhsOrAlumni ? row['Username/NIM/NIP']?.toString() : undefined,
        nip: r === 'dosen' ? row['Username/NIM/NIP']?.toString() : undefined,
        prodi: isMhsOrAlumni ? (row['Prodi'] || prodiList[0]?.nama) : undefined,
        angkatan: isMhsOrAlumni ? (Number(row['Angkatan']) || 2026) : undefined,
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
    const isDosen = newRole === 'dosen';

    const existingIndex = users.findIndex(
      (u) =>
        (selectedMhsId && u.id === selectedMhsId) ||
        (isMhsOrAlumni && u.nim === newUsernameOrId) ||
        u.usernameOrId === newUsernameOrId
    );

    let updatedList: UserAccount[];

    if (existingIndex >= 0) {
      const existingUser = users[existingIndex];
      const updatedUser: UserAccount = {
        ...existingUser,
        fullName: newFullName,
        email: newEmail || existingUser.email || `${newUsernameOrId}@siakal.poltek.ac.id`,
        role: newRole,
        usernameOrId: newUsernameOrId,
        initialPassword: newPassword,
        nim: isMhsOrAlumni ? newUsernameOrId : undefined,
        nip: isDosen ? newUsernameOrId : undefined,
        prodi: isMhsOrAlumni ? newProdi : undefined,
        angkatan: isMhsOrAlumni ? Number(newAngkatan) || 2026 : undefined,
        mahasiswaBimbinganNames: isDosen ? newDosenBimbingans : undefined,
      };
      updatedList = [...users];
      updatedList[existingIndex] = updatedUser;
    } else {
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        fullName: newFullName,
        email: newEmail || `${newUsernameOrId}@siakal.poltek.ac.id`,
        role: newRole,
        usernameOrId: newUsernameOrId,
        initialPassword: newPassword,
        nim: isMhsOrAlumni ? newUsernameOrId : undefined,
        nip: isDosen ? newUsernameOrId : undefined,
        prodi: isMhsOrAlumni ? newProdi : undefined,
        angkatan: isMhsOrAlumni ? Number(newAngkatan) || 2026 : undefined,
        mahasiswaBimbinganNames: isDosen ? newDosenBimbingans : undefined,
        isProfileCompleted: true,
      };
      updatedList = [...users, newUser];
    }

    saveUsers(updatedList);
    setShowAddModal(false);
    setNewFullName('');
    setNewUsernameOrId('');
    setNewEmail('');
    setSelectedMhsId('');
    setNewDosenBimbingans([]);
    setBimbinganSearchQuery('');
    alert(`Akun (${newFullName}) berhasil disimpan!`);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const isMhsOrAlumni = editingUser.role === 'mahasiswa' || editingUser.role === 'alumni';
    const isDosen = editingUser.role === 'dosen';

    const updatedUser: UserAccount = {
      ...editingUser,
      nim: isMhsOrAlumni ? editingUser.usernameOrId || editingUser.nim : undefined,
      prodi: isMhsOrAlumni ? editingUser.prodi : undefined,
      angkatan: isMhsOrAlumni ? Number(editingUser.angkatan) || 2026 : undefined,
      mahasiswaBimbinganNames: isDosen ? editingUser.mahasiswaBimbinganNames || [] : undefined,
    };

    const updatedList = users.map((u) => (u.id === editingUser.id ? updatedUser : u));
    saveUsers(updatedList);
    setEditingUser(null);
    setBimbinganSearchQuery('');
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
            'Program Studi': u.prodi || '-',
            'Mahasiswa Bimbingan': u.role === 'dosen' ? (u.mahasiswaBimbinganNames?.join(', ') || '-') : '-',
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
            Kelola akun pengguna, ID Masuk (NIM/NIP), kata sandi login, dan penetapan Mahasiswa Bimbingan Dosen.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelFileUpload} className="hidden" />
          </label>

          <button onClick={() => { setSelectedMhsId(''); setNewDosenBimbingans([]); setBimbinganSearchQuery(''); setShowAddModal(true); }} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer">
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
            <option value="dosen">Dosen Pembimbing</option>
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
            className="text-xs font-extrabold text-sky-600 hover:underline flex items-center gap-1.5 cursor-pointer"
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
                <th className="py-3 px-4">PRODI / MAHASISWA BIMBINGAN</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const loginId = u.usernameOrId || u.nim || u.nip || u.email;
                  const isPassVisible = visiblePasswords[u.id];
                  const bimbinganList = u.mahasiswaBimbinganNames || (u.role === 'dosen' ? ['Ahmad Fauzi', 'Rizky Ramadhan'] : []);

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

                      {/* PROGRAM STUDI (FOR MAHASISWA) OR MAHASISWA BIMBINGAN (FOR DOSEN) */}
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {u.role === 'mahasiswa' || u.role === 'alumni' ? (
                          <span>{u.prodi || '-'}</span>
                        ) : u.role === 'dosen' ? (
                          <div className="space-y-1">
                            <span className="text-[11px] font-black text-indigo-700 block">
                              Bimbingan ({bimbinganList.length} Mahasiswa):
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {bimbinganList.map((mhsName, idx) => (
                                <span key={idx} className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-200 text-[11px] font-bold">
                                  {mhsName}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => { setEditingUser({ ...u }); setBimbinganSearchQuery(''); }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors cursor-pointer"
                            title="Edit Akun User & Mahasiswa Bimbingan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleCopyCredentials(u)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
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
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
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
          <div className="glass-panel w-full max-w-xl p-6 sm:p-7 space-y-5 border border-slate-300 shadow-2xl relative bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-sky-500" />
                <span>Tambah Akun User Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSingleUser} className="space-y-4">
              {/* ROW 1: ROLE & SINKRONISASI MAHASISWA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Role Akun *</label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as any;
                      setNewRole(r);
                      setSelectedMhsId('');
                    }}
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="admin">Administrator</option>
                    <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                    <option value="alumni">Alumni</option>
                    <option value="unit_approver">Unit Approver</option>
                  </select>
                </div>

                {/* SINKRONISASI DROPDOWN DARI DATABASE MAHASISWA */}
                {(newRole === 'mahasiswa' || newRole === 'alumni') ? (
                  <div>
                    <label className="block text-xs font-bold text-sky-700 mb-1.5 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin-slow" />
                      <span>Pilih dari Database Mahasiswa:</span>
                    </label>
                    <select
                      value={selectedMhsId}
                      onChange={(e) => handleSelectExistingMhs(e.target.value)}
                      className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-sky-50/70 border-sky-300 text-sky-900"
                    >
                      <option value="">-- Buat Baru / Pilih Tersimpan --</option>
                      {existingMahasiswas.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nim ? `${m.nim} - ` : ''}{m.fullName} ({m.prodi || 'N/A'})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">ID Masuk (NIP/Username) *</label>
                    <input
                      type="text"
                      required
                      value={newUsernameOrId}
                      onChange={(e) => setNewUsernameOrId(e.target.value)}
                      placeholder="Contoh: 198503152010121002"
                      className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* ROW 2: NAMA LENGKAP & ID MASUK FOR MAHASISWA */}
              {(newRole === 'mahasiswa' || newRole === 'alumni') ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Lengkap Mahasiswa *</label>
                    <input
                      type="text"
                      required
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      placeholder="Contoh: Ahmad Fauzi"
                      className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">NIM (ID Masuk Login) *</label>
                    <input
                      type="text"
                      required
                      value={newUsernameOrId}
                      onChange={(e) => setNewUsernameOrId(e.target.value)}
                      placeholder="Contoh: 111111"
                      className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Lengkap User *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="Contoh: Capt. Budi Santoso, M.Mar."
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              )}

              {/* ROW 3: PASSWORD & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Password Initial *</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Email (Opsional)</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Opsional (otomatis id@siakal.poltek.ac.id)"
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* PROGRAM STUDI & ANGKATAN FOR MAHASISWA & ALUMNI */}
              {(newRole === 'mahasiswa' || newRole === 'alumni') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Program Studi *</label>
                    <select
                      value={newProdi}
                      onChange={(e) => setNewProdi(e.target.value)}
                      className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                    >
                      {prodiList.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Angkatan *</label>
                    <input
                      type="number"
                      value={newAngkatan}
                      onChange={(e) => setNewAngkatan(e.target.value)}
                      placeholder="Contoh: 2026"
                      className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* MAHASISWA BIMBINGAN ALLOCATION FOR ROLE DOSEN PEMBIMBING WITH LIVE SEARCH */}
              {newRole === 'dosen' && (
                <div className="p-4.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span>Mahasiswa Bimbingan PRALA</span>
                    </label>
                    <span className="text-[11px] font-black text-indigo-800 bg-indigo-100/90 px-2.5 py-0.5 rounded-full border border-indigo-300">
                      {newDosenBimbingans.length} Mahasiswa Ditunjuk
                    </span>
                  </div>

                  {/* List Assigned Student Badges */}
                  <div className="flex flex-wrap gap-2">
                    {newDosenBimbingans.length > 0 ? (
                      newDosenBimbingans.map((mhsName, idx) => (
                        <span key={idx} className="bg-white text-indigo-900 px-3 py-1 rounded-xl border border-indigo-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                          <span>{mhsName}</span>
                          <button
                            type="button"
                            onClick={() => setNewDosenBimbingans(newDosenBimbingans.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-black cursor-pointer text-xs"
                            title="Hapus Bimbingan"
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-indigo-600 font-semibold italic">Belum ada mahasiswa bimbingan yang ditunjuk.</span>
                    )}
                  </div>

                  {/* LIVE SEARCH INPUT & AUTOCOMPLETE LIST */}
                  <div className="relative pt-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-indigo-500" />
                      <input
                        type="text"
                        value={bimbinganSearchQuery}
                        onChange={(e) => setBimbinganSearchQuery(e.target.value)}
                        placeholder="Ketik Nama, NIM, atau Prodi Mahasiswa..."
                        className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-indigo-300 text-slate-900 shadow-sm"
                      />
                      {bimbinganSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setBimbinganSearchQuery('')}
                          className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* LIVE SEARCH DROPDOWN SUGGESTIONS */}
                    {bimbinganSearchQuery.trim() !== '' && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl border border-indigo-200 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                        {filteredSearchMhs.length > 0 ? (
                          filteredSearchMhs.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                if (!newDosenBimbingans.includes(m.fullName)) {
                                  setNewDosenBimbingans([...newDosenBimbingans, m.fullName]);
                                }
                                setBimbinganSearchQuery('');
                              }}
                              className="w-full text-left p-3 hover:bg-indigo-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                            >
                              <div>
                                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{m.fullName}</div>
                                <div className="text-[11px] text-slate-500 font-mono">NIM: {m.nim} • {m.prodi}</div>
                              </div>
                              <span className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-sm">
                                + Tambah
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3.5 text-xs text-slate-500 text-center italic">
                            Tidak ditemukan mahasiswa dengan kata kunci &ldquo;{bimbinganSearchQuery}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6 cursor-pointer">
                  Simpan User Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT USER WITH LIVE SEARCH */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-7 space-y-5 border border-slate-300 shadow-2xl relative bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Akun User</span>
              </h3>
              <button onClick={() => setEditingUser(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Role Akun *</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen Pembimbing</option>
                    <option value="admin">Administrator</option>
                    <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                    <option value="alumni">Alumni</option>
                    <option value="unit_approver">Unit Approver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {editingUser.role === 'mahasiswa' || editingUser.role === 'alumni' ? 'NIM (ID Masuk Login) *' : 'ID Masuk (NIP/Username) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.usernameOrId || editingUser.nim || editingUser.nip || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, usernameOrId: e.target.value, nim: e.target.value, nip: e.target.value })}
                    className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.fullName}
                    onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Password Initial *</label>
                <input
                  type="text"
                  required
                  value={editingUser.initialPassword || 'SIAKAL2026!'}
                  onChange={(e) => setEditingUser({ ...editingUser, initialPassword: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>

              {/* PROGRAM STUDI & ANGKATAN FOR MAHASISWA & ALUMNI */}
              {(editingUser.role === 'mahasiswa' || editingUser.role === 'alumni') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-sky-50/70 p-4 rounded-2xl border border-sky-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Program Studi *</label>
                    <select
                      value={editingUser.prodi || prodiList[0]?.nama}
                      onChange={(e) => setEditingUser({ ...editingUser, prodi: e.target.value })}
                      className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                    >
                      {prodiList.map((p) => (
                        <option key={p.id} value={p.nama}>
                          {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Angkatan *</label>
                    <input
                      type="number"
                      value={editingUser.angkatan || 2026}
                      onChange={(e) => setEditingUser({ ...editingUser, angkatan: Number(e.target.value) })}
                      className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* MAHASISWA BIMBINGAN ALLOCATION FOR ROLE DOSEN PEMBIMBING WITH LIVE SEARCH */}
              {editingUser.role === 'dosen' && (
                <div className="p-4.5 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <UserPlus className="w-4 h-4 text-indigo-600" />
                      <span>Mahasiswa Bimbingan PRALA</span>
                    </label>
                    <span className="text-[11px] font-black text-indigo-800 bg-indigo-100/90 px-2.5 py-0.5 rounded-full border border-indigo-300">
                      {(editingUser.mahasiswaBimbinganNames || ['Ahmad Fauzi', 'Rizky Ramadhan']).length} Mahasiswa Ditunjuk
                    </span>
                  </div>

                  {/* List Assigned Student Badges (Can Edit & Delete) */}
                  <div className="flex flex-wrap gap-2">
                    {(editingUser.mahasiswaBimbinganNames || ['Ahmad Fauzi', 'Rizky Ramadhan']).map((mhsName, idx) => (
                      <span key={idx} className="bg-white text-indigo-900 px-3 py-1 rounded-xl border border-indigo-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                        <span>{mhsName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const current = editingUser.mahasiswaBimbinganNames || ['Ahmad Fauzi', 'Rizky Ramadhan'];
                            const updated = current.filter((_, i) => i !== idx);
                            setEditingUser({ ...editingUser, mahasiswaBimbinganNames: updated });
                          }}
                          className="text-red-500 hover:text-red-700 font-black cursor-pointer text-xs"
                          title="Hapus Bimbingan"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* LIVE SEARCH INPUT & AUTOCOMPLETE LIST FOR EDIT MODAL */}
                  <div className="relative pt-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-indigo-500" />
                      <input
                        type="text"
                        value={bimbinganSearchQuery}
                        onChange={(e) => setBimbinganSearchQuery(e.target.value)}
                        placeholder="Ketik Nama, NIM, atau Prodi Mahasiswa..."
                        className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-indigo-300 text-slate-900 shadow-sm"
                      />
                      {bimbinganSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setBimbinganSearchQuery('')}
                          className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* LIVE SEARCH DROPDOWN SUGGESTIONS */}
                    {bimbinganSearchQuery.trim() !== '' && (
                      <div className="absolute z-30 left-0 right-0 mt-1 bg-white rounded-2xl border border-indigo-200 shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                        {filteredSearchMhs.length > 0 ? (
                          filteredSearchMhs.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                const current = editingUser.mahasiswaBimbinganNames || ['Ahmad Fauzi', 'Rizky Ramadhan'];
                                if (!current.includes(m.fullName)) {
                                  setEditingUser({
                                    ...editingUser,
                                    mahasiswaBimbinganNames: [...current, m.fullName],
                                  });
                                }
                                setBimbinganSearchQuery('');
                              }}
                              className="w-full text-left p-3 hover:bg-indigo-50 transition-colors flex items-center justify-between text-xs cursor-pointer"
                            >
                              <div>
                                <div className="font-extrabold text-slate-900 text-xs sm:text-sm">{m.fullName}</div>
                                <div className="text-[11px] text-slate-500 font-mono">NIM: {m.nim} • {m.prodi}</div>
                              </div>
                              <span className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-sm">
                                + Tambah
                              </span>
                            </button>
                          ))
                        ) : (
                          <div className="p-3.5 text-xs text-slate-500 text-center italic">
                            Tidak ditemukan mahasiswa dengan kata kunci &ldquo;{bimbinganSearchQuery}&rdquo;
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6 cursor-pointer">
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
