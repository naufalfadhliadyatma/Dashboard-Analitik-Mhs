import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ============ [CHART SECTION] ============
// [KOMPONEN] GpaTrendChart - Line chart untuk menampilkan tren IPK rata-rata per angkatan

const GpaTrendChart = ({ data }) => {
  return (
    <div className="h-72 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="angkatan" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            domain={[2.5, 4.0]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            cursor={{ stroke: '#9CCDDB', strokeWidth: 2, strokeDasharray: '3 3' }}
          />
          <Line 
            type="monotone" 
            dataKey="ipk" 
            stroke="#06446B" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#06446B', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6, fill: '#5790AB', strokeWidth: 0 }}
            name="Rata-rata IPK"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GpaTrendChart;
