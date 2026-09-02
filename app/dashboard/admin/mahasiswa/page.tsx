'use client';

import React, { useState, useEffect } from 'react';
import { Search, Download, Upload, Plus, Trash2, Edit3, FileSpreadsheet, GraduationCap, AlertTriangle, Eye, X, User, Home, Users2, ChevronRight, ChevronLeft, Save } from 'lucide-react';
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

  // Active Form Tab: 'identitas' | 'alamat' | 'orangtua'
  const [activeFormTab, setActiveFormTab] = useState<'identitas' | 'alamat' | 'orangtua'>('identitas');

  // Excel Batch Import Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedPreview, setImportedPreview] = useState<any[]>([]);

  // Form State for Add Mahasiswa
  const [fullName, setFullName] = useState('');
  const [nim, setNim] = useState('');
  const [prodi, setProdi] = useState(prodiList[0]?.nama || 'Studi Nautika');
  const [angkatan, setAngkatan] = useState('2026');
  const [statusAkademik, setStatusAkademik] = useState<'Aktif' | 'PRALA' | 'Magang' | 'Lulus / Alumni'>('Aktif');
  const [email, setEmail] = useState('');

  // Extended Biodata Fields State
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

  const resetAddForm = () => {
    setFullName('');
    setNim('');
    setEmail('');
    setTempatLahir('');
    setTanggalLahir('');
    setNik('');
    setNisn('');
    setNpwp('');
    setNoHp('');
    setJalan('');
    setDusun('');
    setRt('');
    setRw('');
    setKelurahan('');
    setKecamatan('');
    setKodePos('');
    setNamaAyah('');
    setNikAyah('');
    setTanggalLahirAyah('');
    setNamaIbu('');
    setNikIbu('');
    setTanggalLahirIbu('');
    setActiveFormTab('identitas');
  };

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
    if (!fullName || !nim) {
      alert('Mohon isi Nama Lengkap dan NIM Mahasiswa!');
      return;
    }

    const newMhs: UserAccount = {
      id: `mhs-${Date.now()}`,
      fullName,
      email: email || `${nim}@siakal.poltek.ac.id`,
      role: statusAkademik === 'Lulus / Alumni' ? 'alumni' : 'mahasiswa',
      nim,
      usernameOrId: nim,
      initialPassword: 'SIAKAL2026!',
      prodi: prodi || prodiList[0]?.nama,
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
    resetAddForm();
    alert(`Data mahasiswa (${fullName}) berhasil disimpan!`);
  };

  const handleSaveEditMahasiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMhs) return;

    const updatedList = mahasiswas.map((m) => (m.id === editingMhs.id ? editingMhs : m));
    saveAllUsers(updatedList);
    setEditingMhs(null);
    alert(`Perubahan data (${editingMhs.fullName}) berhasil disimpan!`);
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
    alert(`Berhasil mengimpor ${newStudents.length} data mahasiswa!`);
  };

  const handleExport = () => {
    exportToExcel(
      [
        {
          sheetName: 'Database Mahasiswa',
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
      'Database_Mahasiswa_SIAKAL'
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

  const transportOptions = [
    'Sepeda motor',
    'Mobil pribadi',
    'Perahu penyeberangan/rakit/getek',
    'Jalan kaki',
    'Mobil/bus antar jemput',
    'Ojek',
    'Kereta api',
    'Sepeda',
    'Angkutan umum/bus/pete-pete',
    'Andong/bendi/sado/dokar/delman/becak',
    'Lainnya',
  ];

  const tempatTinggalOptions = [
    'Bersama orang tua',
    'Kost',
    'Wali',
    'Asrama',
    'Rumah sendiri',
    'Panti asuhan',
    'Lainnya',
  ];

  const pekerjaanOptions = [
    'Wiraswasta',
    'PNS/TNI/Polri',
    'Karyawan Swasta',
    'Petani',
    'Nelayan',
    'Wirausaha',
    'Pedagang Kecil',
    'Pedagang Besar',
    'Tenaga Pengajar / Instruktur / Fasilitator',
    'Pimpinan / Manajerial',
    'Tim Ahli / Konsultan',
    'Peneliti',
    'Pensiunan',
    'Peternak',
    'Buruh',
    'Tidak bekerja',
    'Sudah Meninggal',
    'Lainnya',
  ];

  const penghasilanOptions = [
    'Kurang dari Rp. 500,000',
    'Rp. 500,000 - Rp. 999,999',
    'Rp. 1,000,000 - Rp. 1,999,999',
    'Rp. 2,000,000 - Rp. 4,999,999',
    'Rp. 5,000,000 - Rp. 20,000,000',
    'Lebih dari Rp. 20,000,000',
  ];

  const pendidikanOptions = [
    'S1 / D4',
    'S2 / S3',
    'D3 / D2 / D1',
    'SMA / SMK',
    'SMP / MPT',
    'SD / MI',
    'Tidak Sekolah',
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner Card - CLEAN & UNIFORM 1-LINE BUTTON BAR */}
      <div className="glass-panel p-6 border-l-4 border-l-sky-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-white rounded-2xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <GraduationCap className="w-6 h-6 text-sky-500 shrink-0" />
            <span>Pusat Database Mahasiswa</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-semibold">
            Kelola data mahasiswa, pencarian angkatan, prodi terintegrasi, dan impor Excel.
          </p>
        </div>

        {/* ALIGNED SINGLE ROW BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <label className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-slate-600" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx,.xls" onChange={handleExcelImportUpload} className="hidden" />
          </label>

          <button onClick={handleExport} className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 shadow-sm transition-all cursor-pointer">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Ekspor .XLSX</span>
          </button>

          <button onClick={() => { resetAddForm(); setShowAddModal(true); }} className="glass-button text-xs sm:text-sm font-extrabold flex items-center gap-2 py-2.5 px-4 shadow-md cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Tambah Mahasiswa</span>
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
          {/* DYNAMIC PRODI FILTER */}
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

          {/* SEARCHABLE ANGKATAN INPUT FILTER */}
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
            className="text-xs font-extrabold text-sky-600 hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-sky-500" />
            <span>Download Template Excel</span>
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
                          title="Lihat Detail Biodata"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => { setEditingMhs({ ...m }); setActiveFormTab('identitas'); }}
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

      {/* FULL-SCREEN SPACIOUS MODAL TAMBAH DATA MAHASISWA BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-[1400px] h-[92vh] p-6 sm:p-8 space-y-6 border border-slate-300 shadow-2xl relative bg-white rounded-3xl flex flex-col justify-between overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
                  <Plus className="w-6 h-6 text-sky-500" />
                  <span>Tambah Data Mahasiswa Baru</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  Input data mahasiswa secara lengkap sesuai formulir & template Excel resmi.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* TAB STEP NAVIGATION BADGES */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-b border-slate-200 pb-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFormTab('identitas')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'identitas'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'identitas' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 1</div>
                  <div className="text-xs sm:text-sm font-black">1. Identitas Diri (Item 1-9, 17)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('alamat')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'alamat'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'alamat' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 2</div>
                  <div className="text-xs sm:text-sm font-black">2. Alamat & Transportasi (Item 10-20)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('orangtua')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'orangtua'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'orangtua' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 3</div>
                  <div className="text-xs sm:text-sm font-black">3. Data Orang Tua / Wali (Item 21-32)</div>
                </div>
              </button>
            </div>

            {/* FORM CONTENT AREA - FULL SCREEN SCROLLABLE & SPACIOUS GRID */}
            <form onSubmit={handleAddMahasiswa} className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* TAB 1: IDENTITAS DIRI */}
              {activeFormTab === 'identitas' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">A. INFORMASI AKADEMIK KAMPUS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">1. Nama Lengkap Mahasiswa *</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Contoh: Ahmad Fauzi"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">NIM / Username ID Masuk *</label>
                        <input
                          type="text"
                          required
                          value={nim}
                          onChange={(e) => setNim(e.target.value)}
                          placeholder="Contoh: 2026001"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Program Studi *</label>
                        <select
                          value={prodi}
                          onChange={(e) => setProdi(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {prodiList.map((p) => (
                            <option key={p.id} value={p.nama}>
                              {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Angkatan *</label>
                        <input
                          type="number"
                          required
                          value={angkatan}
                          onChange={(e) => setAngkatan(e.target.value)}
                          placeholder="Contoh: 2026"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Status Akademik *</label>
                        <select
                          value={statusAkademik}
                          onChange={(e) => setStatusAkademik(e.target.value as any)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="Aktif">Mahasiswa Aktif</option>
                          <option value="PRALA">Sedang PRALA</option>
                          <option value="Magang">Sedang Magang MTPD</option>
                          <option value="Lulus / Alumni">Lulus / Alumni</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">B. IDENTITAS KEPENDUDUKAN & KONTAK</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">2. Tempat Lahir</label>
                        <input
                          type="text"
                          value={tempatLahir}
                          onChange={(e) => setTempatLahir(e.target.value)}
                          placeholder="Contoh: Palembang"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">5. Tanggal Lahir</label>
                        <input
                          type="date"
                          value={tanggalLahir}
                          onChange={(e) => setTanggalLahir(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">3. Jenis Kelamin</label>
                        <select
                          value={jenisKelamin}
                          onChange={(e) => setJenisKelamin(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">6. Agama</label>
                        <select
                          value={agama}
                          onChange={(e) => setAgama(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="Islam">Islam</option>
                          <option value="Kristen Protestan">Kristen Protestan</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Khonghucu">Khonghucu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">7. NIK (KTP)</label>
                        <input
                          type="text"
                          value={nik}
                          onChange={(e) => setNik(e.target.value)}
                          placeholder="16 Digit NIK"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">8. NISN</label>
                        <input
                          type="text"
                          value={nisn}
                          onChange={(e) => setNisn(e.target.value)}
                          placeholder="10 Digit NISN"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">9. NPWP</label>
                        <input
                          type="text"
                          value={npwp}
                          onChange={(e) => setNpwp(e.target.value)}
                          placeholder="Nomor NPWP"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">17. Email Resmi</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@mhs.poltek.ac.id"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">11. No HP / WhatsApp</label>
                        <input
                          type="text"
                          value={noHp}
                          onChange={(e) => setNoHp(e.target.value)}
                          placeholder="081234567890"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ALAMAT & TRANSPORTASI */}
              {activeFormTab === 'alamat' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">A. ALAMAT DOMISILI RUMAH</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">10. Jalan / Alamat Lengkap Rumah</label>
                      <input
                        type="text"
                        value={jalan}
                        onChange={(e) => setJalan(e.target.value)}
                        placeholder="Contoh: Jl. Merdeka No. 45"
                        className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">12. Dusun</label>
                        <input
                          type="text"
                          value={dusun}
                          onChange={(e) => setDusun(e.target.value)}
                          placeholder="Contoh: Dusun II"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">13. RT</label>
                        <input
                          type="text"
                          value={rt}
                          onChange={(e) => setRt(e.target.value)}
                          placeholder="Contoh: 002"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">14. RW</label>
                        <input
                          type="text"
                          value={rw}
                          onChange={(e) => setRw(e.target.value)}
                          placeholder="Contoh: 001"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">15. Kelurahan</label>
                        <input
                          type="text"
                          value={kelurahan}
                          onChange={(e) => setKelurahan(e.target.value)}
                          placeholder="Contoh: Bukit Kecil"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">18. Kecamatan</label>
                        <input
                          type="text"
                          value={kecamatan}
                          onChange={(e) => setKecamatan(e.target.value)}
                          placeholder="Contoh: Ilir Barat I"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">16. Kode Pos</label>
                        <input
                          type="text"
                          value={kodePos}
                          onChange={(e) => setKodePos(e.target.value)}
                          placeholder="Contoh: 30135"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">B. TRANSPORTASI & STATS TINGGAL</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">19. Alat Transportasi yang Dipunya</label>
                        <select
                          value={alatTransportasi}
                          onChange={(e) => setAlatTransportasi(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {transportOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">20. Status Tempat Tinggal</label>
                        <select
                          value={statusTempatTinggal}
                          onChange={(e) => setStatusTempatTinggal(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {tempatTinggalOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DATA ORANG TUA (AYAH & IBU) */}
              {activeFormTab === 'orangtua' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* SECTION AYAH */}
                  <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider">A. DATA AYAH KANDUNG (ITEM 21-26)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">21. Nama Ayah</label>
                        <input
                          type="text"
                          value={namaAyah}
                          onChange={(e) => setNamaAyah(e.target.value)}
                          placeholder="Nama lengkap ayah"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">22. NIK Ayah</label>
                        <input
                          type="text"
                          value={nikAyah}
                          onChange={(e) => setNikAyah(e.target.value)}
                          placeholder="16 digit NIK ayah"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">23. Tanggal Lahir Ayah</label>
                        <input
                          type="date"
                          value={tanggalLahirAyah}
                          onChange={(e) => setTanggalLahirAyah(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">24. Pendidikan Ayah</label>
                        <select
                          value={pendidikanAyah}
                          onChange={(e) => setPendidikanAyah(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pendidikanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">25. Pekerjaan Ayah</label>
                        <select
                          value={pekerjaanAyah}
                          onChange={(e) => setPekerjaanAyah(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pekerjaanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">26. Penghasilan Ayah</label>
                        <select
                          value={penghasilanAyah}
                          onChange={(e) => setPenghasilanAyah(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {penghasilanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION IBU */}
                  <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 space-y-4">
                    <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">B. DATA IBU KANDUNG (ITEM 27-32)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">27. Nama Ibu</label>
                        <input
                          type="text"
                          value={namaIbu}
                          onChange={(e) => setNamaIbu(e.target.value)}
                          placeholder="Nama lengkap ibu"
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">28. NIK Ibu</label>
                        <input
                          type="text"
                          value={nikIbu}
                          onChange={(e) => setNikIbu(e.target.value)}
                          placeholder="16 digit NIK ibu"
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">29. Tanggal Lahir Ibu</label>
                        <input
                          type="date"
                          value={tanggalLahirIbu}
                          onChange={(e) => setTanggalLahirIbu(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">30. Pendidikan Ibu</label>
                        <select
                          value={pendidikanIbu}
                          onChange={(e) => setPendidikanIbu(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pendidikanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">31. Pekerjaan Ibu</label>
                        <select
                          value={pekerjaanIbu}
                          onChange={(e) => setPekerjaanIbu(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pekerjaanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">32. Penghasilan Ibu</label>
                        <select
                          value={penghasilanIbu}
                          onChange={(e) => setPenghasilanIbu(e.target.value)}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {penghasilanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* MODAL ACTION FOOTER STICKY */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>
                  {activeFormTab === 'identitas' && 'Langkah 1 dari 3: Identitas Diri Mahasiswa'}
                  {activeFormTab === 'alamat' && 'Langkah 2 dari 3: Alamat Tempat Tinggal & Transportasi'}
                  {activeFormTab === 'orangtua' && 'Langkah 3 dari 3: Data Orang Tua / Ayah & Ibu'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {activeFormTab !== 'identitas' && (
                  <button
                    type="button"
                    onClick={() => setActiveFormTab(activeFormTab === 'orangtua' ? 'alamat' : 'identitas')}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Langkah Sebelumnya</span>
                  </button>
                )}

                {activeFormTab !== 'orangtua' ? (
                  <button
                    type="button"
                    onClick={() => setActiveFormTab(activeFormTab === 'identitas' ? 'alamat' : 'orangtua')}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 text-white font-extrabold text-xs sm:text-sm hover:bg-sky-500 shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Langkah Berikutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleAddMahasiswa}
                    className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6 shadow-xl flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Data Mahasiswa</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* FULL-SCREEN SPACIOUS MODAL EDIT DATA MAHASISWA */}
      {editingMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-[1400px] h-[92vh] p-6 sm:p-8 space-y-6 border border-slate-300 shadow-2xl relative bg-white rounded-3xl flex flex-col justify-between overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-3">
                  <Edit3 className="w-6 h-6 text-sky-500" />
                  <span>Edit Biodata Mahasiswa: {editingMhs.fullName}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  Ubah dan perbarui data biodata mahasiswa secara terstruktur.
                </p>
              </div>
              <button
                onClick={() => setEditingMhs(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors font-bold"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* TAB STEP NAVIGATION BADGES */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 border-b border-slate-200 pb-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveFormTab('identitas')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'identitas'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'identitas' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 1</div>
                  <div className="text-xs sm:text-sm font-black">1. Identitas Diri (Item 1-9, 17)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('alamat')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'alamat'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'alamat' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 2</div>
                  <div className="text-xs sm:text-sm font-black">2. Alamat & Transportasi (Item 10-20)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveFormTab('orangtua')}
                className={`p-3.5 rounded-2xl text-left flex items-center gap-3 transition-all cursor-pointer border ${
                  activeFormTab === 'orangtua'
                    ? 'bg-sky-500 text-white border-sky-600 shadow-lg scale-[1.01]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${activeFormTab === 'orangtua' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-600'}`}>
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-80">Langkah 3</div>
                  <div className="text-xs sm:text-sm font-black">3. Data Orang Tua (Item 21-32)</div>
                </div>
              </button>
            </div>

            {/* FORM CONTENT AREA EDIT */}
            <form onSubmit={handleSaveEditMahasiswa} className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* TAB 1 EDIT */}
              {activeFormTab === 'identitas' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">A. INFORMASI AKADEMIK KAMPUS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">1. Nama Lengkap Mahasiswa *</label>
                        <input
                          type="text"
                          required
                          value={editingMhs.fullName}
                          onChange={(e) => setEditingMhs({ ...editingMhs, fullName: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">NIM / Username ID *</label>
                        <input
                          type="text"
                          required
                          value={editingMhs.nim || editingMhs.usernameOrId || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, nim: e.target.value, usernameOrId: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Program Studi *</label>
                        <select
                          value={editingMhs.prodi || prodiList[0]?.nama}
                          onChange={(e) => setEditingMhs({ ...editingMhs, prodi: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {prodiList.map((p) => (
                            <option key={p.id} value={p.nama}>
                              {p.jenjang === 'Diploma III' ? 'D3' : 'D4'} {p.nama}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Tahun Angkatan *</label>
                        <input
                          type="number"
                          required
                          value={editingMhs.angkatan || 2026}
                          onChange={(e) => setEditingMhs({ ...editingMhs, angkatan: Number(e.target.value) })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">Status Role / Akademik</label>
                        <select
                          value={editingMhs.role}
                          onChange={(e) => setEditingMhs({ ...editingMhs, role: e.target.value as any })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="mahasiswa">Mahasiswa Aktif</option>
                          <option value="alumni">Lulus / Alumni</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">B. IDENTITAS KEPENDUDUKAN & KONTAK</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">2. Tempat Lahir</label>
                        <input
                          type="text"
                          value={editingMhs.tempatLahir || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, tempatLahir: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">5. Tanggal Lahir</label>
                        <input
                          type="date"
                          value={editingMhs.tanggalLahir || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, tanggalLahir: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">3. Jenis Kelamin</label>
                        <select
                          value={editingMhs.jenisKelamin || 'Laki-laki'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, jenisKelamin: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">6. Agama</label>
                        <select
                          value={editingMhs.agama || 'Islam'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, agama: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          <option value="Islam">Islam</option>
                          <option value="Kristen Protestan">Kristen Protestan</option>
                          <option value="Katolik">Katolik</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Khonghucu">Khonghucu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">7. NIK (KTP)</label>
                        <input
                          type="text"
                          value={editingMhs.nik || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, nik: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">8. NISN</label>
                        <input
                          type="text"
                          value={editingMhs.nisn || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, nisn: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">9. NPWP</label>
                        <input
                          type="text"
                          value={editingMhs.npwp || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, npwp: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">17. Email</label>
                        <input
                          type="email"
                          value={editingMhs.email}
                          onChange={(e) => setEditingMhs({ ...editingMhs, email: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">11. No HP</label>
                        <input
                          type="text"
                          value={editingMhs.noHp || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, noHp: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2 EDIT */}
              {activeFormTab === 'alamat' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">A. ALAMAT DOMISILI RUMAH</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">10. Jalan / Alamat Rumah</label>
                      <input
                        type="text"
                        value={editingMhs.jalan || ''}
                        onChange={(e) => setEditingMhs({ ...editingMhs, jalan: e.target.value })}
                        className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">12. Dusun</label>
                        <input
                          type="text"
                          value={editingMhs.dusun || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, dusun: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">13. RT</label>
                        <input
                          type="text"
                          value={editingMhs.rt || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, rt: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">14. RW</label>
                        <input
                          type="text"
                          value={editingMhs.rw || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, rw: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">15. Kelurahan</label>
                        <input
                          type="text"
                          value={editingMhs.kelurahan || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, kelurahan: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">18. Kecamatan</label>
                        <input
                          type="text"
                          value={editingMhs.kecamatan || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, kecamatan: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">16. Kode Pos</label>
                        <input
                          type="text"
                          value={editingMhs.kodePos || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, kodePos: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-700 uppercase tracking-wider">B. TRANSPORTASI & STATS TINGGAL</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">19. Alat Transportasi</label>
                        <select
                          value={editingMhs.alatTransportasi || 'Sepeda motor'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, alatTransportasi: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {transportOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">20. Status Tempat Tinggal</label>
                        <select
                          value={editingMhs.statusTempatTinggal || 'Bersama orang tua'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, statusTempatTinggal: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {tempatTinggalOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3 EDIT */}
              {activeFormTab === 'orangtua' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="bg-sky-50/70 p-5 rounded-2xl border border-sky-200 space-y-4">
                    <h4 className="text-xs font-black text-sky-900 uppercase tracking-wider">A. DATA AYAH KANDUNG</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">21. Nama Ayah</label>
                        <input
                          type="text"
                          value={editingMhs.namaAyah || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, namaAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">22. NIK Ayah</label>
                        <input
                          type="text"
                          value={editingMhs.nikAyah || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, nikAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">23. Tgl Lahir Ayah</label>
                        <input
                          type="date"
                          value={editingMhs.tanggalLahirAyah || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, tanggalLahirAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">24. Pendidikan Ayah</label>
                        <select
                          value={editingMhs.pendidikanAyah || 'SMA / SMK'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, pendidikanAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pendidikanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">25. Pekerjaan Ayah</label>
                        <select
                          value={editingMhs.pekerjaanAyah || 'Wiraswasta'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, pekerjaanAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pekerjaanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">26. Penghasilan Ayah</label>
                        <select
                          value={editingMhs.penghasilanAyah || 'Rp. 5,000,000 - Rp. 20,000,000'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, penghasilanAyah: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {penghasilanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 space-y-4">
                    <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">B. DATA IBU KANDUNG</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">27. Nama Ibu</label>
                        <input
                          type="text"
                          value={editingMhs.namaIbu || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, namaIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">28. NIK Ibu</label>
                        <input
                          type="text"
                          value={editingMhs.nikIbu || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, nikIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-mono py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">29. Tgl Lahir Ibu</label>
                        <input
                          type="date"
                          value={editingMhs.tanggalLahirIbu || ''}
                          onChange={(e) => setEditingMhs({ ...editingMhs, tanggalLahirIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">30. Pendidikan Ibu</label>
                        <select
                          value={editingMhs.pendidikanIbu || 'SMA / SMK'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, pendidikanIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pendidikanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">31. Pekerjaan Ibu</label>
                        <select
                          value={editingMhs.pekerjaanIbu || 'Wirausaha'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, pekerjaanIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {pekerjaanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">32. Penghasilan Ibu</label>
                        <select
                          value={editingMhs.penghasilanIbu || 'Rp. 2,000,000 - Rp. 4,999,999'}
                          onChange={(e) => setEditingMhs({ ...editingMhs, penghasilanIbu: e.target.value })}
                          className="w-full glass-input text-xs sm:text-sm font-semibold py-2.5 px-3.5 bg-white border-slate-300"
                        >
                          {penghasilanOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* MODAL ACTION FOOTER STICKY */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0 bg-white">
              <div className="text-xs font-bold text-slate-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
                <span>
                  {activeFormTab === 'identitas' && 'Langkah 1 dari 3: Identitas Diri Mahasiswa'}
                  {activeFormTab === 'alamat' && 'Langkah 2 dari 3: Alamat Tempat Tinggal & Transportasi'}
                  {activeFormTab === 'orangtua' && 'Langkah 3 dari 3: Data Orang Tua / Ayah & Ibu'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMhs(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>

                <button
                  type="button"
                  onClick={handleSaveEditMahasiswa}
                  className="glass-button text-xs sm:text-sm font-extrabold py-2.5 px-6 shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Data</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL IMPOR EXCEL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
                <span>Pratinjau Impor Batch {importedPreview.length} Mahasiswa</span>
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

      {/* MODAL VIEW DETAIL */}
      {viewDetailMhs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-4xl p-6 space-y-4 border border-slate-300 shadow-2xl relative bg-white rounded-2xl max-h-[85vh] overflow-y-auto text-slate-900">
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
