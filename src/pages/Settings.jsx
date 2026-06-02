import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Bell, Camera, Save, CheckCircle2, Mail, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

// ============ [DESIGN TOKENS] ============
// Warna utama dan turunan gradasi untuk seluruh halaman Settings
const T = {
  navy:        '#06446B',
  navyDeep:    '#042F4D',
  mid:         '#5790AB',
  sky:         '#9CCDDB',
  skyLight:    '#C8E8F0',
  white:       '#FFFFFF',
  glass:       'rgba(255,255,255,0.78)',
  glassBorder: 'rgba(151,205,219,0.30)',
  muted:       'rgba(6,68,107,0.42)',
  pageBg:      `radial-gradient(ellipse 130% 80% at 8% 0%, #D2EDF5 0%, #EAF5F9 32%, #F7FBFC 60%)`,
};

// ============ [HELPER] ============
// Avatar warna dari initial nama pengguna
const avatarGradient = `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`;

// ============ [KOMPONEN] NavItem - Item navigasi sidebar settings
const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '11px',
      padding: '11px 16px',
      borderRadius: '14px',
      border: active ? `1.5px solid rgba(151,205,219,0.40)` : '1.5px solid transparent',
      background: active
        ? `linear-gradient(135deg, rgba(255,255,255,0.90) 0%, rgba(234,245,249,0.85) 100%)`
        : 'transparent',
      backdropFilter: active ? 'blur(12px)' : 'none',
      WebkitBackdropFilter: active ? 'blur(12px)' : 'none',
      boxShadow: active ? '0 4px 16px rgba(6,68,107,0.10)' : 'none',
      cursor: 'pointer',
      transition: 'all 0.22s cubic-bezier(.34,1.56,.64,1)',
      transform: active ? 'translateX(3px)' : 'translateX(0)',
      fontFamily: "'Poppins', sans-serif",
    }}
    onMouseEnter={e => {
      if (!active) {
        e.currentTarget.style.background = 'rgba(255,255,255,0.45)';
        e.currentTarget.style.transform = 'translateX(3px)';
        e.currentTarget.style.border = `1.5px solid rgba(151,205,219,0.22)`;
      }
    }}
    onMouseLeave={e => {
      if (!active) {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.transform = 'translateX(0)';
        e.currentTarget.style.border = '1.5px solid transparent';
      }
    }}
  >
    {/* Ikon dengan warna tematik */}
    <div style={{
      width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
      background: active
        ? `linear-gradient(135deg, ${T.sky} 0%, ${T.mid} 100%)`
        : 'rgba(156,205,219,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.2s ease',
    }}>
      <Icon size={16} color={active ? T.white : T.mid} strokeWidth={2.2} />
    </div>
    <span style={{
      fontSize: '13.5px', fontWeight: active ? 700 : 500,
      color: active ? T.navy : T.muted,
      letterSpacing: '-0.1px',
      transition: 'color 0.2s, font-weight 0.2s',
    }}>
      {label}
    </span>
    {/* Active indicator dot */}
    {active && (
      <div style={{
        marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%',
        background: `linear-gradient(135deg, ${T.sky}, ${T.mid})`,
        boxShadow: `0 0 6px ${T.sky}`,
      }} />
    )}
  </button>
);

// ============ [KOMPONEN] InputField - Field input bergaya premium
const InputField = ({ label, type = 'text', value, onChange, disabled, placeholder, icon: Icon }) => {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === 'password';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{
        fontSize: '11.5px', fontWeight: 700, color: T.muted,
        letterSpacing: '0.07em', textTransform: 'uppercase',
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{
            position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}>
            <Icon size={15} color={T.mid} strokeWidth={2} />
          </div>
        )}
        <input
          type={isPass && showPass ? 'text' : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: Icon ? '11px 13px 11px 38px' : '11px 13px',
            paddingRight: isPass ? '40px' : '13px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: disabled ? T.muted : T.navy,
            background: disabled
              ? 'rgba(156,205,219,0.08)'
              : 'rgba(255,255,255,0.82)',
            border: `1.5px solid ${disabled ? 'rgba(156,205,219,0.20)' : 'rgba(151,205,219,0.35)'}`,
            borderRadius: '12px',
            outline: 'none',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: disabled ? 'none' : '0 2px 8px rgba(6,68,107,0.05)',
            transition: 'border 0.2s, box-shadow 0.2s',
            fontFamily: "'Poppins', system-ui, sans-serif",
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          onFocus={e => {
            if (!disabled) {
              e.target.style.border = `1.5px solid ${T.mid}`;
              e.target.style.boxShadow = `0 0 0 3px rgba(87,144,171,0.14), 0 2px 8px rgba(6,68,107,0.08)`;
            }
          }}
          onBlur={e => {
            if (!disabled) {
              e.target.style.border = `1.5px solid rgba(151,205,219,0.35)`;
              e.target.style.boxShadow = '0 2px 8px rgba(6,68,107,0.05)';
            }
          }}
        />
        {isPass && (
          <button
            onClick={() => setShowPass(p => !p)}
            style={{
              position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
              color: T.mid,
            }}
            type="button"
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ============ [KOMPONEN] SectionCard - Card glass untuk setiap section konten
const SectionCard = ({ title, subtitle, icon: Icon, children }) => (
  <div style={{
    background: T.glass,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1.5px solid ${T.glassBorder}`,
    borderRadius: '22px',
    boxShadow: '0 4px 28px rgba(6,68,107,0.08), 0 1px 4px rgba(6,68,107,0.05)',
    overflow: 'hidden',
  }}>
    {/* Card header stripe */}
    <div style={{
      padding: '1.3rem 1.7rem 1.1rem',
      borderBottom: `1px solid rgba(151,205,219,0.20)`,
      background: 'linear-gradient(90deg, rgba(156,205,219,0.10) 0%, transparent 80%)',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      {Icon && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: `linear-gradient(135deg, ${T.sky} 0%, ${T.mid} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={17} color={T.white} strokeWidth={2.2} />
        </div>
      )}
      <div>
        <h2 style={{
          fontSize: '15px', fontWeight: 700, color: T.navy,
          margin: 0, letterSpacing: '-0.2px',
        }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: '11.5px', color: T.muted, margin: '2px 0 0', fontWeight: 450 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {/* Card body */}
    <div style={{ padding: '1.5rem 1.7rem' }}>
      {children}
    </div>
  </div>
);

// ============ [PAGE SECTION] ============
// [KOMPONEN] Settings - Halaman pengaturan preferensi akun pengguna
const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeNav, setActiveNav] = useState('profil');
  
  const [isEditing, setIsEditing] = useState(false);
  const [nama, setNama] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || 'admin@uad.ac.id');

  const toastStyle = {
    style: {
      background: T.navy,
      color: '#fff',
      borderRadius: '12px',
      fontFamily: "'Poppins', system-ui",
      fontSize: '13.5px',
      fontWeight: 600,
      boxShadow: '0 8px 24px rgba(6,68,107,0.25)',
    },
    iconTheme: { primary: T.sky, secondary: T.navy },
  };

  const handleSaveProfile = () => {
    if (!nama.trim() || !email.trim()) {
      toast.error('Nama dan Email tidak boleh kosong.', toastStyle);
      return;
    }
    const success = updateUserProfile(nama, email);
    if (success) {
      setIsEditing(false);
      toast.success('Profil berhasil diperbarui!', toastStyle);
    }
  };

  const handleCancel = () => {
    setNama(user?.name || '');
    setEmail(user?.email || 'admin@uad.ac.id');
    setIsEditing(false);
  };

  // [BACKEND] PUT /api/users/settings - Update user preferences
  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!', toastStyle);
  };

  return (
    <>
      {/* Google Font loader */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes settingsFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .se1 { animation: settingsFadeUp 0.5s 0.00s cubic-bezier(.22,1,.36,1) both; }
        .se2 { animation: settingsFadeUp 0.5s 0.07s cubic-bezier(.22,1,.36,1) both; }
        .se3 { animation: settingsFadeUp 0.5s 0.14s cubic-bezier(.22,1,.36,1) both; }
        .se4 { animation: settingsFadeUp 0.5s 0.21s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: T.pageBg,
        padding: '2rem 2.25rem 3rem',
        fontFamily: "'Poppins', system-ui, sans-serif",
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>

          {/* ── Page Header ── */}
          <div className="se1" style={{ marginBottom: '2rem' }}>
            <p style={{
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: T.mid, marginBottom: '4px',
            }}>
              Konfigurasi
            </p>
            <h1 style={{
              fontSize: '26px', fontWeight: 800, color: T.navy,
              letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2,
            }}>
              Pengaturan Akun
            </h1>
            <p style={{ fontSize: '13px', color: T.muted, marginTop: '5px', fontWeight: 450 }}>
              Kelola informasi profil dan preferensi sistem Anda
            </p>
          </div>

          {/* ── Two-Column Layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: '1.4rem', alignItems: 'start' }}>

            {/* ── Sidebar Nav ── */}
            <div className="se2" style={{
              background: T.glass,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1.5px solid ${T.glassBorder}`,
              borderRadius: '22px',
              padding: '1rem',
              boxShadow: '0 4px 24px rgba(6,68,107,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {/* User mini-profile at top */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '1rem 0.5rem 1.2rem',
                borderBottom: `1px solid rgba(151,205,219,0.20)`,
                marginBottom: '10px',
              }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: avatarGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', fontWeight: 800, color: T.white,
                  boxShadow: `0 4px 16px rgba(6,68,107,0.28)`,
                  marginBottom: '8px',
                  border: `2.5px solid rgba(156,205,219,0.45)`,
                }}>
                  {user?.name?.charAt(0) ?? 'A'}
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: T.navy, margin: 0 }}>
                  {user?.name ?? 'Admin'}
                </p>
                <span style={{
                  fontSize: '10.5px', fontWeight: 600, marginTop: '3px',
                  padding: '2px 9px', borderRadius: '99px',
                  background: 'rgba(87,144,171,0.12)',
                  color: T.mid,
                  letterSpacing: '0.04em',
                }}>
                  {user?.role ?? 'Admin'}
                </span>
              </div>

              <NavItem icon={User}  label="Profil Akun"  active={activeNav === 'profil'}    onClick={() => setActiveNav('profil')} />
              <NavItem icon={Lock}  label="Keamanan"     active={activeNav === 'keamanan'}  onClick={() => setActiveNav('keamanan')} />
              <NavItem icon={Bell}  label="Notifikasi"   active={activeNav === 'notifikasi'} onClick={() => setActiveNav('notifikasi')} />
            </div>

            {/* ── Content Area ── */}
            <div className="se3" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* ─── TAB: Profil ─── */}
              {activeNav === 'profil' && (
                <>
                  {/* Avatar section */}
                  <SectionCard title="Foto Profil" subtitle="Tampil di seluruh halaman aplikasi" icon={Camera}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      {/* Avatar preview */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                          width: '72px', height: '72px', borderRadius: '50%',
                          background: avatarGradient,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '26px', fontWeight: 800, color: T.white,
                          boxShadow: `0 6px 20px rgba(6,68,107,0.28)`,
                          border: `3px solid rgba(156,205,219,0.50)`,
                        }}>
                          {/* [GANTI] Ganti dengan <img> jika foto tersedia */}
                          {user?.name?.charAt(0) ?? 'A'}
                        </div>
                        {/* Camera badge overlay */}
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: T.mid,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '2px solid white',
                          boxShadow: '0 2px 6px rgba(6,68,107,0.20)',
                        }}>
                          <Camera size={10} color={T.white} strokeWidth={2.5} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* Ubah Foto button */}
                        <button
                          style={{
                            padding: '9px 20px', borderRadius: '12px', fontSize: '13px',
                            fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.1px',
                            background: `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`,
                            color: T.white, border: 'none',
                            boxShadow: '0 4px 14px rgba(6,68,107,0.28)',
                            transition: 'transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease',
                            fontFamily: "'Poppins', system-ui",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(6,68,107,0.36)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(6,68,107,0.28)';
                          }}
                        >
                          Ubah Foto
                        </button>
                        <p style={{ fontSize: '11px', color: T.muted, margin: 0, fontWeight: 450 }}>
                          JPG, PNG max 2MB. Akan ditampilkan di profil Anda.
                        </p>
                      </div>
                    </div>
                  </SectionCard>

                  {/* Form informasi dasar */}
                  <SectionCard title="Informasi Dasar" subtitle="Nama, email, dan data akun utama" icon={User}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <InputField label="Nama Lengkap" value={nama} onChange={(e) => setNama(e.target.value)} disabled={!isEditing} icon={User} />
                        <InputField label="Role" value={user?.role} disabled icon={Shield} />
                      </div>
                      <InputField label="Alamat Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} icon={Mail} />

                      {/* Divider */}
                      <div style={{
                        height: '1px', margin: '6px 0',
                        background: 'linear-gradient(90deg, rgba(151,205,219,0.40) 0%, transparent 80%)',
                      }} />

                      {/* Save button */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        {!isEditing ? (
                          <button
                            onClick={() => setIsEditing(true)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px',
                              padding: '11px 26px', borderRadius: '14px', fontSize: '13.5px',
                              fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.1px',
                              background: `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`,
                              color: T.white, border: 'none',
                              boxShadow: '0 4px 18px rgba(6,68,107,0.30)',
                              transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
                              fontFamily: "'Poppins', system-ui",
                            }}
                          >
                            Ubah Profil
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={handleCancel}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '11px 26px', borderRadius: '14px', fontSize: '13.5px',
                                fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.1px',
                                background: 'transparent',
                                color: T.navy, border: `1.5px solid ${T.mid}`,
                                transition: 'all 0.2s',
                                fontFamily: "'Poppins', system-ui",
                              }}
                            >
                              Batal
                            </button>
                            <button
                              onClick={handleSaveProfile}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '11px 26px', borderRadius: '14px', fontSize: '13.5px',
                                fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.1px',
                                background: `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`,
                                color: T.white, border: 'none',
                                boxShadow: '0 4px 18px rgba(6,68,107,0.30)',
                                transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
                                fontFamily: "'Poppins', system-ui",
                              }}
                            >
                              <Save size={15} strokeWidth={2.5} />
                              Simpan Perubahan
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </SectionCard>
                </>
              )}

              {/* ─── TAB: Keamanan ─── */}
              {activeNav === 'keamanan' && (
                <SectionCard title="Keamanan Akun" subtitle="Ubah password dan konfigurasi autentikasi" icon={Lock}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    <InputField label="Password Saat Ini" type="password" placeholder="Masukkan password lama" icon={Lock} />
                    <InputField label="Password Baru" type="password" placeholder="Minimal 8 karakter" icon={Lock} />
                    <InputField label="Konfirmasi Password Baru" type="password" placeholder="Ulangi password baru" icon={Lock} />

                    {/* Security tip card */}
                    <div style={{
                      display: 'flex', gap: '10px', alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: '12px',
                      background: 'rgba(156,205,219,0.12)',
                      border: '1px solid rgba(151,205,219,0.28)',
                      marginTop: '4px',
                    }}>
                      <CheckCircle2 size={16} color={T.mid} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
                      <p style={{ fontSize: '12px', color: T.muted, margin: 0, lineHeight: 1.6 }}>
                        Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol untuk password yang kuat.
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                      <button
                        onClick={handleSave}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '11px 26px', borderRadius: '14px', fontSize: '13.5px',
                          fontWeight: 700, cursor: 'pointer',
                          background: `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`,
                          color: T.white, border: 'none',
                          boxShadow: '0 4px 18px rgba(6,68,107,0.30)',
                          transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
                          fontFamily: "'Poppins', system-ui",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 10px 26px rgba(6,68,107,0.38)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 18px rgba(6,68,107,0.30)';
                        }}
                      >
                        <Save size={15} strokeWidth={2.5} />
                        Perbarui Password
                      </button>
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* ─── TAB: Notifikasi ─── */}
              {activeNav === 'notifikasi' && (
                <SectionCard title="Preferensi Notifikasi" subtitle="Atur kapan dan bagaimana Anda menerima notifikasi" icon={Bell}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {[
                      { label: 'Mahasiswa Berisiko Baru',      desc: 'Notifikasi saat ada mahasiswa baru masuk kategori berisiko', checked: true },
                      { label: 'Update Status Capstone',       desc: 'Pemberitahuan perubahan status skripsi/capstone mahasiswa',  checked: true },
                      { label: 'Laporan Mingguan',             desc: 'Ringkasan performa akademik setiap akhir pekan',             checked: false },
                      { label: 'Upload CSV Berhasil',          desc: 'Konfirmasi setelah proses import data selesai',               checked: true },
                    ].map((item, i, arr) => (
                      <div
                        key={item.label}
                        style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 0',
                          borderBottom: i < arr.length - 1 ? '1px solid rgba(151,205,219,0.18)' : 'none',
                        }}
                      >
                        <div>
                          <p style={{ fontSize: '13.5px', fontWeight: 600, color: T.navy, margin: '0 0 2px' }}>
                            {item.label}
                          </p>
                          <p style={{ fontSize: '11.5px', color: T.muted, margin: 0, fontWeight: 450 }}>
                            {item.desc}
                          </p>
                        </div>
                        {/* Toggle switch */}
                        <ToggleSwitch defaultOn={item.checked} />
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.2rem' }}>
                      <button
                        onClick={handleSave}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '11px 26px', borderRadius: '14px', fontSize: '13.5px',
                          fontWeight: 700, cursor: 'pointer',
                          background: `linear-gradient(135deg, ${T.mid} 0%, ${T.navy} 100%)`,
                          color: T.white, border: 'none',
                          boxShadow: '0 4px 18px rgba(6,68,107,0.30)',
                          transition: 'transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s ease',
                          fontFamily: "'Poppins', system-ui",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                          e.currentTarget.style.boxShadow = '0 10px 26px rgba(6,68,107,0.38)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 18px rgba(6,68,107,0.30)';
                        }}
                      >
                        <Save size={15} strokeWidth={2.5} />
                        Simpan Preferensi
                      </button>
                    </div>
                  </div>
                </SectionCard>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ============ [KOMPONEN] ToggleSwitch - Custom toggle UI untuk preferensi notifikasi
const ToggleSwitch = ({ defaultOn }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(p => !p)}
      style={{
        width: '42px', height: '24px', borderRadius: '99px', border: 'none', cursor: 'pointer',
        background: on
          ? `linear-gradient(135deg, ${T.sky} 0%, ${T.mid} 100%)`
          : 'rgba(156,205,219,0.25)',
        position: 'relative', flexShrink: 0,
        boxShadow: on ? `0 2px 10px rgba(87,144,171,0.40)` : 'none',
        transition: 'background 0.25s ease, box-shadow 0.25s ease',
      }}
      type="button"
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: on ? '20px' : '3px',
        width: '18px', height: '18px', borderRadius: '50%',
        background: T.white,
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'left 0.22s cubic-bezier(.34,1.56,.64,1)',
        display: 'block',
      }} />
    </button>
  );
};

export default Settings;
