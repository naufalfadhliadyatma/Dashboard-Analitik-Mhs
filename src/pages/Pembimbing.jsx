import { useState } from 'react';
import { dummyPembimbing } from '../data/dummy';
import { Edit2, Users, X, UserCheck, PieChart, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// [BACKEND] Base URL — ganti sesuai env
// ─────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

// ─────────────────────────────────────────────
// [BACKEND] POST /api/pembimbing
//   Body  : { nama: string, kuota: number }
//   Return: { id: string, nama: string, kuota: number, bebanBimbingan: number }
// ─────────────────────────────────────────────
async function apiTambahPembimbing(payload) {
  const res = await fetch(`${API_BASE}/api/pembimbing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Gagal menambahkan pembimbing');
  }
  return res.json();
}

// ─────────────────────────────────────────────
// [BACKEND] PUT /api/pembimbing/:id
//   Body  : { kuota: number }
//   Return: { id: string, nama: string, kuota: number, bebanBimbingan: number }
// ─────────────────────────────────────────────
async function apiUpdateKuota(id, kuota) {
  const res = await fetch(`${API_BASE}/api/pembimbing/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ kuota }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Gagal memperbarui kuota');
  }
  return res.json();
}

// ─────────────────────────────────────────────
// Blank form state untuk modal Tambah Dosen
// ─────────────────────────────────────────────
const EMPTY_FORM = { nama: '', kuota: 10 };

const Pembimbing = () => {
  // ── existing state ──────────────────────────
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [newKuota, setNewKuota]           = useState(0);

  // ── new state: Tambah Dosen modal ───────────
  const [isTambahOpen, setIsTambahOpen]   = useState(false);
  const [form, setForm]                   = useState(EMPTY_FORM);
  const [isSaving, setIsSaving]           = useState(false);
  const [formError, setFormError]         = useState('');

  // ── existing handlers ────────────────────────
  const openEditModal = (dosen) => {
    setSelectedDosen(dosen);
    setNewKuota(dosen.kuota);
    setIsModalOpen(true);
  };

  const handleSaveModal = async () => {
    try {
      // [BACKEND] PUT /api/pembimbing/:id
      await apiUpdateKuota(selectedDosen.id, newKuota);
      toast.success(`Kuota bimbingan ${selectedDosen.nama} berhasil diperbarui!`);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ── new handlers: Tambah Dosen ───────────────
  const openTambahModal = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setIsTambahOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'kuota' ? parseInt(value) || 0 : value,
    }));
    setFormError('');
  };

  const handleTambahSave = async () => {
    // ── client-side validation ──
    if (!form.nama.trim()) {
      setFormError('Nama dosen wajib diisi.');
      return;
    }
    if (form.kuota < 1) {
      setFormError('Kuota minimal adalah 1 mahasiswa.');
      return;
    }

    setIsSaving(true);
    try {
      // [BACKEND] POST /api/pembimbing
      await apiTambahPembimbing({ nama: form.nama.trim(), kuota: form.kuota });
      toast.success(`Dosen "${form.nama.trim()}" berhasil ditambahkan!`);
      setIsTambahOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // ── derived stats (unchanged) ────────────────
  const totalDosen = dummyPembimbing.length;
  const avgLoad    = Math.round(
    dummyPembimbing.reduce((acc, d) => acc + (d.bebanBimbingan / d.kuota) * 100, 0) / totalDosen
  );
  const overloaded = dummyPembimbing.filter((d) => d.bebanBimbingan >= d.kuota).length;

  return (
    <div
      className="space-y-7 animate-in fade-in duration-500"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold" style={{ color: '#06446B' }}>
            <Users size={24} style={{ color: '#5790AB' }} />
            Kelola Pembimbing
          </h1>
          <p className="text-sm mt-1" style={{ color: '#6b8fa8' }}>
            Daftar dosen pembimbing akademik dan tugas akhir
          </p>
        </div>

        {/* ── REVISED: Tambah Dosen button now opens modal ── */}
        <button
          onClick={openTambahModal}
          style={{
            background: 'linear-gradient(135deg, #06446B, #5790AB)',
            color: '#fff',
            border: 'none',
            padding: '9px 18px',
            borderRadius: '10px',
            fontFamily: 'inherit',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            letterSpacing: '.01em',
          }}
        >
          <Plus size={15} /> Tambah Dosen
        </button>
      </div>

      {/* ── Stat Cards (unchanged) ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Pembimbing', val: totalDosen,   sub: 'Aktif semester ini',         Icon: UserCheck,    accent: '#06446B' },
          { label: 'Rata-rata Beban',  val: `${avgLoad}%`, sub: 'Dari total kapasitas',      Icon: PieChart,     accent: '#5790AB' },
          { label: 'Overloaded',       val: overloaded,   sub: 'Perlu penyesuaian kuota',    Icon: AlertTriangle, accent: '#dc2626', danger: true },
        ].map(({ label, val, sub, Icon, accent, danger }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid #d4eaf3', borderRadius: '16px', padding: '1rem 1.2rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: `linear-gradient(180deg, ${accent}, #9CCDDB)` }} />
            <div style={{ fontSize: '11px', color: '#6b8fa8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '6px' }}>{label}</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: danger ? '#dc2626' : accent, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '11px', color: '#6b8fa8', marginTop: '4px' }}>{sub}</div>
            <Icon size={32} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: danger ? '#fca5a5' : '#9CCDDB', opacity: 0.8 }} />
          </div>
        ))}
      </div>

      {/* ── Advisor Grid (unchanged) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dummyPembimbing.map((dosen) => {
          const pct      = Math.round((dosen.bebanBimbingan / dosen.kuota) * 100);
          const isOver   = pct >= 100;
          const isHigh   = pct >= 80 && !isOver;

          const statusLabel = isOver ? 'Overload' : isHigh ? 'Tinggi' : 'Normal';
          const badgeStyle  = isOver
            ? { background: '#fde8e8', color: '#b91c1c' }
            : isHigh
            ? { background: '#fff5e6', color: '#b45a00' }
            : { background: '#e6f9ef', color: '#1a7a45' };

          const fillColor  = isOver
            ? 'linear-gradient(90deg,#ef4444,#dc2626)'
            : isHigh
            ? 'linear-gradient(90deg,#f59e0b,#d97706)'
            : 'linear-gradient(90deg,#22c55e,#16a34a)';

          const pctClass   = isOver ? '#dc2626' : isHigh ? '#d97706' : '#16a34a';
          const avatarGrad = isOver
            ? 'linear-gradient(135deg,#b91c1c,#ef4444)'
            : isHigh
            ? 'linear-gradient(135deg,#b45a00,#f59e0b)'
            : 'linear-gradient(135deg,#06446B,#5790AB)';

          return (
            <div
              key={dosen.id}
              className="group"
              style={{ background: '#fff', border: '1px solid #d4eaf3', borderRadius: '16px', padding: '1.2rem', position: 'relative', overflow: 'hidden', transition: 'transform .22s cubic-bezier(.4,0,.2,1), box-shadow .22s' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(6,68,107,.13)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg,#06446B,#5790AB,#9CCDDB)' }} />
              <button
                onClick={() => openEditModal(dosen)}
                title="Edit Kuota"
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b8fa8', padding: '5px', borderRadius: '8px', opacity: 0, transition: 'opacity .2s, background .2s' }}
                className="group-hover:!opacity-100 hover:!bg-[#e8f6fa] hover:!text-[#06446B]"
              >
                <Edit2 size={15} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {dosen.nama.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f2740', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '28px' }}>{dosen.nama}</div>
                  <div style={{ fontSize: '11px', color: '#6b8fa8', marginTop: '2px' }}>ID: {dosen.id}</div>
                </div>
                <span style={{ ...badgeStyle, fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', flexShrink: 0, letterSpacing: '.03em' }}>{statusLabel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b8fa8', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#0f2740' }}>Beban Bimbingan</span>
                <span>{dosen.bebanBimbingan} / {dosen.kuota} Mhs</span>
              </div>
              <div style={{ height: '8px', background: '#e8f6fa', borderRadius: '20px', overflow: 'hidden', marginBottom: '4px' }}>
                <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: '20px', background: fillColor, transition: 'width .45s cubic-bezier(.4,0,.2,1)' }} />
              </div>
              <div style={{ fontSize: '11px', textAlign: 'right', fontWeight: 700, color: pctClass }}>{pct}% Kapasitas Terisi</div>
            </div>
          );
        })}
      </div>

      {/* ── Modal: Edit Kuota (unchanged) ── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(6,68,107,.45)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn .18s ease' }}>
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '420px', overflow: 'hidden', animation: 'slideUp .22s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 24px 80px rgba(6,68,107,.28)' }}>
            <div style={{ background: 'linear-gradient(135deg,#06446B,#5790AB)', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}><Edit2 size={16} /> Edit Pembimbing</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
            </div>
            <div style={{ padding: '1.4rem 1.5rem', display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b8fa8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Nama Dosen</label>
                <div style={{ background: '#e8f6fa', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontWeight: 700, color: '#06446B' }}>{selectedDosen?.nama}</div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b8fa8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>Kuota Bimbingan Maksimal</label>
                <input type="number" value={newKuota} onChange={(e) => setNewKuota(parseInt(e.target.value) || 0)} min="0" style={{ width: '100%', border: '1.5px solid #d4eaf3', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontFamily: 'inherit', color: '#0f2740', outline: 'none' }} onFocus={(e) => (e.target.style.borderColor = '#5790AB')} onBlur={(e) => (e.target.style.borderColor = '#d4eaf3')} />
                <p style={{ fontSize: '11px', color: '#6b8fa8', marginTop: '5px' }}>Beban saat ini: {selectedDosen?.bebanBimbingan} mahasiswa</p>
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #d4eaf3', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#f8fbfd' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: '1.5px solid #d4eaf3', color: '#6b8fa8', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Batal</button>
              <button onClick={handleSaveModal} style={{ background: 'linear-gradient(135deg,#06446B,#5790AB)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW: Modal Tambah Dosen ── */}
      {isTambahOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(6,68,107,.45)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', animation: 'fadeIn .18s ease' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsTambahOpen(false); }}
        >
          <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}`}</style>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '440px', overflow: 'hidden', animation: 'slideUp .22s cubic-bezier(.34,1.56,.64,1)', boxShadow: '0 24px 80px rgba(6,68,107,.28)' }}>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#06446B,#5790AB)', padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={16} /> Tambah Dosen Pembimbing
              </h3>
              <button
                onClick={() => setIsTambahOpen(false)}
                style={{ background: 'rgba(255,255,255,.2)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.4rem 1.5rem', display: 'grid', gap: '14px' }}>

              {/* Nama Dosen */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b8fa8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>
                  Nama Dosen <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleFormChange}
                  placeholder="Contoh: Dr. Budi Santoso, M.Kom"
                  style={{ width: '100%', border: `1.5px solid ${formError && !form.nama.trim() ? '#ef4444' : '#d4eaf3'}`, borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontFamily: 'inherit', color: '#0f2740', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#5790AB')}
                  onBlur={(e) => (e.target.style.borderColor = formError && !form.nama.trim() ? '#ef4444' : '#d4eaf3')}
                />
              </div>

              {/* Kuota */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b8fa8', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '5px' }}>
                  Kuota Bimbingan <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  name="kuota"
                  value={form.kuota}
                  onChange={handleFormChange}
                  min="1"
                  style={{ width: '100%', border: `1.5px solid ${formError && form.kuota < 1 ? '#ef4444' : '#d4eaf3'}`, borderRadius: '10px', padding: '9px 14px', fontSize: '13px', fontFamily: 'inherit', color: '#0f2740', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#5790AB')}
                  onBlur={(e) => (e.target.style.borderColor = formError && form.kuota < 1 ? '#ef4444' : '#d4eaf3')}
                />
                <p style={{ fontSize: '11px', color: '#6b8fa8', marginTop: '5px' }}>
                  Jumlah maksimal mahasiswa yang dapat dibimbing
                </p>
              </div>

              {/* Inline error */}
              {formError && (
                <div style={{ background: '#fde8e8', border: '1px solid #fca5a5', borderRadius: '10px', padding: '9px 14px', fontSize: '12px', color: '#b91c1c', fontWeight: 600 }}>
                  {formError}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #d4eaf3', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#f8fbfd' }}>
              <button
                onClick={() => setIsTambahOpen(false)}
                disabled={isSaving}
                style={{ background: 'none', border: '1.5px solid #d4eaf3', color: '#6b8fa8', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Batal
              </button>
              <button
                onClick={handleTambahSave}
                disabled={isSaving}
                style={{ background: isSaving ? '#9CCDDB' : 'linear-gradient(135deg,#06446B,#5790AB)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isSaving ? 'Menyimpan...' : (<><Plus size={14} /> Tambah Dosen</>)}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Pembimbing;