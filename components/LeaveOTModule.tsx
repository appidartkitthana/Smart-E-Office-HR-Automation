
import React, { useState } from 'react';
import { MOCK_LEAVES, MOCK_OTS, MOCK_EMPLOYEES, COLORS } from '../constants';
import { LeaveRequest, OTRequest, Language } from '../types';
import { Calendar, Plus, Edit2, Trash2, Search, Clock, CheckCircle, X, Filter, ChevronRight, User } from 'lucide-react';

// Add LeaveOTModuleProps to handle incoming translation props
interface LeaveOTModuleProps {
  lang: Language;
  t: any;
}

const LeaveOTModule: React.FC<LeaveOTModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'leave' | 'ot'>('leave');
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [ots, setOts] = useState<OTRequest[]>(MOCK_OTS);
  const [showModal, setShowModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (req?: any) => {
    if (activeTab === 'leave') {
      setCurrentRequest(req || { type: 'Annual', status: 'Pending', startDate: '', endDate: '', reason: '' });
    } else {
      setCurrentRequest(req || { date: '', hours: 1, reason: '', status: 'Pending' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRequest) return;

    if (activeTab === 'leave') {
      if (currentRequest.id) {
        setLeaves(leaves.map(l => l.id === currentRequest.id ? currentRequest : l));
      } else {
        const newReq = { ...currentRequest, id: 'L' + Math.random().toString(36).substr(2, 5) };
        setLeaves([newReq, ...leaves]);
      }
    } else {
      if (currentRequest.id) {
        setOts(ots.map(o => o.id === currentRequest.id ? currentRequest : o));
      } else {
        const newReq = { ...currentRequest, id: 'OT' + Math.random().toString(36).substr(2, 5) };
        setOts([newReq, ...ots]);
      }
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('ยืนยันการลบรายการนี้?')) {
      if (activeTab === 'leave') {
        setLeaves(leaves.filter(l => l.id !== id));
      } else {
        setOts(ots.filter(o => o.id !== id));
      }
    }
  };

  const filteredLeaves = leaves.filter(l => 
    l.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOts = ots.filter(o => 
    o.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">การลา & OT (Leave & OT)</h1>
          <p className="text-slate-500">จัดการคำร้องขอลาหยุดและการทำงานล่วงเวลา</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span>{activeTab === 'leave' ? 'ยื่นใบลาใหม่' : 'ขอทำ OT ใหม่'}</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">การลาที่รออนุมัติ</p>
          <h3 className="text-2xl font-black text-slate-800">{leaves.filter(l => l.status === 'Pending').length} รายการ</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">OT ที่รออนุมัติ</p>
          <h3 className="text-2xl font-black text-slate-800">{ots.filter(o => o.status === 'Pending').length} รายการ</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-4">
            <CheckCircle size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">อนุมัติแล้วรวม</p>
          <h3 className="text-2xl font-black text-slate-800">
            {leaves.filter(l => l.status === 'Approved').length + ots.filter(o => o.status === 'Approved').length} รายการ
          </h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl w-fit mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ชั่วโมง OT เดือนนี้</p>
          <h3 className="text-2xl font-black text-slate-800">{ots.reduce((acc, curr) => acc + curr.hours, 0)} ชม.</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit">
        <button 
          onClick={() => setActiveTab('leave')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'leave' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          รายการลาหยุด
        </button>
        <button 
          onClick={() => setActiveTab('ot')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ot' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          การทำงานล่วงเวลา (OT)
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`ค้นหาชื่อ หรือเหตุผล...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-sky-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-200"
            />
          </div>
          <button className="p-3 bg-white border border-sky-100 rounded-2xl text-slate-400 hover:text-sky-500 transition-all">
            <Filter size={20} />
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">พนักงาน</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeTab === 'leave' ? 'ประเภท/เหตุผล' : 'ชั่วโมง/เหตุผล'}</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่/เวลา</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeTab === 'leave' ? (
                  filteredLeaves.map(req => (
                    <tr key={req.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xs">
                            {req.employeeName.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700">{req.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div>
                          <span className="text-xs font-black text-sky-600 uppercase mb-1 block">{req.type}</span>
                          <span className="text-sm text-slate-500 line-clamp-1">{req.reason}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-600 font-medium">
                          {new Date(req.startDate).toLocaleDateString('th-TH')} - {new Date(req.endDate).toLocaleDateString('th-TH')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                          req.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {req.status === 'Approved' ? 'อนุมัติ' : req.status === 'Pending' ? 'รอพิจารณา' : 'ปฏิเสธ'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenModal(req)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(req.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredOts.map(req => (
                    <tr key={req.id} className="hover:bg-sky-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {req.employeeName.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700">{req.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div>
                          <span className="text-xs font-black text-indigo-600 uppercase mb-1 block">{req.hours} ชั่วโมง</span>
                          <span className="text-sm text-slate-500 line-clamp-1">{req.reason}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm text-slate-600 font-medium">
                          {new Date(req.date).toLocaleDateString('th-TH')}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                          req.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {req.status === 'Approved' ? 'อนุมัติ' : req.status === 'Pending' ? 'รอพิจารณา' : 'ปฏิเสธ'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-1">
                          <button onClick={() => handleOpenModal(req)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(req.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showModal && currentRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-6 top-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
               <div className={`w-12 h-12 ${activeTab === 'leave' ? 'bg-rose-400' : 'bg-amber-400'} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                  {activeTab === 'leave' ? <Calendar size={24} /> : <Clock size={24} />}
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">
                    {currentRequest.id ? 'แก้ไขคำร้อง' : (activeTab === 'leave' ? 'ยื่นใบลาใหม่' : 'ขอทำงานล่วงเวลา')}
                  </h3>
                  <p className="text-sm text-slate-400 font-medium">ระบุรายละเอียดคำร้องขอเพื่อดำเนินการต่อ</p>
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">พนักงาน</label>
                  <select 
                    required
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-sky-200"
                    value={currentRequest.employeeId || ''}
                    onChange={(e) => {
                      const emp = MOCK_EMPLOYEES.find(m => m.id === e.target.value);
                      setCurrentRequest({...currentRequest, employeeId: e.target.value, employeeName: emp?.name});
                    }}
                  >
                    <option value="">เลือกพนักงาน...</option>
                    {MOCK_EMPLOYEES.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                {activeTab === 'leave' ? (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ประเภทการลา</label>
                      <select 
                        className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-700 outline-none"
                        value={currentRequest.type || 'Annual'}
                        onChange={(e) => setCurrentRequest({...currentRequest, type: e.target.value})}
                      >
                        <option value="Annual">ลาพักร้อน</option>
                        <option value="Sick">ลาป่วย</option>
                        <option value="Personal">ลากิจ</option>
                        <option value="Other">ลาอื่นๆ</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วันที่เริ่ม</label>
                        <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" 
                          value={currentRequest.startDate || ''} onChange={e => setCurrentRequest({...currentRequest, startDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วันที่สิ้นสุด</label>
                        <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" 
                          value={currentRequest.endDate || ''} onChange={e => setCurrentRequest({...currentRequest, endDate: e.target.value})} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วันที่ทำงาน</label>
                      <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" 
                        value={currentRequest.date || ''} onChange={e => setCurrentRequest({...currentRequest, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">จำนวนชั่วโมง</label>
                      <input type="number" min="1" max="8" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" 
                        value={currentRequest.hours || 1} onChange={e => setCurrentRequest({...currentRequest, hours: parseInt(e.target.value)})} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">เหตุผล/รายละเอียด</label>
                  <textarea 
                    required
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium h-24 resize-none outline-none focus:ring-2 focus:ring-sky-200"
                    placeholder="กรุณาระบุรายละเอียด..."
                    value={currentRequest.reason || ''}
                    onChange={e => setCurrentRequest({...currentRequest, reason: e.target.value})}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานะ</label>
                  <div className="flex gap-2">
                    {['Pending', 'Approved', 'Rejected'].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setCurrentRequest({...currentRequest, status})}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all border ${
                          currentRequest.status === status 
                          ? (status === 'Approved' ? 'bg-emerald-500 border-emerald-500 text-white' : 
                             status === 'Rejected' ? 'bg-rose-500 border-rose-500 text-white' : 'bg-amber-500 border-amber-500 text-white')
                          : 'bg-white border-slate-100 text-slate-400 hover:bg-sky-50'
                        }`}
                      >
                        {status === 'Pending' ? 'รอพิจารณา' : status === 'Approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all"
                >
                  บันทึกคำร้อง
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveOTModule;
