'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Plus, FileCheck, Calendar, Users, Award } from 'lucide-react';
import { initialScholarshipOffers, ScholarshipOffer } from '@/lib/mockStore';

export default function AdminBeasiswaPage() {
  const [offers, setOffers] = useState<ScholarshipOffer[]>(initialScholarshipOffers);
  const [showModal, setShowModal] = useState(false);
  const [namaBeasiswa, setNamaBeasiswa] = useState('');
  const [jenisBeasiswa, setJenisBeasiswa] = useState('Prestasi Akademik');
  const [sasaran, setSasaran] = useState('');
  const [ketentuan, setKetentuan] = useState('');
  const [kuota, setKuota] = useState(10);
  const [tglBuka, setTglBuka] = useState('2026-08-01');
  const [tglTutup, setTglTutup] = useState('2026-09-15');

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: ScholarshipOffer = {
      id: `scholar-${Date.now()}`,
      namaBeasiswa,
      jenisBeasiswa,
      sasaran,
      ketentuan,
      persyaratan: ['Scan KTP & Kartu Mahasiswa', 'Transkrip Nilai Legalisir', 'Surat Rekomendasi Dosen'],
      kuota,
      tanggalBuka: tglBuka,
      tanggalTutup: tglTutup,
      status: 'Buka',
    };

    setOffers([...offers, newOffer]);
    setShowModal(false);
    setNamaBeasiswa('');
    setSasaran('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Manajemen Penawaran & Rapat Seleksi Beasiswa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Buat penawaran beasiswa baru, unggah berkas notulen/daftar hadir/berita acara rapat keputusan, dan tetapkan penerima beasiswa.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Plus className="w-4 h-4" />
          <span>Buat Penawaran Beasiswa</span>
        </button>
      </div>

      {/* List Beasiswa Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  {off.jenisBeasiswa}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Status: {off.status}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{off.namaBeasiswa}</h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"><strong>Sasaran:</strong> {off.sasaran}</p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{off.ketentuan}</p>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Tutup: {off.tanggalTutup} &bull; Kuota: {off.kuota}</span>

              <Link
                href="/dashboard/admin/beasiswa/seleksi"
                className="glass-button text-xs font-bold py-2 px-4 flex items-center gap-1.5 shadow-md"
              >
                <FileCheck className="w-4 h-4" />
                <span>Portal Seleksi & Rapat</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Offer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Buat Penawaran Beasiswa Baru</h3>

            <form onSubmit={handleAddOffer} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Beasiswa</label>
                <input
                  type="text"
                  required
                  value={namaBeasiswa}
                  onChange={(e) => setNamaBeasiswa(e.target.value)}
                  placeholder="Contoh: Beasiswa Unggulan Kemendikbudristek 2026"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Sasaran Mahasiswa</label>
                <input
                  type="text"
                  required
                  value={sasaran}
                  onChange={(e) => setSasaran(e.target.value)}
                  placeholder="Contoh: Seluruh Mahasiswa D3/D4 Aktif"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Ketentuan & Syarat Utuk</label>
                <textarea
                  required
                  rows={2}
                  value={ketentuan}
                  onChange={(e) => setKetentuan(e.target.value)}
                  placeholder="IPK Minimal 3.25, Sertifikat TOEFL, Surat Rekomendasi..."
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Kuota Penerima</label>
                  <input
                    type="number"
                    required
                    value={kuota}
                    onChange={(e) => setKuota(Number(e.target.value))}
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tanggal Tutup</label>
                  <input
                    type="date"
                    required
                    value={tglTutup}
                    onChange={(e) => setTglTutup(e.target.value)}
                    className="w-full glass-input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold">
                  Terbitkan Penawaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
