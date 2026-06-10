
import React, { useState, useMemo } from 'react';
import { MOCK_APPROVALS, MOCK_EMPLOYEES } from '../constants';
import { ApprovalRequest, ApprovalType, Language } from '../types';
import { 
  Check, X, Clock, FileText, User, ChevronRight, Plus, 
  FileSpreadsheet, Fingerprint, Heart, Award, LogOut,
  PieChart, BarChart3, AlertCircle, CheckCircle2, XCircle, Bell,
  ArrowUpRight, ArrowDownRight, History, ShieldCheck, ClipboardCheck, Info,
  MoreVertical, Search, Filter, Printer
} from 'lucide-react';

interface ApprovalWorkflowProps {
  lang: Language;
  t: any;
}

const SmallBox: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string }> = ({ title, value, icon, bgColor }) => (
  <div className={`small-box ${bgColor}`}>
    <div className="inner">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className="icon">
      {icon}
    </div>
    <div className="small-box-footer bg-black/10 py-1 text-center text-[10px] uppercase font-bold tracking-wider">
      More info <ChevronRight size={10} className="inline ml-1"/>
    </div>
  </div>
);

const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({ lang, t }) => {
  // Fix: Explicitly cast MOCK_APPROVALS to ApprovalRequest[] to resolve inference mismatch between string and specific union types
  const [requests, setRequests] = useState<ApprovalRequest[]>(MOCK_APPROVALS as ApprovalRequest[]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormForRequest, setSelectedFormForRequest] = useState<any>(null);

  const FORM_METADATA: Record<string, { title: string, code: string, icon: any, color: string, badgeColor: string }> = {
    'Leave': { title: 'ลาหยุด', code: 'LEAVE-REQ', icon: Clock, color: 'text-indigo-600', badgeColor: 'bg-indigo-500' },
    'Expense': { title: 'เบิกค่าใช้จ่าย', code: 'EXP-CLAIM', icon: FileSpreadsheet, color: 'text-emerald-600', badgeColor: 'bg-emerald-500' },
    'OT': { title: 'ขอทำ OT', code: 'OT-REQ', icon: Clock, color: 'text-amber-600', badgeColor: 'bg-amber-500' },
    'F-HR-002': { title: 'ใบสมัครงาน', code: 'F-HR-002', icon: FileText, color: 'text-sky-600', badgeColor: 'bg-sky-500' },
    'F-HR-007': { title: 'ใบลาออก', code: 'F-HR-007', icon: LogOut, color: 'text-rose-600', badgeColor: 'bg-rose-500' },
    'F-HR-011': { title: 'ลืมบันทึกเวลา', code: 'F-HR-011', icon: Fingerprint, color: 'text-amber-600', badgeColor: 'bg-amber-500' },
    'F-HR-057': { title: 'ค่ารักษาพยาบาล', code: 'F-HR-057', icon: Heart, color: 'text-pink-600', badgeColor: 'bg-pink-500' },
    'F-HR-063': { title: 'ประเมินฝึกอบรม', code: 'F-HR-063', icon: Award, color: 'text-purple-600', badgeColor: 'bg-purple-500' },
  };

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length,
    };
  }, [requests]);

  const filteredRequests = requests.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.requester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      {/* Small Boxes Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <SmallBox title="All Requests" value={stats.total} icon={<FileText />} bgColor="bg-info" />
        <SmallBox title="Pending Action" value={stats.pending} icon={<Clock />} bgColor="bg-warning" />
        <SmallBox title="Authorized" value={stats.approved} icon={<CheckCircle2 />} bgColor="bg-success" />
        <SmallBox title="Revoked" value={stats.rejected} icon={<XCircle />} bgColor="bg-danger" />
      </div>

      {/* Main Content Card */}
      <div className="card border-t-4 border-primary">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
            <ClipboardCheck size={18} className="text-primary" /> Approval Audit Log
          </h3>
          <div className="flex gap-2">
            <div className="relative">
                <input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 pr-4 py-1 text-xs border rounded bg-white outline-none" />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
            </div>
            <button onClick={() => setShowFormModal(true)} className="bg-success text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-green-600 transition-colors">
                <Plus size={14} /> New Request
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead>
              <tr>
                <th style={{ width: '10px' }}>#</th>
                <th>Request Subject</th>
                <th>Requester</th>
                <th>Doc Code</th>
                <th>Date</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, idx) => {
                const info = FORM_METADATA[request.type] || { code: 'MISC', icon: FileText, color: 'text-gray-500' };
                return (
                  <tr key={request.id}>
                    <td>{idx + 1}.</td>
                    <td>
                        <div className="flex items-center gap-2">
                            <div className={`${info.color}`}><info.icon size={14}/></div>
                            <span className="font-bold text-gray-700">{request.title}</span>
                        </div>
                    </td>
                    <td>{request.requester}</td>
                    <td><span className="text-[10px] font-black text-gray-400 uppercase">{info.code}</span></td>
                    <td><span className="text-gray-500">{request.date}</span></td>
                    <td className="text-center">
                      <span className={`badge ${
                          request.status === 'Approved' ? 'bg-success' : 
                          request.status === 'Pending' ? 'bg-warning' : 'bg-danger'
                      }`}>
                          {request.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="text-right">
                      {request.status === 'Pending' ? (
                        <div className="flex justify-end gap-1">
                          <button onClick={() => handleApprove(request.id, 'Approved')} className="p-1 bg-success text-white rounded text-[10px] hover:bg-green-600" title="Approve"><Check size={12}/></button>
                          <button onClick={() => handleApprove(request.id, 'Rejected')} className="p-1 bg-danger text-white rounded text-[10px] hover:bg-red-600" title="Reject"><X size={12}/></button>
                        </div>
                      ) : (
                        <button className="p-1 bg-info text-white rounded text-[10px] hover:bg-cyan-600"><History size={12}/></button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400 italic">No request logs found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer text-right">
           <button className="text-xs font-bold text-primary hover:underline">View Historical Archive</button>
        </div>
      </div>

      {/* New Request Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[0.25rem] shadow-2xl p-0 relative overflow-hidden border border-gray-300">
             {/* AdminLTE Modal Header */}
             <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-700 uppercase flex items-center gap-2">
                   <ClipboardCheck size={20}/> Submit Document Request
                </h3>
                <button onClick={() => { setShowFormModal(false); setSelectedFormForRequest(null); }} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
             </div>

             <div className="p-6">
                {!selectedFormForRequest ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(FORM_METADATA).map(([type, info]) => {
                        const Icon = info.icon;
                        return (
                        <button 
                            key={type}
                            onClick={() => setSelectedFormForRequest({...info, type})}
                            className="flex items-center gap-4 p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded transition-all text-left group"
                        >
                            <div className={`p-2 rounded bg-gray-100 ${info.color} group-hover:scale-110 transition-transform`}>
                                <Icon size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-800 text-sm leading-tight">{info.title}</h4>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{info.code}</p>
                            </div>
                            <ChevronRight size={14} className="text-gray-300" />
                        </button>
                        );
                    })}
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); alert("Request processing..."); setShowFormModal(false); setSelectedFormForRequest(null); }} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="bg-blue-50 p-4 rounded border border-blue-100 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <selectedFormForRequest.icon size={20} className={selectedFormForRequest.color}/>
                            <div>
                               <p className="text-[10px] font-black text-blue-400 uppercase">Selected Form</p>
                               <h5 className="font-bold text-blue-900 text-sm">{selectedFormForRequest.title} ({selectedFormForRequest.code})</h5>
                            </div>
                         </div>
                         <button type="button" onClick={() => setSelectedFormForRequest(null)} className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Change</button>
                      </div>

                      <div className="space-y-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Request Title</label>
                            <input type="text" required placeholder="Subject of request..." className="w-full p-2 text-sm border rounded outline-none focus:border-primary" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Requester</label>
                              <input type="text" disabled value="คุณสมชาย รักดี" className="w-full p-2 text-sm border rounded bg-gray-50 text-gray-400" />
                           </div>
                           <div>
                              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Effective Date</label>
                              <input type="date" required className="w-full p-2 text-sm border rounded outline-none focus:border-primary" />
                           </div>
                        </div>
                        <div>
                           <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Justification / Remarks</label>
                           <textarea required className="w-full p-2 text-sm border rounded h-24 resize-none outline-none focus:border-primary" placeholder="State your reason for this request..." />
                        </div>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <button type="button" onClick={() => setSelectedFormForRequest(null)} className="flex-1 py-2 text-sm font-bold text-gray-500 bg-gray-100 rounded hover:bg-gray-200 uppercase">Back</button>
                        <button type="submit" className="flex-[2] py-2 text-sm font-bold text-white bg-primary rounded hover:bg-blue-600 shadow-md uppercase">Submit Request</button>
                      </div>
                  </form>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
