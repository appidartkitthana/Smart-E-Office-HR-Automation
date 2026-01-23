
import React, { useState } from 'react';
import { MOCK_MAINTENANCE_TICKETS, MOCK_EMPLOYEES } from '../constants';
import { MaintenanceTicket, Language } from '../types';
import { Wrench, Plus, Edit2, Trash2, Search, Filter, Clock, CheckCircle, AlertTriangle, X, User, HardDrive } from 'lucide-react';

// Add MaintenanceModuleProps to handle incoming translation props
interface MaintenanceModuleProps {
  lang: Language;
  t: any;
}

const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ lang, t }) => {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_MAINTENANCE_TICKETS);
  const [showModal, setShowModal] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<Partial<MaintenanceTicket> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (ticket?: MaintenanceTicket) => {
    setCurrentTicket(ticket || { item: '', category: 'IT', priority: 'Medium', status: 'Pending', description: '', requester: '' });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTicket) return;

    if (currentTicket.id) {
      setTickets(tickets.map(t => t.id === currentTicket.id ? (currentTicket as MaintenanceTicket) : t));
    } else {
      const newTicket: MaintenanceTicket = {
        ...currentTicket as MaintenanceTicket,
        id: 'MT' + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString().split('T')[0]
      };
      setTickets([newTicket, ...tickets]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('ยืนยันการลบรายการแจ้งซ่อมนี้?')) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ระบบแจ้งซ่อม (Maintenance)</h1>
          <p className="text-slate-500">ติดตามงานแจ้งซ่อมอุปกรณ์และงานช่างอาคาร</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span>เปิดตั๋วแจ้งซ่อมใหม่</span>
        </button>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl w-fit mb-4">
            <Wrench size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รายการทั้งหมด</p>
          <h3 className="text-2xl font-black text-slate-800">{tickets.length} ตั๋ว</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รอดำเนินการ</p>
          <h3 className="text-2xl font-black text-slate-800">{tickets.filter(t => t.status === 'Pending').length} ตั๋ว</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-4">
            <CheckCircle size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ซ่อมเสร็จสิ้น</p>
          <h3 className="text-2xl font-black text-slate-800">{tickets.filter(t => t.status === 'Completed').length} ตั๋ว</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-rose-50 shadow-sm ring-1 ring-rose-100">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit mb-4">
            <AlertTriangle size={24} />
          </div>
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">งานด่วนพิเศษ (High)</p>
          <h3 className="text-2xl font-black text-rose-600">{tickets.filter(t => t.priority === 'High' && t.status !== 'Completed').length} ตั๋ว</h3>
        </div>
      </div>

      {/* Filter and List */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`ค้นหาอุปกรณ์ หรือพนักงาน...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-sky-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <button className="p-3 bg-white border border-sky-100 rounded-2xl text-slate-400 hover:text-sky-500 transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-sm group hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5 flex-1">
                <div className={`p-4 rounded-2xl ${ticket.category === 'IT' ? 'bg-sky-50 text-sky-500' : 'bg-amber-50 text-amber-500'} group-hover:scale-110 transition-transform`}>
                   {ticket.category === 'IT' ? <HardDrive size={28} /> : <Wrench size={28} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{ticket.item}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      ticket.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                      ticket.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 mb-2">{ticket.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <User size={14} /> <span>{ticket.requester}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock size={14} /> <span>{ticket.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    ticket.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 
                    ticket.status === 'In Progress' ? 'bg-indigo-100 text-indigo-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {ticket.status === 'Completed' ? 'เสร็จสิ้น' : ticket.status === 'In Progress' ? 'กำลังดำเนินการ' : 'รอรับเรื่อง'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenModal(ticket)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(ticket.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Modal */}
      {showModal && currentTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg"><Wrench size={24} /></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">{currentTicket.id ? 'แก้ไขรายการแจ้งซ่อม' : 'เปิดตั๋วแจ้งซ่อมใหม่'}</h3>
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">พนักงานผู้แจ้ง</label>
                  <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentTicket.requester || ''} onChange={e => setCurrentTicket({...currentTicket, requester: e.target.value})}>
                    <option value="">เลือกพนักงาน...</option>
                    {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">อุปกรณ์/สถานที่</label>
                    <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={currentTicket.item || ''} onChange={e => setCurrentTicket({...currentTicket, item: e.target.value})} placeholder="เช่น เครื่องพิมพ์ชั้น 3" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">หมวดหมู่</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentTicket.category || 'IT'} onChange={e => setCurrentTicket({...currentTicket, category: e.target.value as any})}>
                      <option value="IT">งานไอที (IT)</option>
                      <option value="Building">งานอาคาร (Building)</option>
                      <option value="Other">อื่นๆ</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">อาการที่พบ / รายละเอียด</label>
                  <textarea required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm h-24 resize-none outline-none focus:ring-2 focus:ring-sky-200" value={currentTicket.description || ''} onChange={e => setCurrentTicket({...currentTicket, description: e.target.value})} placeholder="ระบุรายละเอียดปัญหา..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ความสำคัญ</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentTicket.priority || 'Medium'} onChange={e => setCurrentTicket({...currentTicket, priority: e.target.value as any})}>
                      <option value="Low">ปกติ (Low)</option>
                      <option value="Medium">เร่งด่วน (Medium)</option>
                      <option value="High">ด่วนที่สุด (High)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานะ</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentTicket.status || 'Pending'} onChange={e => setCurrentTicket({...currentTicket, status: e.target.value as any})}>
                      <option value="Pending">รอรับเรื่อง</option>
                      <option value="In Progress">กำลังดำเนินการ</option>
                      <option value="Completed">เสร็จสิ้น</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">บันทึกข้อมูลตั๋ว</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceModule;
