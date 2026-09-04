'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Save, Building2, Ship, UserCheck, Phone, Mail, CheckCircle2, Calendar, Clock, AlertCircle } from 'lucide-react';

export default function PralaDataKapalPage() {
  const [namaPerusahaan, setNamaPerusahaan] = useState('PT Samudera Indonesia Tbk');
  const [namaKapal, setNamaKapal] = useState('MV Samudera Cargo 08');
  const [tipeKapal, setTipeKapal] = useState('Container Ship (Kapal Petikemas)');
  const [namaContact, setNamaContact] = useState('Capt. Hendra Gunawan');
  const [jabatanContact, setJabatanContact] = useState('Nakhoda / Crewing Manager');
  const [noHpContact, setNoHpContact] = useState('081198765432');
  const [emailContact, setEmailContact] = useState('crewing@samudera.co.id');
  const [tanggalMulaiPrala, setTanggalMulaiPrala] = useState('2025-09-01');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_prala_student_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.namaPerusahaan) setNamaPerusahaan(parsed.namaPerusahaan);
        if (parsed.namaKapal) setNamaKapal(parsed.namaKapal);
        if (parsed.tipeKapal) setTipeKapal(parsed.tipeKapal);
        if (parsed.namaContact) setNamaContact(parsed.namaContact);
        if (parsed.jabatanContact) setJabatanContact(parsed.jabatanContact);
        if (parsed.noHpContact) setNoHpContact(parsed.noHpContact);
        if (parsed.emailContact) setEmailContact(parsed.emailContact);
        if (parsed.tanggalMulaiPrala) setTanggalMulaiPrala(parsed.tanggalMulaiPrala);
      }
    } catch (e) {}
  }, []);

  // Helper to calculate deadline given start date + months offset
  const calculateDeadline = (startDateStr: string, monthsToAdd: number) => {
    if (!startDateStr) return '-';
    const d = new Date(startDateStr);
    d.setMonth(d.getMonth() + monthsToAdd);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
      namaPerusahaan,
      namaKapal,
      tipeKapal,
      namaContact,
      jabatanContact,
      noHpContact,
      emailContact,
      tanggalMulaiPrala,
    };
    try {
      localStorage.setItem('siakal_prala_student_data', JSON.stringify(dataToSave));
    } catch (e) {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
          <span>Data Kapal & Jadwal Waktu Mulai PRALA (1 Tahun)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Khusus Mahasiswa Nautika & Permesinan Kapal: Isi perusahaan pelayaran, tanggal mulai PRALA, dan spesifikasi kapal.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black text-center flex items-center justify-center gap-2 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Data Kapal & Tanggal Mulai PRALA Berhasil Diperbarui! Jadwal 4 Laporan TRB Telah Dibuat.</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 space-y-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
        {/* TANGGAL MULAI PRALA (WAKTU NAIK KAPAL / ON-BOARD) */}
        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
          <label className="block text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Tanggal Mulai PRALA / Naik Kapal (On-Board) *</span>
          </label>
          <p className="text-xs text-slate-600 font-semibold">
            Tanggal ini akan menjadi acuan pembuatan 4 jadwal deadline laporan TRB berkala (setiap 3 bulan sekali).
          </p>
          <input
            type="date"
            required
            value={tanggalMulaiPrala}
            onChange={(e) => setTanggalMulaiPrala(e.target.value)}
            className="w-full sm:w-64 glass-input text-xs sm:text-sm font-mono font-bold py-2.5 px-3.5 bg-white border-sky-300 text-slate-900 shadow-sm"
          />

          {/* DISPLAY AUTOMATIC 4 DEADLINES */}
          {tanggalMulaiPrala && (
            <div className="mt-3 pt-3 border-t border-sky-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                <span className="font-extrabold text-sky-800 block text-[10px] uppercase">Laporan 1 (Bulan 3)</span>
                <span className="font-mono font-black text-slate-900">{calculateDeadline(tanggalMulaiPrala, 3)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                <span className="font-extrabold text-sky-800 block text-[10px] uppercase">Laporan 2 (Bulan 6)</span>
                <span className="font-mono font-black text-slate-900">{calculateDeadline(tanggalMulaiPrala, 6)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                <span className="font-extrabold text-sky-800 block text-[10px] uppercase">Laporan 3 (Bulan 9)</span>
                <span className="font-mono font-black text-slate-900">{calculateDeadline(tanggalMulaiPrala, 9)}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-sky-200">
                <span className="font-extrabold text-sky-800 block text-[10px] uppercase">Laporan 4 (Bulan 12)</span>
                <span className="font-mono font-black text-slate-900">{calculateDeadline(tanggalMulaiPrala, 12)}</span>
              </div>
            </div>
          )}
        </div>

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
            <span>Simpan Data Kapal & Jadwal PRALA</span>
          </button>
        </div>
      </form>
    </div>
  );
}
