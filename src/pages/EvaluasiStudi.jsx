import { useState } from 'react';
import { Search, Download, Filter } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ============ [PAGE SECTION] ============
// [KOMPONEN] EvaluasiStudi - Halaman daftar mahasiswa dengan fokus pada yang berstatus berisiko/evaluasi

const EvaluasiStudi = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Filter logika
  const filteredData = dummyMahasiswa.filter((mhs) => {
    const matchSearch = mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) || mhs.nim.includes(searchTerm);
    const matchStatus = filterStatus === 'Semua' ? true : mhs.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleExport = (type) => {
    // Simulasi eksport
    toast.success(`Berhasil mengekspor data ke format ${type}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Aktif': return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>;
      case 'Berisiko': return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Berisiko</span>;
      case 'Evaluasi': return <span className="px-2.5 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Evaluasi</span>;
      case 'Lulus': return <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Lulus</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent2">Evaluasi Studi Mahasiswa</h1>
          <p className="text-text-muted text-sm mt-1">Daftar mahasiswa beserta status akademiknya</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => handleExport('Excel')} className="btn-outline flex items-center text-sm py-1.5">
            <Download size={16} className="mr-2" /> Excel
          </button>
          <button onClick={() => handleExport('PDF')} className="btn-outline flex items-center text-sm py-1.5">
            <Download size={16} className="mr-2" /> PDF
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card flex-1 flex flex-col overflow-hidden p-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-secondary/20 flex flex-col sm:flex-row justify-between gap-4">
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
              <option value="Aktif">Aktif</option>
              <option value="Berisiko">Berisiko</option>
              <option value="Evaluasi">Evaluasi</option>
              <option value="Lulus">Lulus</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-background text-text-muted uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">NIM</th>
                <th className="px-6 py-4 font-medium tracking-wider">Nama Mahasiswa</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Angkatan</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">IPK</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">SKS</th>
                <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/20">
              {filteredData.length > 0 ? (
                filteredData.map((mhs) => (
                  <tr key={mhs.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text-main">{mhs.nim}</td>
                    <td className="px-6 py-4">{mhs.nama}</td>
                    <td className="px-6 py-4 text-center">{mhs.angkatan}</td>
                    <td className="px-6 py-4 text-center font-medium">{mhs.ipk.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">{mhs.sks}</td>
                    <td className="px-6 py-4">{getStatusBadge(mhs.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/mahasiswa/${mhs.nim}`} className="text-accent1 hover:text-accent2 font-medium transition-colors">
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={48} className="text-secondary/50 mb-4" />
                      <p className="text-base font-medium">Tidak ada data ditemukan</p>
                      <p className="text-sm mt-1">Coba ubah kata kunci pencarian atau filter status.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Dummy */}
        <div className="p-4 border-t border-secondary/20 flex justify-between items-center bg-white">
          <span className="text-sm text-text-muted">Menampilkan {filteredData.length} dari {dummyMahasiswa.length} data</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-secondary/30 rounded-md text-sm hover:bg-background disabled:opacity-50" disabled>Sebelumnya</button>
            <button className="px-3 py-1 bg-accent1 text-white rounded-md text-sm font-medium">1</button>
            <button className="px-3 py-1 border border-secondary/30 rounded-md text-sm hover:bg-background">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluasiStudi;
