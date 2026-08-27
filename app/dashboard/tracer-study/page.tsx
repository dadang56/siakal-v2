'use client';

import React, { useState } from 'react';
import { GraduationCap, Save, CheckCircle2, Share2, Briefcase } from 'lucide-react';

export default function AlumniTracerStudyPage() {
  const [noWhatsapp, setNoWhatsapp] = useState('081299887766');
  const [emailTerkini, setEmailTerkini] = useState('deni@alumni.poltek.ac.id');
  const [statusKerja, setStatusKerja] = useState<'Bekerja' | 'Wirausaha' | 'Lanjut Studi' | 'Mencari Kerja'>('Bekerja');
  const [namaPerusahaan, setNamaPerusahaan] = useState('PT PELNI Cabang Palembang');
  const [bidangIndustri, setBidangIndustri] = useState('Pelayaran & Transportasi Laut');
  const [jabatan, setJabatan] = useState('Perwira Kapal (Third Officer)');
  const [rangeGaji, setRangeGaji] = useState('Rp 10.000.000 - Rp 15.000.000');
  const [masaTungguBulan, setMasaTungguBulan] = useState(2);
  const [keselarasan, setKeselarasan] = useState('Sangat Sesuai');
  const [evaluasiKurikulum, setEvaluasiKurikulum] = useState('Kurikulum bimbingan PRALA dan simulasi pelayaran sangat baik.');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmitTracer = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const surveyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/kepuasan-pengguna`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-sky-400" />
          <span>Form Kuesioner Tracer Study Alumni</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Perbarui data rekam karir, status pekerjaan, masa tunggu, dan tingkat keselarasan bidang studi Anda demi mendukung akreditasi instansi.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
          Data Tracer Study Alumni berhasil disimpan! Terima kasih atas partisipasi Anda.
        </div>
      )}

      {/* Share Employer Survey Link Box */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
        <div className="font-bold text-amber-300 flex items-center gap-1.5">
          <Share2 className="w-4 h-4" />
          <span>Bagikan Tautan Kuesioner Kepuasan Pengguna Lulusan ke Atasan Anda:</span>
        </div>
        <p className="text-slate-300 text-[11px]">
          Minta atasan/manager tempat Anda bekerja untuk mengisi survei kepuasan lulusan via tautan publik (bebas login):
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={surveyUrl}
            className="flex-1 glass-input text-xs bg-slate-950 font-mono text-sky-300"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(surveyUrl);
              alert('Tautan Kuesioner Pengguna Lulusan disalin!');
            }}
            className="glass-button text-xs py-2 px-3 shrink-0"
          >
            Salin Tautan
          </button>
        </div>
      </div>

      {/* Form Tracer */}
      <form onSubmit={handleSubmitTracer} className="glass-panel p-6 sm:p-8 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2">1. Kontak Terkini Alumni</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nomor WhatsApp Terkini *</label>
            <input
              type="text"
              required
              value={noWhatsapp}
              onChange={(e) => setNoWhatsapp(e.target.value)}
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Email Aktif Terkini *</label>
            <input
              type="email"
              required
              value={emailTerkini}
              onChange={(e) => setEmailTerkini(e.target.value)}
              className="w-full glass-input text-xs"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 pt-2">2. Status Karir & Pekerjaan</h3>

        <div>
          <label className="block font-semibold text-slate-200 mb-1">Status Pekerjaan Saat Ini *</label>
          <select
            value={statusKerja}
            onChange={(e: any) => setStatusKerja(e.target.value)}
            className="w-full glass-input text-xs bg-slate-900 text-white"
          >
            <option value="Bekerja">Bekerja (Instansi / Perusahaan)</option>
            <option value="Wirausaha">Wirausaha / Membuka Usaha</option>
            <option value="Melanjutkan Pendidikan">Melanjutkan Pendidikan (Studi Lanjut)</option>
            <option value="Mencari Kerja">Mencari Kerja / Persiapan</option>
          </select>
        </div>

        {statusKerja === 'Bekerja' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Nama Perusahaan / Instansi *</label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Bidang Industri *</label>
                <input
                  type="text"
                  required
                  value={bidangIndustri}
                  onChange={(e) => setBidangIndustri(e.target.value)}
                  className="w-full glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Jabatan / Posisi Pekerjaan *</label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Range Gaji / Pendapatan Bulanan *</label>
                <select
                  value={rangeGaji}
                  onChange={(e) => setRangeGaji(e.target.value)}
                  className="w-full glass-input text-xs bg-slate-900 text-white"
                >
                  <option value="< Rp 5.000.000">&lt; Rp 5.000.000</option>
                  <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                  <option value="Rp 10.000.000 - Rp 15.000.000">Rp 10.000.000 - Rp 15.000.000</option>
                  <option value="> Rp 15.000.000">&gt; Rp 15.000.000</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-200 mb-1">Masa Tunggu Mendapat Kerja (dalam Bulan) *</label>
                <input
                  type="number"
                  required
                  value={masaTungguBulan}
                  onChange={(e) => setMasaTungguBulan(parseInt(e.target.value))}
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-200 mb-1">Tingkat Keselarasan Bidang Studi *</label>
                <select
                  value={keselarasan}
                  onChange={(e) => setKeselarasan(e.target.value)}
                  className="w-full glass-input text-xs bg-slate-900 text-white"
                >
                  <option value="Sangat Sesuai">Sangat Sesuai</option>
                  <option value="Sesuai">Sesuai</option>
                  <option value="Kurang Sesuai">Kurang Sesuai</option>
                  <option value="Tidak Sesuai">Tidak Sesuai</option>
                </select>
              </div>
            </div>
          </>
        )}

        <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2 pt-2">3. Evaluasi Pembelajaran & Saran Kampus</h3>

        <div>
          <label className="block font-semibold text-slate-200 mb-1">Saran & Masukan untuk Pengembangan Program Studi</label>
          <textarea
            value={evaluasiKurikulum}
            onChange={(e) => setEvaluasiKurikulum(e.target.value)}
            rows={3}
            className="w-full glass-input text-xs"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="glass-button text-xs flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>Simpan Kuesioner Tracer Study</span>
          </button>
        </div>
      </form>
    </div>
  );
}
