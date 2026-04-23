// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
// async function main() {
//   // await prisma.prodi.createMany({
//   //   data: [
//   //     {
//   //       nama: "Sarjana Terapan Teknik Listrik ",
//   //     },
//   //     {
//   //       nama: "Sarjana Terapan Teknik Informatika",
//   //     },
//   //     {
//   //       nama: "DIII Teknik Komputer",
//   //     },
//   //     {
//   //       nama: "DIII Teknik Listrik ",
//   //     },
//   //   ],
//   // });

//   // await prisma.mahasiswa.createMany({
//   //   data: [
//   //     {
//   //       nama: "Nopri Aristo Samuel Lumondo",
//   //       nim: "22023030",
//   //       jurusan: "Teknik Elektro",
//   //       prodiId: 1,
//   //     },
//   //     {
//   //       nama: "Aldi Carlis Mandagi",
//   //       nim: "22023036",
//   //       jurusan: "Teknik Elektro",
//   //       prodiId: 1,
//   //     },
//   //     {
//   //       nama: "Daniel William Edward Takasihaeng",
//   //       nim: "22023037",
//   //       jurusan: "Teknik Elektro",
//   //       prodiId: 1,
//   //     },
//   //   ],
//   // });

//   // await prisma.kartuMahasiswa.createMany({
//   //   data: [
//   //     {
//   //       nomorKartu: "N121",
//   //       mahasiswaId: 1,
//   //     },
//   //     {
//   //       nomorKartu: "N122",
//   //       mahasiswaId: 2,
//   //     },
//   //     {
//   //       nomorKartu: "N123",
//   //       mahasiswaId: 3,
//   //     },
//   //   ],
//   // });

//   // await prisma.matakuliah.createMany({
//   //   data: [
//   //     {
//   //       nama: "Matematika Teknik 1",
//   //     },
//   //     {
//   //       nama: "Agama",
//   //     },
//   //     {
//   //       nama: "Metode Penelitian",
//   //     },
//   //   ],
//   // });

//   // // await prisma.kartuMahasiswa.create({
//   //   data: {
//   //     nomorKartu: "N125",
//   //     mahasiswaId: 5,
//   //   },
//   // });

//   await prisma.kRS.createMany({
//     data: [
//       {
//         mahasiswaId: 1,
//         matakuliahId: 1,
//       },
//       {
//         mahasiswaId: 1,
//         matakuliahId: 2,
//       },
//       {
//         mahasiswaId: 1,
//         matakuliahId: 3,
//       },
//     ],
//   });
//   const dataProdi = await prisma.prodi.findMany();
//   console.log(dataProdi);
//   const data = await prisma.mahasiswa.findMany();
//   console.log(data);
//   const dataMK = await prisma.matakuliah.findMany();
//   console.log(dataMK);
//   const dataKartu = await prisma.kartuMahasiswa.findMany();
//   console.log(dataKartu);
//   const dataKRS = await prisma.kRS.findMany();
//   console.log(dataKRS);
// }
// main();

// const express = require("express");
// const { PrismaClient } = require("@prisma/client");
// const app = express();
// const prisma = new PrismaClient();
// app.use(express.json());
// app.get("/mahasiswa", async (req, res) => {
//   const data = await prisma.mahasiswa.findMany();
//   res.json(data);
// });
// app.listen(3000, () => {
//   console.log("server running di port 3000");
// });

const app = require("./src/app");
app.listen(3000, () => {
  console.log("Server running di http://localhost:3000");
});
