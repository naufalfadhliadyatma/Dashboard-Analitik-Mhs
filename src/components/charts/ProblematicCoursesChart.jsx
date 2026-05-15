import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============ [CHART SECTION] ============
// [KOMPONEN] ProblematicCoursesChart - Horizontal bar chart untuk mata kuliah dengan nilai D/E terbanyak

const ProblematicCoursesChart = ({ data }) => {
  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          <YAxis 
            dataKey="course" 
            type="category" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 500 }}
            width={120}
          />
          <Tooltip 
            cursor={{ fill: '#F8FAFC' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar 
            dataKey="failCount" 
            fill="#5790AB" 
            radius={[0, 4, 4, 0]} 
            name="Jumlah Gagal (D/E)"
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProblematicCoursesChart;
