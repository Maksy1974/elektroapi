-- DropForeignKey
ALTER TABLE `krs` DROP FOREIGN KEY `KRS_mahasiswaId_fkey`;

-- DropForeignKey
ALTER TABLE `krs` DROP FOREIGN KEY `KRS_matakuliahId_fkey`;

-- AddForeignKey
ALTER TABLE `Krs` ADD CONSTRAINT `Krs_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Krs` ADD CONSTRAINT `Krs_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
