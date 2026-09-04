'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Plus, Upload, FileText, CheckCircle2, Clock, ExternalLink, Calendar, AlertTriangle, MessageSquare, ShieldCheck, Check, Edit3 } from 'lucide-react';
import { Modal } from '@/components/Modal';

export interface TrbReportStage {
  stageNumber: number; // 1, 2, 3, 4
  title: string;
  monthsAfterStart: number;
  deadlineDate: string; // YYYY-MM-DD
  uploadedDate?: string; // YYYY-MM-DD
  trbPdfUrl?: string;
  isOnTime?: boolean;
  statusDosen: 'MENUNGGU_VERIFIKASI' | 'DISENTUJUI' | 'REVISI';
  catatanDosen?: string;
}

export default function PralaBimbinganPage() {
  const [tanggalMulaiPrala, setTanggalMulaiPrala] = useState('2025-09-01');
  const [dosenNama, setDosenNama] = useState('Capt. Budi Santoso, M.Mar.');

  // 4 Quarterly TRB Reports State
  const [reports, setReports] = useState<TrbReportStage[]>([
    {
      stageNumber: 1,
      title: 'Laporan TRB 1 (Bulan Ke-3)',
      monthsAfterStart: 3,
      deadlineDate: '2025-12-01',
      uploadedDate: '2025-11-28',
      trbPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      isOnTime: true,
      statusDosen: 'DISENTUJUI',
      catatanDosen: 'Jurnal harian pelayaran dan olah gerak kapal lengkap dan ditandatangani Perwira.',
    },
    {
      stageNumber: 2,
      title: 'Laporan TRB 2 (Bulan Ke-6)',
      monthsAfterStart: 6,
      deadlineDate: '2026-03-01',
      uploadedDate: '2026-03-05',
      trbPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      isOnTime: false, // Terlambat 4 hari
      statusDosen: 'DISENTUJUI',
      catatanDosen: 'Laporan TRB semester 1 disetujui. Perhatikan ketepatan waktu pelaporan berikutnya.',
    },
    {
      stageNumber: 3,
      title: 'Laporan TRB 3 (Bulan Ke-9)',
      monthsAfterStart: 9,
      deadlineDate: '2026-06-01',
      uploadedDate: undefined,
      trbPdfUrl: undefined,
      isOnTime: undefined,
      statusDosen: 'MENUNGGU_VERIFIKASI',
      catatanDosen: undefined,
    },
    {
      stageNumber: 4,
      title: 'Laporan TRB 4 (Bulan Ke-12 / Akhir PRALA)',
      monthsAfterStart: 12,
      deadlineDate: '2026-09-01',
      uploadedDate: undefined,
      trbPdfUrl: undefined,
      isOnTime: undefined,
      statusDosen: 'MENUNGGU_VERIFIKASI',
      catatanDosen: undefined,
    },
  ]);

  // Modal State for Upload TRB PDF per Stage
  const [selectedStage, setSelectedStage] = useState<TrbReportStage | null>(null);
  const [pdfInputUrl, setPdfInputUrl] = useState('');
  const [catatanMahasiswa, setCatatanMahasiswa] = useState('');

  // Modal State for Dosen Verification Mode
  const [dosenVerifyStage, setDosenVerifyStage] = useState<TrbReportStage | null>(null);
  const [dosenStatusInput, setDosenStatusInput] = useState<'DISENTUJUI' | 'REVISI'>('DISENTUJUI');
  const [dosenCatatanInput, setDosenCatatanInput] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_prala_student_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.tanggalMulaiPrala) {
          setTanggalMulaiPrala(parsed.tanggalMulaiPrala);
          // Recalculate deadlines based on start date
          const startDate = new Date(parsed.tanggalMulaiPrala);
          setReports((prev) =>
            prev.map((rep) => {
              const d = new Date(startDate);
              d.setMonth(d.getMonth() + rep.monthsAfterStart);
              const deadlineStr = d.toISOString().split('T')[0];
              return { ...rep, deadlineDate: deadlineStr };
            })
          );
        }
      }
    } catch (e) {}
  }, []);

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStage || !pdfInputUrl) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const isOnTime = todayStr <= selectedStage.deadlineDate;

    const updated = reports.map((r) => {
      if (r.stageNumber === selectedStage.stageNumber) {
        return {
          ...r,
          uploadedDate: todayStr,
          trbPdfUrl: pdfInputUrl,
          isOnTime: isOnTime,
          statusDosen: 'MENUNGGU_VERIFIKASI' as const,
        };
      }
      return r;
    });

    setReports(updated);
    setSelectedStage(null);
    setPdfInputUrl('');
    setCatatanMahasiswa('');
    alert(`Laporan TRB Stage ${selectedStage.stageNumber} berhasil diunggah! Status: ${isOnTime ? 'On-Time (Tepat Waktu)' : 'Terlambat'}`);
  };

  const handleSaveDosenVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dosenVerifyStage) return;

    const updated = reports.map((r) => {
      if (r.stageNumber === dosenVerifyStage.stageNumber) {
        return {
          ...r,
          statusDosen: dosenStatusInput,
          catatanDosen: dosenCatatanInput || 'Telah diperiksa dan diverifikasi Dosen Pembimbing.',
        };
      }
      return r;
    });

    setReports(updated);
    setDosenVerifyStage(null);
    setDosenCatatanInput('');
    alert(`Verifikasi Dosen Pembimbing untuk Laporan Stage ${dosenVerifyStage.stageNumber} berhasil disimpan!`);
  };

  // Calculate overall progress (completed / 4)
  const completedCount = reports.filter((r) => r.uploadedDate).length;
  const onTimeCount = reports.filter((r) => r.uploadedDate && r.isOnTime).length;
  const lateCount = reports.filter((r) => r.uploadedDate && !r.isOnTime).length;

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Bimbingan PRALA & Monitoring 4 Laporan TRB (Per 3 Bulan)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Mahasiswa wajib melaporkan progres TRB 4 kali dalam 1 tahun. Dosen Pembimbing mereviu & memverifikasi laporan.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold">
            Tanggal On-Board: <span className="font-mono font-black">{tanggalMulaiPrala}</span>
          </div>
        </div>
      </div>

      {/* Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Total Progres TRB</span>
            <span className="text-xl font-black text-slate-900">{completedCount} / 4 Laporan</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-black text-sm border border-sky-200">
            {Math.round((completedCount / 4) * 100)}%
          </div>
        </div>

        <div className="glass-panel p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Laporan On-Time</span>
            <span className="text-xl font-black text-emerald-700">{onTimeCount} Tepat Waktu</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Laporan Terlambat</span>
            <span className="text-xl font-black text-red-700">{lateCount} Late</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 block uppercase">Dosen Pembimbing</span>
            <span className="text-xs font-black text-indigo-900 truncate block max-w-[140px]">{dosenNama}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 STAGE TRB PROGRESS CARDS LIST */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide flex items-center justify-between">
          <span>Jadwal Pelaporan TRB Berkala (4 Tahap dalam 1 Tahun)</span>
          <span className="text-xs font-bold text-slate-500">Interval: Setiap 3 Bulan Sekali</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((r) => {
            const isUploaded = !!r.trbPdfUrl;

            return (
              <div
                key={r.stageNumber}
                className={`p-5 rounded-2xl border transition-all space-y-3.5 shadow-sm ${
                  isUploaded
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-white border-amber-300 border-l-4 border-l-amber-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 border border-sky-500/20 uppercase">
                    Stage {r.stageNumber} • Bulan Ke-{r.monthsAfterStart}
                  </span>

                  {isUploaded ? (
                    r.isOnTime ? (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>On-Time (Tepat Waktu)</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-800 border border-red-500/20 inline-flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>Terlambat (Late)</span>
                      </span>
                    )
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Belum Upload</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-sm text-slate-900">{r.title}</h4>
                  <div className="mt-1 flex items-center gap-3 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      Deadline: <strong className="font-mono text-slate-900">{r.deadlineDate}</strong>
                    </span>
                    {r.uploadedDate && (
                      <span className="font-mono text-slate-500">
                        • Diunggah: {r.uploadedDate}
                      </span>
                    )}
                  </div>
                </div>

                {/* DOSEN VERIFICATION STATUS & COMMENT */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-indigo-900 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>Status Verifikasi Dosen:</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        r.statusDosen === 'DISENTUJUI'
                          ? 'bg-emerald-500/10 text-emerald-800 border border-emerald-500/20'
                          : r.statusDosen === 'REVISI'
                          ? 'bg-red-500/10 text-red-800 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                      }`}
                    >
                      {r.statusDosen.replace('_', ' ')}
                    </span>
                  </div>

                  {r.catatanDosen ? (
                    <div className="text-slate-700 font-semibold italic bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                      &ldquo;{r.catatanDosen}&rdquo;
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-[11px]">Belum ada catatan dari Dosen Pembimbing.</div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStage(r);
                      setPdfInputUrl(r.trbPdfUrl || '');
                    }}
                    className="glass-button text-xs font-bold py-2 px-3 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploaded ? 'Re-Upload TRB' : 'Upload Laporan TRB'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {r.trbPdfUrl && (
                      <a
                        href={r.trbPdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 font-extrabold text-xs flex items-center gap-1 border border-slate-300"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Pratinjau PDF</span>
                      </a>
                    )}

                    {/* DOSEN QUICK VERIFY BUTTON */}
                    <button
                      type="button"
                      onClick={() => {
                        setDosenVerifyStage(r);
                        setDosenStatusInput(r.statusDosen === 'DISENTUJUI' ? 'DISENTUJUI' : 'DISENTUJUI');
                        setDosenCatatanInput(r.catatanDosen || '');
                      }}
                      className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Verifikasi sebagai Dosen Pembimbing"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Verifikasi Dosen</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL UPLOAD LAPORAN TRB PER TAHAP (MAHASISWA) */}
      {selectedStage && (
        <Modal isOpen={!!selectedStage} onClose={() => setSelectedStage(null)} title={`Upload ${selectedStage.title}`}>
          <form onSubmit={handleUploadReport} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
              <div className="font-black text-slate-900">{selectedStage.title}</div>
              <div className="text-slate-600 font-semibold">
                Deadline Pelaporan: <strong className="font-mono text-slate-900">{selectedStage.deadlineDate}</strong>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">URL / File Scan PDF Dokumen TRB *</label>
              <input
                type="text"
                required
                value={pdfInputUrl}
                onChange={(e) => setPdfInputUrl(e.target.value)}
                placeholder="Masukkan URL/File Scan_TRB_Bulan3.pdf"
                className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Catatan / Ringkasan Progres Mahasiswa</label>
              <textarea
                rows={3}
                value={catatanMahasiswa}
                onChange={(e) => setCatatanMahasiswa(e.target.value)}
                placeholder="Tuliskan ringkasan jurnal harian atau pengamatan di kapal..."
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedStage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6">
                <Upload className="w-4 h-4" />
                <span>Unggah Laporan Stage {selectedStage.stageNumber}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL VERIFIKASI DOSEN PEMBIMBING */}
      {dosenVerifyStage && (
        <Modal isOpen={!!dosenVerifyStage} onClose={() => setDosenVerifyStage(null)} title={`Verifikasi Dosen: ${dosenVerifyStage.title}`}>
          <form onSubmit={handleSaveDosenVerification} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
              <div className="font-black text-slate-900">{dosenVerifyStage.title}</div>
              <div className="text-slate-600 font-semibold">
                Status Pelaporan Mahasiswa: {dosenVerifyStage.isOnTime ? '🟢 On-Time (Tepat Waktu)' : '🔴 Terlambat'}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Hasil Verifikasi Dosen *</label>
              <select
                value={dosenStatusInput}
                onChange={(e: any) => setDosenStatusInput(e.target.value)}
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              >
                <option value="DISENTUJUI">DISENTUJUI (Laporan Sah & Sesuai TRB)</option>
                <option value="REVISI">PERLU REVISI (Lengkapi Jurnal & TTD Perwira)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Catatan & Evaluasi Dosen Pembimbing *</label>
              <textarea
                rows={4}
                required
                value={dosenCatatanInput}
                onChange={(e) => setDosenCatatanInput(e.target.value)}
                placeholder="Berikan komentar evaluasi, arahan, atau catatan revisi..."
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDosenVerifyStage(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6">
                Simpan Verifikasi Dosen
              </button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
}
