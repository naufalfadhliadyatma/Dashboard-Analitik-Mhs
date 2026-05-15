import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Login - Halaman otentikasi dengan form validasi

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!username || !password) {
      setError('Username dan Password wajib diisi');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="card w-full p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-8">
        {/* GANTI: Ubah src berikut dengan path gambar logo UAD */}
        <img src="/assets/logo-uad.png" alt="Logo UAD" className="h-16 mb-6 object-contain" />
        <h1 className="text-2xl font-bold text-accent2 text-center">Masuk ke Sistem</h1>
        <p className="text-text-muted text-sm mt-2 text-center">
          Dashboard Analitik & Monitoring Mahasiswa Sistem Informasi
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-main mb-1">Username</label>
          <input
            type="text"
            className="input-field"
            placeholder="Masukkan username Anda"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-text-main">Password</label>
            <Link to="/reset-password" className="text-sm text-accent1 hover:text-accent2 transition-colors">
              Lupa Password?
            </Link>
          </div>
          <input
            type="password"
            className="input-field"
            placeholder="Masukkan password Anda"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary w-full mt-6 py-3 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : 'Masuk'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-xs text-text-muted">
        <p>Gunakan kredensial admin/admin atau kaprodi/kaprodi untuk simulasi.</p>
      </div>
    </div>
  );
};

export default Login;
