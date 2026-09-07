# Perbaikan SIAKAL V2.3.0

Tanggal rilis: 7 September 2026.

## Perubahan utama

- Seluruh transaksi utama disimpan ke penyimpanan browser dua lapis: LocalStorage untuk akses cepat dan IndexedDB untuk pemulihan ketika penyimpanan utama kosong atau penuh.
- Berkas PDF/gambar pada Prestasi, PRALA, Magang, dan Beasiswa dibaca sebagai berkas nyata, divalidasi maksimal 15 MB, lalu disimpan bersama rekamannya.
- Pesan berhasil baru tampil setelah proses simpan mengembalikan hasil berhasil.
- Login kini memeriksa identitas dan kata sandi secara tepat, fallback akun dihapus, pintasan demo dimatikan di produksi, dan rute dibatasi berdasarkan peran.
- Data Prestasi, Beasiswa, PRALA, Magang, Clearance, Tracer Study, Survei, biodata, profil unit, dan rekap admin memakai koleksi bersama.
- Clearance memakai 14 unit, persetujuan dicatat per unit, dan surat hanya dapat dicetak untuk permohonan yang lengkap serta disetujui.
- Cadangan ZIP kini memuat database JSON lengkap, lembar Excel, dokumen yang tersimpan, serta checksum SHA-256 untuk pemeriksaan integritas.
- Validasi duplikat diperketat untuk pengguna, mahasiswa, program studi, dan periode. Impor pengguna menolak peran atau identitas yang tidak valid.
- Status akademik PRALA/Magang dipertahankan saat impor/ekspor dan digunakan pada ringkasan dashboard.
- Navigasi ponsel disesuaikan dengan peran dan program studi. Sidebar baru tampil pada layar besar, kontras diperbaiki, zoom diizinkan, safe area ditangani, dan layout cetak dibersihkan.
- Next.js, React, SheetJS, PostCSS, dan definisi tipe diperbarui. Audit dependensi menghasilkan nol kerentanan yang diketahui.

## Verifikasi

- Build produksi dan pemeriksaan TypeScript berhasil untuk 33 keluaran rute.
- Seluruh 30 halaman aplikasi merespons HTTP 200 pada server lokal.
- Uji browser pada viewport ponsel 390 × 844 tidak menemukan overflow horizontal.
- Login berhasil dengan kredensial benar; akses halaman admin sebagai mahasiswa dialihkan ke dashboard.
- Audit dependensi: 0 kerentanan.

## Batas penyimpanan rilis ini

Deployment Vercel saat rilis tidak memiliki environment variable database atau layanan object storage. Karena itu, penyimpanan dua lapis pada rilis ini bersifat permanen pada profil browser/perangkat yang sama dan dapat dicadangkan/dipulihkan lewat ZIP/JSON, tetapi belum tersinkron otomatis antarperangkat. Penyimpanan lintas perangkat memerlukan database dan object storage privat beserta kredensial produksinya.
