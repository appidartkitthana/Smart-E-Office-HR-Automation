
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, CreditCard, ClipboardList, 
  BellRing, Clock, AlertCircle, ArrowRightCircle
} from 'lucide-react';
import { Language } from '../types';

interface DashboardProps {
  lang: Language;
  t: any;
}

const InfoBox: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string, footerText?: string }> = ({ title, value, icon, bgColor, footerText }) => (
  <div className={`small-box ${bgColor}`}>
    <div className="inner">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className="icon">
      {icon}
    </div>
    <button className="w-full bg-black/10 py-1 flex items-center justify-center gap-1 text-[11px] font-bold tracking-wider hover:bg-black/20 transition-all text-white border-none cursor-pointer">
      {footerText || 'More info'} <ArrowRightCircle size={12} className="ml-1" />
    </button>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ lang, t }) => {
  const dataStats = [
    { name: 'Mon', tasks: 12 },
    { name: 'Tue', tasks: 19 },
    { name: 'Wed', tasks: 15 },
    { name: 'Thu', tasks: 22 },
    { name: 'Fri', tasks: 18 },
  ];

  const pieData = [
    { name: 'Present', value: 112 },
    { name: 'Late', value: 8 },
    { name: 'On Leave', value: 8 },
  ];

  const PIE_COLORS = ['#28a745', '#ffc107', '#dc3545'];

  return (
    <div className="animate-in fade-in duration-500 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <InfoBox title="Total Employees" value="588" icon={<Users />} bgColor="bg-info" />
        <InfoBox title="Active Tasks" value="12" icon={<ClipboardList />} bgColor="bg-success" />
        <InfoBox title="Pending Approvals" value="4" icon={<BellRing />} bgColor="bg-warning" />
        <InfoBox title="Monthly Expenses" value="฿45.2k" icon={<CreditCard />} bgColor="bg-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="card border-t-4 border-primary">
            <div className="card-header"><h3 className="text-lg font-normal text-gray-800">Weekly System Activity</h3></div>
            <div className="card-body">
               {/* Fix for Recharts width/height warning: ensure height is fixed on parent */}
               <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataStats}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#007bff" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#007bff" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="tasks" stroke="#007bff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="card border-t-4 border-success">
             <div className="card-header"><h3 className="text-lg font-normal text-gray-800">Recent Audit Logs</h3></div>
             <div className="card-body p-0">
                <table className="table table-striped mb-0">
                   <tbody>
                      <tr>
                        <td className="border-t-0"><Clock size={14} className="text-primary inline mr-2"/> Somchai logged in</td>
                        <td className="border-t-0 text-right text-xs text-gray-400">2 mins ago</td>
                      </tr>
                      <tr>
                        <td><BellRing size={14} className="text-warning inline mr-2"/> New Leave Request #L201</td>
                        <td className="text-right text-xs text-gray-400">15 mins ago</td>
                      </tr>
                      <tr>
                        <td><AlertCircle size={14} className="text-danger inline mr-2"/> Stock Alert: Paper A4</td>
                        <td className="text-right text-xs text-gray-400">1 hr ago</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="card border-t-4 border-info">
             <div className="card-header"><h3 className="text-lg font-normal text-gray-800">Attendance Status</h3></div>
             <div className="card-body">
                <div style={{ width: '100%', height: 256, position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-2xl font-bold">128</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">Total</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                   {pieData.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                        <span className="flex items-center gap-2 text-gray-600"><div className="w-2 h-2 rounded-full" style={{backgroundColor: PIE_COLORS[idx]}}></div> {item.name}</span>
                        <span className="font-bold text-gray-700">{item.value}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
