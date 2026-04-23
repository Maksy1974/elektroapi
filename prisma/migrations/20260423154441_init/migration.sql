-- CreateTable
CREATE TABLE `Mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `jurusan` VARCHAR(191) NOT NULL,
    `prodiId` INTEGER NOT NULL,
    `foto` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Mahasiswa_nim_key`(`nim`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KartuMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorKartu` VARCHAR(191) NOT NULL,
    `mahasiswaId` INTEGER NOT NULL,

    UNIQUE INDEX `KartuMahasiswa_mahasiswaId_key`(`mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Matakuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Krs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mahasiswaId` INTEGER NOT NULL,
    `matakuliahId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KartuMahasiswa` ADD CONSTRAINT `KartuMahasiswa_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Krs` ADD CONSTRAINT `Krs_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Krs` ADD CONSTRAINT `Krs_matakuliahId_fkey` FOREIGN KEY (`matakuliahId`) REFERENCES `Matakuliah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
