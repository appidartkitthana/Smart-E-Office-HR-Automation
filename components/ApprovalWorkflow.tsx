
import React, { useState, useMemo } from 'react';
import { MOCK_APPROVALS, MOCK_EMPLOYEES } from '../constants';
import { ApprovalRequest, ApprovalType, Language } from '../types';
import { 
  Check, X, Clock, FileText, User, ChevronRight, Plus, 
  FileSpreadsheet, Fingerprint, Heart, Award, LogOut,
  PieChart, BarChart3, AlertCircle, CheckCircle2, XCircle, Bell,
  ArrowUpRight, ArrowDownRight, History
} from 'lucide-react';

// Add ApprovalWorkflowProps to handle incoming translation props
interface ApprovalWorkflowProps {
  lang: Language;
  t: any;
}

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ lang, t }) => {
  const [requests, setRequests] = useState<ApprovalRequest[]>(MOCK_APPROVALS);
  const [showFormModal, setShowFormModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list'>('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);

  const FORM_METADATA: Record<string, { title: string, code: string, icon: any, color: string, badgeColor: string }> = {
    'Leave': { title: 'ลาหยุด', code: 'LEAVE', icon: Clock, color: 'bg-indigo-100 text-indigo-600', badgeColor: 'bg-indigo-500' },
    'Expense': { title: 'เบิกค่าใช้จ่าย', code: 'EXPENSE', icon: FileSpreadsheet, color: 'bg-emerald-100 text-emerald-600', badgeColor: 'bg-emerald-500' },
    'F-HR-002': { title: 'ใบสมัครงาน', code: 'F-HR-002', icon: FileText, color: 'bg-sky-100 text-sky-600', badgeColor: 'bg-sky-500' },
    'F-HR-007': { title: 'ใบลาออก', code: 'F-HR-007', icon: LogOut, color: 'bg-rose-100 text-rose-600', badgeColor: 'bg-rose-500' },
    'F-HR-011': { title: 'ลืมบันทึกเวลา', code: 'F-HR-011', icon: Fingerprint, color: 'bg-amber-100 text-amber-600', badgeColor: 'bg-amber-500' },
    'F-HR-057': { title: 'ค่ารักษาพยาบาล', code: 'F-HR-057', icon: Heart, color: 'bg-pink-100 text-pink-600', badgeColor: 'bg-pink-500' },
    'F-HR-063': { title: 'ประเมินฝึกอบรม', code: 'F-HR-063', icon: Award, color: 'bg-purple-100 text-purple-600', badgeColor: 'bg-purple-500' },
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    
    // Detailed Breakdown by Type
    const typeBreakdown = requests.reduce((acc, curr) => {
      if (!acc[curr.type]) acc[curr.type] = { total: 0, approved: 0, rejected: 0, pending: 0 };
      acc[curr.type].total++;
      if (curr.status === 'Approved') acc[curr.type].approved++;
      if (curr.status === 'Rejected') acc[curr.type].rejected++;
      if (curr.status === 'Pending') acc[curr.type].pending++;
      return acc;
    }, {} as Record<string, { total: number, approved: number, rejected: number, pending: number }>);

    return { total, pending, approved, rejected, typeBreakdown };
  }, [requests]);

  const recentNotifications = useMemo(() => {
    return requests.filter(r => r.status === 'Pending').slice(0, 5);
  }, [requests]);

  const getFormInfo = (type: ApprovalType) => {
    return FORM_METADATA[type] || { title: 'คำร้องทั่วไป', code: 'N/A', icon: FileSpreadsheet, color: 'bg-slate-100 text-slate-500', badgeColor: 'bg-slate-400' };
  };

  const handleApprove = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ระบบอนุมัติ (Approval System)</h1>
          <p className="text-slate-500">บริหารจัดการและตรวจสอบสถานะการอนุมัติเอกสารทั้งหมด</p>
        </div>
        <div className="flex gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 bg-white border border-sky-100 rounded-2xl text-slate-400 hover:text-sky-500 transition-all shadow-sm ${showNotifications ? 'ring-2 ring-sky-100' : ''}`}
              >
                <Bell size={24} />
                {stats.pending > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                    {stats.pending}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-sky-100 shadow-2xl rounded-3xl p-6 z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">รายการรอดำเนินการ</h4>
                    <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-lg text-[10px] font-black">{stats.pending} ใหม่</span>
                  </div>
                  <div className="space-y-3">
                    {recentNotifications.length > 0 ? recentNotifications.map(notif => (
                      <div key={notif.id} className="flex gap-3 p-3 hover:bg-sky-50 rounded-2xl transition-colors cursor-pointer border border-transparent hover:border-sky-100">
                        <div className={`p-2 rounded-xl h-fit ${getFormInfo(notif.type).color}`}>
                          <Clock size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{notif.title}</p>
                          <p className="text-[10px] text-slate-400">จาก: {notif.requester}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-center py-4 text-xs text-slate-400 font-medium italic">ไม่มีคำร้องค้างคาในขณะนี้</p>
                    )}
                  </div>
                  <button onClick={() => { setActiveTab('list'); setShowNotifications(false); }} className="w-full mt-4 py-2 text-sky-500 text-[10px] font-black uppercase tracking-widest hover:bg-sky-50 rounded-xl transition-all">ดูทั้งหมด</button>
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowFormModal(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 flex items-center gap-2 hover:bg-sky-600 transition-all"
            >
              <Plus size={20} /> ยื่นคำร้องใหม่
            </button>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          <BarChart3 size={18} /> แดชบอร์ดสรุป
        </button>
        <button 
          onClick={() => setActiveTab('list')} 
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'list' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          <FileText size={18} /> รายการคำร้อง
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-sky-50 opacity-10 group-hover:scale-110 transition-transform"><FileText size={80} /></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">คำร้องทั้งหมด</p>
                <h3 className="text-4xl font-black text-slate-800">{stats.total}</h3>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-amber-50 opacity-20 group-hover:scale-110 transition-transform"><Clock size={80} /></div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">รอดำเนินการ</p>
                <h3 className="text-4xl font-black text-amber-600">{stats.pending}</h3>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-emerald-50 opacity-20 group-hover:scale-110 transition-transform"><CheckCircle2 size={80} /></div>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">อนุมัติแล้ว</p>
                <h3 className="text-4xl font-black text-emerald-600">{stats.approved}</h3>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-rose-50 opacity-20 group-hover:scale-110 transition-transform"><XCircle size={80} /></div>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">ไม่อนุมัติ</p>
                <h3 className="text-4xl font-black text-rose-600">{stats.rejected}</h3>
             </div>
          </div>

          {/* Detailed Breakdown by Document Type */}
          <div className="bg-white p-10 rounded-[3rem] border border-sky-100 shadow-sm">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider">Document Performance breakdown</h3>
                   <p className="text-sm text-slate-400 font-medium">สถิติจำนวนเอกสารแยกตามประเภทและผลการอนุมัติ</p>
                </div>
                <PieChart size={32} className="text-sky-200" />
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(FORM_METADATA).map(([type, info]) => {
                  const data = stats.typeBreakdown[type] || { total: 0, approved: 0, rejected: 0, pending: 0 };
                  const Icon = info.icon;
                  return (
                    <div key={type} className="flex flex-col p-6 rounded-3xl bg-slate-50/50 border border-slate-50 hover:border-sky-200 hover:bg-white transition-all group">
                       <div className="flex items-center gap-4 mb-6">
                          <div className={`p-4 rounded-2xl ${info.color} group-hover:scale-110 transition-transform`}>
                             <Icon size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{info.code}</p>
                             <h4 className="font-bold text-slate-700 text-base">{info.title}</h4>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 rounded-2xl bg-white border border-slate-50">
                             <p className="text-[9px] font-black text-slate-400 uppercase mb-1">ทั้งหมด</p>
                             <p className="text-lg font-black text-slate-700">{data.total}</p>
                          </div>
                          <div className="text-center p-2 rounded-2xl bg-emerald-50/50 border border-emerald-50">
                             <p className="text-[9px] font-black text-emerald-500 uppercase mb-1">อนุมัติ</p>
                             <p className="text-lg font-black text-emerald-600">{data.approved}</p>
                          </div>
                          <div className="text-center p-2 rounded-2xl bg-rose-50/50 border border-rose-50">
                             <p className="text-[9px] font-black text-rose-500 uppercase mb-1">ปฏิเสธ</p>
                             <p className="text-lg font-black text-rose-600">{data.rejected}</p>
                          </div>
                       </div>
                       
                       {data.pending > 0 && (
                          <div className="mt-4 flex items-center gap-2 text-amber-500 font-bold text-[10px] bg-amber-50 py-1.5 px-3 rounded-full w-fit animate-pulse">
                             <Clock size={12} />
                             <span>{data.pending} รายการรอพิจารณา</span>
                          </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in fade-in duration-500">
          {requests.map((request) => {
            const formInfo = getFormInfo(request.type);
            const Icon = formInfo.icon;
            return (
              <div key={request.id} className="bg-white rounded-3xl p-8 border border-sky-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                {request.status === 'Pending' && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
                )}
                
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-[1.25rem] ${formInfo.color} shadow-sm`}>
                            <Icon size={28} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-xl mb-1 group-hover:text-sky-600 transition-colors">{request.title}</h3>
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{formInfo.code}</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <span className="text-[10px] font-bold text-slate-400">#{request.id.padStart(4, '0')}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        request.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                        request.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                        'bg-rose-50 border-rose-100 text-rose-600'
                    }`}>
                        {request.status === 'Pending' ? 'Waiting' : request.status === 'Approved' ? 'Approved' : 'Rejected'}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-50 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><User size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Requester</p>
                            <p className="text-sm font-bold text-slate-700">{request.requester}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm"><Clock size={20} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Submission Date</p>
                            <p className="text-sm font-bold text-slate-700">{request.date}</p>
                        </div>
                    </div>
                    {request.amount && (
                        <div className="col-span-2 flex items-center gap-3 pt-4 border-t border-slate-100">
                           <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm"><CheckCircle2 size={20} /></div>
                           <div className="flex-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Requested Amount</p>
                                <p className="text-2xl font-black text-emerald-600">฿ {request.amount.toLocaleString()}</p>
                           </div>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    {request.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleApprove(request.id, 'Rejected')} className="flex-1 py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2">
                            <X size={18} /> Discard
                        </button>
                        <button onClick={() => handleApprove(request.id, 'Approved')} className="flex-[2] py-4 rounded-2xl bg-sky-500 text-white font-black text-xs uppercase hover:bg-sky-600 transition-all shadow-xl shadow-sky-100 flex items-center justify-center gap-2">
                            <Check size={18} /> Confirm Approval
                        </button>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-between py-4 px-6 bg-slate-50 rounded-2xl">
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${request.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                               {request.status === 'Approved' ? <Check size={16} /> : <X size={16} />}
                            </div>
                            <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{request.status} ON {request.date}</span>
                         </div>
                         <button className="text-sky-500 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1"><History size={14}/> View History</button>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Selection Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
             <button onClick={() => setShowFormModal(false)} className="absolute right-10 top-10 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
             <h3 className="text-3xl font-black text-slate-800 mb-2">เลือกแบบฟอร์ม HR</h3>
             <p className="text-slate-400 font-medium mb-10">เลือกประเภทคำร้องที่คุณต้องการยื่นเพื่อเข้าสู่ระบบพิจารณาอนุมัติ</p>
             
             <div className="grid grid-cols-1 gap-4">
                {Object.entries(FORM_METADATA).map(([type, info]) => {
                  const Icon = info.icon;
                  return (
                    <button 
                      key={type}
                      className="flex items-center gap-6 p-6 bg-slate-50 hover:bg-sky-50 border-2 border-transparent hover:border-sky-200 rounded-[2.5rem] transition-all text-left group"
                    >
                       <div className={`p-5 rounded-[1.5rem] ${info.color} group-hover:scale-110 shadow-sm transition-transform`}>
                          <Icon size={32} />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-black text-sky-500/60 uppercase tracking-[0.2em] mb-1">{info.code}</p>
                          <h4 className="font-black text-slate-800 text-xl">{info.title}</h4>
                       </div>
                       <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-all">
                          <ChevronRight size={24} />
                       </div>
                    </button>
                  );
                })}
             </div>
             
             <div className="mt-10 pt-10 border-t border-slate-100">
                <button 
                  onClick={() => setShowFormModal(false)}
                  className="w-full py-5 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-colors uppercase text-sm tracking-widest"
                >
                  ยกเลิกและปิดหน้าต่าง
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
