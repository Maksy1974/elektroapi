/*
  Warnings:

  - You are about to drop the column `dosenId` on the `hki` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `hki` DROP FOREIGN KEY `Hki_dosenId_fkey`;

-- AlterTable
ALTER TABLE `matakuliah` ADD COLUMN `laboratoriumId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Tendik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(191) NOT NULL,
    `namaTendik` VARCHAR(191) NOT NULL,
    `alamatTendik` VARCHAR(191) NOT NULL,
    `notelpTendik` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Tendik_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AbsenTendik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tendikId` INTEGER NOT NULL,
    `latitude` DOUBLE NOT NULL,
    `longitude` DOUBLE NOT NULL,
    `jarakMeter` DOUBLE NOT NULL,
    `status` ENUM('HADIR') NOT NULL DEFAULT 'HADIR',
    `diambilPada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Laboratorium` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaLab` VARCHAR(191) NOT NULL,
    `kepalaLab` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DosenToHki` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DosenToHki_AB_unique`(`A`, `B`),
    INDEX `_DosenToHki_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrasi data relasi lama HKI -> Dosen ke relasi many-to-many
INSERT INTO `_DosenToHki` (`A`, `B`)
SELECT `dosenId`, `id`
FROM `hki`
WHERE `dosenId` IS NOT NULL;

-- AlterTable
ALTER TABLE `hki` DROP COLUMN `dosenId`;

-- AddForeignKey
ALTER TABLE `Matakuliah` ADD CONSTRAINT `Matakuliah_laboratoriumId_fkey` FOREIGN KEY (`laboratoriumId`) REFERENCES `Laboratorium`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AbsenTendik` ADD CONSTRAINT `AbsenTendik_tendikId_fkey` FOREIGN KEY (`tendikId`) REFERENCES `Tendik`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DosenToHki` ADD CONSTRAINT `_DosenToHki_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DosenToHki` ADD CONSTRAINT `_DosenToHki_B_fkey` FOREIGN KEY (`B`) REFERENCES `Hki`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
