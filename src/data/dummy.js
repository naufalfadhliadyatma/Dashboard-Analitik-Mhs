// ============ [DATA DUMMY] ============
// File ini menampung seluruh state awal aplikasi frontend.

export const dummyMahasiswa = [
  { id: "1", nim: "2000018001", nama: "Ahmad Rizky", angkatan: "2020", ipk: 3.8, status: "Aktif", semester: 7, sks: 130, statusCapstone: "Penyusunan Skripsi" },
  { id: "2", nim: "2000018002", nama: "Budi Santoso", angkatan: "2020", ipk: 2.1, status: "Berisiko", semester: 7, sks: 85, statusCapstone: "Belum Mengambil" },
  { id: "3", nim: "2100018010", nama: "Citra Kirana", angkatan: "2021", ipk: 3.5, status: "Aktif", semester: 5, sks: 100, statusCapstone: "Seminar Proposal" },
  { id: "4", nim: "2100018015", nama: "Dewi Lestari", angkatan: "2021", ipk: 1.8, status: "Evaluasi", semester: 5, sks: 60, statusCapstone: "Belum Mengambil" },
  { id: "5", nim: "1900018111", nama: "Eko Prasetyo", angkatan: "2019", ipk: 3.2, status: "Lulus", semester: 8, sks: 144, statusCapstone: "Lulus" },
];

export const dummyPembimbing = [
  { id: "D01", nama: "Dr. Fathur Rahman, M.Kom.", bebanBimbingan: 8, kuota: 10 },
  { id: "D02", nama: "Rini Astuti, S.T., M.Cs.", bebanBimbingan: 10, kuota: 10 },
  { id: "D03", nama: "Andi Wijaya, M.Eng.", bebanBimbingan: 4, kuota: 12 },
];

export const dummyChartData = {
  gpaTrend: [
    { angkatan: "2018", ipk: 3.1 },
    { angkatan: "2019", ipk: 3.25 },
    { angkatan: "2020", ipk: 3.15 },
    { angkatan: "2021", ipk: 3.4 },
    { angkatan: "2022", ipk: 3.5 },
  ],
  gradStatus: [
    { name: "Lulus Tepat Waktu", value: 65, fill: "#06446B" },
    { name: "Terlambat", value: 25, fill: "#5790AB" },
    { name: "Drop Out", value: 10, fill: "#9CCDDB" },
  ],
  problematicCourses: [
    { course: "Kalkulus Lanjut", failCount: 45 },
    { course: "Algoritma Pemrograman", failCount: 30 },
    { course: "Basis Data", failCount: 20 },
    { course: "Sistem Operasi", failCount: 15 },
  ]
};
