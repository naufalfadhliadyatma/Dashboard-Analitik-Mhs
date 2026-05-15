import { useState } from 'react';
import { Search, Filter, BookOpen, GraduationCap, Clock, CheckCircle2, FileText, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';
import { Link } from 'react-router-dom';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Capstone - Halaman pemantauan progres tugas akhir/skripsi

const STATUS_CONFIG = {
  'Lulus': {
    label: 'Lulus',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.25)',
    text: '#059669',
    dot: '#10b981',
    icon: CheckCircle2,
    order: 5,
  },
  'Pendadaran': {
    label: 'Pendadaran',
    bg: 'rgba(87, 144, 171, 0.12)',
    border: 'rgba(87, 144, 171, 0.3)',
    text: '#5790AB',
    dot: '#5790AB',
    icon: GraduationCap,
    order: 4,
  },
  'Penyusunan Skripsi': {
    label: 'Penyusunan Skripsi',
    bg: 'rgba(6, 68, 107, 0.08)',
    border: 'rgba(6, 68, 107, 0.2)',
    text: '#06446B',
    dot: '#06446B',
    icon: FileText,
    order: 3,
  },
  'Seminar Proposal': {
    label: 'Seminar Proposal',
    bg: 'rgba(156, 205, 219, 0.2)',
    border: 'rgba(156, 205, 219, 0.4)',
    text: '#2d7a94',
    dot: '#9CCDDB',
    icon: BookOpen,
    order: 2,
  },
  'Belum Mengambil': {
    label: 'Belum Mengambil',
    bg: 'rgba(148, 163, 184, 0.1)',
    border: 'rgba(148, 163, 184, 0.2)',
    text: '#64748b',
    dot: '#94a3b8',
    icon: Clock,
    order: 1,
  },
};

const PROGRESS_STEPS = ['Belum Mengambil', 'Seminar Proposal', 'Penyusunan Skripsi', 'Pendadaran', 'Lulus'];

const getProgressPercent = (status) => {
  const idx = PROGRESS_STEPS.indexOf(status);
  return idx === -1 ? 0 : Math.round((idx / (PROGRESS_STEPS.length - 1)) * 100);
};

const StatCard = ({ label, value, color, icon: Icon, delay }) => (
  <div
    style={{
      background: '#ffffff',
      border: '1px solid rgba(156, 205, 219, 0.25)',
      borderRadius: '16px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 1px 3px rgba(6,68,107,0.06), 0 4px 16px rgba(6,68,107,0.04)',
      animation: `slideUpFade 0.5s ease both`,
      animationDelay: delay,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(6,68,107,0.1), 0 8px 24px rgba(6,68,107,0.06)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(6,68,107,0.06), 0 4px 16px rgba(6,68,107,0.04)';
    }}
  >
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px',
      background: color.bg, border: `1px solid ${color.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon size={20} style={{ color: color.text }} />
    </div>
    <div>
      <p style={{ fontSize: '24px', fontWeight: '700', color: '#06446B', margin: 0, lineHeight: 1.1, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
      <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0', fontWeight: '500', letterSpacing: '0.01em' }}>{label}</p>
    </div>
  </div>
);

const CapstoneBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Belum Mengambil'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '4px 10px 4px 8px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      color: cfg.text, letterSpacing: '0.01em', whiteSpace: 'nowrap',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <span style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: cfg.dot, flexShrink: 0,
      }} />
      {cfg.label}
    </span>
  );
};

const ProgressBar = ({ status }) => {
  const pct = getProgressPercent(status);
  const isLulus = status === 'Lulus';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '120px' }}>
      <div style={{
        flex: 1, height: '5px', borderRadius: '99px',
        background: 'rgba(156, 205, 219, 0.2)', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: '99px',
          width: `${pct}%`,
          background: isLulus
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : 'linear-gradient(90deg, #5790AB, #9CCDDB)',
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', minWidth: '28px', textAlign: 'right' }}>
        {pct}%
      </span>
    </div>
  );
};

const Capstone = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [hoveredRow, setHoveredRow] = useState(null);

  const filteredData = dummyMahasiswa.filter((mhs) => {
    const matchSearch =
      mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mhs.nim.includes(searchTerm);
    const matchStatus = filterStatus === 'Semua' ? true : mhs.statusCapstone === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: dummyMahasiswa.length,
    lulus: dummyMahasiswa.filter(m => m.statusCapstone === 'Lulus').length,
    aktif: dummyMahasiswa.filter(m => ['Pendadaran', 'Penyusunan Skripsi', 'Seminar Proposal'].includes(m.statusCapstone)).length,
    belum: dummyMahasiswa.filter(m => m.statusCapstone === 'Belum Mengambil').length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .capstone-search-input::placeholder { color: #94a3b8; }
        .capstone-search-input:focus { outline: none; }
        .capstone-select:focus { outline: none; }
        .capstone-row-link { text-decoration: none; }
        .capstone-row-link:hover .capstone-link-text { color: #06446B !important; }

        .capstone-filter-btn {
          background: transparent;
          border: 1px solid rgba(156,205,219,0.3);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: all 0.18s ease;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
        }
        .capstone-filter-btn:hover {
          background: rgba(156,205,219,0.12);
          border-color: rgba(87,144,171,0.35);
          color: #5790AB;
        }
        .capstone-filter-btn.active {
          background: linear-gradient(135deg, #5790AB, #06446B);
          border-color: transparent;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(6,68,107,0.25);
        }
      `}</style>

      <div style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        minHeight: '100%',
        animation: 'fadeIn 0.4s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '4px',
          animation: 'slideUpFade 0.45s ease both',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #5790AB 0%, #06446B 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(6,68,107,0.3)',
            }}>
              <GraduationCap size={20} color="#fff" />
            </div>
            <div>
              <h1 style={{
                fontSize: '22px', fontWeight: '800',
                background: 'linear-gradient(135deg, #06446B 30%, #5790AB 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', margin: 0, lineHeight: 1.2,
              }}>
                Status Capstone &amp; Skripsi
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0, fontWeight: '500' }}>
                Monitoring progres penyelesaian tugas akhir mahasiswa
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
        }}>
          <StatCard
            label="Total Mahasiswa"
            value={stats.total}
            icon={TrendingUp}
            color={{ bg: 'rgba(6,68,107,0.07)', border: 'rgba(6,68,107,0.15)', text: '#06446B' }}
            delay="0.05s"
          />
          <StatCard
            label="Sudah Lulus"
            value={stats.lulus}
            icon={CheckCircle2}
            color={{ bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#059669' }}
            delay="0.1s"
          />
          <StatCard
            label="Sedang Proses"
            value={stats.aktif}
            icon={Sparkles}
            color={{ bg: 'rgba(87,144,171,0.1)', border: 'rgba(87,144,171,0.2)', text: '#5790AB' }}
            delay="0.15s"
          />
          <StatCard
            label="Belum Mengambil"
            value={stats.belum}
            icon={Clock}
            color={{ bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#64748b' }}
            delay="0.2s"
          />
        </div>

        {/* ── Main Card ── */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(156,205,219,0.25)',
          boxShadow: '0 2px 8px rgba(6,68,107,0.05), 0 8px 32px rgba(6,68,107,0.04)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUpFade 0.5s ease 0.25s both',
        }}>

          {/* Toolbar */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(156,205,219,0.18)',
            background: 'linear-gradient(180deg, rgba(156,205,219,0.04) 0%, #ffffff 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}>
            {/* Search + Select row */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{
                position: 'relative',
                flex: '1',
                minWidth: '200px',
                maxWidth: '320px',
              }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
                  }}
                />
                <input
                  className="capstone-search-input"
                  type="text"
                  placeholder="Cari NIM atau Nama..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: '36px', paddingRight: '14px',
                    paddingTop: '9px', paddingBottom: '9px',
                    fontSize: '13px', fontWeight: '500',
                    color: '#1e293b',
                    background: 'rgba(241,245,249,0.7)',
                    border: '1px solid rgba(156,205,219,0.25)',
                    borderRadius: '10px',
                    transition: 'all 0.2s ease',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                  onFocus={e => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = 'rgba(87,144,171,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(87,144,171,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.background = 'rgba(241,245,249,0.7)';
                    e.target.style.borderColor = 'rgba(156,205,219,0.25)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Select dropdown */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Filter
                  size={14}
                  style={{
                    position: 'absolute', left: '11px', top: '50%',
                    transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none',
                  }}
                />
                <select
                  className="capstone-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    paddingLeft: '30px', paddingRight: '32px',
                    paddingTop: '9px', paddingBottom: '9px',
                    fontSize: '13px', fontWeight: '600',
                    color: '#1e293b',
                    background: 'rgba(241,245,249,0.7)',
                    border: '1px solid rgba(156,205,219,0.25)',
                    borderRadius: '10px',
                    appearance: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={e => {
                    e.target.style.background = '#fff';
                    e.target.style.borderColor = 'rgba(87,144,171,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(87,144,171,0.12)';
                  }}
                  onBlur={e => {
                    e.target.style.background = 'rgba(241,245,249,0.7)';
                    e.target.style.borderColor = 'rgba(156,205,219,0.25)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Belum Mengambil">Belum Mengambil</option>
                  <option value="Seminar Proposal">Seminar Proposal</option>
                  <option value="Penyusunan Skripsi">Penyusunan Skripsi</option>
                  <option value="Pendadaran">Pendadaran</option>
                  <option value="Lulus">Lulus</option>
                </select>
                <svg
                  style={{
                    position: 'absolute', right: '10px', top: '50%',
                    transform: 'translateY(-50%)', pointerEvents: 'none',
                  }}
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                >
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Quick filter pills */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Semua', ...PROGRESS_STEPS].map(s => (
                <button
                  key={s}
                  className={`capstone-filter-btn${filterStatus === s ? ' active' : ''}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s === 'Semua' ? 'Semua' : (STATUS_CONFIG[s]?.label || s)}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto', flex: 1 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{
                  background: 'linear-gradient(180deg, rgba(156,205,219,0.08) 0%, rgba(156,205,219,0.03) 100%)',
                }}>
                  {['NIM', 'Nama Mahasiswa', 'Angkatan', 'Status', 'Progres', ''].map((h, i) => (
                    <th key={i} style={{
                      padding: '12px 20px',
                      fontSize: '11px', fontWeight: '700',
                      color: '#94a3b8', letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      textAlign: i === 2 ? 'center' : i === 5 ? 'right' : 'left',
                      borderBottom: '1px solid rgba(156,205,219,0.18)',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((mhs, idx) => (
                    <tr
                      key={mhs.id}
                      onMouseEnter={() => setHoveredRow(mhs.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: '1px solid rgba(156,205,219,0.1)',
                        background: hoveredRow === mhs.id
                          ? 'linear-gradient(90deg, rgba(156,205,219,0.07) 0%, rgba(87,144,171,0.04) 100%)'
                          : idx % 2 === 0 ? '#ffffff' : 'rgba(248,251,253,0.6)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* NIM */}
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <span style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontWeight: '700', fontSize: '13px',
                          color: '#06446B', letterSpacing: '0.02em',
                        }}>
                          {mhs.nim}
                        </span>
                      </td>

                      {/* Nama */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {/* Avatar */}
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg, ${
                              ['#9CCDDB','#5790AB','#06446B','#2d7a94'][mhs.id % 4]
                            } 0%, ${
                              ['#5790AB','#06446B','#2d7a94','#9CCDDB'][mhs.id % 4]
                            } 100%)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: '700', color: '#ffffff',
                          }}>
                            {mhs.nama?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <span style={{ fontWeight: '600', color: '#1e293b' }}>{mhs.nama}</span>
                        </div>
                      </td>

                      {/* Angkatan */}
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          background: 'rgba(156,205,219,0.15)',
                          border: '1px solid rgba(156,205,219,0.3)',
                          borderRadius: '99px',
                          fontSize: '12px', fontWeight: '700',
                          color: '#2d7a94',
                        }}>
                          {mhs.angkatan}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                        <CapstoneBadge status={mhs.statusCapstone} />
                      </td>

                      {/* Progress */}
                      <td style={{ padding: '14px 20px', minWidth: '140px' }}>
                        <ProgressBar status={mhs.statusCapstone} />
                      </td>

                      {/* Aksi */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <Link
                          to={`/mahasiswa/${mhs.nim}`}
                          className="capstone-row-link"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px',
                            background: hoveredRow === mhs.id
                              ? 'linear-gradient(135deg, #5790AB, #06446B)'
                              : 'rgba(87,144,171,0.08)',
                            border: `1px solid ${hoveredRow === mhs.id ? 'transparent' : 'rgba(87,144,171,0.2)'}`,
                            borderRadius: '8px',
                            fontSize: '12px', fontWeight: '700',
                            color: hoveredRow === mhs.id ? '#ffffff' : '#5790AB',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Detail
                          <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ padding: '56px 20px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '56px', height: '56px', borderRadius: '16px',
                          background: 'rgba(156,205,219,0.12)',
                          border: '1px solid rgba(156,205,219,0.2)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Search size={22} color="#9CCDDB" />
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8', margin: 0 }}>
                          Tidak ada data ditemukan
                        </p>
                        <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>
                          Coba ubah kata kunci atau filter status
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredData.length > 0 && (
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid rgba(156,205,219,0.15)',
              background: 'rgba(248,251,253,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                Menampilkan <strong style={{ color: '#5790AB' }}>{filteredData.length}</strong> dari{' '}
                <strong style={{ color: '#5790AB' }}>{dummyMahasiswa.length}</strong> mahasiswa
              </span>
              <span style={{
                fontSize: '11px', fontWeight: '600', color: '#9CCDDB',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Sistem Informasi · UAD
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Capstone;