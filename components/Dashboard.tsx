
import React, { useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, CreditCard, ClipboardList, 
  TrendingUp, ArrowUpRight, ArrowDownRight, BellRing,
  Box, Truck, Building, Activity, Clock, CheckCircle, AlertCircle
} from 'lucide-react';
import { 
  COLORS, MOCK_TASKS, MOCK_APPROVALS, 
  MOCK_EMPLOYEES, MOCK_INVENTORY, MOCK_VEHICLE_BOOKINGS,
  MOCK_ROOM_BOOKINGS, MOCK_EXPENSE_CLAIMS 
} from '../constants';
import { TaskStatus, Language } from '../types';

interface DashboardProps {
  lang: Language;
  t: any;
}

const StatCard: React.FC<{ title: string, value: string | number, icon: React.ReactNode, color: string, trend?: string, trendUp?: boolean }> = ({ title, value, icon, color, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-sky-100 flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ lang, t }) => {
  const summaryStats = useMemo(() => {
    return {
      totalEmployees: MOCK_EMPLOYEES.length,
      activeTasks: MOCK_TASKS.filter(t => t.status !== TaskStatus.COMPLETED).length,
      pendingApprovals: MOCK_APPROVALS.filter(a => a.status === 'Pending').length,
      lowStock: MOCK_INVENTORY.filter(i => i.stock <= i.minStock).length,
      todayBookings: MOCK_VEHICLE_BOOKINGS.length + MOCK_ROOM_BOOKINGS.length,
      totalExpenses: MOCK_EXPENSE_CLAIMS.reduce((acc, curr) => acc + curr.amount, 0),
    };
  }, []);

  const dataStats = [
    { name: lang === 'TH' ? 'จันทร์' : lang === 'JP' ? '月' : 'Mon', tasks: 12, performance: 85 },
    { name: lang === 'TH' ? 'อังคาร' : lang === 'JP' ? '火' : 'Tue', tasks: 19, performance: 70 },
    { name: lang === 'TH' ? 'พุธ' : lang === 'JP' ? '水' : 'Wed', tasks: 15, performance: 90 },
    { name: lang === 'TH' ? 'พฤหัส' : lang === 'JP' ? '木' : 'Thu', tasks: 22, performance: 65 },
    { name: lang === 'TH' ? 'ศุกร์' : lang === 'JP' ? '金' : 'Fri', tasks: 18, performance: 95 },
  ];

  const pieData = [
    { name: t.active, value: 112 },
    { name: t.late, value: 8 },
    { name: t.onLeave, value: 8 },
  ];

  const PIE_COLORS = [COLORS.success, COLORS.warning, COLORS.error];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">{t.overview}</h1>
          <p className="text-slate-500 font-medium">Real-time Enterprise Management Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={t.totalEmployees} value={summaryStats.totalEmployees} icon={<Users size={24} />} color="bg-sky-100 text-sky-600" trend="+12%" trendUp={true} />
        <StatCard title={t.activeTasks} value={summaryStats.activeTasks} icon={<ClipboardList size={24} />} color="bg-indigo-100 text-indigo-600" trend="5 NEW" trendUp={false} />
        <StatCard title={t.pendingApprovals} value={summaryStats.pendingApprovals} icon={<BellRing size={24} />} color="bg-amber-100 text-amber-600" trend="2 URGENT" trendUp={false} />
        <StatCard title={t.monthlyExpenses} value={`฿${(summaryStats.totalExpenses/1000).toFixed(1)}k`} icon={<CreditCard size={24} />} color="bg-emerald-100 text-emerald-600" trend="-4%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-sky-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider">{t.productivityBudget}</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataStats}>
                <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} />
                <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '20px' }} />
                <Area type="monotone" dataKey="tasks" stroke={COLORS.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-sky-100 flex flex-col">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider mb-8">{t.todayPresence}</h3>
          <div className="h-64 relative mb-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 flex-1">
              {pieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-sky-100 transition-all">
                      <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }}></div>
                          <span className="text-sm text-slate-600 font-bold">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">{item.value}</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-sky-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider flex items-center gap-3 mb-10"><Activity className="text-rose-500" /> {t.systemActivity}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
             <div className="flex gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-sky-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0"><Clock size={18} /></div>
                <div>
                   <p className="text-xs font-bold text-slate-700">Somchai checked in</p>
                   <p className="text-[10px] text-slate-400 mt-1">2 mins ago • Attendance</p>
                </div>
             </div>
             <div className="flex gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-sky-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><BellRing size={18} /></div>
                <div>
                   <p className="text-xs font-bold text-slate-700">New Leave Request</p>
                   <p className="text-[10px] text-slate-400 mt-1">15 mins ago • Approvals</p>
                </div>
             </div>
             <div className="flex gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-sky-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"><AlertCircle size={18} /></div>
                <div>
                   <p className="text-xs font-bold text-slate-700">Paper A4 Low Stock</p>
                   <p className="text-[10px] text-slate-400 mt-1">1 hr ago • Inventory</p>
                </div>
             </div>
             <div className="flex gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-sky-200 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"><CheckCircle size={18} /></div>
                <div>
                   <p className="text-xs font-bold text-slate-700">Yearly Report Task Completed</p>
                   <p className="text-[10px] text-slate-400 mt-1">3 hrs ago • Tasks</p>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
