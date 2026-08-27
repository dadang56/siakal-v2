'use client';

import React, { useState } from 'react';
import { GraduationCap, Upload, CheckCircle2, FileText, Bell } from 'lucide-react';
import { initialScholarshipOffers, ScholarshipOffer } from '@/lib/mockStore';
import { Modal } from '@/components/Modal';

export default function StudentBeasiswaPage() {
  const [offers] = useState<ScholarshipOffer[]>(initialScholarshipOffers);
  const [selectedOffer, setSelectedOffer] = useState<ScholarshipOffer | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const [ktpUrl, setKtpUrl] = useState('');
  const [transkripUrl, setTranskripUrl] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setSelectedOffer(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-sky-400" />
          <span>Penawaran Beasiswa & Status Pengajuan</span>
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Ikuti penawaran beasiswa yang dibuka oleh Kampus. Upload berkas persyaratan untuk dinilai dalam rapat seleksi beasiswa.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase">
                  {off.jenisBeasiswa}
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  Kuota: {off.kuota}
                </span>
              </div>

              <h3 className="font-bold text-base text-white">{off.namaBeasiswa}</h3>
              <p className="text-xs text-slate-300 mt-2">{off.ketentuan}</p>

              <div className="mt-3 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">Daftar Persyaratan Berkas:</span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                  {off.persyaratan.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Batas: {off.tanggalTutup}</span>
              <button
                onClick={() => setSelectedOffer(off)}
                className="glass-button text-xs py-1.5 px-4"
              >
                Ikut Penawaran Beasiswa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Application Form */}
      <Modal isOpen={!!selectedOffer} onClose={() => setSelectedOffer(null)} title={`Pengajuan Beasiswa: ${selectedOffer?.namaBeasiswa}`}>
        {appliedSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="text-sm font-bold text-white">Pengajuan Beasiswa Berhasil Diterima!</div>
            <p className="text-xs text-slate-300">Berkas Anda akan diproses dalam Rapat Seleksi Beasiswa. Notifikasi hasil akan didistribusikan ke akun Anda.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">1. Scan KTP & Kartu Mahasiswa (PDF) *</label>
              <input
                type="text"
                required
                value={ktpUrl}
                onChange={(e) => setKtpUrl(e.target.value)}
                placeholder="Masukkan URL/File Scan_KTP_KTM.pdf"
                className="w-full glass-input text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">2. Transkrip Nilai Legalisir (PDF) *</label>
              <input
                type="text"
                required
                value={transkripUrl}
                onChange={(e) => setTranskripUrl(e.target.value)}
                placeholder="Masukkan URL/File Transkrip_Nilai.pdf"
                className="w-full glass-input text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button type="submit" className="glass-button text-xs flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>Kirim Berkas Pengajuan Beasiswa</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
