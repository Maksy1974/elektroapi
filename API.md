# Dokumentasi REST API - Sistem Informasi Akademik

Dokumentasi ini mengikuti schema dan endpoint terbaru.

## Informasi Umum

- Base URL: `http://localhost:3000`
- Content-Type default: `application/json`
- Untuk upload foto (`mahasiswa`, `dosen`, `tendik`) gunakan `multipart/form-data`
- Semua `/:id` wajib integer positif

## Template cepat di Postman

Untuk setiap entitas:
- GET list: `GET /entitas`
- GET by id: `GET /entitas/:id`
- POST: `POST /entitas`
- PUT: `PUT /entitas/:id`
- DELETE: `DELETE /entitas/:id`

---

## 1) Jurusan (`/jurusan`)

### POST contoh
```json
{
  "namaJurusan": "Teknik Sipil",
  "kajur": "Rio"
}
```

### PUT contoh
```json
{
  "namaJurusan": "Teknik Sipil Terapan",
  "kajur": "Rio P"
}
```

### GET/DELETE contoh
- `GET /jurusan`
- `GET /jurusan/1`
- `DELETE /jurusan/1`

---

## 2) Prodi (`/prodi`)

### POST contoh
```json
{
  "nama": "D4 Teknik Informatika",
  "namaKaprodi": "Dr. A",
  "peringkatAkreditasi": "Baik Sekali",
  "jurusanId": 1
}
```

### PUT contoh
```json
{
  "namaKaprodi": "Dr. B",
  "peringkatAkreditasi": "Unggul"
}
```

### GET/DELETE contoh
- `GET /prodi`
- `GET /prodi/1`
- `DELETE /prodi/1`

---

## 3) Laboratorium (`/laboratorium`)

### POST contoh
```json
{
  "namaLab": "Lab Jaringan",
  "kepalaLab": "Bpk. Andi"
}
```

### PUT contoh
```json
{
  "namaLab": "Lab Jaringan Komputer",
  "kepalaLab": "Bpk. Andi S"
}
```

### GET/DELETE contoh
- `GET /laboratorium`
- `GET /laboratorium/1`
- `DELETE /laboratorium/1`

---

## 4) Mata Kuliah (`/matakuliah`)

### POST contoh
```json
{
  "kodeMatakuliah": "TI401",
  "nama": "Jaringan Komputer",
  "sks": 3,
  "deskripsiMatakuliah": "Dasar jaringan",
  "kategori": "praktik",
  "semester": 4,
  "prodiId": 1,
  "laboratoriumId": 1
}
```

### PUT contoh
```json
{
  "nama": "Jaringan Komputer Lanjut",
  "kategori": "teori",
  "laboratoriumId": null
}
```

### GET/DELETE contoh
- `GET /matakuliah`
- `GET /matakuliah/1`
- `DELETE /matakuliah/1`

---

## 5) Dosen (`/dosen`) - multipart jika ada foto

### POST contoh (form-data)
- `nip`: `197901012005011001`
- `email`: `dosen1@kampus.ac.id`
- `namaDosen`: `Dr. Budi`
- `tempatLahir`: `Manado`
- `tanggalLahir`: `1979-01-01`
- `alamat`: `Jl. Kampus`
- `telp`: `08123456789`
- `prodiId`: `1`
- `foto`: file image (opsional)

### PUT contoh (JSON/form-data)
```json
{
  "namaDosen": "Dr. Budi S.Kom",
  "telp": "08129999999",
  "prodiId": 1
}
```

### GET/DELETE contoh
- `GET /dosen`
- `GET /dosen/1`
- `DELETE /dosen/1`

---

## 6) Mahasiswa (`/mahasiswa`) - multipart jika ada foto

### POST contoh (form-data)
- `nama`: `Arif`
- `nim`: `22023030`
- `email`: `arif@student.ac.id`
- `alamat`: `Wenang`
- `telp`: `08221111111`
- `tempatLahir`: `Bitung`
- `tanggalLahir`: `2003-02-10`
- `semester`: `4`
- `prodiId`: `1`
- `foto`: file image (opsional)

### PUT contoh
```json
{
  "alamat": "Malalayang",
  "telp": "08223333333",
  "semester": 5
}
```

### GET/DELETE contoh
- `GET /mahasiswa`
- `GET /mahasiswa/1`
- `DELETE /mahasiswa/1`

---

## 7) Kartu Mahasiswa (`/kartu`)

### POST contoh
```json
{
  "nomorKartu": "KM-2026-0001",
  "mahasiswaId": 1
}
```

### PUT contoh
```json
{
  "nomorKartu": "KM-2026-0099"
}
```

### GET/DELETE contoh
- `GET /kartu`
- `GET /kartu/1`
- `DELETE /kartu/1`

---

## 8) KRS (`/krs`)

### POST contoh
```json
{
  "mahasiswaId": 1,
  "matakuliahId": 1,
  "semester": 4,
  "tahunAjaran": "2026/2027",
  "nilai": 85
}
```

### PUT contoh
```json
{
  "semester": 4,
  "tahunAjaran": "2026/2027",
  "nilai": 90
}
```

### GET/DELETE contoh
- `GET /krs`
- `GET /krs?mahasiswaId=1&semester=4&tahunAjaran=2026/2027`
- `GET /krs/1`
- `DELETE /krs/1`

---

## 8b) KHS (`/khs`)

Endpoint cetak KHS mahasiswa (nama jurusan, prodi, nama mahasiswa, nim, semester, tahun ajaran, daftar mata kuliah dan nilai).

### GET contoh
- `GET /khs/1?semester=4&tahunAjaran=2026/2027`

Keterangan:
- `:id` adalah `mahasiswaId`
- `semester` dan `tahunAjaran` disarankan dikirim agar KHS spesifik per periode

---

## 9) Pengampu Mata Kuliah (`/pengampu-matakuliah`)

### POST contoh
```json
{
  "dosenId": 1,
  "matakuliahId": 1,
  "kelas": "2A",
  "semester": 4,
  "tahunAjaran": "2026/2027"
}
```

### PUT contoh
```json
{
  "kelas": "2B",
  "tahunAjaran": "2026/2027"
}
```

### GET/DELETE contoh
- `GET /pengampu-matakuliah`
- `GET /pengampu-matakuliah/1`
- `DELETE /pengampu-matakuliah/1`

---

## 10) Jadwal Kuliah (`/jadwal-kuliah`)

Mendukung **multi dosen** lewat `dosenIds`.

Aturan lokasi:
- `lokasiPerkuliahan = LABORATORIUM` => `laboratoriumId` wajib
- `lokasiPerkuliahan = RUANG_KELAS` => `ruangKelas` wajib

### POST contoh (praktik)
```json
{
  "prodiId": 1,
  "matakuliahId": 1,
  "dosenIds": [1, 2],
  "kelas": "2A",
  "semester": 4,
  "tahunAjaran": "2026/2027",
  "hari": "SENIN",
  "jamMulai": "08:00",
  "jamSelesai": "10:30",
  "lokasiPerkuliahan": "LABORATORIUM",
  "laboratoriumId": 1
}
```

### PUT contoh
```json
{
  "dosenIds": [1, 4],
  "hari": "RABU",
  "jamMulai": "13:00",
  "jamSelesai": "14:40"
}
```

### GET/DELETE contoh
- `GET /jadwal-kuliah`
- `GET /jadwal-kuliah?prodiId=1&semester=4&tahunAjaran=2026/2027`
- `GET /jadwal-kuliah/1`
- `DELETE /jadwal-kuliah/1`

---

## 11) Penelitian (`/penelitian`)

### POST contoh
```json
{
  "judul": "AI untuk Pendidikan",
  "topik": "AI",
  "sumberDana": "HIBAH",
  "namaHibah": "Kemdikbud",
  "tahun": 2026,
  "ketuaId": 1,
  "anggota": [
    { "dosenId": 2, "peran": "Anggota" },
    { "dosenId": 3, "peran": "Anggota" }
  ]
}
```

### PUT contoh
```json
{
  "topik": "AI Terapan",
  "tahun": 2027
}
```

### GET/DELETE contoh
- `GET /penelitian`
- `GET /penelitian/1`
- `DELETE /penelitian/1`

### Anggota (tambahan)
- `POST /penelitian/1/anggota`
```json
{ "dosenId": 4, "peran": "Anggota" }
```
- `DELETE /penelitian/1/anggota/10`

---

## 12) Pengabdian (`/pengabdian`)

### POST contoh
```json
{
  "judul": "Pelatihan UMKM",
  "topik": "Teknologi",
  "sumberDana": "MANDIRI",
  "tahun": 2026,
  "ketuaId": 1,
  "anggota": [
    { "dosenId": 2, "peran": "Anggota" }
  ]
}
```

### PUT contoh
```json
{
  "judul": "Pelatihan UMKM Digital"
}
```

### GET/DELETE contoh
- `GET /pengabdian`
- `GET /pengabdian/1`
- `DELETE /pengabdian/1`

### Anggota (tambahan)
- `POST /pengabdian/1/anggota`
```json
{ "dosenId": 3, "peran": "Narasumber" }
```
- `DELETE /pengabdian/1/anggota/10`

---

## 13) Publikasi Jurnal (`/publikasi-jurnal`)

### POST contoh
```json
{
  "judul": "Optimasi Jaringan",
  "namaJurnal": "Jurnal TI",
  "tahun": 2026,
  "doi": "10.1234/abcd",
  "url": "https://example.com/paper",
  "dosenId": 1,
  "penelitianId": 1
}
```

### PUT contoh
```json
{
  "url": "https://example.com/paper-v2"
}
```

### GET/DELETE contoh
- `GET /publikasi-jurnal`
- `GET /publikasi-jurnal/1`
- `DELETE /publikasi-jurnal/1`

---

## 14) Bahan Ajar (`/bahan-ajar`) dan alias (`/buku-ajar`)

### POST contoh
```json
{
  "judul": "Modul Praktikum Jaringan",
  "kategori": "MODUL",
  "penerbit": "Polimdo Press",
  "isbn": "978-602-0000-00-1",
  "tahun": 2026,
  "matakuliahId": 1,
  "dosenIds": [1, 2]
}
```

### PUT contoh
```json
{
  "kategori": "BUKU",
  "dosenIds": [1]
}
```

### GET/DELETE contoh
- `GET /bahan-ajar`
- `GET /bahan-ajar/1`
- `DELETE /bahan-ajar/1`

---

## 15) HKI (`/hki`)

### POST contoh
```json
{
  "judul": "Sistem Monitoring",
  "nomorPendaftaran": "EC00202612345",
  "jenis": "Hak Cipta",
  "tahun": 2026,
  "dosenIds": [1, 2],
  "penelitianId": 1
}
```

### PUT contoh
```json
{
  "jenis": "Paten",
  "dosenIds": [1, 3]
}
```

### GET/DELETE contoh
- `GET /hki`
- `GET /hki/1`
- `DELETE /hki/1`

---

## 16) Tendik (`/tendik`) - multipart jika ada foto

### POST contoh (form-data)
- `nip`: `198801012010121001`
- `namaTendik`: `Siti`
- `alamatTendik`: `Manado`
- `notelpTendik`: `08135555555`
- `foto`: file image (opsional)

### PUT contoh
```json
{
  "alamatTendik": "Tomohon",
  "notelpTendik": "08137777777"
}
```

### GET/DELETE contoh
- `GET /tendik`
- `GET /tendik/1`
- `DELETE /tendik/1`

---

## 17) Absen Tendik

### POST ambil absen (`/tendik/:id/absen`)
```json
{
  "latitude": 1.4518,
  "longitude": 124.8425
}
```

### GET detail absen
- `GET /tendik/1/absen`
- `GET /tendik/1/absen?startDate=2026-05-01&endDate=2026-05-31`

### GET laporan detail + rekap periode
- `GET /tendik/laporan/kehadiran`
- `GET /tendik/laporan/kehadiran?startDate=2026-05-01&endDate=2026-05-31`
- `GET /tendik/laporan/kehadiran?tendikId=1&startDate=2026-05-01&endDate=2026-05-31`

Catatan: endpoint absen bersifat log, tidak ada PUT/DELETE.

---

## Environment

- `DATABASE_URL`
- `CLOUD_NAME`, `API_KEY`, `API_SECRET`
- `CAMPUS_LAT`, `CAMPUS_LNG`, `ABSEN_RADIUS_METER`

## Jalankan server

```bash
node index.js
```
