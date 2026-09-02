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
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden text-slate-900 bg-slate-50 font-sans">
      <LandingSlider />
      <Navbar hideThemeToggle={true} />

      <main className="relative z-10 max-w-3xl w-full mx-auto px-4 py-10 flex-1 flex items-center justify-center">
        {/* Pure Light Glass Container Box */}
        <div className="glass-panel bg-white/95 backdrop-blur-2xl w-full p-6 sm:p-10 border border-slate-200 shadow-2xl rounded-3xl relative text-slate-900 space-y-6">
          
          {/* Top Bar with Prominent Back to Landing Page Button */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white border border-slate-200 text-slate-800 text-xs font-extrabold transition-all shadow-sm cursor-pointer group"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:text-white transition-colors" />
              <span>Kembali ke Halaman Utama</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs font-extrabold shadow-sm">
              <Smile className="w-4 h-4 text-amber-500" />
              <span>Survei Bebas Login</span>
            </div>
          </div>

          {/* Header Title */}
          <div className="text-center">
            <h1 className="text-xl sm:text-3xl font-black text-slate-900">
              Kuesioner Kepuasan Pengguna Lulusan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              Politeknik Transportasi SDP Palembang &bull; Evaluasi Pengembangan Kualitas Lulusan
            </p>
          </div>

          {/* Stepper Header */}
          {step !== 3 && (
            <div className="flex items-center justify-center gap-4 border-b border-slate-200 pb-4">
              <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 1 ? 'text-sky-600' : 'text-slate-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
                <span>Identitas Pengisi</span>
              </div>
              <div className="w-8 h-[1px] bg-slate-300" />
              <div className={`flex items-center gap-2 text-xs font-extrabold ${step === 2 ? 'text-sky-600' : 'text-slate-500'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
                <span>7 Indikator Penilaian</span>
              </div>
            </div>
          )}

          {/* STEP 1: IDENTITAS */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                  Nama Atasan / Pengisi Kuesioner *
                </label>
                <input
                  type="text"
                  required
                  value={namaAtasan}
                  onChange={(e) => setNamaAtasan(e.target.value)}
                  placeholder="Contoh: Capt. Hendra Gunawan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                  Jabatan Atasan *
                </label>
                <input
                  type="text"
                  required
                  value={jabatanAtasan}
                  onChange={(e) => setJabatanAtasan(e.target.value)}
                  placeholder="Contoh: General Manager / Crewing Manager"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5">
                  Nama Perusahaan / Instansi *
                </label>
                <input
                  type="text"
                  required
                  value={namaPerusahaan}
                  onChange={(e) => setNamaPerusahaan(e.target.value)}
                  placeholder="Contoh: PT PELNI / PT Samudera Indonesia"
                  className="w-full px-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* SEARCHABLE ALUMNI SELECTOR DROPDOWN */}
              <div className="relative">
                <label className="block text-xs sm:text-sm font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Cari & Pilih Nama Alumni yang Dinilai *</span>
                  <span className="text-[11px] text-sky-600 font-extrabold">Terhubung Database Alumni</span>
                </label>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={alumniSearchQuery}
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setAlumniSearchQuery(e.target.value);
                      setSelectedAlumni(null);
                      setIsDropdownOpen(true);
                    }}
                    placeholder="Ketik Nama Alumni atau NIM (cth: Deni Kurniawan / 2001015)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100/90 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs sm:text-sm font-semibold focus:outline-none focus:border-sky-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>

                {/* Dropdown Options List */}
                {isDropdownOpen && filteredAlumniOptions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-30 max-h-56 overflow-y-auto divide-y divide-slate-100 p-1">
                    {filteredAlumniOptions.map((alumni) => (
                      <button
                        key={alumni.id}
                        type="button"
                        onClick={() => handleSelectAlumni(alumni)}
                        className="w-full text-left p-3 hover:bg-sky-50 transition-colors flex items-center justify-between rounded-xl cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900">{alumni.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">NIM: {alumni.nim || alumni.usernameOrId || '-'} &bull; {alumni.prodi || '-'}</div>
                        </div>
                        <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-1 rounded-md">PILIH</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedAlumni && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Alumni Terpilih: <strong>{selectedAlumni.fullName}</strong> ({selectedAlumni.prodi || '-'})</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition-all cursor-pointer"
                >
                  <span>Lanjut ke Penilaian 7 Indikator</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: 7 INDIKATOR PENILAIAN */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                {indikators.map((ind) => (
                  <div key={ind.key} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-sm">
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">{ind.title}</h4>
                      <p className="text-[11px] text-slate-600 font-semibold">{ind.desc}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[
                        { score: 4, label: 'Sangat Baik' },
                        { score: 3, label: 'Baik' },
                        { score: 2, label: 'Cukup' },
                        { score: 1, label: 'Kurang' },
                      ].map((item) => (
                        <button
                          key={item.score}
                          type="button"
                          onClick={() => setScores({ ...scores, [ind.key]: item.score })}
                          className={`py-2 px-1 rounded-xl text-xs font-extrabold transition-all border cursor-pointer ${
                            scores[ind.key] === item.score
                              ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-[1.02]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 px-4 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-colors"
                >
                  Kembali
                </button>

                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  className="w-2/3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Penilaian Kuesioner</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUKSES */}
          {step === 3 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Penilaian Berhasil Dikirim!</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-md mx-auto">
                Terima kasih atas partisipasi Anda dalam pengisian Kuesioner Kepuasan Pengguna Lulusan Politeknik Transportasi SDP Palembang.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setNamaAtasan('');
                    setJabatanAtasan('');
                    setNamaPerusahaan('');
                    setSelectedAlumni(null);
                    setAlumniSearchQuery('');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300"
                >
                  Isi Survei Alumni Lain
                </button>

                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-xs shadow-md hover:from-sky-400 hover:to-blue-500"
                >
                  Kembali ke Halaman Utama
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-200 bg-white/90 backdrop-blur-md py-4 text-center text-xs text-slate-600 font-bold shadow-sm">
        &copy; 2026 SIAKAL &bull; Politeknik Transportasi SDP Palembang
      </footer>
    </div>
  );
}
