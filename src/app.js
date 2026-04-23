require("dotenv").config();
const express = require("express");
const mahasiswaRoutes = require("./routes/mahasiswaRoutes");
const prodiRoutes = require("./routes/prodiRoutes");
const matakuliahRoutes = require("./routes/matakuliahRoutes");
const krsRoutes = require("./routes/krsRoutes");
const kartuRoutes = require("./routes/kartuRoutes");
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Sistem Akademik berjalan");
});
app.use("/mahasiswa", mahasiswaRoutes);
app.use("/prodi", prodiRoutes);
app.use("/matakuliah", matakuliahRoutes);
app.use("/krs", krsRoutes);
app.use("/kartu", kartuRoutes);
console.log(process.env.CLOUD_NAME);
module.exports = app;
