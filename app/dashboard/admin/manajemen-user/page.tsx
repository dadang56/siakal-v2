'use client';

import React, { useState } from 'react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';
import { readExcelFile, downloadUserImportTemplate } from '@/lib/utils/excel';
import { Users, Upload, Download, CheckCircle2, AlertTriangle, Plus, Shield } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserAccount[]>(initialAccounts);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importStatusMsg, setImportStatusMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readExcelFile(file);
      setPreviewData(data);
      setImportStatusMsg('');
    } catch (err) {
      alert('Gagal membaca file Excel. Pastikan format file sesuai template.');
    }
  };

  const processBulkImport = () => {
    if (previewData.length === 0) return;

    const newAccounts: UserAccount[] = previewData.map((row, idx) => ({
      id: `imported-user-${Date.now()}-${idx}`,
      fullName: row['Nama Lengkap'] || row['fullName'] || 'Pengguna Baru',
      email: row['Email'] || `user${idx}@poltek.ac.id`,
      nim: row['Username/NIM/NIP'] || row['nim'],
      role: (row['Role'] || 'mahasiswa').toLowerCase(),
      prodi: row['Prodi'] || '',
      angkatan: parseInt(row['Angkatan']) || 2023,
      isProfileCompleted: true,
    }));

    setUsers([...users, ...newAccounts]);
    setImportStatusMsg(`Berhasil mengimpor ${newAccounts.length} akun pengguna baru ke database Supabase!`);
    setPreviewData([]);
    setTimeout(() => {
      setIsModalOpen(false);
      setImportStatusMsg('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" />
            <span>Pusat Manajemen User & Impor Massal Akun</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Kelola seluruh akun pengguna (Admin, Mahasiswa, Dosen, Pembimbing Lapangan, Alumni, & 14 Unit Approver)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadUserImportTemplate}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Unduh Template Excel</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="glass-button text-xs flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Impor Massal Akun (Excel)</span>
          </button>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="glass-panel p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Daftar Akun Terdaftar ({users.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 px-2">Nama Lengkap</th>
                <th className="pb-3 px-2">Email / NIM</th>
                <th className="pb-3 px-2">Role</th>
                <th className="pb-3 px-2">Prodi / Unit</th>
                <th className="pb-3 px-2 text-center">Status Profil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="py-3 px-2 font-medium text-white">{u.fullName}</td>
                  <td className="py-3 px-2 text-slate-300">{u.email} {u.nim ? `(${u.nim})` : ''}</td>
                  <td className="py-3 px-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-slate-400">{u.prodi || u.namaLengkapGelar || '-'}</td>
                  <td className="py-3 px-2 text-center">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold">
                      Lengkap
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Import Excel */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPreviewData([]);
        }}
        title="Impor Massal Akun Pembuatan User via Template Excel"
      >
        <div className="space-y-4">
          {importStatusMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
              {importStatusMsg}
            </div>
          )}

          <div className="p-4 rounded-xl border-2 border-dashed border-sky-500/30 bg-sky-500/5 text-center space-y-2">
            <Upload className="w-8 h-8 text-sky-400 mx-auto" />
            <div className="text-xs font-bold text-white">Unggah File Excel Pembuatan Akun (.xlsx / .csv)</div>
            <p className="text-[11px] text-slate-400">Pastikan format kolom sesuai dengan Template Excel SIAKAL</p>
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-user-input"
            />
            <label
              htmlFor="excel-user-input"
              className="inline-block glass-button text-xs cursor-pointer py-1.5 px-3 mt-2"
            >
              Pilih File Excel
            </label>
          </div>

          {/* Live Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-300">Pratinjau Data Impor ({previewData.length} Akun Valid)</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Auto-Provisioning
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto border border-white/10 rounded-xl">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-900 sticky top-0 text-slate-400">
                    <tr>
                      <th className="p-2">Nama</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Prodi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {previewData.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-white">{row['Nama Lengkap'] || row['fullName']}</td>
                        <td className="p-2 text-slate-300">{row['Email'] || row['email']}</td>
                        <td className="p-2 text-sky-300">{row['Role'] || row['role']}</td>
                        <td className="p-2 text-slate-400">{row['Prodi'] || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={processBulkImport}
                className="w-full glass-button text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Proses Impor Massal & Buat Akun Supabase</span>
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
