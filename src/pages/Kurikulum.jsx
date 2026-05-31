import { useState } from 'react';
import { dummyKurikulum } from '../data/kurikulumData';
import { BookOpen, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ============ [PAGE: KURIKULUM] ============
// [KOMPONEN] Kurikulum - Halaman manajemen mata kuliah untuk Admin

// [BACKEND] GET /api/kurikulum - Mengambil semua data kurikulum
// [BACKEND] POST /api/kurikulum - Menambahkan mata kuliah baru ke kurikulum
// [BACKEND] PUT /api/kurikulum/:id - Mengedit data mata kuliah
// [BACKEND] DELETE /api/kurikulum/:id - Menghapus mata kuliah dari kurikulum

const Kurikulum = () => {
  const [data, setData] = useState(dummyKurikulum);
  const [activeTab, setActiveTab] = useState('Wajib');
  const [search, setSearch] = useState('');
  const [filterSemester, setFilterSemester] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ kode: '', nama: '', sks: 3, semester: 1, jenis: 'Wajib' });

  const wajibData = data.filter(d => d.jenis === 'Wajib');
  const pilihanData = data.filter(d => d.jenis === 'Pilihan');

  const currentData = activeTab === 'Wajib' ? wajibData : pilihanData;
  const filteredData = currentData.filter(d => {
    const matchSearch = d.nama.toLowerCase().includes(search.toLowerCase()) || d.kode.toLowerCase().includes(search.toLowerCase());
    const matchSemester = filterSemester === 'all' || d.semester.toString() === filterSemester;
    return matchSearch && matchSemester;
  });

  const totalSKSWajib = wajibData.reduce((acc, curr) => acc + curr.sks, 0);
  const totalSKSPilihan = pilihanData.reduce((acc, curr) => acc + curr.sks, 0);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm(item);
    } else {
      setEditId(null);
      setForm({ kode: '', nama: '', sks: 3, semester: 1, jenis: activeTab });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.kode || !form.nama || form.sks < 1 || form.sks > 6) {
      toast.error('Data tidak valid!');
      return;
    }

    if (editId) {
      setData(data.map(d => d.id === editId ? { ...form, id: editId } : d));
      toast.success('Mata kuliah diperbarui!');
    } else {
      setData([...data, { ...form, id: Date.now().toString() }]);
      toast.success('Mata kuliah ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus mata kuliah ini?')) {
      setData(data.filter(d => d.id !== id));
      toast.success('Mata kuliah dihapus!');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-accent2 flex items-center gap-2">
            <BookOpen size={24} className="text-accent1" />
            Manajemen Kurikulum
          </h1>
          <p className="text-sm text-text-muted mt-1">Kelola data mata kuliah wajib dan pilihan</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Mata Kuliah
        </button>
      </div>

      <div className="card grid grid-cols-4 gap-4 p-4">
        <div className="text-center p-3 bg-secondary/10 rounded-lg">
          <p className="text-xs font-semibold text-text-muted">Total MK Wajib</p>
          <p className="text-2xl font-bold text-accent2">{wajibData.length}</p>
        </div>
        <div className="text-center p-3 bg-secondary/10 rounded-lg">
          <p className="text-xs font-semibold text-text-muted">Total SKS Wajib</p>
          <p className="text-2xl font-bold text-accent1">{totalSKSWajib}</p>
        </div>
        <div className="text-center p-3 bg-secondary/10 rounded-lg">
          <p className="text-xs font-semibold text-text-muted">Total MK Pilihan</p>
          <p className="text-2xl font-bold text-accent2">{pilihanData.length}</p>
        </div>
        <div className="text-center p-3 bg-secondary/10 rounded-lg">
          <p className="text-xs font-semibold text-text-muted">Total SKS Pilihan</p>
          <p className="text-2xl font-bold text-accent1">{totalSKSPilihan}</p>
        </div>
      </div>

      <div className="card flex flex-col p-6">
        <div className="flex gap-4 mb-6 border-b border-secondary/20 pb-4">
          <button onClick={() => setActiveTab('Wajib')} className={`font-semibold pb-2 border-b-2 transition-all ${activeTab === 'Wajib' ? 'border-accent2 text-accent2' : 'border-transparent text-text-muted'}`}>Mata Kuliah Wajib</button>
          <button onClick={() => setActiveTab('Pilihan')} className={`font-semibold pb-2 border-b-2 transition-all ${activeTab === 'Pilihan' ? 'border-accent2 text-accent2' : 'border-transparent text-text-muted'}`}>Mata Kuliah Pilihan</button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input type="text" placeholder="Cari nama / kode..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 py-1.5 text-sm" />
          </div>
          <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="input-field w-auto py-1.5 text-sm">
            <option value="all">Semua Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 text-accent2 text-sm">
                <th className="p-3 font-semibold rounded-tl-lg">Kode MK</th>
                <th className="p-3 font-semibold">Nama Mata Kuliah</th>
                <th className="p-3 font-semibold text-center">SKS</th>
                <th className="p-3 font-semibold text-center">Semester</th>
                <th className="p-3 font-semibold">Jenis</th>
                <th className="p-3 font-semibold text-right rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors text-sm">
                  <td className="p-3 font-medium text-accent2">{item.kode}</td>
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3 text-center font-semibold">{item.sks}</td>
                  <td className="p-3 text-center">{item.semester}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${item.jenis === 'Wajib' ? 'bg-accent1/20 text-accent2' : 'bg-secondary/30 text-accent2'}`}>{item.jenis}</span>
                  </td>
                  <td className="p-3 flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-accent1 hover:bg-accent1/10 rounded-md"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-text-muted">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-slide-in-up">
            <div className="flex justify-between items-center p-4 border-b border-secondary/20 bg-primary">
              <h3 className="font-bold text-accent2">{editId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-accent2"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Kode MK</label>
                <input type="text" value={form.kode} onChange={e => setForm({...form, kode: e.target.value})} className="input-field" placeholder="SIW101" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Nama Mata Kuliah</label>
                <input type="text" value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="input-field" placeholder="Algoritma" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">SKS (1-6)</label>
                  <input type="number" min="1" max="6" value={form.sks} onChange={e => setForm({...form, sks: parseInt(e.target.value) || 0})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-1">Semester</label>
                  <select value={form.semester} onChange={e => setForm({...form, semester: parseInt(e.target.value)})} className="input-field">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted mb-1">Jenis</label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="jenis" checked={form.jenis === 'Wajib'} onChange={() => setForm({...form, jenis: 'Wajib'})} /> Wajib</label>
                  <label className="flex items-center gap-2 text-sm"><input type="radio" name="jenis" checked={form.jenis === 'Pilihan'} onChange={() => setForm({...form, jenis: 'Pilihan'})} /> Pilihan</label>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-secondary/20 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="btn-outline text-sm">Batal</button>
              <button onClick={handleSave} className="btn-primary text-sm">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kurikulum;
