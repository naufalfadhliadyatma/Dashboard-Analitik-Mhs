import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { UploadCloud, File, X, CheckCircle2, AlertTriangle } from 'lucide-react';

// ============ [PAGE SECTION] ============
// [KOMPONEN] Upload - Halaman khusus Admin untuk mengunggah data mahasiswa berformat CSV

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast.error('Hanya file CSV yang diperbolehkan');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Simulasi progress bar upload
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // [BACKEND] POST /api/mahasiswa/upload - Kirim file CSV ke server
    // Endpoint ini akan menerima multipart/form-data
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    clearInterval(interval);
    setProgress(100);
    setUploading(false);
    toast.success('Data CSV berhasil diunggah dan diproses!');
    
    // Reset after success
    setTimeout(() => {
      clearFile();
    }, 2000);
  };

  return (
    <>
      {/* Blok Style untuk memuat dan mengaktifkan Font Poppins */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        .font-poppins {
          font-family: 'Poppins', sans-serif !important;
        }
      `}</style>

      {/* Menambahkan class font-poppins pada div utama */}
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500 font-poppins">
        <div>
          <h1 className="text-2xl font-extrabold text-accent2">Unggah Data Mahasiswa</h1>
          <p className="text-text-muted text-sm mt-1">Impor data terbaru dalam format CSV untuk memperbarui dashboard analitik.</p>
        </div>

        <div className="card">
          {/* Drag and Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 ${
              isDragging ? 'border-accent1 bg-accent1/5' : 'border-secondary/50 hover:border-accent1/50 bg-background/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".csv" 
              className="hidden" 
            />
            
            {!file ? (
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-accent1">
                  <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-medium text-text-main mb-1">Tarik dan lepas file CSV di sini</h3>
                <p className="text-sm text-text-muted mb-6">atau klik untuk memilih file dari komputer Anda</p>
                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Pilih File
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                  <File size={32} />
                </div>
                <h3 className="text-lg font-medium text-text-main mb-1">{file.name}</h3>
                <p className="text-sm text-text-muted mb-4">{(file.size / 1024).toFixed(2)} KB</p>
                
                {!uploading && progress === 0 && (
                  <button 
                    className="text-sm text-red-500 hover:text-red-700 flex items-center transition-colors"
                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  >
                    <X size={16} className="mr-1" /> Hapus File
                  </button>
                )}

                {/* Progress Bar */}
                {(uploading || progress > 0) && (
                  <div className="w-full max-w-md mt-6">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-text-main">{progress === 100 ? 'Selesai' : 'Mengunggah...'}</span>
                      <span className="text-text-muted">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-accent1 h-2.5 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end">
            <button 
              className="btn-primary flex items-center"
              disabled={!file || uploading || progress === 100}
              onClick={handleUpload}
            >
              {progress === 100 ? (
                <><CheckCircle2 size={18} className="mr-2" /> Berhasil</>
              ) : uploading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span> Memproses...</>
              ) : (
                <><UploadCloud size={18} className="mr-2" /> Upload & Proses</>
              )}
            </button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start">
          <AlertTriangle size={20} className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Format File CSV yang Didukung:</p>
            <p>Pastikan file CSV memiliki kolom: NIM, Nama, Angkatan, IPK, Semester, SKS, Status Akademik, dan Status Capstone. Pemisah antar kolom (delimiter) harus menggunakan koma (,).</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Upload;