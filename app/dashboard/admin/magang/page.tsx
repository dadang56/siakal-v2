'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, FileText, Upload, CheckCircle2, UserPlus, Trash2, AlertTriangle } from 'lucide-react';

export default function AdminMagangPage() {
  const [kelompoks, setKelompoks] = useState([
    {
      id: 'klp-1',
      namaKelompok: 'Kelompok 01 - Pelabuhan Palembang',
      nomorSkMagang: 'SK/MTPD/2026/004',
      fileSkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tempatMagang: 'PT Pelabuhan Indonesia (Pelindo) Regional 2 Palembang',
      alamatTempatMagang: 'Jl. Mayor Memet Sastrawirya No.1, Palembang',
      pembimbingLapanganNama: 'Hendra Gunawan, S.T.',
      pembimbingLapanganEmail: 'supervisor@pelindo.co.id',
      anggotaMahasiswa: [
        { id: 'mhs-1', nama: 'Bambang Pratama', nim: '2102011' },
        { id: 'mhs-2', nama: 'Siti Rahmawati', nim: '2102012' },
      ],
      laporanJudul: 'Analisis Arus Logistik Kapal Roro di Pelabuhan Palembang',
      laporanPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      laporanStatus: 'Pending',
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [namaKelompok, setNamaKelompok] = useState('');
  const [nomorSk, setNomorSk] = useState('');
  const [tempatMagang, setTempatMagang] = useState('');
  const [pembimbingNama, setPembimbingNama] = useState('');
  const [pembimbingEmail, setPembimbingEmail] = useState('');

  const handleAddKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    const newKlp = {
      id: `klp-${Date.now()}`,
      namaKelompok,
      nomorSkMagang: nomorSk,
      fileSkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tempatMagang,
      alamatTempatMagang: 'Palembang',
      pembimbingLapanganNama: pembimbingNama,
      pembimbingLapanganEmail: pembimbingEmail,
      anggotaMahasiswa: [{ id: 'mhs-new', nama: 'Mahasiswa MTPD Baru', nim: '2102099' }],
      laporanJudul: 'Laporan Magang MTPD',
      laporanPdfUrl: '',
      laporanStatus: 'Pending',
    };

    setKelompoks([...kelompoks, newKlp]);
    setShowModal(false);
  };

  const confirmDeleteKelompok = () => {
    if (!deleteTargetId) return;
    setKelompoks(kelompoks.filter((k) => k.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Ploting Kelompok Magang & PKL MTPD (4 Bulan)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
            Kelola ploting kelompok mahasiswa MTPD, tempat magang, pengesahan SK Magang PDF, dan penetapan akun Pembimbing Lapangan.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-lg">
          <Plus className="w-4 h-4" />
          <span>Buat Ploting Kelompok</span>
        </button>
      </div>

      {/* List Kelompok Magang */}
      <div className="space-y-4">
        {kelompoks.map((klp) => (
          <div key={klp.id} className="glass-panel p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30">
                  {klp.nomorSkMagang}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">{klp.namaKelompok}</h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold">{klp.tempatMagang}</p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={klp.fileSkPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-sm border border-slate-300 dark:border-white/10"
                >
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span>File SK Magang PDF</span>
                </a>
                <button
                  onClick={() => setDeleteTargetId(klp.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Hapus Kelompok"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Anggota Kelompok Mahasiswa:</h4>
                <ul className="space-y-1.5">
                  {klp.anggotaMahasiswa.map((m) => (
                    <li key={m.id} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 flex items-center justify-between font-medium">
                      <span className="font-bold text-slate-900 dark:text-white">{m.nama}</span>
                      <span className="font-mono text-slate-600 dark:text-slate-400">NIM: {m.nim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-xs">Pembimbing Lapangan:</h4>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-1 font-medium">
                  <div className="font-bold text-slate-900 dark:text-white">{klp.pembimbingLapanganNama}</div>
                  <div className="text-slate-600 dark:text-slate-300 font-mono text-xs">{klp.pembimbingLapanganEmail}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Ploting */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-lg p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-white/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Buat Ploting Kelompok Magang MTPD</h3>

            <form onSubmit={handleAddKelompok} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Kelompok</label>
                <input
                  type="text"
                  required
                  value={namaKelompok}
                  onChange={(e) => setNamaKelompok(e.target.value)}
                  placeholder="Contoh: Kelompok 02 - Pelabuhan Boom Baru"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nomor SK Magang</label>
                <input
                  type="text"
                  required
                  value={nomorSk}
                  onChange={(e) => setNomorSk(e.target.value)}
                  placeholder="Contoh: SK/MTPD/2026/005"
                  className="w-full glass-input"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Tempat Magang & Instansi</label>
                <input
                  type="text"
                  required
                  value={tempatMagang}
                  onChange={(e) => setTempatMagang(e.target.value)}
                  placeholder="Contoh: PT Pelindo Regional 2 Palembang"
                  className="w-full glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Nama Pembimbing Lapangan</label>
                  <input
                    type="text"
                    required
                    value={pembimbingNama}
                    onChange={(e) => setPembimbingNama(e.target.value)}
                    placeholder="Nama Pembimbing"
                    className="w-full glass-input"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">Email Pembimbing</label>
                  <input
                    type="email"
                    required
                    value={pembimbingEmail}
                    onChange={(e) => setPembimbingEmail(e.target.value)}
                    placeholder="email@instansi.com"
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
                  Simpan Ploting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL KONFIRMASI HAPUS */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="glass-panel bg-white dark:bg-slate-900 w-full max-w-sm p-6 space-y-4 shadow-2xl border border-red-500/30 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Konfirmasi Hapus Ploting Magang</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Apakah Anda yakin ingin menghapus kelompok magang ini? Data ploting anggota dan SK akan terhapus.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteKelompok}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg"
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
