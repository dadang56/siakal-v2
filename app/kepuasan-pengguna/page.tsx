'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { LandingSlider } from '@/components/LandingSlider';
import { Smile, CheckCircle2, ArrowRight, ArrowLeft, Send, Search, UserCheck } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function KepuasanPenggunaPublicPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Step 1: Identitas
  const [namaAtasan, setNamaAtasan] = useState('');
  const [jabatanAtasan, setJabatanAtasan] = useState('');
  const [namaPerusahaan, setNamaPerusahaan] = useState('');
  
  // Searchable Alumni Selector State
  const [alumniSearchQuery, setAlumniSearchQuery] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState<UserAccount | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [registeredAlumnis, setRegisteredAlumnis] = useState<UserAccount[]>([]);

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

  useEffect(() => {
    // Load registered alumnis & mahasiswas from localStorage or fallback mock
    let allUsers: UserAccount[] = initialAccounts;
    try {
      const stored = localStorage.getItem('siakal_user_list');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          allUsers = parsed;
        }
      }
    } catch (e) {}

    // Filter only alumni & graduating mahasiswas
    const filtered = allUsers.filter((u) => u.role === 'alumni' || u.role === 'mahasiswa');
    setRegisteredAlumnis(filtered);
  }, []);

  const filteredAlumniOptions = registeredAlumnis.filter((a) => {
    const query = alumniSearchQuery.toLowerCase();
    const nim = a.nim || a.usernameOrId || '';
    const prodi = a.prodi || '';
    return (
      a.fullName.toLowerCase().includes(query) ||
      nim.toLowerCase().includes(query) ||
      prodi.toLowerCase().includes(query)
    );
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

  const handleSelectAlumni = (alumni: UserAccount) => {
    setSelectedAlumni(alumni);
    setAlumniSearchQuery(alumni.fullName);
    setIsDropdownOpen(false);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAtasan || !jabatanAtasan || !namaPerusahaan || (!selectedAlumni && !alumniSearchQuery)) {
      alert('Mohon lengkapi seluruh data identitas dan pilih nama alumni yang dinilai.');
      return;
    }
    setStep(2);
  };

  const handleSubmitFinal = () => {
    try {
      const existing = JSON.parse(localStorage.getItem('siakal_kepuasan_public') || '[]');
      existing.push({
        namaAtasan,
        jabatanAtasan,
        namaPerusahaan,
        alumniId: selectedAlumni?.id || 'custom',
        namaAlumni: selectedAlumni?.fullName || alumniSearchQuery,
        nimAlumni: selectedAlumni?.nim || selectedAlumni?.usernameOrId || '-',
        prodiAlumni: selectedAlumni?.prodi || '-',
        scores,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('siakal_kepuasan_public', JSON.stringify(existing));
    } catch (e) {}
    setStep(3);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-white bg-slate-950 font-sans">
      <LandingSlider />
      <Navbar hideThemeToggle={false} />

      <main className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10 flex-1 flex items-center justify-center">
        {/* Pure Liquid Glass Container Box */}
        <div className="bg-slate-950/35 dark:bg-slate-950/45 backdrop-blur-2xl w-full p-6 sm:p-8 border border-white/30 dark:border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl relative text-white space-y-6">
          
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 backdrop-blur-md border border-amber-300/40 text-amber-300 text-xs font-extrabold mb-2 shadow-md">
              <Smile className="w-4 h-4 text-amber-400" />
              <span>Survei Bebas Login untuk Pengguna Lulusan</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white drop-shadow-md">
              Kuesioner Kepuasan Pengguna Lulusan
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-semibold drop-shadow-sm mt-1">
              Politeknik Transportasi SDP Palembang &bull; Evaluasi Pengembangan Kualitas Lulusan
            </p>
          </div>

          {/* Stepper Header */}
          <div className="flex items-center justify-center gap-4 border-b border-white/20 pb-4">
            <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 1 ? 'text-sky-300' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-sky-500 text-white' : 'bg-white/20 text-white'}`}>1</span>
              <span>Identitas Pengisi</span>
            </div>
            <div className="w-8 h-[1px] bg-white/30" />
            <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 2 ? 'text-sky-300' : 'text-slate-300'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-sky-500 text-white' : 'bg-white/20 text-white'}`}>2</span>
              <span>7 Indikator Penilaian</span>
            </div>
          </div>

          {/* STEP 1: IDENTITAS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-white drop-shadow-sm mb-1.5">
                  Nama Atasan / Pengisi Kuesioner *
                </label>
                <input
                  type="text"
                  required
                  value={namaAtasan}
                  onChange={(e) => setNamaAtasan(e.target.value)}
                  placeholder="Contoh: Capt. Hendra Gunawan"
                  className="w-full px-4 py-3 rounded-xl bg-white/15 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 text-white placeholder-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-400 focus:bg-white/25 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-white drop-shadow-sm mb-1.5">
                  Jabatan Atasan *
                </label>
                <input
                  type="text"
                  required
                  value={jabatanAtasan}
                  onChange={(e) => setJabatanAtasan(e.target.value)}
                  placeholder="Contoh: General Manager / Crewing Manager"
                  className="w-full px-4 py-3 rounded-xl bg-white/15 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 text-white placeholder-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-400 focus:bg-white/25 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-white drop-shadow-sm mb-1.5">
                  Nama Perusahaan / Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
                  className="w-full px-4 py-3 rounded-xl bg-white/15 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 text-white placeholder-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-400 focus:bg-white/25 transition-all shadow-inner"
                />
              </div>

              {/* SEARCHABLE ALUMNI SELECTOR DROPDOWN */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-extrabold text-white drop-shadow-sm mb-1.5 flex items-center justify-between">
                  <span>Cari & Pilih Nama Alumni yang Dinilai *</span>
                  <span className="text-[11px] text-sky-300 font-extrabold">Terhubung Database Alumni</span>
                </label>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" />
                  <input
                    type="text"
                    required
                    value={alumniSearchQuery}
                    onChange={(e) => {
                      setAlumniSearchQuery(e.target.value);
                      setSelectedAlumni(null);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Ketik Nama Alumni atau NIM (cth: Deni Kurniawan / 2001015)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/15 dark:bg-slate-900/50 backdrop-blur-md border border-white/30 text-white placeholder-slate-200 text-xs sm:text-sm font-extrabold focus:outline-none focus:border-sky-400 focus:bg-white/25 transition-all shadow-inner"
                  />
                </div>

                {/* Dropdown Options List */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 max-h-56 overflow-y-auto rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/30 shadow-2xl divide-y divide-white/10 text-white">
                    {filteredAlumniOptions.length > 0 ? (
                      filteredAlumniOptions.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => handleSelectAlumni(a)}
                          className="p-3 hover:bg-sky-500/25 cursor-pointer transition-colors flex items-center justify-between"
                        >
                          <div>
                            <div className="font-extrabold text-white text-xs sm:text-sm">{a.fullName}</div>
                            <div className="text-[11px] text-slate-300 font-mono">
                              NIM: {a.nim || a.usernameOrId || '-'} &bull; {a.prodi || 'Alumni'}
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/40">
                            Pilih
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-xs text-slate-300 text-center font-medium">
                        Nama alumni tidak ada di daftar. Menggunakan masukan manual: <strong className="text-white">{alumniSearchQuery}</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Alumni Confirmation Chip */}
                {selectedAlumni && (
                  <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 flex items-center justify-between text-xs text-emerald-200 font-extrabold">
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>Alumni Terverifikasi: {selectedAlumni.fullName} (NIM: {selectedAlumni.nim || selectedAlumni.usernameOrId})</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">Record Terkunci</span>
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end">
                <button type="submit" className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-3 px-6 shadow-xl">
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
                  <div key={ind.key} className="p-4 rounded-xl bg-white/15 dark:bg-slate-900/50 backdrop-blur-md border border-white/20 space-y-2">
                    <h4 className="font-extrabold text-white text-sm sm:text-base">{ind.title}</h4>
                    <p className="text-xs text-slate-200 font-semibold">{ind.desc}</p>

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
                              ? 'bg-sky-500 text-white border-sky-300 shadow-lg'
                              : 'bg-white/15 text-white border-white/20 hover:bg-white/30'
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
                  className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs flex items-center gap-1.5 border border-white/30"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-3 px-6 shadow-xl"
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
              <div className="w-16 h-16 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Terima Kasih Atas Partisipasi Anda!</h3>
              <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-md mx-auto">
                Hasil evaluasi kepuasan atasan pengguna lulusan telah tersimpan secara resmi untuk {selectedAlumni?.fullName || 'Alumni'} dan terhubung dengan Database Tracer Study.
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

      {/* Transparent Liquid Glass Footbar (Footer) */}
      <footer className="relative z-10 border-t border-white/15 bg-slate-950/30 backdrop-blur-md py-4 text-center text-xs text-white/90 font-semibold drop-shadow-sm">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
