'use client';

import React, { useState, useEffect } from 'react';
import { Anchor, Search, FileText, CheckCircle2, AlertCircle, Download, ExternalLink, Ship, Building2, User, UserCheck, Edit3, Save, X } from 'lucide-react';
import { exportToExcel } from '@/lib/utils/excel';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function AdminMonitoringPralaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProdi, setFilterProdi] = useState('Semua');

  // Registered Dosen list from User Management
  const [dosenList, setDosenList] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((u) => u.role === 'dosen');
          }
        }
      } catch (e) {}
    }
    return initialAccounts.filter((u) => u.role === 'dosen');
  });

  const [pralaData, setPralaData] = useState([
    {
      id: 'prala-1',
      nim: '2101034',
      nama: 'Ahmad Fauzi',
      prodi: 'Studi Nautika',
      angkatan: 2023,
      perusahaan: 'PT PELNI (Persero)',
      namaKapal: 'KM Kelud',
      tipeKapal: 'Kapal Penumpang (Passenger Vessel)',
      contactPerson: 'Perwira Handoko (Crewing Officer)',
      noHpContact: '081234567890',
      trbStatus: 'TERUNGGAH',
      trbPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      progresBimbingan: '80%',
      pembimbingDosen: 'Capt. Budi Santoso, M.Mar.',
    },
    {
      id: 'prala-2',
      nim: '2102088',
      nama: 'Rizky Ramadhan',
      prodi: 'Permesinan Kapal',
      angkatan: 2023,
      perusahaan: 'PT Meratus Line',
      namaKapal: 'MV Meratus Jaya',
      tipeKapal: 'Kapal Kontainer (Container Ship)',
      contactPerson: 'Perwira Irwan (KKK / Masinis 1)',
      noHpContact: '081987654321',
      trbStatus: 'BELUM_TERUNGGAH',
      trbPdfUrl: '',
      progresBimbingan: '40%',
      pembimbingDosen: 'Hendra Gunawan, M.Mar.E.',
    },
  ]);

  // Modal Plot Dosen State
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [selectedDosen, setSelectedDosen] = useState('');
  const [customDosenName, setCustomDosenName] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('siakal_prala_admin');
      if (stored) setPralaData(JSON.parse(stored));
    } catch (e) {}

    try {
      const storedUsers = localStorage.getItem('siakal_user_list');
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed)) {
          const dosens = parsed.filter((u: any) => u.role === 'dosen');
          if (dosens.length > 0) setDosenList(dosens);
        }
      }
    } catch (e) {}
  }, []);

  const saveState = (updated: any) => {
    setPralaData(updated);
    try {
      localStorage.setItem('siakal_prala_admin', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleOpenPlotModal = (item: any) => {
    setEditingItem(item);
    setSelectedDosen(item.pembimbingDosen || '');
    setCustomDosenName('');
  };

  const handleSavePlotting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const finalDosen = customDosenName.trim() ? customDosenName : selectedDosen;
    if (!finalDosen) {
      alert('Mohon pilih atau tulis nama Dosen Pembimbing!');
      return;
    }

    const updated = pralaData.map((p) =>
      p.id === editingItem.id ? { ...p, pembimbingDosen: finalDosen } : p
    );
    saveState(updated);
    setEditingItem(null);
    alert(`Dosen Pembimbing untuk ${editingItem.nama} berhasil ditetapkan: ${finalDosen}`);
  };

  const filteredPrala = pralaData.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nim.includes(searchQuery) ||
      item.namaKapal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pembimbingDosen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === 'Semua' || item.prodi === filterProdi;
    return matchSearch && matchProdi;
  });

  const handleExportExcel = () => {
    exportToExcel(
      [
        {
          sheetName: 'Monitoring PRALA',
          data: filteredPrala.map((p) => ({
            NIM: p.nim,
            'Nama Mahasiswa': p.nama,
            'Program Studi': p.prodi,
            Angkatan: p.angkatan,
            'Perusahaan Pelayaran': p.perusahaan,
            'Nama Kapal': p.namaKapal,
            'Tipe Kapal': p.tipeKapal,
            'Contact Person Officer': p.contactPerson,
            'No HP Contact': p.noHpContact,
            'Status TRB': p.trbStatus,
            'Progres Bimbingan': p.progresBimbingan,
            'Dosen Pembimbing PRALA': p.pembimbingDosen,
          })),
        },
      ],
      'Monitoring_PRALA_1Tahun_SIAKAL'
    );
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Anchor className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Portal Monitoring PRALA & Pembagian Dosen Pembimbing</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola pembagian Dosen Pembimbing PRALA, pemantauan kapal, perwira kontak, dan berkas TRB PDF Mahasiswa.
          </p>
        </div>

        <button onClick={handleExportExcel} className="glass-button text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 shadow-md cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Ekspor Rekap PRALA (.XLSX)</span>
        </button>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mahasiswa, NIM, kapal, dosen..."
            className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold bg-slate-100/90 border-slate-300 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-bold text-slate-700 shrink-0">Filter Prodi:</span>
          <select
            value={filterProdi}
            onChange={(e) => setFilterProdi(e.target.value)}
            className="glass-input text-xs sm:text-sm font-bold bg-slate-100/90 border-slate-300 text-slate-900"
          >
            <option value="Semua">Semua Prodi PRALA</option>
            <option value="Studi Nautika">Studi Nautika</option>
            <option value="Permesinan Kapal">Permesinan Kapal</option>
          </select>
        </div>
      </div>

      {/* Table Cards List */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide">
          Daftar Mahasiswa PRALA & Dosen Pembimbing ({filteredPrala.length} Mahasiswa)
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">MAHASISWA</th>
                <th className="py-3 px-4">PERUSAHAAN & KAPAL</th>
                <th className="py-3 px-4">DOSEN PEMBIMBING PRALA</th>
                <th className="py-3 px-4">STATUS TRB</th>
                <th className="py-3 px-4">PROGRES</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredPrala.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900 text-sm">{p.nama}</div>
                    <div className="text-xs text-slate-500 font-mono">NIM: {p.nim} &bull; {p.prodi}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-sky-700 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>{p.perusahaan}</span>
                    </div>
                    <div className="text-slate-800 font-semibold flex items-center gap-1.5 mt-0.5">
                      <Ship className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{p.namaKapal} ({p.tipeKapal})</span>
                    </div>
                  </td>

                  {/* DOSEN PEMBIMBING COLUMN WITH PLOT BUTTON */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">{p.pembimbingDosen || 'Belum Ditetapkan'}</div>
                        <button
                          type="button"
                          onClick={() => handleOpenPlotModal(p)}
                          className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1 mt-0.5 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-sky-500" />
                          <span>Ubah / Plot Dosen</span>
                        </button>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {p.trbStatus === 'TERUNGGAH' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>TRB Terunggah</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-black bg-amber-500/10 text-amber-800 border border-amber-500/20 inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Belum Upload</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="w-28 bg-slate-200 rounded-full h-2 overflow-hidden mb-1">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: p.progresBimbingan }} />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-600">{p.progresBimbingan} Selesai</span>
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenPlotModal(p)}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Plot Dosen</span>
                      </button>

                      {p.trbPdfUrl ? (
                        <a
                          href={p.trbPdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold inline-flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>TRB PDF</span>
                        </a>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL PLOT / PENETAPAN DOSEN PEMBIMBING PRALA */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-sky-500" />
                <span>Penetapan Dosen Pembimbing PRALA</span>
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs space-y-1">
              <div className="font-black text-slate-900 text-sm">{editingItem.nama} ({editingItem.nim})</div>
              <div className="text-slate-600 font-semibold">Prodi: {editingItem.prodi} • Angkatan: {editingItem.angkatan}</div>
              <div className="text-slate-600 font-semibold">Kapal / Perusahaan: {editingItem.namaKapal} ({editingItem.perusahaan})</div>
            </div>

            <form onSubmit={handleSavePlotting} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Pilih Dosen Pembimbing (Terdaftar di Sistem):
                </label>
                <select
                  value={selectedDosen}
                  onChange={(e) => setSelectedDosen(e.target.value)}
                  className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                >
                  <option value="">-- Pilih Dosen Pembimbing --</option>
                  {dosenList.map((d) => (
                    <option key={d.id} value={d.fullName}>
                      {d.fullName} {d.nip ? `(NIP: ${d.nip})` : ''}
                    </option>
                  ))}
                  <option value="Capt. Budi Santoso, M.Mar.">Capt. Budi Santoso, M.Mar.</option>
                  <option value="Hendra Gunawan, M.Mar.E.">Hendra Gunawan, M.Mar.E.</option>
                  <option value="Dr. Ir. Suryadi, M.T.">Dr. Ir. Suryadi, M.T.</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Atau Input Nama Dosen Manual (Jika belum ada di dropdown):
                </label>
                <input
                  type="text"
                  value={customDosenName}
                  onChange={(e) => setCustomDosenName(e.target.value)}
                  placeholder="Contoh: Capt. Ahmad Dahlan, M.Mar."
                  className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300 text-slate-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2.5 px-5 cursor-pointer flex items-center gap-1.5">
                  <Save className="w-4 h-4" />
                  <span>Simpan Dosen Pembimbing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
