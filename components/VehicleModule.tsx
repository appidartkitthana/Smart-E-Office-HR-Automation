
import React, { useState } from 'react';
import { MOCK_VEHICLES, MOCK_VEHICLE_BOOKINGS } from '../constants';
import { Vehicle, Language } from '../types';
import { 
  Truck, Plus, Edit2, Trash2, Search, Calendar, MapPin, 
  User, CheckCircle, X, Clock, Filter, ArrowRightCircle, 
  Navigation, Settings2
} from 'lucide-react';

interface VehicleModuleProps {
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
      View Fleet <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const VehicleModule: React.FC<VehicleModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings'>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    total: MOCK_VEHICLES.length,
    available: MOCK_VEHICLES.filter(v => v.status === 'Available').length,
    todayBookings: MOCK_VEHICLE_BOOKINGS.length,
    maintenance: MOCK_VEHICLES.filter(v => v.status === 'Maintenance').length
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Total Fleet" value={stats.total} icon={<Truck size={60}/>} bgColor="bg-info" />
        <InfoBox title="Available Now" value={stats.available} icon={<CheckCircle size={60}/>} bgColor="bg-success" />
        <InfoBox title="Today's Trips" value={stats.todayBookings} icon={<Navigation size={60}/>} bgColor="bg-warning" />
        <InfoBox title="Maintenance" value={stats.maintenance} icon={<Settings2 size={60}/>} bgColor="bg-danger" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('vehicles')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'vehicles' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Fleet List</button>
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Booking Logs</button>
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
          <Plus size={14} /> New Booking
        </button>
      </div>

      <div className={`card border-t-4 ${activeTab === 'vehicles' ? 'border-info' : 'border-success'}`}>
        <div className="card-header bg-white">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             {activeTab === 'vehicles' ? <Truck size={18} className="text-info"/> : <Calendar size={18} className="text-success"/>}
             {activeTab === 'vehicles' ? 'Enterprise Vehicle Fleet' : 'Scheduled Transports'}
           </h3>
        </div>
        <div className="card-body p-4">
          {activeTab === 'vehicles' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {MOCK_VEHICLES.map(v => (
                 <div key={v.id} className="border rounded bg-white shadow-sm overflow-hidden flex flex-col hover:border-primary transition-colors group">
                    <div className="p-4 flex items-center gap-4">
                       <div className={`w-12 h-12 rounded flex items-center justify-center text-white ${v.status === 'Available' ? 'bg-success' : v.status === 'Busy' ? 'bg-warning' : 'bg-danger'}`}>
                          <Truck size={24}/>
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-800">{v.model}</h4>
                          <p className="text-[10px] font-bold text-primary uppercase">{v.plateNumber}</p>
                       </div>
                       <span className={`badge ${v.status === 'Available' ? 'bg-success' : 'bg-danger'}`}>{v.status}</span>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 flex justify-between items-center border-t">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{v.type}</span>
                       <div className="flex gap-2">
                          <button className="text-gray-400 hover:text-info"><Edit2 size={12}/></button>
                          <button className="text-gray-400 hover:text-danger"><Trash2 size={12}/></button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="p-0 -m-4 overflow-x-auto">
              <table className="table table-striped mb-0">
                 <thead>
                    <tr>
                       <th style={{width: '200px'}}>Booking Details</th>
                       <th>Vehicle Info</th>
                       <th>Destination</th>
                       <th className="text-center">Status</th>
                       <th className="text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody>
                    {MOCK_VEHICLE_BOOKINGS.map(b => (
                      <tr key={b.id}>
                         <td className="align-middle">
                            <div className="font-bold text-xs text-gray-800">{b.employeeName}</div>
                            <div className="text-[10px] text-gray-400">{b.startDate}</div>
                         </td>
                         <td className="align-middle">
                            <div className="text-xs font-bold text-primary leading-none mb-1">{b.vehicleName}</div>
                            <div className="text-[9px] text-gray-400 uppercase">Driver: {b.driverName || 'Not Assigned'}</div>
                         </td>
                         <td className="align-middle text-xs font-bold text-gray-600 flex items-center gap-1">
                            <MapPin size={10} className="text-danger"/> {b.destination}
                         </td>
                         <td className="text-center align-middle">
                            <span className="badge bg-success">{b.status}</span>
                         </td>
                         <td className="text-right align-middle">
                            <button className="p-1.5 bg-gray-100 text-gray-500 rounded"><ArrowRightCircle size={14}/></button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleModule;
