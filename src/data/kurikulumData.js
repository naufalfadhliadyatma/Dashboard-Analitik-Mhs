// [REVISI] Data dummy kurikulum (wajib 40 MK, pilihan 15 MK)
export const dummyKurikulum = [
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `W${i+1}`,
    kode: `SIW${(i+1).toString().padStart(3, '0')}`,
    nama: `Mata Kuliah Wajib ${i+1}`,
    sks: 3,
    semester: (i % 8) + 1,
    jenis: 'Wajib'
  })),
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `P${i+1}`,
    kode: `SIP${(i+1).toString().padStart(3, '0')}`,
    nama: `Mata Kuliah Pilihan ${i+1}`,
    sks: 3,
    semester: (i % 4) + 5, // Pilihan di semester 5-8
    jenis: 'Pilihan'
  }))
];
