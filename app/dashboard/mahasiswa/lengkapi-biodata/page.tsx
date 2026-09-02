'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserCheck, Save, Lock, GraduationCap } from 'lucide-react';
import { UserAccount, initialProdiList } from '@/lib/mockStore';

export default function LengkapiBiodataPage() {
  const router = useRouter();
  const [nim, setNim] = useState('2026001');
  const [namaLengkap, setNamaLengkap] = useState('Ahmad Fauzi');
  const [prodi, setProdi] = useState('');
  const [angkatan, setAngkatan] = useState('2026');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [noHp, setNoHp] = useState('081234567890');
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  // Generate Angkatan 1950 - 3000
  const yearRangeOptions: number[] = [];
  for (let y = 3000; y >= 1950; y--) {
    yearRangeOptions.push(y);
  }

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('siakal_user');
      if (storedUser) {
        const u = JSON.parse(storedUser) as UserAccount;
        if (u.fullName) setNamaLengkap(u.fullName);
        if (u.nim) setNim(u.nim);
        if (u.prodi) setProdi(u.prodi);
        if (u.angkatan) setAngkatan(u.angkatan.toString());
      }

      const storedProdis = localStorage.getItem('siakal_prodi_list');
      if (storedProdis) {
        const parsed = JSON.parse(storedProdis);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProdiList(parsed);
          if (!prodi) setProdi(parsed[0].nama);
        }
      }
    } catch (e) {}
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('siakal_user');
    if (stored) {
      const user = JSON.parse(stored) as UserAccount;
      user.isProfileCompleted = true;
      user.fullName = namaLengkap;
      user.prodi = prodi || prodiList[0]?.nama;
      user.nim = nim;
      user.angkatan = parseInt(angkatan);
      user.jenisKelamin = jenisKelamin;
      user.noHp = noHp;
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
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Pengisian Biodata Mahasiswa</h1>
            <p className="text-xs text-slate-600 mt-1 font-semibold">
              Silakan lengkapi biodata utama Anda secara akurat sesuai data resmi institusi.
            </p>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 text-xs text-center font-extrabold shadow-sm">
          Biodata berhasil disimpan! Mengalihkan ke Dashboard Utama...
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm text-slate-900">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">NIM / NPT *</label>
          <input
            type="text"
            required
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full glass-input text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap *</label>
          <input
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            className="w-full glass-input text-xs font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* DYNAMIC PRODI SELECT */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi *</label>
            <select
              value={prodi || prodiList[0]?.nama}
              onChange={(e) => setProdi(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              {prodiList.map((p) => (
                <option key={p.id} value={p.nama}>
                  {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* DYNAMIC ANGKATAN SELECT 1950 - 3000 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Angkatan (1950-3000) *</label>
            <select
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              {yearRangeOptions.map((y) => (
                <option key={y} value={y.toString()}>
                  Tahun {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
            <select
              value={jenisKelamin}
              onChange={(e) => setJenisKelamin(e.target.value)}
              className="w-full glass-input text-xs font-semibold"
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nomor HP / WhatsApp *</label>
            <input
              type="text"
              required
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full glass-input text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="glass-button w-full py-3.5 text-xs sm:text-sm font-extrabold shadow-lg">
            <Save className="w-4.5 h-4.5" />
            <span>Simpan Biodata Lengkap</span>
          </button>
        </div>
      </form>
    </div>
  );
}
