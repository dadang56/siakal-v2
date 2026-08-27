'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ArrowLeft } from 'lucide-react';

export default function PrintableClearanceOutDocument() {
  const router = useRouter();

  // Printable Physical Document Grid Boxes (14 Units + Direktur)
  const unitsData = [
    { code: 1, name: 'BENDAHARA PENERIMAAN', approver: 'Supriadi, S.E.', nip: '197908122005011002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-1' },
    { code: 2, name: 'UNIT ASRAMA', approver: 'Bambang Irawan, S.ST.', nip: '198203112008121001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-2' },
    { code: 3, name: 'UNIT PERPUSTAKAAN', approver: 'Dra. Sri Wahyuni, M.IP.', nip: '198704202012011003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-3' },
    { code: 4, name: 'UNIT KOPERASI', approver: 'Hj. Siti Aminah, S.E.', nip: '197505142001122001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-4' },
    { code: 5, name: 'UNIT OLAHRAGA DAN SENI', approver: 'Rudi Hartono, M.Pd.', nip: '198906102014021004', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-5' },
    { code: 6, name: 'KABAG KEUANGAN DAN UMUM', approver: 'Drs. H. M. Yamin, M.Si.', nip: '196811051994031002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-6' },
    { code: 7, name: 'PRODI STUDI NAUTIKA', approver: 'Capt. Budi Santoso, M.Mar.', nip: '198503152010121002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-7' },
    { code: 8, name: 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (AKADEMIK)', approver: 'Dr. Agus Setiawan, M.T.', nip: '198102172006041003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-8' },
    { code: 9, name: 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (KETARUNAAN)', approver: 'Hendra Gunawan, M.Mar.E.', nip: '198409222009121002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-9' },
    { code: 10, name: 'KABAG ADM. AKADEMIK & KETARUNAAN', approver: 'Ir. Ahmad Yani, M.T.', nip: '197204121998031005', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-10' },
    { code: 11, name: 'UNIT BINTAR', approver: 'Major Laut (P) Ridwan', nip: '198007142003121001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-11' },
    { code: 12, name: 'PENGASUH', approver: 'Kapten Laut (T) Deni', nip: '198601192010121003', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-12' },
    { code: 13, name: 'AKTIFITAS', approver: 'Fajar Nugraha, S.ST.', nip: '199010052015031002', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-13' },
    { code: 14, name: 'KA. PUSBANGKAR', approver: 'Dr. Eko Nugroho Widjatmoko', nip: '197112212002121001', ttdUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=ttd-14' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 flex flex-col items-center">
      {/* Control Action Bar */}
      <div className="w-full max-w-[210mm] mb-4 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <button
          onClick={() => window.print()}
          className="glass-button text-xs py-2 px-5 flex items-center gap-2 shadow-lg"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak PDF FM.AT.01.017-01</span>
        </button>
      </div>

      {/* Printable Physical Paper A4 Sheet */}
      <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 shadow-2xl rounded-sm text-[11px] font-sans print:shadow-none print:w-full print:p-0 print:m-0">
        
        {/* Header Standard Kampus */}
        <div className="border-b-2 border-black pb-2 mb-4 flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded flex items-center justify-center font-bold text-lg border border-slate-400">
            LOG Kampus
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-sm font-bold uppercase tracking-wider">KEMENTERIAN PERHUBUNGAN</h2>
            <h3 className="text-xs font-bold uppercase">BADAN PENGEMBANGAN SDM PERHUBUNGAN</h3>
            <h1 className="text-base font-extrabold uppercase">POLITEKNIK TRANSPORTASI SDP PALEMBANG</h1>
            <p className="text-[9px] italic">Jl. Residen Abdul Rozak, Kalidoni, Palembang &bull; Website: www.poltektranssdp.ac.id</p>
          </div>
          <div className="text-right text-[9px] border border-black p-1">
            <strong>FM.AT.01.017-01</strong>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h2 className="text-sm font-extrabold uppercase underline">SURAT BEBAS ADMINISTRASI KAMPUS (CLEARANCE OUT)</h2>
          <p className="text-[10px] mt-0.5">Pengajuan Kegiatan: <strong className="uppercase">PRALA (Praktek Laut) 1 Tahun</strong></p>
        </div>

        {/* Student Data Table Grid */}
        <div className="mb-4 space-y-1">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><strong>Nama Taruna / Mahasiswa:</strong> AHMAD FAUZI</div>
            <div><strong>NIM / NPT:</strong> 2101034</div>
            <div><strong>Program Studi:</strong> Diploma III - Studi Nautika</div>
            <div><strong>Asrama / Dormitory:</strong> Asrama Alpha</div>
          </div>
        </div>

        <p className="text-[10px] mb-2 italic">
          Dengan ini menerangkan bahwa Mahasiswa tersebut di atas telah memenuhi syarat dan bebas dari segala beban kewajiban administrasi pada unit-unit kerja sebagai berikut:
        </p>

        {/* Grid 14 Unit Boxes */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {unitsData.map((u) => (
            <div key={u.code} className="border border-black p-2 flex flex-col justify-between h-24 bg-white relative">
              <div className="flex items-start justify-between text-[9px]">
                <span className="font-bold">{u.code}. {u.name}</span>
                <span className="font-bold text-emerald-700 border border-emerald-700 px-1 rounded">[X] MEMENUHI</span>
              </div>

              {/* Digital Signature PNG Stamp */}
              <div className="my-auto text-center flex items-center justify-center">
                <img src={u.ttdUrl} alt="TTD Digital" className="h-7 w-auto object-contain opacity-80" />
              </div>

              <div className="text-[8px] text-center border-t border-slate-300 pt-0.5">
                <div className="font-bold underline">{u.approver}</div>
                <div>NIP. {u.nip}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Approval Direktur Stamp */}
        <div className="mt-6 flex justify-end">
          <div className="w-64 text-center text-[10px] border border-black p-2 space-y-1">
            <div>Palembang, 24 Agustus 2026</div>
            <div className="font-bold">Mengetahui / Menyetujui,</div>
            <div className="font-extrabold uppercase">DIREKTUR POLTEKTRANS SDP PALEMBANG</div>
            <div className="h-10 flex items-center justify-center">
              <img src="https://api.dicebear.com/7.x/shapes/svg?seed=direktur" alt="TTD Direktur" className="h-8 opacity-90" />
            </div>
            <div className="font-bold underline text-xs">Dr. Eko Nugroho Widjatmoko, M.M., M.Mar,E</div>
            <div>NIP. 19711221 200212 1 001</div>
          </div>
        </div>

      </div>
    </div>
  );
}
