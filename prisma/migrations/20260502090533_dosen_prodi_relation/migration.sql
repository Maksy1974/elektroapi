-- Tambah kolom nullable dulu (aman jika sudah ada baris di Dosen)
ALTER TABLE `Dosen` ADD COLUMN `prodiId` INTEGER NULL;

-- Isi prodiId untuk data lama (minimal satu baris di Prodi harus ada)
UPDATE `Dosen`
SET `prodiId` = (SELECT `id` FROM `Prodi` ORDER BY `id` ASC LIMIT 1)
WHERE `prodiId` IS NULL
  AND EXISTS (SELECT 1 FROM `Prodi` LIMIT 1);

-- Wajibkan prodiId (gagal jika masih ada NULL — buat Prodi dulu atau hapus Dosen tanpa prodi)
ALTER TABLE `Dosen` MODIFY `prodiId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Dosen` ADD CONSTRAINT `Dosen_prodiId_fkey` FOREIGN KEY (`prodiId`) REFERENCES `Prodi`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
