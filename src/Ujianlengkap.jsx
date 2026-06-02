import { useState, useEffect, useCallback, useRef } from "react";

const DURATION_SESI = 60 * 60;   // 60 menit (Sesi 1 & 2)
const DURATION_SESI3 = 30 * 60;  // 30 menit (Sesi 3 Psikologis)
const MAX_PELANGGARAN = 3;

// ══════════════════════════════════════════════════════════════════════
// SOAL SESI 1: TES POTENSI BELAJAR (TPB)
// ══════════════════════════════════════════════════════════════════════
const SOAL_TPB = [
  // BAGIAN I: KEMAMPUAN VERBAL
  { bagian: "Kemampuan Verbal", nomor: 1, soal: "Penulisan partikel dalam kalimat berikut ini yang benar adalah ..", pilihan: ["A. Apa kah aku boleh memakan buahmu?", "B. Murid memasuki ruangan satu persatu", "C. Apa pun yang dia inginkan selalu terpenuhi.", "D. Ada pun penyebab kemacetan itu belum diketahui."], kunci: "C" },
  { bagian: "Kemampuan Verbal", nomor: 2, soal: "Kabar kembali datang dari John Wick 4 setelah mulai produksi pada Juni lalu. Kali ini aktor yang menyulih suara Surtur dalam Thor: Ragnarok, Clancy Brown, bergabung dengan John Wick 4. Sutradara Chad Stahelski mengaku senang dengan keterlibatan Brown dalam film yang ia garap. Bahkan ia mengaku sudah menjadi penggemar aktor berusia 62 tahun 'itu' sejak lama. \n\nKata ganti 'itu' pada tulisan bercetak tebal dalam berita John Wick 4 mengacu pada ...", pilihan: ["A. John Wick 4", "B. Clancy Brown", "C. Donnie Yen", "D. Aktor asal Hong Kong"], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 3, soal: "Penulisan partikel /per/ berikut ini yang tepat adalah ...", pilihan: ["A. Persekian menit", "B. Perahu nelayan", "C. Per akaran tumbuhan", "D. Per satu detik"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 4, soal: "WAHANA — Sinonim?", pilihan: ["A. Sarana", "B. Ide", "C. Dunia", "D. Planet"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 5, soal: "DOGMA — Sinonim?", pilihan: ["A. Agama", "B. Ideologi", "C. Ajaran", "D. Keyakinan", "E. Kendaraan"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 6, soal: "Perubahan iklim berpotensi pada hilangnya sepertiga pantai pasir di planet ini. Menurut jurnal Nature Change, pengurangan Climate penggunaan bahan bakar fosil tetap tidak menghilangkan kemungkinan 'musnahnya' sepertiga pantai berpasir di dunia.\n\n Penulisan kata ganti -nya pada kata bercetak tebal 'musnahnya' dalam teks perubahan iklim mengacu pada ...", pilihan: ["A. pantai berpasir", "B. Nature Climate Change", "C. perubahan iklim", "D. garis tepi pantai", "E. bahan bakar fosil"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 7, soal: "Berikut ini pernyataan yang benar mengenai gabungan kata adalah ...", pilihan: ["A. Gabungan kata yang merupakan istilah lazim atau kata majemuk ditulis serangkai.", "B. Gabungan kata yang menimbulkan salah pengertian ditulis menggunakan tanda hubung (-). Contoh: anak-istri pejabat", "C. Gabungan kata ditulis serangkai dengan catatan mendapatkan awalan.", "D. Gabungan kata yang sudah padu tidak perlu ditulis serangkai.", "E. Gabungan kata ditulis terpisah apabila terdiri dari bentuk terikat dan kata dasar."], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 8, soal: "Manakah pembentukan kata yang tepat dalam kalimat berikut?", pilihan: ["A. Tidak ada yang lebih memesona selain keberhasilan siswa", "B. Penerapan kurikulum baru mempengaruhi kinerja guru", "C. Kita jangan hanya memerhatikan bagaimana guru bekerja", "D. Penggunaan smartphone dapat memer-mudah manusia dalam berkomunikasi.", "E. Apakah semua kurikulum mampu mengubah dunia pendidikan?"], kunci: "E" },
  { bagian: "Kemampuan Verbal", nomor: 9, soal: "Kata ulang bermakna 'paling' terdapat pada kalimat ...", pilihan: ["A. Pemain-pemain sepakbola itu berkumpul di rumahnya.", "B. Mereka berusaha belajar sebaik-baiknya", "C. Ia hanya membaca buku-buku LKS", "D. Dia mendengarkan musik sambil tidur-tiduran", "E. Adi menggebu-gebu ingin masuk perwira."], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 10, soal: "(1) Dilihat dari video yang diterima, pengendara wanita tersebut tampak tiba-tiba berhenti di tengah jalan. (2) Tidak lama kemudian, pengendara motor Kawasaki ER6N menabrak wanita dari arah belakang. (3) Peristiwa tersebut juga viral di media sosial. (4) Tampak sejumlah foto yang salah satunya menunjukkan moge milik pelaku diangkut oleh mobil patroli. (5) Selain itu, di foto lainnya terlihat satu unit kendaraan bermotor Honda Beat berwarna hitam.\n\n Penulisan kata depan yang sesuai berdasarkan paragraf tentang pengendara wanita adalah ...", pilihan: ["A. (3) dan (5)", "B. Semuanya benar", "C. (2) dan (4)", "D. Semuanya salah", "E. (1) dan (3)"], kunci: "E" },
  { bagian: "Kemampuan Verbal", nomor: 11, soal: "Imbuhan pe-an dalam kata pemandian memiliki makna ...", pilihan: ["A. Kegiatan", "B. Alat", "C. Suasana", "D. Tempat", "E. Keadaan"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 12, soal: "Tim public relation sedang ... tempat yang akan dijadikan sebagai sasaran kegiatan. Kata berimbuhan yang tepat untuk mengisi titik-titik di atas adalah ...", pilihan: ["A. Mesurvei", "B. Memsurvei", "C. Mensurvei", "D. Menyurvei", "E. Menyurveikan"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 13, soal: "AKTUAL — Antonim?", pilihan: ["A. Fiktif", "B. Modern", "C. Sebenarnya", "D. Kadaluarsa", "E. Baru"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 14, soal: "DEPENDEN — Antonim?", pilihan: ["A. Interaksi", "B. Korelasi", "C. Animasi", "D. Invalid", "E. Mandiri"], kunci: "E" },
  { bagian: "Kemampuan Verbal", nomor: 15, soal: "Berikut ini kalimat yang menerapkan kaidah penulisan angka yang tidak tepat adalah ...", pilihan: ["A. Seperempat gajiku selalu aku tabung untuk membeli rumah", "B. Harga parkir motor di Pakuwon Mall adalah Rp5.000,-", "C. Pedagang kaki lima sering ditemukan dengan kawasan simpang 5", "D. Total hadiah yang didapatkan dari lomba karate adalah 10 juta.", "E. Dua belas rumah rusak akibat tanah longsor yang terjadi di Lombok."], kunci: "D" },
  // BAGIAN II: KEMAMPUAN NUMERIK
  { bagian: "Kemampuan Numerik", nomor: 16, soal: "Gaza memiliki operasi matematika, yaitu 10 +3-7x 5. Normalnya operasi tersebut akan dihitung dengan urutan perkalian, penjumlahan, lalu pengurangan. Jika Gaza mengacak urutan operasi tersebut sehingga tidak lagi memakai kaidah matematika (contohnya pertambahan, perkalian, lalu pengurangan), berapakah selisih antara bilangan terbesar dan terkecil yang dapat dihasilkan?", pilihan: ["A. 52", "B. 12", "C. 32", "D. 2"], kunci: "A" },
  { bagian: "Kemampuan Numerik", nomor: 17, soal: "Jika x = -y dan x ≠ 0, ada berapa pernyataan berikut yang benar? 1) x²y² < 0, 2) (x+y)² = 0, 3) xy < 0", pilihan: ["A. 0", "B. 3", "C. 2", "D. 1"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 18, soal: "2 - 20% - 2% - 0,2% - 0,02% = ...", pilihan: ["A. 0,1777", "B. 1,7778", "C. 17,778", "D. 0,1778"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 19, soal: "Jika x² + y² = 10 dan xy = 3, maka x + y = ...", pilihan: ["A. 4 atau -4", "B. 4", "C. -4", "D. 0"], kunci: "A" },
  { bagian: "Kemampuan Numerik", nomor: 20, soal: "Penjumlahan digit terakhir dan digit pertama dari 3¹³  adalah ...", pilihan: ["A. 9", "B. 3", "C. 4", "D. 10"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 21, soal: "x, 2x, 7, 17, 14, 29, 26, 46, y. Nilai dari x + y adalah ...", pilihan: ["A. 51", "B. 61", "C. 91", "D. 48"], kunci: "D" },
  { bagian: "Kemampuan Numerik", nomor: 22, soal: "3, 7, 11, 15, ... Suku ke-100 dari barisan tersebut adalah ...", pilihan: ["A. 396", "B. 297", "C. 399", "D. 1188"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 23, soal: "4, 5, 7, 10, 11, 13, 16, 17, ...", pilihan: ["A. 20", "B. 19", "C. 18", "D. 21"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 24, soal: "3, 4, 7, 2, -5, 4, 15, ...", pilihan: ["A. 2 dan 13", "B. -2 dan -13", "C. -2 dan 13", "D. 2 dan -13"], kunci: "D" },
  { bagian: "Kemampuan Numerik", nomor: 25, soal: "Toni membeli bakso per porsi Rp9.800 dan menginginkan untung 33%. Berapa harga per porsi yang harus dijual?", pilihan: ["A. 11.024", "B. 10.034", "C. 13.034", "D. 15.024"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 26, soal: "c berbanding lurus dengan x. Bila c = 8,4 dan x = 3,6, berapakah nilai c jika x = 3,336?", pilihan: ["A. 7,774", "B. 4,777", "C. 4,874", "D. 7,784"], kunci: "D" },
  { bagian: "Kemampuan Numerik", nomor: 27, soal: "107% dari 2009 adalah ...", pilihan: ["A. 2491,6", "B. 2149,6", "C. 2419,6", "D. 2194,6"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 28, soal: "Pak Tono memiliki lahan 4½ ha, membeli lagi 2⅚ ha. 3⅙ ha adalah lahan perkebunan, sisanya pertanian. Jika 12% lahan pertanian rusak, berapakah luas lahan yang rusak?", pilihan: ["A. 2,47 hektar", "B. 0,5 hektar", "C. 0,38 hektar", "D. 3,25 hektar"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 29, soal: "Perusahaan memiliki 8 mesin yang mencapai target dalam 1 bulan. Bulan depan harus selesai 20 hari. Berapa mesin yang perlu dibeli lagi?", pilihan: ["A. 8", "B. 4", "C. 2", "D. 12"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 30, soal: "Kereta cepat menempuh 3 km dalam 45 detik. Kecepatan dalam km/jam adalah ...", pilihan: ["A. 44", "B. 72", "C. 80", "D. 240"], kunci: "D" },
  // BAGIAN III: PENALARAN LOGIS DAN ANALITIK
  { bagian: "Penalaran Logis", nomor: 31, soal: "Semua siswa MAN 5 Bogor rajin belajar. Budi adalah siswa MAN 5 Bogor. Kesimpulan yang tepat adalah ...", pilihan: ["A. Budi mungkin rajin belajar.", "B. Budi pasti rajin belajar.", "C. Budi tidak rajin belajar.", "D. Semua siswa bernama Budi rajin belajar.", "E. Tidak dapat disimpulkan."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 32, soal: "Jika hari ini adalah hari Senin, maka dua hari lagi adalah hari Rabu. Hari ini bukan hari Senin. Kesimpulan yang tepat adalah ...", pilihan: ["A. Dua hari lagi pasti hari Rabu.", "B. Dua hari lagi bukan hari Rabu.", "C. Tidak dapat disimpulkan apakah dua hari lagi Rabu atau bukan.", "D. Hari ini adalah hari Minggu.", "E. Hari ini adalah hari Selasa."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 33, soal: "Di sebuah kelas, semua yang menyukai matematika juga menyukai fisika. Rini menyukai fisika. Kesimpulan yang tepat adalah ...", pilihan: ["A. Rini pasti menyukai matematika.", "B. Rini tidak menyukai matematika.", "C. Rini mungkin menyukai matematika, mungkin tidak.", "D. Semua yang menyukai fisika menyukai matematika.", "E. Fisika dan matematika selalu berhubungan."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 34, soal: "Lima orang (A, B, C, D, E) duduk dalam satu baris. A duduk di sebelah kiri B. C duduk di antara D dan E. B duduk paling kanan. Siapakah yang duduk paling kiri?", pilihan: ["A. A", "B. C", "C. D", "D. Tidak dapat ditentukan"], kunci: "D" },
  { bagian: "Penalaran Logis", nomor: 35, soal: "Jika tidak ada yang berani, maka tidak ada yang sukses. Andi sukses. Kesimpulan yang tepat adalah ...", pilihan: ["A. Andi tidak berani.", "B. Andi pasti berani.", "C. Semua yang sukses berani.", "D. Andi mungkin berani."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 36, soal: "Semua tanaman membutuhkan air. Semua yang membutuhkan air akan layu jika kekeringan. Kesimpulan yang tepat adalah ...", pilihan: ["A. Semua tanaman akan layu jika kekeringan.", "B. Hanya tanaman yang layu jika kekeringan.", "C. Air menyebabkan tanaman layu.", "D. Kekeringan baik untuk tanaman."], kunci: "A" },
  { bagian: "Penalaran Logis", nomor: 37, soal: "Perhatikan pola gambar: ○ △ □ ○ △ □ ○ △ ... Bentuk apa yang seharusnya mengisi titik-titik?", pilihan: ["A. ○", "B. △", "C. □", "D. ◇"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 38, soal: "Premis 1: Semua buku memiliki halaman. Premis 2: Novel adalah buku. Manakah kesimpulan yang VALID?", pilihan: ["A. Semua halaman ada di dalam novel.", "B. Novel memiliki halaman.", "C. Buku selalu berisi cerita.", "D. Halaman adalah bagian dari buku saja."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 39, soal: "Kotak A berisi apel atau mangga. Kotak B berisi mangga. Kotak C berisi jeruk. Jika Kotak B dan C digabung, hasilnya berisi ...", pilihan: ["A. Apel dan mangga", "B. Mangga dan jeruk", "C. Apel dan jeruk", "D. Apel, mangga, dan jeruk"], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 40, soal: "Ani lebih tinggi dari Budi, dan Budi lebih tinggi dari Citra, maka ...", pilihan: ["A. Citra lebih tinggi dari Ani.", "B. Budi paling tinggi.", "C. Ani paling tinggi di antara ketiganya.", "D. Citra dan Ani sama tinggi."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 41, soal: "Manakah pernyataan yang PASTI BENAR jika: 'Beberapa siswa rajin, dan semua siswa rajin mendapat beasiswa'?", pilihan: ["A. Semua siswa mendapat beasiswa.", "B. Beberapa siswa mendapat beasiswa.", "C. Siswa yang tidak rajin tidak mendapat beasiswa.", "D. Semua siswa yang mendapat beasiswa adalah rajin."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 42, soal: "Tim X bermain 5 kali: menang 3 kali (3 poin), seri 1 kali (1 poin), kalah 1 kali (0 poin). Berapa total poin tim X?", pilihan: ["A. 8", "B. 9", "C. 10", "D. 11"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 43, soal: "P lebih besar dari Q. R lebih kecil dari Q. S sama dengan P. Urutan dari terbesar ke terkecil adalah ...", pilihan: ["A. P, Q, R, S", "B. S, P, Q, R", "C. P = S > Q > R", "D. Q > P = S > R"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 44, soal: "Alif membeli makanan paling dahulu. Bela mengantre setelah Caca. Doni mengantre sebelum Caca. Bagaimana urutan antrean yang sebenarnya?", pilihan: ["A. Alif, Doni, Bela, Caca", "B. Alif, Bela, Caca, Doni", "C. Alif, Caca, Bela, Doni", "D. Alif, Doni, Caca, Bela"], kunci: "D" },
  { bagian: "Penalaran Logis", nomor: 45, soal: "Umi duduk di sebelah kiri Vina. Vina duduk di belakang Yuli. Siapakah yang duduk di kiri pada baris depan roller coaster?", pilihan: ["A. Vina", "B. Wulan", "C. Tidak dapat dipastikan", "D. Yuli"], kunci: "B"},
  // BAGIAN IV: KEPRIBADIAN DAN MINAT BAKAT (15 soal — tidak ada benar/salah)
  { bagian: "Kepribadian & Minat Bakat", nomor: 46, soal: "Ketika menghadapi tugas kelompok yang sulit, apa yang biasanya kamu lakukan?", pilihan: ["A. Menunggu teman lain memulai agar bisa mengikuti arahannya.", "B. Langsung membagi tugas dan memimpin kelompok agar efisien.", "C. Mengerjakan bagian sendiri tanpa berdiskusi dengan yang lain.", "D. Menyerahkan semua pekerjaan kepada teman yang paling pintar.", "E. Meminta guru menyelesaikan masalah kelompok."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 47, soal: "Saat kamu mendapat nilai ujian yang buruk, reaksi pertamamu adalah ...", pilihan: ["A. Menyalahkan guru karena soal terlalu sulit.", "B. Tidak peduli dan berharap nilai berikutnya lebih baik.", "C. Menganalisis kesalahanmu dan membuat rencana perbaikan.", "D. Mencontek pada ujian berikutnya agar nilainya bagus.", "E. Menyerah dan menganggap diri tidak mampu."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 48, soal: "Temanmu menunjukkan cara menyelesaikan soal matematika yang berbeda dari caramu, padahal keduanya benar. Sikapmu adalah ...", pilihan: ["A. Mempertahankan cara sendiri dan mengabaikan cara temanmu.", "B. Mengatakan cara temanmu salah meskipun jawabannya benar.", "C. Mempelajari cara temanmu dan menggabungkan dengan pemahamanmu.", "D. Langsung meniru cara temanmu tanpa memahaminya.", "E. Merasa cemburu karena cara temanmu lebih efisien."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 49, soal: "Kamu diminta mewakili sekolah dalam lomba debat, tetapi kurang percaya diri. Apa yang akan kamu lakukan?", pilihan: ["A. Menolak karena takut kalah dan mempermalukan sekolah.", "B. Menerima dengan semangat dan berlatih keras.", "C. Menerima tapi tidak belajar sama sekali karena yakin menang.", "D. Meminta teman lain menggantikanmu.", "E. Berpura-pura sakit agar tidak perlu mengikutinya."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 50, soal: "Ketika ada teman yang sedang kesulitan memahami pelajaran, kamu akan ...", pilihan: ["A. Pura-pura tidak tahu agar tidak perlu membantunya.", "B. Membantu menjelaskan sampai ia mengerti.", "C. Memberinya contekan saat ujian agar cepat selesai.", "D. Menyuruhnya bertanya ke guru saja.", "E. Merasa senang karena nilaimu bisa lebih tinggi dari temanmu."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 51, soal: "Bagaimana kamu mengatur waktu belajar selama di asrama?", pilihan: ["A. Belajar hanya saat menjelang ujian saja.", "B. Belajar sesuka hati tanpa jadwal yang jelas.", "C. Membuat jadwal belajar rutin dan mengikutinya dengan disiplin.", "D. Belajar hanya jika ada teman yang mengajak.", "E. Tidak belajar karena menganggap diri sudah cukup pintar."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 52, soal: "Jika kamu menemukan dompet berisi uang di lingkungan sekolah, apa yang akan kamu lakukan?", pilihan: ["A. Mengambil uangnya dan membuang dompetnya.", "B. Menyimpannya karena tidak ada yang melihat.", "C. Menyerahkan kepada guru atau petugas sekolah.", "D. Menunggu pemiliknya datang tanpa melakukan apa-apa.", "E. Memberikannya kepada teman untuk dibagi bersama."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 53, soal: "Kamu tidak setuju dengan keputusan yang diambil oleh ketua kelas. Apa yang akan kamu lakukan?", pilihan: ["A. Diam-diam tidak mematuhi keputusan tersebut.", "B. Menyampaikan pendapat secara santun dan konstruktif di forum diskusi.", "C. Menghasut teman-teman lain untuk menolak keputusan tersebut.", "D. Marah-marah di depan kelas.", "E. Keluar dari kelas karena tidak sepakat."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 54, soal: "Setelah masuk MAN IC, jadwal harian sangat padat: shalat berjamaah, belajar, ekstrakurikuler, dan mengaji. Bagaimana sikapmu?", pilihan: ["A. Mengeluh terus-menerus kepada orang tua agar dipindahkan.", "B. Hanya mengikuti kegiatan yang kamu sukai.", "C. Mengikuti semua kegiatan dengan penuh tanggung jawab dan adaptif.", "D. Menghindari kegiatan yang dianggap melelahkan.", "E. Tidur saat kegiatan berlangsung agar tetap segar."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 55, soal: "Saat kamu berhasil meraih prestasi, reaksimu adalah ...", pilihan: ["A. Menyombongkan diri kepada teman-teman.", "B. Bersyukur dan menjadikannya motivasi untuk terus berkembang.", "C. Merasa sudah cukup dan berhenti berusaha.", "D. Merendahkan teman yang tidak berprestasi.", "E. Menyembunyikan prestasi karena takut diiri."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 56, soal: "Bagaimana perasaanmu jika harus tinggal jauh dari orang tua di asrama?", pilihan: ["A. Sangat tidak mau dan akan pulang tanpa izin.", "B. Sedih tapi siap karena ini demi masa depan yang lebih baik.", "C. Tidak peduli sama sekali.", "D. Takut dan tidak bisa mandiri.", "E. Menyesal mendaftar ke MAN 5"], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 57, soal: "Dalam kegiatan diskusi kelompok, kamu lebih suka ...", pilihan: ["A. Diam dan membiarkan orang lain berbicara.", "B. Mendominasi pembicaraan tanpa memberi kesempatan orang lain.", "C. Aktif berbicara, mendengarkan, dan merangkum pendapat bersama.", "D. Keluar dari diskusi jika pendapatmu tidak disetujui.", "E. Hanya setuju dengan semua pendapat agar cepat selesai."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 58, soal: "Kamu melihat teman satu kamar asrama membuang sampah sembarangan. Kamu akan ...", pilihan: ["A. Pura-pura tidak melihat.", "B. Ikut membuang sampah sembarangan karena teman melakukannya.", "C. Mengingatkan dengan cara yang baik dan mencontohkan membuang sampah di tempatnya.", "D. Melaporkan langsung ke kepala asrama tanpa menegurnya terlebih dahulu.", "E. Membersihkan sampahnya diam-diam tanpa menegur."], kunci: "C" },
  { bagian: "Kepribadian & Minat Bakat", nomor: 59, soal: "Kamu mendapat tugas membaca satu buku tebal dalam seminggu. Cara terbaik yang kamu lakukan adalah ...", pilihan: ["A. Membaca semuanya di hari terakhir sebelum deadline.", "B. Membagi jumlah halaman per hari dan membaca rutin setiap hari.", "C. Hanya membaca bagian kesimpulan saja.", "D. Meminta teman merangkumkan untuk kamu.", "E. Tidak membaca dan mengarang saja saat ditanya."], kunci: "B"},
  { bagian: "Kepribadian & Minat Bakat", nomor: 60, soal: "Motivasi utamamu mendaftar ke MAN 5 Bogor adalah ...", pilihan: ["A. Karena dipaksa orang tua.", "B. Agar terlihat keren di mata teman-teman.", "C. Karena ingin mendapatkan pendidikan berkualitas yang mengintegrasikan IPTEK dan nilai Islam.", "D. Karena tidak ada pilihan sekolah lain.", "E. Karena ingin jauh dari orang tua."], kunci: "C" },

  // BAGIAN V: MINAT BAKAT (40 soal — tidak ada benar/salah, profil dominan)
  // A=Investigatif, B=Sosial, C=Artistik, D=Teknis, E=Kinestetik
  { bagian: "Minat Bakat", nomor: 1, soal: "Ketika mempelajari konsep yang sangat kompleks, pendekatan yang paling kamu sukai adalah...", pilihan: ["A. Membaca referensi mendalam dan menganalisis teorinya", "B. Mendiskusikan dengan orang lain", "C. Mengubahnya menjadi bentuk Visual/karya", "D. Mencoba eksperimen teknis", "E. Mempraktikkan langsung"] },
  { bagian: "Minat Bakat", nomor: 2, soal: "Jika diberi proyek sekolah besar, kamu paling tertarik mengerjakan...", pilihan: ["A. Analisis data & laporan", "B. Koordinasi tim", "C. Desain visual", "D. Perancangan teknis", "E. Implementasi lapangan"] },
  { bagian: "Minat Bakat", nomor: 3, soal: "Saat menghadapi masalah sulit..", pilihan: ["A. Menguraikan logika", "B. Bertanya pada orang", "C. Mencari ide kreatif", "D. Trial & error", "E. Bertindak cepat"] },
  { bagian: "Minat Bakat", nomor: 4, soal: "Topik yang paling menarik perhatianmu...", pilihan: ["A. Ilmu pengetahuan", "B. Interaksi manusia", "C. Seni & warna", "D. Mesin", "E. Aktivitas fisik"] },
  { bagian: "Minat Bakat", nomor: 5, soal: "Keberhasilan paling membanggakan bagimu...", pilihan: ["A. Prestasi akademik", "B. Pengakuan sosial", "C. Apresiasi karya", "D. Alat berhasil dibuat", "E. Juara olahraga"] },
  { bagian: "Minat Bakat", nomor: 6, soal: "Dalam kerja kelompok kamu biasanya...", pilihan: ["A. Dokumentasi", "B. Pemimpin diskusi", "C. Desainer ide", "D. Teknisi", "E. Pelaksana"] },
  { bagian: "Minat Bakat", nomor: 7, soal: "Waktu luang kamu lebih sering...", pilihan: ["A. Membaca", "B. Bersosialisasi", "C. Berkarya", "D. Eksperimen", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 8, soal: "Orang lain melihatmu sebagai...", pilihan: ["A. Analitis", "B. Ramah", "C. Imajinatif", "D. Teknis", "E. Enerjik"] },
  { bagian: "Minat Bakat", nomor: 9, soal: "Pelajaran favoritmu..", pilihan: ["A. Matematika", "B. Sosiologi", "C. Seni", "D. Fisika", "E. PJOK"] },
  { bagian: "Minat Bakat", nomor: 10, soal: "Pekerjaan impian..", pilihan: ["A. Peneliti", "B. Konselor", "C. Seniman", "D. Engineer", "E. Atlet"] },
  { bagian: "Minat Bakat", nomor: 11, soal: "Saat memahami sistem baru...", pilihan: ["A. Analisis konsep", "B. Diskusi", "C. Visualisasi", "D. Simulasi alat", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 12, soal: "Jika ikut lomba...", pilihan: ["A. Olimpiade sains", "B. Debat", "C. Desain", "D. Robotik", "E. Atletik"] },
  { bagian: "Minat Bakat", nomor: 13, soal: "Tugas paling kamu nikmati...", pilihan: ["A. Konseptual", "B. Interaktif", "C. Ekspresif", "D. Mekanis", "E. Fisik"] },
  { bagian: "Minat Bakat", nomor: 14, soal: "Jika mengajari teman...", pilihan: ["A. Jelaskan teori", "B. Tanya jawab", "C. Gambar ilustrasi", "D. Demonstrasi", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 15, soal: "Ekstrakurikuler pilihan...", pilihan: ["A. Klub sains", "B. Organisasi", "C. Seni", "D. Teknologi", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 16, soal: "Saat membaca informasi..", pilihan: ["A. Analisis detail", "B. Bahas bersama", "C. Visualisasikan", "D. Uji teknis", "E. Terapkan"] },
  { bagian: "Minat Bakat", nomor: 17, soal: "Saat membuat proyek...", pilihan: ["A. Riset", "B. Kolaborasi", "C. Estetika", "D. Fungsi teknis", "E. Eksekusi"] },
  { bagian: "Minat Bakat", nomor: 18, soal: "Motivasi belajar terbesar...", pilihan: ["A. Pengetahuan", "B. Relasi", "C. Ekspresi", "D. Inovasi", "E. Tantangan fisik"] },
  { bagian: "Minat Bakat", nomor: 19, soal: "Cara mengatasi stres...", pilihan: ["A. Membaca", "B. Curhat", "C. Berkarya", "D. Merakit", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 20, soal: "Lingkungan favorit...", pilihan: ["A. Perpustakaan", "B. Komunitas", "C. Studio seni", "D. Lab", "E. Lapangan"] },
  { bagian: "Minat Bakat", nomor: 21, soal: "Saat menghadapi tantangan..", pilihan: ["A. Strategi logis", "B. Dukungan sosial", "C. Kreativitas", "D. Eksperimen", "E. Aksi"] },
  { bagian: "Minat Bakat", nomor: 22, soal: "Peran saat presentasi...", pilihan: ["A. Penyusun materi", "B. Pembicara", "C. Desain slide", "D. Demo alat", "E. Simulasi"] },
  { bagian: "Minat Bakat", nomor: 23, soal: "Kegiatan menyenangkan...", pilihan: ["A. Analisis", "B. Diskusi", "C. Menggambar", "D. Membongkar alat", "E. Bergerak"] },
  { bagian: "Minat Bakat", nomor: 24, soal: "Jika punya ide...", pilihan: ["A. Tulis konsep", "B. Bahas", "C. Visualkan", "D. Prototipe", "E. Uji"] },
  { bagian: "Minat Bakat", nomor: 25, soal: "Cara belajar favorit..", pilihan: ["A. Buku", "B. Kelompok", "C. Visual", "D. Praktikum", "E. Aktivitas"] },
  { bagian: "Minat Bakat", nomor: 26, soal: "Tujuan utama belajar...", pilihan: ["A. Pengetahuan", "B. Relasi", "C. Kreativitas", "D. Teknologi", "E. Kebugaran"] },
  { bagian: "Minat Bakat", nomor: 27, soal: "Jika memimpin proyek...", pilihan: ["A. Strategi", "B. Motivasi tim", "C. Konsep desain", "D. Sistem teknis", "E. Eksekusi"] },
  { bagian: "Minat Bakat", nomor: 28, soal: "Hal yang membuat penasaran...", pilihan: ["A. Teori", "B. Perilaku manusia", "C. Estetika", "D. Mekanik", "E. Performa tubuh"] },
  { bagian: "Minat Bakat", nomor: 29, soal: "Media ekspresi diri...", pilihan: ["A. Tulisan ilmiah", "B. Percakapan", "C. Seni", "D. Rekayasa", "E. Gerak"] },
  { bagian: "Minat Bakat", nomor: 30, soal: "Aktivitas akhir pekan...", pilihan: ["A. Membaca", "B. Nongkrong", "C. Berkarya", "D. Eksperimen", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 31, soal: "Jika menghadapi konflik...", pilihan: ["A. Analisis", "B. Mediasi", "C. Ide kreatif", "D. Uji solusi", "E. Aksi"] },
  { bagian: "Minat Bakat", nomor: 32, soal: "Kamu bangga jika...", pilihan: ["A. Nilai tinggi", "B. Banyak teman", "C. Karya dipuji", "D. Alat berhasil", "E. Menang lomba"] },
  { bagian: "Minat Bakat", nomor: 33, soal: "Saat berpikir...", pilihan: ["A. Logis", "B. Sosial", "C. Imajinatif", "D. Teknis", "E. Praktis"] },
  { bagian: "Minat Bakat", nomor: 34, soal: "Lingkungan kerja ideal...", pilihan: ["A. Akademik", "B. Sosial", "C. Artistik", "D. Teknologi", "E. Aktif"] },
  { bagian: "Minat Bakat", nomor: 35, soal: "Jika diberi dana proyek...", pilihan: ["A. Riset", "B. Event sosial", "C. Seni", "D. Alat", "E. Pelatihan fisik"] },
  { bagian: "Minat Bakat", nomor: 36, soal: "Saat melihat masalah dunia...", pilihan: ["A. Analisis ilmiah", "B. Dampak sosial", "C. Solusi kreatif", "D. Teknologi", "E. Aksi nyata"] },
  { bagian: "Minat Bakat", nomor: 37, soal: "Bentuk kontribusi favorit...", pilihan: ["A. Ide", "B. Hubungan", "C. Desain", "D. Sistem", "E. Tenaga"] },
  { bagian: "Minat Bakat", nomor: 38, soal: "Saat belajar cepat...", pilihan: ["A. Membaca", "B. Diskusi", "C. Visual", "D. Praktikum", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 39, soal: "Nilai penting bagimu..", pilihan: ["A. Logika", "B. Empati", "C. Ekspresi", "D. Inovasi", "E. Ketahanan"] },
  { bagian: "Minat Bakat", nomor: 40, soal: "Masa depan impian...", pilihan: ["A. Akademisi", "B. Sosial", "C. Kreatif", "D. Teknologi", "E. Atletik"] },
];

// ══════════════════════════════════════
// SOAL SESI 2: TES POTENSI AKADEMIK (TPA)
// ══════════════════════════════════════
const SOAL_TPA = [
  { bagian: "Penalaran Matematika", nomor: 1, soal: "Ikram membuat spageti panggang lumer dengan perbandingan massa spageti : adonan saus tomat : keju lumer = 4 : 4 : 2. Jika total massa spageti panggang lumer adalah 2.270 gram, berapakah total massa saus tomat dan keju lumer? (dalam gram)", pilihan: ["A. 1.336", "B. 2.337", "C. 1.337", "D. 2.227"], kunci: "A" },
  { bagian: "Penalaran Matematika", nomor: 2, soal: "Seorang tukang jahit mampu menjahit 60 potong kaos dalam 3 hari. Bila ia bekerja selama 2 minggu, berapa potong kaos yang dapat ia kerjakan?", pilihan: ["A. 210 potong", "B. 140 potong", "C. 280 potong", "D. 350 potong"], kunci: "C" },
  { bagian: "Penalaran Matematika", nomor: 3, soal: "Populasi sapi di kota P adalah 1.600 ekor (naik 25/bulan) dan kota Q 500 ekor (naik 10/bulan). Saat populasi kota P tiga kali kota Q, berapa populasi sapi di kota P?", pilihan: ["A. 2.250", "B. 2.400", "C. 2.100", "D. 1.900"], kunci: "C"},
  { bagian: "Penalaran Matematika", nomor: 4, soal: "Perhatikan grafik berikut! Berdasarkan grafik jumlah penumpang di bawah, pernyataan berikut yang paling tepat adalah ...", gambar: "/images/1.jpeg", pilihan: ["A. Jumlah penumpang September 2021 lebih dari 2x lipat penumpang Agustus 2021.", "B. Selisih jumlah penumpang Desember 2020 dan September 2021 sebanyak 1,96 juta penumpang.", "C. Jumlah penumpang Oktober 2020 meningkat 700 ribu dibanding tahun sebelumnya.", "D. Penumpang paling sedikit 995.400 terjadi pada bulan Juni 2020."], kunci: "C"},
  { bagian: "Penalaran Matematika", nomor: 5, soal: "Ramalan cuaca: Moskow (-5°C s/d 18°C), Mexico (17°C s/d 34°C), Paris (-3°C s/d 17°C), Tokyo (-2°C s/d 25°C). Perubahan suhu terbesar terjadi di kota ...", pilihan: ["A. Paris", "B. Mexico", "C. Moskow", "D. Tokyo"], kunci: "D"},
  { bagian: "Penalaran Matematika", nomor: 6, soal: "Harga botol minum mewah Rp2.200.000. Tahun depan turun 5%, lalu diskon 10% saat New Year Sale. Berapa yang Bu Syifa bayar?", pilihan: ["A. Rp2.900.000", "B. Rp1.881.000", "C. Rp2.090.000", "D. Rp1.181.000"], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 7, soal: "Peternakan 1: 500 ekor (+10/bulan), Peternakan 2: 300 ekor (+15/bulan). Setelah berapa bulan jumlah ayam keduanya sama?", pilihan: ["A. 67", "B. 53", "C. 50", "D. 41"],kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 8, soal: "Perhatikan grafik berikut! Berdasarkan grafik populasi penduduk di bawah, manakah pernyataan berikut yang SALAH?", gambar: "/images/2.jpeg", pilihan: ["A. Penduduk usia di bawah 20 tahun berjumlah 3,9 juta orang.", "B. Penduduk usia 40-44 tahun lebih banyak dari usia 0-4 tahun.", "C. Selisih penduduk usia 45-49 tahun dan 0-4 tahun berjumlah 190.270 orang.", "D. Penduduk usia 55-59 tahun sekitar setengah dari penduduk usia 35-39 tahun."], kunci: "C"},
  { bagian: "Penalaran Matematika", nomor: 9, soal: "Perbandingan kayu jati Pak Ahmad:Pak Nadhim = 7:8 dan Pak Nadhim:Pak Chafidz = 9:10. Total 2,15 ton. Massa kayu jati masing-masing (kg) secara berurutan adalah ...", pilihan: ["A. 63, 72, 80", "B. 720, 630, 800", "C. 72, 63, 80", "D. 630, 720, 800"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 10, soal: "Pak Nosyan ingin mendapat keuntungan 35% dari penjualan TV. Harga beli TV Rp1.400.000. Berapa harga jual yang tepat?", pilihan: ["A. Rp1.870.000", "B. Rp1.980.000", "C. Rp1.890.000", "D. Rp1.872.000"], kunci: "C" },
  { bagian: "Penalaran Matematika", nomor: 11, soal: "Banyak bilangan kurang dari 1000 yang disusun dari angka 1, 2, 3, 4, 5, dan 6 adalah ...", pilihan: ["A. 120", "B. 156", "C. 216", "D. 258"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 12, soal: "Tika membawa uang n. Beli 4 bungkus mie kembalian Rp900. Beli 5 bungkus mie kurang Rp1.500. Berapa uang yang dibawa Tika?", pilihan: ["A. Rp10.500", "B. Rp16.000", "C. Rp14.000", "D. Rp12.000"], kunci: "A"},
  { bagian: "Penalaran Matematika", nomor: 13, soal: "Tabel nilai Matematika kelas 9C. Berapa jumlah siswa yang nilainya di bawah rata-rata?", gambar: "/images/3.jpeg", pilihan: ["A. 18", "B. 10", "C. 3", "D. 22"], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 14, soal: "Organisasi 22 anggota, dipilih 4 pengurus secara acak. Jika 1 sudah terpilih, peluang anggota lain TIDAK terpilih menjadi pengurus adalah ...", pilihan: ["A. 1/9", "B. 1/7", "C. 7/9", "D. 6/7"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 15, soal: "Perbandingan panjang dan lebar persegi panjang 7:4. Keliling 66 cm. Berapa luasnya?", pilihan: ["A. 218 cm²", "B. 198 cm²", "C. 132 cm²", "D. 252 cm²"], kunci: "D"},
  { bagian: "Penalaran Matematika", nomor: 16, soal: " Sebuah mobil antik berharga Rp54.000.000 sedang diskon akhir tahun sebesar 10%. Jika membayarnya melalui ATM Salcen, akan sebesar 15% mendapat diskon lagi sebesar Seandainya Fabi ingin membeli mobil antik  tersebut dan membayarnya melalui ATM Salcen, berapakah harga mobil antik yang harus dibayar?", pilihan: “A. Rp52500000”, “B. Rp41310000”, “C. Rp40500000”, “D. Rp54500000”], kunci: "B"},
  { bagian: "Penalaran Matematika", nomor: 17, soal: " Luas dari taman yang ayah miliki adalah 25 meter persegi. Jika keliling dari taman kakek adalah 2 kali keliling taman ayah, maka luas taman ayah adalah .. persen dari luas taman kakek. (taman ayah dan kakek sama-sama persegi)", pilihan: “A. 29”, “B. 39”, “C.25”, “D.15”], kunci: "C"},
  { bagian: "Penalaran Matematika", nomor: 18, soal: " Ahmad, Bilgis, dan Citra adalah mahasiswa yang memiliki pekerjaan sampingan. Gaji Ahmad adalah yang paling besar dan gaji Balqis adalah setengah dari gaji Citra. Setelah bekerja selama 6 bulan, Ahmad berhasil mengumpulkan Rp5.500.000,00 dari hasil kerjanya dan lebih besar Rp1.500.000,00 dari hasil kerja Citra selama 5 bulan. Berapakah gaji Balqis setelah 8 bulan?", pilihan: “A. Rp3.200,000,00”, “B. Rp2.800,000,00”, “C. Rp4.000,000,00”, “D. Rp2.000.000,00”], kunci: "A"},
  { bagian: "Penalaran Matematika", nomor: 19, soal: " Suatu hari, Bu Desi bersama empat anak-anaknya pergi ke sebuah toko mainan untuk membelikan Beliau berencana anaknya masing-masing 1 buah mainan dengan harga yang sama. Sesampainya di toko tersebut, ternyata Bu Desi harus mengeluarkan uang sebesar Rp13.000 untuk penitipan barang. Jika Bu Desi hanya membawa 3/25 dari total uangnya ke toko yang dibeli tersebut dan tiap mainan berharga Rp8.000, berapa total keseluruhan uang yang Bu Desi miliki pada awalnya?", pilihan: “A. Rp375.000”, “B. Rp400,000”, “C. Rp390.000”, “D. Rp390.000”], kunci: "A"},
  { bagian: "Penalaran Matematika", nomor: 20, soal: " Seorang tukang jahit mendapat pesanan menjahit kaos untuk keperluan kampanye lahannya mampu menjahit 60 potong dalam 3 hari, Bila ia bekerja selama 2 minggu, berapa potong kaos yang dapat ia kerjakan?", pilihan: “A. 80 potong”, “B. 180 potong”, “C. 120 potong”, “D. 280 potong”], kunci: "D"},
  { bagian: "Literasi Keislaman", nomor: 1, soal: "Adam membaca ayat sajdah, lalu menghadap kiblat, niat, takbir, sujud, dan salam. Hal yang dilakukan Adam adalah contoh dari sujud ...", pilihan: ["A. Tilawah", "B. Wajib", "C. Syukur", "D. Sahwi"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 2, soal: "Perhatikan hadis berikut! Dalam hadis yang tercantum di bawah, terdapat amalan salat sunah ghairu muakkad, yaitu ...", gambar: "/images/4.jpeg", pilihan: ["A. Salat Istisqa'", "B. Salat Idul Fitri", "C. Salat Idul Adha", "D. Salat Istikharah"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 3, soal: "Perhatikan dalil berikut! Dalil di bawah menyebutkan dua bangkai yang halal untuk dimakan, yaitu ...", gambar: "/images/5.jpeg", pilihan: ["A. Ikan dan belalang", "B. Kambing dan sapi", "C. Unta dan sapi", "D. Ikan dan unta"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 4, soal: "a) Muzakki b) Mencapai haul c) Islam d) Makanan pokok e) Mustahiq f) Baligh g) Mencapai nisab h) Memiliki kelebihan makanan.\n\n Yang termasuk syarat wajib zakat fitrah dari daftar ketentuan adalah ...", pilihan: ["A. a, d, dan g", "B. c, d, dan h", "C. a, b, dan g", "D. b, e, dan f"], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 5, soal: "Berikut adalah syarat yang berhubungan dengan barang yang digadaikan dalam ar-Rahn, KECUALI ...", pilihan: ["A. Barang berharga yang dapat menutup hutangnya.", "B. Barang yang tidak boleh diperjualbelikan.", "C. Milik orang yang menggadaikan.", "D. Diketahui ukuran, jenis, dan sifatnya."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 6, soal: "Dari daftar: (1) Ibu, (2) Saudara perempuan sebapak, (3) Istri, (4) Cucu perempuan dari anak laki-laki, (5) Anak perempuan, (6) Cucu perempuan dari anak perempuan. Yang termasuk ahli waris perempuan adalah ...", pilihan: ["A. 1, 2, 3, 4, 5", "B. 1, 2, 3, 5, 6", "C. 1, 2, 4, 5, 6", "D. 1, 3, 4, 5, 6"], kunci: "A"},
  { bagian: "Literasi Keislaman", nomor: 7, soal: "Allah membuka jalan bagi manusia untuk menggali karunia-Nya dan membuka pintu kemenangan. Sifat Allah yang sesuai adalah ...", pilihan: ["A. Ar-Rauf", "B. Al-Aziz", "C. Al-Fattah", "D. Al-Qayyum"], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 8, soal: "Berikut yang BUKAN adab ketika membaca al-Qur'an adalah ...", pilihan: ["A. Membaguskan suara ketika membacanya.", "B. Membaca dalam keadaan suci.", "C. Memulai bacaan dengan isti'azah.", "D. Membacanya dengan cepat dan terburu-buru."], kunci: "D" },
  { bagian: "Literasi Keislaman", nomor: 9, soal: "Esensi sebenarnya dari moderasi beragama adalah ...", pilihan: ["A. Menggabungkan ajaran berbagai agama agar tercipta perdamaian universal.", "B. Mengurangi ketaatan pada ritual agama demi menyesuaikan diri dengan tren modern.", "C. Cara pandang, sikap, dan praktik dalam kehidupan beragama yang melindungi martabat kemanusiaan.", "D. Menjadikan rasio sebagai satu-satunya tolok ukur kebenaran dalam memahami teks suci."], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 10, soal: "Siswa merasa peraturan menyanyikan lagu Indonesia Raya bertentangan dengan kemurnian ibadah. Sikap moderat yang seharusnya diambil adalah ...", pilihan: ["A. Melakukan protes terbuka dan mengajak memboikot upacara.", "B. Memahami bahwa mencintai tanah air adalah bagian dari nilai agama yang bersifat muamalah.", "C. Pura-pura mengikuti aturan tetapi dalam hati membenci otoritas sekolah.", "D. Keluar dari sekolah dan mencari sekolah tanpa aturan kebangsaan."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 11, soal: "Bahaya algoritma media sosial yang menciptakan echo chamber bagi moderasi beragama adalah ...", pilihan: ["A. Mempercepat penyebaran informasi keagamaan yang valid.", "B. Memperkuat konfirmasi bias sehingga menutup diri dari kebenaran lain.", "C. Memudahkan koordinasi kegiatan bakti sosial lintas agama.", "D. Mengurangi minat generasi muda mempelajari sejarah agama."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 12, soal: "Dalam diskusi penggunaan AI untuk menjawab persoalan fikih, sikap Tawasuth ditunjukkan oleh ...", pilihan: ["A. Kelompok yang menggunakan AI sebagai alat bantu, namun tetap verifikasi ke guru/ulama.", "B. Kelompok yang memilih tidak ikut campur karena takut salah.", "C. Kelompok yang menyarankan AI dilarang di lingkungan sekolah.", "D. Kelompok yang meminta pemerintah membuat AI agama yang bersifat wajib."], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 13, soal: "Toleransi yang salah kaprah adalah jika seseorang ...", pilihan: ["A. Membiarkan tetangga berbeda agama merayakan hari besarnya dengan tenang.", "B. Mengikuti ritual ibadah agama lain karena merasa semua agama sama saja.", "C. Memberikan bantuan logistik kepada korban bencana tanpa melihat latar belakang agama.", "D. Menjaga keamanan tempat ibadah agama lain saat sedang digunakan."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 14, soal: "Sebagai ketua OSIS yang moderat (prinsip I'tidal), jika ada dua ekskul agama mengajukan dana bersamaan, tindakan paling tepat adalah ...", pilihan: ["A. Memberikan dana lebih besar kepada ekskul dengan anggota paling banyak.", "B. Memberikan dana hanya kepada ekskul yang seagama dengannya.", "C. Membagi dana secara proporsional dan adil sesuai kebutuhan objektif masing-masing.", "D. Menolak keduanya agar tidak terjadi kecemburuan sosial."], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 15, soal: "Mengapa sikap anti-kekerasan verbal menjadi syarat mutlak moderasi beragama di media sosial?", pilihan: ["A. Karena dapat menurunkan peringkat akun media sosial.", "B. Karena kekerasan verbal adalah pintu masuk menuju kekerasan fisik dan perpecahan sosial.", "C. Karena aturan hukum di Indonesia sangat ketat.", "D. Karena tokoh agama tidak boleh dikritik sama sekali."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 16, soal: " Di sebuah daerah, terdapat tradisi sedekah bumi sebagai bentuk syukur. Bagaimana sikap seorang siswa yang moderat terhadap tradisi tersebut?", pilihan: ["A. Mengharamkan secara mutlak tanpa mempelajari filosofinya.", "B. Menerima tradisi tersebut sebagai kekayaan budaya dan menyisipkan nilai-nilai syukur kepada Tuhan tanpa merusak pokok ajaran agama.", "C. Memaksa mengubah seluruh tata cara adat menjadi ritual agama murni.", "D. Menjauhi masyarakat yang masih mempraktikkan tradisi tersebut."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 17, soal: " Sebagai makhluk penghuni bumi, pada dasarnya kita hanya meminjam bumi ini kepada generasi sesudah kita. Maka kita berkewajiban untuk tetap menjaga dan melestarikannya, sehingga pada saatnya kita kembalikan dalam keadaan tetap utuh atau bahkan lebih baik. Dalam sebuah hadis, disebutkan bahwa barang siapa mampu menjadikan tanah gersang tadi menjadi produktif dan menghasilkan manfaat, maka ia berhak mendapatkan bumi tadi dan itu akan menjadi miliknya. Hadis tersebut adalah", gambar: "/images/ayat1.jpeg", pilihan: ["A. A", "B. B", "C. C", "D. D "], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 18, soal: " Seorang pelajar tidak memiliki kemauan untuk menambah berbagai pengalaman dan mencari tahu apayang belum diketahuinya. Sebenarnya, ia memiliki kesempatan untuk melakukan hal itu tapi pada akhirnya kesempatan yang ada terbuang sia-sia. Padahal Allah telah menjadikan otak untuk bisa berpikir dan menimbulkan kemauan dan kesempatan untuk memulai sesuatu. Pernyataan tersebut jika dikaitkan dengan QS. al-Alaq ayat 1-5, maka sebagai seorang pelajar kita harus ..", pilihan: ["A. Memiliki sikap disiplin.", "B. Menghargai waktu.", "C. Membantu teman.", "D. Menuntut ilmu. "], kunci: "D" },
  { bagian: "Literasi Keislaman", nomor: 19, soal: " Nabi yang mendapatkan keistimewaan dari Allah Swt. dapat memahami bahasa binatang dan termasuk Nabi yang paling kaya di antara manusia sepanjang sejarah peradaban tapi kekuasaan yang dimilikinya tersebut justru membuatnya merasa rendah hati di hadapan makhluk-Nya yang lain adalah ...", pilihan: ["A. Nabi Ayyub.", "B. Nabi Yunus.", "C. Nabi Sulaiman.", "D. Nabi Yusuf."], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 20, soal: " Faiq adalah seorang muslim yang taat. la senantiasa ikhtiar dalam mencapai sesuatu yang diharapkan dan bertawakal kepada Allah Swt. Ketika dihadapkan dengan suatu musibah, Faiq menghadapinya dengan tabah dan sabar serta tidak menyesali akan nasib yang menimpanya. Perilaku Faruq merupakan ciri-ciri orang yang beriman kepada ...", pilihan: ["A. Hari kiamat.", "B. Kitab.", "C. Malaikat.", "D. Qadha dan Qadar."], kunci: "D"},
 {
    bagian: "Literasi Membaca", nomor: 1,
    teksJudul: "Teks 1: Aktivitas Fisik dan PTM",
    teks: "Menurut Kemenkes, aktivitas fisik merupakan setiap gerakan tubuh yang diakibatkan kerja otot rangka dan meningkatkan pengeluaran tenaga serta energi. Data menunjukkan kesadaran masyarakat Indonesia dalam mementingkan aktivitas fisik harian dinilai masih rendah. Kurangnya aktivitas fisik merupakan salah satu penyebab cukup tingginya PTM (penyakit tidak menular) di Indonesia.\n\nBerdasarkan data Riskesdas tahun 2013, tingginya PTM di Indonesia menjadi salah satu penyebab mayoritas kematian di Indonesia. Penyakit yang umum dialami oleh masyarakat Indonesia adalah diabetes, hipertensi, obesitas, stroke, penyakit jantung kronis, dan gagal ginjal. Pemerintah pun menemukan bahwa dari sekian jumlah penderita PTM di Indonesia, tidak lagi diisi oleh orang dengan usia yang sudah lanjut. Mulai banyak ditemukan penderita PTM dengan usia produktif 15–65 tahun, bahkan di usia muda, yaitu 0–15 tahun. Oleh karena itu, penting untuk mengimbau masyarakat agar rajin beraktivitas fisik guna menunjang kesehatan individu.\n\n(Sumber: kemkes.go.id)",
    soal: "Berikut yang TIDAK termasuk manfaat dari aktivitas fisik adalah ...",
    pilihan: ["A. Menurunkan risiko penyakit jantung kronis.", "B. Meningkatkan risiko terjangkit PTM.", "C. Mencegah penyakit tidak menular.", "D. Meningkatkan sistem kekebalan tubuh."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 2,
    teksJudul: "Teks 2: Kompetisi Robotik Madrasah (KRM)",
    teks: "Dirjen Pendidikan Islam M Nanda Abdullah berkomitmen untuk terus mengembangkan Kompetisi Robotik Madrasah (KRM). Hal ini disampaikan pria yang akrab disapa Nanda ini saat memberikan sambutan pada penutupan KRM 2021 di Banten, Minggu (17/10/2021). Ajang ini digelar dalam dua kategori, Rancang Bangun dan Robot Mobile, untuk jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA).\n\nMenurut M Nanda Abdullah, KRM dirancang untuk memberi wahana kepada anak-anak madrasah dalam hal kreativitas robotik. \"Kita meyakini bentuk pendidikan terbaik bagi putra-putri kita saat ini adalah madrasah. Dengan ini kita lengkapi mereka dengan ilmu kontemporer,\" katanya. Di masa depan, lanjut Abdullah, bangsa yang sukses adalah yang memiliki, menguasai, dan mengendalikan teknologi. \"Robotika adalah cabang sains yang akan memegang peran sentral di masa depan yang trennya mengandalkan teknologi digital dan automasi,\" tegasnya.\n\nKompetisi robotik ini ditutup oleh Sekretaris Jenderal Kementerian Agama Ali Nursyah. Dalam sambutannya, Nursyah mengapresiasi madrasah yang menunjukkan performa luar biasa dalam mengikuti tren kekinian, di samping belajar ilmu pengetahuan dan Agama. Teknologi robot kini telah mencakup artificial intelligence, machine learning, cyber security, dan internet of things.\n\n(Sumber: kemenag.go.id)",
    soal: "Pernyataan yang SALAH dari teks berita di atas adalah ...",
    pilihan: ["A. KRM digelar dengan dua kategori: Rancang Bangun dan Robot Mobile.", "B. KRM diikuti murid madrasah dari jenjang SD hingga SMA.", "C. Kemenag sudah memberikan media untuk anak-anak madrasah berkreasi dalam robotika.", "D. Teknologi robot penting dipelajari karena berguna di masa depan."], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 3,
    teksJudul: "Teks 2: Kompetisi Robotik Madrasah (KRM)",
    soal: "Makna istilah \"kontemporer\" pada teks di atas adalah ...",
    pilihan: ["A. Masa lalu", "B. Masa depan", "C. Masa kini", "D. Kuno"], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 4,
    teksJudul: "Teks 3: Pertemuan Bilateral Indonesia-Kolombia",
    teks: "Menteri Luar Negeri Indonesia Retno L.P. Marsudi menyelenggarakan pertemuan bilateral secara virtual dengan Menlu Kolombia, Claudia Blum De Barberí, pada Rabu (05/08/2020). Pertemuan tersebut diikuti dengan penandatanganan dua perjanjian. Perjanjian ini merupakan penandatanganan pertama yang dilakukan secara virtual oleh kedua negara.\n\n\"Kami membicarakan beberapa isu untuk semakin meningkatkan kerja sama bilateral, termasuk penandatanganan Persetujuan Pembebasan Visa bagi Pemegang Paspor Biasa dan Memorandum Saling Pengertian (MSP) tentang Konsultasi Politik antara Kementerian Luar Negeri kedua negara,\" tutur Menlu Retno.\n\nPertemuan virtual diselenggarakan dalam konteks peringatan 40 tahun hubungan diplomatik kedua negara pada 15 September 2020. Kolombia merupakan negara sahabat penting bagi Indonesia, yaitu sebagai partner perdagangan terbesar keenam di Amerika Selatan pada tahun 2019, juga partner investasi kedua terbesar di kawasan pada tahun yang sama.\n\n(Sumber: kemlu.go.id)",
    soal: "Istilah \"memorandum\" pada teks di atas memiliki makna ...",
    pilihan: ["A. Catatan berisi penjelasan", "B. Ketentuan tambahan", "C. Penyerahan persoalan yang diputuskan dengan pemungutan suara", "D. Surat pernyataan dalam hubungan diplomasi"], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 5,
    teksJudul: "Teks 3: Pertemuan Bilateral Indonesia-Kolombia",
    soal: "Pernyataan yang BENAR dari teks di atas adalah ...",
    pilihan: ["A. Kolombia adalah partner investasi keenam terbesar bagi Indonesia.", "B. Penandatanganan pada pertemuan ini pertama kalinya diselenggarakan secara virtual.", "C. Menlu Indonesia dan Menlu Kolombia bertemu secara tatap muka pada 5 Agustus 2020.", "D. Pertemuan bilateral diisi dengan penandatanganan satu perjanjian."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 6,
    teksJudul: "Teks 4: Kota Tua sebagai Kawasan Bahasa Negara",
    teks: "Kementerian Pendidikan dan Kebudayaan (Kemendikbud) mencanangkan Kota Tua sebagai kawasan praktik baik penggunaan bahasa negara di ruang publik pada Rabu (9/9/2020) di Museum Seni dan Keramik, Kota Tua. Pencanangan tersebut merupakan kerja sama antara Badan Pengembangan dan Pembinaan Bahasa Kemendikbud dengan Pemerintah Provinsi DKI Jakarta.\n\n\"Melalui kesempatan ini, dengan sukacita saya tetapkan Kota Tua Jakarta sebagai kawasan praktik baik pengutamaan bahasa negara di ruang publik,\" ucap Mendikbud Nadiem Makarim saat memberikan sambutan secara daring. Menurut Mendikbud, kegiatan ini merupakan contoh baik dari upaya gotong royong untuk menjaga dan merawat penggunaan bahasa Indonesia di masyarakat luas.\n\nKepala Badan Pengembangan dan Pembinaan Bahasa Kemendikbud Aminuddin Aziz mengungkap salah satu alasan dipilihnya Kota Tua sebagai kawasan penggunaan bahasa negara di ruang publik, yaitu karena adanya aspek historis. Kota Tua Jakarta dianggap menyimpan banyak rekaman sejarah penting bagi Jakarta dan Indonesia. Selain itu, aspek strategis Kota Tua Jakarta juga menjadi alasannya — kawasan ini memiliki potensi besar sebagai tempat wisata keluarga, wisata belanja, serta wisata sejarah. Tak hanya sebatas ikon situs sejarah dan rekreasi, Kota Tua juga dianggap sebagai wahana edukasi untuk masyarakat.\n\n(Sumber: kemdikbud.go.id)",
    soal: "Berikut termasuk pernyataan yang BENAR dari teks di atas, KECUALI ...",
    pilihan: ["A. Pencanangan Kota Tua merupakan hasil kerja sama Kemendikbud dengan Pemprov DKI Jakarta.", "B. Penggunaan bahasa Indonesia diperkuat dengan undang-undang dan peraturan presiden.", "C. Kawasan penggunaan bahasa negara dibuat untuk melestarikan bahasa-bahasa di dunia.", "D. Aspek historis, strategis, rekreasi, dan edukasi termasuk alasan dipilihnya Kota Tua."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 7,
    teksJudul: "Teks 4: Kota Tua sebagai Kawasan Bahasa Negara",
    soal: "Arti kata \"situs\" pada teks di atas adalah ...",
    pilihan: ["A. Daerah temuan benda-benda purbakala", "B. Daerah perlindungan untuk melestarikan tumbuhan dan binatang", "C. Program komputer yang menjalankan peladen untuk menyediakan akses laman", "D. Tempat sakral bagi masyarakat lokal"], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 8,
    teksJudul: "Teks 5: Korupsi di Indonesia",
    teks: "Korupsi bukan hal yang baru bagi bangsa Indonesia. Tanpa disadari, korupsi muncul dari kebiasaan yang dianggap lumrah dan wajar oleh masyarakat umum. Seperti memberi hadiah kepada pejabat, pegawai negeri, atau keluarganya sebagai imbal jasa sebuah pelayanan. Secara umum, tindak pidana ini tidak hanya mengakibatkan kerugian keuangan negara, tetapi juga dapat mengakibatkan dampak yang sangat luas, baik di bidang sosial, ekonomi, keamanan, politik, dan budaya. Korupsi juga merupakan tindak pidana yang dapat merusak nilai-nilai demokrasi dan moralitas suatu bangsa.\n\nSulitnya pemberantasan tindak pidana korupsi dikarenakan permasalahan korupsi bukan hanya terjadi di lingkungan birokrasi, tetapi juga pada sektor swasta, dunia usaha, dan lembaga-lembaga dalam masyarakat pada umumnya. Pemerintah menyadari bahwa usaha pemberantasan korupsi tidak semata-mata merupakan persoalan hukum, tetapi juga merupakan persoalan sosial, ekonomi dan politik. Oleh karena itu, upaya pemberantasannya pun harus bersifat komprehensif dan multidisipliner.\n\n(Sumber: dipb.kemenkeu.go.id)",
    soal: "Pernyataan berikut yang TIDAK termasuk alasan mengapa korupsi harus diberantas adalah ...",
    pilihan: ["A. Merugikan Indonesia secara ekonomi.", "B. Mencoreng nama baik Indonesia di dunia internasional.", "C. Menimbulkan ketidakpercayaan rakyat kepada pemerintah.", "D. Melestarikan dan mempertahankan jati diri bangsa."], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 9,
    teksJudul: "Teks 6: Zoom",
    teks: " Pada awal bulan Juni ini, Zoom mengatakan bahwa hanya pelanggan berbayar yang akan mendapatkan fitur keamanan enkripsi end-to-end. Namun, Zoom kini berubah pikiran. Melalui blog resminya, CEO Zoom, Eric S. Yuan mengatakan bahwa fitur keamanan tersebut juga akan diberikan kepada semua pengguna, termasuk pengguna Zoom gratis.\n\n Fitur keamanan ini akan mulai diuji untuk semua pengguna Zoom pada awal bulan Juli mendatang. Namun, perlu diingat, fitur keamanan enkripsi end-to-end harus diaktifkan secara manual oleh pengguna. Pengguna yang bertindak sebagai host dalam konferensi video akan dapat mengaktifkan atau menonaktifkan fitur keamanan tersebut pada setiap rapat yang telah dilakukan. Sebab, enkripsi end-to-end ini akan membatasi sejumlah fitur dan fungsI saat konferensi video berlangsung. \n\n (Sumber: kompas.com)",
    soal: " Makna enkripsi pada kalimat dalam teks pertama tersebut adalah ...",
    pilihan: ["A. Menutup data.", "B. Memperbarui data.", "C. Metode pengodean data agar tidak terbaca.", "D. Metode penghapusan data."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 10,
    teksJudul: "Teks 6: Zoom",
    soal: "Pernyataan yang sesuai dengan isi teks tersebut adalah ...",
    pilihan: ["A. Jika fitur enkripsi end-to-end sudah diaktifkan, tidak akan bisa dinonaktifkan kembali.", " B. Fitur keamanan enkripsi end-to-end akan diuji pada Juni mendatang.", " C. Pengguna perlu mengaktifkan fitur enkripsi end-to-end sendiri atau secara manual.", " D. Sejak awal, Zoom menyediakan fitur enkripsi end-to-end untuk semua pelanggannya."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 11,
    teksJudul: "Text 7: A Letter from Marshel",
    teks: "This is Marshel, I was working on a case involving a thief from Morocco in Germany (they stole the biggest jewelry from the richest man alive, Richie Rich). When I'm seeking the culprit, it leads me to a treasure in North Sumatra with a woman called \"Carmen\" as her codename. Attached to this letter, I assume, would be two plane tickets and two fake passports for you and Yatson. Do pack your bags and let's meet at \"Junkie Bar\" next to the abandoned cinema. Don't flash yourself or you'll cause some unnecessary trouble again.\n\nHave a lovely day,\nJuley.",
    soal: "What is the purpose of the text above?",
    pilihan: ["A. To remind Juley not to flash himself.", "B. To wish Juley a lovely day.", "C. To inform Juley of Marshel's recent work.", "D. To urge Juley and Yatson to meet Marshel."], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 12,
    teksJudul: "Text 7: A Letter from Marshel",
    soal: "The statements below are TRUE according to the text above, EXCEPT ...",
    pilihan: ["A. The thief was from Germany.", "B. Marshel is seeking for the culprit.", "C. Marshel and Juley are to meet next to an abandoned cinema.", "D. Attached to the letter are plane tickets and passports."], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 13,
    teksJudul: "Text 8: The Pot (Story of Birbal)",
    teks: "Once Emperor Akmal became very angry at his favorite minister Birbal. He asked Birbal to leave the kingdom and go away. Accepting the command of the Emperor, Birbal left the kingdom and started working in a farmer's farm in an unknown village far away under a different identity.\n\nAs months passed, Akmal started to miss Birbal. He was struggling to solve many issues in the empire without Birbal's advice. He regretted the decision, asking Birbal to leave the empire in anger. So Akmal sent his soldiers to find Birbal, but they failed to find him. Akmal finally found a trick. He sent a message to the head of every village to send a pot full of wit to the Emperor. If the pot full of wit could not be sent, fill the pot with diamonds and jewels.\n\nThis message also reached Birbal, who lived in one of the villages. Birbal took the pot and went back to the farm. He had planted watermelons on his farm. He selected a small watermelon and without cutting it from the plant, he put that in the pot. He started looking after it by providing water and fertilizer regularly. Within a few days, the watermelon grew into a pot so much that it was impossible to get it out of the pot. Birbal then cut the watermelon from the vine and sent a pot to Emperor Akmal with a message: \"Please remove the wit without cutting it from the pot and without breaking the pot.\"\n\nAkmal watched the watermelon in the pot and realized that this could only be Birbal's work. Akmal himself came to the village and took Birbal back with him.",
    soal: "Below are the steps Birbal took to accomplish the task of giving a pot full of wit to the Emperor, EXCEPT ...",
    pilihan: ["A. Birbal selected a watermelon to be placed in the pot.", "B. Birbal cut open the watermelon.", "C. Birbal provided water and fertilizer.", "D. Birbal sent the pot away."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 14,
    teksJudul: "Text 8: The Pot (Story of Birbal)",
    soal: "The conclusion from the story is ...",
    pilihan: ["A. Emperor Akmal and Birbal made peace.", "B. Birbal stayed at the Emperor's side for the rest of his life.", "C. Birbal lived happily ever after with the Emperor.", "D. Birbal regrets his decision of going away."], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 15,
    teksJudul: "Text 8: The Pot (Story of Birbal)",
    soal: "Which of the following is FALSE, according to the passage?",
    pilihan: ["A. Emperor Akmal knows Birbal very well.", "B. Birbal is easily trusted.", "C. Birbal is a trickster, posing as a watermelon as wit.", "D. Birbal went back to the Emperor's side."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 16,
    teksJudul: "Text 8: The Pot (Story of Birbal)",
    soal: "Everyone trusted Birbal and agreed to give him a chance. The word \"trusted\" CANNOT be replaced with ...",
    pilihan: ["A. Counted on", "B. Doubted", "C. Confided in", "D. Believed"], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 17,
    teksJudul: "Text 9: Library Announcement",
    teks: "ANNOUNCEMENT\n\nNotice to all students of Esan Cendana Seruni Islamic SHS who haven't returned the library's book, we are urged to return it before the last day of examination on December 15, 2020. For those who haven't returned the library's book until that specified deadline, we will apply the fines according to the applicable regulation. Thank you for your understanding and cooperation. Have a safe trip and happy new year!\n\nSigned,\nHead of Librarian of Esan Cendana Seruni Islamic SHS\nYunika Thesa",
    soal: "From the passage above, we can conclude that ...",
    pilihan: ["A. Wishing them a safe trip and happy new year.", "B. A warning for students who have not returned their book yet.", "C. Notifying students about the fines by the librarian.", "D. The announcement is made to remind students for returning schoolbooks."], kunci: "B"
  },  
  {
    bagian: "Literasi Membaca", nomor: 18,
    teksJudul: "Text 9: Library Announcement",
    soal: "According to the passage above, what will happen to students who fail to return the books before the specified deadline?",
    pilihan: ["A. The students are to replace the books", "B. The students will recerve a written reminder.", "C. The students will be given a fine.", "D. Nothing will happen. "], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 19,
    teksJudul: "Teks 10: Bread",
    teks: " You will need two slices of bread, your favorite jam, and a butter knife. First, ______your favorite jamn on the bread. ______, place another slice of bread on top.After that, cut the sandwich in half. Last, enjoy your delicious jam sandwich!",
    soal: "............., place another slice of bread on top. The blank can be filled with a few words, except ...",
    pilihan: ["A. Next.", "B. Then.", "C. After.", "D. Afterwards."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 20,
    teksJudul: "Teks 10: Bread",
    soal: "What is the purpose of the text above?",
    pilihan: ["A. To entertain the reader with a story about jam sandwich.", "B. To show the reader the procedure to make a jam sandwich.", "C. To announce the importance of making a jam sandwich.", "D. To inform the reader about a delicious sandwich."], kunci: "B"
  },  
];

const BAGIAN_LIST_TPB = ["Kemampuan Verbal", "Kemampuan Numerik", "Penalaran Logis", "Kepribadian & Minat Bakat", "Minat Bakat"];
const BAGIAN_LIST_TPA = ["Penalaran Matematika", "Literasi Keislaman", "Literasi Membaca"];

const WARNA_BAGIAN = {
  "Kemampuan Verbal":        { bg: "#e8f4fd", accent: "#2980b9", light: "#d0e8f8" },
  "Kemampuan Numerik":       { bg: "#fef9e7", accent: "#d4a017", light: "#fdedc8" },
  "Penalaran Logis":         { bg: "#f3e5f5", accent: "#8e44ad", light: "#e1bee7" },
  "Kepribadian & Minat Bakat": { bg: "#e8f5e9", accent: "#27ae60", light: "#c8f0d8" },
  "Penalaran Matematika":    { bg: "#e8f4fd", accent: "#2980b9", light: "#d0e8f8" },
  "Literasi Keislaman":      { bg: "#eafaf1", accent: "#27ae60", light: "#c8f0d8" },
  "Literasi Membaca":        { bg: "#fef9e7", accent: "#d4a017", light: "#fdedc8" },
};

const GOOGLE_SCRIPT_URL_TPB =
  "https://script.google.com/macros/s/AKfycby4KKeDZzJAAqNaVuSHjU1PS6e6z-RmezRJwDpSNxbxKykR5k4R02M52MJJRDzsSbdbiw/exec";
const GOOGLE_SCRIPT_URL_TPA =
  "https://script.google.com/macros/s/AKfycby4KKeDZzJAAqNaVuSHjU1PS6e6z-RmezRJwDpSNxbxKykR5k4R02M52MJJRDzsSbdbiw/exec";
const GOOGLE_SCRIPT_URL_PSIKOLOGIS =
  "https://script.google.com/macros/s/AKfycby4KKeDZzJAAqNaVuSHjU1PS6e6z-RmezRJwDpSNxbxKykR5k4R02M52MJJRDzsSbdbiw/exec";

function formatWaktu(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Bagian yang tidak dihitung benar/salah
const BAGIAN_TANPA_KUNCI = ["Minat Bakat"]; // Kepribadian sudah dinilai berdasarkan kunci

function hitungSkor(soalList, jawabanObj) {
  // Hitung total (exclude bagian tanpa kunci)
  const soalDinilai = soalList.filter((s) => !BAGIAN_TANPA_KUNCI.includes(s.bagian));
  let benar = 0;
  soalDinilai.forEach((s, _) => {
    const gi = soalList.indexOf(s);
    if (jawabanObj[gi] === s.kunci) benar++;
  });
  return {
    benar,
    total: soalDinilai.length,
    persen: soalDinilai.length > 0 ? Math.round((benar / soalDinilai.length) * 100) : 0,
  };
}

function hitungSkorPerBagian(soalList, jawabanObj) {
  const bagianMap = {};
  soalList.forEach((s, i) => {
    if (!bagianMap[s.bagian]) bagianMap[s.bagian] = { soal: [], idx: [] };
    bagianMap[s.bagian].soal.push(s);
    bagianMap[s.bagian].idx.push(i);
  });
  const result = {};
  Object.entries(bagianMap).forEach(([bagian, data]) => {
    if (BAGIAN_TANPA_KUNCI.includes(bagian)) {
      const dijawab = data.idx.filter((i) => jawabanObj[i] !== undefined).length;
      result[bagian] = { benar: "-", total: data.soal.length, dijawab, persen: "-", catatan: "Tidak dinilai" };
    } else {
      let benar = 0;
      data.idx.forEach((i, j) => { if (jawabanObj[i] === data.soal[j].kunci) benar++; });
      result[bagian] = { benar, total: data.soal.length, persen: Math.round((benar / data.soal.length) * 100) };
    }
  });
  return result;
}


// ══════════════════════════════════════════════════════════════════════
// PAKET PSIKOLOGIS — DATA SOAL & KONSTANTA
// Big Five (60 butir) + Holland RIASEC (40 butir) + Gaya Belajar VAK (30 butir)
// ══════════════════════════════════════════════════════════════════════

// ─── BIG FIVE (60 butir) ──────────────────────────────────────────────
// Dimensi: O=Openness, C=Conscientiousness, E=Extraversion, A=Agreeableness, N=Neuroticism
// (R) = reverse-scored
const SOAL_BIG_FIVE = [
  // OPENNESS (12 butir)
  { no: 1,  dimensi: "O", reverse: false, pernyataan: "Saya memiliki rasa ingin tahu yang besar terhadap berbagai hal baru." },
  { no: 2,  dimensi: "O", reverse: false, pernyataan: "Saya menikmati mempelajari topik-topik yang tidak biasa dan jarang dibahas." },
  { no: 3,  dimensi: "O", reverse: false, pernyataan: "Saya suka bereksperimen dengan cara-cara baru dalam menyelesaikan masalah." },
  { no: 4,  dimensi: "O", reverse: false, pernyataan: "Saya tertarik dengan seni, sastra, atau musik sebagai bentuk ekspresi diri." },
  { no: 5,  dimensi: "O", reverse: false, pernyataan: "Saya mudah membayangkan situasi yang belum pernah saya alami sendiri." },
  { no: 6,  dimensi: "O", reverse: false, pernyataan: "Saya senang mendiskusikan ide-ide abstrak dan filosofis." },
  { no: 7,  dimensi: "O", reverse: true,  pernyataan: "Saya lebih suka rutinitas yang sudah pasti daripada situasi yang terus berubah." },
  { no: 8,  dimensi: "O", reverse: true,  pernyataan: "Saya merasa topik sains dan matematika lebih menarik daripada seni atau humaniora." },
  { no: 9,  dimensi: "O", reverse: true,  pernyataan: "Saya cenderung memilih jalan yang sudah terbukti berhasil daripada mencoba yang baru." },
  { no: 10, dimensi: "O", reverse: false, pernyataan: "Saya sering merenungi makna di balik pengalaman-pengalaman hidup saya." },
  { no: 11, dimensi: "O", reverse: false, pernyataan: "Saya menikmati mengunjungi museum, pameran, atau tempat bersejarah." },
  { no: 12, dimensi: "O", reverse: true,  pernyataan: "Saya merasa sulit untuk menikmati puisi atau karya sastra yang bersifat metaforikal." },
  // CONSCIENTIOUSNESS (12 butir)
  { no: 13, dimensi: "C", reverse: false, pernyataan: "Saya selalu menyelesaikan tugas tepat sebelum atau sesuai tenggat waktu." },
  { no: 14, dimensi: "C", reverse: false, pernyataan: "Saya membuat jadwal dan rencana sebelum memulai pekerjaan besar." },
  { no: 15, dimensi: "C", reverse: false, pernyataan: "Saya menjaga kamar atau meja belajar saya tetap rapi dan terorganisir." },
  { no: 16, dimensi: "C", reverse: false, pernyataan: "Saya bekerja keras bahkan untuk tugas-tugas yang tidak terlalu saya sukai." },
  { no: 17, dimensi: "C", reverse: false, pernyataan: "Saya memperhatikan detail dan berusaha menghindari kesalahan kecil." },
  { no: 18, dimensi: "C", reverse: false, pernyataan: "Saya selalu menepati janji yang sudah saya buat kepada orang lain." },
  { no: 19, dimensi: "C", reverse: true,  pernyataan: "Saya sering menunda pekerjaan hingga menit-menit terakhir." },
  { no: 20, dimensi: "C", reverse: true,  pernyataan: "Saya mudah terganggu dan kehilangan fokus saat belajar." },
  { no: 21, dimensi: "C", reverse: true,  pernyataan: "Saya sering melewatkan langkah-langkah penting karena terburu-buru." },
  { no: 22, dimensi: "C", reverse: false, pernyataan: "Saya memeriksa ulang pekerjaan saya sebelum mengumpulkannya." },
  { no: 23, dimensi: "C", reverse: false, pernyataan: "Saya merasa tidak nyaman jika ada rencana yang berubah mendadak." },
  { no: 24, dimensi: "C", reverse: true,  pernyataan: "Saya cenderung impulsif dalam mengambil keputusan tanpa banyak pertimbangan." },
  // EXTRAVERSION (12 butir)
  { no: 25, dimensi: "E", reverse: false, pernyataan: "Saya merasa berenergi setelah berkumpul bersama banyak orang." },
  { no: 26, dimensi: "E", reverse: false, pernyataan: "Saya mudah memulai percakapan dengan orang yang baru saya kenal." },
  { no: 27, dimensi: "E", reverse: false, pernyataan: "Saya suka menjadi pusat perhatian dalam suatu kelompok." },
  { no: 28, dimensi: "E", reverse: false, pernyataan: "Saya aktif berbicara dalam diskusi kelas atau kelompok belajar." },
  { no: 29, dimensi: "E", reverse: false, pernyataan: "Saya memiliki banyak teman dan jaringan sosial yang luas." },
  { no: 30, dimensi: "E", reverse: false, pernyataan: "Saya menikmati kegiatan sosial seperti acara, pesta, atau pertemuan kelompok." },
  { no: 31, dimensi: "E", reverse: true,  pernyataan: "Saya lebih suka bekerja sendiri daripada dalam kelompok." },
  { no: 32, dimensi: "E", reverse: true,  pernyataan: "Saya merasa lelah secara sosial setelah banyak berinteraksi dengan orang lain." },
  { no: 33, dimensi: "E", reverse: true,  pernyataan: "Saya cenderung pemalu ketika bertemu orang baru." },
  { no: 34, dimensi: "E", reverse: false, pernyataan: "Saya pandai membangkitkan semangat orang lain di sekitar saya." },
  { no: 35, dimensi: "E", reverse: false, pernyataan: "Saya sering mengambil inisiatif dalam kegiatan kelompok." },
  { no: 36, dimensi: "E", reverse: true,  pernyataan: "Saya merasa lebih nyaman sendirian daripada bersama banyak orang." },
  // AGREEABLENESS (12 butir)
  { no: 37, dimensi: "A", reverse: false, pernyataan: "Saya peduli dengan perasaan orang lain dan berusaha tidak menyakiti hati mereka." },
  { no: 38, dimensi: "A", reverse: false, pernyataan: "Saya mudah berempati dengan kesulitan yang dialami orang lain." },
  { no: 39, dimensi: "A", reverse: false, pernyataan: "Saya senang membantu teman yang sedang mengalami kesulitan." },
  { no: 40, dimensi: "A", reverse: false, pernyataan: "Saya berusaha menghindari konflik dan mencari jalan damai." },
  { no: 41, dimensi: "A", reverse: false, pernyataan: "Saya percaya bahwa orang lain pada dasarnya memiliki niat baik." },
  { no: 42, dimensi: "A", reverse: false, pernyataan: "Saya mudah memaafkan orang yang pernah menyakiti saya." },
  { no: 43, dimensi: "A", reverse: true,  pernyataan: "Saya sering bersikap kritis dan meragukan niat orang lain." },
  { no: 44, dimensi: "A", reverse: true,  pernyataan: "Saya terkadang memanfaatkan situasi untuk keuntungan pribadi saya." },
  { no: 45, dimensi: "A", reverse: true,  pernyataan: "Saya merasa bahwa bersikap tegas dan keras lebih efektif daripada bersikap lembut." },
  { no: 46, dimensi: "A", reverse: false, pernyataan: "Saya bersikap sopan dan hormat kepada semua orang, termasuk orang yang baru saya kenal." },
  { no: 47, dimensi: "A", reverse: false, pernyataan: "Saya lebih suka bekerja sama daripada bersaing dengan orang lain." },
  { no: 48, dimensi: "A", reverse: true,  pernyataan: "Saya tidak segan mengungkapkan ketidaksetujuan saya secara langsung meski menyinggung orang lain." },
  // NEUROTICISM (12 butir)
  { no: 49, dimensi: "N", reverse: false, pernyataan: "Saya mudah merasa cemas atau khawatir tentang hal-hal yang akan datang." },
  { no: 50, dimensi: "N", reverse: false, pernyataan: "Suasana hati saya berubah-ubah dengan cepat tanpa sebab yang jelas." },
  { no: 51, dimensi: "N", reverse: false, pernyataan: "Saya sering merasa tertekan atau stres saat menghadapi banyak tugas." },
  { no: 52, dimensi: "N", reverse: false, pernyataan: "Saya mudah merasa sedih atau putus asa ketika mengalami kegagalan." },
  { no: 53, dimensi: "N", reverse: false, pernyataan: "Saya sering overthinking tentang hal-hal yang mungkin tidak terjadi." },
  { no: 54, dimensi: "N", reverse: false, pernyataan: "Saya mudah tersinggung jika dikritik meskipun kritikan itu membangun." },
  { no: 55, dimensi: "N", reverse: true,  pernyataan: "Saya tetap tenang dan stabil dalam situasi yang penuh tekanan." },
  { no: 56, dimensi: "N", reverse: true,  pernyataan: "Saya jarang merasa cemas atau gelisah tanpa alasan yang jelas." },
  { no: 57, dimensi: "N", reverse: true,  pernyataan: "Saya dapat mengelola emosi saya dengan baik dalam situasi sulit." },
  { no: 58, dimensi: "N", reverse: false, pernyataan: "Saya sering merasa tidak percaya diri dengan kemampuan yang saya miliki." },
  { no: 59, dimensi: "N", reverse: false, pernyataan: "Saya mudah panik ketika sesuatu tidak berjalan sesuai rencana." },
  { no: 60, dimensi: "N", reverse: true,  pernyataan: "Saya tidak mudah terganggu oleh masalah kecil sehari-hari." },
];

// ─── HOLLAND RIASEC (40 butir) ────────────────────────────────────────
// R=Realistis, I=Investigatif, A=Artistik, S=Sosial, E=Enterprising, C=Konvensional
const SOAL_HOLLAND = [
  { no: 1,  tipe: "R", pernyataan: "Saya senang memperbaiki atau merakit benda-benda teknis (elektronik, mesin, dll.)." },
  { no: 2,  tipe: "I", pernyataan: "Saya suka menganalisis data dan mencari pola di balik informasi yang kompleks." },
  { no: 3,  tipe: "A", pernyataan: "Saya menikmati membuat karya seni seperti gambar, musik, puisi, atau desain." },
  { no: 4,  tipe: "S", pernyataan: "Saya senang mengajar, membimbing, atau membantu orang lain memahami sesuatu." },
  { no: 5,  tipe: "E", pernyataan: "Saya suka memimpin kelompok dan meyakinkan orang lain untuk mengikuti ide saya." },
  { no: 6,  tipe: "C", pernyataan: "Saya merasa nyaman bekerja dengan data, angka, atau dokumen yang terstruktur." },
  { no: 7,  tipe: "R", pernyataan: "Saya lebih suka bekerja dengan tangan dan menghasilkan produk fisik yang nyata." },
  { no: 8,  tipe: "I", pernyataan: "Saya tertarik mempelajari fenomena alam dan mencari penjelasan ilmiahnya." },
  { no: 9,  tipe: "A", pernyataan: "Saya suka berimprovisasi dan menciptakan sesuatu yang belum pernah ada sebelumnya." },
  { no: 10, tipe: "S", pernyataan: "Saya mudah berempati dan memberikan dukungan emosional kepada orang yang membutuhkan." },
  { no: 11, tipe: "E", pernyataan: "Saya termotivasi oleh kompetisi dan ingin selalu menjadi yang terbaik." },
  { no: 12, tipe: "C", pernyataan: "Saya menyukai pekerjaan yang memiliki prosedur jelas dan hasil yang bisa diukur." },
  { no: 13, tipe: "R", pernyataan: "Saya tertarik dengan konstruksi, pertanian, atau pekerjaan yang berkaitan dengan alam." },
  { no: 14, tipe: "I", pernyataan: "Saya suka melakukan penelitian mandiri untuk menjawab pertanyaan yang saya penasarkan." },
  { no: 15, tipe: "A", pernyataan: "Saya lebih suka lingkungan kerja yang fleksibel dan tidak terlalu banyak aturan." },
  { no: 16, tipe: "S", pernyataan: "Saya tertarik pada pekerjaan di bidang kesehatan, konseling, atau pendidikan." },
  { no: 17, tipe: "E", pernyataan: "Saya pandai bernegosiasi dan menemukan kesepakatan yang menguntungkan." },
  { no: 18, tipe: "C", pernyataan: "Saya teliti dalam mengelola jadwal, keuangan, atau catatan yang terperinci." },
  { no: 19, tipe: "R", pernyataan: "Saya senang beraktivitas di luar ruangan daripada duduk di belakang meja." },
  { no: 20, tipe: "I", pernyataan: "Saya gemar membaca jurnal, artikel ilmiah, atau buku pengetahuan mendalam." },
  { no: 21, tipe: "A", pernyataan: "Saya mengekspresikan diri lebih mudah melalui tulisan atau visual daripada lisan." },
  { no: 22, tipe: "S", pernyataan: "Saya aktif dalam kegiatan sosial atau organisasi kemasyarakatan." },
  { no: 23, tipe: "E", pernyataan: "Saya bercita-cita menjadi pemimpin perusahaan, organisasi, atau komunitas." },
  { no: 24, tipe: "C", pernyataan: "Saya lebih suka mengikuti sistem yang sudah ada daripada membuat sistem baru." },
  { no: 25, tipe: "R", pernyataan: "Saya menyukai pelajaran teknik, fisika terapan, atau praktik laboratorium." },
  { no: 26, tipe: "I", pernyataan: "Saya suka memecahkan soal matematika atau logika yang menantang." },
  { no: 27, tipe: "A", pernyataan: "Saya tertarik pada arsitektur, desain interior, atau dunia mode/fashion." },
  { no: 28, tipe: "S", pernyataan: "Saya dengan sabar mendengarkan masalah orang lain tanpa menghakimi." },
  { no: 29, tipe: "E", pernyataan: "Saya tertarik pada bidang bisnis, wirausaha, hukum, atau politik." },
  { no: 30, tipe: "C", pernyataan: "Saya suka pekerjaan administrasi, akuntansi, atau pengarsipan yang sistematis." },
  { no: 31, tipe: "R", pernyataan: "Saya tertarik pada robotika, elektronika, atau teknologi mekanik." },
  { no: 32, tipe: "I", pernyataan: "Saya tidak puas hanya menerima informasi — saya ingin tahu alasan di baliknya." },
  { no: 33, tipe: "A", pernyataan: "Saya merasa paling hidup saat berkreasi secara bebas tanpa batasan." },
  { no: 34, tipe: "S", pernyataan: "Saya percaya bahwa keberhasilan orang lain adalah juga keberhasilan saya." },
  { no: 35, tipe: "E", pernyataan: "Saya berani mengambil risiko untuk mencapai tujuan yang lebih besar." },
  { no: 36, tipe: "C", pernyataan: "Saya merasa nyaman mengerjakan tugas berulang yang membutuhkan akurasi tinggi." },
  { no: 37, tipe: "R", pernyataan: "Saya lebih nyaman dengan solusi praktis daripada teori yang abstrak." },
  { no: 38, tipe: "I", pernyataan: "Saya menikmati berdebat secara intelektual tentang isu-isu kompleks." },
  { no: 39, tipe: "A", pernyataan: "Saya terinspirasi oleh karya-karya inovatif yang menantang cara pandang umum." },
  { no: 40, tipe: "S", pernyataan: "Saya ingin pekerjaan yang memberikan dampak nyata bagi masyarakat sekitar." },
];

// ─── GAYA BELAJAR VAK (30 butir) ─────────────────────────────────────
// V=Visual, A=Auditori, K=Kinestetik
const SOAL_VAK = [
  { no: 1,  tipe: "V", pernyataan: "Saya lebih mudah memahami pelajaran jika ada diagram, peta pikiran, atau grafik." },
  { no: 2,  tipe: "A", pernyataan: "Saya lebih mudah mengingat informasi setelah mendengar penjelasan lisan dari guru." },
  { no: 3,  tipe: "K", pernyataan: "Saya belajar paling efektif ketika langsung mencoba atau mempraktikkan sendiri." },
  { no: 4,  tipe: "V", pernyataan: "Saya suka mencatat pelajaran dengan warna-warna berbeda agar lebih mudah diingat." },
  { no: 5,  tipe: "A", pernyataan: "Saya lebih suka mendengarkan rekaman/podcast daripada membaca buku teks." },
  { no: 6,  tipe: "K", pernyataan: "Saya sering gelisah dan sulit duduk diam dalam waktu yang lama saat belajar." },
  { no: 7,  tipe: "V", pernyataan: "Saya mengingat wajah orang lebih mudah daripada mengingat nama mereka." },
  { no: 8,  tipe: "A", pernyataan: "Saya sering mengulang materi dengan cara membacanya keras-keras kepada diri sendiri." },
  { no: 9,  tipe: "K", pernyataan: "Saya lebih menyukai praktikum atau demonstrasi langsung daripada teori di kelas." },
  { no: 10, tipe: "V", pernyataan: "Saya mudah terganggu belajar jika lingkungan sekitar berantakan atau tidak rapi." },
  { no: 11, tipe: "A", pernyataan: "Saya menyukai diskusi kelompok karena mendengar pendapat orang lain membantu pemahaman." },
  { no: 12, tipe: "K", pernyataan: "Saya belajar lebih baik sambil bergerak, misalnya berjalan-jalan atau mengetuk-ngetuk." },
  { no: 13, tipe: "V", pernyataan: "Saya mengandalkan catatan tertulis atau flashcard bergambar saat mengulang pelajaran." },
  { no: 14, tipe: "A", pernyataan: "Saya mudah terganggu oleh kebisingan di sekitar saat mencoba berkonsentrasi." },
  { no: 15, tipe: "K", pernyataan: "Saya lebih mengingat sesuatu yang pernah saya lakukan sendiri daripada yang hanya saya baca." },
  { no: 16, tipe: "V", pernyataan: "Saya sering membayangkan gambaran visual dalam pikiran saat membaca deskripsi tertulis." },
  { no: 17, tipe: "A", pernyataan: "Saya lebih suka menjelaskan pelajaran kepada orang lain dengan bercerita secara lisan." },
  { no: 18, tipe: "K", pernyataan: "Saya mudah bosan jika pelajaran hanya dilakukan dengan metode ceramah satu arah." },
  { no: 19, tipe: "V", pernyataan: "Saya lebih mudah memahami instruksi jika disertai gambar atau contoh tertulis." },
  { no: 20, tipe: "A", pernyataan: "Saya suka menghafal dengan membuat lagu atau ritme dari materi yang dipelajari." },
  { no: 21, tipe: "K", pernyataan: "Saya senang menggunakan alat peraga, benda nyata, atau simulasi dalam belajar." },
  { no: 22, tipe: "V", pernyataan: "Saya lebih mudah mengingat tampilan halaman buku daripada isi percakapannya." },
  { no: 23, tipe: "A", pernyataan: "Saya sering berbicara kepada diri sendiri saat berpikir atau memecahkan masalah." },
  { no: 24, tipe: "K", pernyataan: "Saya lebih suka menulis tangan daripada mengetik karena terasa lebih 'terasa'." },
  { no: 25, tipe: "V", pernyataan: "Saya lebih suka presentasi dengan banyak slide visual daripada hanya penjelasan lisan." },
  { no: 26, tipe: "A", pernyataan: "Saya bisa mengingat lirik lagu atau percakapan dengan sangat baik." },
  { no: 27, tipe: "K", pernyataan: "Saya suka belajar melalui permainan peran (role-play) atau simulasi interaktif." },
  { no: 28, tipe: "V", pernyataan: "Saya menggambar mind-map atau skema untuk membantu memahami hubungan antar konsep." },
  { no: 29, tipe: "A", pernyataan: "Saya lebih suka belajar lewat ceramah atau kuliah audio daripada membaca mandiri." },
  { no: 30, tipe: "K", pernyataan: "Saya merasa pengalaman lapangan atau studi wisata lebih berkesan daripada belajar di kelas." },
];

// ─── Skala Likert ─────────────────────────────────────────────────────
const PILIHAN_LIKERT = [
  { nilai: 1, singkat: "STS", label: "Sangat Tidak Setuju" },
  { nilai: 2, singkat: "TS",  label: "Tidak Setuju" },
  { nilai: 3, singkat: "N",   label: "Netral" },
  { nilai: 4, singkat: "S",   label: "Setuju" },
  { nilai: 5, singkat: "SS",  label: "Sangat Setuju" },
];

const BAGIAN_LIST_PSIKOLOGIS = ["Big Five Kepribadian", "Minat & Bakat (Holland)", "Gaya Belajar (VAK)"];

const WARNA_PSIKOLOGIS = {
  "Big Five Kepribadian":    { bg: "#f3e5f5", accent: "#7b1fa2", light: "#e1bee7" },
  "Minat & Bakat (Holland)": { bg: "#e3f2fd", accent: "#1565c0", light: "#bbdefb" },
  "Gaya Belajar (VAK)":      { bg: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9" },
};

// ─── Kalkulasi Psikologis ─────────────────────────────────────────────
function hitungBigFive(jwb) {
  const dim = { O: [], C: [], E: [], A: [], N: [] };
  SOAL_BIG_FIVE.forEach((s, i) => {
    const raw = jwb[`bf_${i}`];
    if (raw === undefined) return;
    dim[s.dimensi].push(s.reverse ? 6 - raw : raw);
  });
  const hasil = {};
  Object.entries(dim).forEach(([d, vals]) => {
    hasil[d] = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : "0.00";
  });
  return hasil;
}

function hitungHolland(jwb) {
  const sums = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const cnt  = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  SOAL_HOLLAND.forEach((s, i) => {
    const raw = jwb[`hl_${i}`];
    if (raw === undefined) return;
    sums[s.tipe] += raw; cnt[s.tipe]++;
  });
  const hasil = {};
  Object.keys(sums).forEach(t => { hasil[t] = cnt[t] > 0 ? (sums[t] / cnt[t]).toFixed(2) : "0.00"; });
  return hasil;
}

function hitungVAK(jwb) {
  const sums = { V: 0, A: 0, K: 0 };
  const cnt  = { V: 0, A: 0, K: 0 };
  SOAL_VAK.forEach((s, i) => {
    const raw = jwb[`vak_${i}`];
    if (raw === undefined) return;
    sums[s.tipe] += raw; cnt[s.tipe]++;
  });
  return {
    V: cnt.V > 0 ? (sums.V / cnt.V).toFixed(2) : "0.00",
    A: cnt.A > 0 ? (sums.A / cnt.A).toFixed(2) : "0.00",
    K: cnt.K > 0 ? (sums.K / cnt.K).toFixed(2) : "0.00",
  };
}

function pemetaanJurusan(bf, hl) {
  const ipaScore   = (parseFloat(hl.I) || 0) + (parseFloat(hl.R) || 0);
  const ipsScore   = (parseFloat(hl.S) || 0) + (parseFloat(hl.E) || 0) + (parseFloat(hl.C) || 0);
  const agamaScore = (parseFloat(hl.S) || 0) * 1.2 + (parseFloat(bf.A) || 0) * 0.8;
  const topHL = Object.entries(hl).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1])).slice(0, 2).map(([k]) => k);
  if (ipaScore >= ipsScore && ipaScore >= agamaScore)
    return { jurusan: "IPA",        kode: topHL.join("-"), konfiden: ipaScore > 4 ? "Sangat Disarankan" : "Disarankan" };
  if (agamaScore > ipaScore && agamaScore >= ipsScore)
    return { jurusan: "Keagamaan",  kode: topHL.join("-"), konfiden: agamaScore > 4 ? "Sangat Disarankan" : "Disarankan" };
  return { jurusan: "IPS",          kode: topHL.join("-"), konfiden: ipsScore > 4 ? "Sangat Disarankan" : "Disarankan" };
}

function dominanVAK(vak) {
  return Object.entries(vak).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))[0]?.[0] || "V";
}


// ══════════════════════════════════════════════════════════════════════
// KOMPONEN UTAMA — UjianOnline (Sesi 1 TPB + Sesi 2 TPA + Sesi 3 Psikologis)
// ══════════════════════════════════════════════════════════════════════
export default function UjianOnline() {
  // tahap: "identitas" | "pengerjaan" | "skorSesi1" | "pengerjaanSesi2"
  //        | "skorSesi2" | "pengerjaanSesi3" | "selesaiSemua" | "sudahSubmit"
  const [tahap, setTahap] = useState("identitas");
  const [sesiAktif, setSesiAktif] = useState(1);
  const [identitas, setIdentitas] = useState({ nama: "", noPeserta: "", nis: "", asalSekolah: "" });
  const [jawabanSesi1, setJawabanSesi1] = useState({});
  const [jawabanSesi2, setJawabanSesi2] = useState({});
  const [jawabanSesi3, setJawabanSesi3] = useState({});
  const [waktu, setWaktu] = useState(DURATION_SESI);
  const [bagianAktif, setBagianAktif] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [pelanggaran, setPelanggaran] = useState(0);
  const [showPeringatan, setShowPeringatan] = useState(false);
  const [pesanPeringatan, setPesanPeringatan] = useState("");
  const [didiskualifikasi, setDidiskualifikasi] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Deteksi iOS — Safari tidak support fullscreen API
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const fullscreenDidukung = !isIOS && !!document.documentElement.requestFullscreen;

  const timerRef = useRef(null);
  const soalTopRef = useRef(null);
  const submitDoneRef = useRef(false);
  const pelanggaranRef = useRef(0);
  const jawabanSesi1Ref = useRef({});
  const jawabanSesi2Ref = useRef({});
  const jawabanSesi3Ref = useRef({});
  const waktuRef = useRef(DURATION_SESI);
  const identitasRef = useRef(identitas);
  const tahapRef = useRef(tahap);

  useEffect(() => { jawabanSesi1Ref.current = jawabanSesi1; }, [jawabanSesi1]);
  useEffect(() => { jawabanSesi2Ref.current = jawabanSesi2; }, [jawabanSesi2]);
  useEffect(() => { jawabanSesi3Ref.current = jawabanSesi3; }, [jawabanSesi3]);
  useEffect(() => { waktuRef.current = waktu; }, [waktu]);
  useEffect(() => { identitasRef.current = identitas; }, [identitas]);
  useEffect(() => { tahapRef.current = tahap; }, [tahap]);

  // ── Retry helper dengan jitter (anti-overload 300 user serentak) ──
  const kirimDenganRetry = async (url, payload, maxRetry = 6) => {
    // Jitter acak 0–10 detik agar 300 submit tidak menumpuk di saat bersamaan
    const jitter = Math.floor(Math.random() * 10000);
    await new Promise(r => setTimeout(r, jitter));

    for (let i = 0; i < maxRetry; i++) {
      try {
        await fetch(url, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return;
      } catch (_) {
        if (i < maxRetry - 1) {
          // Exponential backoff + jitter tambahan per retry
          const delay = (1000 * (i + 1)) + Math.floor(Math.random() * 3000);
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
  };

  // ── Kirim Sesi 1 (TPB) ──
  const kirimSesi1 = useCallback(async (alasan = "Normal") => {
    if (submitDoneRef.current) return;
    submitDoneRef.current = true;
    clearInterval(timerRef.current);
    setLoading(true);
    const skor = hitungSkor(SOAL_TPB, jawabanSesi1Ref.current);
    const skorBagian = hitungSkorPerBagian(SOAL_TPB, jawabanSesi1Ref.current);
    const id = identitasRef.current;
    const payload = {
      sesi: "TPB - Tes Potensi Belajar",
      nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
      waktuSelesai: new Date().toLocaleString("id-ID"),
      sisaWaktu: formatWaktu(waktuRef.current),
      skorBenar: skor.benar, skorTotal: skor.total, persenSkor: skor.persen,
      verbal_benar: skorBagian["Kemampuan Verbal"]?.benar ?? "-",
      verbal_total: skorBagian["Kemampuan Verbal"]?.total ?? 0,
      verbal_persen: skorBagian["Kemampuan Verbal"]?.persen ?? "-",
      numerik_benar: skorBagian["Kemampuan Numerik"]?.benar ?? "-",
      numerik_total: skorBagian["Kemampuan Numerik"]?.total ?? 0,
      numerik_persen: skorBagian["Kemampuan Numerik"]?.persen ?? "-",
      logis_benar: skorBagian["Penalaran Logis"]?.benar ?? "-",
      logis_total: skorBagian["Penalaran Logis"]?.total ?? 0,
      logis_persen: skorBagian["Penalaran Logis"]?.persen ?? "-",
      kepribadian_benar: skorBagian["Kepribadian & Minat Bakat"]?.benar ?? 0,
      kepribadian_total: skorBagian["Kepribadian & Minat Bakat"]?.total ?? 0,
      kepribadian_persen: skorBagian["Kepribadian & Minat Bakat"]?.persen ?? 0,
      kepribadian_dijawab: skorBagian["Kepribadian & Minat Bakat"]?.total ?? 0,
      kepribadian_jawaban: SOAL_TPB.filter(s => s.bagian === "Kepribadian & Minat Bakat")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      minat_dijawab: skorBagian["Minat Bakat"]?.dijawab ?? 0,
      minat_total: skorBagian["Minat Bakat"]?.total ?? 0,
      minat_jawaban: SOAL_TPB.filter(s => s.bagian === "Minat Bakat")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      jawaban_verbal: SOAL_TPB.filter(s => s.bagian === "Kemampuan Verbal")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      jawaban_numerik: SOAL_TPB.filter(s => s.bagian === "Kemampuan Numerik")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      jawaban_logis: SOAL_TPB.filter(s => s.bagian === "Penalaran Logis")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      semua_jawaban: SOAL_TPB.map((s, i) => jawabanSesi1Ref.current[i] || "-").join("|"),
      keterangan: alasan,
    };
    try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_TPB, payload); } catch (_) {}
    if (alasan.toLowerCase().includes("diskualifikasi")) {
      const payloadTPAKosong = {
        sesi: "TPA - Tes Potensi Akademik",
        nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
        waktuSelesai: new Date().toLocaleString("id-ID"), sisaWaktu: "-",
        skorBenar: 0, skorTotal: SOAL_TPA.length, persenSkor: 0,
        matika_benar: 0, matika_total: 0, matika_persen: 0,
        keislaman_benar: 0, keislaman_total: 0, keislaman_persen: 0,
        membaca_benar: 0, membaca_total: 0, membaca_persen: 0,
        jumlahPelanggaran: pelanggaranRef.current,
        jawaban: SOAL_TPA.map(() => "-").join("|"),
        keterangan: "TIDAK MENGIKUTI — " + alasan,
      };
      try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_TPA, payloadTPAKosong); } catch (_) {}
      // Kirim sesi 3 kosong juga
      const payloadPsikologisKosong = {
        sesi: "Psikologis",
        nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
        waktuSelesai: new Date().toLocaleString("id-ID"), sisaWaktu: "-",
        bf_O: 0, bf_C: 0, bf_E: 0, bf_A: 0, bf_N: 0,
        hl_R: 0, hl_I: 0, hl_A: 0, hl_S: 0, hl_E: 0, hl_C: 0,
        kode_holland: "-", vak_V: 0, vak_A: 0, vak_K: 0,
        gaya_dominan: "-", rekomendasi_jurusan: "-", konfiden_jurusan: "-",
        jawaban_bf:  SOAL_BIG_FIVE.map(() => "-").join("|"),
        jawaban_hl:  SOAL_HOLLAND.map(() => "-").join("|"),
        jawaban_vak: SOAL_VAK.map(() => "-").join("|"),
        jumlahPelanggaran: pelanggaranRef.current,
        keterangan: "TIDAK MENGIKUTI — " + alasan,
      };
      try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_PSIKOLOGIS, payloadPsikologisKosong); } catch (_) {}
      localStorage.setItem(
        `ujian_submitted_${id.nis}`,
        JSON.stringify({ nama: id.nama, waktu: new Date().toLocaleString("id-ID") })
      );
    }
    setLoading(false);
    setTahap("skorSesi1");
  }, []);

  // ── Kirim Sesi 2 (TPA) ──
  const kirimSesi2 = useCallback(async (alasan = "Normal") => {
    if (submitDoneRef.current) return;
    submitDoneRef.current = true;
    clearInterval(timerRef.current);
    setLoading(true);
    const skor = hitungSkor(SOAL_TPA, jawabanSesi2Ref.current);
    const skorBagian = hitungSkorPerBagian(SOAL_TPA, jawabanSesi2Ref.current);
    const id = identitasRef.current;
    const payload = {
      sesi: "TPA - Tes Potensi Akademik",
      nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
      waktuSelesai: new Date().toLocaleString("id-ID"),
      sisaWaktu: formatWaktu(waktuRef.current),
      skorBenar: skor.benar, skorTotal: skor.total, persenSkor: skor.persen,
      matika_benar: skorBagian["Penalaran Matematika"]?.benar ?? "-",
      matika_total: skorBagian["Penalaran Matematika"]?.total ?? 0,
      matika_persen: skorBagian["Penalaran Matematika"]?.persen ?? "-",
      keislaman_benar: skorBagian["Literasi Keislaman"]?.benar ?? "-",
      keislaman_total: skorBagian["Literasi Keislaman"]?.total ?? 0,
      keislaman_persen: skorBagian["Literasi Keislaman"]?.persen ?? "-",
      membaca_benar: skorBagian["Literasi Membaca"]?.benar ?? "-",
      membaca_total: skorBagian["Literasi Membaca"]?.total ?? 0,
      membaca_persen: skorBagian["Literasi Membaca"]?.persen ?? "-",
      jawaban: SOAL_TPA.map((s, i) => jawabanSesi2Ref.current[i] || "-").join("|"),
      keterangan: alasan,
    };
    try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_TPA, payload); } catch (_) {}
    if (alasan.toLowerCase().includes("diskualifikasi")) {
      // Kirim sesi 3 kosong juga
      const payloadPsikologisKosong = {
        sesi: "Psikologis",
        nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
        waktuSelesai: new Date().toLocaleString("id-ID"), sisaWaktu: "-",
        bf_O: 0, bf_C: 0, bf_E: 0, bf_A: 0, bf_N: 0,
        hl_R: 0, hl_I: 0, hl_A: 0, hl_S: 0, hl_E: 0, hl_C: 0,
        kode_holland: "-", vak_V: 0, vak_A: 0, vak_K: 0,
        gaya_dominan: "-", rekomendasi_jurusan: "-", konfiden_jurusan: "-",
        jawaban_bf:  SOAL_BIG_FIVE.map(() => "-").join("|"),
        jawaban_hl:  SOAL_HOLLAND.map(() => "-").join("|"),
        jawaban_vak: SOAL_VAK.map(() => "-").join("|"),
        jumlahPelanggaran: pelanggaranRef.current,
        keterangan: "TIDAK MENGIKUTI — " + alasan,
      };
      try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_PSIKOLOGIS, payloadPsikologisKosong); } catch (_) {}
      localStorage.setItem(
        `ujian_submitted_${id.nis}`,
        JSON.stringify({ nama: id.nama, waktu: new Date().toLocaleString("id-ID") })
      );
    }
    setLoading(false);
    setTahap("skorSesi2");
  }, []);

  // ── Kirim Sesi 3 (Psikologis) — tanpa tampilkan hasil ke peserta ──
  const kirimSesi3 = useCallback(async (alasan = "Normal") => {
    if (submitDoneRef.current) return;
    submitDoneRef.current = true;
    clearInterval(timerRef.current);
    setLoading(true);
    const jwb = jawabanSesi3Ref.current;
    const id  = identitasRef.current;
    const bf  = hitungBigFive(jwb);
    const hl  = hitungHolland(jwb);
    const vak = hitungVAK(jwb);
    const pj  = pemetaanJurusan(bf, hl);
    const dvak = dominanVAK(vak);
    const payload = {
      sesi: "Psikologis",
      nama: id.nama, noPeserta: id.noPeserta, nis: id.nis, asalSekolah: id.asalSekolah,
      waktuSelesai: new Date().toLocaleString("id-ID"),
      sisaWaktu: formatWaktu(waktuRef.current),
      // Big Five
      bf_O: bf.O, bf_C: bf.C, bf_E: bf.E, bf_A: bf.A, bf_N: bf.N,
      // Holland RIASEC
      hl_R: hl.R, hl_I: hl.I, hl_A: hl.A, hl_S: hl.S, hl_E: hl.E, hl_C: hl.C,
      kode_holland: pj.kode,
      // VAK
      vak_V: vak.V, vak_A: vak.A, vak_K: vak.K,
      gaya_dominan: dvak,
      // Penjurusan
      rekomendasi_jurusan: pj.jurusan,
      konfiden_jurusan: pj.konfiden,
      // Raw answers
      jawaban_bf:  SOAL_BIG_FIVE.map((_, i) => jwb[`bf_${i}`]  || "-").join("|"),
      jawaban_hl:  SOAL_HOLLAND.map((_, i)  => jwb[`hl_${i}`]  || "-").join("|"),
      jawaban_vak: SOAL_VAK.map((_, i)      => jwb[`vak_${i}`] || "-").join("|"),
      jumlahPelanggaran: pelanggaranRef.current,
      keterangan: alasan,
    };
    try { await kirimDenganRetry(GOOGLE_SCRIPT_URL_PSIKOLOGIS, payload); } catch (_) {}
    // Tandai selesai semua (termasuk sesi 3)
    localStorage.setItem(
      `ujian_submitted_${id.nis}`,
      JSON.stringify({ nama: id.nama, waktu: new Date().toLocaleString("id-ID") })
    );
    setLoading(false);
    setTahap("selesaiSemua");
  }, []);

  // ── Timer countdown ──
  useEffect(() => {
    const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2" || tahap === "pengerjaanSesi3";
    if (!sedangUjian) return;
    timerRef.current = setInterval(() => {
      setWaktu((w) => {
        if (w <= 1) {
          clearInterval(timerRef.current);
          if (tahapRef.current === "pengerjaan")       kirimSesi1("Waktu habis");
          else if (tahapRef.current === "pengerjaanSesi2") kirimSesi2("Waktu habis");
          else                                         kirimSesi3("Waktu habis");
          return 0;
        }
        return w - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap, kirimSesi1, kirimSesi2, kirimSesi3]);

  // ── Anti-cheat ──
  useEffect(() => {
    const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2" || tahap === "pengerjaanSesi3";
    if (!sedangUjian) return;
    const tangkapPindahTab = () => {
      if (!document.hidden) return;
      pelanggaranRef.current += 1;
      const jumlah = pelanggaranRef.current;
      setPelanggaran(jumlah);
      if (jumlah >= MAX_PELANGGARAN) {
        setDidiskualifikasi(true);
        setShowPeringatan(false);
        if (tahapRef.current === "pengerjaan")           kirimSesi1(`Diskualifikasi - pindah tab ${jumlah}x`);
        else if (tahapRef.current === "pengerjaanSesi2") kirimSesi2(`Diskualifikasi - pindah tab ${jumlah}x`);
        else                                             kirimSesi3(`Diskualifikasi - pindah tab ${jumlah}x`);
      } else {
        setPesanPeringatan(`Kamu terdeteksi meninggalkan halaman ujian!\n\nIni adalah pelanggaran ke-${jumlah} dari ${MAX_PELANGGARAN}.\nJika mencapai ${MAX_PELANGGARAN}x, jawaban otomatis dikumpulkan dan kamu DISKUALIFIKASI.`);
        setShowPeringatan(true);
      }
    };
    const blokKanan = (e) => e.preventDefault();
    const blokKeyboard = (e) => {
      const k = e.key.toLowerCase();
      if (e.key === "F12" || (e.ctrlKey && k === "u") || (e.ctrlKey && e.shiftKey && ["i","j","c","k"].includes(k)) || (e.ctrlKey && k === "s") || (e.ctrlKey && k === "p") || (e.altKey && k === "tab")) { e.preventDefault(); e.stopPropagation(); }
    };
    const blokCopy = (e) => e.preventDefault();
    document.addEventListener("visibilitychange", tangkapPindahTab);
    document.addEventListener("contextmenu", blokKanan);
    document.addEventListener("keydown", blokKeyboard);
    document.addEventListener("copy", blokCopy);
    document.addEventListener("cut", blokCopy);
    return () => {
      document.removeEventListener("visibilitychange", tangkapPindahTab);
      document.removeEventListener("contextmenu", blokKanan);
      document.removeEventListener("keydown", blokKeyboard);
      document.removeEventListener("copy", blokCopy);
      document.removeEventListener("cut", blokCopy);
    };
  }, [tahap, kirimSesi1, kirimSesi2, kirimSesi3]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const masukFullscreen = () => { if (fullscreenDidukung) document.documentElement.requestFullscreen().catch(() => {}); };

  // ── Wake Lock — cegah layar mati saat ujian berlangsung ──
  const wakeLockRef = useRef(null);
  const [wakeLockAktif, setWakeLockAktif] = useState(false);

  const aktifkanWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator && !wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
          setWakeLockAktif(false);
        });
        setWakeLockAktif(true);
      }
    } catch (_) {
      setWakeLockAktif(false);
    }
  }, []);

  const bebaskanWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
      setWakeLockAktif(false);
    }
  }, []);

  useEffect(() => {
    const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2" || tahap === "pengerjaanSesi3";
    if (!sedangUjian) { bebaskanWakeLock(); return; }

    // Aktifkan wake lock saat mulai ujian
    aktifkanWakeLock();

    // Re-aktifkan otomatis saat layar kembali menyala / tab kembali aktif
    // (Wake Lock otomatis terlepas saat layar mati, perlu di-request ulang)
    const handleReaktifkan = () => {
      if (document.visibilityState === "visible") {
        aktifkanWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleReaktifkan);

    return () => {
      document.removeEventListener("visibilitychange", handleReaktifkan);
      bebaskanWakeLock();
    };
  }, [tahap, aktifkanWakeLock, bebaskanWakeLock]);

  // ── Navigasi antar sesi ──
  const mulaiUjian = () => {
    if (!identitas.nama.trim() || !identitas.noPeserta.trim() || !identitas.nis.trim() || !identitas.asalSekolah.trim()) { setError("Semua field wajib diisi!"); return; }
    const sudah = localStorage.getItem(`ujian_submitted_${identitas.nis}`);
    if (sudah) { setTahap("sudahSubmit"); return; }
    setError("");
    if (fullscreenDidukung) document.documentElement.requestFullscreen().catch(() => {});
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setWaktu(DURATION_SESI);
    setBagianAktif(0);
    setSesiAktif(1);
    setTahap("pengerjaan");
  };

  const lanjutSesi2 = () => {
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setPelanggaran(0);
    setWaktu(DURATION_SESI);
    setBagianAktif(0);
    setSesiAktif(2);
    if (fullscreenDidukung) document.documentElement.requestFullscreen().catch(() => {});
    setTahap("pengerjaanSesi2");
  };

  const lanjutSesi3 = () => {
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setPelanggaran(0);
    setWaktu(DURATION_SESI3);
    setBagianAktif(0);
    setSesiAktif(3);
    if (fullscreenDidukung) document.documentElement.requestFullscreen().catch(() => {});
    setTahap("pengerjaanSesi3");
  };

  const scrollKeAtas = () => {
    setTimeout(() => {
      soalTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // ── Computed values ──
  const isSesi3 = tahap === "pengerjaanSesi3";
  const SOAL_AKTIF = sesiAktif === 1 ? SOAL_TPB : SOAL_TPA;
  const BAGIAN_LIST_AKTIF = isSesi3 ? BAGIAN_LIST_PSIKOLOGIS : (sesiAktif === 1 ? BAGIAN_LIST_TPB : BAGIAN_LIST_TPA);
  const JAWABAN_AKTIF = isSesi3 ? jawabanSesi3 : (sesiAktif === 1 ? jawabanSesi1 : jawabanSesi2);
  const SET_JAWABAN   = isSesi3 ? setJawabanSesi3 : (sesiAktif === 1 ? setJawabanSesi1 : setJawabanSesi2);
  const KIRIM_AKTIF   = isSesi3 ? kirimSesi3 : (sesiAktif === 1 ? kirimSesi1 : kirimSesi2);
  const NAMA_SESI     = isSesi3 ? "Paket Psikologis" : (sesiAktif === 1 ? "Tes Potensi Belajar" : "Tes Potensi Akademik");

  // Untuk sesi 3, soal per bagian pakai key khusus
  const getSesi3SoalBagian = (bagian) => {
    if (bagian === "Big Five Kepribadian")    return SOAL_BIG_FIVE.map((s, i) => ({ ...s, globalIdx: `bf_${i}`, isPsikologis: true }));
    if (bagian === "Minat & Bakat (Holland)") return SOAL_HOLLAND.map((s, i)  => ({ ...s, globalIdx: `hl_${i}`, isPsikologis: true }));
    if (bagian === "Gaya Belajar (VAK)")      return SOAL_VAK.map((s, i)      => ({ ...s, globalIdx: `vak_${i}`, isPsikologis: true }));
    return [];
  };

  const soalBagian = isSesi3
    ? getSesi3SoalBagian(BAGIAN_LIST_AKTIF[bagianAktif])
    : SOAL_AKTIF.map((s, i) => ({ ...s, globalIdx: i })).filter((s) => s.bagian === BAGIAN_LIST_AKTIF[bagianAktif]);

  const totalDijawab = isSesi3
    ? Object.keys(jawabanSesi3).length
    : Object.keys(JAWABAN_AKTIF).length;

  const totalSoalAktif = isSesi3
    ? SOAL_BIG_FIVE.length + SOAL_HOLLAND.length + SOAL_VAK.length
    : SOAL_AKTIF.length;

  const warnaTimer = waktu <= 300 ? "#e74c3c" : waktu <= 600 ? "#f39c12" : "#27ae60";
  const persen = waktu / (isSesi3 ? DURATION_SESI3 : DURATION_SESI);

  const S = {
    card: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: "32px 28px", maxWidth: 420, width: "100%", margin: "0 auto" },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" },
    btnPrimary: { width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#2980b9,#6dd5fa)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
    btnSec: { padding: "10px 22px", borderRadius: 10, border: "1.5px solid #2980b9", background: "#fff", color: "#2980b9", fontSize: 14, fontWeight: 600, cursor: "pointer" },
    errorBox: { background: "#fdecea", color: "#b71c1c", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 },
    muted: { fontSize: 13, color: "#888", margin: 0 },
  };

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Halaman Login
  // ══════════════════════════════════════════════════════════════════
  if (tahap === "identitas")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={S.card}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "8px 0 4px" }}>UJIAN SELEKSI MADRASAH MAN 5 BOGOR</h1>
            <p style={S.muted}>3 Sesi • 150 Menit Total</p>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ background: "#e8f4fd", color: "#2980b9", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>Sesi 1: TPB • 60 menit</span>
              <span style={{ background: "#eafaf1", color: "#27ae60", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>Sesi 2: TPA • 60 menit</span>
              <span style={{ background: "#f3e5f5", color: "#7b1fa2", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>Sesi 3: Psikologis • 30 menit</span>
            </div>
          </div>
          {["nama", "noPeserta", "nis", "asalSekolah"].map((field) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={S.label}>{field === "nis" ? "NIS" : field === "noPeserta" ? "No. Peserta" : field === "asalSekolah" ? "Asal Sekolah" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input style={S.input} placeholder={`Masukkan ${field === "nis" ? "NIS" : field === "noPeserta" ? "No. Peserta" : field === "asalSekolah" ? "Asal Sekolah" : field}...`} value={identitas[field]} onChange={(e) => setIdentitas((p) => ({ ...p, [field]: e.target.value }))} />
            </div>
          ))}
          {error && <div style={S.errorBox}>{error}</div>}
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: "#795548" }}>
            ⚠️ Setiap NIS hanya dapat submit <strong>satu kali</strong>.
          </div>
          {!isIOS ? (
            <div style={{ background: "#fdecea", border: "1px solid #ffcdd2", borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: "#b71c1c", lineHeight: 1.6 }}>
              🔒 Ujian berjalan dalam <strong>mode layar penuh</strong>.<br />
              Dilarang: pindah tab, minimize, klik kanan, copy-paste.<br />
              Pelanggaran <strong>{MAX_PELANGGARAN}x</strong> → DISKUALIFIKASI.
            </div>
          ) : (
            <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: "#795548", lineHeight: 1.6 }}>
              📱 Dilarang pindah tab atau minimize Safari.<br />
              Pelanggaran <strong>{MAX_PELANGGARAN}x</strong> → DISKUALIFIKASI.
            </div>
          )}
          <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#2e7d32", lineHeight: 1.6 }}>
            💡 <strong>Layar tidak akan mati</strong> selama ujian berlangsung.<br />
            Pastikan baterai cukup atau perangkat terhubung charger.
          </div>
          <button style={S.btnPrimary} onClick={mulaiUjian}>{isIOS ? "Mulai Ujian →" : "Mulai Ujian (Layar Penuh) →"}</button>
        </div>
      </div>
    );

  // ── Sudah Submit ──
  if (tahap === "sudahSubmit")
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
          <h2 style={{ color: "#e74c3c" }}>NIS Sudah Digunakan</h2>
          <p style={{ color: "#666" }}>NIS <strong>{identitas.nis}</strong> sudah pernah mengumpulkan jawaban. Setiap NIS hanya dapat mengikuti ujian satu kali.</p>
        </div>
      </div>
    );

  // ── Skor Sesi 1 → lanjut ke Sesi 2 ──
  if (tahap === "skorSesi1")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <h2 style={{ color: "#27ae60", fontSize: 22, marginBottom: 4 }}>Sesi 1 Selesai!</h2>
          <p style={{ color: "#555", marginBottom: 16 }}>Tes Potensi Belajar (TPB)</p>
          <div style={{ background: "#eafaf1", borderRadius: 14, padding: "24px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📨</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 8 }}>Jawaban Sesi 1 Berhasil Dikirim</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              Jawaban kamu telah tercatat dengan baik.<br />
              Hasil nilai dapat dilihat dari panitia.
            </div>
          </div>
          <div style={{ background: "#e8f4fd", border: "1px solid #d0e8f8", borderRadius: 10, padding: "14px 16px", marginBottom: 20, fontSize: 14, color: "#2980b9" }}>
            🎯 Lanjutkan ke <strong>Sesi 2: Tes Potensi Akademik (TPA)</strong><br />
            <span style={{ fontSize: 12, color: "#555" }}>Waktu: 60 menit • {SOAL_TPA.length} soal</span>
          </div>
          <button style={{ ...S.btnPrimary, background: "linear-gradient(90deg,#27ae60,#2ecc71)" }} onClick={lanjutSesi2}>
            Lanjut Sesi 2: TPA →
          </button>
        </div>
      </div>
    );

  // ── Skor Sesi 2 → lanjut ke Sesi 3 ──
  if (tahap === "skorSesi2")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
          <h2 style={{ color: "#2980b9", fontSize: 22, marginBottom: 4 }}>Sesi 2 Selesai!</h2>
          <p style={{ color: "#555", marginBottom: 16 }}>Tes Potensi Akademik (TPA)</p>
          <div style={{ background: "#eafaf1", borderRadius: 14, padding: "20px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📨</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 8 }}>Jawaban Sesi 2 Berhasil Dikirim</div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 8px", border: "1.5px solid #d4efdf" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>✅</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#27ae60" }}>Sesi 1 — TPB</div>
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "10px 8px", border: "1.5px solid #aed6f1" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>✅</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2980b9" }}>Sesi 2 — TPA</div>
              </div>
              <div style={{ flex: 1, background: "#f9f0ff", borderRadius: 10, padding: "10px 8px", border: "1.5px dashed #ce93d8" }}>
                <div style={{ fontSize: 18, marginBottom: 2 }}>⏳</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7b1fa2" }}>Sesi 3 — Psikologis</div>
              </div>
            </div>
          </div>
          <div style={{ background: "#f3e5f5", border: "1px solid #e1bee7", borderRadius: 10, padding: "14px 16px", marginBottom: 20, fontSize: 14, color: "#7b1fa2" }}>
            🧠 Lanjutkan ke <strong>Sesi 3: Paket Psikologis</strong><br />
            <span style={{ fontSize: 12, color: "#555" }}>Waktu: 30 menit • 130 butir • Tidak ada jawaban benar/salah</span>
          </div>
          <button style={{ ...S.btnPrimary, background: "linear-gradient(90deg,#7b1fa2,#ab47bc)" }} onClick={lanjutSesi3}>
            Lanjut Sesi 3: Paket Psikologis →
          </button>
        </div>
      </div>
    );

  // ── Selesai Semua (3 sesi) ──
  if (tahap === "selesaiSemua")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: 520 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎉</div>
          <h2 style={{ color: "#f39c12", fontSize: 22, marginBottom: 4 }}>Ujian Selesai!</h2>
          <p style={{ color: "#555", marginBottom: 20 }}>Terima kasih, <strong>{identitas.nama}</strong>. Semua sesi telah berhasil dikirim.</p>
          <div style={{ background: "#eafaf1", borderRadius: 14, padding: "24px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#27ae60", marginBottom: 12 }}>Semua Sesi Berhasil Diselesaikan</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "12px 6px", border: "1.5px solid #d4efdf" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>✅</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#27ae60" }}>Sesi 1 — TPB</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Terkirim</div>
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "12px 6px", border: "1.5px solid #aed6f1" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>✅</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2980b9" }}>Sesi 2 — TPA</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Terkirim</div>
              </div>
              <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "12px 6px", border: "1.5px solid #ce93d8" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>✅</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7b1fa2" }}>Sesi 3 — Psikologis</div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>Terkirim</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
              Seluruh jawaban kamu telah tercatat dengan baik.<br />
              Hasil ujian dan profil psikologis dapat dilihat dari panitia.
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#888" }}>Kamu dapat menutup halaman ini.</p>
        </div>
      </div>
    );

  // ══════════════════════════════════════════════════════════════════
  // RENDER: Halaman Pengerjaan (Sesi 1, 2, atau 3)
  // ══════════════════════════════════════════════════════════════════
  const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2" || tahap === "pengerjaanSesi3";
  if (!sedangUjian) return null;

  // Warna banner sesi
  const bannerColor = sesiAktif === 1 ? "#2980b9" : sesiAktif === 2 ? "#27ae60" : "#7b1fa2";

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f2f5", userSelect: "none", WebkitUserSelect: "none" }}>

      {/* Modal Peringatan */}
      {showPeringatan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
            <h3 style={{ color: "#e74c3c", marginBottom: 12 }}>Peringatan!</h3>
            <p style={{ fontSize: 14, color: "#333", whiteSpace: "pre-line", marginBottom: 20 }}>{pesanPeringatan}</p>
            <button style={{ ...S.btnPrimary, background: "#e74c3c" }} onClick={() => { setShowPeringatan(false); masukFullscreen(); }}>Kembali ke Ujian</button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Submit */}
      {konfirmasi && !loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "32px 28px", maxWidth: 380, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>
              {sesiAktif === 1 ? "📋" : sesiAktif === 2 ? "📚" : "🧠"}
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>Kumpulkan Jawaban Sesi {sesiAktif}?</h3>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 14 }}>{NAMA_SESI}</p>
            {/* Progress bar jawaban */}
            <div style={{ background: "#f0f0f0", borderRadius: 8, height: 10, marginBottom: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.round((totalDijawab / totalSoalAktif) * 100)}%`, background: sesiAktif === 1 ? "linear-gradient(90deg,#27ae60,#2ecc71)" : sesiAktif === 2 ? "linear-gradient(90deg,#2980b9,#6dd5fa)" : "linear-gradient(90deg,#7b1fa2,#ab47bc)", borderRadius: 8, transition: "width 0.4s" }} />
            </div>
            <p style={{ fontSize: 13, color: "#555", marginBottom: 4 }}>
              Terjawab: <strong style={{ color: totalDijawab === totalSoalAktif ? "#27ae60" : "#e74c3c" }}>{totalDijawab}</strong> / {totalSoalAktif} {isSesi3 ? "butir" : "soal"}
            </p>
            {totalDijawab < totalSoalAktif && (
              <p style={{ fontSize: 12, color: "#e74c3c", marginBottom: 10 }}>
                ⚠️ Masih ada <strong>{totalSoalAktif - totalDijawab}</strong> soal belum dijawab
              </p>
            )}
            {isSesi3 && (
              <div style={{ background: "#f3e5f5", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#7b1fa2" }}>
                🧠 Tidak ada jawaban benar/salah — jawablah dengan jujur sesuai diri kamu
              </div>
            )}
            <div style={{ background: "#fffde7", border: "1px solid #ffe082", borderRadius: 8, padding: "8px 12px", marginBottom: 18, fontSize: 12, color: "#795548" }}>
              ⏱️ Jawaban akan dikirim otomatis. Harap tunggu hingga selesai.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: "2px solid #ccc", background: "#f5f5f5", color: "#555", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                onClick={() => setKonfirmasi(false)}>
                ← Kembali
              </button>
              <button
                style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 0.5,
                  background: sesiAktif === 1
                    ? "linear-gradient(90deg,#27ae60,#00c853)"
                    : sesiAktif === 2
                    ? "linear-gradient(90deg,#1565c0,#42a5f5)"
                    : "linear-gradient(90deg,#6a1b9a,#e040fb)",
                  boxShadow: sesiAktif === 1
                    ? "0 4px 16px rgba(39,174,96,0.4)"
                    : sesiAktif === 2
                    ? "0 4px 16px rgba(41,128,185,0.4)"
                    : "0 4px 16px rgba(123,31,162,0.4)"
                }}
                onClick={() => { setKonfirmasi(false); KIRIM_AKTIF(); }}>
                ✅ Ya, Kumpulkan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Loading — tampil saat mengirim ke server */}
      {loading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", maxWidth: 340, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            {/* Spinner animasi */}
            <div style={{ display: "inline-block", width: 56, height: 56, border: "5px solid #f0f0f0", borderTop: `5px solid ${sesiAktif === 1 ? "#27ae60" : sesiAktif === 2 ? "#2980b9" : "#7b1fa2"}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 20 }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>Mengirim Jawaban...</h3>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>
              Jawaban kamu sedang dikirim ke server.<br />
              <strong>Jangan tutup atau refresh halaman ini.</strong>
            </p>
            <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "8px 14px", fontSize: 12, color: "#888" }}>
              ⏳ Proses ini membutuhkan beberapa detik...
            </div>
          </div>
        </div>
      )}

      {/* Diskualifikasi */}
      {didiskualifikasi && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
            <h2 style={{ color: "#e74c3c" }}>DISKUALIFIKASI</h2>
            <p style={{ color: "#666" }}>Kamu terdeteksi meninggalkan halaman ujian sebanyak {MAX_PELANGGARAN}x. Jawaban telah otomatis dikumpulkan.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#1a1a2e", color: "#fff", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>Sesi {sesiAktif}/3 — {NAMA_SESI}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{identitas.nama} • {identitas.noPeserta}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: warnaTimer, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>{formatWaktu(waktu)}</div>
          <div style={{ height: 4, width: 110, background: "#333", borderRadius: 4, marginTop: 4, margin: "4px auto 0" }}>
            <div style={{ height: "100%", width: `${persen * 100}%`, background: warnaTimer, borderRadius: 4, transition: "width 1s linear, background 0.5s" }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Dijawab</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{totalDijawab}/{totalSoalAktif}</div>
          {pelanggaran > 0 && <div style={{ fontSize: 11, color: "#e74c3c", fontWeight: 700 }}>⚠️ {pelanggaran}/{MAX_PELANGGARAN}</div>}
          <div style={{ fontSize: 10, marginTop: 2 }}>
            {wakeLockAktif
              ? <span style={{ color: "#2ecc71" }}>🔆 Layar terjaga</span>
              : <span style={{ color: "#e67e22" }}>⚠️ Layar bisa mati</span>
            }
          </div>
        </div>
      </div>

      {/* Banner sesi */}
      <div style={{ background: bannerColor, color: "#fff", textAlign: "center", padding: "6px", fontSize: 12, fontWeight: 700 }}>
        SESI {sesiAktif}: {NAMA_SESI.toUpperCase()}
        {isSesi3 && <span style={{ marginLeft: 10, fontSize: 10, opacity: 0.85 }}>— Tidak ada jawaban benar/salah, jawab sejujurnya</span>}
      </div>

      {!isIOS && !isFullscreen && !showPeringatan && !didiskualifikasi && (
        <div style={{ background: "#e74c3c", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>
          ⚠️ Kamu keluar dari mode layar penuh!{" "}
          <span onClick={masukFullscreen} style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 800 }}>Klik di sini untuk kembali</span>
        </div>
      )}

      {/* Petunjuk Sesi 3 */}
      {isSesi3 && (
        <div style={{ padding: "8px 16px 0" }}>
          <div style={{ background: "#f3e5f5", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#7b1fa2", fontWeight: 600 }}>
            💡 Pilih angka <strong>1</strong> (Sangat Tidak Setuju) hingga <strong>5</strong> (Sangat Setuju) untuk setiap pernyataan
          </div>
        </div>
      )}

      {/* Tab Bagian */}
      <div style={{ display: "flex", gap: 6, padding: "12px 16px 0", overflowX: "auto" }}>
        {BAGIAN_LIST_AKTIF.map((b, i) => {
          let dijawabB, totalB;
          if (isSesi3) {
            const soalB = getSesi3SoalBagian(b);
            dijawabB = soalB.filter(s => jawabanSesi3[s.globalIdx] !== undefined).length;
            totalB = soalB.length;
          } else {
            const soalB = SOAL_AKTIF.filter((s) => s.bagian === b);
            dijawabB = soalB.filter((s) => JAWABAN_AKTIF[SOAL_AKTIF.findIndex((x) => x === s)] !== undefined).length;
            totalB = soalB.length;
          }
          const aktif = bagianAktif === i;
          const warnaTab = isSesi3 ? WARNA_PSIKOLOGIS[b] : WARNA_BAGIAN[b];
          return (
            <button key={b} onClick={() => { setBagianAktif(i); scrollKeAtas(); }} style={{ padding: "8px 14px", borderRadius: 10, border: aktif ? `2px solid ${warnaTab?.accent || "#1a1a2e"}` : "1.5px solid #ddd", background: aktif ? (warnaTab?.bg || "#1a1a2e") : "#fff", color: aktif ? (warnaTab?.accent || "#fff") : "#333", fontWeight: aktif ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {b} ({dijawabB}/{totalB})
            </button>
          );
        })}
      </div>

      {/* Area Soal */}
      <div style={{ padding: "12px 16px", maxWidth: 720, margin: "0 auto" }}>
        <div ref={soalTopRef} />
        {soalBagian.map((s) => {
          const dipilih = isSesi3 ? jawabanSesi3[s.globalIdx] : JAWABAN_AKTIF[s.globalIdx];
          const warna = isSesi3 ? (WARNA_PSIKOLOGIS[BAGIAN_LIST_AKTIF[bagianAktif]] || { bg: "#f5f5f5", accent: "#333", light: "#eee" }) : (WARNA_BAGIAN[s.bagian] || { bg: "#f5f5f5", accent: "#333", light: "#eee" });

          return (
            <div key={s.globalIdx} style={{ background: "#fff", borderRadius: 14, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1.5px solid ${dipilih !== undefined ? warna.accent : "#e8e8e8"}`, overflow: "hidden" }}>
              <div style={{ background: warna.bg, padding: "12px 18px", borderBottom: `1px solid ${warna.light}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: warna.accent, color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>No. {s.no || s.nomor}</span>
                {s.dimensi && <span style={{ fontSize: 11, color: warna.accent, fontWeight: 700 }}>Dimensi {s.dimensi}</span>}
                {s.tipe && !s.dimensi && <span style={{ fontSize: 11, color: warna.accent, fontWeight: 700 }}>Tipe {s.tipe}</span>}
                {!isSesi3 && s.bagian && <span style={{ fontSize: 12, color: warna.accent, fontWeight: 600 }}>{s.bagian}</span>}
                {dipilih !== undefined && (
                  <span style={{ marginLeft: "auto", fontSize: 12, color: warna.accent }}>
                    {isSesi3 ? `✓ ${PILIHAN_LIKERT.find(p => p.nilai === dipilih)?.singkat || dipilih}` : (BAGIAN_TANPA_KUNCI.includes(s.bagian) ? "✓ Dipilih" : "✓ Dijawab")}
                  </span>
                )}
                {!isSesi3 && BAGIAN_TANPA_KUNCI.includes(s.bagian) && (
                  <span style={{ marginLeft: dipilih !== undefined ? 4 : "auto", fontSize: 11, background: "#f3e5f5", color: "#8e44ad", borderRadius: 6, padding: "1px 8px" }}>Tidak dinilai</span>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                {/* Teks bacaan (Sesi 2) */}
                {s.teks && (
                  <div style={{ background: "#f9f9f9", border: "1px solid #e0e0e0", borderRadius: 10, padding: "14px 16px", marginBottom: 14, fontSize: 13, color: "#333", lineHeight: 1.8 }}>
                    {s.teksJudul && <div style={{ fontWeight: 700, marginBottom: 8, color: "#2980b9" }}>{s.teksJudul}</div>}
                    <div style={{ whiteSpace: "pre-wrap" }}>{s.teks}</div>
                  </div>
                )}
                {s.teksJudul && !s.teks && (
                  <div style={{ fontSize: 12, color: "#2980b9", fontWeight: 600, marginBottom: 8 }}>📄 {s.teksJudul}</div>
                )}

                <p style={{ fontSize: 15, color: "#222", lineHeight: 1.7, marginBottom: 14, marginTop: 0 }}>{s.soal || s.pernyataan}</p>
                {s.gambar && <img src={s.gambar} alt={`Gambar soal ${s.no || s.nomor}`} style={{ width: "100%", maxWidth: 500, borderRadius: 8, marginBottom: 14, border: "1px solid #e0e0e0", display: "block" }} />}

                {/* Pilihan: Likert untuk Sesi 3, pilihan biasa untuk Sesi 1&2 */}
                {isSesi3 ? (
                  <>
                    <div style={{ display: "flex", gap: 6 }}>
                      {PILIHAN_LIKERT.map((p) => {
                        const terpilih = dipilih === p.nilai;
                        return (
                          <button key={p.nilai} onClick={() => setJawabanSesi3((prev) => ({ ...prev, [s.globalIdx]: p.nilai }))}
                            style={{ flex: 1, padding: "10px 4px", borderRadius: 10, border: terpilih ? `2px solid ${warna.accent}` : "1.5px solid #e0e0e0", background: terpilih ? warna.bg : "#fafafa", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transition: "all 0.12s" }}>
                            <span style={{ fontSize: 16, fontWeight: 800, color: terpilih ? warna.accent : "#aaa" }}>{p.nilai}</span>
                            <span style={{ fontSize: 9, color: terpilih ? warna.accent : "#ccc", fontWeight: terpilih ? 700 : 400, textAlign: "center" }}>{p.singkat}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                      <span style={{ fontSize: 9, color: "#bbb" }}>Sangat Tidak Setuju</span>
                      <span style={{ fontSize: 9, color: "#bbb" }}>Sangat Setuju</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {s.pilihan.map((p) => {
                      const hrf = p.charAt(0);
                      const terpilih = dipilih === hrf;
                      return (
                        <button key={p} onClick={() => SET_JAWABAN((prev) => ({ ...prev, [s.globalIdx]: hrf }))} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 10, border: terpilih ? `2px solid ${warna.accent}` : "1.5px solid #e0e0e0", background: terpilih ? warna.bg : "#fafafa", cursor: "pointer", fontSize: 14, color: terpilih ? warna.accent : "#333", fontWeight: terpilih ? 600 : 400, transition: "all 0.15s" }}>
                          {p}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Navigasi & Submit */}
        <div style={{ display: "flex", gap: 10, marginTop: 8, marginBottom: 32 }}>
          {bagianAktif > 0 && (
            <button onClick={() => { setBagianAktif((p) => p - 1); scrollKeAtas(); }} style={S.btnSec}>← Sebelumnya</button>
          )}
          {bagianAktif < BAGIAN_LIST_AKTIF.length - 1
            ? <button onClick={() => { setBagianAktif((p) => p + 1); scrollKeAtas(); }} style={{ ...S.btnPrimary, flex: 1 }}>Bagian Berikutnya →</button>
            : <button
                disabled={loading}
                onClick={() => !loading && setKonfirmasi(true)}
                style={{ ...S.btnPrimary, flex: 1, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer",
                  background: loading ? "#aaa"
                    : sesiAktif === 1 ? "linear-gradient(90deg,#27ae60,#00c853)"
                    : sesiAktif === 2 ? "linear-gradient(90deg,#1565c0,#42a5f5)"
                    : "linear-gradient(90deg,#6a1b9a,#e040fb)",
                  boxShadow: loading ? "none"
                    : sesiAktif === 1 ? "0 4px 16px rgba(39,174,96,0.35)"
                    : sesiAktif === 2 ? "0 4px 16px rgba(41,128,185,0.35)"
                    : "0 4px 16px rgba(123,31,162,0.35)"
                }}>
                {loading ? "⏳ Mengirim..." : sesiAktif === 1 ? "✅ Selesai Sesi 1" : sesiAktif === 2 ? "📤 Kumpulkan Sesi 2" : "🧠 Selesai Sesi 3 Psikologis"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
