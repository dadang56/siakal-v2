# Audit awal SIAKAL V2

Tanggal: 6 September 2026. Objek: kode proyek lokal `NEW SIAKAL V2`, versi aplikasi 2.1.0.

## Kesimpulan

Keluhan dokumen hilang memiliki penyebab nyata di kode: sebagian besar alur akademik masih berupa simulasi antarmuka. Sebagian perubahan hanya ada dalam memori halaman; sebagian lainnya disimpan di browser. Integrasi penyimpanan dokumen dan database bersama belum dipakai oleh halaman aplikasi. Menambahkan konfigurasi Supabase atau tautan folder Drive saja belum menyambungkan alur-alur ini.

Masalah prioritas tertinggi adalah login yang tidak memeriksa password, halaman admin tanpa pembatasan akses, dan surat clearance yang menyatakan selesai tanpa memeriksa persetujuan. Berikut 26 kelompok temuan, termasuk temuan fungsional, tampilan, dan dependensi. Ini audit awal menyeluruh atas modul yang tersedia, bukan jaminan bahwa seluruh kemungkinan bug sudah ditemukan.

## Pemeriksaan yang dilakukan

- Membaca struktur, penanganan data/form, navigasi, ekspor/impor, skema SQL, dan komponen bersama seluruh 30 halaman aplikasi.
- Build produksi berhasil, termasuk pemeriksaan tipe dan pembuatan 34 keluaran statis Next.js. Jumlah ini juga mencakup keluaran internal/metadata; bukan 34 halaman bisnis.
- Seluruh 30 rute halaman mengembalikan HTTP 200 pada server lokal. Ini menguji ketersediaan halaman, bukan keberhasilan transaksi bisnis.
- Uji browser: akses admin tanpa login; login memakai ID tidak terdaftar dan password salah; akses admin setelah masuk sebagai mahasiswa; pengajuan prestasi sebelum/sesudah muat ulang; menu mahasiswa; pembukaan form verifikasi dosen dari mahasiswa; halaman cetak clearance.
- Pemeriksaan visual pada viewport 320 × 740, 390 × 844, dan 768 × 1024. Pengujian ini memakai browser desktop dengan ukuran layar tersebut, belum perangkat Android/iPhone fisik.
- Membaca galat browser produksi dan menjalankan audit dependensi.

Kode aplikasi dan konfigurasi produksi belum diubah. Data uji prestasi hanya dibuat di server/browser lokal dan hilang setelah muat ulang. Tidak ada pengiriman pemberitahuan, penerbitan surat, atau perubahan database produksi.

## Temuan prioritas utama

### 01. Kritis — Password tidak diperiksa dan ID tidak terdaftar tetap bisa masuk

**Bukti browser:** memasukkan ID uji `audit-admin-tidak-terdaftar` dengan password salah tetap membuka Dashboard Executive sebagai administrator.

**Penyebab:** `handleLogin` hanya mencocokkan identitas. Nilai password tidak dibandingkan dengan kredensial. Jika identitas tidak ditemukan, peran dipilih dari potongan teks seperti `admin`, kemudian akun contoh digunakan. Tombol demo semua peran juga selalu tersedia. Password akun tersimpan sebagai teks biasa pada data pengguna dan dapat ditampilkan/diekspor.

**Perbaikan:** gunakan autentikasi server dengan password yang dikelola penyedia autentikasi, hapus fallback masuk sebagai akun lain, dan pisahkan mode demo dari penggunaan operasional. Sumber: [app/page.tsx:17](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/page.tsx:17>).

### 02. Kritis — Halaman dan tindakan admin tidak dibatasi berdasarkan sesi/peran

**Bukti browser:** halaman Manajemen User terbuka pada kunjungan pertama sebelum login. Setelah masuk sebagai mahasiswa, alamat halaman admin yang sama tetap terbuka.

**Penyebab:** layout memakai akun admin sebagai nilai awal jika sesi tidak ada, tidak mengarahkan pengguna tanpa sesi ke login, dan tidak memeriksa izin rute. Penyembunyian menu saja tidak melindungi halaman. Perubahan/penghapusan akun pada daftar master juga tidak membatalkan salinan sesi pengguna.

**Perbaikan:** periksa sesi dan izin pada server serta tiap operasi baca/tulis; muat peran dari sumber tepercaya. Sumber: [app/dashboard/layout.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:16>), [app/dashboard/admin/manajemen-user/page.tsx:91](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/manajemen-user/page.tsx:91>).

### 03. Tinggi — Perubahan akademik hilang setelah muat ulang atau pindah halaman

**Bukti browser:** pengajuan `AUDIT-PERSISTENSI-06092026` muncul beserta tautan sertifikat, lalu hilang setelah reload.

**Penyebab:** prestasi, laporan TRB, verifikasi TRB, penawaran beasiswa, hasil seleksi, dan persetujuan clearance memakai state komponen tanpa penyimpanan permanen. Halaman mahasiswa/admin juga menggunakan salinan data awal masing-masing. Pencarian seluruh kode tidak menemukan pemakaian klien Supabase di halaman; helper klien hanya didefinisikan.

**Perbaikan:** simpan transaksi ke database bersama, baca kembali rekaman yang tersimpan, dan tampilkan keberhasilan setelah penyimpanan terkonfirmasi. Sumber: [app/dashboard/prestasi/page.tsx:21](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prestasi/page.tsx:21>), [app/dashboard/prala/bimbingan/page.tsx:103](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prala/bimbingan/page.tsx:103>), [app/dashboard/admin/beasiswa/page.tsx:21](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/beasiswa/page.tsx:21>), [lib/supabase/client.ts:6](</Users/dadangaziz/Desktop/NEW SIAKAL V2/lib/supabase/client.ts:6>).

### 04. Tinggi — Fitur “unggah dokumen” belum mengunggah berkas

**Bukti kode:** formulir TRB, sertifikat, beasiswa, laporan magang, dan dokumen rapat menggunakan masukan teks URL. Tidak ada pengiriman isi berkas ke penyimpanan dokumen. Sebagian tautan bahkan menunjuk PDF contoh. Input berkas nyata yang tersedia hanya untuk gambar branding dan impor Excel.

Konfigurasi Google Drive hanya menyimpan URL folder dan status aktif ke browser; tidak melakukan autentikasi/unggah ke folder itu. Karena itu, status Drive aktif bukan bukti berkas telah dicadangkan.

**Perbaikan:** implementasikan unggah nyata, validasi berkas, rekaman metadata/pemilik, dan pemeriksaan unduh. Sumber: [app/dashboard/prala/bimbingan/page.tsx:103](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prala/bimbingan/page.tsx:103>), [app/dashboard/beasiswa/page.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/beasiswa/page.tsx:16>), [app/dashboard/admin/pengaturan-aplikasi/page.tsx:144](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/pengaturan-aplikasi/page.tsx:144>).

### 05. Tinggi — Pesan berhasil muncul meskipun tidak ada transaksi atau penyimpanan gagal

**Bukti kode:** pengajuan beasiswa, laporan akhir magang, tracer study, penyimpanan RTL, serta notifikasi seleksi hanya mengubah penanda tampilan. Tidak ada penyimpanan/pengiriman yang sesuai dengan pesan berhasil tersebut. Pada data kapal, profil pembimbing, dan beberapa master data, pengecualian penyimpanan browser ditelan, sementara antarmuka tetap diperbarui seolah berhasil.

**Dampak:** pengguna percaya data terkirim atau tersimpan, padahal belum. Untuk penyimpanan browser yang penuh/diblokir, kegagalan dapat terlihat seperti kehilangan data belakangan.

**Perbaikan:** satu kontrak hasil transaksi yang jelas; jangan menghapus isian atau mengumumkan berhasil ketika penyimpanan gagal. Sumber: [app/dashboard/beasiswa/page.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/beasiswa/page.tsx:16>), [app/dashboard/magang/page.tsx:114](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/magang/page.tsx:114>), [app/dashboard/tracer-study/page.tsx:19](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/tracer-study/page.tsx:19>), [app/dashboard/prala/data-kapal/page.tsx:42](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prala/data-kapal/page.tsx:42>), [app/dashboard/admin/beasiswa/seleksi/page.tsx:33](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/beasiswa/seleksi/page.tsx:33>).

### 06. Tinggi — Data browser dipakai bersama antar-akun dan tidak tersinkron antarperangkat

**Bukti kode:** data kapal menggunakan satu kunci `siakal_prala_student_data`; aktivitas magang dan profil pembimbing juga memakai kunci global, tanpa ID mahasiswa, kelompok, atau pembimbing. Logout hanya menghapus `siakal_user`.

**Dampak:** akun lain pada browser yang sama dapat menerima/mengubah data tersebut; browser atau perangkat berbeda tidak melihat pembaruan. Data browser dapat bertahan setelah reload, tetapi bukan penyimpanan pusat atau cadangan permanen.

**Perbaikan:** rekaman harus memiliki pemilik/kelompok dan izin akses; jadikan database pusat sebagai sumber utama. Sumber: [app/dashboard/prala/data-kapal/page.tsx:42](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prala/data-kapal/page.tsx:42>), [app/dashboard/pembimbing-lapangan/page.tsx:75](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/pembimbing-lapangan/page.tsx:75>), [app/dashboard/layout.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:16>).

### 07. Tinggi — Mahasiswa dapat membuka verifikasi dosen atas laporannya sendiri

**Bukti browser:** akun mahasiswa dapat membuka “Verifikasi Dosen” untuk tahap 3 yang masih “Belum Upload”.

**Bukti kode:** tombol dan handler verifikasi tidak memeriksa peran dosen, hubungan bimbingan, maupun keberadaan berkas. Daftar mahasiswa bimbingan yang diatur admin tidak digunakan untuk membatasi halaman ini. Audit tidak menetapkan keputusan akademik; cukup membuka formulir dan memeriksa handler.

**Perbaikan:** hanya dosen yang ditugaskan dapat memverifikasi laporan yang benar-benar sudah diunggah, dengan riwayat keputusan. Sumber: [app/dashboard/prala/bimbingan/page.tsx:130](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prala/bimbingan/page.tsx:130>).

### 08. Tinggi — Clearance 14 unit tidak dapat selesai melalui halaman mahasiswa

**Bukti kode:** data awal hanya memuat 5 unit berkode 10–14, tetapi syarat membuka tombol cetak adalah `clearedCount === 14`. Halaman juga tidak menyediakan proses pengajuan baru; status awal sudah dibuat seolah pernah diajukan. Halaman approval hanya mengubah daftar contoh lokalnya sendiri.

**Perbaikan:** satu master unit dan alur pengajuan/persetujuan bersama, dengan jumlah unit wajib yang dihitung dari konfigurasi. Sumber: [lib/mockStore.ts:217](</Users/dadangaziz/Desktop/NEW SIAKAL V2/lib/mockStore.ts:217>), [app/dashboard/clearance-out/pengajuan/page.tsx:38](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/clearance-out/pengajuan/page.tsx:38>).

### 09. Kritis — Surat clearance selalu menyatakan 100% selesai dengan identitas tetap

**Bukti browser:** membuka alamat cetak langsung menampilkan Ahmad Fauzi, NIM tetap, dan pernyataan “BEBAS LENGKAP (100% CLEAR)”.

**Bukti kode:** halaman tidak menerima/memuat ID permohonan, tidak membaca persetujuan, dan tidak memeriksa kelengkapan. Semua baris admin, termasuk permohonan Pending, menaut ke alamat cetak yang sama. Nama pejabat/NIP merupakan data tetap, dan URL spesimen yang didefinisikan tidak dirender sebagai gambar tanda tangan.

**Perbaikan:** hasil cetak harus terikat pada permohonan tertentu yang telah sah disetujui dan memuat identitas serta bukti persetujuan sebenarnya. Sumber: [app/dashboard/clearance-out/print/page.tsx:68](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/clearance-out/print/page.tsx:68>), [app/dashboard/admin/clearance-out/page.tsx:89](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/clearance-out/page.tsx:89>).

### 10. Tinggi — Biodata dan profil unit hilang saat login kembali

**Bukti kode:** halaman Lengkapi Biodata dan Profil Unit hanya memperbarui `siakal_user`, sedangkan login mengambil akun dari `siakal_user_list` atau data contoh. Pembaruan tidak masuk daftar master. Layout juga hanya memperbarui pengguna jika ID berubah, sehingga perubahan nama/prodi pada ID yang sama dapat tertahan di navigasi.

**Perbaikan:** simpan profil pada rekaman pengguna utama, lalu segarkan sesi dan tampilan terkait. Sumber: [app/dashboard/mahasiswa/lengkapi-biodata/page.tsx:60](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/mahasiswa/lengkapi-biodata/page.tsx:60>), [app/dashboard/profil-unit/page.tsx:23](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/profil-unit/page.tsx:23>), [app/page.tsx:17](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/page.tsx:17>), [app/dashboard/layout.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:16>).

### 11. Tinggi — Alur beasiswa tidak terhubung dan tidak memvalidasi penawaran

**Bukti kode:** penawaran baru admin tidak tersedia pada halaman mahasiswa. Semua tombol seleksi menuju halaman yang sama dengan dua pendaftar dan judul tetap. Tombol pendaftaran tidak memeriksa tanggal buka/tutup/status; formulir berkas selalu dua masukan meskipun daftar persyaratan penawaran berbeda. Notifikasi hasil seleksi tidak dikirim.

**Perbaikan:** tautkan penawaran, pendaftar, persyaratan, hasil rapat, serta notifikasi melalui ID; validasi tenggat dan status pada server. Sumber: [app/dashboard/admin/beasiswa/page.tsx:21](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/beasiswa/page.tsx:21>), [app/dashboard/beasiswa/page.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/beasiswa/page.tsx:16>), [app/dashboard/admin/beasiswa/seleksi/page.tsx:33](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/beasiswa/seleksi/page.tsx:33>).

### 12. Tinggi — Monitoring PRALA dan plotting magang tidak terhubung ke data mahasiswa

**Bukti kode:** admin PRALA membaca `siakal_prala_admin`, tetapi tidak ada penulis kunci ini. Data kapal mahasiswa disimpan ke kunci lain. Kelompok magang admin disimpan ke `siakal_magang_groups`, sementara halaman mahasiswa menampilkan kelompok/anggota tetap dan tidak membaca kunci tersebut. Pembuatan kelompok tanpa pilihan anggota/pembimbing dapat mengisi orang contoh secara otomatis.

**Perbaikan:** hubungkan mahasiswa, kelompok, penempatan, dosen/pembimbing, laporan, dan status memakai ID yang konsisten. Sumber: [app/dashboard/admin/prala/page.tsx:59](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/prala/page.tsx:59>), [app/dashboard/admin/magang/page.tsx:68](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/magang/page.tsx:68>), [app/dashboard/magang/page.tsx:114](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/magang/page.tsx:114>).

### 13. Tinggi — Survei dan tracer tidak menjadi rekap admin; satu indikator hilang

**Bukti kode:** survei publik menyimpan jawaban pada browser responden saja. Admin kepuasan membaca enam baris persentase tetap, bukan jawaban survei; formulir publik mempunyai tujuh indikator sehingga “Pengembangan Diri” tidak masuk rekap. Daftar alumni admin juga merupakan contoh tetap, terpisah dari pengelolaan akun dan tracer study.

**Perbaikan:** simpan respon di pusat, hitung persentase dari respon aktual, hubungkan dengan alumni/prodi, dan sertakan ketujuh indikator beserta RTL. Sumber: [app/kepuasan-pengguna/page.tsx:87](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/kepuasan-pengguna/page.tsx:87>), [app/dashboard/admin/kepuasan-lulusan/page.tsx:8](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/kepuasan-lulusan/page.tsx:8>), [app/dashboard/tracer-study/page.tsx:19](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/tracer-study/page.tsx:19>).

### 14. Tinggi — “Arsip cadangan” tidak mencadangkan database maupun dokumen

**Bukti kode:** ekspor ZIP hanya mengirim enam angka/teks contoh ke pembuat arsip untuk satu lembar ringkasan. Tidak menyertakan akun/biodata aktual, transaksi akademik, ataupun berkas. Tahun/semester juga tetap. ZIP tersebut tidak cukup untuk memulihkan aplikasi.

**Perbaikan:** cadangkan data aktual dan objek dokumen, buat daftar isi/verifikasi integritas, lalu buktikan proses pemulihannya. Sumber: [app/dashboard/admin/arsip/page.tsx:17](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/arsip/page.tsx:17>), [lib/utils/zip.ts:13](</Users/dadangaziz/Desktop/NEW SIAKAL V2/lib/utils/zip.ts:13>).

## Integritas data dan master data

### 15. Tinggi — Impor menambahkan duplikat dan menerima identitas/peran yang tidak valid

**Bukti kode:** impor akun dan mahasiswa menambahkan semua baris tanpa memeriksa NIM/email/username ganda. Role diubah dengan konversi teks tanpa daftar nilai yang diizinkan; baris yang kehilangan identitas diberi identitas buatan. Mengimpor berkas sama dua kali akan menggandakan rekaman. Form tambah mahasiswa juga tidak memeriksa NIM yang sudah ada.

**Perbaikan:** validasi tiap baris, tampilkan penolakan/konflik, dan bedakan tambah dari pembaruan data. Sumber: [app/dashboard/admin/manajemen-user/page.tsx:151](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/manajemen-user/page.tsx:151>), [app/dashboard/admin/mahasiswa/page.tsx:237](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:237>), [app/dashboard/admin/mahasiswa/page.tsx:148](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:148>).

### 16. Tinggi — Ekspor dan impor ulang tidak mempertahankan data

**Bukti kode:** ekspor mahasiswa menulis status “Alumni”, tetapi impor mengenali “Lulus / Alumni” atau `Role = alumni`. Hasil ekspor alumni dapat masuk kembali sebagai mahasiswa aktif. Ekspor juga tidak membawa sejumlah isian orang tua, termasuk NIK, tanggal lahir, pendidikan, dan penghasilan. Header ekspor akun berbeda dari header impor untuk identitas/prodi.

**Perbaikan:** bedakan laporan tampilan dari format cadangan/import; format yang dapat diimpor harus memiliki kontrak kolom dan nilai yang sama serta diuji bolak-balik. Sumber: [app/dashboard/admin/mahasiswa/page.tsx:293](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:293>), [app/dashboard/admin/mahasiswa/page.tsx:237](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:237>), [app/dashboard/admin/manajemen-user/page.tsx:151](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/manajemen-user/page.tsx:151>).

### 17. Sedang — Status PRALA/Magang mahasiswa dibuang saat disimpan

**Bukti kode:** formulir menawarkan Aktif, PRALA, Magang, dan Lulus/Alumni. Handler hanya menyimpan perbedaan alumni versus mahasiswa; status PRALA/Magang tidak menjadi field rekaman. Prestasi mahasiswa juga memakai ID `user-mhs-1`, sementara akun contoh memakai `usr-mhs-1`, dan nama pengaju dipatok Ahmad Fauzi.

**Perbaikan:** simpan status akademik tersendiri dan gunakan identitas sesi yang benar di setiap modul. Sumber: [app/dashboard/admin/mahasiswa/page.tsx:148](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:148>), [app/dashboard/prestasi/page.tsx:21](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/prestasi/page.tsx:21>).

### 18. Sedang — Periode aktif tidak mengubah konteks modul

**Bukti kode:** perubahan periode hanya disimpan pada daftar periode. Dashboard menulis `2025/2026 Ganjil` secara tetap dan arsip mengekspor semester yang tetap. Helper `getActivePeriode` tidak digunakan halaman lain. Editor juga bisa menonaktifkan satu-satunya periode aktif; tampilan kemudian memilih rekaman pertama sebagai fallback seolah aktif. Periode duplikat tidak ditolak.

**Perbaikan:** satu sumber periode aktif, aturan keunikan/keaktifan, dan kaitan periode pada setiap transaksi. Sumber: [app/dashboard/admin/periode-akademik/page.tsx:89](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/periode-akademik/page.tsx:89>), [app/dashboard/page.tsx:100](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/page.tsx:100>), [app/dashboard/admin/arsip/page.tsx:17](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/arsip/page.tsx:17>).

### 19. Sedang — Mengubah/menghapus prodi tidak memperbarui relasi pengguna

**Bukti kode:** akun menyimpan nama prodi sebagai teks; editor master hanya mengubah daftar prodi. Nama lama tetap tinggal pada akun, sehingga filter berdasarkan nama baru tidak menemukannya. Prodi yang masih dipakai dapat dihapus tanpa pemeriksaan.

**Perbaikan:** referensikan ID prodi dan lindungi relasi saat penghapusan. Sumber: [app/dashboard/admin/prodi/page.tsx:50](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/prodi/page.tsx:50>), [app/dashboard/admin/mahasiswa/page.tsx:148](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/mahasiswa/page.tsx:148>).

### 20. Sedang — Angka dashboard menggambarkan kategori prodi, bukan aktivitas nyata

**Bukti kode/browser:** jumlah PRALA dan magang dihitung dari prodi semua mahasiswa, bukan penempatan/status kegiatan. Clearance kosong ditampilkan sebagai 100%; browser memperlihatkan angka tersebut meskipun tidak ada transaksi pada sumber daftar dashboard.

**Perbaikan:** agregasi harus bersumber dari transaksi aktual; tampilkan “Belum ada data” ketika penyebut kosong. Sumber: [app/dashboard/page.tsx:100](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/page.tsx:100>).

## Mobile, tampilan, dan keandalan

### 21. Sedang — Menu mobile tidak sesuai peran/prodi

**Bukti browser:** mahasiswa Nautika mendapat menu Magang MTPD di lembar “Semua Menu”.

**Penyebab:** layout tidak mengirim `prodi` ke MobileDock; komponen menganggap prodi belum tersedia dan menampilkan kedua jalur. Tombol pintas untuk seluruh pengguna selain admin selalu PRALA dan Beasiswa, termasuk alumni, pembimbing lapangan, dan unit approver.

**Perbaikan:** gunakan definisi menu bersama desktop/mobile dan kirim profil lengkap. Sumber: [app/dashboard/layout.tsx:76](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:76>), [components/MobileDock.tsx:110](</Users/dadangaziz/Desktop/NEW SIAKAL V2/components/MobileDock.tsx:110>).

### 22. Sedang — Judul/label hampir tidak terbaca pada panel putih

**Bukti visual:** Tracer Study pada 390 piksel menampilkan judul putih pada panel putih dan label abu sangat muda. Pola yang sama ada pada Pengajuan Clearance, Approval Clearance, dan Profil Unit.

**Penyebab:** `.glass-panel` diubah menjadi latar putih, tetapi halaman tersebut masih menggunakan warna teks untuk latar gelap. Tema dipaksa light oleh ThemeProvider, sedangkan HTML awal diberi kelas dark.

**Perbaikan:** konsistenkan tema dan warna semantik judul/label/status di seluruh modul, lalu periksa kontras. Sumber: [app/dashboard/tracer-study/page.tsx:33](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/tracer-study/page.tsx:33>), [app/globals.css:12](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/globals.css:12>).

### 23. Sedang — Tombol penting keluar layar pada breakpoint tablet

**Bukti visual dan ukuran DOM:** pada lebar viewport 768 piksel, main Manajemen User hanya sekitar 376 piksel. Sisi kanan tombol Tambah User berada di x=869 dan Ekspor di x=845, melewati viewport. Tangkapan layar memperlihatkan tombol terpotong.

**Penyebab:** sidebar 288 piksel sudah muncul pada breakpoint md, ditambah gap/padding; toolbar beralih ke baris horizontal pada sm dengan bagian yang tidak menyusut. Pembungkus dashboard menyembunyikan overflow horizontal. Tabel memiliki scroll sendiri; temuan ini khusus tombol toolbar di luar tabel.

**Perbaikan:** gunakan breakpoint berdasarkan ruang konten, buat toolbar membungkus/bertumpuk, dan pertimbangkan sidebar mulai pada lebar lebih besar. Sumber: [components/Sidebar.tsx:107](</Users/dadangaziz/Desktop/NEW SIAKAL V2/components/Sidebar.tsx:107>), [app/dashboard/admin/manajemen-user/page.tsx:323](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/manajemen-user/page.tsx:323>), [app/dashboard/layout.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:16>).

### 24. Sedang — Ketidaksesuaian render awal menyebabkan galat hydration

**Bukti browser produksi:** log mencatat React #425, #418, dan #423 setelah navigasi/muat ulang dalam sesi yang sudah login. React memulihkan halaman dengan render ulang di browser.

**Penyebab yang ditunjukkan kode:** initializer membaca browser storage di klien, sedangkan HTML statis dibangun memakai akun/data awal. Nama/peran atau jumlah baris berbeda pada render pertama. Tidak semua komponen yang mungkin memicu hydration diisolasi satu per satu dalam audit ini.

**Perbaikan:** samakan render awal server-klien; gunakan sesi server atau keadaan loading yang konsisten sebelum membaca storage. Sumber: [app/dashboard/layout.tsx:16](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/layout.tsx:16>), [app/dashboard/admin/manajemen-user/page.tsx:91](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/dashboard/admin/manajemen-user/page.tsx:91>). Arti galat: [React #425](https://react.dev/errors/425), [React #423](https://react.dev/errors/423).

### 25. Tinggi — Dependensi memiliki advisori keamanan yang belum ditangani

**Hasil alat:** audit dependensi menandai 6 paket: 1 critical dan 5 high, termasuk rantai dependensi pengembangan. Next.js terpasang 14.2.16; xlsx 0.18.5. Ini jumlah paket yang ditandai, bukan enam eksploit yang telah dibuktikan pada aplikasi.

**Batas interpretasi:** penerapan tiap advisori bergantung fitur/deployment. Contohnya advisori middleware Next.js berlaku pada pemeriksaan otorisasi di middleware; proyek ini justru belum mempunyai pemeriksaan tersebut, sehingga bypass login temuan 01–02 adalah cacat kode aplikasi tersendiri. Advisori tersebut juga menyebut perlindungan otomatis untuk deployment Vercel.

**Perbaikan:** pilih versi yang masih didukung dan aman setelah menilai advisori relevan, lalu uji migrasi dan impor Excel. Jangan menjalankan pembaruan paksa tanpa menilai perubahan versi utama. Bukti lengkap tersimpan pada berkas audit dependensi. Rujukan primer: [advisori Next.js](https://github.com/vercel/next.js/security/advisories/GHSA-f82v-jwr5-mffw).

### 26. Sedang — Ikon instalasi aplikasi tidak tersedia

**Bukti HTTP:** `/icon.png` dan `/icon-512.png` menghasilkan 404, walaupun keduanya dirujuk manifest. Ini membuat identitas ikon saat menambahkan aplikasi ke layar utama tidak andal.

**Catatan akurasi:** `/manifest.json` pada konfigurasi manual memang 404, tetapi HTML aktual sudah mengarah ke `/manifest.webmanifest` yang menghasilkan 200. Karena Next.js menghasilkan tautan yang benar, path manual tersebut tidak dihitung sebagai kegagalan manifest aktif.

**Perbaikan:** sediakan kedua ikon dengan ukuran yang benar dan rapikan konfigurasi manifest. Sumber: [app/manifest.ts:14](</Users/dadangaziz/Desktop/NEW SIAKAL V2/app/manifest.ts:14>).

## Kesenjangan tambahan yang perlu diuji saat perbaikan

- **Backend belum operasional dari kode yang tersedia.** Skema SQL ada, tetapi tidak berisi pengaktifan Row Level Security/policy ataupun konfigurasi bucket/izin storage. Ini temuan terhadap berkas lokal, bukan klaim bahwa database produksi terbuka. Skema juga belum mencakup seluruh isian biodata, empat tahap TRB, serta aktivitas magang yang kini ditampilkan UI. Sumber: [supabase/schema.sql:41](</Users/dadangaziz/Desktop/NEW SIAKAL V2/supabase/schema.sql:41>).
- **Cetak panjang.** Perintah cetak memakai `window.print()`, sementara layout induk tidak menyembunyikan navbar/sidebar untuk cetak. Modal laporan magang juga belum mempunyai pengaturan pemisahan halaman panjang. Perlu verifikasi print preview/PDF dengan data banyak; audit ini tidak menerbitkan atau mencetak surat.
- **Tanggal batas laporan.** Penambahan bulan memakai `Date.setMonth`, yang dapat melompati akhir bulan, dan tanggal unggah memakai UTC meski pengguna berada di Indonesia. Definisi tenggat akhir bulan/zona waktu perlu ditetapkan dan diuji.
- **Aksesibilitas mobile.** Pengaturan viewport membatasi pembesaran; modal belum memiliki semantik dialog dan pengelolaan fokus yang lengkap. Perlu uji pembaca layar, keyboard virtual, dan safe area perangkat fisik.

## Urutan perbaikan yang disarankan

1. Amankan data yang masih ada: inventarisasi data browser/perangkat yang telah dipakai dan semua tautan berkas. Pisahkan data nyata dari data contoh sebelum migrasi. Jangan mengandalkan fitur Arsip saat ini untuk pemulihan.
2. Bangun autentikasi dan pembatasan akses server, serta struktur database/izin penyimpanan dokumen.
3. Implementasikan satu alur dokumen lengkap sebagai acuan, misalnya PRALA: unggah → tersimpan → dosen membaca → verifikasi → admin memantau → unduh kembali.
4. Sambungkan master data, biodata, magang, prestasi, beasiswa, clearance, dan tracer/survei pada sumber yang sama. Hilangkan pesan berhasil yang tidak didukung transaksi.
5. Benahi menu/tema/layout mobile, hasil cetak, validasi impor/ekspor, dan dependensi; lakukan pengujian antarperan dan antarperangkat.

Kriteria selesai penyimpanan: berkas dan metadata tetap sama setelah reload, logout/login, perangkat berbeda, serta setelah deployment; pengguna lain hanya bisa membaca berkas yang diizinkan; kegagalan jaringan tidak menghasilkan pesan berhasil; cadangan dapat dipulihkan dan berkas dapat diunduh kembali.

## Batas audit dan bukti tersimpan

Audit menggunakan checkout lokal dan server produksi lokal. Belum membandingkan kode ini dengan deployment yang digunakan pengguna, mengakses proyek Supabase/Google Drive sebenarnya, menguji kebijakan penyimpanan produksi, atau memulihkan dokumen yang sudah hilang. Penyebab historis setiap dokumen harus dipastikan terhadap versi/deployment dan tempat dokumen itu semula disimpan.

Berkas pendukung: [Hasil pemeriksaan rute](</Users/dadangaziz/Desktop/NEW SIAKAL V2/docs/audit/hasil-rute-2026-09-06.json>) dan [Hasil audit dependensi](</Users/dadangaziz/Desktop/NEW SIAKAL V2/docs/audit/dependensi-2026-09-06.json>).
