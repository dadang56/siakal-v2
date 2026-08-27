'use client';

import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Plus, Trash2, CheckCircle2, Search, Key, Copy, Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';
import { readExcelFile, downloadUserImportTemplate, exportToExcel } from '@/lib/utils/excel';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('semua');
  const [visiblePasswords, setVisiblePasswords] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pop-up modals
  const [importedPreview, setImportedPreview] = useState<any[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Single Add User Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserAccount['role']>('mahasiswa');
  const [newUsernameOrId, setNewUsernameOrId] = useState('');
  const [newPassword, setNewPassword] = useState('SIAKAL2026!');
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
    const newAccounts: UserAccount[] = importedPreview.map((row, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      email: row['Email'] || `user${idx}@siakal.poltek.ac.id`,
      fullName: row['Nama Lengkap'] || 'Pengguna Baru',
      role: (row['Role']?.toString().toLowerCase().replace(' ', '_') as any) || 'mahasiswa',
      usernameOrId: row['Username/NIM/NIP']?.toString() || row['Email'],
      initialPassword: row['Password Initial']?.toString() || 'SIAKAL2026!',
      nim: row['Role']?.toString().toLowerCase() === 'mahasiswa' ? row['Username/NIM/NIP']?.toString() : undefined,
      nip: row['Role']?.toString().toLowerCase() === 'dosen' ? row['Username/NIM/NIP']?.toString() : undefined,
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
    if (!newFullName || !newUsernameOrId || !newPassword) {
      alert('Mohon isi Nama, Username/ID Masuk, dan Password!');
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: newFullName,
      email: newEmail || `${newUsernameOrId}@siakal.poltek.ac.id`,
      role: newRole,
      usernameOrId: newUsernameOrId,
      initialPassword: newPassword,
      nim: newRole === 'mahasiswa' ? newUsernameOrId : undefined,
      nip: newRole === 'dosen' ? newUsernameOrId : undefined,
      prodi: newProdi,
      isProfileCompleted: true,
    };

    const updated = [...users, newUser];
    saveUsers(updated);
    setShowAddModal(false);
    setNewFullName('');
    setNewEmail('');
    setNewUsernameOrId('');
    setNewPassword('SIAKAL2026!');
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
            'Username / ID Masuk': u.usernameOrId || u.nim || u.nip || u.email,
            'Password Awal': u.initialPassword || 'SIAKAL2026!',
            Prodi: u.prodi || '-',
          })),
        },
      ],
      'Database_User_SIAKAL'
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
      {/* Top Banner Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Pusat Manajemen User, ID Masuk & Password</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Kelola seluruh akun pengguna, tentukan <strong className="text-slate-900 dark:text-white">ID Masuk (NIM/NIP/Username)</strong> dan <strong className="text-slate-900 dark:text-white">Kata Sandi (Password)</strong> untuk login.
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
            <span>+ Tambah User & Password</span>
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
            placeholder="Cari nama, ID masuk, email, NIM, NIP..."
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

          <button onClick={handleExportUsers} className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
            Ekspor .XLSX
          </button>
        </div>
      </div>

      {/* Table List User with Credentials */}
      <div className="glass-panel p-6 overflow-hidden">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
          Daftar Akun Terdaftar & Akses Password ({filteredUsers.length} Users)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                <th className="pb-3 px-3">Nama Lengkap & Email</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">ID / Username Masuk</th>
                <th className="pb-3 px-3">Kata Sandi (Password)</th>
                <th className="pb-3 px-3">Prodi / Unit</th>
                <th className="pb-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5">
              {filteredUsers.map((u) => {
                const loginId = u.usernameOrId || u.nim || u.nip || u.email;
                const pwd = u.initialPassword || 'SIAKAL2026!';
                const isPwdShown = visiblePasswords[u.id];

                return (
                  <tr key={u.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-slate-900 dark:text-white text-sm">{u.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono font-medium">{u.email}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-mono font-extrabold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg inline-block border border-sky-500/20">
                        {loginId}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-white/10 min-w-[100px]">
                          {isPwdShown ? pwd : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          title="Lihat Password"
                        >
                          {isPwdShown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 dark:text-slate-300 font-semibold">
                      {u.prodi || u.namaLengkapGelar || '-'}
                    </td>

                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(u)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                        title="Salin ID & Password"
                      >
                        {copiedId === u.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === u.id ? 'Tersalin' : 'Salin Akses'}</span>
                      </button>

                      <button
                        onClick={() => setDeleteTargetId(u.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
              <span>Pratinjau Impor Excel ({importedPreview.length} Baris Data)</span>
            </h3>

            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-white/10 rounded-xl p-3 bg-slate-50 dark:bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">
                    <th className="p-2">Nama</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">ID Masuk</th>
                    <th className="p-2">Password Initial</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                  {importedPreview.map((row, idx) => (
                    <tr key={idx}>
                      <td className="p-2 font-bold text-slate-900 dark:text-white">{row['Nama Lengkap']}</td>
                      <td className="p-2 text-slate-700 dark:text-slate-300">{row['Email']}</td>
                      <td className="p-2 text-sky-600 font-semibold">{row['Role']}</td>
                      <td className="p-2 font-mono font-bold text-amber-500">{row['Username/NIM/NIP'] || '-'}</td>
                      <td className="p-2 font-mono font-bold text-slate-600 dark:text-slate-300">{row['Password Initial'] || 'SIAKAL2026!'}</td>
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
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-sky-500" />
                <span>Tambah User Baru & Pengaturan Password</span>
              </h3>
            </div>

            <form onSubmit={handleAddSingleUser} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Lengkap Pengguna</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Contoh: Capt. Ahmad Subarjo, M.Mar."
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Peran (Role Akun)</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full glass-input font-bold"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                    <option value="pembimbing_lapangan">Pembimbing Lapangan</option>
                    <option value="alumni">Alumni</option>
                    <option value="unit_approver">Unit Approver</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Program Studi / Unit</label>
                  <select
                    value={newProdi}
                    onChange={(e) => setNewProdi(e.target.value)}
                    className="w-full glass-input"
                  >
                    <option value="Studi Nautika">Studi Nautika</option>
                    <option value="Permesinan Kapal">Permesinan Kapal</option>
                    <option value="Manajemen Transportasi Perairan Daratan">MTPD</option>
                    <option value="Teknologi Rekayasa Pelayaran & TSDP">TSDP</option>
                    <option value="Unit Verifikator">Unit Verifikator</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-3">
                <div className="font-extrabold text-sky-700 dark:text-sky-300 text-xs flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  <span>Kredensial Log In (ID & Password Akun)</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {newRole === 'mahasiswa' ? 'NIM (Digunakan sebagai ID Log In)' : newRole === 'dosen' ? 'NIP (Digunakan sebagai ID Log In)' : 'Username / ID Masuk'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsernameOrId}
                    onChange={(e) => setNewUsernameOrId(e.target.value)}
                    placeholder={newRole === 'mahasiswa' ? 'Masukkan NIM (cth: 2101034)' : newRole === 'dosen' ? 'Masukkan NIP (cth: 19850315...)' : 'Username (cth: supervisor_pelni)'}
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Kata Sandi Awal (Password Initial)</label>
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="SIAKAL2026!"
                    className="w-full glass-input font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Email Official (Opsional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@poltek.ac.id"
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
                  Simpan & Buat Akun
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
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Akun</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin menghapus Akun Pengguna ini? Akses pengguna ini akan dicabut permanen.
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
                onClick={confirmDeleteUser}
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
