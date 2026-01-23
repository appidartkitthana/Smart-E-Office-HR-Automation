
import React, { useState } from 'react';
import { MOCK_KPI, MOCK_OKRS, COLORS, MOCK_EMPLOYEES } from '../constants';
import { KPI, Language } from '../types';
import { TrendingUp, Plus, Edit2, Trash2, CheckCircle, Search, Target, Users, BarChart2, X, History } from 'lucide-react';

// Add KPIPerformanceProps to handle incoming translation props
interface KPIPerformanceProps {
  lang: Language;
  t: any;
}

const KPIPerformance: React.FC<KPIPerformanceProps> = ({ lang, t }) => {
  const [kpis, setKpis] = useState<KPI[]>(MOCK_KPI);
  const [showModal, setShowModal] = useState(false);
  const [currentKpi, setCurrentKpi] = useState<Partial<KPI> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');

  const handleOpenModal = (kpi?: KPI) => {
    setCurrentKpi(kpi || { period: 'Q2 2024', status: 'Draft', score: 0, date: new Date().toISOString().split('T')[0] });
    setShowModal(true);
  };

  const handleSaveKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentKpi) return;
    if (currentKpi.id) {
      setKpis(kpis.map(k => k.id === currentKpi.id ? (currentKpi as KPI) : k));
    } else {
      const newKpi: KPI = { ...currentKpi as KPI, id: Math.random().toString(36).substr(2, 9) };
      setKpis([newKpi, ...kpis]);
    }
    setShowModal(false);
  };

  const filteredKpis = kpis.filter(k => 
    k.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">KPI & ผลการปฏิบัติงาน</h1>
          <p className="text-slate-500">ระบบติดตามประสิทธิภาพและเป้าหมายองค์กร (OKRs)</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2">
          <Plus size={20} />
          <span>บันทึกผลการประเมิน</span>
        </button>
      </div>

      {/* Real-time OKR Progress */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-wider"><Target className="text-sky-500" /> OKR Performance Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_OKRS.map(okr => (
            <div key={okr.id} className="space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-sm font-bold text-slate-700">{okr.objective}</p>
                <p className="text-xl font-black text-sky-600">{okr.progress}%</p>
              </div>
              <div className="w-full h-4 bg-sky-50 rounded-full overflow-hidden border border-sky-100">
                <div className="h-full bg-sky-400 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${okr.progress}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">เจ้าของ: {okr.owner} • กำหนด: {okr.deadline}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit">
        <button onClick={() => setActiveTab('current')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'current' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}>รายการประเมินปัจจุบัน</button>
        <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-sky-500 text-white' : 'text-slate-500'}`}><History size={16} /> ประวัติการประเมิน</button>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาชื่อพนักงาน..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-transparent border-none outline-none text-sm" />
          </div>
        </div>

        <div className="space-y-3">
          {filteredKpis.map(kpi => (
            <div key={kpi.id} className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-sm flex items-center justify-between group hover:border-sky-300 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 font-black text-2xl border border-sky-100">{kpi.score}</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{kpi.employeeName}</h4>
                  <p className="text-xs text-slate-400 font-medium">รอบ {kpi.period} • บันทึกเมื่อ {kpi.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${kpi.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{kpi.status}</span>
                <button onClick={() => handleOpenModal(kpi)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"><Edit2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && currentKpi && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={24} /></button>
            <form onSubmit={handleSaveKpi} className="space-y-6">
              <div className="flex items-center gap-4 mb-2"><div className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center"><TrendingUp size={24} /></div><h3 className="text-2xl font-black text-slate-800">ประเมินผล KPI</h3></div>
              <div className="space-y-4">
                <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={currentKpi.employeeId || ''} onChange={e => { const emp = MOCK_EMPLOYEES.find(m => m.id === e.target.value); setCurrentKpi({...currentKpi, employeeId: e.target.value, employeeName: emp?.name}); }}>
                  <option value="">เลือกพนักงาน...</option>
                  {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="รอบประเมิน" required className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={currentKpi.period || ''} onChange={e => setCurrentKpi({...currentKpi, period: e.target.value})} />
                   <input type="number" placeholder="คะแนน" required min="0" max="100" className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={currentKpi.score || 0} onChange={e => setCurrentKpi({...currentKpi, score: parseInt(e.target.value)})} />
                </div>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium h-24" value={currentKpi.comments || ''} onChange={e => setCurrentKpi({...currentKpi, comments: e.target.value})} placeholder="ข้อเสนอแนะ..." />
              </div>
              <button type="submit" className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">บันทึกข้อมูล</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIPerformance;
