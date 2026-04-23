/*
  Warnings:

  - Added the required column `prodiId` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `prodiId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Prodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
