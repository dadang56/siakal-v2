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
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500 shrink-0" />
            <span>Pengajuan Mandiri & Showcase Prestasi Mahasiswa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Ajukan prestasi akademik atau non-akademik yang telah Anda raih untuk verifikasi Admin.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Ajukan Prestasi Saya</span>
        </button>
      </div>

      {/* List My Achievements Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAchievements.map((ach) => (
          <div key={ach.id} className="glass-panel p-6 space-y-3 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20">
                {ach.jenisPrestasi} &bull; {ach.tingkat}
              </span>

              {ach.statusVerifikasi === 'APPROVED' && (
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Terverifikasi (Hall of Fame)
                </span>
              )}
              {ach.statusVerifikasi === 'Pending' && (
                <span className="text-[10px] font-black bg-amber-500/10 text-amber-800 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Verifikasi Admin
                </span>
              )}
            </div>

            <h3 className="font-black text-base text-slate-900">{ach.namaEvent}</h3>
            <p className="text-xs text-slate-600 font-semibold">Penyelenggara: {ach.penyelenggara}</p>
            <p className="text-sm font-black text-amber-700">Capaian: {ach.capaian}</p>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono font-bold">{ach.tanggalKegiatan}</span>
              <a
                href={ach.fileBuktiUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 font-bold flex items-center gap-1 hover:underline text-xs"
              >
                <span>Lihat Sertifikat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Submit Mandiri */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Form Pengajuan Mandiri Prestasi Mahasiswa">
        <form onSubmit={handleSubmitMandiri} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Lomba / Event / Kegiatan *</label>
            <input
              type="text"
              required
              value={namaEvent}
              onChange={(e) => setNamaEvent(e.target.value)}
              placeholder="Contoh: Lomba Inovasi Maritime Student Challenge 2026"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Jenis Prestasi</label>
              <select
                value={jenisPrestasi}
                onChange={(e: any) => setJenisPrestasi(e.target.value)}
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              >
                <option value="Akademik">Akademik</option>
                <option value="Non-Akademik">Non-Akademik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Tingkat Prestasi</label>
              <select
                value={tingkat}
                onChange={(e: any) => setTingkat(e.target.value)}
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              >
                <option value="Lokal">Lokal</option>
                <option value="Regional">Regional</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Capaian / Juara *</label>
            <input
              type="text"
              required
              value={capaian}
              onChange={(e) => setCapaian(e.target.value)}
              placeholder="Contoh: Juara 1 / Medali Emas"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">Penyelenggara Kegiatan</label>
            <input
              type="text"
              value={penyelenggara}
              onChange={(e) => setPenyelenggara(e.target.value)}
              placeholder="Contoh: Kementerian Perhubungan / WMU"
              className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">URL / File Scan Sertifikat Bukti *</label>
            <input
              type="text"
              value={fileBuktiUrl}
              onChange={(e) => setFileBuktiUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/... / Bukti.pdf"
              className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6">
              Kirim Pengajuan Prestasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
