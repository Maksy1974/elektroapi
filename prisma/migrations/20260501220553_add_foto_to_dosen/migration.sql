/*
  Warnings:

  - You are about to drop the column `jurusan` on the `mahasiswa` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mahasiswaId,matakuliahId]` on the table `Krs` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kodeMatakuliah]` on the table `Matakuliah` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggalLahir` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telp` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempatLahir` to the `Mahasiswa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deskripsiMatakuliah` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kategori` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kodeMatakuliah` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodiId` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sks` to the `Matakuliah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `krs` ADD COLUMN `nilai` INTEGER NULL;

-- AlterTable
ALTER TABLE `mahasiswa` DROP COLUMN `jurusan`,
    ADD COLUMN `alamat` VARCHAR(191) NOT NULL,
    ADD COLUMN `semester` INTEGER NOT NULL,
    ADD COLUMN `tanggalLahir` DATE NOT NULL,
    ADD COLUMN `telp` VARCHAR(191) NOT NULL,
    ADD COLUMN `tempatLahir` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `matakuliah` ADD COLUMN `deskripsiMatakuliah` VARCHAR(191) NOT NULL,
    ADD COLUMN `kategori` VARCHAR(191) NOT NULL,
    ADD COLUMN `kodeMatakuliah` VARCHAR(191) NOT NULL,
    ADD COLUMN `prodiId` INTEGER NOT NULL,
    ADD COLUMN `semester` INTEGER NOT NULL,
    ADD COLUMN `sks` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `prodi` ADD COLUMN `jurusanId` INTEGER NULL,
    ADD COLUMN `namaKaprodi` VARCHAR(191) NULL,
    ADD COLUMN `peringkatAkreditasi` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Jurusan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaJurusan` VARCHAR(191) NOT NULL,
    `kajur` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(191) NOT NULL,
    `namaDosen` VARCHAR(191) NOT NULL,
    `tempatLahir` VARCHAR(191) NOT NULL,
    `tanggalLahir` DATE NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NULL,

    UNIQUE INDEX `Dosen_nip_key`(`nip`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PengampuMatakuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dosenId` INTEGER NOT NULL,
    `matakuliahId` INTEGER NOT NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `tahunAjaran` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PengampuMatakuliah_dosenId_matakuliahId_kelas_semester_tahun_key`(`dosenId`, `matakuliahId`, `kelas`, `semester`, `tahunAjaran`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Penelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `topik` VARCHAR(191) NOT NULL,
    `sumberDana` ENUM('MANDIRI', 'HIBAH') NOT NULL,
    `namaHibah` VARCHAR(191) NULL,
    `tahun` INTEGER NOT NULL,
    `ketuaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `topik` VARCHAR(191) NOT NULL,
    `sumberDana` ENUM('MANDIRI', 'HIBAH') NOT NULL,
    `namaHibah` VARCHAR(191) NULL,
    `tahun` INTEGER NOT NULL,
    `ketuaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnggotaPenelitian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `penelitianId` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `peran` VARCHAR(191) NULL,

    UNIQUE INDEX `AnggotaPenelitian_penelitianId_dosenId_key`(`penelitianId`, `dosenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnggotaPengabdian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengabdianId` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `peran` VARCHAR(191) NULL,

    UNIQUE INDEX `AnggotaPengabdian_pengabdianId_dosenId_key`(`pengabdianId`, `dosenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PublikasiJurnal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `namaJurnal` VARCHAR(191) NOT NULL,
    `tahun` INTEGER NOT NULL,
    `doi` VARCHAR(191) NULL,
    `url` VARCHAR(191) NULL,
    `dosenId` INTEGER NOT NULL,
    `penelitianId` INTEGER NULL,
    `pengabdianId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BukuAjar` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `penerbit` VARCHAR(191) NULL,
    `isbn` VARCHAR(191) NULL,
    `tahun` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `penelitianId` INTEGER NULL,
    `pengabdianId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hki` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(191) NOT NULL,
    `nomorPendaftaran` VARCHAR(191) NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `tahun` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `penelitianId` INTEGER NULL,
    `pengabdianId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Krs_mahasiswaId_matakuliahId_key` ON `Krs`(`mahasiswaId`, `matakuliahId`);

-- CreateIndex
CREATE UNIQUE INDEX `Matakuliah_kodeMatakuliah_key` ON `Matakuliah`(`kodeMatakuliah`);

-- AddForeignKey
ALTER TABLE `Prodi` ADD CONSTRAINT `Prodi_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `Jurusan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Matakuliah` ADD CONSTRAINT `Matakuliah_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengampuMatakuliah` ADD CONSTRAINT `PengampuMatakuliah_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PengampuMatakuliah` ADD CONSTRAINT `PengampuMatakuliah_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Penelitian` ADD CONSTRAINT `Penelitian_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengabdian` ADD CONSTRAINT `Pengabdian_ketuaId_fkey` FOREIGN KEY (`ketuaId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnggotaPenelitian` ADD CONSTRAINT `AnggotaPenelitian_penelitianId_fkey` FOREIGN KEY (`penelitianId`) REFERENCES `Penelitian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnggotaPenelitian` ADD CONSTRAINT `AnggotaPenelitian_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnggotaPengabdian` ADD CONSTRAINT `AnggotaPengabdian_pengabdianId_fkey` FOREIGN KEY (`pengabdianId`) REFERENCES `Pengabdian`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnggotaPengabdian` ADD CONSTRAINT `AnggotaPengabdian_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublikasiJurnal` ADD CONSTRAINT `PublikasiJurnal_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublikasiJurnal` ADD CONSTRAINT `PublikasiJurnal_penelitianId_fkey` FOREIGN KEY (`penelitianId`) REFERENCES `Penelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PublikasiJurnal` ADD CONSTRAINT `PublikasiJurnal_pengabdianId_fkey` FOREIGN KEY (`pengabdianId`) REFERENCES `Pengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BukuAjar` ADD CONSTRAINT `BukuAjar_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BukuAjar` ADD CONSTRAINT `BukuAjar_penelitianId_fkey` FOREIGN KEY (`penelitianId`) REFERENCES `Penelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BukuAjar` ADD CONSTRAINT `BukuAjar_pengabdianId_fkey` FOREIGN KEY (`pengabdianId`) REFERENCES `Pengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hki` ADD CONSTRAINT `Hki_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hki` ADD CONSTRAINT `Hki_penelitianId_fkey` FOREIGN KEY (`penelitianId`) REFERENCES `Penelitian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hki` ADD CONSTRAINT `Hki_pengabdianId_fkey` FOREIGN KEY (`pengabdianId`) REFERENCES `Pengabdian`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
