'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, FileText, Upload, CheckCircle2, UserPlus, Trash2, AlertTriangle, Users, UserCheck, Building2, X } from 'lucide-react';
import { initialAccounts, UserAccount } from '@/lib/mockStore';

export default function AdminMagangPage() {
  const [users, setUsers] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
    }
    return initialAccounts;
  });

  const existingStudents = users.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');
  const existingSupervisors = users.filter((u) => u.role === 'pembimbing_lapangan');

  const [kelompoks, setKelompoks] = useState([
    {
      id: 'klp-1',
      namaKelompok: 'Kelompok 01 - Pelabuhan Palembang',
      nomorSkMagang: 'SK/MTPD/2026/004',
      fileSkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tempatMagang: 'PT Pelabuhan Indonesia (Pelindo) Regional 2 Palembang',
      alamatTempatMagang: 'Jl. Mayor Memet Sastrawirya No.1, Palembang',
      pembimbingLapanganNama: 'Hendra Gunawan, S.T.',
      pembimbingLapanganEmail: 'supervisor@pelindo.co.id',
      anggotaMahasiswa: [
        { id: 'mhs-1', nama: 'Bambang Pratama', nim: '2102011' },
        { id: 'mhs-2', nama: 'Siti Rahmawati', nim: '2102012' },
      ],
      laporanJudul: 'Analisis Arus Logistik Kapal Roro di Pelabuhan Palembang',
      laporanPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      laporanStatus: 'Pending',
    },
  ]);

  useEffect(() => {
    try {
      const storedGroups = localStorage.getItem('siakal_magang_groups');
      if (storedGroups) setKelompoks(JSON.parse(storedGroups));
    } catch (e) {}
  }, []);

  const saveGroups = (newList: any[]) => {
    setKelompoks(newList);
    try {
      localStorage.setItem('siakal_magang_groups', JSON.stringify(newList));
    } catch (e) {}
  };

  const [showModal, setShowModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [namaKelompok, setNamaKelompok] = useState('');
  const [nomorSk, setNomorSk] = useState('');
  const [tempatMagang, setTempatMagang] = useState('');
  const [pembimbingId, setPembimbingId] = useState('');
  const [selectedAnggotaIds, setSelectedAnggotaIds] = useState<string[]>([]);
  const [selectedMhsAdd, setSelectedMhsAdd] = useState('');

  const handleAddKelompok = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaKelompok || !tempatMagang) {
      alert('Mohon lengkapi Nama Kelompok dan Tempat Magang!');
      return;
    }

    const supervisor = existingSupervisors.find((s) => s.id === pembimbingId);
    const supervisorName = supervisor ? supervisor.fullName : 'Hendra Gunawan, S.T.';
    const supervisorEmail = supervisor ? supervisor.email : 'supervisor@pelindo.co.id';

    const selectedStudentsList = selectedAnggotaIds
      .map((id) => existingStudents.find((m) => m.id === id))
      .filter(Boolean)
      .map((m) => ({ id: m!.id, nama: m!.fullName, nim: m!.nim || m!.usernameOrId || '2102099' }));

    const newKlp = {
      id: `klp-${Date.now()}`,
      namaKelompok,
      nomorSkMagang: nomorSk || `SK/MTPD/2026/00${kelompoks.length + 5}`,
      fileSkPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      tempatMagang,
      alamatTempatMagang: 'Palembang',
      pembimbingLapanganNama: supervisorName,
      pembimbingLapanganEmail: supervisorEmail,
      anggotaMahasiswa: selectedStudentsList.length > 0 ? selectedStudentsList : [{ id: 'mhs-default', nama: 'Bambang Pratama', nim: '2102011' }],
      laporanJudul: 'Laporan Magang & PKL MTPD',
      laporanPdfUrl: '',
      laporanStatus: 'Pending',
    };

    const updated = [...kelompoks, newKlp];
    saveGroups(updated);
    setShowModal(false);
    setNamaKelompok('');
    setNomorSk('');
    setTempatMagang('');
    setSelectedAnggotaIds([]);
    alert(`Kelompok Magang (${namaKelompok}) berhasil ditambahkan!`);
  };

  const confirmDeleteKelompok = () => {
    if (!deleteTargetId) return;
    const updated = kelompoks.filter((k) => k.id !== deleteTargetId);
    saveGroups(updated);
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-sky-500 shrink-0" />
            <span>(Magang dan PKL) MTPD — Plotting Kelompok & Pembimbing Lapangan</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola plotting kelompok mahasiswa MTPD, instansi tempat magang, pengesahan SK Magang, dan penetapan Pembimbing Lapangan.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer shrink-0">
          <Plus className="w-4 h-4" />
          <span>Buat Plotting Kelompok Baru</span>
        </button>
      </div>

      {/* List Kelompok Magang Cards */}
      <div className="space-y-4">
        {kelompoks.map((klp) => (
          <div key={klp.id} className="glass-panel p-6 space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/10 text-sky-800 border border-sky-500/20 font-mono">
                  {klp.nomorSkMagang}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1.5">{klp.namaKelompok}</h3>
                <p className="text-xs sm:text-sm text-slate-700 font-bold flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{klp.tempatMagang}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={klp.fileSkPdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm"
                >
                  <FileText className="w-4 h-4 text-sky-600" />
                  <span>File SK Magang PDF</span>
                </a>
                <button
                  onClick={() => setDeleteTargetId(klp.id)}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus Kelompok"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-2">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-sky-500" />
                  <span>Anggota Kelompok Mahasiswa MTPD:</span>
                </h4>
                <ul className="space-y-1.5">
                  {klp.anggotaMahasiswa.map((m) => (
                    <li key={m.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between font-bold text-slate-900">
                      <span>{m.nama}</span>
                      <span className="font-mono text-sky-700 text-xs">NIM: {m.nim}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pembimbing Lapangan Instansi:</span>
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-bold">
                  <div className="font-black text-slate-900 text-sm">{klp.pembimbingLapanganNama}</div>
                  <div className="text-slate-600 font-mono text-xs">{klp.pembimbingLapanganEmail}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Plotting Kelompok */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 sm:p-7 space-y-5 border border-slate-300 shadow-2xl relative bg-white rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2.5">
                <Plus className="w-5 h-5 text-sky-500" />
                <span>Buat Plotting Kelompok (Magang dan PKL) MTPD</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddKelompok} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Nama Kelompok Magang *</label>
                <input
                  type="text"
                  required
                  value={namaKelompok}
                  onChange={(e) => setNamaKelompok(e.target.value)}
                  placeholder="Contoh: Kelompok 02 - Pelabuhan Boom Baru"
                  className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Nomor SK Magang *</label>
                  <input
                    type="text"
                    required
                    value={nomorSk}
                    onChange={(e) => setNomorSk(e.target.value)}
                    placeholder="Contoh: SK/MTPD/2026/005"
                    className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Tempat Magang & Instansi *</label>
                  <input
                    type="text"
                    required
                    value={tempatMagang}
                    onChange={(e) => setTempatMagang(e.target.value)}
                    placeholder="Contoh: PT Pelindo Regional 2 Palembang"
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-slate-50 border-slate-300 text-slate-900"
                  />
                </div>
              </div>

              {/* SELECT PEMBIMBING LAPANGAN FROM USER MANAGEMENT */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <label className="block text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Pembimbing Lapangan (Role Pembimbing Lapangan):</span>
                </label>
                <select
                  value={pembimbingId}
                  onChange={(e) => setPembimbingId(e.target.value)}
                  className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-emerald-300 text-slate-900"
                >
                  <option value="">-- Pilih Pembimbing Lapangan Terdaftar --</option>
                  {existingSupervisors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.email})
                    </option>
                  ))}
                  <option value="default-1">Hendra Gunawan, S.T. (supervisor@pelindo.co.id)</option>
                  <option value="default-2">Budi Santoso, M.T. (budi@pelni.co.id)</option>
                </select>
              </div>

              {/* SELECT ANGGOTA MAHASISWA FROM USER MANAGEMENT */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-sky-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span>Pilih Anggota Kelompok Mahasiswa MTPD:</span>
                  </label>
                  <span className="text-[11px] font-black text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
                    {selectedAnggotaIds.length} Mahasiswa Ditunjuk
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedAnggotaIds.length > 0 ? (
                    selectedAnggotaIds.map((id) => {
                      const mhs = existingStudents.find((m) => m.id === id);
                      return (
                        <span key={id} className="bg-white text-sky-900 px-3 py-1 rounded-xl border border-sky-300 text-xs font-bold flex items-center gap-2 shadow-sm">
                          <span>{mhs ? mhs.fullName : id}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedAnggotaIds(selectedAnggotaIds.filter((i) => i !== id))}
                            className="text-red-500 hover:text-red-700 font-black cursor-pointer text-xs"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-sky-600 font-semibold italic">Belum ada anggota kelompok yang dipilih.</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <select
                    value={selectedMhsAdd}
                    onChange={(e) => setSelectedMhsAdd(e.target.value)}
                    className="w-full glass-input text-xs sm:text-sm font-semibold py-2 px-3 bg-white border-sky-300 text-slate-900"
                  >
                    <option value="">-- Pilih Mahasiswa MTPD dari Akun User --</option>
                    {existingStudents.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nim ? `${m.nim} - ` : ''}{m.fullName} ({m.prodi || 'MTPD'})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMhsAdd && !selectedAnggotaIds.includes(selectedMhsAdd)) {
                        setSelectedAnggotaIds([...selectedAnggotaIds, selectedMhsAdd]);
                        setSelectedMhsAdd('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs shrink-0 cursor-pointer shadow-sm"
                  >
                    + Tambah
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6 cursor-pointer">
                  Simpan Plotting Kelompok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6 text-center space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Plotting</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Apakah Anda yakin ingin menghapus kelompok magang ini?
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={confirmDeleteKelompok}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Kelompok
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
