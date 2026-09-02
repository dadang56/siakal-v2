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
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Bimbingan PRALA & Upload TRB (Training Record Book PDF)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Bimbingan berkala selama 1 Tahun Praktek Laut (PRALA) dan verifikasi dokumen Training Record Book (TRB).
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Input Catatan Bimbingan</span>
        </button>
      </div>

      {/* Upload & Progress TRB PDF Card */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Dokumen TRB (Training Record Book) PDF</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Wajib mengunggah scan PDF dokumen TRB resmi yang telah ditandatangani Perwira Kapal.</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 font-black text-xs border border-emerald-500/20 shadow-sm">
            Status TRB: {trbStatus}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input
            type="text"
            value={trbFileUrl}
            onChange={(e) => setTrbFileUrl(e.target.value)}
            placeholder="Masukkan URL / File TRB_Dokumen.pdf"
            className="flex-1 glass-input text-xs sm:text-sm font-mono text-slate-900 bg-white border-slate-300"
          />
          <a
            href={trbFileUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 font-extrabold text-xs flex items-center gap-1.5 shrink-0 border border-slate-300"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Pratinjau TRB PDF</span>
          </a>
        </div>
      </div>

      {/* List Log Bimbingan Card */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide">
          Log History Bimbingan PRALA (1 Tahun)
        </h3>

        <div className="space-y-3.5">
          {bimbingans.map((b) => (
            <div key={b.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-slate-500">{b.tanggal}</span>
                {b.status === 'Approved' ? (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20">
                    Disetujui Dosen
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20">
                    Dalam Reviu Dosen
                  </span>
                )}
              </div>

              <h4 className="font-black text-sm text-slate-900">{b.judul}</h4>
              <p className="text-xs text-slate-700 font-semibold">{b.catatan}</p>

              {b.balasanDosen && (
                <div className="mt-3 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium">
                  <strong className="font-black text-sky-700 block mb-0.5">Catatan Dosen Pembimbing:</strong> {b.balasanDosen}
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
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Judul / Pokok Bimbingan *</label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Laporan Bimbingan Bulan Ke-4: Perawatan Mesin Utama"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Catatan & Rincian Pengamatan Lapangan</label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={4}
              placeholder="Uraikan catatan bimbingan atau pertanyaan untuk dosen..."
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6">
              Kirim Bimbingan ke Dosen
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
