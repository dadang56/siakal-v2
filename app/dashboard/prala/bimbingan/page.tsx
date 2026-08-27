'use client';

import React, { useState } from 'react';
import { Anchor, Plus, Upload, FileText, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function PralaBimbinganPage() {
  const [bimbingans, setBimbingans] = useState([
    {
      id: 'bim-1',
      tanggal: '2025-10-15',
      judul: 'Laporan Bimbingan PRALA Bulan Ke-3: Sistem Olah Gerak Kapal',
      catatan: 'Pengamatan operasional kemudi otomatis dan olah gerak alur pelayaran sempit.',
      status: 'Approved',
      balasanDosen: 'Bagus, terus tingkatkan pencatatan pada logbook TRB harian.',
    },
  ]);

  const [trbFileUrl, setTrbFileUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [trbStatus, setTrbStatus] = useState<'Pending' | 'Approved' | 'Revisi'>('Approved');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');

  const handleAddBimbingan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul) return;
    setBimbingans([
      ...bimbingans,
      {
        id: `bim-${Date.now()}`,
        tanggal: new Date().toISOString().split('T')[0],
        judul,
        catatan,
        status: 'Pending',
        balasanDosen: '',
      },
    ]);
    setJudul('');
    setCatatan('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Anchor className="w-6 h-6 text-sky-400" />
            <span>Bimbingan PRALA & Upload TRB (Training Record Book PDF)</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Bimbingan berkala selama 1 Tahun Praktek Laut (PRALA) dan verifikasi dokumen Training Record Book (TRB).
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Input Catatan Bimbingan</span>
        </button>
      </div>

      {/* Upload & Progress TRB PDF */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Dokumen TRB (Training Record Book) PDF</span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">Wajib mengunggah scan PDF dokumen TRB resmi yang telah ditandatangani Perwira Kapal.</p>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Status TRB: {trbStatus}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-white/10">
          <input
            type="text"
            value={trbFileUrl}
            onChange={(e) => setTrbFileUrl(e.target.value)}
            placeholder="Masukkan URL / File TRB_Dokumen.pdf"
            className="flex-1 glass-input text-xs"
          />
          <a
            href={trbFileUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs flex items-center gap-1.5 shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Pratinjau TRB PDF</span>
          </a>
        </div>
      </div>

      {/* List Log Bimbingan */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Log History Bimbingan PRALA (1 Tahun)</h3>

        <div className="space-y-3">
          {bimbingans.map((b) => (
            <div key={b.id} className="p-4 rounded-xl bg-slate-900/50 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">{b.tanggal}</span>
                {b.status === 'Approved' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    Disetujui Dosen
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300">
                    Dalam Reviu Dosen
                  </span>
                )}
              </div>

              <h4 className="font-bold text-sm text-white">{b.judul}</h4>
              <p className="text-xs text-slate-300">{b.catatan}</p>

              {b.balasanDosen && (
                <div className="mt-2 p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs text-sky-200">
                  <strong>Catatan Dosen Pembimbing:</strong> {b.balasanDosen}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Bimbingan Baru */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Input Bimbingan PRALA Baru">
        <form onSubmit={handleAddBimbingan} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Judul / Pokok Bimbingan *</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Laporan Bimbingan Bulan Ke-4: Perawatan Mesin Utama"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Catatan & Rincian Pengamatan Lapangan</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              placeholder="Uraikan catatan bimbingan atau pertanyaan untuk dosen..."
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs">
              Kirim Bimbingan ke Dosen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
