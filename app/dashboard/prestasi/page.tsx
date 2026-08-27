'use client';

import React, { useState } from 'react';
import { Trophy, Plus, Upload, CheckCircle2, Award, ExternalLink } from 'lucide-react';
import { initialAchievements, Achievement } from '@/lib/mockStore';
import { Modal } from '@/components/Modal';

export default function StudentPrestasiPage() {
  const [myAchievements, setMyAchievements] = useState<Achievement[]>(
    initialAchievements.filter((a) => a.mahasiswaId === 'user-mhs-1')
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [namaEvent, setNamaEvent] = useState('');
  const [jenisPrestasi, setJenisPrestasi] = useState<'Akademik' | 'Non-Akademik'>('Akademik');
  const [tingkat, setTingkat] = useState<'Lokal' | 'Regional' | 'Nasional' | 'Internasional'>('Nasional');
  const [capaian, setCapaian] = useState('Juara 1');
  const [penyelenggara, setPenyelenggara] = useState('');
  const [fileBuktiUrl, setFileBuktiUrl] = useState('');

  const handleSubmitMandiri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaEvent) return;
    const newAch: Achievement = {
      id: `ach-mhs-${Date.now()}`,
      mahasiswaId: 'user-mhs-1',
      mahasiswaNama: 'Ahmad Fauzi',
      namaEvent,
      jenisPrestasi,
      tingkat,
      capaian,
      penyelenggara: penyelenggara || 'Panitia Event',
      tanggalKegiatan: new Date().toISOString().split('T')[0],
      fileBuktiUrl: fileBuktiUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      statusVerifikasi: 'Pending',
    };
    setMyAchievements([...myAchievements, newAch]);
    setNamaEvent('');
    setPenyelenggara('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Pengajuan Mandiri & Showcase Prestasi Mahasiswa</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Ajukan prestasi akademik atau non-akademik yang telah Anda raih. Prestasi terverifikasi akan dipajang di Hall of Fame Dashboard Utama.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" />
          <span>Ajukan Prestasi Saya</span>
        </button>
      </div>

      {/* List My Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAchievements.map((ach) => (
          <div key={ach.id} className="glass-panel p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {ach.jenisPrestasi} &bull; {ach.tingkat}
              </span>

              {ach.statusVerifikasi === 'APPROVED' && (
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  Terverifikasi (Hall of Fame)
                </span>
              )}
              {ach.statusVerifikasi === 'Pending' && (
                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Verifikasi Admin
                </span>
              )}
            </div>

            <h3 className="font-bold text-base text-white">{ach.namaEvent}</h3>
            <p className="text-xs text-slate-400">Penyelenggara: {ach.penyelenggara}</p>
            <p className="text-sm font-bold text-amber-400">Capaian: {ach.capaian}</p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-500">{ach.tanggalKegiatan}</span>
              <a
                href={ach.fileBuktiUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-400 font-semibold flex items-center gap-1 hover:underline text-[11px]"
              >
                <span>Lihat Sertifikat</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Submit Mandiri */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Pengajuan Mandiri Prestasi Mahasiswa">
        <form onSubmit={handleSubmitMandiri} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-200 mb-1">Nama Lomba / Event / Kegiatan *</label>
            <input
              type="text"
              required
              value={namaEvent}
              onChange={(e) => setNamaEvent(e.target.value)}
              placeholder="Contoh: Lomba Inovasi Maritime Student Challenge 2026"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-200 mb-1">Jenis Prestasi</label>
              <select
                value={jenisPrestasi}
                onChange={(e: any) => setJenisPrestasi(e.target.value)}
                className="w-full glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Akademik">Akademik</option>
                <option value="Non-Akademik">Non-Akademik</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-200 mb-1">Tingkat Prestasi</label>
              <select
                value={tingkat}
                onChange={(e: any) => setTingkat(e.target.value)}
                className="w-full glass-input text-xs bg-slate-900 text-white"
              >
                <option value="Lokal">Lokal</option>
                <option value="Regional">Regional</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Capaian / Juara *</label>
            <input
              type="text"
              required
              value={capaian}
              onChange={(e) => setCapaian(e.target.value)}
              placeholder="Contoh: Juara 1 / Medali Emas"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">Penyelenggara Kegiatan</label>
            <input
              type="text"
              value={penyelenggara}
              onChange={(e) => setPenyelenggara(e.target.value)}
              placeholder="Contoh: Kementerian Perhubungan / WMU"
              className="w-full glass-input text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-200 mb-1">URL / File Scan Sertifikat Bukti (PDF / Foto) *</label>
            <input
              type="text"
              required
              value={fileBuktiUrl}
              onChange={(e) => setFileBuktiUrl(e.target.value)}
              placeholder="Masukkan URL Sertifikat / Bukti Foto"
              className="w-full glass-input text-xs"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button type="submit" className="glass-button text-xs flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Kirim Pengajuan Prestasi</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
