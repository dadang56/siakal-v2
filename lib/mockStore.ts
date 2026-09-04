// Global Mock State Store for SIAKAL V2
export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'mahasiswa' | 'dosen' | 'pembimbing_lapangan' | 'alumni' | 'unit_approver';
  usernameOrId?: string; // NIM, NIP, or Username ID for logging in
  initialPassword?: string; // Default password
  nip?: string;
  namaLengkapGelar?: string;
  ttdImageUrl?: string;
  isProfileCompleted?: boolean;
  prodi?: string;
  angkatan?: number;
  nim?: string;

  // Extended 32 Official Biodata Items
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  namaIbu?: string;
  agama?: string;
  nik?: string;
  nisn?: string;
  npwp?: string;
  noHp?: string;
  jalan?: string;
  dusun?: string;
  rt?: string;
  rw?: string;
  kelurahan?: string;
  kecamatan?: string;
  kodePos?: string;
  alatTransportasi?: string;
  statusTempatTinggal?: string;

  // Data Orang Tua (Ayah & Ibu)
  namaAyah?: string;
  nikAyah?: string;
  tanggalLahirAyah?: string;
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: string;

  nikIbu?: string;
  tanggalLahirIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: string;

  // Dosen Pembimbing Mahasiswa Allocation
  mahasiswaBimbinganNames?: string[];
}

export interface Achievement {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  namaEvent: string;
  jenisPrestasi: 'Akademik' | 'Non-Akademik';
  tingkat: 'Lokal' | 'Regional' | 'Nasional' | 'Internasional';
  capaian: string;
  penyelenggara: string;
  tanggalKegiatan: string;
  fileBuktiUrl: string;
  statusVerifikasi: 'Pending' | 'APPROVED' | 'REJECTED';
  catatanAdmin?: string;
}

export interface ScholarshipOffer {
  id: string;
  namaBeasiswa: string;
  jenisBeasiswa: string;
  sasaran: string;
  ketentuan: string;
  persyaratan: string[];
  kuota: number;
  tanggalBuka: string;
  tanggalTutup: string;
  status: 'Buka' | 'Seleksi' | 'Selesai';
  notulenRapatUrl?: string;
  daftarHadirUrl?: string;
  beritaAcaraUrl?: string;
}

export interface ScholarshipApplication {
  id: string;
  penawaranId: string;
  namaBeasiswa: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  prodi: string;
  berkasUploaded: { [key: string]: string };
  status: 'Diajukan' | 'Verifikasi' | 'DITERIMA' | 'TIDAK_DITERIMA';
  appliedAt: string;
}

export interface ProdiItem {
  id: string;
  nama: string;
  jenjang: 'Diploma III' | 'Diploma IV';
  kode: string;
}

export const initialProdiList: ProdiItem[] = [
  { id: 'prodi-1', nama: 'Studi Nautika', jenjang: 'Diploma III', kode: 'PRODI-NT-01' },
  { id: 'prodi-2', nama: 'Permesinan Kapal', jenjang: 'Diploma III', kode: 'PRODI-PK-02' },
  { id: 'prodi-3', nama: 'Manajemen Transportasi Perairan Daratan', jenjang: 'Diploma III', kode: 'PRODI-MTPD-03' },
  { id: 'prodi-4', nama: 'Teknologi Rekayasa Pelayaran & TSDP', jenjang: 'Diploma IV', kode: 'PRODI-TSDP-04' },
];

export const initialAccounts: UserAccount[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@siakal.poltek.ac.id',
    fullName: 'Administrator SIAKAL V2',
    role: 'admin',
    usernameOrId: 'admin',
    initialPassword: 'SIAKAL2026!',
  },
  {
    id: 'usr-mhs-1',
    email: 'ahmad.fauzi@mhs.poltek.ac.id',
    fullName: 'Ahmad Fauzi',
    role: 'mahasiswa',
    usernameOrId: '111111',
    nim: '111111',
    initialPassword: 'SIAKAL2026!',
    prodi: 'Studi Nautika',
    angkatan: 2023,
    isProfileCompleted: true,
  },
  {
    id: 'usr-mhs-2',
    email: 'bambang@mhs.poltek.ac.id',
    fullName: 'Bambang Pratama',
    role: 'mahasiswa',
    usernameOrId: '2102011',
    nim: '2102011',
    initialPassword: 'SIAKAL2026!',
    prodi: 'Manajemen Transportasi Perairan Daratan',
    angkatan: 2023,
    isProfileCompleted: true,
  },
  {
    id: 'usr-dosen-1',
    email: 'budi.santoso@dosen.poltek.ac.id',
    fullName: 'Capt. Budi Santoso, M.Mar.',
    role: 'dosen',
    usernameOrId: '198503152010121002',
    nip: '198503152010121002',
    initialPassword: 'Dosen2026!',
    prodi: 'Studi Nautika',
  },
  {
    id: 'usr-pembimbing-1',
    email: 'supervisor@ptpelni.co.id',
    fullName: 'Hendra Gunawan (PT PELNI)',
    role: 'pembimbing_lapangan',
    usernameOrId: 'supervisor_pelni',
    initialPassword: 'Pelni2026!',
  },
  {
    id: 'usr-alumni-1',
    email: 'deni@alumni.poltek.ac.id',
    fullName: 'Deni Kurniawan, A.Md.Tra.',
    role: 'alumni',
    usernameOrId: '2001015',
    nim: '2001015',
    initialPassword: 'Alumni2026!',
    prodi: 'Studi Nautika',
    angkatan: 2020,
  },
  {
    id: 'usr-approver-1',
    email: 'perpus@poltek.ac.id',
    fullName: 'Unit Perpustakaan',
    role: 'unit_approver',
    usernameOrId: 'perpus_03',
    initialPassword: 'Perpus2026!',
    namaLengkapGelar: 'Dra. Sri Wahyuni, M.IP.',
    nip: '197005121995032001',
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    mahasiswaId: 'usr-mhs-1',
    mahasiswaNama: 'Ahmad Fauzi',
    namaEvent: 'Lomba Karya Tulis Ilmiah Maritim Nasional 2025',
    jenisPrestasi: 'Akademik',
    tingkat: 'Nasional',
    capaian: 'Juara 1 Karya Tulis Ilmiah Navigasi',
    penyelenggara: 'Kementerian Perhubungan RI',
    tanggalKegiatan: '2025-09-15',
    fileBuktiUrl: 'https://example.com/sertifikat-fauzi.pdf',
    statusVerifikasi: 'APPROVED',
  },
];

export const initialScholarshipOffers: ScholarshipOffer[] = [
  {
    id: 'sch-1',
    namaBeasiswa: 'Beasiswa Unggulan Perhubungan 2026',
    jenisBeasiswa: 'Prestasi Akademik',
    sasaran: 'Mahasiswa Aktif Semester III - V',
    ketentuan: 'IPK Minimal 3.50 & Tidak Sedang Menerima Beasiswa Lain',
    persyaratan: ['KTM / Surat Aktif Kuliah', 'Transkrip Nilai Legalisir', 'Surat Bebas Beasiswa Lain'],
    kuota: 15,
    tanggalBuka: '2026-01-10',
    tanggalTutup: '2026-03-31',
    status: 'Buka',
  },
];

export const initialClearanceUnits = [
  { id: 'unit-perpus', name: 'Perpustakaan Kampus', namaUnit: 'Perpustakaan Kampus', kode: 'PERPUS', code: 'PERPUS', unitCode: 10 },
  { id: 'unit-keuangan', name: 'Subbag Keuangan & Keuangan Taruna', namaUnit: 'Subbag Keuangan & Keuangan Taruna', kode: 'KEUANGAN', code: 'KEUANGAN', unitCode: 11 },
  { id: 'unit-ketarunaan', name: 'Pusat Ketarunaan & Pengasuhan', namaUnit: 'Pusat Ketarunaan & Pengasuhan', kode: 'KETARUNAAN', code: 'KETARUNAAN', unitCode: 12 },
  { id: 'unit-prodi', name: 'Ketua Program Studi', namaUnit: 'Ketua Program Studi', kode: 'PRODI', code: 'PRODI', unitCode: 13 },
  { id: 'unit-lab', name: 'Laboratorium & Bengkel Kapal', namaUnit: 'Laboratorium & Bengkel Kapal', kode: 'LABORATORIUM', code: 'LABORATORIUM', unitCode: 14 },
];

export interface PeriodeItem {
  id: string;
  tahun: string; // e.g. "2025/2026"
  semester: 'Ganjil' | 'Genap';
  isAktif: boolean;
  kodePeriode?: string; // e.g. "20251"
  createdDate?: string;
}

export const initialPeriodeList: PeriodeItem[] = [
  { id: 'per-1', tahun: '2025/2026', semester: 'Ganjil', isAktif: true, kodePeriode: '20251', createdDate: '2025-08-01' },
  { id: 'per-2', tahun: '2024/2025', semester: 'Genap', isAktif: false, kodePeriode: '20242', createdDate: '2025-01-10' },
  { id: 'per-3', tahun: '2024/2025', semester: 'Ganjil', isAktif: false, kodePeriode: '20241', createdDate: '2024-08-01' },
];

export function getActivePeriode(): PeriodeItem {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('siakal_periode_list');
      if (stored) {
        const parsed: PeriodeItem[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const active = parsed.find((p) => p.isAktif);
          if (active) return active;
        }
      }
    } catch (e) {}
  }
  return initialPeriodeList[0];
}
