
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  LogOut,
  ChevronRight,
  Mail
} from 'lucide-react';
import { MENU_ITEMS } from './constants';
import { translations } from './translations';
import { Language } from './types';
import { db } from './services/api';
import Dashboard from './components/Dashboard';
import TaskTracker from './components/TaskTracker';
import ApprovalWorkflow from './components/ApprovalWorkflow';
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
import SystemSettings from './components/SystemSettings';
import SystemActivity from './components/SystemActivity';
import CompanyActivity from './components/CompanyActivity';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [lang, setLang] = useState<Language>('TH');
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const t = translations[lang];
  const currentUser = { id: 'EMP001', name: 'คุณสมชาย รักดี' };

  useEffect(() => {
    if (!hasLoggedIn) {
      db.create('ACTIVITY_LOGS', {
        user: currentUser.name,
        action: 'System Login',
        details: `User entered the system from browser ${navigator.userAgent.substring(0, 30)}...`
      });
      setHasLoggedIn(true);
    }
  }, [hasLoggedIn]);

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      await db.create('ACTIVITY_LOGS', {
        user: currentUser.name,
        action: 'System Logout',
        details: 'User manually requested to exit the application session.'
      });
      alert("ออกจากระบบเรียบร้อยแล้ว");
    }
  };

  const renderContent = () => {
    const props: { lang: Language; t: any } = { lang, t };
    switch(activeTab) {
      case 'dashboard': return <Dashboard {...props} />;
      case 'company-activity': return <CompanyActivity {...props} />;
      case 'tasks': return <TaskTracker {...props} />;
      case 'approvals': return <ApprovalWorkflow {...props} />;
      case 'document-requests': return <DocumentRequestModule {...props} />;
      case 'procurement': return <ProcurementModule {...props} />;
      case 'performance': return <KPIPerformance {...props} />;
      case 'training': return <LMSModule {...props} />;
      case 'leave': return <LeaveOTModule {...props} />;
      case 'inventory': return <InventoryModule {...props} />;
      case 'vehicles': return <VehicleModule {...props} />;
      case 'rooms': return <MeetingRoomModule {...props} />;
      case 'maintenance': return <MaintenanceModule {...props} />;
      case 'expenses': return <ExpenseModule {...props} />;
      case 'system-activity': return <SystemActivity {...props} />;
      case 'settings': return <SystemSettings {...props} />;
      default: return <Dashboard {...props} />;
    }
  };

  const activeMenuLabel = MENU_ITEMS.find(m => m.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <aside className={`main-sidebar fixed inset-y-0 left-0 z-50 w-[250px] transition-all duration-300 transform shadow-lg flex flex-col bg-[#343a40] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-[57px] flex items-center px-4 border-b border-gray-700">
          <div className="w-8 h-8 bg-[#007bff] rounded-full flex items-center justify-center mr-3"><span className="text-white font-bold text-lg">S</span></div>
          <span className="text-gray-300 font-light text-xl tracking-tight">Smart <b className="font-bold">E-Office</b></span>
        </div>
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="w-9 h-9 rounded-full overflow-hidden mr-3 border border-gray-600">
            <img src="https://picsum.photos/id/64/100/100" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-300 text-sm font-medium">{currentUser.name}</span>
            <div className="flex items-center gap-1.5 mt-0.5"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-[10px] text-gray-400 uppercase font-bold">Online</span></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4 px-2 scrollbar-hide">
          <div className="text-gray-500 text-[10px] font-bold uppercase px-3 mb-2 tracking-wider">Main Navigation</div>
          <ul className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id)} 
                  className={`w-full flex items-center px-3 py-2.5 rounded text-sm transition-colors ${activeTab === item.id ? 'bg-[#007bff] text-white font-bold shadow-sm' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                >
                  <span className={`mr-3 ${activeTab === item.id ? 'text-white' : item.color}`}>{item.icon}</span>
                  <span className="flex-1 text-left truncate">{t[item.id as keyof typeof t] || item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout} className="w-full flex items-center text-gray-400 hover:text-white transition-colors text-sm">
            <LogOut size={16} className="mr-3" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'ml-[250px]' : 'ml-0'}`}>
        <header className="h-[57px] bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-black p-2" onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu size={20} /></button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-500 hover:text-black relative"><Mail size={20} /><span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">4</span></button>
            <button className="p-2 text-gray-500 hover:text-black relative"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-4 h-4 bg-yellow-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">15</span></button>
            <div className="flex items-center gap-1 ml-4 pl-4 border-l border-gray-200">
              {['TH', 'EN', 'JP'].map(l => (
                <button key={l} onClick={() => setLang(l as Language)} className={`w-8 h-8 flex items-center justify-center rounded text-[10px] font-bold transition-all ${lang === l ? 'bg-[#007bff] text-white' : 'text-gray-400 hover:bg-gray-100'}`}>{l}</button>
              ))}
            </div>
          </div>
        </header>
        <section className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <h1 className="text-2xl font-light text-gray-800">{t[activeTab as keyof typeof t] || activeMenuLabel}</h1>
          <div className="flex items-center text-xs font-medium text-gray-400 mt-2 sm:mt-0">
             <span className="text-blue-500 hover:underline cursor-pointer">Home</span>
             <ChevronRight size={12} className="mx-2" />
             <span>{t[activeTab as keyof typeof t] || activeMenuLabel}</span>
          </div>
        </section>
        <main className="flex-1 p-4 overflow-y-auto">{renderContent()}</main>
        <footer className="bg-white border-t border-gray-200 px-6 py-3 text-xs text-gray-500 flex justify-between">
          <div><b className="text-gray-800">Copyright &copy; 2024-2025 <span className="text-blue-600">Smart E-Office</span>.</b> All rights reserved.</div>
          <div><b>Version</b> 1.0.0-AdminLTE</div>
        </footer>
      </div>
    </div>
  );
};

export default App;
