'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Upload, CheckCircle2, ShieldCheck, Image } from 'lucide-react';
import { UserAccount } from '@/lib/mockStore';

export default function ProfilUnitApproverPage() {
  const [namaGelar, setNamaGelar] = useState('Dra. Sri Wahyuni, M.IP.');
  const [nip, setNip] = useState('198704202012011003');
  const [ttdUrl, setTtdUrl] = useState('https://api.dicebear.com/7.x/shapes/svg?seed=signature-perpus');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('siakal_user');
    if (stored) {
      const u = JSON.parse(stored) as UserAccount;
      if (u.namaLengkapGelar) setNamaGelar(u.namaLengkapGelar);
      if (u.nip) setNip(u.nip);
      if (u.ttdImageUrl) setTtdUrl(u.ttdImageUrl);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const stored = localStorage.getItem('siakal_user');
    if (stored) {
      const u = JSON.parse(stored) as UserAccount;
      u.namaLengkapGelar = namaGelar;
      u.nip = nip;
      u.ttdImageUrl = ttdUrl;
      localStorage.setItem('siakal_user', JSON.stringify(u));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-sky-400" />
          <span>Pengaturan Profil Unit Approver Clearance Out</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Atur Nama Lengkap + Gelar, NIP, dan Tanda Tangan Digital Transparan (PNG) untuk auto-stamping otomatis pada formulir cetak PDF FM.AT.01.017-01.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
          Profil NIP, Nama+Gelar, & TTD Digital berhasil disimpan!
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="glass-panel p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Lengkap & Gelar Resmi *</label>
          <input
            type="text"
            required
            value={namaGelar}
            onChange={(e) => setNamaGelar(e.target.value)}
            placeholder="Contoh: Capt. Budi Santoso, M.Mar."
            className="w-full glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">Nomor Induk Pegawai (NIP) *</label>
          <input
            type="text"
            required
            value={nip}
            onChange={(e) => setNip(e.target.value)}
            placeholder="Contoh: NIP. 19850315 201012 1 002"
            className="w-full glass-input text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1">URL File Tanda Tangan Digital (PNG Transparan) *</label>
          <input
            type="text"
            required
            value={ttdUrl}
            onChange={(e) => setTtdUrl(e.target.value)}
            placeholder="https://example.com/ttd-digital.png"
            className="w-full glass-input text-xs"
          />
        </div>

        {/* Preview Box */}
        <div className="p-4 rounded-xl border border-white/10 bg-slate-900/60 text-center space-y-2">
          <span className="text-xs font-bold text-sky-300 block">Pratinjau TTD Digital pada Box Template Dokumen:</span>
          <div className="w-48 h-20 mx-auto border border-dashed border-white/20 rounded-xl p-2 bg-slate-950 flex flex-col items-center justify-center">
            {ttdUrl && <img src={ttdUrl} alt="TTD Preview" className="h-10 w-auto object-contain" />}
            <span className="text-[10px] font-bold text-white mt-1">{namaGelar}</span>
            <span className="text-[9px] text-slate-400">NIP. {nip}</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button type="submit" className="glass-button text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Profil TTD Digital</span>
          </button>
        </div>
      </form>
    </div>
  );
}
