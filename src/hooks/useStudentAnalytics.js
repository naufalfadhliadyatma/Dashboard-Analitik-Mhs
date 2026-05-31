import { dummyMahasiswa } from '../data/dummy';
import { dummyKurikulum } from '../data/kurikulumData';
import { dummyUploadHistory } from '../data/uploadHistoryData';
import { dummyCapstone } from '../data/capstoneData';
import { dummySkripsi } from '../data/skripsiData';

// [BACKEND] GET /api/mahasiswa/:nim/analytics - Mengambil semua data analitik mahasiswa termasuk IPK, progress SKS, prediksi kelulusan.

export const useStudentAnalytics = (nim) => {
  // Data dasar mahasiswa
  const student = dummyMahasiswa.find(m => m.nim === nim);
  
  if (!student) return null;

  // Semester saat ini
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const angkatanYear = parseInt(student.angkatan);
  const yearsPassed = currentYear - angkatanYear;
  let currentSemester = yearsPassed * 2;
  if (currentMonth >= 7) currentSemester += 1; // Anggap Ganjil mulai Agustus
  if (currentSemester < 1) currentSemester = 1;

  // IPK & Total SKS
  const ipk = student.ipk;
  const totalSks = student.sks;

  // Kurikulum Data
  const wajibSks = dummyKurikulum.filter(k => k.jenis === 'Wajib').reduce((acc, curr) => acc + curr.sks, 0);
  const totalSksKurikulum = wajibSks + 15 * 3; // Estimasi 15 matkul pilihan * 3 sks

  // Dummy riwayat nilai 
  // Untuk keperluan demo, kita asumsikan mahasiswa telah mengambil beberapa matkul wajib dari kurikulum
  const riwayatNilai = dummyKurikulum.slice(0, Math.floor(totalSks / 3)).map(k => ({
    kode: k.kode,
    nama: k.nama,
    sks: k.sks,
    semester: k.semester,
    nilai: 'A',
    bobot: 4.0
  }));

  // Tambah beberapa nilai buruk untuk demo "SKS Tidak Lulus"
  if (nim === '2200018001') {
    riwayatNilai.push({
      kode: 'SIW999',
      nama: 'Matematika Diskrit',
      sks: 3,
      semester: 1,
      nilai: 'D',
      bobot: 1.0
    });
  }

  const sksTidakLulusList = riwayatNilai.filter(r => r.nilai === 'D' || r.nilai === 'E');
  const totalSksTidakLulus = sksTidakLulusList.reduce((acc, curr) => acc + curr.sks, 0);

  // Mata kuliah belum diambil (hanya wajib)
  const diambilKodes = riwayatNilai.map(r => r.kode);
  const belumDiambil = dummyKurikulum
    .filter(k => k.jenis === 'Wajib' && !diambilKodes.includes(k.kode));

  // Estimasi kelulusan
  const sksSisa = totalSksKurikulum - totalSks;
  const avgSksPerSemester = Math.max(1, totalSks / currentSemester);
  const sisaSemester = Math.ceil(sksSisa / avgSksPerSemester);
  const targetSemester = currentSemester + sisaSemester;
  const estimasiKelulusan = `Semester ${targetSemester % 2 === 0 ? 'Genap' : 'Ganjil'} ${angkatanYear + Math.floor(targetSemester/2)}/${angkatanYear + Math.floor(targetSemester/2) + 1}`;

  // Prediksi risiko
  let prediksiRisiko = 'Tepat Waktu';
  if (targetSemester > 8 && targetSemester <= 10) prediksiRisiko = 'Berisiko Terlambat';
  else if (targetSemester > 10) prediksiRisiko = 'Terlambat';

  // Riwayat Upload KHS
  const riwayatKhs = dummyUploadHistory.filter(h => h.nim === nim);

  // Status Akhir
  const capstone = dummyCapstone.find(c => c.nim === nim) || { status: 'Belum Mulai', judul: '-' };
  const skripsi = dummySkripsi.find(s => s.nim === nim) || { status: 'Belum Mulai', judul: '-' };

  return {
    student,
    currentSemester,
    ipk,
    totalSks,
    totalSksKurikulum,
    riwayatNilai,
    sksTidakLulusList,
    totalSksTidakLulus,
    belumDiambil,
    estimasiKelulusan,
    prediksiRisiko,
    riwayatKhs,
    capstone,
    skripsi
  };
};
