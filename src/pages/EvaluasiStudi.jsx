import { useState, useEffect } from 'react';
import { Search, Download, Filter, ChevronLeft, ChevronRight, Users, TrendingUp, AlertTriangle, GraduationCap, ArrowUpRight, Eye } from 'lucide-react';
import { dummyMahasiswa } from '../data/dummy';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// ============ [PAGE SECTION] ============
// [KOMPONEN] EvaluasiStudi - Redesigned with world-class enterprise SaaS aesthetics

/* ── Inject global styles once ── */
const STYLE_ID = 'evaluasi-studi-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

    .es-root {
      font-family: 'Poppins', sans-serif;
      --col-navy: #06446B;
      --col-blue: #5790AB;
      --col-teal: #9CCDDB;
      --col-white: #FFFFFF;
      --col-surface: rgba(255,255,255,0.72);
      --col-glass: rgba(255,255,255,0.48);
      --col-border: rgba(87,144,171,0.18);
      --col-border-strong: rgba(87,144,171,0.32);
      --shadow-card: 0 4px 24px rgba(6,68,107,0.08), 0 1px 4px rgba(6,68,107,0.06);
      --shadow-elevated: 0 12px 48px rgba(6,68,107,0.14), 0 4px 16px rgba(6,68,107,0.08);
      --shadow-glow: 0 0 32px rgba(156,205,219,0.28);
      min-height: 100%;
    }

    /* ─── Page entrance animation ─── */
    .es-root {
      animation: esPageReveal 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes esPageReveal {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ─── Staggered children ─── */
    .es-root .es-stagger > * {
      animation: esSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .es-root .es-stagger > *:nth-child(1) { animation-delay: 0.05s; }
    .es-root .es-stagger > *:nth-child(2) { animation-delay: 0.12s; }
    .es-root .es-stagger > *:nth-child(3) { animation-delay: 0.19s; }
    .es-root .es-stagger > *:nth-child(4) { animation-delay: 0.26s; }
    @keyframes esSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ─── Stat cards ─── */
    .es-stat-card {
      background: var(--col-surface);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid var(--col-border);
      border-radius: 20px;
      box-shadow: var(--shadow-card);
      padding: 20px 22px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      transition: box-shadow 0.28s ease, transform 0.28s ease;
      cursor: default;
    }
    .es-stat-card:hover {
      box-shadow: var(--shadow-elevated);
      transform: translateY(-3px);
    }
    .es-stat-icon {
      width: 44px; height: 44px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .es-stat-val {
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 700;
      line-height: 1;
      color: var(--col-navy);
      letter-spacing: -0.5px;
    }
    .es-stat-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--col-blue);
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-top: 3px;
    }
    .es-stat-trend {
      margin-top: 6px;
      font-size: 11.5px;
      font-weight: 500;
      color: #16a34a;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    /* ─── Main card ─── */
    .es-main-card {
      background: var(--col-surface);
      backdrop-filter: blur(20px) saturate(200%);
      -webkit-backdrop-filter: blur(20px) saturate(200%);
      border: 1px solid var(--col-border);
      border-radius: 24px;
      box-shadow: var(--shadow-card);
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* ─── Toolbar ─── */
    .es-toolbar {
      padding: 18px 24px;
      border-bottom: 1px solid var(--col-border);
      background: rgba(255,255,255,0.6);
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
    }
    .es-search-wrap {
      position: relative;
      max-width: 300px;
      width: 100%;
    }
    .es-search-icon {
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--col-blue);
      pointer-events: none;
    }
    .es-input {
      width: 100%;
      background: rgba(156,205,219,0.12);
      border: 1.5px solid var(--col-border-strong);
      border-radius: 12px;
      padding: 9px 12px 9px 38px;
      font-family: 'Poppins', sans-serif;
      font-size: 13.5px;
      color: var(--col-navy);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .es-input::placeholder { color: var(--col-blue); opacity: 0.7; }
    .es-input:focus {
      border-color: var(--col-blue);
      background: rgba(255,255,255,0.9);
      box-shadow: 0 0 0 3px rgba(87,144,171,0.14);
    }
    .es-select {
      background: rgba(156,205,219,0.12);
      border: 1.5px solid var(--col-border-strong);
      border-radius: 12px;
      padding: 9px 36px 9px 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 13.5px;
      color: var(--col-navy);
      outline: none;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235790AB' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
    }
    .es-select:focus {
      border-color: var(--col-blue);
      box-shadow: 0 0 0 3px rgba(87,144,171,0.14);
      background-color: rgba(255,255,255,0.9);
    }

    /* ─── Export buttons ─── */
    .es-btn-export {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 16px;
      border-radius: 11px;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid var(--col-border-strong);
      background: rgba(255,255,255,0.7);
      color: var(--col-navy);
      transition: all 0.22s ease;
      letter-spacing: 0.1px;
    }
    .es-btn-export:hover {
      background: var(--col-navy);
      border-color: var(--col-navy);
      color: #fff;
      box-shadow: 0 4px 16px rgba(6,68,107,0.22);
      transform: translateY(-1px);
    }
    .es-btn-export:active { transform: scale(0.97); }

    /* ─── Table ─── */
    .es-table-wrap {
      overflow-x: auto;
      flex: 1;
    }
    .es-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }
    .es-table thead tr {
      background: linear-gradient(90deg, rgba(6,68,107,0.04) 0%, rgba(156,205,219,0.08) 100%);
    }
    .es-table thead th {
      padding: 13px 20px;
      font-family: 'Poppins', sans-serif;
      font-size: 10.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      color: var(--col-blue);
      white-space: nowrap;
      border-bottom: 1px solid var(--col-border);
    }
    .es-table tbody tr {
      border-bottom: 1px solid rgba(87,144,171,0.09);
      transition: background 0.18s ease;
    }
    .es-table tbody tr:hover {
      background: rgba(156,205,219,0.12);
    }
    .es-table tbody tr:last-child { border-bottom: none; }
    .es-table td {
      padding: 14px 20px;
      color: var(--col-navy);
      vertical-align: middle;
    }
    .es-nim {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 12.5px;
      letter-spacing: 0.3px;
      color: var(--col-navy);
    }
    .es-name {
      font-weight: 500;
      color: #1e3a4f;
    }
    .es-center { text-align: center; }
    .es-right { text-align: right; }
    .es-ipk {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      font-size: 14px;
    }

    /* ─── Badges ─── */
    .es-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.2px;
      white-space: nowrap;
    }
    .es-badge-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .es-badge-aktif   { background: rgba(22,163,74,0.1);   color: #15803d; border: 1px solid rgba(22,163,74,0.2); }
    .es-badge-aktif .es-badge-dot   { background: #16a34a; box-shadow: 0 0 0 2px rgba(22,163,74,0.2); }
    .es-badge-berisiko { background: rgba(220,38,38,0.1);  color: #b91c1c; border: 1px solid rgba(220,38,38,0.2); }
    .es-badge-berisiko .es-badge-dot { background: #dc2626; box-shadow: 0 0 0 2px rgba(220,38,38,0.2); }
    .es-badge-evaluasi { background: rgba(234,88,12,0.1);  color: #c2410c; border: 1px solid rgba(234,88,12,0.2); }
    .es-badge-evaluasi .es-badge-dot { background: #ea580c; box-shadow: 0 0 0 2px rgba(234,88,12,0.2); }
    .es-badge-lulus   { background: rgba(87,144,171,0.12); color: var(--col-navy); border: 1px solid rgba(87,144,171,0.25); }
    .es-badge-lulus .es-badge-dot   { background: var(--col-blue); }
    .es-badge-default { background: rgba(100,116,139,0.1); color: #475569; border: 1px solid rgba(100,116,139,0.2); }

    /* ─── Detail link ─── */
    .es-detail-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border-radius: 9px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--col-blue);
      background: rgba(87,144,171,0.08);
      border: 1px solid var(--col-border-strong);
      text-decoration: none;
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .es-detail-link:hover {
      background: var(--col-navy);
      color: #fff;
      border-color: var(--col-navy);
      box-shadow: 0 4px 12px rgba(6,68,107,0.18);
      transform: translateY(-1px);
    }
    .es-detail-link svg { transition: transform 0.2s; }
    .es-detail-link:hover svg { transform: translate(2px, -2px); }

    /* ─── Empty state ─── */
    .es-empty {
      padding: 64px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--col-blue);
    }
    .es-empty-icon {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: rgba(156,205,219,0.15);
      border: 2px dashed rgba(87,144,171,0.3);
      display: flex; align-items: center; justify-content: center;
      color: rgba(87,144,171,0.6);
      margin-bottom: 4px;
    }

    /* ─── Pagination ─── */
    .es-pagination {
      padding: 14px 24px;
      border-top: 1px solid var(--col-border);
      background: rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }
    .es-page-info {
      font-size: 12.5px;
      color: var(--col-blue);
      font-weight: 500;
    }
    .es-page-info strong {
      color: var(--col-navy);
      font-weight: 700;
    }
    .es-page-btns {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .es-page-btn {
      width: 32px; height: 32px;
      border-radius: 9px;
      border: 1.5px solid var(--col-border-strong);
      background: rgba(255,255,255,0.7);
      color: var(--col-navy);
      font-size: 12px;
      font-weight: 600;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.18s;
      font-family: 'Poppins', sans-serif;
    }
    .es-page-btn:hover:not(:disabled) {
      background: var(--col-blue);
      border-color: var(--col-blue);
      color: #fff;
    }
    .es-page-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .es-page-btn.active {
      background: var(--col-navy);
      border-color: var(--col-navy);
      color: #fff;
      box-shadow: 0 2px 10px rgba(6,68,107,0.25);
    }

    /* ─── Page header ─── */
    .es-page-title {
      font-family: 'Poppins', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--col-navy);
      letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .es-page-sub {
      font-size: 13.5px;
      color: var(--col-blue);
      margin-top: 4px;
      font-weight: 400;
    }
    .es-title-pill {
      display: inline-block;
      background: linear-gradient(135deg, rgba(156,205,219,0.3) 0%, rgba(87,144,171,0.15) 100%);
      border: 1px solid rgba(87,144,171,0.25);
      border-radius: 6px;
      padding: 2px 10px;
      font-family: 'Poppins', sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      color: var(--col-blue);
      margin-bottom: 6px;
    }

    /* ─── Row entrance animation ─── */
    .es-table tbody tr {
      animation: esRowIn 0.35s ease both;
    }
    @keyframes esRowIn {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    /* ─── Separator line decoration ─── */
    .es-header-line {
      width: 40px;
      height: 3px;
      border-radius: 2px;
      background: linear-gradient(90deg, var(--col-blue), var(--col-teal));
      margin-top: 8px;
    }

    /* ─── IPK color coding ─── */
    .es-ipk-high { color: #15803d; }
    .es-ipk-mid  { color: var(--col-navy); }
    .es-ipk-low  { color: #b91c1c; }
  `;
  document.head.appendChild(style);
}

const EvaluasiStudi = () => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [, setMounted]           = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  /* ── Filter logic (unchanged) ── */
  const filteredData = dummyMahasiswa.filter((mhs) => {
    const matchSearch = mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) || mhs.nim.includes(searchTerm);
    const matchStatus = filterStatus === 'Semua' ? true : mhs.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleExport = (type) => {
    toast.success(`Berhasil mengekspor data ke format ${type}`);
  };

  /* ── Derived stats ── */
  const total     = dummyMahasiswa.length;
  const aktif     = dummyMahasiswa.filter(m => m.status === 'Aktif').length;
  const berisiko  = dummyMahasiswa.filter(m => m.status === 'Berisiko').length;
  const evaluasi  = dummyMahasiswa.filter(m => m.status === 'Evaluasi').length;
  const lulus     = dummyMahasiswa.filter(m => m.status === 'Lulus').length;

  /* ── Badge renderer ── */
  const getStatusBadge = (status) => {
    const map = {
      'Aktif':    ['es-badge-aktif',    status],
      'Berisiko': ['es-badge-berisiko', status],
      'Evaluasi': ['es-badge-evaluasi', status],
      'Lulus':    ['es-badge-lulus',    status],
    };
    const [cls, label] = map[status] || ['es-badge-default', status];
    return (
      <span className={`es-badge ${cls}`}>
        <span className="es-badge-dot" />
        {label}
      </span>
    );
  };

  const getIpkClass = (ipk) => {
    if (ipk >= 3.5) return 'es-ipk es-ipk-high';
    if (ipk >= 2.5) return 'es-ipk es-ipk-mid';
    return 'es-ipk es-ipk-low';
  };

  /* ── Stat cards data ── */
  const stats = [
    {
      icon: <Users size={20} />,
      bg: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
      color: '#0369a1',
      val: total,
      label: 'Total Mahasiswa',
      trend: null,
    },
    {
      icon: <TrendingUp size={20} />,
      bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
      color: '#15803d',
      val: aktif,
      label: 'Aktif',
      trend: `${((aktif/total)*100).toFixed(0)}% dari total`,
    },
    {
      icon: <AlertTriangle size={20} />,
      bg: 'linear-gradient(135deg,#fee2e2,#fecaca)',
      color: '#b91c1c',
      val: berisiko + evaluasi,
      label: 'Perlu Perhatian',
      trend: `${berisiko} Berisiko · ${evaluasi} Evaluasi`,
    },
    {
      icon: <GraduationCap size={20} />,
      bg: 'linear-gradient(135deg,#e0f2fe,#cffafe)',
      color: '#0e7490',
      val: lulus,
      label: 'Lulus',
      trend: `${((lulus/total)*100).toFixed(0)}% tingkat kelulusan`,
    },
  ];

  return (
    <div className="es-root" style={{ display:'flex', flexDirection:'column', gap:'22px', paddingBottom:'8px' }}>

      {/* ── Page header ── */}
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:'16px' }}>
        <div>
          <div className="es-title-pill">Akademik</div>
          <h1 className="es-page-title">Evaluasi Studi Mahasiswa</h1>
          <p className="es-page-sub">Pantau dan analisis status akademik seluruh mahasiswa program studi</p>
          <div className="es-header-line" />
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => handleExport('Excel')} className="es-btn-export">
            <Download size={14} /> Excel
          </button>
          <button onClick={() => handleExport('PDF')} className="es-btn-export">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="es-stagger" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:'14px' }}>
        {stats.map((s, i) => (
          <div key={i} className="es-stat-card">
            <div className="es-stat-icon" style={{ background: s.bg }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div style={{ minWidth:0 }}>
              <div className="es-stat-val">{s.val}</div>
              <div className="es-stat-label">{s.label}</div>
              {s.trend && (
                <div className="es-stat-trend">
                  <ArrowUpRight size={11} />
                  <span style={{ color: s.color === '#b91c1c' ? '#b91c1c' : undefined }}>{s.trend}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Main table card ── */}
      <div className="es-main-card">

        {/* Toolbar */}
        <div className="es-toolbar">
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', flex:1 }}>
            <div className="es-search-wrap">
              <Search className="es-search-icon" size={16} />
              <input
                type="text"
                placeholder="Cari NIM atau Nama..."
                className="es-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <Filter size={15} style={{ color:'var(--col-blue)', flexShrink:0 }} />
              <select
                className="es-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Berisiko">Berisiko</option>
                <option value="Evaluasi">Evaluasi</option>
                <option value="Lulus">Lulus</option>
              </select>
            </div>
          </div>
          <span style={{ fontSize:'12px', color:'var(--col-blue)', fontWeight:500, whiteSpace:'nowrap' }}>
            {filteredData.length} hasil ditemukan
          </span>
        </div>

        {/* Table */}
        <div className="es-table-wrap">
          <table className="es-table">
            <thead>
              <tr>
                <th>NIM</th>
                <th>Nama Mahasiswa</th>
                <th className="es-center">Angkatan</th>
                <th className="es-center">IPK</th>
                <th className="es-center">SKS</th>
                <th>Status</th>
                <th className="es-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((mhs) => (
                  <tr key={mhs.id}>
                    <td><span className="es-nim">{mhs.nim}</span></td>
                    <td><span className="es-name">{mhs.nama}</span></td>
                    <td className="es-center" style={{ fontSize:'13px', fontWeight:600 }}>{mhs.angkatan}</td>
                    <td className="es-center">
                      <span className={getIpkClass(mhs.ipk)}>{mhs.ipk.toFixed(2)}</span>
                    </td>
                    <td className="es-center" style={{ fontWeight:500 }}>{mhs.sks}</td>
                    <td>{getStatusBadge(mhs.status)}</td>
                    <td className="es-right">
                      <Link to={`/mahasiswa/${mhs.nim}`} className="es-detail-link">
                        <Eye size={13} />
                        Detail
                        <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="es-empty">
                      <div className="es-empty-icon">
                        <Search size={28} />
                      </div>
                      <p style={{ fontSize:'15px', fontWeight:600, color:'var(--col-navy)', margin:0 }}>
                        Tidak ada data ditemukan
                      </p>
                      <p style={{ fontSize:'13px', margin:0, opacity:0.7 }}>
                        Coba ubah kata kunci pencarian atau filter status.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="es-pagination">
          <span className="es-page-info">
            Menampilkan <strong>{filteredData.length}</strong> dari <strong>{dummyMahasiswa.length}</strong> mahasiswa
          </span>
          <div className="es-page-btns">
            <button className="es-page-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="es-page-btn active">1</button>
            <button className="es-page-btn" disabled>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluasiStudi;