// Global Mock State Store for SIAKAL V2
export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'mahasiswa' | 'dosen' | 'pembimbing_lapangan' | 'alumni' | 'unit_approver';
  nip?: string;
  namaLengkapGelar?: string;
  ttdImageUrl?: string;
  isProfileCompleted?: boolean;
  prodi?: string;
  angkatan?: number;
  nim?: string;
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

export interface ClearanceRequest {
  id: string;
  mahasiswaId: string;
  mahasiswaNama: string;
  nim: string;
  prodi: string;
  dormitory: string;
  jenisPengajuan: 'PRALA' | 'LULUS' | 'CUTI' | 'BERHENTI';
  nomorFormulir: string;
  statusKeseluruhan: 'Pending' | 'Approved' | 'Rejected';
  unitApprovals: {
    unitCode: number;
    unitName: string;
    status: 'Memenuhi Syarat' | 'Tidak Memenuhi Syarat' | 'Pending';
    approverNamaGelar?: string;
    approverNip?: string;
    approverTtdUrl?: string;
    catatan?: string;
    approvedAt?: string;
  }[];
  createdAt: string;
}

export interface MagangKelompok {
  id: string;
  namaKelompok: string;
  nomorSkMagang: string;
  fileSkPdfUrl: string;
  tempatMagang: string;
  alamatTempatMagang: string;
  pembimbingLapanganNama: string;
  pembimbingLapanganEmail: string;
  anggotaMahasiswa: { id: string; nama: string; nim: string }[];
  laporanJudul?: string;
  laporanPdfUrl?: string;
  laporanStatus?: 'Pending' | 'Diterima' | 'Revisi';
  laporanCatatan?: string;
}

export interface PralaDataKapal {
  mahasiswaId: string;
  namaPerusahaan: string;
  namaKapal: string;
  tipeKapal: string;
  namaContactPerson: string;
  jabatanContactPerson: string;
  noHpContactPerson: string;
  emailContactPerson: string;
}

// Initial Mock Accounts
export const initialAccounts: UserAccount[] = [
  {
    id: 'user-admin-1',
    email: 'admin@siakal.poltek.ac.id',
    fullName: 'Administrator SIAKAL V2',
    role: 'admin',
    isProfileCompleted: true,
  },
  {
    id: 'user-mhs-1',
    email: 'ahmad.fauzi@mhs.poltek.ac.id',
    fullName: 'Ahmad Fauzi',
    role: 'mahasiswa',
    nim: '2101034',
    prodi: 'Studi Nautika',
    angkatan: 2023,
    isProfileCompleted: true,
  },
  {
    id: 'user-mhs-2',
    email: 'bambang@mhs.poltek.ac.id',
    fullName: 'Bambang Pratama',
    role: 'mahasiswa',
    nim: '2102011',
    prodi: 'Manajemen Transportasi Perairan Daratan',
    angkatan: 2023,
    isProfileCompleted: true,
  },
  {
    id: 'user-dosen-1',
    email: 'budi.santoso@dosen.poltek.ac.id',
    fullName: 'Capt. Budi Santoso, M.Mar.',
    role: 'dosen',
    nip: '198503152010121002',
    prodi: 'Studi Nautika',
    isProfileCompleted: true,
  },
  {
    id: 'user-pembimbing-lapangan-1',
    email: 'supervisor@ptpelni.co.id',
    fullName: 'Hendra Gunawan (PT PELNI)',
    role: 'pembimbing_lapangan',
    isProfileCompleted: true,
  },
  {
    id: 'user-alumni-1',
    email: 'deni@alumni.poltek.ac.id',
    fullName: 'Deni Kurniawan, A.Md.Tra.',
    role: 'alumni',
    prodi: 'Studi Nautika',
    angkatan: 2020,
    isProfileCompleted: true,
  },
  {
    id: 'user-unit-1',
    email: 'perpus@poltek.ac.id',
    fullName: 'Unit Perpustakaan',
    role: 'unit_approver',
    nip: '198704202012011003',
    namaLengkapGelar: 'Dra. Sri Wahyuni, M.IP.',
    ttdImageUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=signature-perpus',
    isProfileCompleted: true,
  },
];

// Initial Achievements
export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    mahasiswaId: 'user-mhs-1',
    mahasiswaNama: 'Ahmad Fauzi',
    namaEvent: 'International Maritime Innovation Challenge 2025',
    jenisPrestasi: 'Akademik',
    tingkat: 'Internasional',
    capaian: 'Juara 1',
    penyelenggara: 'World Maritime University',
    tanggalKegiatan: '2025-11-15',
    fileBuktiUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    statusVerifikasi: 'APPROVED',
  },
  {
    id: 'ach-2',
    mahasiswaId: 'user-mhs-1',
    mahasiswaNama: 'Ahmad Fauzi',
    namaEvent: 'Lomba Dayung Ketarunaan Perhubungan Nasional',
    jenisPrestasi: 'Non-Akademik',
    tingkat: 'Nasional',
    capaian: 'Juara 2',
    penyelenggara: 'BPSDM Perhubungan',
    tanggalKegiatan: '2025-09-20',
    fileBuktiUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    statusVerifikasi: 'APPROVED',
  },
];

// Initial Scholarship Offers
export const initialScholarshipOffers: ScholarshipOffer[] = [
  {
    id: 'scholar-1',
    namaBeasiswa: 'Beasiswa Unggulan Transportasi Laut 2026',
    jenisBeasiswa: 'Prestasi Akademik',
    sasaran: 'Seluruh Mahasiswa Studi Nautika & Permesinan Kapal',
    ketentuan: 'Mahasiswa dengan IPK minimal 3.25 dan aktif dalam bimbingan PRALA.',
    persyaratan: ['Scan KTP & Kartu Mahasiswa', 'Transkrip Nilai Legalisir', 'Surat Rekomendasi Dosen'],
    kuota: 10,
    tanggalBuka: '2026-08-01',
    tanggalTutup: '2026-09-15',
    status: 'Buka',
  },
];

// Initial Clearance Units
export const initialClearanceUnits = [
  { unitCode: 1, name: 'BENDAHARA PENERIMAAN' },
  { unitCode: 2, name: 'UNIT ASRAMA' },
  { unitCode: 3, name: 'UNIT PERPUSTAKAAN' },
  { unitCode: 4, name: 'UNIT KOPERASI' },
  { unitCode: 5, name: 'UNIT OLAHRAGA DAN SENI' },
  { unitCode: 6, name: 'KABAG KEUANGAN DAN UMUM' },
  { unitCode: 7, name: 'PRODI (MTPD/NAUTIKA/PERMESINAN KAPAL)' },
  { unitCode: 8, name: 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (AKADEMIK)' },
  { unitCode: 9, name: 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (KETARUNAAN)' },
  { unitCode: 10, name: 'KABAG ADM. AKADEMIK & KETARUNAAN' },
  { unitCode: 11, name: 'UNIT BINTAR' },
  { unitCode: 12, name: 'PENGASUH' },
  { unitCode: 13, name: 'AKTIFITAS' },
  { unitCode: 14, name: 'KA. PUSBANGKAR' },
];

// Initial Program Studi List
export const initialProdiList = [
  { id: 'prodi-1', jenjang: 'Diploma III', nama: 'Studi Nautika', kode: 'PRODI-NT-01' },
  { id: 'prodi-2', jenjang: 'Diploma III', nama: 'Permesinan Kapal', kode: 'PRODI-PK-02' },
  { id: 'prodi-3', jenjang: 'Diploma III', nama: 'Manajemen Transportasi Perairan Daratan (MTPD)', kode: 'PRODI-MTPD-03' },
  { id: 'prodi-4', jenjang: 'Diploma IV', nama: 'Teknologi Rekayasa Pelayaran & TSDP', kode: 'PRODI-TSDP-04' },
];

// Initial Periode Akademik List
export const initialPeriodeList = [
  { id: 'p-1', tahun: '2024/2025', semester: 'Ganjil', isAktif: false },
  { id: 'p-2', tahun: '2024/2025', semester: 'Genap', isAktif: false },
  { id: 'p-3', tahun: '2025/2026', semester: 'Ganjil', isAktif: true },
  { id: 'p-4', tahun: '2025/2026', semester: 'Genap', isAktif: false },
  { id: 'p-5', tahun: '2026/2027', semester: 'Ganjil', isAktif: false },
];

// Initial Angkatan List
export const initialAngkatanList = Array.from({ length: 301 }, (_, i) => 2000 + i);
