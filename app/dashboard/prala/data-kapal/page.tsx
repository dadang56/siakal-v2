'use client';

import React, { useState } from 'react';
import { Anchor, Save, Building2, Ship, UserCheck, Phone, Mail, CheckCircle2 } from 'lucide-react';

export default function PralaDataKapalPage() {
  const [namaPerusahaan, setNamaPerusahaan] = useState('PT Samudera Indonesia Tbk');
  const [namaKapal, setNamaKapal] = useState('MV Samudera Cargo 08');
  const [tipeKapal, setTipeKapal] = useState('Container Ship (Kapal Petikemas)');
  const [namaContact, setNamaContact] = useState('Capt. Hendra Gunawan');
  const [jabatanContact, setJabatanContact] = useState('Nakhoda / Crewing Manager');
  const [noHpContact, setNoHpContact] = useState('081198765432');
  const [emailContact, setEmailContact] = useState('crewing@samudera.co.id');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
          <span>Data Kapal & Perusahaan Pelayaran PRALA</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Khusus Mahasiswa Nautika & Permesinan Kapal: Isi nama perusahaan pelayaran, spesifikasi kapal, dan kontak person perwira/crewing.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black text-center flex items-center justify-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Data Perusahaan & Nama Kapal PRALA berhasil diperbarui!</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-sky-500" />
            <span>Nama Perusahaan Pelayaran *</span>
          </label>
          <input
            type="text"
            required
            value={namaPerusahaan}
            onChange={(e) => setNamaPerusahaan(e.target.value)}
            placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
            className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-sky-500" />
              <span>Nama Kapal (Vessel Name) *</span>
            </label>
            <input
              type="text"
              required
              value={namaKapal}
              onChange={(e) => setNamaKapal(e.target.value)}
              placeholder="Contoh: KM Kelud / MV Nusantara"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Tipe / Jenis Kapal *</label>
            <input
              type="text"
              required
              value={tipeKapal}
              onChange={(e) => setTipeKapal(e.target.value)}
              placeholder="Contoh: Container Ship / Tanker / Tugboat"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-4">
          <span className="text-xs font-black text-sky-700 block uppercase tracking-wider">
            Kontak Person Perwira Kapal / Crewing Manager:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>Nama Perwira Kapal / Contact Person *</span>
              </label>
              <input
                type="text"
                required
                value={namaContact}
                onChange={(e) => setNamaContact(e.target.value)}
                placeholder="Contoh: Capt. Budi Santoso / KKM Eko"
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Jabatan Perwira / Manager</label>
              <input
                type="text"
                value={jabatanContact}
                onChange={(e) => setJabatanContact(e.target.value)}
                placeholder="Contoh: Nakhoda / Kepala Kamar Mesin"
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>Nomor Telepon / WA Contact Person *</span>
              </label>
              <input
                type="text"
                required
                value={noHpContact}
                onChange={(e) => setNoHpContact(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-indigo-500" />
                <span>Email Perusahaan / Perwira</span>
              </label>
              <input
                type="email"
                value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)}
                placeholder="Contoh: crewing@pelni.co.id"
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6 shadow-md cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Simpan Data Kapal & Perusahaan PRALA</span>
          </button>
        </div>
      </form>
    </div>
  );
}
