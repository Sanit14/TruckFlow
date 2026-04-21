import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { useTrucks } from '../../context/TruckContext';
import { TRUCK_STATUSES } from '../../data/mockData';

const STATUS_COLORS = {
  Idle: '#94a3b8',
  Loading: '#60a5fa',
  Unloading: '#fbbf24',
  Incoming: '#34d399',
  Outgoing: '#f87171',
};

export default function AnalyticsDashboard() {
  const { trucks, truckDistances } = useTrucks();

  // 1. Status Distribution Data
  const statusData = TRUCK_STATUSES.map((status) => ({
    name: status,
    value: trucks.filter((t) => t.status === status).length,
  })).filter((d) => d.value > 0);

  // 2. Geofence Distance Data
  const distanceData = trucks.map((truck) => {
    const distInfo = truckDistances.find((d) => d.id === truck.id);
    return {
      name: truck.name,
      distance: distInfo ? parseFloat(distInfo.distKm.toFixed(1)) : 0,
    };
  }).sort((a, b) => b.distance - a.distance).slice(0, 5); // Top 5 furthest

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-slide-up">
      {/* Status Distribution */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Fleet Status Distribution</h3>
        <div className="h-[300px] w-full">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
          )}
        </div>
      </div>

      {/* Distance Chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Furthest Trucks from Office (km)</h3>
        <div className="h-[300px] w-full">
          {distanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distanceData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="distance" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
