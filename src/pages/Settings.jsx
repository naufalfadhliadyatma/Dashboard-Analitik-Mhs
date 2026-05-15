import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Settings - Halaman pengaturan preferensi akun pengguna

const Settings = () => {
  const { user } = useAuth();

  const handleSave = () => {
    // [BACKEND] PUT /api/users/settings - Update user preferences
    toast.success('Pengaturan berhasil disimpan!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-accent2">Pengaturan Akun</h1>
        <p className="text-text-muted text-sm mt-1">Kelola informasi profil dan preferensi sistem Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Settings Nav */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-white rounded-lg border border-secondary/30 text-accent2 font-medium shadow-sm">
            <User size={18} /> <span>Profil Akun</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-transparent rounded-lg border border-transparent text-text-muted hover:bg-white/50 transition-colors">
            <Lock size={18} /> <span>Keamanan</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-transparent rounded-lg border border-transparent text-text-muted hover:bg-white/50 transition-colors">
            <Bell size={18} /> <span>Notifikasi</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 card">
          <h2 className="text-lg font-bold text-text-main mb-6 border-b border-secondary/20 pb-2">Informasi Dasar</h2>
          
          <div className="space-y-5">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-accent1/10 rounded-full flex items-center justify-center text-accent2 font-bold text-2xl border-2 border-accent1/20">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <button className="btn-outline text-sm py-1.5">Ubah Foto</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Nama Lengkap</label>
                <input type="text" className="input-field" defaultValue={user?.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Role</label>
                <input type="text" className="input-field bg-gray-50 text-gray-500" defaultValue={user?.role} disabled />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Email</label>
              <input type="email" className="input-field" defaultValue="admin@uad.ac.id" />
            </div>

            <div className="pt-4 flex justify-end">
              <button className="btn-primary" onClick={handleSave}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
