import { useState, useEffect } from 'react';
import { Users, GraduationCap, AlertTriangle, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles, Filter } from 'lucide-react';
import { dummyChartData, dummyMahasiswa } from '../data/dummy';
import { dummySkripsi } from '../data/skripsiData';
import { hitungPersentaseLulusTepatWaktu } from '../utils/dashboardUtils';
import GpaTrendChart from '../components/charts/GpaTrendChart';
import GradStatusChart from '../components/charts/GradStatusChart';
import ProblematicCoursesChart from '../components/charts/ProblematicCoursesChart';

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (extend / override Tailwind inline styles as needed)
   Primary palette: #06446B, #5790AB, #9CCDDB, #FFFFFF
───────────────────────────────────────────── */
const T = {
  navy:   '#06446B',
  mid:    '#5790AB',
  sky:    '#9CCDDB',
  skylt:  '#D8EFF5',
  white:  '#FFFFFF',
  ink:    '#0D1F2D',
  muted:  '#5E7B8A',
  border: 'rgba(87,144,171,0.15)',
  glass:  'rgba(255,255,255,0.72)',
  glassDark: 'rgba(6,68,107,0.06)',
};

/* ─── GRADIENT HELPERS ─── */
const heroGradient  = `linear-gradient(135deg, ${T.navy} 0%, ${T.mid} 55%, ${T.sky} 100%)`;
const meshBg = `radial-gradient(ellipse at 20% 20%, rgba(156,205,219,0.22) 0%, transparent 55%),
               radial-gradient(ellipse at 80% 80%, rgba(87,144,171,0.14) 0%, transparent 55%),
               radial-gradient(ellipse at 60% 10%, rgba(6,68,107,0.06) 0%, transparent 45%),
               #F4F8FB`;

/* ─────────────────────────────────────────────
   STATS CARD  — glassmorphism with gradient accent
───────────────────────────────────────────── */
const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, accent, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const isPositive = trend > 0;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.55s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        background: T.glass,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${T.border}`,
        borderRadius: '20px',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(6,68,107,0.08), 0 1px 2px rgba(6,68,107,0.06)',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(6,68,107,0.14), 0 2px 4px rgba(6,68,107,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(6,68,107,0.08), 0 1px 2px rgba(6,68,107,0.06)';
      }}
    >
      {/* Soft accent blob */}
      <div style={{
        position: 'absolute', top: '-24px', right: '-24px',
        width: '96px', height: '96px', borderRadius: '50%',
        background: accent.blob,
        filter: 'blur(28px)',
        opacity: 0.55, pointerEvents: 'none',
      }} />

      {/* Top row: label + icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.06em',
          textTransform: 'uppercase', color: T.muted, margin: 0,
        }}>{title}</p>
        <div style={{
          width: '40px', height: '40px', borderRadius: '12px',
          background: accent.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} color={accent.iconColor} strokeWidth={2} />
        </div>
      </div>

      {/* Value */}
      <div>
        <h3 style={{
          fontSize: '2rem', fontWeight: 800, color: T.ink,
          margin: 0, lineHeight: 1.1, letterSpacing: '-0.02em',
          fontFamily: '"Poppins", "DM Sans", system-ui, sans-serif',
        }}>{value}</h3>
      </div>

      {/* Trend pill */}
      {trend !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
            background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: isPositive ? '#059669' : '#DC2626',
          }}>
            {isPositive
              ? <ArrowUpRight size={11} strokeWidth={2.5} />
              : <ArrowDownRight size={11} strokeWidth={2.5} />}
            {isPositive ? '+' : ''}{trend}%
          </span>
          <span style={{ fontSize: '12px', color: T.muted }}>{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   CHART CARD  — premium glass container
───────────────────────────────────────────── */
const ChartCard = ({ title, subtitle, children, fullWidth = false, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        gridColumn: fullWidth ? '1 / -1' : undefined,
        background: T.glass,
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: `1px solid ${T.border}`,
        borderRadius: '20px',
        padding: '1.75rem',
        boxShadow: '0 4px 24px rgba(6,68,107,0.07), 0 1px 2px rgba(6,68,107,0.05)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* Subtle top-edge shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
        background: `linear-gradient(90deg, transparent, ${T.sky}, transparent)`,
        opacity: 0.6, pointerEvents: 'none',
      }} />

      <div>
        <h3 style={{
          fontSize: '15px', fontWeight: 700, color: T.ink, margin: 0,
          fontFamily: '"Poppins", "DM Sans", system-ui, sans-serif',
          letterSpacing: '-0.01em',
        }}>{title}</h3>
        <p style={{ fontSize: '12px', color: T.muted, margin: '4px 0 0' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

/* ─────────────────────────────────────────────
   FILTER BADGE  — pill style angkatan selector
───────────────────────────────────────────── */
const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '6px 14px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 600,
      border: active ? 'none' : `1px solid ${T.border}`,
      background: active ? heroGradient : 'transparent',
      color: active ? '#fff' : T.muted,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      letterSpacing: '0.02em',
      lineHeight: 1,
      outline: 'none',
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.glassDark; }}
    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
  >{label}</button>
);

/* ─────────────────────────────────────────────
   PAGE HEADER  — gradient hero strip
───────────────────────────────────────────── */
const PageHeader = ({ filterAngkatan, setFilterAngkatan }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 40); return () => clearTimeout(t); }, []);

  const angkatan = ['Semua', '2023', '2022', '2021', '2020'];

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      borderRadius: '24px',
      background: heroGradient,
      padding: '2rem 2.25rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 8px 40px rgba(6,68,107,0.22)',
      marginBottom: '0',
    }}>
      {/* Decorative mesh */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'radial-gradient(circle at 85% 30%, rgba(255,255,255,0.12) 0%, transparent 50%),' +
          'radial-gradient(circle at 15% 80%, rgba(156,205,219,0.18) 0%, transparent 45%)',
      }} />
      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={16} color="rgba(255,255,255,0.7)" strokeWidth={1.5} />
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)' }}>
              Sistem Informasi · UAD
            </span>
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800, color: '#fff', margin: 0,
            lineHeight: 1.15, letterSpacing: '-0.03em',
            fontFamily: '"Poppins", "DM Sans", system-ui, sans-serif',
            textShadow: '0 1px 12px rgba(6,68,107,0.3)',
          }}>Dashboard Analitik</h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', margin: '6px 0 0', fontWeight: 400 }}>
            Ringkasan performa akademik mahasiswa
          </p>
        </div>

        {/* Angkatan filter pills */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)',
          borderRadius: '40px', padding: '5px 6px',
          border: '1px solid rgba(255,255,255,0.2)',
          flexWrap: 'wrap',
        }}>
          <Filter size={13} color="rgba(255,255,255,0.6)" style={{ marginLeft: '6px' }} />
          {angkatan.map(a => (
            <FilterPill
              key={a}
              label={a === 'Semua' ? 'Semua Angkatan' : a}
              active={filterAngkatan === a}
              onClick={() => setFilterAngkatan(a)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SECTION DIVIDER  — labelled separator
───────────────────────────────────────────── */
const SectionLabel = ({ label, delay }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      opacity: v ? 1 : 0, transition: `opacity 0.5s ease ${delay}ms`,
    }}>
      <span style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: T.mid,
      }}>{label}</span>
      <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${T.border}, transparent)` }} />
    </div>
  );
};

/* ─────────────────────────────────────────────
   DASHBOARD  — main page
───────────────────────────────────────────── */
const Dashboard = () => {
  const [filterAngkatan, setFilterAngkatan] = useState('Semua');

  const persentaseLulusTepatWaktu = hitungPersentaseLulusTepatWaktu(dummyMahasiswa, dummySkripsi);

  const statsData = [
    {
      title: 'Total Mahasiswa Aktif',
      value: '1,245',
      icon: Users,
      trend: 2.4,
      trendLabel: 'dari bulan lalu',
      accent: {
        blob: 'rgba(87,144,171,0.8)',
        iconBg: 'rgba(87,144,171,0.12)',
        iconColor: T.mid,
      },
    },
    {
      title: 'Rata-rata IPK',
      value: '3.42',
      icon: TrendingUp,
      trend: 0.5,
      trendLabel: 'dari semester lalu',
      accent: {
        blob: 'rgba(6,68,107,0.7)',
        iconBg: 'rgba(6,68,107,0.09)',
        iconColor: T.navy,
      },
    },
    {
      title: 'Lulus Tepat Waktu',
      value: `${persentaseLulusTepatWaktu}%`,
      icon: GraduationCap,
      trend: -1.2,
      trendLabel: 'Berdasarkan mahasiswa yang lulus ≤ 8 semester',
      accent: {
        blob: 'rgba(156,205,219,0.9)',
        iconBg: 'rgba(156,205,219,0.22)',
        iconColor: '#2A7A9B',
      },
    },
    {
      title: 'Mahasiswa Berisiko',
      value: '42',
      icon: AlertTriangle,
      trend: -5.0,
      trendLabel: 'dari bulan lalu',
      accent: {
        blob: 'rgba(239,68,68,0.55)',
        iconBg: 'rgba(239,68,68,0.09)',
        iconColor: '#DC2626',
      },
    },
  ];

  return (
    <div style={{
      fontFamily: '"Poppins", "DM Sans", system-ui, sans-serif',
      minHeight: '100vh',
      background: meshBg,
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* ── HEADER ── */}
        <PageHeader filterAngkatan={filterAngkatan} setFilterAngkatan={setFilterAngkatan} />

        {/* ── STATS ── */}
        <div>
          <SectionLabel label="Indikator Utama" delay={150} />
          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {statsData.map((s, i) => (
              <StatsCard key={s.title} {...s} delay={200 + i * 80} />
            ))}
          </div>
        </div>

        {/* ── CHARTS ── */}
        <div>
          <SectionLabel label="Visualisasi Analitik" delay={550} />
          <div style={{
            marginTop: '1rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '1.25rem',
          }}>
            <ChartCard
              title="Tren IPK Rata-rata"
              subtitle="Berdasarkan tahun angkatan masuk"
              delay={600}
            >
              <GpaTrendChart data={dummyChartData.gpaTrend} />
            </ChartCard>

            <ChartCard
              title="Distribusi Status Kelulusan"
              subtitle="Persentase ketepatan waktu kelulusan"
              delay={680}
            >
              <GradStatusChart data={dummyChartData.gradStatus} />
            </ChartCard>

            <ChartCard
              title="Mata Kuliah Kritis"
              subtitle="Mata kuliah dengan jumlah perolehan nilai D/E terbanyak"
              fullWidth
              delay={760}
            >
              <ProblematicCoursesChart data={dummyChartData.problematicCourses} />
            </ChartCard>
          </div>
        </div>

      </div>

      {/* Global font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>
    </div>
  );
};

export default Dashboard;