// [REVISI] Data dummy untuk monitoring Skripsi dengan 20 mahasiswa
export const dummySkripsi = [
  ...Array.from({ length: 20 }, (_, i) => {
    const angkatans = ['2020', '2021', '2022', '2023', '2024'];
    const statuses = ["Belum Mulai", "Proposal Diajukan", "Seminar Proposal", "Penelitian", "Seminar Hasil", "Sidang Skripsi", "Selesai"];
    return {
      id: `S${i+1}`,
      nim: `2200018${(i+1).toString().padStart(3, '0')}`,
      nama: `Mahasiswa Skripsi ${i+1}`,
      angkatan: angkatans[i % 5],
      judul: `Analisis Sistem Cerdas Berbasis AI ke-${i+1}`,
      dosenPembimbing: `Dr. Dosen ${i % 3 + 1}`,
      status: statuses[i % 7],
      tanggalUpdate: `2024-06-${(i % 28 + 1).toString().padStart(2, '0')}`
    };
  })
];
