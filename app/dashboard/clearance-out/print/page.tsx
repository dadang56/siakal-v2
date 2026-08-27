'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, Printer, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ClearanceOutPrintPage() {
  const approversList = [
    { code: 1, name: 'KEPALA SUBBAGIAN KEUANGAN', approver: 'Dra. Rahmawati, M.M.', nip: '197508122001122001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-1' },
    { code: 2, name: 'KEPALA SUBBAGIAN ADM. KETARUNAAN & ALUMNI', approver: 'Capt. Bambang Santoso, M.Mar.', nip: '198003152006041003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-2' },
    { code: 3, name: 'KEPALA UNIT PERPUSTAKAAN', approver: 'Dra. Sri Wahyuni, M.IP.', nip: '196811201994032002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-3' },
    { code: 4, name: 'KEPALA UNIT LABORATORIUM & BENGKEL', approver: 'Ir. Budi Hermawan, M.T.', nip: '197205101998031004', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-4' },
    { code: 5, name: 'KEPALA UNIT ASRAMA & KONSUMSI', approver: 'Mayor Laut (P) Eko Prasetyo', nip: '198201142008121001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-5' },
    { code: 6, name: 'KETUA PROGRAM STUDI D3 STUDI NAUTIKA', approver: 'Capt. Ahmad Subarjo, M.Mar.', nip: '197804192005011002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-6' },
    { code: 7, name: 'BENDAHARA PENGELUARAN PEMBANTU', approver: 'Siti Aminah, S.E.', nip: '198607222010122003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-7' },
    { code: 8, name: 'PENGELOLA BARANG MILIK NEGARA (BMN)', approver: 'Dedi Kurniawan, A.Md.', nip: '198912052014021001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-8' },
    { code: 9, name: 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (KETARUNAAN)', approver: 'Hendra Gunawan, M.Mar.E.', nip: '198409222009121002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-9' },
    { code: 10, name: 'KABAG ADM. AKADEMIK & KETARUNAAN', approver: 'Ir. Ahmad Yani, M.T.', nip: '197204121998031005', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-10' },
    { code: 11, name: 'UNIT BINTAR (PEMERIKSAAN DISIPLIN)', approver: 'Kapt. Marinir Agus Setiawan', nip: '198106182007011003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-11' },
    { code: 12, name: 'KOORDINATOR KOPERASI SARI MANDIRI', approver: 'Endang Lestari, S.Pd.', nip: '198309112009032004', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-12' },
    { code: 13, name: 'PENGELOLA KAS & PERBANKAN APBN', approver: 'Rina Kartika, S.E.', nip: '198711042012012002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-13' },
    { code: 14, name: 'DIREKTUR POLTEKTRANS SDP PALEMBANG', approver: 'Dr. Hj. Netty Herawati, M.Si.', nip: '196503121990032001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-14' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 sm:p-8 font-serif">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href="/dashboard/clearance-out/pengajuan" className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pengajuan</span>
        </Link>

        <button onClick={handlePrint} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 py-2.5 px-6 shadow-lg">
          <Printer className="w-4.5 h-4.5" />
          <span>Cetak Surat Bebas Administrasi (PDF)</span>
        </button>
      </div>

      {/* Official Certificate Paper Container */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 print:shadow-none print:border-none print:p-0">
        
        {/* Kop Surat Resmi Institusi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 flex items-center gap-4">
          <div className="w-20 h-20 bg-sky-600 rounded-full flex items-center justify-center text-white font-extrabold text-2xl shrink-0">
            POLTEK
          </div>
          <div className="flex-1 text-center font-serif">
            <h3 className="text-sm uppercase tracking-wider font-bold">KEMENTERIAN PERHUBUNGAN</h3>
            <h2 className="text-base sm:text-lg uppercase tracking-wider font-extrabold text-slate-900">BADAN PENGEMBANGAN SDM PERHUBUNGAN</h2>
            <h1 className="text-lg sm:text-xl font-black uppercase text-sky-900">POLITEKNIK TRANSPORTASI SDP PALEMBANG</h1>
            <p className="text-[11px] italic font-sans text-slate-600">Jl. Sabokingking No. 5, Palembang, Sumatera Selatan &bull; Telp: (0711) 710892</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6 space-y-1">
          <h2 className="text-base font-extrabold tracking-wider uppercase underline">SURAT KETERANGAN BEBAS ADMINISTRASI (CLEARANCE OUT)</h2>
          <p className="text-xs font-mono">Nomor: SKBA/POLTEKTRANS-SDP/2026/08/042</p>
        </div>

        {/* Biodata */}
        <div className="space-y-1.5 text-xs font-sans mb-6 border p-3 rounded-lg bg-slate-50">
          <div><strong>Nama Mahasiswa:</strong> AHMAD FAUZI</div>
          <div><strong>NIM:</strong> 2101034</div>
          <div><strong>Program Studi:</strong> D3 Studi Nautika</div>
          <div><strong>Tahun Lulus / Angkatan:</strong> 2026 / Angkatan XLVIII</div>
        </div>

        <p className="text-xs leading-relaxed font-sans mb-6">
          Direksi dan Panitia Clearance Out Politeknik Transportasi SDP Palembang menerangkan bahwa Mahasiswa tersebut di atas telah memenuhi dan dinyatakan <strong className="uppercase underline">BEBAS LENGKAP (100% CLEAR)</strong> dari seluruh kewajiban administrasi, keuangan, akademik, asrama, dan perpustakaan dari 14 Unit Kerja Institusi:
        </p>

        {/* Grid 14 Tanda Tangan Spek-TTD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[10px] font-sans">
          {approversList.map((app) => (
            <div key={app.code} className="border border-slate-300 p-2.5 rounded text-center flex flex-col justify-between h-28 bg-slate-50/50">
              <div className="font-bold text-[9px] uppercase border-b pb-1 leading-tight text-slate-700">{app.name}</div>
              <div className="my-auto py-1">
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CLEAR (100%)
                </span>
              </div>
              <div>
                <div className="font-bold text-[10px] underline leading-none">{app.approver}</div>
                <div className="text-[8px] font-mono text-slate-500 mt-0.5">NIP: {app.nip}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tanggal & TTD Pengesahan Akhir */}
        <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end font-sans text-xs">
          <div>
            <p className="text-[10px] text-slate-500 italic">* Surat Keterangan Bebas Administrasi ini diterbitkan secara elektronik & sah.</p>
          </div>
          <div className="text-right space-y-1">
            <div>Palembang, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div className="font-bold">An. Direktur Politeknik Transportasi SDP Palembang</div>
            <div className="font-semibold text-slate-600">Kabag Adm. Akademik & Ketarunaan</div>
            <div className="h-12 flex items-center justify-end">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded border border-emerald-300">
                TERVERIFIKASI SISTEM SIAKAL
              </span>
            </div>
            <div className="font-bold underline">Ir. Ahmad Yani, M.T.</div>
            <div className="text-[10px] font-mono">NIP. 19720412 199803 1 005</div>
          </div>
        </div>

      </div>
    </div>
  );
}
