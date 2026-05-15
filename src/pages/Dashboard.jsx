import { useState } from 'react';
import { Users, GraduationCap, AlertTriangle, TrendingUp } from 'lucide-react';
import { dummyChartData } from '../data/dummy';
import GpaTrendChart from '../components/charts/GpaTrendChart';
import GradStatusChart from '../components/charts/GradStatusChart';
import ProblematicCoursesChart from '../components/charts/ProblematicCoursesChart';

// ============ [COMPONENTS SECTION] ============
// [KOMPONEN] StatsCard - Komponen UI untuk menampilkan indikator utama di dashboard

const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass }) => (
  <div className="card flex items-start justify-between">
    <div>
      <p className="text-sm text-text-muted font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-text-main">{value}</h3>
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          <span className={`font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-text-muted ml-1">{trendLabel}</span>
        </div>
      )}
    </div>
    <div className={`p-3 rounded-lg ${colorClass}`}>
      <Icon size={24} />
    </div>
  </div>
);

// ============ [PAGE SECTION] ============
// [KOMPONEN] Dashboard - Halaman utama yang menampilkan ringkasan data dan grafik analitik

const Dashboard = () => {
  const [filterAngkatan, setFilterAngkatan] = useState('Semua');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-accent2">Dashboard Analitik</h1>
          <p className="text-text-muted text-sm mt-1">Ringkasan performa akademik mahasiswa Sistem Informasi</p>
        </div>
        
        <div className="flex bg-white border border-secondary/30 rounded-lg p-1 shadow-sm">
          <span className="text-xs text-text-muted flex items-center px-3 font-medium">Filter Angkatan:</span>
          <select 
            className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium text-accent2 outline-none pr-2"
            value={filterAngkatan}
            onChange={(e) => setFilterAngkatan(e.target.value)}
          >
            <option value="Semua">Semua Angkatan</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Mahasiswa Aktif" 
          value="1,245" 
          icon={Users} 
          trend={2.4} 
          trendLabel="dari bulan lalu"
          colorClass="bg-blue-50 text-blue-600"
        />
        <StatsCard 
          title="Rata-rata IPK" 
          value="3.42" 
          icon={TrendingUp} 
          trend={0.5} 
          trendLabel="dari semester lalu"
          colorClass="bg-green-50 text-green-600"
        />
        <StatsCard 
          title="Lulus Tepat Waktu" 
          value="68%" 
          icon={GraduationCap} 
          trend={-1.2} 
          trendLabel="dari tahun lalu"
          colorClass="bg-indigo-50 text-indigo-600"
        />
        <StatsCard 
          title="Mahasiswa Berisiko" 
          value="42" 
          icon={AlertTriangle} 
          trend={-5.0} 
          trendLabel="dari bulan lalu"
          colorClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GPA Trend */}
        <div className="card flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-lg text-text-main">Tren IPK Rata-rata</h3>
              <p className="text-xs text-text-muted">Berdasarkan tahun angkatan masuk</p>
            </div>
          </div>
          <GpaTrendChart data={dummyChartData.gpaTrend} />
        </div>

        {/* Grad Status */}
        <div className="card flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-lg text-text-main">Distribusi Status Kelulusan</h3>
              <p className="text-xs text-text-muted">Persentase ketepatan waktu kelulusan</p>
            </div>
          </div>
          <GradStatusChart data={dummyChartData.gradStatus} />
        </div>

        {/* Problematic Courses - Full Width */}
        <div className="card flex flex-col lg:col-span-2">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-lg text-text-main">Mata Kuliah Kritis</h3>
              <p className="text-xs text-text-muted">Mata kuliah dengan jumlah perolehan nilai D/E terbanyak</p>
            </div>
          </div>
          <ProblematicCoursesChart data={dummyChartData.problematicCourses} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
