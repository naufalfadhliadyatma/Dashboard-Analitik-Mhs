import { useState } from 'react';
// import { Search, Filter, FileText, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { dummySkripsi } from '../data/skripsiData';
// import { Link } from 'react-router-dom';

// ============ [PAGE: SKRIPSI] ============
// [KOMPONEN] Skripsi - Halaman pemantauan progres Skripsi eksklusif
// [BACKEND] GET /api/skripsi - Mengambil semua data monitoring skripsi mahasiswa
// [BACKEND] PUT /api/skripsi/:nim - Memperbarui status skripsi mahasiswa

const STATUS_CONFIG = {
  'Belum Mulai': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  'Proposal Diajukan': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Seminar Proposal': { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'Penelitian': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Seminar Hasil': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
  'Sidang Skripsi': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Selesai': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
};

const Skripsi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterAngkatan, setFilterAngkatan] = useState('Semua Angkatan');

  const filteredData = dummySkripsi.filter((mhs) => {
    const matchSearch = mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) || mhs.nim.includes(searchTerm);
    const matchStatus = filterStatus === 'Semua Status' || mhs.status === filterStatus;
    const matchAngkatan = filterAngkatan === 'Semua Angkatan' || mhs.angkatan === filterAngkatan;
    return matchSearch && matchStatus && matchAngkatan;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-accent2 flex items-center gap-2">
          {/* <FileText size={24} className="text-accent1" /> */}
          Monitoring Skripsi
        </h1>
        <p className="text-sm text-text-muted mt-1">Pemantauan progres penyelesaian skripsi mahasiswa secara eksklusif</p>
      </div>

      <div className="card p-6">
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            {/* <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" /> */}
            <input 
              type="text" 
              placeholder="Cari NIM atau Nama..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="input-field pl-9" 
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field w-auto">
            <option value="Semua Status">Semua Status</option>
            {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterAngkatan} onChange={(e) => setFilterAngkatan(e.target.value)} className="input-field w-auto">
            <option value="Semua Angkatan">Semua Angkatan</option>
            {['2020', '2021', '2022', '2023', '2024'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 text-accent2 text-sm border-b border-secondary/20">
                <th className="p-3 font-semibold">NIM</th>
                <th className="p-3 font-semibold">Nama Mahasiswa</th>
                <th className="p-3 font-semibold">Angkatan</th>
                <th className="p-3 font-semibold">Judul Skripsi</th>
                <th className="p-3 font-semibold">Dosen Pembimbing</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Update Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors cursor-pointer text-sm" onClick={() => window.location.href = `/mahasiswa/${item.nim}`}>
                  <td className="p-3 font-medium text-accent2">{item.nim}</td>
                  <td className="p-3 font-semibold">{item.nama}</td>
                  <td className="p-3">{item.angkatan}</td>
                  <td className="p-3 text-text-muted truncate max-w-xs">{item.judul}</td>
                  <td className="p-3">{item.dosenPembimbing}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-max ${STATUS_CONFIG[item.status].bg} ${STATUS_CONFIG[item.status].text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[item.status].dot}`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">{item.tanggalUpdate}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-text-muted">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Skripsi;
