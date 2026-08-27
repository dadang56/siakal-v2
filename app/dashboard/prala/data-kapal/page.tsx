'use client';

import React, { useState } from 'react';
import { Anchor, Save, Building2, Ship, UserCheck, Phone, Mail } from 'lucide-react';

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
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Anchor className="w-6 h-6 text-sky-400" />
          <span>Form Data Kapal & Perusahaan Pelayaran PRALA (Durasi 1 Tahun)</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Khusus Mahasiswa Studi Nautika & Permesinan Kapal: Wajib menginputkan nama perusahaan pelayaran, spesifikasi kapal, dan contact person perwira kapal/crewing.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
          Data Perusahaan & Nama Kapal PRALA berhasil diperbarui!
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
            <Building2 className="w-4 h-4 text-sky-400" />
            <span>Nama Perusahaan Pelayaran *</span>
          </label>
          <input
            type="text"
            required
            value={namaPerusahaan}
            onChange={(e) => setNamaPerusahaan(e.target.value)}
            placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
            className="w-full glass-input text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
              <Ship className="w-4 h-4 text-blue-400" />
              <span>Nama Kapal (Vessel Name) *</span>
            </label>
            <input
              type="text"
              required
              value={namaKapal}
              onChange={(e) => setNamaKapal(e.target.value)}
              placeholder="Contoh: KM Kelud / MV Nusantara"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">Tipe / Jenis Kapal *</label>
            <input
              type="text"
              required
              value={tipeKapal}
              onChange={(e) => setTipeKapal(e.target.value)}
              placeholder="Contoh: Container Ship / Tanker / Tugboat"
              className="w-full glass-input text-xs"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <span className="text-xs font-bold text-sky-300 block mb-3">Kontak Person Perwira Kapal / Crewing Manager:</span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Nama Perwira Kapal / Contact Person *</span>
              </label>
              <input
                type="text"
                required
                value={namaContact}
                onChange={(e) => setNamaContact(e.target.value)}
                placeholder="Contoh: Capt. Budi Santoso / KKM Eko"
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">Jabatan Perwira / Manager</label>
              <input
                type="text"
                value={jabatanContact}
                onChange={(e) => setJabatanContact(e.target.value)}
                placeholder="Contoh: Nakhoda / Kepala Kamar Mesin"
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Nomor Telepon / WA Contact Person *</span>
              </label>
              <input
                type="text"
                required
                value={noHpContact}
                onChange={(e) => setNoHpContact(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>Email Perusahaan / Perwira</span>
              </label>
              <input
                type="email"
                value={emailContact}
                onChange={(e) => setEmailContact(e.target.value)}
                placeholder="Contoh: crewing@pelni.co.id"
                className="w-full glass-input text-xs"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="glass-button text-xs flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Simpan Data Kapal & Perusahaan PRALA</span>
          </button>
        </div>
      </form>
    </div>
  );
}
