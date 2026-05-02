/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Mahasiswa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Dosen` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dosen` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `mahasiswa` ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dosen_email_key` ON `Dosen`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Mahasiswa_email_key` ON `Mahasiswa`(`email`);
