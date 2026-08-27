'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { Smile, CheckCircle2, ArrowRight, ArrowLeft, Send } from 'lucide-react';

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
    { key: 'etika', title: '1. Etika & Kedisiplinan', desc: 'Pembinaan etika, disiplin, integritas, dan kepatuhan keselamatan.' },
    { key: 'kompetensi', title: '2. Keahlian Bidang Ilmu (Kompetensi Utama)', desc: 'Penguasaan kompetensi inti dan ketrampilan teknis pekerjaan.' },
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
    try {
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
    } catch (e) {}
    setStep(3);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-900 dark:text-slate-100 bg-slate-950 font-sans">
      <LandingSlider />
      <Navbar hideThemeToggle={true} />

      <main className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10 flex-1 flex items-center justify-center">
        <div className="glass-panel bg-white/95 dark:bg-slate-900/90 w-full p-6 sm:p-8 border border-slate-200/90 dark:border-white/20 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold mb-2">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Survei Bebas Login untuk Pengguna Lulusan</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Kuesioner Kepuasan Pengguna Lulusan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold mt-1">
              Politeknik Transportasi SDP Palembang &bull; Evaluasi Pengembangan Kualitas Lulusan
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-4">
            <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 1 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>1</span>
              <span>Identitas Pengisi</span>
            </div>
            <div className="w-8 h-[1px] bg-slate-300 dark:bg-white/20" />
            <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 2 ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>2</span>
              <span>7 Indikator Penilaian</span>
            </div>
          </div>

          {/* STEP 1: IDENTITAS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                  Nama Atasan / Pengisi Kuesioner *
                </label>
                <input
                  type="text"
                  required
                  value={namaAtasan}
                  onChange={(e) => setNamaAtasan(e.target.value)}
                  placeholder="Contoh: Capt. Hendra Gunawan"
                  className="w-full glass-input text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                  Jabatan Atasan *
                </label>
                <input
                  type="text"
                  required
                  value={jabatanAtasan}
                  onChange={(e) => setJabatanAtasan(e.target.value)}
                  placeholder="Contoh: General Manager / Crewing Manager"
                  className="w-full glass-input text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                  Nama Perusahaan / Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
                  className="w-full glass-input text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1.5">
                  Nama Alumni yang Dinilai *
                </label>
                <input
                  type="text"
                  required
                  value={namaAlumni}
                  onChange={(e) => setNamaAlumni(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi, A.Md.Tra."
                  className="w-full glass-input text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-3 px-6 shadow-lg">
                  <span>Lanjut ke Pengisian Kuesioner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: 7 INDIKATOR PENILAIAN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {indikators.map((ind) => (
                  <div key={ind.key} className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-white/10 space-y-2">
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">{ind.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{ind.desc}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      {[
                        { val: 4, label: 'Sangat Baik' },
                        { val: 3, label: 'Baik' },
                        { val: 2, label: 'Cukup' },
                        { val: 1, label: 'Kurang' },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setScores({ ...scores, [ind.key]: opt.val })}
                          className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                            scores[ind.key] === opt.val
                              ? 'bg-sky-500 text-white border-sky-400 shadow-md'
                              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:border-sky-500'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-3 px-6 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Evaluasi Kuesioner</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUKSES */}
          {step === 3 && (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Terima Kasih Atas Partisipasi Anda!</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-md mx-auto">
                Hasil evaluasi kepuasan atasan pengguna lulusan telah tersimpan secara resmi untuk bahan perbaikan mutu lulusan Politeknik Transportasi SDP Palembang.
              </p>
              <div className="pt-4">
                <Link href="/" className="glass-button text-xs sm:text-sm font-bold py-2.5 px-6">
                  Kembali ke Halaman Utama
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-4 text-center text-xs text-slate-400 font-medium">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
