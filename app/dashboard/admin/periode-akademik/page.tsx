'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Plus, Edit3, Trash2, AlertTriangle, Sparkles, X, Check, Clock } from 'lucide-react';
import { initialPeriodeList, PeriodeItem } from '@/lib/mockStore';

export default function AdminPeriodePage() {
  const [periodes, setPeriodes] = useState<PeriodeItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_periode_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return initialPeriodeList;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState<PeriodeItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Adding Periode
  const [newTahunStart, setNewTahunStart] = useState('2026');
  const [newTahunEnd, setNewTahunEnd] = useState('2027');
  const [newSemester, setNewSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [newKodePeriode, setNewKodePeriode] = useState('20261');
  const [isMakeActive, setIsMakeActive] = useState(true);

  // Auto update kode periode when year or semester changes
  useEffect(() => {
    const semCode = newSemester === 'Ganjil' ? '1' : '2';
    setNewKodePeriode(`${newTahunStart}${semCode}`);
  }, [newTahunStart, newSemester]);

  const savePeriodes = (newList: PeriodeItem[]) => {
    setPeriodes(newList);
    try {
      localStorage.setItem('siakal_periode_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetActive = (id: string) => {
    const updated = periodes.map((p) => ({
      ...p,
      isAktif: p.id === id,
    }));
    savePeriodes(updated);
    const activeObj = updated.find((p) => p.id === id);
    if (activeObj) {
      showNotification(`Periode Aktif berhasil diubah menjadi: Tahun Akademik ${activeObj.tahun} - Semester ${activeObj.semester}`);
    }
  };

  const handleAddPeriode = (e: React.FormEvent) => {
    e.preventDefault();
    const tahunStr = `${newTahunStart}/${newTahunEnd}`;
    const newId = `per-${Date.now()}`;

    const newObj: PeriodeItem = {
      id: newId,
      tahun: tahunStr,
      semester: newSemester,
      isAktif: isMakeActive,
      kodePeriode: newKodePeriode,
      createdDate: new Date().toISOString().split('T')[0],
    };

    let updatedList: PeriodeItem[];
    if (isMakeActive) {
      updatedList = periodes.map((p) => ({ ...p, isAktif: false }));
      updatedList = [newObj, ...updatedList];
    } else {
      updatedList = [newObj, ...periodes];
    }

    savePeriodes(updatedList);
    setShowAddModal(false);
    showNotification(`Periode Akademik baru (${tahunStr} - Semester ${newSemester}) berhasil ditambahkan!`);
  };

  const handleSaveEditPeriode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeriode) return;

    let updatedList: PeriodeItem[];
    if (editingPeriode.isAktif) {
      updatedList = periodes.map((p) =>
        p.id === editingPeriode.id ? editingPeriode : { ...p, isAktif: false }
      );
    } else {
      updatedList = periodes.map((p) => (p.id === editingPeriode.id ? editingPeriode : p));
    }

    savePeriodes(updatedList);
    setEditingPeriode(null);
    showNotification(`Perubahan Periode Akademik (${editingPeriode.tahun}) berhasil disimpan!`);
  };

  const confirmDeletePeriode = () => {
    if (!deleteTargetId) return;
    const target = periodes.find((p) => p.id === deleteTargetId);
    if (target?.isAktif) {
      alert('Tidak dapat menghapus Periode Akademik yang sedang AKTIF!');
      setDeleteTargetId(null);
      return;
    }
    const updated = periodes.filter((p) => p.id !== deleteTargetId);
    savePeriodes(updated);
    setDeleteTargetId(null);
    showNotification('Periode Akademik berhasil dihapus.');
  };

  const activePeriode = periodes.find((p) => p.isAktif) || periodes[0];

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="glass-panel py-3 px-5 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 font-extrabold text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header Banner Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Manajemen & Saklar Aktivasi Periode Akademik</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Tentukan Tahun Akademik dan Semester aktif. Seluruh data transaksi baru (seperti PRALA, TRB, Clearance Out, Beasiswa, dan Prestasi) akan ter-tag otomatis sesuai periode aktif ini.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Periode Akademik</span>
        </button>
      </div>

      {/* 2. Active Period Highlight Card */}
      {activePeriode && (
        <div className="glass-panel p-6 bg-gradient-to-br from-sky-500/10 via-white to-blue-500/10 border-2 border-sky-500/40 rounded-2xl shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-2xl bg-sky-500 text-white shadow-xl shadow-sky-500/30 border border-sky-400 shrink-0">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-black uppercase text-sky-700 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                PERIODE AKADEMIK AKTIF SISTEM SAAT INI
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Tahun Akademik {activePeriode.tahun} — Semester {activePeriode.semester}
              </h2>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Kode Periode: <span className="font-mono font-bold text-sky-700">{activePeriode.kodePeriode || '20251'}</span> • Seluruh pengajuan & inputan data akan secara otomatis terkelompok di periode ini.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 font-black text-xs sm:text-sm flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>AKSI SISTEM TERHUBUNG</span>
          </div>
        </div>
      )}

      {/* 3. List of All Academic Periods */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-wide">
          Daftar Periode Akademik Terdaftar ({periodes.length} Periode)
        </h3>

        <div className="grid grid-cols-1 gap-3.5">
          {periodes.map((p) => (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                p.isAktif
                  ? 'bg-sky-50/80 border-sky-400 shadow-md ring-2 ring-sky-400/30'
                  : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    p.isAktif
                      ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                      : 'bg-slate-200 text-slate-600 border-slate-300'
                  }`}
                >
                  <Calendar className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-base text-slate-900">
                      Tahun Akademik {p.tahun}
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono font-bold text-xs">
                      Kode: {p.kodePeriode || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-bold mt-1">
                    Semester: <span className="text-sky-700 font-black">{p.semester}</span>
                    {p.createdDate && ` • Dibuat: ${p.createdDate}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                {p.isAktif ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-800 font-black text-xs border border-emerald-500/30 inline-flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Periode Aktif Sistem</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSetActive(p.id)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Aktifkan Periode Ini</span>
                  </button>
                )}

                <button
                  onClick={() => setEditingPeriode({ ...p })}
                  className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors cursor-pointer border border-slate-200"
                  title="Edit Periode Akademik"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {!p.isAktif && (
                  <button
                    onClick={() => setDeleteTargetId(p.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer border border-slate-200"
                    title="Hapus Periode Akademik"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL TAMBAH PERIODE AKADEMIK BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span>Tambah Periode Akademik Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPeriode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Akademik *</label>
                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Tahun Mulai:</span>
                    <input
                      type="number"
                      required
                      value={newTahunStart}
                      onChange={(e) => {
                        const start = e.target.value;
                        setNewTahunStart(start);
                        if (Number(start) > 0) setNewTahunEnd((Number(start) + 1).toString());
                      }}
                      placeholder="2026"
                      className="w-full glass-input text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-0.5">Tahun Selesai:</span>
                    <input
                      type="number"
                      required
                      value={newTahunEnd}
                      onChange={(e) => setNewTahunEnd(e.target.value)}
                      placeholder="2027"
                      className="w-full glass-input text-xs font-mono font-bold"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Format otomatis: {newTahunStart}/{newTahunEnd}</p>
              </div>

              {/* SEMESTER RADIO BUTTON CARDS */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Pilihan Semester *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewSemester('Ganjil')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      newSemester === 'Ganjil'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md font-black scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 font-bold hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs">Semester Ganjil</div>
                    <div className="text-[10px] opacity-80 mt-0.5 font-mono">Kode Suffix: 1</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSemester('Genap')}
                    className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      newSemester === 'Genap'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md font-black scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 font-bold hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs">Semester Genap</div>
                    <div className="text-[10px] opacity-80 mt-0.5 font-mono">Kode Suffix: 2</div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kode Periode Sistem *</label>
                  <input
                    type="text"
                    required
                    value={newKodePeriode}
                    onChange={(e) => setNewKodePeriode(e.target.value)}
                    placeholder="Contoh: 20261"
                    className="w-full glass-input text-xs font-mono font-bold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMakeActive}
                      onChange={(e) => setIsMakeActive(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-extrabold text-slate-800">Aktifkan Langsung Periode Ini</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2.5 px-5 cursor-pointer">
                  Simpan Periode Akademik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT PERIODE AKADEMIK */}
      {editingPeriode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Periode Akademik: {editingPeriode.tahun}</span>
              </h3>
              <button onClick={() => setEditingPeriode(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPeriode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Akademik *</label>
                <input
                  type="text"
                  required
                  value={editingPeriode.tahun}
                  onChange={(e) => setEditingPeriode({ ...editingPeriode, tahun: e.target.value })}
                  placeholder="Contoh: 2026/2027"
                  className="w-full glass-input text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Semester *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingPeriode({ ...editingPeriode, semester: 'Ganjil' })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      editingPeriode.semester === 'Ganjil'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Semester Ganjil
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingPeriode({ ...editingPeriode, semester: 'Genap' })}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      editingPeriode.semester === 'Genap'
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    Semester Genap
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Kode Periode *</label>
                  <input
                    type="text"
                    required
                    value={editingPeriode.kodePeriode || ''}
                    onChange={(e) => setEditingPeriode({ ...editingPeriode, kodePeriode: e.target.value })}
                    className="w-full glass-input text-xs font-mono font-bold"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPeriode.isAktif}
                      onChange={(e) => setEditingPeriode({ ...editingPeriode, isAktif: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-xs font-extrabold text-slate-800">Set Sebagai Periode Aktif</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingPeriode(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2.5 px-5 cursor-pointer">
                  Simpan Perubahan
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
            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Periode</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Apakah Anda yakin ingin menghapus Periode Akademik ini dari sistem?
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
                onClick={confirmDeletePeriode}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Periode
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
