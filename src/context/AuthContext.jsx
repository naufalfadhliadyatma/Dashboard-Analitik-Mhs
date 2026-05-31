import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { usersData } from '../data/usersData';

// ============ [AUTH CONTEXT] ============
// [KOMPONEN] AuthContext - Mengelola state login dan data user simulasi

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi mengecek session saat reload
    const savedUser = localStorage.getItem('uad_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // [BACKEND] POST /api/auth/login - Endpoint untuk verifikasi kredensial
    
    // Simulasi loading
    await new Promise(resolve => setTimeout(resolve, 800));

    // [REVISI] Menggunakan data dummy dari usersData untuk mengecek role secara otomatis
    const foundUser = usersData.find(u => u.username === username && u.password === password);

    if (foundUser) {
      // Hapus password sebelum disimpan ke state/localStorage
      const { password, ...userData } = foundUser;
      setUser(userData);
      localStorage.setItem('uad_user', JSON.stringify(userData));
      toast.success('Login berhasil!');
      return userData; // Return userData to handle redirect in Login component
    }

    toast.error('Username atau password salah.');
    return null;
  };

  const logout = () => {
    // [BACKEND] POST /api/auth/logout - Endpoint untuk invalidate session
    setUser(null);
    localStorage.removeItem('uad_user');
    toast.success('Anda telah logout.');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
