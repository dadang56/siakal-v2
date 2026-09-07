'use client';

import React, { useState } from 'react';
import { GraduationCap, Upload, CheckCircle2, FileText, Bell } from 'lucide-react';
import { initialScholarshipOffers, ScholarshipApplication, ScholarshipOffer } from '@/lib/mockStore';
import { Modal } from '@/components/Modal';
import { fileToDataUrl, getCurrentUser, STORAGE_KEYS } from '@/lib/dbStorage';
import { usePersistentState } from '@/lib/usePersistentState';

export default function StudentBeasiswaPage() {
  const offersStore = usePersistentState<ScholarshipOffer[]>(STORAGE_KEYS.SCHOLARSHIP_OFFERS, initialScholarshipOffers);
  const applicationsStore = usePersistentState<ScholarshipApplication[]>(STORAGE_KEYS.SCHOLARSHIP_APPLICATIONS, []);
  const offers = offersStore.value;
  const currentUser = getCurrentUser();
  const [selectedOffer, setSelectedOffer] = useState<ScholarshipOffer | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const [ktpUrl, setKtpUrl] = useState('');
  const [transkripUrl, setTranskripUrl] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer || !currentUser) return;
    const today = new Date().toISOString().slice(0, 10);
    if (selectedOffer.status !== 'Buka' || today < selectedOffer.tanggalBuka || today > selectedOffer.tanggalTutup) {
      alert('Penawaran beasiswa tidak berada dalam masa pendaftaran.');
      return;
    }
    const next: ScholarshipApplication = {
      id: `application-${Date.now()}`,
      penawaranId: selectedOffer.id,
      namaBeasiswa: selectedOffer.namaBeasiswa,
      mahasiswaId: currentUser.id,
      mahasiswaNama: currentUser.fullName,
      prodi: currentUser.prodi || '-',
      berkasUploaded: { identitas: ktpUrl, transkrip: transkripUrl },
      status: 'Diajukan',
      appliedAt: new Date().toISOString(),
    };
    const existing = applicationsStore.value.filter((item) => !(item.penawaranId === selectedOffer.id && item.mahasiswaId === currentUser.id));
    if (!await applicationsStore.persist([...existing, next])) return;
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setSelectedOffer(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 bg-white rounded-2xl shadow-sm">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <GraduationCap className="w-6 h-6 text-sky-500 shrink-0" />
          <span>Penawaran Beasiswa & Status Pengajuan</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
          Ikuti penawaran beasiswa resmi kampus. Unggah berkas persyaratan untuk dinilai dalam rapat seleksi beasiswa.
        </p>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((off) => (
          <div key={off.id} className="glass-panel p-6 flex flex-col justify-between space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-800 border border-sky-500/20 uppercase">
                  {off.jenisBeasiswa}
                </span>
                <span className="text-[10px] font-black text-amber-800 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  Kuota: {off.kuota} Taruna
                </span>
              </div>

              <h3 className="font-black text-base text-slate-900">{off.namaBeasiswa}</h3>
              <p className="text-xs text-slate-700 font-semibold mt-2">{off.ketentuan}</p>

              <div className="mt-3 space-y-1">
                <span className="text-xs font-black text-slate-800 block">Daftar Persyaratan Berkas:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 font-medium space-y-0.5">
                  {off.persyaratan.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-500">Batas: {off.tanggalTutup}</span>
              <button
                onClick={() => setSelectedOffer(off)}
                className="glass-button text-xs font-extrabold py-2 px-4 shadow-md cursor-pointer"
              >
                Ikut Penawaran Beasiswa
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Application Form */}
      <Modal isOpen={!!selectedOffer} onClose={() => setSelectedOffer(null)} title={`Pengajuan Beasiswa: ${selectedOffer?.namaBeasiswa}`}>
        {appliedSuccess ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <div className="text-sm font-black text-slate-900">Pengajuan Beasiswa Berhasil Diterima!</div>
            <p className="text-xs text-slate-600 font-semibold">Berkas Anda akan diproses dalam Rapat Seleksi Beasiswa. Notifikasi hasil akan didistribusikan ke akun Anda.</p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">1. Scan KTP & Kartu Mahasiswa (PDF) *</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try { setKtpUrl(await fileToDataUrl(file)); } catch (error) { alert((error as Error).message); }
                }}
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">2. Transkrip Nilai Legalisir (PDF) *</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try { setTranskripUrl(await fileToDataUrl(file)); } catch (error) { alert((error as Error).message); }
                }}
                className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-6">
                <Upload className="w-4 h-4" />
                <span>Kirim Berkas Pengajuan Beasiswa</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
