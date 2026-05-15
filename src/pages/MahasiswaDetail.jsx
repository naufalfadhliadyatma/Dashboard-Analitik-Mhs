import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, UserCircle } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';

// ============ [PAGE SECTION] ============
// [KOMPONEN] MahasiswaDetail - Halaman detail mahasiswa menggunakan sistem Tabs

const MahasiswaDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profil');

  // Cari data, jika tidak ada fallback ke yang pertama untuk demonstrasi
  const mhs = dummyMahasiswa.find(m => m.nim === id) || dummyMahasiswa[0];
  const progressSks = Math.min(Math.round((mhs.sks / 144) * 100), 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back navigation */}
      <Link to="/evaluasi-studi" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-accent2 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar
      </Link>

      {/* Header Profile Card */}
      <div className="card flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 rounded-xl bg-secondary/20 flex-shrink-0 overflow-hidden border-2 border-white shadow-md relative">
          {/* GANTI: Ubah src berikut dengan path gambar Anda, misal /assets/foto-mahasiswa/${mhs.nim}.jpg */}
          <img 
            src={`https://ui-avatars.com/api/?name=${mhs.nama}&background=06446B&color=fff&size=128`} 
            alt={`Foto ${mhs.nama}`} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-main">{mhs.nama}</h1>
              <p className="text-accent1 font-medium">{mhs.nim}</p>
            </div>
            <div className="px-3 py-1 bg-background rounded-lg border border-secondary/30 text-sm font-medium flex flex-col items-center min-w-[80px]">
              <span className="text-xs text-text-muted">IPK</span>
              <span className="text-xl text-accent2">{mhs.ipk.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-6">
            <div className="flex items-center text-text-muted">
              <Calendar size={16} className="mr-2 text-accent1" /> Angkatan {mhs.angkatan}
            </div>
            <div className="flex items-center text-text-muted">
              <UserCircle size={16} className="mr-2 text-accent1" /> Semester {mhs.semester}
            </div>
            <div className="flex items-center text-text-muted">
              <Mail size={16} className="mr-2 text-accent1" /> {mhs.nim}@webmail.uad.ac.id
            </div>
            <div className="flex items-center text-text-muted">
              <Phone size={16} className="mr-2 text-accent1" /> 0812-XXXX-XXXX
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card p-0 overflow-hidden">
        <div className="flex border-b border-secondary/20 bg-background/50">
          <button 
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profil' ? 'border-accent2 text-accent2 bg-white' : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/50'}`}
            onClick={() => setActiveTab('profil')}
          >
            Profil & Status
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'riwayat' ? 'border-accent2 text-accent2 bg-white' : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/50'}`}
            onClick={() => setActiveTab('riwayat')}
          >
            Riwayat Nilai
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'capstone' ? 'border-accent2 text-accent2 bg-white' : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/50'}`}
            onClick={() => setActiveTab('capstone')}
          >
            Status Akhir
          </button>
        </div>

        <div className="p-6">
          {/* Tab Content: Profil */}
          {activeTab === 'profil' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="mb-8">
                <h3 className="font-semibold text-lg text-text-main mb-4">Progress SKS Keseluruhan</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{mhs.sks} SKS Lulus</span>
                  <span className="text-text-muted">Target: 144 SKS</span>
                </div>
                <div className="w-full bg-background rounded-full h-3 mb-1">
                  <div className="bg-accent1 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressSks}%` }}></div>
                </div>
                <p className="text-xs text-right text-text-muted">{progressSks}% Selesai</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Status Akademik Saat Ini</span>
                  <p className="text-lg font-bold text-text-main">{mhs.status}</p>
                </div>
                <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">Dosen Pembimbing</span>
                  <p className="text-lg font-bold text-text-main">Dr. Fathur Rahman, M.Kom.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Riwayat */}
          {activeTab === 'riwayat' && (
            <div className="animate-in fade-in duration-300">
              <div className="overflow-x-auto border border-secondary/20 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-background text-text-muted uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Semester</th>
                      <th className="px-4 py-3 font-medium">Mata Kuliah</th>
                      <th className="px-4 py-3 font-medium text-center">SKS</th>
                      <th className="px-4 py-3 font-medium text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary/20">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">Gasal 2023</td>
                      <td className="px-4 py-3">Metode Penelitian</td>
                      <td className="px-4 py-3 text-center">3</td>
                      <td className="px-4 py-3 text-center font-bold text-green-600">A</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">Genap 2023</td>
                      <td className="px-4 py-3">Kecerdasan Buatan</td>
                      <td className="px-4 py-3 text-center">3</td>
                      <td className="px-4 py-3 text-center font-bold text-yellow-600">B</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3">Genap 2023</td>
                      <td className="px-4 py-3">Pemrograman Web Lanjut</td>
                      <td className="px-4 py-3 text-center">3</td>
                      <td className="px-4 py-3 text-center font-bold text-red-600">D</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Capstone */}
          {activeTab === 'capstone' && (
            <div className="animate-in fade-in duration-300">
              <h3 className="font-semibold text-lg text-text-main mb-4">Status Tugas Akhir</h3>
              <div className="p-6 border border-secondary/20 rounded-xl flex items-center justify-between bg-blue-50/30">
                <div>
                  <p className="text-sm text-text-muted mb-1">Tahap Saat Ini</p>
                  <p className="text-xl font-bold text-accent2">{mhs.statusCapstone}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-accent1/20 flex items-center justify-center">
                  <BookOpen className="text-accent2" size={24} />
                </div>
              </div>
              <p className="text-sm mt-4 text-text-muted">
                // [BACKEND] GET /api/mahasiswa/:id/capstone - Ambil log historis tahapan capstone jika diperlukan nanti.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MahasiswaDetail;
