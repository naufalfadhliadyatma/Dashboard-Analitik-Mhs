import { useState } from 'react';
import { dummyPembimbing } from '../data/dummy';
import { Edit2, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Pembimbing - Halaman kelola data dosen pembimbing beserta beban mahasiswanya

const Pembimbing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [newKuota, setNewKuota] = useState(0);

  const openEditModal = (dosen) => {
    setSelectedDosen(dosen);
    setNewKuota(dosen.kuota);
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    // [BACKEND] PUT /api/pembimbing/:id - Update kuota pembimbing
    toast.success(`Kuota bimbingan ${selectedDosen.nama} berhasil diperbarui!`);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-accent2 flex items-center">
          <Users className="mr-2" size={24} /> Kelola Pembimbing
        </h1>
        <p className="text-text-muted text-sm mt-1">Daftar dosen pembimbing akademik dan tugas akhir</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyPembimbing.map((dosen) => {
          const loadPercentage = Math.round((dosen.bebanBimbingan / dosen.kuota) * 100);
          const isOverloaded = loadPercentage >= 100;
          const isHighLoad = loadPercentage >= 80 && loadPercentage < 100;
          
          let progressColor = "bg-green-500";
          if (isOverloaded) progressColor = "bg-red-500";
          else if (isHighLoad) progressColor = "bg-orange-500";

          return (
            <div key={dosen.id} className="card relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                <button 
                  onClick={() => openEditModal(dosen)}
                  className="p-2 text-text-muted hover:text-accent2 hover:bg-secondary/20 rounded-full transition-all opacity-0 group-hover:opacity-100"
                  title="Edit Kuota"
                >
                  <Edit2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-accent1/10 rounded-full flex items-center justify-center text-accent1 font-bold text-lg">
                  {dosen.nama.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-text-main line-clamp-1 pr-8">{dosen.nama}</h3>
                  <p className="text-xs text-text-muted">ID: {dosen.id}</p>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Beban Bimbingan</span>
                  <span className="font-medium text-text-main">{dosen.bebanBimbingan} / {dosen.kuota} Mhs</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div className={`h-2 rounded-full ${progressColor} transition-all duration-500`} style={{ width: `${Math.min(loadPercentage, 100)}%` }}></div>
                </div>
                <p className={`text-xs text-right mt-1 ${isOverloaded ? 'text-red-600 font-medium' : 'text-text-muted'}`}>
                  {loadPercentage}% Kapasitas Terisi
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-secondary/20 flex justify-between items-center">
              <h3 className="text-lg font-bold text-accent2">Edit Pembimbing</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Nama Dosen</label>
                <p className="text-text-main font-medium bg-background px-4 py-2 rounded-lg">{selectedDosen?.nama}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">Kuota Bimbingan Maksimal</label>
                <input 
                  type="number" 
                  className="input-field"
                  value={newKuota}
                  onChange={(e) => setNewKuota(parseInt(e.target.value) || 0)}
                  min="0"
                />
                <p className="text-xs text-text-muted mt-2">Beban saat ini: {selectedDosen?.bebanBimbingan} mahasiswa</p>
              </div>
            </div>
            <div className="p-6 border-t border-secondary/20 flex justify-end space-x-3 bg-gray-50 rounded-b-xl">
              <button className="px-4 py-2 text-sm font-medium text-text-main hover:bg-gray-200 rounded-lg transition-colors" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button className="btn-primary" onClick={handleSaveModal}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pembimbing;
