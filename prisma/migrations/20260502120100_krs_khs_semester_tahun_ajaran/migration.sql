-- Tambah kolom metadata akademik terlebih dahulu (nullable agar aman)
ALTER TABLE `Krs`
  ADD COLUMN `semester` INTEGER NULL,
  ADD COLUMN `tahunAjaran` VARCHAR(191) NULL;

-- Isi data lama dari matakuliah dan default tahun ajaran
UPDATE `Krs` k
JOIN `Matakuliah` m ON m.`id` = k.`matakuliahId`
SET
  k.`semester` = COALESCE(k.`semester`, m.`semester`),
  k.`tahunAjaran` = COALESCE(k.`tahunAjaran`, 'BELUM_DITENTUKAN');

-- Jadikan wajib diisi
ALTER TABLE `Krs`
  MODIFY `semester` INTEGER NOT NULL,
  MODIFY `tahunAjaran` VARCHAR(191) NOT NULL;

-- Tambah index pendukung FK sebelum melepas unique lama
CREATE INDEX `Krs_mahasiswaId_idx` ON `Krs`(`mahasiswaId`);
CREATE INDEX `Krs_matakuliahId_idx` ON `Krs`(`matakuliahId`);

-- Ganti unique lama agar pengambilan MK bisa dipisah per semester/tahun ajaran
ALTER TABLE `Krs` DROP INDEX `Krs_mahasiswaId_matakuliahId_key`;
CREATE UNIQUE INDEX `Krs_mahasiswaId_matakuliahId_semester_tahunAjaran_key`
  ON `Krs`(`mahasiswaId`, `matakuliahId`, `semester`, `tahunAjaran`);
