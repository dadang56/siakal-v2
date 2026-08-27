'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Plus, FileText, CheckCircle2, Users, FileCheck } from 'lucide-react';
import { initialScholarshipOffers, ScholarshipOffer } from '@/lib/mockStore';
import { Modal } from '@/components/Modal';

export default function AdminBeasiswaPage() {
  const [offers, setOffers] = useState<ScholarshipOffer[]>(initialScholarshipOffers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [namaBeasiswa, setNamaBeasiswa] = useState('');
  const [jenisBeasiswa, setJenisBeasiswa] = useState('Prestasi Akademik');
  const [sasaran, setSasaran] = useState('Seluruh Mahasiswa');
  const [ketentuan, setKetentuan] = useState('');
  const [kuota, setKuota] = useState(10);

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBeasiswa) return;
    const newOffer: ScholarshipOffer = {
      id: `scholar-${Date.now()}`,
      namaBeasiswa,
      jenisBeasiswa,
      sasaran,
      ketentuan,
      persyaratan: ['Scan KTP & Kartu Mahasiswa', 'Transkrip Nilai Legalisir'],
      kuota,
      tanggalBuka: new Date().toISOString().split('T')[0],
      tanggalTutup: '2026-10-31',
      status: 'Buka',
    };
    setOffers([...offers, newOffer]);
    setNamaBeasiswa('');
    setKetentuan('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-sky-400" />
            <span>Manajemen Penawaran Beasiswa & Rapat Seleksi</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Buat penawaran beasiswa baru, verifikasi berkas pendaftar, dan unggah 3 Dokumen Rapat Seleksi (Notulen, Daftar Hadir, & Berita Acara).
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Buat Penawaran Beasiswa</span>
        </button>
      </div>

      {/* List Offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel p-6 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                  {off.jenisBeasiswa}
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Kuota: {off.kuota} Mahasiswa
                </span>
              </div>

              <h3 className="font-bold text-base text-white">{off.namaBeasiswa}</h3>
              <p className="text-xs text-slate-400 mt-1">Sasaran: <strong className="text-slate-200">{off.sasaran}</strong></p>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">{off.ketentuan}</p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Tutup: {off.tanggalTutup}</span>

              <Link
                href="/dashboard/admin/beasiswa/seleksi"
                className="glass-button text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Portal Seleksi Rapat & Berkas</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Offer */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Penawaran Beasiswa Baru">
        <form onSubmit={handleCreateOffer} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Beasiswa *</label>
            <input
              type="text"
              required
              value={namaBeasiswa}
              onChange={(e) => setNamaBeasiswa(e.target.value)}
              placeholder="Contoh: Beasiswa Unggulan Perhubungan 2026"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">Jenis Beasiswa</label>
              <select
                value={jenisBeasiswa}
                onChange={(e) => setJenisBeasiswa(e.target.value)}
                className="w-full glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Prestasi Akademik">Prestasi Akademik</option>
                <option value="Bantuan Kurang Mampu">Bantuan Kurang Mampu</option>
                <option value="Kehormatan Ketarunaan">Kehormatan Ketarunaan</option>
                <option value="Ikatan Dinas">Ikatan Dinas</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Kuota Penerima *</label>
              <input
                type="number"
                required
                value={kuota}
                onChange={(e) => setKuota(parseInt(e.target.value))}
                className="w-full glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Sasaran Penerima</label>
            <input
              type="text"
              value={sasaran}
              onChange={(e) => setSasaran(e.target.value)}
              placeholder="Contoh: Seluruh Mahasiswa Prodi Nautika & Permesinan"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Ketentuan & Syarat</label>
            <textarea
              value={ketentuan}
              onChange={(e) => setKetentuan(e.target.value)}
              placeholder="Jelaskan kriteria kelayakan pendaftar..."
              rows={3}
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs">
              Terbitkan Penawaran Beasiswa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
