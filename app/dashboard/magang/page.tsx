'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, FileText, Upload, CheckCircle2, UserCheck, Clock, ExternalLink, Plus, Calendar, Image, Printer, X, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/Modal';

export interface MagangActivityLog {
  id: string;
  hariTanggal: string;
  aktivitas: string;
  fotoUrl?: string;
  catatan?: string;
  isVerified?: boolean;
  verifiedAt?: string;
  supervisorName?: string;
  supervisorTtdUrl?: string;
}

export default function StudentMagangPage() {
  const [judulLaporan, setJudulLaporan] = useState('Laporan Akhir Magang MTPD: Efisiensi Logistik Pelabuhan');
  const [laporanPdfUrl, setLaporanPdfUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [statusVerifikasi, setStatusVerifikasi] = useState<'Pending' | 'Diterima' | 'Revisi'>('Diterima');
  const [catatanPembimbing, setCatatanPembimbing] = useState('Laporan akhir sangat baik dan memenuhi standar teknis operasional.');
  const [uploadedSuccess, setUploadedSuccess] = useState(false);

  // Group Details State
  const [namaKelompok, setNamaKelompok] = useState('Kelompok 01 - Pelabuhan Palembang');
  const [tempatMagang, setTempatMagang] = useState('PT Pelabuhan Indonesia (Pelindo) Regional 2 Palembang');
  const [nomorSk, setNomorSk] = useState('SK/MTPD/2026/004');
  const [pembimbingNama, setPembimbingNama] = useState('Hendra Gunawan, S.T.');
  const [pembimbingTtdUrl, setPembimbingTtdUrl] = useState('https://api.dicebear.com/7.x/identicon/svg?seed=SignatureHendra');
  const [anggotaText, setAnggotaText] = useState('Bambang Pratama (2102011), Siti Rahmawati (2102012)');

  // Monthly Activity Logs State
  const [activities, setActivities] = useState<MagangActivityLog[]>([
    {
      id: 'act-1',
      hariTanggal: 'Senin, 02 Maret 2026',
      aktivitas: 'Pengamatan & Pengawasan Operasional Crane Bongkar Muat Petikemas di Dermaga Pelabuhan Pelindo 2',
      fotoUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop&q=60',
      catatan: 'Mahasiswa sangat disiplin menerapkan APD lengkap K3.',
      isVerified: true,
      verifiedAt: '2026-03-02 16:30',
      supervisorName: 'Hendra Gunawan, S.T.',
      supervisorTtdUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=SignatureHendra',
    },
    {
      id: 'act-2',
      hariTanggal: 'Selasa, 03 Maret 2026',
      aktivitas: 'Inspeksi & Verifikasi Dokumen Manifest Kontainer Impor Bersama Tim Syahbandar & Bea Cukai',
      fotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60',
      catatan: 'Pengenalan alur dokumen ekspor impor pelabuhan.',
      isVerified: false,
    },
  ]);

  // Modal Add Activity Log State
  const [showAddActModal, setShowAddActModal] = useState(false);
  const [hariTanggalInput, setHariTanggalInput] = useState('');
  const [aktivitasInput, setAktivitasInput] = useState('');
  const [fotoUrlInput, setFotoUrlInput] = useState('');
  const [catatanInput, setCatatanInput] = useState('');

  // Printable Report Modal State
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem('siakal_magang_activity_logs');
      if (storedLogs) setActivities(JSON.parse(storedLogs));

      const storedProf = localStorage.getItem('siakal_pembimbing_profile');
      if (storedProf) {
        const p = JSON.parse(storedProf);
        if (p.supervisorName) setPembimbingNama(p.supervisorName);
        if (p.supervisorTtdUrl) setPembimbingTtdUrl(p.supervisorTtdUrl);
      }
    } catch (e) {}
  }, []);

  const saveLogs = (updated: MagangActivityLog[]) => {
    setActivities(updated);
    try {
      localStorage.setItem('siakal_magang_activity_logs', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hariTanggalInput || !aktivitasInput) {
      alert('Mohon isi Hari/Tanggal dan Aktivitas!');
      return;
    }

    const newAct: MagangActivityLog = {
      id: `act-${Date.now()}`,
      hariTanggal: hariTanggalInput,
      aktivitas: aktivitasInput,
      fotoUrl: fotoUrlInput || 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&auto=format&fit=crop&q=60',
      catatan: catatanInput,
      isVerified: false,
    };

    const updated = [newAct, ...activities];
    saveLogs(updated);
    setShowAddActModal(false);
    setHariTanggalInput('');
    setAktivitasInput('');
    setFotoUrlInput('');
    setCatatanInput('');
    alert('Aktivitas Magang Bulanan berhasil ditambahkan! Menunggu verifikasi Pembimbing Lapangan.');
  };

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadedSuccess(true);
    setTimeout(() => setUploadedSuccess(false), 3000);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Briefcase className="w-6 h-6 text-sky-500 shrink-0" />
          <span>(Magang dan PKL) MTPD</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Khusus Mahasiswa MTPD: Informasi kelompok magang, input dokumen aktivitas bulanan, verifikasi TTD Pembimbing Lapangan, dan cetak laporan resmi.
        </p>
      </div>

      {/* Informasi Kelompok & SK Magang Card */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-800 border border-sky-500/20 uppercase font-mono">
              {nomorSk}
            </span>
            <h3 className="text-base font-black text-slate-900 mt-1.5">{namaKelompok}</h3>
            <p className="text-xs text-slate-600 font-bold">{tempatMagang}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan Aktivitas (PDF)</span>
            </button>

            <a
              href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-extrabold text-slate-800 flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>SK Magang PDF</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-800 font-bold block mb-1.5">Pembimbing Lapangan Instansi:</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-extrabold text-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{pembimbingNama}</span>
              </div>
              {pembimbingTtdUrl && (
                <img src={pembimbingTtdUrl} alt="TTD" className="h-7 w-14 object-contain" title="TTD Pembimbing Terpasang" />
              )}
            </div>
          </div>

          <div>
            <span className="text-slate-800 font-bold block mb-1.5">Anggota Kelompok Mahasiswa MTPD:</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold">
              {anggotaText}
            </div>
          </div>
        </div>
      </div>

      {/* DOKUMEN AKTIVITAS MAGANG BULANAN PER KELOMPOK */}
      <div className="glass-panel p-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-500" />
              <span>Dokumen Aktivitas Magang & PKL Bulanan</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Diwajibkan mengunggah aktivitas harian/bulanan beserta foto dokumentasi untuk diverifikasi Pembimbing Lapangan.
            </p>
          </div>

          <button
            onClick={() => setShowAddActModal(true)}
            className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2 px-4 shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Aktivitas Magang</span>
          </button>
        </div>

        {/* LIST AKTIVITAS MAGANG */}
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <span className="text-xs font-black text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 font-mono">
                  {act.hariTanggal}
                </span>

                {act.isVerified ? (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terverifikasi TTD Pembimbing</span>
                  </span>
                ) : (
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Menunggu Verifikasi Pembimbing</span>
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-900">{act.aktivitas}</h4>
                {act.catatan && (
                  <p className="text-xs text-slate-600 font-semibold mt-1">Catatan: &ldquo;{act.catatan}&rdquo;</p>
                )}
              </div>

              {act.fotoUrl && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Foto Dokumentasi Kegiatan:</span>
                  <a href={act.fotoUrl} target="_blank" rel="noreferrer" className="inline-block group">
                    <img src={act.fotoUrl} alt="Dokumentasi Kegiatan" className="h-28 w-44 object-cover rounded-xl border border-slate-300 shadow-sm group-hover:opacity-90 transition-opacity" />
                  </a>
                </div>
              )}

              {/* TTD STAMP DISPLAY WHEN VERIFIED */}
              {act.isVerified && (
                <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200 flex items-center gap-3 text-xs shadow-sm">
                  {act.supervisorTtdUrl && (
                    <img src={act.supervisorTtdUrl} alt="TTD Pembimbing" className="h-10 w-20 object-contain border-r border-slate-200 pr-2" />
                  )}
                  <div>
                    <div className="font-black text-slate-900">{act.supervisorName || pembimbingNama}</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Terverifikasi Sah • {act.verifiedAt}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Upload Laporan Akhir Magang & Verifikasi */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              <span>Upload Laporan Akhir Magang & PKL MTPD (PDF)</span>
            </h3>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Laporan disahkan oleh Pembimbing Lapangan di akhir masa magang 4 bulan.</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-black border border-emerald-500/20 shadow-sm">
            Status: {statusVerifikasi}
          </span>
        </div>

        {uploadedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black text-center">
            Laporan Akhir Magang berhasil diunggah!
          </div>
        )}

        <form onSubmit={handleSubmitLaporan} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Judul Laporan Akhir *</label>
            <input
              type="text"
              required
              value={judulLaporan}
              onChange={(e) => setJudulLaporan(e.target.value)}
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">URL / File Laporan Akhir PDF *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={laporanPdfUrl}
                onChange={(e) => setLaporanPdfUrl(e.target.value)}
                className="flex-1 glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
              <a
                href={laporanPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 text-xs font-extrabold flex items-center gap-1.5 shrink-0 border border-slate-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Pratinjau PDF</span>
              </a>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6">
              <Upload className="w-4 h-4" />
              <span>Unggah Laporan Akhir Magang</span>
            </button>
          </div>
        </form>

        {catatanPembimbing && (
          <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-1 mt-4">
            <div className="font-black text-sky-700">Catatan Evaluasi Pembimbing Lapangan:</div>
            <div className="text-slate-800 font-semibold italic">&ldquo;{catatanPembimbing}&rdquo;</div>
          </div>
        )}
      </div>

      {/* MODAL TAMBAH AKTIVITAS MAGANG BULANAN */}
      {showAddActModal && (
        <Modal isOpen={showAddActModal} onClose={() => setShowAddActModal(false)} title="Tambah Aktivitas Magang Bulanan">
          <form onSubmit={handleAddActivity} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Hari, Tanggal *</label>
              <input
                type="text"
                required
                value={hariTanggalInput}
                onChange={(e) => setHariTanggalInput(e.target.value)}
                placeholder="Contoh: Senin, 02 Maret 2026"
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Uraian Aktivitas / Kegiatan Magang *</label>
              <textarea
                rows={3}
                required
                value={aktivitasInput}
                onChange={(e) => setAktivitasInput(e.target.value)}
                placeholder="Uraikan aktivitas atau pekerjaan teknis yang dilakukan di instansi tempat magang..."
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Foto Dokumentasi (Upload / URL File) *</label>
              <input
                type="text"
                value={fotoUrlInput}
                onChange={(e) => setFotoUrlInput(e.target.value)}
                placeholder="https://... / Foto_Kegiatan.jpg (Opsional)"
                className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Catatan Tambahan (Opsional)</label>
              <input
                type="text"
                value={catatanInput}
                onChange={(e) => setCatatanInput(e.target.value)}
                placeholder="Contoh: Didampingi Teknisi Senior Bea Cukai"
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddActModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6">
                Simpan Aktivitas Magang
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL PRINTABLE OFFICIAL REPORT WITH TTD EMBEDDED */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="glass-panel w-full max-w-3xl p-8 space-y-6 border border-slate-300 shadow-2xl relative bg-white text-slate-900 rounded-3xl print:p-0 print:border-none print:shadow-none">
            {/* Header Action Bar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div className="font-black text-slate-900 text-base">Pratinjau Cetak Laporan Aktivitas Magang & PKL</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerPrint}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Cetak PDF</span>
                </button>
                <button onClick={() => setShowPrintModal(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 font-bold">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE DOCUMENT BODY */}
            <div className="space-y-6 text-xs sm:text-sm">
              {/* KOP RESMI */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">Politeknik Transportasi Sungai, Danau, & Penyeberangan Palembang</h2>
                <h3 className="text-sm font-bold uppercase tracking-wide text-sky-900 mt-0.5">Program Studi Manajemen Transportasi Perairan Daratan (MTPD)</h3>
                <p className="text-xs font-semibold text-slate-600 mt-1">LEMBAR LAPORAN AKTIVITAS MAGANG & PKL BULANAN</p>
              </div>

              {/* INFORMASI KELOMPOK */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 font-semibold text-xs">
                <div>
                  <div><span className="text-slate-500 font-normal">Nama Kelompok:</span> <strong className="font-black text-slate-900">{namaKelompok}</strong></div>
                  <div><span className="text-slate-500 font-normal">Instansi Magang:</span> <strong>{tempatMagang}</strong></div>
                  <div><span className="text-slate-500 font-normal">Nomor SK:</span> <strong className="font-mono text-sky-800">{nomorSk}</strong></div>
                </div>
                <div>
                  <div><span className="text-slate-500 font-normal">Anggota Mahasiswa:</span> <strong>{anggotaText}</strong></div>
                  <div><span className="text-slate-500 font-normal">Pembimbing Lapangan:</span> <strong>{pembimbingNama}</strong></div>
                </div>
              </div>

              {/* TABEL AKTIVITAS */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 font-extrabold uppercase border-b border-slate-300">
                      <th className="py-2.5 px-3 border-r border-slate-300 w-12 text-center">No</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-36">Hari, Tanggal</th>
                      <th className="py-2.5 px-3 border-r border-slate-300">Uraian Aktivitas / Kegiatan</th>
                      <th className="py-2.5 px-3 border-r border-slate-300 w-32">Status Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {activities.map((act, index) => (
                      <tr key={act.id} className="font-medium text-slate-900">
                        <td className="py-3 px-3 border-r border-slate-200 text-center font-bold">{index + 1}</td>
                        <td className="py-3 px-3 border-r border-slate-200 font-bold font-mono text-[11px]">{act.hariTanggal}</td>
                        <td className="py-3 px-3 border-r border-slate-200">
                          <div className="font-bold text-slate-900">{act.aktivitas}</div>
                          {act.catatan && <div className="text-[11px] text-slate-600 italic mt-0.5">Catatan: {act.catatan}</div>}
                        </td>
                        <td className="py-3 px-3 border-r border-slate-200 text-center font-bold">
                          {act.isVerified ? (
                            <span className="text-emerald-700 font-black">✔ TERVERIFIKASI SAH</span>
                          ) : (
                            <span className="text-amber-600 italic">BELUM VERIFIKASI</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* LEMBAR PENGESAHAN DENGAN TTD EMBEDDED */}
              <div className="pt-6 flex justify-end">
                <div className="text-center w-64 space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Palembang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p className="text-xs font-black uppercase text-slate-900">Pembimbing Lapangan Instansi,</p>
                  
                  {/* GAMBAR TTD EMBEDDED */}
                  <div className="h-20 flex items-center justify-center py-1">
                    {pembimbingTtdUrl ? (
                      <img src={pembimbingTtdUrl} alt="TTD Pembimbing" className="h-16 w-32 object-contain" />
                    ) : (
                      <div className="h-16 text-[10px] text-slate-400 flex items-center justify-center italic">[TTD Digital]</div>
                    )}
                  </div>

                  {/* NAMA LENGKAP PEMBIMBING */}
                  <div>
                    <div className="font-black text-slate-900 underline text-sm uppercase">{pembimbingNama}</div>
                    <div className="text-[11px] font-bold text-slate-600">Supervisor / Pembimbing Lapangan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
