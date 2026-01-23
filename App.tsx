
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Globe
} from 'lucide-react';
import { MENU_ITEMS } from './constants';
import { translations } from './translations';
import { Language } from './types';
import Dashboard from './components/Dashboard';
import TaskTracker from './components/TaskTracker';
import AttendanceSystem from './components/AttendanceSystem';
import ApprovalWorkflow from './components/ApprovalWorkflow';
import EmployeeManagement from './components/EmployeeManagement';
import KPIPerformance from './components/KPIPerformance';
import LMSModule from './components/LMSModule';
import LeaveOTModule from './components/LeaveOTModule';
import InventoryModule from './components/InventoryModule';
import VehicleModule from './components/VehicleModule';
import MeetingRoomModule from './components/MeetingRoomModule';
import MaintenanceModule from './components/MaintenanceModule';
import ExpenseModule from './components/ExpenseModule';
import ProcurementModule from './components/ProcurementModule';
import DocumentRequestModule from './components/DocumentRequestModule';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLang] = useState<Language>('TH');
  const [now, setNow] = useState(new Date());

  const t = translations[lang];

  const renderContent = () => {
    // Explicitly type props to ensure compatibility with all modules and avoid IntrinsicAttributes errors
    const props: { lang: Language; t: any } = { lang, t };
    switch(activeTab) {
      case 'dashboard': return <Dashboard {...props} />;
      case 'tasks': return <TaskTracker {...props} />;
      case 'attendance': return <AttendanceSystem {...props} />;
      case 'approvals': return <ApprovalWorkflow {...props} />;
      case 'document-requests': return <DocumentRequestModule {...props} />;
      case 'employees': return <EmployeeManagement {...props} />;
      case 'procurement': return <ProcurementModule {...props} />;
      case 'performance': return <KPIPerformance {...props} />;
      case 'training': return <LMSModule {...props} />;
      case 'leave': return <LeaveOTModule {...props} />;
      case 'inventory': return <InventoryModule {...props} />;
      case 'vehicles': return <VehicleModule {...props} />;
      case 'rooms': return <MeetingRoomModule {...props} />;
      case 'maintenance': return <MaintenanceModule {...props} />;
      case 'expenses': return <ExpenseModule {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  const getLocaleString = () => {
    if (lang === 'TH') return 'th-TH';
    if (lang === 'JP') return 'ja-JP';
    return 'en-US';
  };

  return (
    <div className="flex min-h-screen bg-sky-50 overflow-hidden font-['Anuphan']">
      {!isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(true)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-sky-100 transition-transform duration-300 transform shadow-xl lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-400 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100 transform rotate-3">
                    <span className="text-white font-black text-xl">{t.appName.charAt(0)}</span>
                </div>
                <div>
                    <h1 className="font-black text-xl text-slate-800 tracking-tight">{t.appName}</h1>
                    <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{t.version}</p>
                </div>
            </div>
            <button className="lg:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 scrollbar-hide">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">{t.mainMenu}</p>
            {MENU_ITEMS.map((item) => (
              <button 
                key={item.id} 
                onClick={() => { setActiveTab(item.id); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${activeTab === item.id ? 'bg-sky-400 text-white shadow-lg shadow-sky-100 font-bold translate-x-1' : 'text-slate-500 hover:bg-sky-50 hover:text-sky-600 font-medium'}`}
              >
                <span className={`transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-sky-500'}`}>{item.icon}</span>
                <span className="flex-1 text-left">{t[item.id as keyof typeof t] || item.label}</span>
                {activeTab === item.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 space-y-4">
             <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-xl shadow-sm border-2 border-white" alt="profile" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">คุณสมชาย รักดี</p>
                        <p className="text-[10px] text-sky-500 font-bold uppercase">Senior Admin</p>
                    </div>
                </div>
             </div>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all"><LogOut size={20} /><span>{t.logout}</span></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 max-h-screen overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-sky-50 flex items-center justify-between px-8 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 hover:bg-sky-50 rounded-xl text-slate-500" onClick={() => setIsSidebarOpen(true)}><Menu size={24} /></button>
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl w-80">
              <Search size={18} className="text-slate-400" /><input type="text" placeholder={t.search} className="bg-transparent border-none outline-none text-sm w-full" />
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 items-center">
                <button onClick={() => setLang('TH')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'TH' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}>TH</button>
                <button onClick={() => setLang('EN')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}>EN</button>
                <button onClick={() => setLang('JP')} className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${lang === 'JP' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-400'}`}>JP</button>
             </div>
             <button className="p-2.5 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all relative"><Bell size={22} /><span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span></button>
             <div className="hidden sm:block text-right">
                <p className="text-lg font-black text-slate-800 tabular-nums leading-none">
                  {now.toLocaleTimeString(getLocaleString(), { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-[10px] text-sky-500 font-black uppercase tracking-widest mt-1">
                  {now.toLocaleDateString(getLocaleString(), { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 scrollbar-hide bg-sky-50/50">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
