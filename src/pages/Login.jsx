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
  const [showPassword, setShowPassword] = useState(false);
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
    const userData = await login(username, password);
    setIsLoading(false);

    if (userData) {
      if (userData.role === 'mahasiswa') {
        navigate(`/mahasiswa/${userData.nim}`);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .glass-card {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: rgba(255, 255, 255, 0.13);
          backdrop-filter: blur(22px) saturate(180%);
          -webkit-backdrop-filter: blur(22px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.25),
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.45),
            inset 0 -1px 0 rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .glass-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(255,255,255,0.7) 30%,
            rgba(255,255,255,0.9) 50%,
            rgba(255,255,255,0.7) 70%,
            transparent
          );
          pointer-events: none;
        }

        .glass-card::after {
          content: '';
          position: absolute;
          top: -40%;
          left: -20%;
          width: 60%;
          height: 80%;
          background: radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }

        .glass-title {
          color: #FFFFFF;
          text-shadow: 0 1px 8px rgba(0,0,0,0.35), 0 0 20px rgba(255,255,255,0.2);
          font-weight: 700;
          letter-spacing: -0.3px;
        }

        .glass-subtitle {
          color: #FFFFFF;
          text-shadow: 0 1px 4px rgba(0,0,0,0.3);
          font-weight: 400;
        }

        .glass-label {
          color: #312F2F;
          text-shadow: 0 1px 3px rgba(0,0,0,0.25);
          font-weight: 500;
        }

        .glass-input {
          width: 100%;
          padding: 11px 14px;
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.30);
          border-radius: 12px;
          color: #000000;
          font-size: 0.9rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.2s ease;
          outline: none;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.12);
        }

        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.22);
          border-color: rgba(255, 255, 255, 0.60);
          box-shadow:
            inset 0 1px 3px rgba(0,0,0,0.1),
            0 0 0 3px rgba(255, 255, 255, 0.12),
            0 0 12px rgba(255, 255, 255, 0.08);
        }

        .glass-input:focus + .eye-btn,
        .password-wrapper:focus-within .eye-btn {
          color: rgba(255,255,255,0.85);
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper .glass-input {
          padding-right: 44px;
        }

        .eye-btn {
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.55);
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease, transform 0.15s ease;
          outline: none;
        }

        .eye-btn:hover {
          color: rgba(255, 255, 255, 0.90);
          transform: translateY(-50%) scale(1.1);
        }

        .eye-btn:active {
          transform: translateY(-50%) scale(0.95);
        }

        .glass-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg,
            rgba(255,255,255,0.30) 0%,
            rgba(255,255,255,0.18) 50%,
            rgba(255,255,255,0.10) 100%
          );
          border: 1px solid rgba(255, 255, 255, 0.45);
          border-radius: 12px;
          color: #312F2F;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.3px;
          box-shadow:
            0 4px 15px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .glass-btn:hover:not(:disabled) {
          background: linear-gradient(135deg,
            rgba(255,255,255,0.42) 0%,
            rgba(255,255,255,0.28) 50%,
            rgba(255,255,255,0.18) 100%
          );
          border-color: rgba(255,255,255,0.65);
          box-shadow:
            0 6px 20px rgba(0,0,0,0.2),
            inset 0 1px 0 rgba(255,255,255,0.55);
          transform: translateY(-1px);
        }

        .glass-btn:active:not(:disabled) {
          transform: translateY(0px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .glass-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .glass-error {
          background: rgba(255, 80, 80, 0.18);
          border: 1px solid rgba(255, 130, 130, 0.40);
          color: #000000;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 0.85rem;
          backdrop-filter: blur(4px);
        }

        .glass-link {
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.82rem;
          font-weight: 500;
          text-decoration: none;
          text-shadow: 0 1px 3px rgba(0,0,0,0.2);
          transition: color 0.2s ease;
          border-bottom: 1px solid rgba(255,255,255,0.2);
          padding-bottom: 1px;
        }

        .glass-link:hover {
          color: rgba(255, 255, 255, 1);
          border-bottom-color: rgba(255,255,255,0.6);
        }

        .glass-footer {
          color: rgba(255, 255, 255, 0.50);
          font-size: 0.75rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .logo-img {
          filter: brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3));
          transition: filter 0.3s ease;
        }

        .logo-img:hover {
          filter: brightness(0) invert(1) drop-shadow(0 3px 12px rgba(255,255,255,0.4));
        }

        .divider-line {
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(255,255,255,0.25) 30%,
            rgba(255,255,255,0.25) 70%,
            transparent
          );
          margin: 8px 0;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-glass-in {
          animation: slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>

      <div
        className="card glass-card animate-glass-in w-full p-8"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: '18px',
            padding: '12px 20px',
            marginBottom: '20px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)'
          }}>
            <img
              src="src/assets/logo-uad.png"
              alt="Logo UAD"
              className="h-12 object-contain logo-img"
            />
          </div>

          <h1 className="text-2xl glass-title text-center mb-1">
            Masuk ke Sistem
          </h1>
          <p className="glass-subtitle text-sm text-center leading-relaxed" style={{ maxWidth: '260px' }}>
            Dashboard Analitik & Monitoring Mahasiswa Sistem Informasi
          </p>
        </div>

        <div className="divider-line mb-6" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="glass-error">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="block text-sm glass-label mb-2">Username</label>
            <input
              type="text"
              className="glass-input"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2">
  <label className="block text-sm glass-label">Password</label>
  {/* Menggunakan text-[#06446B] dan menambahkan efek garis bawah saat kursor mendekat */}
  <Link to="/reset-password" className="text-xs text-[#312F2F] hover:underline font-medium">
    Lupa Password?
  </Link>
</div>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="glass-input"
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  /* Eye-off icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <div style={{ paddingTop: '4px' }}>
            <button
              type="submit"
              className="glass-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Masuk
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="divider-line mt-6 mb-4" />

        {/* Footer */}
        <div className="text-center glass-footer">
          <p>Gunakan kredensial <span style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>admin/admin123</span>, <span style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>kaprodi/kaprodi123</span>, atau NIM <span style={{ color: 'rgba(255,255,255,0.70)', fontWeight: 500 }}>2200018001/mahasiswa123</span> untuk simulasi.</p>
        </div>
      </div>
    </>
  );
};

export default Login;