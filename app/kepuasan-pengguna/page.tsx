'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { Smile, CheckCircle2, ArrowRight, ArrowLeft, Send, Sparkles } from 'lucide-react';

export default function KepuasanPenggunaPublicPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Step 1: Identitas
  const [namaAtasan, setNamaAtasan] = useState('');
  const [jabatanAtasan, setJabatanAtasan] = useState('');
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  const [namaAlumni, setNamaAlumni] = useState('');

  // Form Step 2: 7 Indikator (1-4: Sangat Baik=4, Baik=3, Cukup=2, Kurang=1)
  const [scores, setScores] = useState<{ [key: string]: number }>({
    etika: 4,
    kompetensi: 4,
    bahasaAsing: 4,
    teknologiInformasi: 4,
    komunikasi: 4,
    kerjasamaTim: 4,
    pengembanganDiri: 4,
  });

  const indikators = [
    { key: 'etika', title: '1. Etika', desc: 'Pembinaan etika, disiplin, integritas, dan kepatuhan keselamatan.' },
    { key: 'kompetensi', title: '2. Keahlian pada Bidang Ilmu (Kompetensi Utama)', desc: 'Penguasaan kompetensi inti dan ketrampilan teknis pekerjaan.' },
    { key: 'bahasaAsing', title: '3. Kemampuan Berbahasa Asing', desc: 'Bahasa Inggris terapan, percakapan profesional, dan korespondensi.' },
    { key: 'teknologiInformasi', title: '4. Penggunaan Teknologi Informasi', desc: 'Pemanfaatan software, aplikasi pengolahan data, dan sistem transportasi.' },
    { key: 'komunikasi', title: '5. Kemampuan Berkomunikasi', desc: 'Komunikasi lisan dan tulisan, presentasi, serta layanan pelanggan.' },
    { key: 'kerjasamaTim', title: '6. Kerjasama Tim', desc: 'Kemampuan kerja sama tim, proyek kelompok, dan kepemimpinan.' },
    { key: 'pengembanganDiri', title: '7. Pengembangan Diri', desc: 'Inisiatif pengembangan diri, kesiapan belajar hal baru, dan adaptabilitas.' },
  ];

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAtasan || !jabatanAtasan || !namaPerusahaan || !namaAlumni) return;
    setStep(2);
  };

  const handleSubmitFinal = () => {
    // Save to local storage or state mock
    const existing = JSON.parse(localStorage.getItem('siakal_kepuasan_public') || '[]');
    existing.push({
      namaAtasan,
      jabatanAtasan,
      namaPerusahaan,
      namaAlumni,
      scores,
      submittedAt: new Date().toISOString(),
    });
    localStorage.setItem('siakal_kepuasan_public', JSON.stringify(existing));
    setStep(3);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-100">
      <LandingSlider />
      <Navbar />

      <main className="relative z-10 max-w-3xl w-full mx-auto px-4 py-12 flex-1 flex items-center justify-center">
        <div className="glass-panel w-full p-6 sm:p-8 border border-white/20 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-2">
              <Smile className="w-4 h-4" />
              <span>Survei Bebas Login untuk Pengguna Lulusan</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Kuesioner Kepuasan Pengguna Lulusan
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Politeknik Transportasi SDP Palembang &bull; Evaluasi Pengembangan Kualitas Lulusan
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-4 mb-8 border-b border-white/10 pb-4">
            <div className={`flex items-center gap-2 text-xs font-bold ${step === 1 ? 'text-sky-400' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? 'bg-sky-500 text-white' : 'bg-slate-800'}`}>1</span>
              <span>Identitas Pengisi</span>
            </div>
            <div className="w-8 h-[1px] bg-white/20" />
            <div className={`flex items-center gap-2 text-xs font-bold ${step === 2 ? 'text-sky-400' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-sky-500 text-white' : 'bg-slate-800'}`}>2</span>
              <span>7 Indikator Penilaian</span>
            </div>
          </div>

          {/* STEP 1: IDENTITAS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Atasan / Pengisi Kuesioner *</label>
                <input
                  type="text"
                  required
                  value={namaAtasan}
                  onChange={(e) => setNamaAtasan(e.target.value)}
                  placeholder="Contoh: Capt. Hendra Gunawan"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Jabatan Atasan *</label>
                <input
                  type="text"
                  required
                  value={jabatanAtasan}
                  onChange={(e) => setJabatanAtasan(e.target.value)}
                  placeholder="Contoh: General Manager / Crewing Manager"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Perusahaan / Instansi *</label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
                  className="w-full glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Nama Alumni yang Dinilai *</label>
                <input
                  type="text"
                  required
                  value={namaAlumni}
                  onChange={(e) => setNamaAlumni(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi, A.Md.Tra."
                  className="w-full glass-input text-xs"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="glass-button text-xs flex items-center gap-2">
                  <span>Lanjut ke Pengisian Kuesioner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: 7 INDIKATOR PENILAIAN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300">
                Memberikan penilaian alumni atas nama <strong className="text-white">{namaAlumni}</strong> di <strong className="text-white">{namaPerusahaan}</strong>.
              </div>

              <div className="space-y-5">
                {indikators.map((ind) => (
                  <div key={ind.key} className="p-4 rounded-xl bg-slate-900/40 border border-white/10 space-y-2">
                    <div className="font-bold text-sm text-sky-300">{ind.title}</div>
                    <p className="text-xs text-slate-400">{ind.desc}</p>

                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        { score: 4, label: 'Sangat Baik' },
                        { score: 3, label: 'Baik' },
                        { score: 2, label: 'Cukup' },
                        { score: 1, label: 'Kurang' },
                      ].map((opt) => (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => setScores({ ...scores, [ind.key]: opt.score })}
                          className={`py-2 px-1 rounded-lg text-xs font-medium border text-center transition-all ${
                            scores[ind.key] === opt.score
                              ? 'bg-sky-500 text-white border-sky-400 font-bold shadow-md'
                              : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-white/30'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button onClick={handleSubmitFinal} className="glass-button text-xs flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Kirim Kuesioner Kepuasan</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUKSES */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-extrabold text-white">Terima Kasih Atas Partisipasi Anda!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Data penilaian Kuesioner Kepuasan Pengguna Lulusan telah berhasil disimpan. Masukan Anda sangat berharga bagi evaluasi dan pengembangan mutu lulusan Politeknik Transportasi SDP Palembang.
              </p>
              <div className="pt-4">
                <Link href="/" className="glass-button text-xs">
                  Kembali ke Halaman Utama
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
