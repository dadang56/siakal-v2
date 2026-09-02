'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Upload, Plus, Trash2, Edit3, FileSpreadsheet, Building2, GraduationCap, CheckCircle2, AlertTriangle, ShieldCheck, Eye, EyeOff, X } from 'lucide-react';
import { initialAccounts, UserAccount, initialProdiList } from '@/lib/mockStore';
import { exportToExcel, readExcelFile, downloadMahasiswaBiodataTemplate } from '@/lib/utils/excel';

export default function AdminMahasiswaDatabasePage() {
  // Load Mahasiswa users
  const [mahasiswas, setMahasiswas] = useState<UserAccount[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_user_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            return parsed.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');
          }
        }
      } catch (e) {}
    }
    return initialAccounts.filter((u) => u.role === 'mahasiswa' || u.role === 'alumni');
  });

  // Dynamic Prodi List from Master Data
  const [prodiList, setProdiList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('siakal_prodi_list');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {}
    }
    return initialProdiList;
  });

  useEffect(() => {
    try {
      const storedProdis = localStorage.getItem('siakal_prodi_list');
      if (storedProdis) {
        const parsed = JSON.parse(storedProdis);
        if (Array.isArray(parsed) && parsed.length > 0) setProdiList(parsed);
      }
    } catch (e) {}
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProdi, setFilterProdi] = useState('semua');
  const [filterAngkatan, setFilterAngkatan] = useState('semua');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMhs, setEditingMhs] = useState<UserAccount | null>(null);
  const [viewDetailMhs, setViewDetailMhs] = useState<UserAccount | null>(null);

  // Excel Batch Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedPreview, setImportedPreview] = useState<any[]>([]);

  // 32-Item Form State
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState(prodiList[0]?.nama || 'Studi Nautika');
  const [angkatan, setAngkatan] = useState('2026');
  const [statusAkademik, setStatusAkademik] = useState<'Aktif' | 'PRALA' | 'Magang' | 'Lulus / Alumni'>('Aktif');
  const [email, setEmail] = useState('');

  // Extended 32 Biodata Fields State
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [namaIbu, setNamaIbu] = useState('');
  const [agama, setAgama] = useState('Islam');
  const [nik, setNik] = useState('');
  const [nisn, setNisn] = useState('');
  const [npwp, setNpwp] = useState('');
  const [noHp, setNoHp] = useState('');
  const [jalan, setJalan] = useState('');
  const [dusun, setDusun] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');
  const [kelurahan, setKelurahan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kodePos, setKodePos] = useState('');
  const [alatTransportasi, setAlatTransportasi] = useState('Sepeda motor');
  const [statusTempatTinggal, setStatusTempatTinggal] = useState('Bersama orang tua');
  
  // Data Orang Tua (Ayah & Ibu)
  const [namaAyah, setNamaAyah] = useState('');
  const [nikAyah, setNikAyah] = useState('');
  const [tanggalLahirAyah, setTanggalLahirAyah] = useState('');
  const [pendidikanAyah, setPendidikanAyah] = useState('SMA / SMK');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('Wiraswasta');
  const [penghasilanAyah, setPenghasilanAyah] = useState('Rp. 5,000,000 - Rp. 20,000,000');

  const [nikIbu, setNikIbu] = useState('');
  const [tanggalLahirIbu, setTanggalLahirIbu] = useState('');
  const [pendidikanIbu, setPendidikanIbu] = useState('SMA / SMK');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('Wirausaha');
  const [penghasilanIbu, setPenghasilanIbu] = useState('Rp. 2,000,000 - Rp. 4,999,999');

  const saveAllUsers = (updatedMahasiswas: UserAccount[]) => {
    setMahasiswas(updatedMahasiswas);
    try {
      const stored = localStorage.getItem('siakal_user_list');
      let allUsers: UserAccount[] = initialAccounts;
      if (stored) {
        allUsers = JSON.parse(stored);
      }
      const nonMhs = allUsers.filter((u) => u.role !== 'mahasiswa' && u.role !== 'alumni');
      const newList = [...nonMhs, ...updatedMahasiswas];
      localStorage.setItem('siakal_user_list', JSON.stringify(newList));
    } catch (e) {}
  };

  const handleAddMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !nim) return;

    const newMhs: UserAccount = {
      id: `mhs-${Date.now()}`,
      fullName,
      email: email || `${nim}@siakal.poltek.ac.id`,
      role: statusAkademik === 'Lulus / Alumni' ? 'alumni' : 'mahasiswa',
      nim,
      usernameOrId: nim,
      initialPassword: 'SIAKAL2026!',
      prodi,
      angkatan: Number(angkatan) || 2026,
      isProfileCompleted: true,
      
      tempatLahir,
      tanggalLahir,
      jenisKelamin,
      namaIbu,
      agama,
      nik,
      nisn,
      npwp,
      noHp,
      jalan,
      dusun,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kodePos,
      alatTransportasi,
      statusTempatTinggal,
      namaAyah,
      nikAyah,
      tanggalLahirAyah,
      pendidikanAyah,
      pekerjaanAyah,
      penghasilanAyah,
      nikIbu,
      tanggalLahirIbu,
      pendidikanIbu,
      pekerjaanIbu,
      penghasilanIbu,
    };

    const updated = [newMhs, ...mahasiswas];
    saveAllUsers(updated);
    setShowAddModal(false);
    setFullName('');
    setNim('');
  };

  const handleSaveEditMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMhs) return;

    const updatedList = mahasiswas.map((m) => (m.id === editingMhs.id ? editingMhs : m));
    saveAllUsers(updatedList);
    setEditingMhs(null);
  };

  const confirmDeleteMahasiswa = () => {
    if (!deleteTargetId) return;
    const updated = mahasiswas.filter((m) => m.id !== deleteTargetId);
    saveAllUsers(updated);
    setDeleteTargetId(null);
  };

  const handleExcelImportUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedData = await readExcelFile(file);
      if (parsedData.length > 0) {
        setImportedPreview(parsedData);
        setShowImportModal(true);
      }
    } catch (err) {
      alert('Gagal membaca file Excel. Gunakan template resmi SIAKAL.');
    }
  };

  const handleConfirmBatchImport = () => {
    const newStudents: UserAccount[] = importedPreview.map((row, idx) => {
      const studentNim = row['NIM']?.toString() || row['Username/NIM/NIP']?.toString() || `2026${idx + 100}`;
      const isAlumni = row['Status Akademik'] === 'Lulus / Alumni' || row['Role'] === 'alumni';

      return {
        id: `imported-mhs-${Date.now()}-${idx}`,
        fullName: row['Nama Lengkap'] || 'Mahasiswa Baru',
        email: row['Email'] || `${studentNim}@siakal.poltek.ac.id`,
        role: isAlumni ? 'alumni' : 'mahasiswa',
        nim: studentNim,
        usernameOrId: studentNim,
        initialPassword: row['Password Initial']?.toString() || 'SIAKAL2026!',
        prodi: row['Program Studi'] || row['Prodi'] || prodiList[0]?.nama || 'Studi Nautika',
        angkatan: Number(row['Angkatan']) || 2026,
        isProfileCompleted: true,
        
        tempatLahir: row['Tempat Lahir'] || '',
        tanggalLahir: row['Tanggal Lahir'] || '',
        jenisKelamin: row['Jenis Kelamin'] || 'Laki-laki',
        agama: row['Agama'] || 'Islam',
        nik: row['NIK (KTP)']?.toString() || '',
        nisn: row['NISN']?.toString() || '',
        npwp: row['NPWP']?.toString() || '',
        noHp: row['No HP']?.toString() || '',
        jalan: row['Jalan'] || '',
        dusun: row['Dusun'] || '',
        rt: row['RT']?.toString() || '',
        rw: row['RW']?.toString() || '',
        kelurahan: row['Kelurahan'] || '',
        kecamatan: row['Kecamatan'] || '',
        kodePos: row['Kode Pos']?.toString() || '',
        alatTransportasi: row['Alat Transportasi'] || 'Sepeda motor',
        statusTempatTinggal: row['Status Tempat Tinggal'] || 'Bersama orang tua',
        namaAyah: row['Nama Ayah'] || '',
        nikAyah: row['NIK Ayah']?.toString() || '',
        tanggalLahirAyah: row['Tanggal Lahir Ayah'] || '',
        pendidikanAyah: row['Pendidikan Ayah'] || 'SMA / SMK',
        pekerjaanAyah: row['Pekerjaan Ayah'] || 'Wiraswasta',
        penghasilanAyah: row['Penghasilan Ayah'] || '',
        namaIbu: row['Nama Ibu'] || '',
        nikIbu: row['NIK Ibu']?.toString() || '',
        tanggalLahirIbu: row['Tanggal Lahir Ibu'] || '',
        pendidikanIbu: row['Pendidikan Ibu'] || 'SMA / SMK',
        pekerjaanIbu: row['Pekerjaan Ibu'] || 'Wirausaha',
        penghasilanIbu: row['Penghasilan Ibu'] || '',
      };
    });

    const updated = [...mahasiswas, ...newStudents];
    saveAllUsers(updated);
    setShowImportModal(false);
    setImportedPreview([]);
    alert(`Berhasil mengimpor ${newStudents.length} data mahasiswa lengkap 32-Item!`);
  };

  const handleExport = () => {
    exportToExcel(
      [
        {
          sheetName: 'Database Mahasiswa 32 Item',
          data: filteredMahasiswas.map((m) => ({
            'NIM': m.nim || m.usernameOrId,
            'Nama Lengkap': m.fullName,
            'Program Studi': m.prodi || '-',
            'Angkatan': m.angkatan || 2026,
            'Status Akademik': m.role === 'alumni' ? 'Alumni' : 'Mahasiswa Aktif',
            'Tempat Lahir': m.tempatLahir || '-',
            'Tanggal Lahir': m.tanggalLahir || '-',
            'Jenis Kelamin': m.jenisKelamin || '-',
            'Agama': m.agama || '-',
            'NIK (KTP)': m.nik || '-',
            'NISN': m.nisn || '-',
            'NPWP': m.npwp || '-',
            'Email': m.email,
            'No HP': m.noHp || '-',
            'Jalan': m.jalan || '-',
            'Dusun': m.dusun || '-',
            'RT': m.rt || '-',
            'RW': m.rw || '-',
            'Kelurahan': m.kelurahan || '-',
            'Kecamatan': m.kecamatan || '-',
            'Kode Pos': m.kodePos || '-',
            'Alat Transportasi': m.alatTransportasi || '-',
            'Status Tempat Tinggal': m.statusTempatTinggal || '-',
            'Nama Ayah': m.namaAyah || '-',
            'Pekerjaan Ayah': m.pekerjaanAyah || '-',
            'Nama Ibu': m.namaIbu || '-',
            'Pekerjaan Ibu': m.pekerjaanIbu || '-',
          })),
        },
      ],
      'Database_Mahasiswa_32_Item_SIAKAL'
    );
  };

  const filteredMahasiswas = mahasiswas.filter((m) => {
    const matchSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.nim && m.nim.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchProdi = filterProdi === 'semua' || (m.prodi && m.prodi.toLowerCase().includes(filterProdi.toLowerCase()));
    const matchAngkatan =
      filterAngkatan === 'semua' ||
      (m.angkatan && m.angkatan.toString().includes(filterAngkatan.toLowerCase()));
    return matchSearch && matchProdi && matchAngkatan;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Pusat Database Mahasiswa (Biodata Lengkap 32-Item)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola data mahasiswa, pencarian angkatan cepat, prodi terintegrasi, dan impor Excel biodata lengkap.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelImportUpload} className="hidden" />
          </label>

          <button onClick={handleExport} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm transition-all cursor-pointer">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor .XLSX</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>+ Data Mahasiswa</span>
          </button>
        </div>
      </div>

      {/* 2. Filter & Search Bar Card */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama mahasiswa, NIM..."
            className="w-full glass-input pl-10 text-xs sm:text-sm font-semibold text-slate-900 bg-slate-100/90 border-slate-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* DYNAMIC PRODI FILTER (TEXT: "Semua prodi") */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-slate-700 shrink-0">Prodi:</span>
            <select
              value={filterProdi}
              onChange={(e) => setFilterProdi(e.target.value)}
              className="glass-input text-xs font-bold py-2 px-3 rounded-xl bg-slate-100/90 border-slate-300 text-slate-900 w-full"
            >
              <option value="semua">Semua prodi</option>
              {prodiList.map((p) => (
                <option key={p.id} value={p.nama}>
                  {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                </option>
              ))}
            </select>
          </div>

          {/* SEARCHABLE ANGKATAN INPUT FILTER (NO MASSIVE SCROLL DROPDOWN) */}
          <div className="flex items-center gap-1.5 flex-1 sm:flex-none">
            <span className="text-xs font-bold text-slate-700 shrink-0">Angkatan:</span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={filterAngkatan === 'semua' ? '' : filterAngkatan}
                onChange={(e) => setFilterAngkatan(e.target.value.trim() === '' ? 'semua' : e.target.value)}
                placeholder="Cari tahun (1950-3000)..."
                className="glass-input text-xs font-semibold py-2 px-3 rounded-xl bg-slate-100/90 border-slate-300 text-slate-900 w-44"
              />
              {filterAngkatan !== 'semua' && (
                <button
                  onClick={() => setFilterAngkatan('semua')}
                  className="absolute right-2.5 text-xs font-bold text-slate-400 hover:text-red-500"
                  title="Reset Filter Angkatan"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Card */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <h3 className="text-base font-black text-slate-900 tracking-wide">
            Daftar Mahasiswa Terdaftar ({filteredMahasiswas.length} Orang)
          </h3>

          <button
            type="button"
            onClick={downloadMahasiswaBiodataTemplate}
            className="text-xs font-extrabold text-sky-600 hover:underline flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-500" />
            <span>Download Template Excel 32-Item Biodata</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-100/90 text-slate-700 font-extrabold uppercase text-xs tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">NIM</th>
                <th className="py-3 px-4">NAMA LENGKAP & EMAIL</th>
                <th className="py-3 px-4">PROGRAM STUDI</th>
                <th className="py-3 px-4">ANGKATAN</th>
                <th className="py-3 px-4">STATUS AKADEMIK</th>
                <th className="py-3 px-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredMahasiswas.length > 0 ? (
                filteredMahasiswas.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-700 whitespace-nowrap">
                      <span className="bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200 font-mono">
                        {m.nim || m.usernameOrId || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-slate-900">{m.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 whitespace-nowrap">{m.prodi || '-'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 font-bold whitespace-nowrap">{m.angkatan || 2026}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          m.role === 'alumni'
                            ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                            : 'bg-blue-500/10 text-blue-700 border border-blue-500/20'
                        }`}
                      >
                        {m.role === 'alumni' ? 'Alumni' : 'AKTIF'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setViewDetailMhs(m)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors cursor-pointer"
                          title="Lihat Detail 32 Biodata"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingMhs({ ...m })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-500/10 transition-colors cursor-pointer"
                          title="Edit Data Mahasiswa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTargetId(m.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
                          title="Hapus Data Mahasiswa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-semibold text-xs">
                    Tidak ditemukan data mahasiswa yang sesuai kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL IMPOR EXCEL 32-ITEM BIODATA */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <span>Pratinjau Impor Batch {importedPreview.length} Mahasiswa (Biodata Lengkap)</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-72">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-2">NIM</th>
                    <th className="p-2">NAMA LENGKAP</th>
                    <th className="p-2">PRODI</th>
                    <th className="p-2">ANGKATAN</th>
                    <th className="p-2">NO HP</th>
                    <th className="p-2">AYAH</th>
                    <th className="p-2">IBU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {importedPreview.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-bold text-sky-700">{row['NIM'] || row['Username/NIM/NIP'] || '-'}</td>
                      <td className="p-2 font-bold text-slate-900">{row['Nama Lengkap'] || '-'}</td>
                      <td className="p-2">{row['Program Studi'] || row['Prodi'] || '-'}</td>
                      <td className="p-2 font-mono">{row['Angkatan'] || 2026}</td>
                      <td className="p-2">{row['No HP'] || '-'}</td>
                      <td className="p-2">{row['Nama Ayah'] || '-'}</td>
                      <td className="p-2">{row['Nama Ibu'] || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchImport}
                className="glass-button text-xs font-bold py-2 px-5"
              >
                Konfirmasi Impor ({importedPreview.length} Mahasiswa)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW DETAIL 32 BIODATA ITEM */}
      {viewDetailMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-3xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-sky-500" />
                <span>Detail Biodata Mahasiswa: {viewDetailMhs.fullName}</span>
              </h3>
              <button onClick={() => setViewDetailMhs(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-slate-200">
                <h4 className="font-extrabold text-sky-700 border-b pb-1">I. IDENTITAS PRIBADI MAHASISWA</h4>
                <div><strong>NIM:</strong> {viewDetailMhs.nim || viewDetailMhs.usernameOrId || '-'}</div>
                <div><strong>Nama Lengkap:</strong> {viewDetailMhs.fullName}</div>
                <div><strong>Program Studi:</strong> {viewDetailMhs.prodi || '-'}</div>
                <div><strong>Angkatan:</strong> {viewDetailMhs.angkatan || 2026}</div>
                <div><strong>Tempat / Tgl Lahir:</strong> {viewDetailMhs.tempatLahir || '-'}, {viewDetailMhs.tanggalLahir || '-'}</div>
                <div><strong>Jenis Kelamin:</strong> {viewDetailMhs.jenisKelamin || '-'}</div>
                <div><strong>Agama:</strong> {viewDetailMhs.agama || '-'}</div>
                <div><strong>NIK (KTP):</strong> {viewDetailMhs.nik || '-'}</div>
                <div><strong>NISN:</strong> {viewDetailMhs.nisn || '-'}</div>
                <div><strong>NPWP:</strong> {viewDetailMhs.npwp || '-'}</div>
                <div><strong>Email:</strong> {viewDetailMhs.email}</div>
                <div><strong>No HP:</strong> {viewDetailMhs.noHp || '-'}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 space-y-2 border border-slate-200">
                <h4 className="font-extrabold text-sky-700 border-b pb-1">II. ALAMAT & ORANG TUA</h4>
                <div><strong>Alamat Jalan:</strong> {viewDetailMhs.jalan || '-'}</div>
                <div><strong>RT / RW / Dusun:</strong> RT {viewDetailMhs.rt || '-'} / RW {viewDetailMhs.rw || '-'} / {viewDetailMhs.dusun || '-'}</div>
                <div><strong>Kelurahan / Kecamatan:</strong> {viewDetailMhs.kelurahan || '-'}, {viewDetailMhs.kecamatan || '-'} ({viewDetailMhs.kodePos || '-'})</div>
                <div><strong>Transportasi:</strong> {viewDetailMhs.alatTransportasi || '-'}</div>
                <div><strong>Status Tinggal:</strong> {viewDetailMhs.statusTempatTinggal || '-'}</div>
                <div className="pt-2 border-t font-extrabold text-sky-700">DATA AYAH:</div>
                <div><strong>Nama Ayah:</strong> {viewDetailMhs.namaAyah || '-'}</div>
                <div><strong>Pekerjaan Ayah:</strong> {viewDetailMhs.pekerjaanAyah || '-'}</div>
                <div><strong>Penghasilan Ayah:</strong> {viewDetailMhs.penghasilanAyah || '-'}</div>
                <div className="pt-2 border-t font-extrabold text-sky-700">DATA IBU:</div>
                <div><strong>Nama Ibu:</strong> {viewDetailMhs.namaIbu || '-'}</div>
                <div><strong>Pekerjaan Ibu:</strong> {viewDetailMhs.pekerjaanIbu || '-'}</div>
                <div><strong>Penghasilan Ibu:</strong> {viewDetailMhs.penghasilanIbu || '-'}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewDetailMhs(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH MAHASISWA BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-500" />
                <span>Tambah Data Mahasiswa Baru</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMahasiswa} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIM (Nomor Induk) *</label>
                  <input
                    type="text"
                    required
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 2026001"
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Angkatan *</label>
                  <input
                    type="number"
                    required
                    value={angkatan}
                    onChange={(e) => setAngkatan(e.target.value)}
                    placeholder="Contoh: 2026"
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi *</label>
                <select
                  value={prodi}
                  onChange={(e) => setProdi(e.target.value)}
                  className="w-full glass-input text-xs font-semibold"
                >
                  {prodiList.map((p) => (
                    <option key={p.id} value={p.nama}>
                      {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Akademik *</label>
                <select value={statusAkademik} onChange={(e) => setStatusAkademik(e.target.value as any)} className="w-full glass-input text-xs font-semibold">
                  <option value="Aktif">Mahasiswa Aktif</option>
                  <option value="PRALA">Sedang PRALA</option>
                  <option value="Magang">Sedang Magang MTPD</option>
                  <option value="Lulus / Alumni">Lulus / Alumni</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2 px-5">
                  Simpan Mahasiswa Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT DATA MAHASISWA */}
      {editingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-sky-500" />
                <span>Edit Biodata Mahasiswa</span>
              </h3>
              <button onClick={() => setEditingMhs(null)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditMahasiswa} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Mahasiswa *</label>
                <input
                  type="text"
                  required
                  value={editingMhs.fullName}
                  onChange={(e) => setEditingMhs({ ...editingMhs, fullName: e.target.value })}
                  className="w-full glass-input text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIM *</label>
                  <input
                    type="text"
                    required
                    value={editingMhs.nim || editingMhs.usernameOrId || ''}
                    onChange={(e) => setEditingMhs({ ...editingMhs, nim: e.target.value, usernameOrId: e.target.value })}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun Angkatan *</label>
                  <input
                    type="number"
                    required
                    value={editingMhs.angkatan || 2026}
                    onChange={(e) => setEditingMhs({ ...editingMhs, angkatan: Number(e.target.value) })}
                    className="w-full glass-input text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Program Studi *</label>
                <select
                  value={editingMhs.prodi || prodiList[0]?.nama}
                  onChange={(e) => setEditingMhs({ ...editingMhs, prodi: e.target.value })}
                  className="w-full glass-input text-xs font-semibold"
                >
                  {prodiList.map((p) => (
                    <option key={p.id} value={p.nama}>
                      {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMhs(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button type="submit" className="glass-button text-xs font-bold py-2 px-5">
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
            <h3 className="text-base font-black text-slate-900">Konfirmasi Hapus Data</h3>
            <p className="text-xs text-slate-600 font-semibold">
              Apakah Anda yakin ingin menghapus mahasiswa ini dari database SIAKAL?
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
                onClick={confirmDeleteMahasiswa}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
