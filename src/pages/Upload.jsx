import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dummyUploadHistory } from '../data/uploadHistoryData';
import { Upload as UploadIcon, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// ============ [PAGE: UPLOAD KHS] ============
// [KOMPONEN] Upload - Halaman bagi Mahasiswa untuk mengunggah file KHS PDF

// [BACKEND] POST /api/khs/upload - Menerima file PDF KHS dari mahasiswa, disertai semester dan tahun akademik
// [BACKEND] GET /api/khs/history/:nim - Mengambil riwayat upload KHS milik mahasiswa berdasarkan NIM

const Upload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [semester, setSemester] = useState('');
  const [tahunAkademik, setTahunAkademik] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Ambil history untuk user ini
  const [history, setHistory] = useState(dummyUploadHistory.filter(h => h.nim === user?.nim));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Hanya file PDF yang diperbolehkan');
        setFile(null);
        e.target.value = null;
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !semester || !tahunAkademik) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 200);

    // Simulate upload delay
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      const newEntry = {
        id: `U${Date.now()}`,
        nim: user?.nim,
        semester,
        tahunAkademik,
        tanggalUpload: new Date().toISOString(),
        namaFile: file.name,
        status: 'Diproses'
      };
      
      setHistory([newEntry, ...history]);
      toast.success('KHS berhasil diunggah!');
      
      // Reset form
      setTimeout(() => {
        setIsUploading(false);
        setProgress(0);
        setFile(null);
        setSemester('');
        setTahunAkademik('');
      }, 500);
    }, 2000);
  };

  const getStatusBadge = (status) => {
    if (status === 'Terverifikasi') return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1"><CheckCircle size={12} /> {status}</span>;
    if (status === 'Ditolak') return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded flex items-center gap-1"><AlertCircle size={12} /> {status}</span>;
    return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded flex items-center gap-1"><Clock size={12} /> {status}</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-accent2 flex items-center gap-2">
          <UploadIcon size={24} className="text-accent1" />
          Upload Kartu Hasil Studi (KHS)
        </h1>
        <p className="text-sm text-text-muted mt-1">Mahasiswa wajib mengupload KHS setiap akhir semester agar data akademik diperbarui.</p>
      </div>

      <div className="card p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-2">Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className="input-field" disabled={isUploading}>
              <option value="">Pilih Semester...</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text-muted mb-2">Tahun Akademik</label>
            <select value={tahunAkademik} onChange={(e) => setTahunAkademik(e.target.value)} className="input-field" disabled={isUploading}>
              <option value="">Pilih Tahun Akademik...</option>
              <option value="2022/2023 Ganjil">2022/2023 Ganjil</option>
              <option value="2022/2023 Genap">2022/2023 Genap</option>
              <option value="2023/2024 Ganjil">2023/2024 Ganjil</option>
              <option value="2023/2024 Genap">2023/2024 Genap</option>
              <option value="2024/2025 Ganjil">2024/2025 Ganjil</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-text-muted mb-2">File KHS (PDF)</label>
          <div className="border-2 border-dashed border-secondary/40 rounded-xl p-8 text-center hover:bg-secondary/5 transition-colors relative">
            <input 
              type="file" 
              accept="application/pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText size={48} className="text-accent1 mb-3" />
                <p className="font-semibold text-accent2">{file.name}</p>
                <p className="text-xs text-text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-text-muted">
                <UploadIcon size={48} className="text-secondary mb-3" />
                <p className="font-medium text-accent2">Klik atau seret file PDF ke sini</p>
                <p className="text-xs">Maksimal 5MB. Hanya format .pdf yang diterima.</p>
              </div>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-1 font-semibold text-accent2">
              <span>Mengunggah...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-secondary/20 rounded-full h-2">
              <div className="bg-accent1 h-2 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        <button 
          onClick={handleUpload} 
          disabled={!file || !semester || !tahunAkademik || isUploading}
          className="btn-primary w-full disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Memproses...' : 'Upload KHS'}
        </button>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold text-accent2 mb-4">Riwayat Upload</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/10 text-accent2 text-sm">
                <th className="p-3 font-semibold rounded-tl-lg">Semester</th>
                <th className="p-3 font-semibold">Tahun Akademik</th>
                <th className="p-3 font-semibold">Tanggal Upload</th>
                <th className="p-3 font-semibold">Nama File</th>
                <th className="p-3 font-semibold rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id} className="border-b border-secondary/10 hover:bg-secondary/5 transition-colors text-sm">
                  <td className="p-3 font-medium text-accent2">{item.semester}</td>
                  <td className="p-3">{item.tahunAkademik}</td>
                  <td className="p-3">{new Date(item.tanggalUpload).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 flex items-center gap-2 text-accent1"><FileText size={16}/> {item.namaFile}</td>
                  <td className="p-3">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-text-muted">Belum ada riwayat upload.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upload;