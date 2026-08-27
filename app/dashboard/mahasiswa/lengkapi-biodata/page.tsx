'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Save, Lock } from 'lucide-react';
import { UserAccount } from '@/lib/mockStore';

export default function LengkapiBiodataPage() {
  const router = useRouter();
  const [nim, setNim] = useState('2101034');
  const [namaLengkap, setNamaLengkap] = useState('Ahmad Fauzi');
  const [prodi, setProdi] = useState('Studi Nautika');
  const [angkatan, setAngkatan] = useState('2023');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-Laki');
  const [dormitory, setDormitory] = useState('Asrama Alpha');
  const [noHp, setNoHp] = useState('081234567890');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('siakal_user');
    if (stored) {
      const user = JSON.parse(stored) as UserAccount;
      user.isProfileCompleted = true;
      user.fullName = namaLengkap;
      user.prodi = prodi;
      user.nim = nim;
      user.angkatan = parseInt(angkatan);
      localStorage.setItem('siakal_user', JSON.stringify(user));
    }
    setSavedSuccess(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Alert Header Lock */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white">Wajib Pengisian Biodata Mahasiswa (First-Time Login)</h1>
            <p className="text-xs text-slate-300 mt-1">
              Akun Anda baru pertama kali masuk. Silakan lengkapi biodata utama terlebih dahulu sebelum mengakses layanan SIAKAL V2.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
          Biodata berhasil disimpan! Mengalihkan ke Dashboard Utama...
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">NIM / NPT *</label>
          <input
            type="text"
            required
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Lengkap *</label>
          <input
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            className="w-full glass-input text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Program Studi *</label>
            <select
              value={prodi}
              onChange={(e) => setProdi(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="Studi Nautika">Diploma III - Studi Nautika</option>
              <option value="Permesinan Kapal">Diploma III - Permesinan Kapal</option>
              <option value="Manajemen Transportasi Perairan Daratan">Diploma III - MTPD</option>
              <option value="Teknik Transportasi SDP">Diploma IV - TSDP</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Tahun Angkatan *</label>
            <select
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Jenis Kelamin</label>
            <select
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value)}
              className="w-full glass-input text-xs bg-slate-900 text-white"
            >
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Dormitory / Asrama</label>
            <input
              type="text"
              value={dormitory}
              onChange={(e) => setDormitory(e.target.value)}
              placeholder="Contoh: Asrama Alpha"
              className="w-full glass-input text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">Nomor HP / WhatsApp Active *</label>
          <input
            type="text"
            required
            value={noHp}
            onChange={(e) => setNoHp(e.target.value)}
            className="w-full glass-input text-xs"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="glass-button text-xs flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Simpan Biodata & Buka Akses Fitur</span>
          </button>
        </div>
      </form>
    </div>
  );
}
