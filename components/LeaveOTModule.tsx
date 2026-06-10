
import React, { useState } from 'react';
import { MOCK_LEAVES, MOCK_OTS, MOCK_EMPLOYEES } from '../constants';
import { LeaveRequest, OTRequest, Language } from '../types';
import { 
  Calendar, Plus, Edit2, Trash2, Search, Clock, 
  CheckCircle, X, Filter, ChevronRight, User, 
  ArrowRightCircle, CalendarDays, AlertCircle
} from 'lucide-react';

interface LeaveOTModuleProps {
  lang: Language;
  t: any;
}

const InfoBox: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string }> = ({ title, value, icon, bgColor }) => (
  <div className={`small-box ${bgColor}`}>
    <div className="inner">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className="icon">{icon}</div>
    <div className="small-box-footer bg-black/10 py-1 text-center text-[10px] uppercase font-bold cursor-pointer">
      View Details <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const LeaveOTModule: React.FC<LeaveOTModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'leave' | 'ot'>('leave');
  // Fix: Explicitly cast MOCK_LEAVES to LeaveRequest[] to resolve type mismatch from inferred string status property
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES as LeaveRequest[]);
  // Fix: Explicitly cast MOCK_OTS to OTRequest[] to resolve type mismatch from inferred string status property
  const [ots, setOts] = useState<OTRequest[]>(MOCK_OTS as OTRequest[]);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    pendingLeave: leaves.filter(l => l.status === 'Pending').length,
    pendingOT: ots.filter(o => o.status === 'Pending').length,
    totalApproved: leaves.filter(l => l.status === 'Approved').length + ots.filter(o => o.status === 'Approved').length,
    otHours: ots.reduce((acc, curr) => acc + curr.hours, 0)
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Pending Leave" value={stats.pendingLeave} icon={<CalendarDays size={60}/>} bgColor="bg-info" />
        <InfoBox title="Pending OT" value={stats.pendingOT} icon={<Clock size={60}/>} bgColor="bg-warning" />
        <InfoBox title="Total Approved" value={stats.totalApproved} icon={<CheckCircle size={60}/>} bgColor="bg-success" />
        <InfoBox title="Monthly OT Hours" value={stats.otHours} icon={<AlertCircle size={60}/>} bgColor="bg-danger" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('leave')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'leave' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Leave Requests</button>
          <button onClick={() => setActiveTab('ot')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'ot' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>OT Requests</button>
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 hover:opacity-90 shadow-sm">
          <Plus size={14} /> New Request
        </button>
      </div>

      <div className="card border-t-4 border-info">
        <div className="card-header flex items-center justify-between">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             <Calendar size={18} className="text-info"/> {activeTab === 'leave' ? 'Recent Leave Applications' : 'Overtime Tracking Log'}
           </h3>
           <div className="card-tools flex gap-2">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-8 pr-4 py-1 text-xs border rounded bg-white outline-none focus:border-info" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              </div>
           </div>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th style={{width: '180px'}}>Employee</th>
                <th>{activeTab === 'leave' ? 'Type / Reason' : 'Hours / Reason'}</th>
                <th className="text-center">Dates</th>
                <th className="text-center">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'leave' ? leaves : ots).map((req: any) => (
                <tr key={req.id}>
                  <td className="align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 border">{req.employeeName.charAt(0)}</div>
                      <div>
                        <div className="font-bold text-gray-800 text-xs">{req.employeeName}</div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">ID: {req.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="text-xs font-bold text-gray-700">{activeTab === 'leave' ? req.type : `${req.hours} Hours`}</div>
                    <div className="text-[10px] text-gray-400 truncate max-w-[200px]">{req.reason}</div>
                  </td>
                  <td className="text-center align-middle">
                    <span className="text-[11px] font-bold text-gray-500">
                      {activeTab === 'leave' ? `${req.startDate} - ${req.endDate}` : req.date}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <span className={`badge ${req.status === 'Approved' ? 'bg-success' : req.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="text-right align-middle">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 bg-info text-white rounded shadow-sm"><Edit2 size={10}/></button>
                      <button className="p-1.5 bg-danger text-white rounded shadow-sm"><Trash2 size={10}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveOTModule;
