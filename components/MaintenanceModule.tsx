
import React, { useState } from 'react';
import { MOCK_MAINTENANCE_TICKETS } from '../constants';
import { MaintenanceTicket, Language } from '../types';
import { 
  Wrench, Plus, Edit2, Trash2, Search, Filter, Clock, 
  CheckCircle, AlertTriangle, X, User, HardDrive, 
  ArrowRightCircle, Info, Construction
} from 'lucide-react';

interface MaintenanceModuleProps {
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
      Manage Tickets <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const MaintenanceModule: React.FC<MaintenanceModuleProps> = ({ lang, t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: MOCK_MAINTENANCE_TICKETS.length,
    pending: MOCK_MAINTENANCE_TICKETS.filter(t => t.status === 'Pending').length,
    inProgress: MOCK_MAINTENANCE_TICKETS.filter(t => t.status === 'In Progress').length,
    highPriority: MOCK_MAINTENANCE_TICKETS.filter(t => t.priority === 'High' && t.status !== 'Completed').length
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Total Tickets" value={stats.total} icon={<Wrench size={60}/>} bgColor="bg-info" />
        <InfoBox title="Waiting List" value={stats.pending} icon={<Clock size={60}/>} bgColor="bg-warning" />
        <InfoBox title="Under Repair" value={stats.inProgress} icon={<Construction size={60}/>} bgColor="bg-primary" />
        <InfoBox title="Emergency" value={stats.highPriority} icon={<AlertTriangle size={60}/>} bgColor="bg-danger" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex-1 max-w-xs relative">
          <input 
            type="text" 
            placeholder="Find ticket..." 
            className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-primary" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
          <Plus size={14} /> Create Repair Ticket
        </button>
      </div>

      <div className="card border-t-4 border-info">
        <div className="card-header bg-white">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             <Wrench size={18} className="text-info"/> Maintenance Task Log
           </h3>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th style={{width: '200px'}}>Equip / Area</th>
                <th>Description</th>
                <th className="text-center">Priority</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_MAINTENANCE_TICKETS.map(ticket => (
                <tr key={ticket.id}>
                  <td className="align-middle">
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded ${ticket.category === 'IT' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'}`}>
                          {ticket.category === 'IT' ? <HardDrive size={18}/> : <Wrench size={18}/>}
                       </div>
                       <div>
                          <div className="font-bold text-xs text-gray-800">{ticket.item}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{ticket.category}</div>
                       </div>
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="text-xs text-gray-600 line-clamp-1">{ticket.description}</div>
                    <div className="text-[9px] text-gray-400 uppercase">Reporter: {ticket.requester}</div>
                  </td>
                  <td className="text-center align-middle">
                    <span className={`badge ${ticket.priority === 'High' ? 'bg-danger' : ticket.priority === 'Medium' ? 'bg-warning' : 'bg-primary'}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <span className={`badge ${ticket.status === 'Completed' ? 'bg-success' : ticket.status === 'In Progress' ? 'bg-info' : 'bg-gray-500'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="text-right align-middle">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 bg-info text-white rounded"><Info size={10}/></button>
                      <button className="p-1.5 bg-success text-white rounded"><CheckCircle size={10}/></button>
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

export default MaintenanceModule;
