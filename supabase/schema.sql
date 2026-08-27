-- ========================================================
-- SIAKAL V2 - FULL DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. APP SETTINGS & BRANDING
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  logo_url TEXT DEFAULT '',
  background_images_json JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. MASTER PROGRAM STUDI
CREATE TABLE IF NOT EXISTS program_studi (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  jenjang VARCHAR(50) NOT NULL, -- e.g., Diploma III, Diploma IV
  nama_prodi VARCHAR(150) NOT NULL,
  kode_prodi VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. MASTER ANGKATAN (2000 s.d. 2300)
CREATE TABLE IF NOT EXISTS angkatan (
  tahun INT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. MASTER TAHUN AKADEMIK
CREATE TABLE IF NOT EXISTS tahun_akademik (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun_akademik VARCHAR(20) NOT NULL, -- e.g., '2024/2025'
  semester VARCHAR(10) NOT NULL, -- 'Ganjil' or 'Genap'
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. PROFILES (LINKS WITH SUPABASE AUTH)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'admin', 'mahasiswa', 'dosen', 'pembimbing_lapangan', 'alumni', 'unit_approver'
  nip VARCHAR(100) DEFAULT '',
  nama_lengkap_gelar VARCHAR(255) DEFAULT '',
  ttd_image_url TEXT DEFAULT '',
  is_profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. MAHASISWA BIODATA
CREATE TABLE IF NOT EXISTS mahasiswa_biodata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nim VARCHAR(50) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  prodi_id UUID REFERENCES program_studi(id),
  angkatan_tahun INT REFERENCES angkatan(tahun),
  jenis_kelamin VARCHAR(20) DEFAULT 'Laki-Laki',
  status_aktif VARCHAR(50) DEFAULT 'Aktif',
  no_hp VARCHAR(50) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  dormitory VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. DOSEN PEMBIMBING
CREATE TABLE IF NOT EXISTS dosen_pembimbing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nip VARCHAR(100) UNIQUE NOT NULL,
  nama_lengkap VARCHAR(255) NOT NULL,
  prodi_id UUID REFERENCES program_studi(id),
  no_hp VARCHAR(50) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. PRALA - DATA KAPAL & PERUSAHAAN
CREATE TABLE IF NOT EXISTS prala_data_kapal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  nama_perusahaan VARCHAR(255) DEFAULT '',
  nama_kapal VARCHAR(255) DEFAULT '',
  tipe_kapal VARCHAR(100) DEFAULT '',
  nama_contact_person VARCHAR(255) DEFAULT '',
  jabatan_contact_person VARCHAR(100) DEFAULT '',
  no_hp_contact_person VARCHAR(50) DEFAULT '',
  email_contact_person VARCHAR(255) DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. PRALA BIMBINGAN & TRB
CREATE TABLE IF NOT EXISTS prala_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  minimal_bimbingan INT DEFAULT 8,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS prala_bimbingan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun_akademik_id UUID REFERENCES tahun_akademik(id),
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  dosen_id UUID REFERENCES dosen_pembimbing(id),
  tanggal DATE DEFAULT CURRENT_DATE,
  judul VARCHAR(255) NOT NULL,
  catatan TEXT DEFAULT '',
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS trb_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  file_pdf_url TEXT NOT NULL,
  status_verifikasi VARCHAR(50) DEFAULT 'Pending',
  catatan_dosen TEXT DEFAULT '',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 10. MAGANG & PKL MTPD (4 BULAN, BERKELOMPOK)
CREATE TABLE IF NOT EXISTS magang_kelompok (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun_akademik_id UUID REFERENCES tahun_akademik(id),
  nama_kelompok VARCHAR(150) NOT NULL,
  nomor_sk_magang VARCHAR(150) DEFAULT '',
  file_sk_pdf_url TEXT DEFAULT '',
  tempat_magang VARCHAR(255) NOT NULL,
  alamat_tempat_magang TEXT DEFAULT '',
  pembimbing_lapangan_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS magang_anggota (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kelompok_id UUID REFERENCES magang_kelompok(id) ON DELETE CASCADE,
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS magang_laporan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kelompok_id UUID REFERENCES magang_kelompok(id) ON DELETE CASCADE,
  judul_laporan VARCHAR(255) NOT NULL,
  file_laporan_pdf_url TEXT NOT NULL,
  status_verifikasi VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Diterima', 'Revisi'
  catatan_pembimbing TEXT DEFAULT '',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 11. PRESTASI MAHASSWA (AKADEMIK & NON-AKADEMIK)
CREATE TABLE IF NOT EXISTS prestasi_mahasiswa (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  tahun_akademik_id UUID REFERENCES tahun_akademik(id),
  nama_event VARCHAR(255) NOT NULL,
  jenis_prestasi VARCHAR(50) NOT NULL, -- 'Akademik' or 'Non-Akademik'
  tingkat VARCHAR(50) NOT NULL, -- 'Lokal', 'Regional', 'Nasional', 'Internasional'
  capaian VARCHAR(100) NOT NULL, -- 'Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Peserta', etc.
  penyelenggara VARCHAR(255) DEFAULT '',
  tanggal_kegiatan DATE DEFAULT CURRENT_DATE,
  file_bukti_url TEXT DEFAULT '',
  status_verifikasi VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'APPROVED', 'REJECTED'
  catatan_admin TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. BEASISWA & SELEKSI RAPAT
CREATE TABLE IF NOT EXISTS beasiswa_penawaran (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tahun_akademik_id UUID REFERENCES tahun_akademik(id),
  nama_beasiswa VARCHAR(255) NOT NULL,
  jenis_beasiswa VARCHAR(100) NOT NULL,
  sasaran VARCHAR(255) DEFAULT 'Seluruh Mahasiswa',
  ketentuan TEXT DEFAULT '',
  daftar_persyaratan_json JSONB DEFAULT '[]'::jsonb,
  kuota INT DEFAULT 10,
  tanggal_buka DATE DEFAULT CURRENT_DATE,
  tanggal_tutup DATE DEFAULT (CURRENT_DATE + INTERVAL '30 days'),
  status VARCHAR(50) DEFAULT 'Buka', -- 'Buka', 'Seleksi', 'Selesai'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS beasiswa_pengajuan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  penawaran_id UUID REFERENCES beasiswa_penawaran(id) ON DELETE CASCADE,
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  berkas_uploaded_json JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'Diajukan', -- 'Diajukan', 'Verifikasi', 'DITERIMA', 'TIDAK_DITERIMA'
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS beasiswa_dokumen_rapat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  penawaran_id UUID REFERENCES beasiswa_penawaran(id) ON DELETE CASCADE,
  notulen_rapat_url TEXT DEFAULT '',
  daftar_hadir_url TEXT DEFAULT '',
  berita_acara_url TEXT DEFAULT '',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 13. CLEARANCE OUT (FM.AT.01.017-01 - 14 UNITS)
CREATE TABLE IF NOT EXISTS clearance_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_code INT UNIQUE NOT NULL, -- 1 to 14
  nama_unit VARCHAR(255) NOT NULL,
  bidang_verifikasi VARCHAR(255) DEFAULT ''
);

CREATE TABLE IF NOT EXISTS clearance_out_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mahasiswa_id UUID REFERENCES mahasiswa_biodata(id) ON DELETE CASCADE,
  tahun_akademik_id UUID REFERENCES tahun_akademik(id),
  jenis_pengajuan VARCHAR(50) NOT NULL, -- 'PRALA', 'LULUS', 'CUTI', 'BERHENTI'
  nomor_formulir VARCHAR(100) DEFAULT 'FM.AT.01.017-01',
  status_keseluruhan VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS clearance_unit_approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES clearance_out_requests(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES clearance_units(id) ON DELETE CASCADE,
  approver_user_id UUID REFERENCES profiles(id),
  status VARCHAR(50) DEFAULT 'Pending', -- 'Memenuhi Syarat', 'Tidak Memenuhi Syarat', 'Pending'
  catatan TEXT DEFAULT '',
  approver_nama_gelar VARCHAR(255) DEFAULT '',
  approver_nip VARCHAR(100) DEFAULT '',
  approver_ttd_url TEXT DEFAULT '',
  approved_at TIMESTAMP WITH TIME ZONE
);

-- 14. TRACER STUDY & KEPUASAN PENGGUNA LULUSAN
CREATE TABLE IF NOT EXISTS tracer_study (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prodi_id UUID REFERENCES program_studi(id),
  tahun_lulus INT DEFAULT 2024,
  no_whatsapp VARCHAR(50) DEFAULT '',
  email_terkini VARCHAR(255) DEFAULT '',
  status_kerja VARCHAR(50) DEFAULT 'Bekerja', -- 'Bekerja', 'Wirausaha', 'Lanjut Studi', 'Mencari Kerja'
  nama_perusahaan VARCHAR(255) DEFAULT '',
  bidang_industri VARCHAR(150) DEFAULT '',
  jabatan VARCHAR(150) DEFAULT '',
  range_gaji VARCHAR(100) DEFAULT '',
  masa_tunggu_bulan INT DEFAULT 3,
  keselarasan_bidang VARCHAR(50) DEFAULT 'Sesuai', -- 'Sangat Sesuai', 'Sesuai', 'Kurang Sesuai', 'Tidak Sesuai'
  evaluasi_kurikulum TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS kepuasan_pengguna_lulusan (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracer_study_id UUID REFERENCES tracer_study(id) ON DELETE SET NULL,
  nama_atasan VARCHAR(255) NOT NULL,
  jabatan_atasan VARCHAR(150) NOT NULL,
  nama_perusahaan VARCHAR(255) NOT NULL,
  nama_alumni VARCHAR(255) NOT NULL,
  etika_score INT DEFAULT 4, -- 1 to 4
  kompetensi_score INT DEFAULT 4,
  bahasa_asing_score INT DEFAULT 4,
  teknologi_informasi_score INT DEFAULT 4,
  komunikasi_score INT DEFAULT 4,
  kerjasama_tim_score INT DEFAULT 4,
  pengembangan_diri_score INT DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS rencana_tindak_lanjut_lamtek (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prodi_id UUID REFERENCES program_studi(id) ON DELETE CASCADE,
  indikator_id INT NOT NULL, -- 1 to 7
  rencana_tindak_lanjut TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ========================================================
-- SEED INITIAL DATA
-- ========================================================

-- Insert Master Program Studi
INSERT INTO program_studi (jenjang, nama_prodi, kode_prodi) VALUES
('Diploma III', 'Studi Nautika', 'PRODI-NT-01'),
('Diploma III', 'Permesinan Kapal', 'PRODI-PK-02'),
('Diploma III', 'Manajemen Transportasi Perairan Daratan', 'PRODI-MTPD-03'),
('Diploma IV', 'Teknik Transportasi Sungai Danau Dan Penyeberangan', 'PRODI-TSDP-04')
ON CONFLICT (kode_prodi) DO NOTHING;

-- Insert Angkatan Range 2000 - 2300
INSERT INTO angkatan (tahun)
SELECT generate_series(2000, 2300)
ON CONFLICT (tahun) DO NOTHING;

-- Insert Default Active Academic Year
INSERT INTO tahun_akademik (tahun_akademik, semester, is_active) VALUES
('2025/2026', 'Ganjil', true)
ON CONFLICT DO NOTHING;

-- Insert Initial App Settings
INSERT INTO app_settings (logo_url, background_images_json) VALUES
('', '[]'::jsonb)
ON CONFLICT DO NOTHING;

-- Insert Master PRALA Settings
INSERT INTO prala_settings (minimal_bimbingan) VALUES (8)
ON CONFLICT DO NOTHING;

-- Insert Master 14 Clearance Units
INSERT INTO clearance_units (unit_code, nama_unit, bidang_verifikasi) VALUES
(1, 'BENDAHARA PENERIMAAN', 'Pembayaran Administrasi & UKT'),
(2, 'UNIT ASRAMA', 'Inventaris & Perlengkapan Asrama'),
(3, 'UNIT PERPUSTAKAAN', 'Bebas Peminjaman Buku & Bebas Pustaka'),
(4, 'UNIT KOPERASI', 'Bebas Piutang Koperasi'),
(5, 'UNIT OLAHRAGA DAN SENI', 'Inventaris Fasilitas Olahraga & Seni'),
(6, 'KABAG KEUANGAN DAN UMUM', 'Verifikasi Persetujuan Keuangan & Umum'),
(7, 'PRODI (MTPD/NAUTIKA/PERMESINAN KAPAL)', 'Penyelenggara Kuliah & Akademik Prodi'),
(8, 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (AKADEMIK)', 'Pendidikan & Evaluasi Pembelajaran'),
(9, 'AHLI MUDA-PENGEMBANG TEKNOLOGI PEMBELAJARAN (KETARUNAAN)', 'Dokumen PKL & PRALA'),
(10, 'KABAG ADM. AKADEMIK & KETARUNAAN', 'Persetujuan Bagian Adm. Akademik & Ketarunaan'),
(11, 'UNIT BINTAR', 'Pemeriksaan Kondite & Disiplin Ketarunaan'),
(12, 'PENGASUH', 'Hasil Evaluasi Samapta & Kesamaptaan'),
(13, 'AKTIFITAS', 'Bebas Peminjaman Barang & Perlengkapan Aktifitas'),
(14, 'KA. PUSBANGKAR', 'Persetujuan Akhir Pusat Pengembangan Karakter')
ON CONFLICT (unit_code) DO NOTHING;
