-- CreateTable
CREATE TABLE `Matakuliah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MahasiswaToMatakuliah` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MahasiswaToMatakuliah_AB_unique`(`A`, `B`),
    INDEX `_MahasiswaToMatakuliah_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MahasiswaToMatakuliah` ADD CONSTRAINT `_MahasiswaToMatakuliah_A_fkey` FOREIGN KEY (`A`) REFERENCES `Mahasiswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MahasiswaToMatakuliah` ADD CONSTRAINT `_MahasiswaToMatakuliah_B_fkey` FOREIGN KEY (`B`) REFERENCES `Matakuliah`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
