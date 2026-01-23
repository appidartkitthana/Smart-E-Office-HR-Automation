
import React, { useState, useMemo } from 'react';
import { MOCK_MEETING_ROOMS, MOCK_ROOM_BOOKINGS, MOCK_EMPLOYEES, DEPARTMENTS } from '../constants';
import { MeetingRoom, RoomBooking, Language } from '../types';
import { 
  Building, Plus, Edit2, Trash2, Search, Calendar as CalendarIcon, 
  User, CheckCircle, X, Clock, Filter, Users, Video, 
  Coffee, Shield, Layout, Info, UserCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';

const EQUIPMENT_OPTIONS = ['Welcome Board', 'Projector', 'Speaker Microphone', 'Bluetooth Speaker', 'Power Plug', 'Laser Pointer'];
const SAFETY_OPTIONS = ['Safety Shoes', 'Safety Hat', 'Cloth Hat', 'Glasses', 'Cool Cloth'];
const CATERING_OPTIONS = ['Lunch', 'Order outside', 'Coffee', 'Water', 'Soft Drink', 'Canned Coffee', 'Light Meal', 'Candy'];
const LAYOUT_OPTIONS = ['Boardroom', 'U-Shape', 'Class Room', 'Theater'];

interface MeetingRoomModuleProps {
  lang: Language;
  t: any;
}

const MeetingRoomModule: React.FC<MeetingRoomModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings' | 'calendar' | 'my-bookings'>('calendar');
  const [rooms, setRooms] = useState<MeetingRoom[]>(MOCK_MEETING_ROOMS);
  const [bookings, setBookings] = useState<RoomBooking[]>(MOCK_ROOM_BOOKINGS);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentUser = "Thanawuth P.";

  // --- Calendar Helpers ---
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];
    
    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, date: null });
    }
    
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, date: dateStr });
    }
    
    return days;
  }, [currentDate]);

  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter(b => b.date === dateStr).sort((a,b) => a.startTime.localeCompare(b.startTime));
  };

  // --- Handlers ---
  const handleOpenModal = (item?: any, initialDate?: string) => {
    if (activeTab === 'rooms') {
      setCurrentItem(item || { name: '', capacity: 4, facilities: [], status: 'Available' });
    } else {
      setCurrentItem(item || { 
        roomId: '', 
        title: '', 
        employeeName: currentUser,
        department: 'Sales',
        date: initialDate || new Date().toISOString().split('T')[0], 
        startTime: '09:00', 
        endTime: '10:00', 
        members: 1,
        guests: 0,
        sat: 0,
        equipment: [],
        safetyEquipment: [],
        catering: [],
        tableLayout: 'Boardroom',
        notes: '',
        status: 'Pending' 
      });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    if (activeTab === 'rooms') {
      if (currentItem.id) {
        setRooms(rooms.map(r => r.id === currentItem.id ? currentItem : r));
      } else {
        const newItem = { ...currentItem, id: 'R' + Math.random().toString(36).substr(2, 5) };
        setRooms([newItem, ...rooms]);
      }
    } else {
      if (currentItem.id) {
        setBookings(bookings.map(b => b.id === currentItem.id ? currentItem : b));
      } else {
        const selectedRoom = rooms.find(r => r.id === currentItem.roomId);
        const newItem = { 
            ...currentItem, 
            id: 'RB' + Math.random().toString(36).substr(2, 5),
            roomName: selectedRoom ? selectedRoom.name : 'Unknown'
        };
        setBookings([newItem, ...bookings]);
      }
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('ยืนยันการลบรายการนี้?')) {
      if (activeTab === 'rooms') {
        setRooms(rooms.filter(r => r.id !== id));
      } else {
        setBookings(bookings.filter(b => b.id !== id));
      }
    }
  };

  const toggleEquipment = (eq: string) => {
    const current = currentItem.equipment || [];
    if (current.includes(eq)) {
      setCurrentItem({ ...currentItem, equipment: current.filter((e: string) => e !== eq) });
    } else {
      setCurrentItem({ ...currentItem, equipment: [...current, eq] });
    }
  };

  const updateItemQuantity = (listName: 'safetyEquipment' | 'catering', itemName: string, quantity: number) => {
    const list = currentItem[listName] || [];
    const existingIndex = list.findIndex((i: any) => i.name === itemName);
    let newList = [...list];

    if (quantity <= 0) {
      newList = newList.filter((i: any) => i.name !== itemName);
    } else if (existingIndex >= 0) {
      newList[existingIndex] = { name: itemName, quantity };
    } else {
      newList.push({ name: itemName, quantity });
    }

    setCurrentItem({ ...currentItem, [listName]: newList });
  };

  const filteredRooms = rooms.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myBookings = bookings.filter(b => b.employeeName === currentUser);
  const bookingsToShow = activeTab === 'my-bookings' ? myBookings : bookings;
  const filteredBookings = bookingsToShow.filter(b => 
    b.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const monthName = currentDate.toLocaleString(lang === 'TH' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Meeting Room Reservation</h1>
          <p className="text-slate-500 font-medium">จัดการห้องประชุม อุปกรณ์ และตารางการจองแบบครบวงจร</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-sky-500 text-white px-8 py-4 rounded-[2rem] font-black shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2">
          <Plus size={22} />
          <span>จองห้องประชุม</span>
        </button>
      </div>

      <div className="flex bg-white p-2 rounded-[2.5rem] border border-sky-100 w-fit shadow-sm overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setActiveTab('calendar')} className={`px-8 py-3.5 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'calendar' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}>
          <CalendarIcon size={18} /> ปฏิทินจองห้อง
        </button>
        <button onClick={() => setActiveTab('rooms')} className={`px-8 py-3.5 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'rooms' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}>
          <Video size={18} /> รายชื่อห้อง
        </button>
        <button onClick={() => setActiveTab('bookings')} className={`px-8 py-3.5 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'bookings' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}>
          <Clock size={18} /> รายการจองทั้งหมด
        </button>
        <button onClick={() => setActiveTab('my-bookings')} className={`px-8 py-3.5 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'my-bookings' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}>
          <UserCircle size={18} /> การจองของฉัน
        </button>
      </div>

      {activeTab === 'calendar' ? (
        <div className="bg-white rounded-[3.5rem] border border-sky-100 shadow-sm p-10 animate-in zoom-in-95 duration-500">
           <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-widest">{monthName}</h2>
              <div className="flex gap-4">
                <button onClick={handlePrevMonth} className="p-4 bg-slate-50 rounded-3xl hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm"><ChevronLeft size={24}/></button>
                <button onClick={() => setCurrentDate(new Date())} className="px-8 py-4 bg-sky-50 text-sky-600 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-sm hover:bg-sky-500 hover:text-white transition-all">Today</button>
                <button onClick={handleNextMonth} className="p-4 bg-slate-50 rounded-3xl hover:bg-sky-50 hover:text-sky-600 transition-all shadow-sm"><ChevronRight size={24}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="bg-sky-50/50 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{day}</div>
              ))}
              {calendarDays.map((item, idx) => {
                const dayBookings = item.date ? getBookingsForDate(item.date) : [];
                const isToday = item.date === new Date().toISOString().split('T')[0];
                return (
                  <div 
                    key={idx} 
                    onClick={() => item.date && handleOpenModal(null, item.date)}
                    className={`bg-white min-h-[160px] p-4 relative group cursor-pointer transition-all ${item.day ? 'hover:bg-sky-50/30' : 'bg-slate-50/10'}`}
                  >
                    <span className={`text-sm font-black ${item.day ? (isToday ? 'text-sky-500 bg-sky-50 w-8 h-8 rounded-full flex items-center justify-center -ml-2 -mt-2' : 'text-slate-700') : 'text-slate-100'}`}>{item.day}</span>
                    <div className="mt-3 space-y-2">
                      {dayBookings.slice(0, 4).map(b => (
                        <div 
                          key={b.id} 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(b); }}
                          className={`px-3 py-2 rounded-xl text-[9px] font-black truncate border transition-all shadow-sm flex flex-col ${
                            b.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-500 hover:text-white' : 'bg-sky-50 text-sky-700 border-sky-100 hover:bg-sky-500 hover:text-white'
                          }`}
                        >
                          <span className="opacity-70">{b.startTime} - {b.endTime}</span>
                          <span className="truncate">{b.title}</span>
                        </div>
                      ))}
                      {dayBookings.length > 4 && (
                        <div className="text-[9px] font-bold text-sky-400 pl-2">+{dayBookings.length - 4} more...</div>
                      )}
                    </div>
                    {item.day && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Plus size={16} className="text-sky-400" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
        </div>
      ) : activeTab === 'rooms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map(room => (
              <div key={room.id} className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden group hover:border-sky-300 transition-all flex flex-col">
                <div className="h-48 bg-sky-50 flex items-center justify-center text-sky-200 group-hover:bg-sky-100 group-hover:text-sky-300 transition-all">
                  <Video size={72} strokeWidth={1.5} />
                </div>
                <div className="p-10 space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-slate-800">{room.name}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${room.status === 'Available' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{room.status === 'Available' ? 'ว่าง' : 'ไม่ว่าง'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-400 text-sm font-bold"><Users size={20} className="text-sky-400" /><span>ความจุ {room.capacity} ท่าน</span></div>
                  <div className="pt-6 flex gap-3">
                    <button onClick={() => handleOpenModal(room)} className="flex-1 py-4 rounded-[1.5rem] bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm">ตั้งค่าห้อง</button>
                    <button onClick={() => handleDelete(room.id)} className="p-4 rounded-[1.5rem] bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-sky-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-sky-50/50">
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">หัวข้อการประชุม</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ห้องที่จอง</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">วันเวลา / ผู้เข้าร่วม</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">สถานะการจอง</th>
                    <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-sky-50/30 transition-colors group">
                      <td className="px-10 py-8">
                        <div>
                          <span className="font-black text-slate-800 text-base block group-hover:text-sky-600 transition-colors">{b.title}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{b.employeeName} ({b.department})</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500"><Building size={20}/></div>
                           <span className="text-sm font-black text-slate-700 uppercase">{b.roomName}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-600 uppercase">{b.date}</p>
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight">{b.startTime} - {b.endTime}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${b.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>{b.status}</span>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(b)} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-[1.25rem] transition-all shadow-sm"><Edit2 size={18} /></button>
                          <button onClick={() => handleDelete(b.id)} className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.25rem] transition-all shadow-sm"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
      )}

      {/* Modal with Checklist UI */}
      {showModal && currentItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-2xl p-16 relative animate-in zoom-in-95 duration-200 scrollbar-hide">
            <button onClick={() => setShowModal(false)} className="absolute right-12 top-12 p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-colors active:scale-90"><X size={32} /></button>
            <div className="flex items-center gap-6 mb-12 border-b border-slate-100 pb-10">
               <div className="w-20 h-20 bg-sky-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-sky-100 transform rotate-3"><Building size={40} /></div>
               <div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tight">{currentItem.id ? 'แก้ไขการจอง' : 'Checklist Meeting Room'}</h3>
                  <p className="text-sky-500 font-black uppercase text-[12px] tracking-[0.3em]">ระบุข้อมูลการจองและคำขอสิ่งอำนวยความสะดวก</p>
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-12 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-sky-50/30 p-10 rounded-[3rem] border border-sky-100 shadow-inner">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">ชื่อผู้จอง (Applicant Name)</label>
                    <input type="text" required className="w-full p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5 shadow-sm" value={currentItem.employeeName || ''} onChange={e => setCurrentItem({...currentItem, employeeName: e.target.value})} placeholder="Full name..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">แผนก (Department)</label>
                    <select className="w-full p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/5 shadow-sm" value={currentItem.department || ''} onChange={e => setCurrentItem({...currentItem, department: e.target.value})}>
                      {DEPARTMENTS.filter(d => d !== 'ทั้งหมด').map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">ห้องที่ต้องการ (Room Selection)</label>
                    <select required className="w-full p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/5 shadow-sm" value={currentItem.roomId || ''} onChange={e => setCurrentItem({...currentItem, roomId: e.target.value})}>
                      <option value="">เลือกห้องประชุม...</option>
                      {rooms.map(r => <option key={r.id} value={r.id}>{r.name} (จุได้ {r.capacity})</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">วันที่ (Booking Date)</label>
                    <input type="date" required className="w-full p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/5 shadow-sm" value={currentItem.date || ''} onChange={e => setCurrentItem({...currentItem, date: e.target.value})} />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">ช่วงเวลา (Meeting Time Range)</label>
                    <div className="flex items-center gap-4">
                      <input type="time" required className="flex-1 p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/5" value={currentItem.startTime || ''} onChange={e => setCurrentItem({...currentItem, startTime: e.target.value})} />
                      <span className="text-slate-300 font-black">TO</span>
                      <input type="time" required className="flex-1 p-5 bg-white border border-sky-100 rounded-[1.75rem] text-sm font-black outline-none focus:ring-4 focus:ring-sky-500/5" value={currentItem.endTime || ''} onChange={e => setCurrentItem({...currentItem, endTime: e.target.value})} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1">หัวข้อวาระ (Meeting Objective)</label>
                    <input type="text" required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold outline-none focus:ring-4 focus:ring-sky-500/5" value={currentItem.title || ''} onChange={e => setCurrentItem({...currentItem, title: e.target.value})} placeholder="Meeting description..." />
                  </div>
                  <div className="grid grid-cols-3 gap-6 bg-slate-50/50 p-6 rounded-[2.5rem] border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase text-center block">Staffs</label>
                      <input type="number" className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-black text-center outline-none" value={currentItem.members || 0} onChange={e => setCurrentItem({...currentItem, members: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase text-center block">Guests</label>
                      <input type="number" className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-black text-center outline-none" value={currentItem.guests || 0} onChange={e => setCurrentItem({...currentItem, guests: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase text-center block">SAT Admins</label>
                      <input type="number" className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-sm font-black text-center outline-none" value={currentItem.sat || 0} onChange={e => setCurrentItem({...currentItem, sat: parseInt(e.target.value)})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1 flex items-center gap-2"><Layout size={16} className="text-amber-500"/> รูปแบบการจัดวางห้อง (Room Layout)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {LAYOUT_OPTIONS.map(layout => (
                      <button key={layout} type="button" onClick={() => setCurrentItem({...currentItem, tableLayout: layout})} className={`py-4 text-[10px] font-black uppercase rounded-2xl border-2 transition-all ${currentItem.tableLayout === layout ? 'bg-sky-500 border-sky-500 text-white shadow-lg' : 'bg-white border-slate-50 text-slate-400 hover:border-sky-200'}`}>
                        {layout}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1 flex items-center gap-2"><Video size={16} className="text-sky-500"/> อุปกรณ์ไอที (IT Support)</label>
                  <div className="grid grid-cols-1 gap-2">
                    {EQUIPMENT_OPTIONS.map(eq => (
                      <button key={eq} type="button" onClick={() => toggleEquipment(eq)} className={`p-4 text-left text-[10px] font-bold rounded-2xl border-2 transition-all flex items-center justify-between ${currentItem.equipment?.includes(eq) ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-inner' : 'bg-white border-slate-50 text-slate-400'}`}>
                        <span>{eq}</span>
                        {currentItem.equipment?.includes(eq) && <CheckCircle size={14} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1 flex items-center gap-2"><Shield size={16} className="text-rose-500"/> PPE For Guests</label>
                  <div className="space-y-3">
                    {SAFETY_OPTIONS.map(opt => (
                      <div key={opt} className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-black text-slate-500">{opt}</span>
                        <div className="flex items-center gap-3">
                           <button type="button" onClick={() => updateItemQuantity('safetyEquipment', opt, (currentItem.safetyEquipment?.find((i: any) => i.name === opt)?.quantity || 0) - 1)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white">-</button>
                           <span className="w-6 text-center text-sm font-black text-slate-700">{currentItem.safetyEquipment?.find((i: any) => i.name === opt)?.quantity || 0}</span>
                           <button type="button" onClick={() => updateItemQuantity('safetyEquipment', opt, (currentItem.safetyEquipment?.find((i: any) => i.name === opt)?.quantity || 0) + 1)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block px-1 flex items-center gap-2"><Coffee size={16} className="text-amber-600"/> Catering</label>
                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-3 scrollbar-hide">
                    {CATERING_OPTIONS.map(opt => (
                      <div key={opt} className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[11px] font-black text-slate-500">{opt}</span>
                        <div className="flex items-center gap-3">
                           <button type="button" onClick={() => updateItemQuantity('catering', opt, (currentItem.catering?.find((i: any) => i.name === opt)?.quantity || 0) - 1)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white">-</button>
                           <span className="w-6 text-center text-sm font-black text-slate-700">{currentItem.catering?.find((i: any) => i.name === opt)?.quantity || 0}</span>
                           <button type="button" onClick={() => updateItemQuantity('catering', opt, (currentItem.catering?.find((i: any) => i.name === opt)?.quantity || 0) + 1)} className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-10 border-t border-slate-100">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 font-black rounded-[2.5rem] uppercase text-xs tracking-widest hover:bg-slate-100 transition-all active:scale-95">Discard</button>
                  <button type="submit" className="flex-[2] py-6 bg-sky-500 text-white font-black rounded-[2.5rem] shadow-2xl shadow-sky-100 uppercase text-xs tracking-widest hover:bg-sky-600 transition-all active:scale-95">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoomModule;
