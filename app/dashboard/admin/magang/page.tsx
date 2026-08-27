'use client';

import React, { useState } from 'react';
import { Briefcase, Plus, FileText, UserCheck, CheckCircle2, Upload } from 'lucide-react';
import { Modal } from '@/components/Modal';

export default function AdminMagangPage() {
  const [kelompoks, setKelompoks] = useState([
    {
      id: 'kel-1',
      namaKelompok: 'Kelompok MTPD 01 - PT PELNI Palembang',
      nomorSk: 'SK/MTPD/2026/004',
      tempatMagang: 'PT PELNI Cabang Palembang',
      pembimbingLapangan: 'Hendra Gunawan (PT PELNI)',
      anggota: ['Bambang Pratama (2102011)', 'Siti Rahma (2102012)'],
      fileSkUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaKelompok, setNamaKelompok] = useState('');
  const [nomorSk, setNomorSk] = useState('');
  const [tempatMagang, setTempatMagang] = useState('');
  const [pembimbingNama, setPembimbingNama] = useState('');

  const handleCreateKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelompok || !tempatMagang) return;
    setKelompoks([
      ...kelompoks,
      {
        id: `kel-${Date.now()}`,
        namaKelompok,
        nomorSk,
        tempatMagang,
        pembimbingLapangan: pembimbingNama || 'Pembimbing Lapangan Instansi',
        anggota: ['Bambang Pratama (2102011)'],
        fileSkUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ]);
    setNamaKelompok('');
    setNomorSk('');
    setTempatMagang('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-sky-400" />
            <span>Ploting Kelompok Magang & PKL MTPD (Durasi 4 Bulan)</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Khusus Prodi MTPD: Kelola ploting kelompok mahasiswa, nomor & file SK Magang PDF, lokasi tempat magang, dan penugasan Pembimbing Lapangan.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5">
          <Plus className="w-4 h-4" />
          <span>Ploting Kelompok Baru</span>
        </button>
      </div>

      {/* List Kelompok Magang */}
      <div className="space-y-4">
        {kelompoks.map((kel) => (
          <div key={kel.id} className="glass-panel p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 uppercase">
                  Prodi MTPD &bull; 4 Bulan
                </span>
                <h3 className="text-base font-bold text-white mt-1">{kel.namaKelompok}</h3>
                <p className="text-xs text-slate-400">Tempat Magang: <strong className="text-slate-200">{kel.tempatMagang}</strong></p>
              </div>

              <a
                href={kel.fileSkUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-semibold text-sky-400 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <FileText className="w-4 h-4" />
                <span>Lihat SK Magang (PDF)</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-1">Pembimbing Lapangan:</span>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 font-medium text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>{kel.pembimbingLapangan}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">Anggota Kelompok Mahasiswa:</span>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300">
                  {kel.anggota.join(', ')}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ploting Kelompok Baru */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ploting Kelompok Magang & PKL MTPD">
        <form onSubmit={handleCreateKelompok} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Kelompok Magang *</label>
            <input
              type="text"
              required
              value={namaKelompok}
              onChange={(e) => setNamaKelompok(e.target.value)}
              placeholder="Contoh: Kelompok MTPD 02 - Pelabuhan Boom Baru"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nomor SK Magang</label>
            <input
              type="text"
              value={nomorSk}
              onChange={(e) => setNomorSk(e.target.value)}
              placeholder="Contoh: SK/MTPD/2026/005"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Tempat Magang & PKL *</label>
            <input
              type="text"
              required
              value={tempatMagang}
              onChange={(e) => setTempatMagang(e.target.value)}
              placeholder="Contoh: PT Pelindo Cabang Palembang"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Pembimbing Lapangan Instansi</label>
            <input
              type="text"
              value={pembimbingNama}
              onChange={(e) => setPembimbingNama(e.target.value)}
              placeholder="Contoh: Dra. Ratna Dewi (PT Pelindo)"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs">
              Simpan Ploting Kelompok
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
