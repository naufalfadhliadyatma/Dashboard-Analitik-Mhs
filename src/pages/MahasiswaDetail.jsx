import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, UserCircle, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';

// ============ [PAGE SECTION] ============
// [KOMPONEN] MahasiswaDetail - Halaman detail mahasiswa menggunakan sistem Tabs

// Data dummy tahapan capstone untuk demonstrasi
const capstoneStages = [
  { id: 1, label: 'Pengajuan Judul',       status: 'done',    date: 'Maret 2024'    },
  { id: 2, label: 'Seminar Proposal',      status: 'done',    date: 'Mei 2024'      },
  { id: 3, label: 'Penelitian & Bimbingan',status: 'active',  date: 'Sedang berjalan' },
  { id: 4, label: 'Seminar Hasil',         status: 'pending', date: '-'             },
  { id: 5, label: 'Sidang Munaqosyah',     status: 'pending', date: '-'             },
];

const StageIcon = ({ status }) => {
  if (status === 'done')
    return <CheckCircle size={20} className="text-green-500" />;
  if (status === 'active')
    return <Clock size={20} className="text-accent2 animate-pulse" />;
  return <AlertCircle size={20} className="text-gray-300" />;
};

const MahasiswaDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('profil');

  const mhs = dummyMahasiswa.find(m => m.nim === id) || dummyMahasiswa[0];
  const progressSks = Math.min(Math.round((mhs.sks / 144) * 100), 100);

  const tabs = [
    { key: 'profil',   label: 'Profil & Status'  },
    { key: 'riwayat',  label: 'Riwayat Nilai'    },
    { key: 'capstone', label: 'Status Akhir'      },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .mhs-detail-root,
        .mhs-detail-root * {
          font-family: 'Poppins', sans-serif !important;
        }

        .capstone-timeline {
          position: relative;
          padding-left: 36px;
        }

        .capstone-timeline::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: linear-gradient(to bottom, #06446B 0%, #9CCDDB 60%, #e5e7eb 100%);
          border-radius: 2px;
        }

        .capstone-stage {
          position: relative;
          padding: 12px 16px;
          border-radius: 12px;
          transition: background 0.2s;
        }

        .capstone-stage:hover {
          background: rgba(0,0,0,0.025);
        }

        .capstone-stage-icon {
          position: absolute;
          left: -27px;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border-radius: 50%;
          padding: 1px;
        }
      `}</style>

      <div className="mhs-detail-root max-w-5xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Back navigation */}
        <Link
          to="/evaluasi-studi"
          className="inline-flex items-center text-sm font-medium text-text-muted hover:text-accent2 transition-colors"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali ke Daftar
        </Link>

        {/* ── Header Profile Card ── */}
        <div className="card flex flex-col md:flex-row gap-6 items-start p-6">
          <div className="w-28 h-28 rounded-xl bg-secondary/20 flex-shrink-0 overflow-hidden border-2 border-white shadow-md">
            <img
              src={`https://ui-avatars.com/api/?name=${mhs.nama}&background=06446B&color=fff&size=128`}
              alt={`Foto ${mhs.nama}`}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-3">
              <div>
                <h1 className="text-xl font-bold text-text-main leading-tight">{mhs.nama}</h1>
                <p className="text-accent1 font-medium text-sm mt-0.5">{mhs.nim}</p>
              </div>
              <div className="px-4 py-2 bg-background rounded-xl border border-secondary/30 text-sm font-medium flex flex-col items-center min-w-[80px] shadow-sm">
                <span className="text-xs text-text-muted font-medium">IPK</span>
                <span className="text-xl font-bold text-accent2 leading-tight">{mhs.ipk.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-4">
              {[
                { icon: <Calendar size={15} className="mr-2 text-accent1 flex-shrink-0" />, label: `Angkatan ${mhs.angkatan}` },
                { icon: <UserCircle size={15} className="mr-2 text-accent1 flex-shrink-0" />, label: `Semester ${mhs.semester}` },
                { icon: <Mail size={15} className="mr-2 text-accent1 flex-shrink-0" />, label: `${mhs.nim}@webmail.uad.ac.id` },
                { icon: <Phone size={15} className="mr-2 text-accent1 flex-shrink-0" />, label: '0812-XXXX-XXXX' },
              ].map((item, i) => (
                <div key={i} className="flex items-center text-text-muted text-xs">
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="card p-0 overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-secondary/20 bg-background/50">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`px-6 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-accent2 text-accent2 bg-white'
                    : 'border-transparent text-text-muted hover:text-text-main hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* ── TAB: Profil & Status ── */}
            {activeTab === 'profil' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="font-semibold text-base text-text-main mb-3">Progress SKS Keseluruhan</h3>
                  <div className="flex justify-between text-xs font-medium mb-1.5">
                    <span>{mhs.sks} SKS Lulus</span>
                    <span className="text-text-muted">Target: 144 SKS</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div
                      className="bg-accent1 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${progressSks}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-text-muted mt-1">{progressSks}% Selesai</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Status Akademik Saat Ini
                    </span>
                    <p className="text-base font-bold text-text-main">{mhs.status}</p>
                  </div>
                  <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Dosen Pembimbing
                    </span>
                    <p className="text-base font-bold text-text-main">Dr. Fathur Rahman, M.Kom.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB: Riwayat Nilai ── */}
            {activeTab === 'riwayat' && (
              <div className="animate-in fade-in duration-300">
                <div className="overflow-x-auto border border-secondary/20 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-background text-text-muted uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Semester</th>
                        <th className="px-4 py-3 font-semibold">Mata Kuliah</th>
                        <th className="px-4 py-3 font-semibold text-center">SKS</th>
                        <th className="px-4 py-3 font-semibold text-center">Nilai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/20">
                      {[
                        { sem: 'Gasal 2023',  mk: 'Metode Penelitian',       sks: 3, nilai: 'A', color: 'text-green-600'  },
                        { sem: 'Genap 2023',  mk: 'Kecerdasan Buatan',       sks: 3, nilai: 'B', color: 'text-yellow-600' },
                        { sem: 'Genap 2023',  mk: 'Pemrograman Web Lanjut',  sks: 3, nilai: 'D', color: 'text-red-600'    },
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-text-muted">{row.sem}</td>
                          <td className="px-4 py-3 text-text-main font-medium">{row.mk}</td>
                          <td className="px-4 py-3 text-center text-text-muted">{row.sks}</td>
                          <td className={`px-4 py-3 text-center font-bold ${row.color}`}>{row.nilai}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── TAB: Status Akhir ── */}
            {activeTab === 'capstone' && (
              <div className="animate-in fade-in duration-300 space-y-6">
                {/* Summary card */}
                <div className="p-5 border border-secondary/20 rounded-xl flex items-center justify-between bg-blue-50/30">
                  <div>
                    <p className="text-xs text-text-muted mb-1 font-medium uppercase tracking-wider">Tahap Saat Ini</p>
                    <p className="text-lg font-bold text-accent2">{mhs.statusCapstone}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-accent1/20 flex items-center justify-center">
                    <BookOpen className="text-accent2" size={22} />
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold text-base text-text-main mb-4">Alur Tahapan Tugas Akhir</h3>
                  <div className="capstone-timeline space-y-1">
                    {capstoneStages.map((stage) => (
                      <div key={stage.id} className="capstone-stage">
                        <span className="capstone-stage-icon">
                          <StageIcon status={stage.status} />
                        </span>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${
                            stage.status === 'done'    ? 'text-text-main'   :
                            stage.status === 'active'  ? 'text-accent2'     :
                            'text-gray-400'
                          }`}>
                            {stage.label}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            stage.status === 'done'   ? 'bg-green-100 text-green-600'    :
                            stage.status === 'active' ? 'bg-blue-100 text-accent2'       :
                            'bg-gray-100 text-gray-400'
                          }`}>
                            {stage.status === 'done' ? 'Selesai' : stage.status === 'active' ? 'Aktif' : 'Belum'}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{stage.date}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dosen Pembimbing TA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Pembimbing I
                    </span>
                    <p className="text-sm font-bold text-text-main">Dr. Fathur Rahman, M.Kom.</p>
                  </div>
                  <div className="p-4 border border-secondary/20 rounded-xl bg-gray-50">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1">
                      Pembimbing II
                    </span>
                    <p className="text-sm font-bold text-text-main">Siti Nurhaliza, S.T., M.T.</p>
                  </div>
                </div>

                <p className="text-xs text-text-muted border-t border-secondary/20 pt-4">
                  {/* [BACKEND] GET /api/mahasiswa/:id/capstone — Ambil log historis tahapan capstone jika diperlukan nanti. */}
                  Data tahapan bersifat demonstrasi. Hubungkan ke endpoint backend untuk data real-time.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default MahasiswaDetail;