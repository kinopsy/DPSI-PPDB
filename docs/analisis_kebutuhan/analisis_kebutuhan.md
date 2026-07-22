# Dokumen Analisis Kebutuhan

**Proyek:** Sistem Informasi Penerimaan Peserta Didik Baru (PPDB)

**Institusi:** SDN Karangkajen

**Mata Kuliah:** Desain dan Pengembangan Sistem Informasi

**Kelompok:**
- Alfiardi Yuangga Saputra (2400016040)
- Zulfan Haidar Hammam (2400016025)
- Edi Wiyono (2400016037)
- Farhan Hanif El-Zaki (2400016085)
- Rafi Yudistira Prasetyo (2400016096)

---

## 1. Profil Organisasi

SDN Karangkajen merupakan institusi pendidikan tingkat Sekolah Dasar Negeri yang berlokasi di Karangkajen, Yogyakarta. Dalam kegiatan operasionalnya, sekolah memiliki berbagai layanan administrasi, salah satunya pengelolaan Penerimaan Peserta Didik Baru (PPDB) yang melibatkan proses pendaftaran, verifikasi data, pembayaran administrasi, dan rekapitulasi data pendaftar.

Proses administrasi PPDB melibatkan beberapa pihak seperti Admin PPDB, Orang Tua/Wali Murid, Bendahara, serta Kepala Sekolah. Saat ini, seluruh proses tersebut masih berjalan secara semi-manual dan belum terintegrasi dalam satu sistem informasi yang utuh.

---

## 2. Problem Statement

### 2.1 Latar Belakang

SDN Karangkajen merupakan institusi pendidikan yang dalam operasional sehari-harinya masih mengelola proses Penerimaan Peserta Didik Baru (PPDB) secara semi-manual. Berdasarkan observasi dan wawancara dengan narasumber (Mas Eka — staf administrasi), kelompok kami menemukan bahwa pendaftaran dilakukan menggunakan Google Form yang disebarkan melalui media seperti brosur, spanduk, dan website berbasis WordPress. Data pendaftar kemudian disimpan secara manual menggunakan aplikasi perkantoran seperti Microsoft Excel dan Word.

Selain itu, sistem pembayaran online yang pernah bekerja sama dengan pihak bank (BSM) mengalami kendala berupa keterlambatan informasi setelah pembayaran dilakukan serta adanya biaya tambahan yang dirasa memberatkan oleh orang tua. Tidak adanya sistem basis data terpusat juga menyebabkan pengelolaan data menjadi tidak efisien dan menyulitkan proses pencarian serta pelaporan.

Kondisi ini mengakibatkan proses administrasi menjadi lambat, kurang transparan, serta menimbulkan ketidakpuasan dari pihak orang tua sebagai pengguna layanan.

### 2.2 Permasalahan Spesifik

| No | Permasalahan | Kondisi Saat Ini | Dampak |
|---|---|---|---|
| 1 | Proses pendaftaran semi-manual | Menggunakan Google Form yang disebarkan via brosur, spanduk, dan website | Proses lambat, tidak efisien, dan rawan kesalahan |
| 2 | Penyimpanan data manual | Data disimpan di Microsoft Excel dan Word, belum ada database terpusat | Data tersebar di berbagai platform, sulit dikelola |
| 3 | Rekap data PPDB manual | Belum ada database terpusat untuk rekapitulasi | Sulit monitoring dan pelaporan |
| 4 | Tidak ada akses terintegrasi untuk orang tua | Orang tua belum memiliki akses untuk melihat riwayat dan informasi pembayaran dalam satu platform | Pengelolaan yang masih mengandalkan media manual menyebabkan pemantauan riwayat dan informasi administratif oleh orang tua belum efisien |
| 5 | Kendala pembayaran online | Pernah kerja sama dengan bank BSM, namun mengalami keterlambatan informasi | Biaya admin bank memberatkan orang tua, kerja sama dihentikan |
| 6 | Pencarian dan rekap data lambat | Data tersebar di berbagai platform | Proses pencarian dan rekap data membutuhkan waktu lama |
| 7 | Sistem administrasi belum terintegrasi | Tidak ada satu sistem yang mengelola seluruh proses PPDB | Ketidakefisienan dalam pengelolaan data secara keseluruhan |
| 8 | Orang tua kesulitan memantau status | Tidak ada platform terpusat untuk melihat status pendaftaran dan pembayaran | Orang tua harus datang atau menghubungi sekolah secara manual |
| 9 | Sekolah tidak mempunyai anggaran untuk administrasi | Keterbatasan sumber daya | Pengembangan sistem terhambat |

### 2.3 Dampak Permasalahan

1. Proses administrasi PPDB menjadi lambat dan tidak efisien.
2. Data pendaftar tersebar di berbagai platform sehingga sulit dikelola dan berisiko hilang.
3. Orang tua mengalami kesulitan dalam proses pendaftaran dan pemantauan status.
4. Biaya tambahan dari bank memberatkan beban orang tua.
5. Tidak adanya transparansi informasi pendaftaran dan pembayaran bagi orang tua.
6. Rekapitulasi dan pelaporan data PPDB menjadi rumit dan memakan waktu.

### 2.4 Pernyataan Masalah

"SDN Karangkajen belum memiliki sistem informasi yang mampu mendukung pengelolaan PPDB secara digital dan terintegrasi, mulai dari pendaftaran online, verifikasi data, pembayaran, hingga rekapitulasi dan pelaporan. Akibatnya, proses administrasi menjadi lambat, tidak transparan, dan menimbulkan ketidakpuasan bagi orang tua sebagai pengguna layanan."

---

## 3. Identifikasi Stakeholder

| No | Stakeholder | Peran dalam Sistem | Permasalahan | Kebutuhan Utama |
|---|---|---|---|---|
| 1 | Admin PPDB | Mengelola proses pendaftaran, memeriksa data pendaftar, melakukan administrasi, verifikasi data, dan membuat laporan | Kesulitan mengelola data karena tersebar di berbagai platform; proses input dan pengecekan masih manual; sulit melakukan pencarian dan rekap data | Sistem terpusat untuk mengelola data pendaftar, form input mudah digunakan, dashboard rekapitulasi |
| 2 | Orang Tua / Wali Murid | Melakukan pendaftaran, mengunggah berkas, melakukan pembayaran, dan memantau status pendaftaran | Harus mengisi data melalui Google Form yang tidak terintegrasi; terbebani biaya tambahan saat pembayaran; kesulitan dalam proses pendaftaran | Platform pendaftaran online terintegrasi, informasi pembayaran transparan, status pendaftaran real-time |
| 3 | Bendahara | Melihat data pembayaran, memverifikasi pembayaran, mengelola tagihan administrasi, mengelola pembayaran SPP, dan membuat laporan keuangan | Belum ada sistem terpusat untuk pengelolaan data pembayaran | Sistem pembayaran terintegrasi, verifikasi otomatis, laporan keuangan |
| 4 | Kepala Sekolah | Melihat statistik pendaftaran, melihat laporan PPDB dan pembayaran, mencetak laporan keseluruhan | Tidak ada dashboard terpusat untuk monitoring | Dashboard monitoring statistik pendaftaran dan pembayaran |

### 3.1 Penjelasan Klasifikasi Aktor

- **Admin PPDB** — terlibat langsung sebagai pengelola data pendaftar, verifier data, dan pembuat laporan.
- **Orang Tua / Wali Murid** — terlibat langsung sebagai pengguna layanan pendaftaran dan pembayaran.
- **Bendahara** — terlibat langsung sebagai pengelola data pembayaran dan pembuat laporan keuangan.
- **Kepala Sekolah** — peran pengawas, memantau statistik dan laporan PPDB secara keseluruhan.

---

## 4. Batasan Sistem

- Sistem hanya mengelola proses PPDB (Penerimaan Peserta Didik Baru).
- Sistem tidak terintegrasi dengan sistem informasi akademik yang sudah ada (e-rapor, LMS, dll.).
- Sistem tidak memiliki fitur kecerdasan buatan (AI) atau machine learning.
- Sistem tidak dikembangkan sebagai aplikasi mobile native (Android/iOS).
- Sistem tidak terintegrasi dengan payment gateway pihak ketiga.

---

## 5. Kebutuhan Fungsional

Tabel berikut memetakan kebutuhan fungsional berdasarkan permasalahan yang ditemukan:

| No | Kode | Kebutuhan Fungsional | Prioritas | Dikaitkan dengan Masalah |
|---|---|---|---|---|
| 1 | F-01 | Sistem harus dapat digunakan admin untuk mengelola data pendaftar dalam satu sistem terpusat | Tinggi | Data tersebar di berbagai platform |
| 2 | F-02 | Sistem harus dapat digunakan admin untuk menyimpan dan mengakses data pendaftar secara terstruktur | Tinggi | Penyimpanan data manual di Excel/Word |
| 3 | F-03 | Sistem harus dapat digunakan orang tua untuk melakukan pendaftaran secara online dalam satu platform | Tinggi | Pendaftaran via Google Form tidak terintegrasi |
| 4 | F-04 | Sistem harus dapat digunakan admin untuk memverifikasi data pendaftar secara efisien | Tinggi | Proses verifikasi manual dan lambat |
| 5 | F-05 | Sistem harus dapat digunakan orang tua untuk mengetahui status pendaftaran dan pembayaran | Tinggi | Orang tua kesulitan memantau status |
| 6 | F-06 | Sistem harus dapat digunakan admin untuk memantau dan merekap data pendaftaran | Tinggi | Rekap data manual dan sulit monitoring |
| 7 | F-07 | Sistem harus dapat digunakan orang tua untuk melakukan pembayaran dan memperoleh informasi pembayaran | Tinggi | Kendala pembayaran online dan biaya admin bank |
| 8 | F-08 | Sistem menyediakan registrasi akun pengguna | Sedang | Belum ada sistem akun terpusat |
| 9 | F-09 | Sistem menyediakan fitur login dengan form input username dan password | Sedang | Autentikasi belum terstruktur |
| 10 | F-10 | Sistem dapat menerima pengisian formulir pendaftaran online | Tinggi | Pendaftaran masih semi-manual |
| 11 | F-11 | Sistem dapat menerima upload berkas persyaratan | Sedang | Berkas still submitted manual |
| 12 | F-12 | Sistem dapat menampilkan status pendaftaran | Tinggi | Tidak ada transparansi status |
| 13 | F-13 | Sistem dapat menampilkan informasi pembayaran | Tinggi | Informasi pembayaran tidak terintegrasi |
| 14 | F-14 | Sistem dapat menerima pembayaran online | Tinggi | Pembayaran online bermasalah |
| 15 | F-15 | Sistem dapat menampilkan riwayat pembayaran | Sedang | Riwayat pembayaran sulit diakses |
| 16 | F-16 | Sistem dapat mencetak bukti pendaftaran | Sedang | Bukti pendaftaran belum tersedia |
| 17 | F-17 | Sistem dapat mengirim notifikasi kepada pengguna | Sedang | Tidak ada pengingat otomatis |
| 18 | F-18 | Admin dapat mengelola informasi PPDB | Sedang | Informasi PPDB belum terpusat |
| 19 | F-19 | Admin dapat melihat dan memverifikasi berkas persyaratan | Sedang | Verifikasi berkas manual |
| 20 | F-20 | Admin dapat mengubah status pendaftaran siswa | Tinggi | Status pendaftaran belum terstruktur |
| 21 | F-21 | Admin dapat mengelola data siswa dan akun pengguna | Sedang | Pengelolaan data masih manual |
| 22 | F-22 | Admin dapat mengirim pengumuman | Sedang | Tidak ada saluran pengumuman terpusat |
| 23 | F-23 | Admin dapat mencetak laporan PPDB | Sedang | Laporan masih dibuat manual |
| 24 | F-24 | Bendahara dapat melihat dan memverifikasi pembayaran | Tinggi | Verifikasi pembayaran manual |
| 25 | F-25 | Bendahara dapat mengelola tagihan administrasi dan pembayaran SPP | Sedang | Pengelolaan tagihan manual |
| 26 | F-26 | Bendahara dapat membuat laporan keuangan dan mencetak bukti pembayaran | Sedang | Laporan keuangan manual |
| 27 | F-27 | Kepala sekolah dapat melihat statistik pendaftaran dan laporan PPDB | Sedang | Tidak ada dashboard monitoring |
| 28 | F-28 | Kepala sekolah dapat mencetak laporan keseluruhan | Sedang | Laporan keseluruhan belum tersedia |

---

## 6. Kebutuhan Non-Fungsional

| No | Kode | Kategori | Kebutuhan |
|---|---|---|---|
| 1 | NF-01 | Keamanan | Sistem harus menggunakan login dan password |
| 2 | NF-02 | Keamanan | Data pengguna harus tersimpan aman dalam database |
| 3 | NF-03 | Keamanan | Hak akses tiap pengguna harus berbeda sesuai peran (Admin, Orang Tua, Bendahara, Kepala Sekolah) |
| 4 | NF-04 | Kinerja | Sistem dapat diakses secara online |
| 5 | NF-05 | Kinerja | Sistem mampu menyimpan data pendaftaran secara otomatis |
| 6 | NF-06 | Kinerja | Sistem mampu menampilkan informasi pembayaran secara real-time |
| 7 | NF-07 | Kemudahan Penggunaan | Tampilan sistem mudah dipahami pengguna |
| 8 | NF-08 | Kemudahan Penggunaan | Sistem dapat digunakan melalui laptop maupun smartphone |
| 9 | NF-09 | Kemudahan Penggunaan | Proses pendaftaran dapat dilakukan tanpa datang ke sekolah |
| 10 | NF-10 | Penyimpanan Data | Data tersimpan dalam database terpusat |
| 11 | NF-11 | Penyimpanan Data | Sistem dapat melakukan backup data |
| 12 | NF-12 | Penyimpanan Data | Data dapat dicari dengan cepat |

---

## 7. Traceability

| No | Temuan | Masalah | Stakeholder | Kebutuhan |
|---|---|---|---|---|
| 1 | Proses pendaftaran masih semi-manual | Proses lambat, tidak efisien, dan rawan kesalahan | Admin PPDB & Orang Tua | Sistem terintegrasi untuk mengelola proses pendaftaran |
| 2 | Rekap data PPDB manual dan belum ada database | Sulit monitoring dan pelaporan | Admin PPDB | Sistem harus dapat digunakan admin untuk memantau dan merekap data pendaftaran |
| 3 | Orang tua belum memiliki akses terintegrasi untuk melihat riwayat dan informasi pembayaran dalam satu platform | Pengelolaan yang masih mengandalkan media manual menyebabkan pemantauan riwayat dan informasi administratif oleh orang tua belum efisien dan belum terintegrasi secara optimal | Orang Tua | Sistem harus dapat digunakan orang tua untuk melakukan pembayaran dan memperoleh informasi pembayaran |

---

## 8. Hasil Observasi dan Wawancara

### 8.1 Informasi Observasi

| | |
|---|---|
| Metode | Observasi langsung + Wawancara semi-terstruktur |
| Narasumber | Mas Eka (Staf Administrasi) |

### 8.2 Temuan Observasi Lapangan

Observasi dilakukan di SDN Karangkajen melalui dua pendekatan, yaitu pengamatan langsung terhadap proses administrasi sekolah dan wawancara semi-terstruktur dengan staf administrasi. Secara umum, ditemukan bahwa seluruh proses administrasi PPDB masih berjalan secara semi-manual dan belum didukung oleh sistem informasi yang memadai.

Proses pendaftaran siswa baru dilakukan melalui Google Form yang disebarkan oleh pihak sekolah melalui website, brosur, dan spanduk. Data pendaftar kemudian disimpan secara manual menggunakan Microsoft Excel dan dokumen lainnya. Sekolah belum memiliki database khusus untuk pengelolaan data PPDB.

Untuk pembayaran, sekolah sempat menjalin kerja sama dengan bank BSM, namun kerja sama tersebut dihentikan karena mengalami keterlambatan informasi setelah pembayaran dilakukan serta adanya biaya admin bank yang memberatkan orang tua. Saat ini pembayaran menggunakan rekening bank atas nama sekolah sendiri.

Sekolah juga memiliki website berbasis WordPress yang hanya digunakan untuk langganan domain dan bersifat statis. Sistem informasi yang ada di sekolah masih sangat sederhana.

### 8.3 Transkrip Wawancara

Transkrip lengkap wawancara dengan Mas Eka (Staf Administrasi) dapat dilihat di [`detail_wawancara.md`](../obs/detail_wawancara.md).

---

## 9. Konsep Solusi yang Diusulkan

### 9.1 Nama Sistem

**SIPDB** — Sistem Informasi Penerimaan Peserta Didik Baru

### 9.2 Deskripsi Solusi

SIPDB adalah aplikasi web berbasis sistem informasi yang berfungsi sebagai platform terpusat untuk mengelola seluruh alur PPDB di SDN Karangkajen. Sistem ini menyediakan fitur pendaftaran online, verifikasi data, pembayaran, rekapitulasi, dan pelaporan dalam satu platform yang terintegrasi.

### 9.3 Alur Sistem yang Diusulkan

| No | Tahap | Proses | Aktor |
|---|---|---|---|
| 1 | Pendaftaran | Orang tua mengakses sistem, mendaftar akun, mengisi formulir pendaftaran online, dan mengunggah berkas persyaratan | Orang Tua |
| 2 | Verifikasi | Admin PPDB memeriksa data pendaftar, memverifikasi berkas persyaratan, dan mengubah status pendaftaran | Admin PPDB |
| 3 | Pembayaran | Orang tua melakukan pembayaran administrasi PPDB dan memperoleh informasi status pembayaran | Orang Tua |
| 4 | Verifikasi Pembayaran | Bendahara memverifikasi pembayaran, mengelola tagihan, dan mencetak bukti pembayaran | Bendahara |
| 5 | Monitoring | Kepala sekolah melihat statistik pendaftaran, laporan PPDB, dan laporan pembayaran | Kepala Sekolah |
| 6 | Pelaporan | Admin PPDB dan Bendahara mencetak laporan PPDB dan laporan keuangan | Admin PPDB & Bendahara |

---

## 10. Kesimpulan Analisis Kebutuhan

Berdasarkan seluruh temuan observasi dan wawancara, dapat disimpulkan bahwa SDN Karangkajen membutuhkan sistem informasi PPDB digital yang mampu:

1. Mendigitalisasi proses pendaftaran siswa baru dengan formulir online terstruktur dan penyimpanan berkas digital.
2. Menyediakan sistem basis data terpusat untuk pengelolaan data pendaftar yang terstruktur dan mudah diakses.
3. Memberikan akses transparan kepada orang tua untuk memantau status pendaftaran dan pembayaran secara real-time.
4. Mengelola proses pembayaran administrasi secara online tanpa biaya tambahan dari pihak ketiga.
5. Menyediakan fitur verifikasi data yang efisien bagi Admin PPDB dan Bendahara.
6. Menyediakan dashboard monitoring dan pelaporan bagi Kepala Sekolah.
