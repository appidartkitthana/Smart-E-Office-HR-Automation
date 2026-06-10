
import React, { useState } from 'react';
import { MOCK_MEETING_ROOMS, MOCK_ROOM_BOOKINGS } from '../constants';
import { MeetingRoom, Language } from '../types';
import { 
  Building, Plus, Edit2, Trash2, Search, Calendar, 
  User, CheckCircle, X, Clock, Filter, Users, Video,
  ArrowRightCircle, Coffee, Layout, Info
} from 'lucide-react';

interface MeetingRoomModuleProps {
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
      Schedule Room <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const MeetingRoomModule: React.FC<MeetingRoomModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings'>('bookings');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalRooms: MOCK_MEETING_ROOMS.length,
    activeNow: MOCK_MEETING_ROOMS.filter(r => r.status === 'Busy').length,
    todayMeetings: MOCK_ROOM_BOOKINGS.length,
    maxCapacity: Math.max(...MOCK_MEETING_ROOMS.map(r => r.capacity))
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Meeting Rooms" value={stats.totalRooms} icon={<Building size={60}/>} bgColor="bg-info" />
        <InfoBox title="Occupied Now" value={stats.activeNow} icon={<Video size={60}/>} bgColor="bg-danger" />
        <InfoBox title="Today's Bookings" value={stats.todayMeetings} icon={<Calendar size={60}/>} bgColor="bg-success" />
        <InfoBox title="Max Group Size" value={stats.maxCapacity} icon={<Users size={60}/>} bgColor="bg-warning" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('bookings')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Room Calendar</button>
          <button onClick={() => setActiveTab('rooms')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'rooms' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Room Directory</button>
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
          <Plus size={14} /> Book a Room
        </button>
      </div>

      <div className={`card border-t-4 ${activeTab === 'bookings' ? 'border-success' : 'border-info'}`}>
        <div className="card-header bg-white">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             {activeTab === 'bookings' ? <Calendar size={18} className="text-success"/> : <Layout size={18} className="text-info"/>}
             {activeTab === 'bookings' ? 'Recent Reservations' : 'Room Specifications'}
           </h3>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          {activeTab === 'bookings' ? (
             <table className="table table-striped mb-0">
                <thead>
                   <tr>
                      <th style={{width: '200px'}}>Purpose / Booker</th>
                      <th>Room</th>
                      <th>Time Slot</th>
                      <th className="text-center">Pax</th>
                      <th className="text-right">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   {MOCK_ROOM_BOOKINGS.map(b => (
                     <tr key={b.id}>
                        <td className="align-middle">
                           <div className="font-bold text-xs text-gray-800">{b.title}</div>
                           <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{b.employeeName} • {b.department}</div>
                        </td>
                        <td className="align-middle text-xs font-bold text-primary">{b.roomName}</td>
                        <td className="align-middle">
                           <div className="text-[11px] font-bold text-gray-600">{b.date}</div>
                           <div className="text-[10px] text-gray-400">{b.startTime} - {b.endTime}</div>
                        </td>
                        <td className="text-center align-middle font-bold text-gray-700">{b.members + b.guests}</td>
                        <td className="text-right align-middle">
                           <button className="p-1.5 bg-info text-white rounded"><Info size={12}/></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {MOCK_MEETING_ROOMS.map(r => (
                 <div key={r.id} className="border rounded bg-white shadow-sm overflow-hidden hover:border-info transition-colors">
                    <div className="p-4 flex items-center gap-4">
                       <div className={`w-12 h-12 rounded flex items-center justify-center text-white ${r.status === 'Available' ? 'bg-success' : 'bg-danger'}`}>
                          <Building size={24}/>
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-800">{r.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Cap: {r.capacity} Seats</p>
                       </div>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 flex flex-wrap gap-1 border-t">
                       {r.facilities.map(f => (
                         <span key={f} className="text-[9px] font-bold bg-white border px-1.5 py-0.5 rounded text-gray-500 uppercase">{f}</span>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingRoomModule;
