/*
  Warnings:

  - You are about to drop the `bukuajar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bukuajar` DROP FOREIGN KEY `BukuAjar_dosenId_fkey`;

-- DropForeignKey
ALTER TABLE `bukuajar` DROP FOREIGN KEY `BukuAjar_penelitianId_fkey`;

-- DropForeignKey
ALTER TABLE `bukuajar` DROP FOREIGN KEY `BukuAjar_pengabdianId_fkey`;

-- DropTable
DROP TABLE `bukuajar`;

-- CreateTable
CREATE TABLE `BahanAjar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `kategori` ENUM('BUKU', 'MODUL') NOT NULL,
    `penerbit` VARCHAR(191) NULL,
    `isbn` VARCHAR(191) NULL,
    `tahun` INTEGER NOT NULL,
    `matakuliahId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BahanAjarToDosen` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BahanAjarToDosen_AB_unique`(`A`, `B`),
    INDEX `_BahanAjarToDosen_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BahanAjar` ADD CONSTRAINT `BahanAjar_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BahanAjarToDosen` ADD CONSTRAINT `_BahanAjarToDosen_A_fkey` FOREIGN KEY (`A`) REFERENCES `BahanAjar`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BahanAjarToDosen` ADD CONSTRAINT `_BahanAjarToDosen_B_fkey` FOREIGN KEY (`B`) REFERENCES `Dosen`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
