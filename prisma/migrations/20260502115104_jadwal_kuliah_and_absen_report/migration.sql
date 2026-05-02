-- CreateTable
CREATE TABLE `JadwalKuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prodiId` INTEGER NOT NULL,
    `matakuliahId` INTEGER NOT NULL,
    `dosenId` INTEGER NOT NULL,
    `laboratoriumId` INTEGER NULL,
    `kelas` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `tahunAjaran` VARCHAR(191) NOT NULL,
    `hari` ENUM('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU') NOT NULL,
    `jamMulai` TIME NOT NULL,
    `jamSelesai` TIME NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JadwalKuliah` ADD CONSTRAINT `JadwalKuliah_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalKuliah` ADD CONSTRAINT `JadwalKuliah_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalKuliah` ADD CONSTRAINT `JadwalKuliah_dosenId_fkey` FOREIGN KEY (`dosenId`) REFERENCES `Dosen`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JadwalKuliah` ADD CONSTRAINT `JadwalKuliah_laboratoriumId_fkey` FOREIGN KEY (`laboratoriumId`) REFERENCES `Laboratorium`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
