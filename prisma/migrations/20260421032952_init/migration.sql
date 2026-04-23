/*
  Warnings:

  - You are about to drop the `_mahasiswatomatakuliah` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_mahasiswatomatakuliah` DROP FOREIGN KEY `_MahasiswaToMatakuliah_A_fkey`;

-- DropForeignKey
ALTER TABLE `_mahasiswatomatakuliah` DROP FOREIGN KEY `_MahasiswaToMatakuliah_B_fkey`;

-- DropTable
DROP TABLE `_mahasiswatomatakuliah`;

-- CreateTable
CREATE TABLE `KRS` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `matakuliahId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KRS` ADD CONSTRAINT `KRS_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
