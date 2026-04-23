-- CreateTable
CREATE TABLE `KartuMahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomorKartu` VARCHAR(191) NOT NULL,
    `mahasiswaId` INTEGER NOT NULL,

    UNIQUE INDEX `KartuMahasiswa_mahasiswaId_key`(`mahasiswaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KartuMahasiswa` ADD CONSTRAINT `KartuMahasiswa_mahasiswaId_fkey` FOREIGN KEY (`mahasiswaId`) REFERENCES `Mahasiswa`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
