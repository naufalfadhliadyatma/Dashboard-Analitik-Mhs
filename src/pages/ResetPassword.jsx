import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

// ============ [PAGE SECTION] ============
// [KOMPONEN] ResetPassword - Halaman untuk meminta reset password via email

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email wajib diisi');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Format email tidak valid');
      return;
    }

    setIsLoading(true);
    
    // [BACKEND] POST /api/auth/reset-password - Endpoint request reset password link
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
    toast.success('Link reset password telah dikirim ke email Anda');
  };

  return (
    <div className="card w-full p-8 animate-in fade-in zoom-in-95 duration-300">
      <Link to="/login" className="inline-flex items-center text-sm text-text-muted hover:text-accent1 transition-colors mb-6">
        <ArrowLeft size={16} className="mr-1" /> Kembali ke Login
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-accent2">Reset Password</h1>
        <p className="text-text-muted text-sm mt-2">
          Masukkan email yang terdaftar untuk menerima link reset password.
        </p>
      </div>

      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl text-center">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h3 className="font-semibold mb-1">Berhasil Terkirim!</h3>
          <p className="text-sm">Silakan periksa kotak masuk email Anda dan ikuti instruksi yang diberikan.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Email Akademik</label>
            <input
              type="email"
              className="input-field"
              placeholder="contoh: nama@uad.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full mt-4 py-3 flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : 'Kirim Link Reset'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
