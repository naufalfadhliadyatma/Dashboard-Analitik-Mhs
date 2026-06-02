import { dummyMahasiswa } from '../data/dummy';
import { dummyKurikulum } from '../data/kurikulumData';
import { dummyUploadHistory } from '../data/uploadHistoryData';
import { dummyCapstone } from '../data/capstoneData';
import { dummySkripsi } from '../data/skripsiData';

// [BACKEND] GET /api/mahasiswa/:nim/analytics - Mengambil semua data analitik mahasiswa termasuk IPK, progress SKS, prediksi kelulusan.

// Konstanta konversi nilai
const GRADE_WEIGHTS = {
  'A': 4.00, 'A-': 3.75, 'B+': 3.50, 'B': 3.00, 'B-': 2.75,
  'C+': 2.50, 'C': 2.00, 'C-': 1.75, 'D+': 1.50, 'D': 1.00, 'E': 0.00
};

// Nilai lulus minimum C-
const isLulus = (nilai) => {
  return GRADE_WEIGHTS[nilai] >= 1.75; // C- dan ke atas lulus
};

// Helper untuk menghasilkan nilai acak berdasarkan IPK
const generateGradeForIpk = (targetIpk) => {
  if (targetIpk >= 3.8) return Math.random() > 0.3 ? 'A' : 'A-';
  if (targetIpk >= 3.5) return Math.random() > 0.5 ? 'A-' : 'B+';
  if (targetIpk >= 3.0) return Math.random() > 0.4 ? 'B' : (Math.random() > 0.5 ? 'B+' : 'B-');
  if (targetIpk >= 2.5) return Math.random() > 0.4 ? 'C+' : (Math.random() > 0.5 ? 'B-' : 'C');
  return Math.random() > 0.5 ? 'C' : 'C-';
};

export const useStudentAnalytics = (nim) => {
  // [REVISI] Memperbarui logika bisnis analitik akademik
  const student = dummyMahasiswa.find(m => m.nim === nim);
  if (!student) return null;

  // Semester saat ini
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const angkatanYear = parseInt(student.angkatan);
  const yearsPassed = currentYear - angkatanYear;
  let currentSemester = yearsPassed * 2;
  if (currentMonth >= 7) currentSemester += 1; // Ganjil mulai Agustus
  if (currentSemester < 1) currentSemester = 1;

  // Total SKS Kurikulum pasti 144
  const totalSksKurikulum = dummyKurikulum.reduce((acc, curr) => acc + curr.sks, 0); // Should be 144
  
  // Dummy riwayat nilai (generate secara dinamis)
  const targetSks = student.sks;
  let accumulatedSks = 0;
  const riwayatNilai = [];
  
  // Sort kurikulum by semester
  const sortedKurikulum = [...dummyKurikulum].sort((a, b) => a.semester - b.semester);

  for (const mk of sortedKurikulum) {
    if (mk.sks === 0) continue; // Skip AIK dari riwayat nilai SKS berbayar/reguler, nanti ditangani terpisah
    if (accumulatedSks >= targetSks) break;

    const nilaiHuruf = generateGradeForIpk(student.ipk);
    riwayatNilai.push({
      kode: mk.kode,
      nama: mk.nama,
      kelas: `SI-${mk.semester}${(['A','B','C'])[Math.floor(Math.random() * 3)]}`,
      wp: mk.jenis === 'Wajib' ? 'W' : 'P',
      sks: mk.sks,
      semester: mk.semester,
      nilai: nilaiHuruf,
      bobot: GRADE_WEIGHTS[nilaiHuruf]
    });
    accumulatedSks += mk.sks;
  }

  // Tambah riwayat tidak lulus untuk beberapa mahasiswa agar data bervariasi
  if (student.ipk < 3.0) {
    riwayatNilai.push({
      kode: '231610730',
      nama: 'Matematika Dasar',
      kelas: 'SI-1A',
      wp: 'W',
      sks: 3,
      semester: 1,
      nilai: student.ipk < 2.0 ? 'E' : 'D+',
      bobot: student.ipk < 2.0 ? 0.0 : 1.5
    });
    riwayatNilai.push({
      kode: '231630530',
      nama: 'Matematika Diskrit',
      kelas: 'SI-3C',
      wp: 'W',
      sks: 3,
      semester: 3,
      nilai: 'D',
      bobot: 1.0
    });
  }

  const sksTidakLulusList = riwayatNilai.filter(r => !isLulus(r.nilai));
  const totalSksTidakLulus = sksTidakLulusList.reduce((acc, curr) => acc + curr.sks, 0);

  // Mata kuliah wajib belum diambil
  const diambilKodes = riwayatNilai.map(r => r.kode);
  const belumDiambil = dummyKurikulum
    .filter(k => k.jenis === 'Wajib' && k.sks > 0 && !diambilKodes.includes(k.kode));

  // Estimasi kelulusan
  const sksSisa = Math.max(0, 144 - student.sks);
  const avgSksPerSemester = Math.max(1, student.sks / currentSemester);
  const sisaSemester = Math.ceil(sksSisa / avgSksPerSemester);
  const targetSemester = currentSemester + sisaSemester;
  const estimasiKelulusan = `Semester ${targetSemester % 2 === 0 ? 'Genap' : 'Ganjil'} ${angkatanYear + Math.floor(targetSemester/2)}/${angkatanYear + Math.floor(targetSemester/2) + 1}`;

  // AIK Status
  const aikData = student.aikData || [];
  const wajibSelesaiCount = aikData.filter(a => a.jenis === 'Wajib' && a.status === 'Lulus').length;
  const pilihanSelesaiCount = aikData.filter(a => a.jenis === 'Pilihan' && a.status === 'Lulus').length;
  
  const aikStatus = {
    totalSelesai: wajibSelesaiCount + pilihanSelesaiCount,
    wajibSelesai: wajibSelesaiCount >= 2,
    pilihanSelesai: pilihanSelesaiCount,
    isComplete: wajibSelesaiCount >= 2 && pilihanSelesaiCount >= 2,
    detail: aikData
  };

  // Prediksi risiko
  let prediksiRisiko = 'Tepat Waktu';
  if (targetSemester > 10 || student.ipk < 2.0 || totalSksTidakLulus > 15) {
    prediksiRisiko = 'Terlambat';
  } else if (targetSemester > 8 || student.ipk < 2.5 || totalSksTidakLulus > 6) {
    prediksiRisiko = 'Berisiko Terlambat';
  }
  // Jika mendekati semester 7/8 tapi AIK belum beres
  if (currentSemester >= 7 && !aikStatus.isComplete && prediksiRisiko === 'Tepat Waktu') {
    prediksiRisiko = 'Berisiko Terlambat';
  }

  // Riwayat Upload KHS
  const riwayatKhs = dummyUploadHistory.filter(h => h.nim === nim);

  // Status Akhir
  const capstone = dummyCapstone.find(c => c.nim === nim) || { status: student.statusCapstone || 'Belum Mulai', judul: '-' };
  const skripsi = dummySkripsi.find(s => s.nim === nim) || { status: student.judulSkripsiDiajukan ? 'Penyusunan Skripsi' : 'Belum Mulai', judul: student.judulSkripsiDiajukan || '-', dosenPembimbing: '-' };

  return {
    student,
    currentSemester,
    ipk: student.ipk,
    totalSks: student.sks,
    totalSksKurikulum: 144,
    riwayatNilai,
    sksTidakLulusList,
    totalSksTidakLulus,
    belumDiambil,
    estimasiKelulusan,
    prediksiRisiko,
    aikStatus,
    riwayatKhs,
    capstone,
    skripsi
  };
};
