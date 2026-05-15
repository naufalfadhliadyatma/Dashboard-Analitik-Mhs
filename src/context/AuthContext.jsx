import { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

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

    // Hardcode dummy validation
    if (username === 'admin' && password === 'admin') {
      const userData = { id: 1, role: 'Admin', name: 'Admin UAD' };
      setUser(userData);
      localStorage.setItem('uad_user', JSON.stringify(userData));
      toast.success('Login berhasil!');
      return true;
    } else if (username === 'kaprodi' && password === 'kaprodi') {
      const userData = { id: 2, role: 'Kaprodi', name: 'Kaprodi Sistem Informasi' };
      setUser(userData);
      localStorage.setItem('uad_user', JSON.stringify(userData));
      toast.success('Login berhasil!');
      return true;
    }

    toast.error('Username atau password salah.');
    return false;
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
