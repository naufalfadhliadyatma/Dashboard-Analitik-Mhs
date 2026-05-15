import { useState } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';
import { Link } from 'react-router-dom';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Capstone - Halaman pemantauan progres tugas akhir/skripsi

const Capstone = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const filteredData = dummyMahasiswa.filter((mhs) => {
    const matchSearch = mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) || mhs.nim.includes(searchTerm);
    const matchStatus = filterStatus === 'Semua' ? true : mhs.statusCapstone === filterStatus;
    return matchSearch && matchStatus;
  });

  const getCapstoneBadge = (status) => {
    switch (status) {
      case 'Lulus': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">Lulus</span>;
      case 'Pendadaran': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">Pendadaran</span>;
      case 'Penyusunan Skripsi': return <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">Penyusunan Skripsi</span>;
      case 'Seminar Proposal': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium border border-yellow-200">Seminar Proposal</span>;
      case 'Belum Mengambil': return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200">Belum Mengambil</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent2 flex items-center">
            <BookOpen className="mr-2" size={24} /> Status Capstone/Skripsi
          </h1>
          <p className="text-text-muted text-sm mt-1">Monitoring progres penyelesaian tugas akhir mahasiswa</p>
        </div>
      </div>

      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-secondary/20 flex flex-col sm:flex-row justify-between gap-4 bg-background/30">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Cari NIM atau Nama..." 
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter size={18} className="text-text-muted" />
            <select 
              className="input-field py-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Belum Mengambil">Belum Mengambil</option>
              <option value="Seminar Proposal">Seminar Proposal</option>
              <option value="Penyusunan Skripsi">Penyusunan Skripsi</option>
              <option value="Pendadaran">Pendadaran</option>
              <option value="Lulus">Lulus</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text-muted uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">NIM</th>
                <th className="px-6 py-4 font-medium tracking-wider">Nama Mahasiswa</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Angkatan</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status Capstone</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {filteredData.length > 0 ? (
                filteredData.map((mhs) => (
                  <tr key={mhs.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{mhs.nim}</td>
                    <td className="px-6 py-4">{mhs.nama}</td>
                    <td className="px-6 py-4 text-center">{mhs.angkatan}</td>
                    <td className="px-6 py-4">{getCapstoneBadge(mhs.statusCapstone)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/mahasiswa/${mhs.nim}`} className="text-accent1 hover:text-accent2 font-medium transition-colors">
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-muted">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Capstone;
