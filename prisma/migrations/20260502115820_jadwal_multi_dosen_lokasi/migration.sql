-- DropForeignKey
ALTER TABLE `jadwalkuliah` DROP FOREIGN KEY `JadwalKuliah_dosenId_fkey`;

-- AlterTable (tambah kolom baru dulu dalam mode nullable agar aman untuk data lama)
ALTER TABLE `jadwalkuliah`
    ADD COLUMN `lokasiPerkuliahan` ENUM('RUANG_KELAS', 'LABORATORIUM') NULL,
    ADD COLUMN `ruangKelas` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `_DosenToJadwalKuliah` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DosenToJadwalKuliah_AB_unique`(`A`, `B`),
    INDEX `_DosenToJadwalKuliah_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrasi relasi dosen lama (one-to-many) ke relasi baru (many-to-many)
INSERT INTO `_DosenToJadwalKuliah` (`A`, `B`)
SELECT `dosenId`, `id`
FROM `jadwalkuliah`
WHERE `dosenId` IS NOT NULL;

-- Tentukan lokasi default berdasarkan data lama
UPDATE `jadwalkuliah`
SET `lokasiPerkuliahan` = CASE
    WHEN `laboratoriumId` IS NOT NULL THEN 'LABORATORIUM'
    ELSE 'RUANG_KELAS'
END
WHERE `lokasiPerkuliahan` IS NULL;

-- Isi ruang kelas default untuk jadwal non-lab yang belum punya ruangan
UPDATE `jadwalkuliah`
SET `ruangKelas` = COALESCE(NULLIF(`ruangKelas`, ''), 'Belum ditentukan')
WHERE `lokasiPerkuliahan` = 'RUANG_KELAS';

-- Wajibkan lokasiPerkuliahan lalu hapus kolom dosen lama
ALTER TABLE `jadwalkuliah`
    MODIFY `lokasiPerkuliahan` ENUM('RUANG_KELAS', 'LABORATORIUM') NOT NULL,
    DROP COLUMN `dosenId`;

-- AddForeignKey
ALTER TABLE `_DosenToJadwalKuliah` ADD CONSTRAINT `_DosenToJadwalKuliah_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DosenToJadwalKuliah` ADD CONSTRAINT `_DosenToJadwalKuliah_B_fkey` FOREIGN KEY (`B`) REFERENCES `JadwalKuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
