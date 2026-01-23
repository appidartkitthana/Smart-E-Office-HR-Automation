
import React, { useState } from 'react';
import { MOCK_VEHICLES, MOCK_VEHICLE_BOOKINGS, MOCK_EMPLOYEES } from '../constants';
import { Vehicle, VehicleBooking, Language } from '../types';
import { Truck, Plus, Edit2, Trash2, Search, Calendar, MapPin, User, CheckCircle, X, Clock, Filter } from 'lucide-react';

// Add VehicleModuleProps to handle incoming translation props
interface VehicleModuleProps {
  lang: Language;
  t: any;
}

const VehicleModule: React.FC<VehicleModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings'>('vehicles');
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<VehicleBooking[]>(MOCK_VEHICLE_BOOKINGS);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (item?: any) => {
    if (activeTab === 'vehicles') {
      setCurrentItem(item || { model: '', plateNumber: '', type: 'Sedan', status: 'Available' });
    } else {
      setCurrentItem(item || { vehicleId: '', startDate: '', endDate: '', destination: '', driverName: '', status: 'Pending' });
    }
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;

    if (activeTab === 'vehicles') {
      if (currentItem.id) {
        setVehicles(vehicles.map(v => v.id === currentItem.id ? currentItem : v));
      } else {
        const newItem = { ...currentItem, id: 'V' + Math.random().toString(36).substr(2, 5) };
        setVehicles([newItem, ...vehicles]);
      }
    } else {
      if (currentItem.id) {
        setBookings(bookings.map(b => b.id === currentItem.id ? currentItem : b));
      } else {
        const selectedVehicle = vehicles.find(v => v.id === currentItem.vehicleId);
        const newItem = { 
            ...currentItem, 
            id: 'VB' + Math.random().toString(36).substr(2, 5),
            vehicleName: selectedVehicle ? `${selectedVehicle.model} (${selectedVehicle.plateNumber})` : 'Unknown'
        };
        setBookings([newItem, ...bookings]);
      }
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('ยืนยันการลบรายการนี้?')) {
      if (activeTab === 'vehicles') {
        setVehicles(vehicles.filter(v => v.id !== id));
      } else {
        setBookings(bookings.filter(b => b.id !== id));
      }
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => 
    b.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">จองรถส่วนกลาง (Vehicle Booking)</h1>
          <p className="text-slate-500">จัดการยานพาหนะบริษัท ตารางการเดินทาง และคนขับ</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span>{activeTab === 'vehicles' ? 'เพิ่มรถใหม่' : 'จองรถใหม่'}</span>
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl w-fit mb-4">
            <Truck size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">รถทั้งหมด</p>
          <h3 className="text-2xl font-black text-slate-800">{vehicles.length} คัน</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-4">
            <CheckCircle size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-emerald-500">พร้อมใช้งาน</p>
          <h3 className="text-2xl font-black text-slate-800">{vehicles.filter(v => v.status === 'Available').length} คัน</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4">
            <Calendar size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">จองวันนี้</p>
          <h3 className="text-2xl font-black text-slate-800">{bookings.length} รายการ</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl w-fit mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ซ่อมบำรุง</p>
          <h3 className="text-2xl font-black text-slate-800">{vehicles.filter(v => v.status === 'Maintenance').length} คัน</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit">
        <button 
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'vehicles' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          รายการรถ
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'bookings' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          ประวัติการจอง
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`ค้นหา...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-sky-100 rounded-2xl outline-none focus:ring-2 focus:ring-sky-200 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-sky-100 rounded-2xl text-slate-400 hover:text-sky-500 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>

        {activeTab === 'vehicles' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map(v => (
              <div key={v.id} className="bg-white p-6 rounded-[2rem] border border-sky-100 shadow-sm group hover:border-sky-300 transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 bg-sky-50 rounded-2xl text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                    <Truck size={32} />
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                    v.status === 'Available' ? 'bg-emerald-100 text-emerald-600' : 
                    v.status === 'Busy' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                  }`}>
                    {v.status === 'Available' ? 'ว่าง' : v.status === 'Busy' ? 'ติดงาน' : 'ซ่อม'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-800">{v.model}</h3>
                <p className="text-sky-600 font-bold mb-4">{v.plateNumber}</p>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <span className="bg-slate-50 px-3 py-1 rounded-full font-bold">{v.type}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(v)} className="flex-1 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-all">แก้ไข</button>
                  <button onClick={() => handleDelete(v.id)} className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ผู้จอง/สถานที่</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">รถที่ใช้</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <span className="font-bold text-slate-700 block">{b.employeeName}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-1">
                          <MapPin size={12} /> {b.destination}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-sky-600 font-bold">{b.vehicleName}</span>
                      {b.driverName && <p className="text-[10px] text-slate-400">คนขับ: {b.driverName}</p>}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-slate-600">{b.startDate}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                        b.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                        b.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {b.status === 'Approved' ? 'อนุมัติ' : b.status === 'Pending' ? 'รอ' : 'ปฏิเสธ'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenModal(b)} className="p-2 text-slate-400 hover:text-sky-500 transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(b.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && currentItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg"><Truck size={24} /></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">{currentItem.id ? 'แก้ไขข้อมูล' : (activeTab === 'vehicles' ? 'เพิ่มรถบริษัท' : 'ทำรายการจองรถ')}</h3>
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                {activeTab === 'vehicles' ? (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">รุ่นรถ</label>
                      <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.model || ''} onChange={e => setCurrentItem({...currentItem, model: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">เลขทะเบียน</label>
                        <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.plateNumber || ''} onChange={e => setCurrentItem({...currentItem, plateNumber: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ประเภท</label>
                        <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.type || 'Sedan'} onChange={e => setCurrentItem({...currentItem, type: e.target.value})}>
                          <option value="Sedan">เก๋ง</option>
                          <option value="Van">ตู้</option>
                          <option value="SUV">SUV</option>
                          <option value="Pickup">กระบะ</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">เลือกรถ</label>
                      <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.vehicleId || ''} onChange={e => setCurrentItem({...currentItem, vehicleId: e.target.value})}>
                        <option value="">เลือกคันที่จะใช้...</option>
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.plateNumber})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ผู้ใช้รถ</label>
                      <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.employeeName || ''} onChange={e => setCurrentItem({...currentItem, employeeName: e.target.value})}>
                        <option value="">เลือกพนักงาน...</option>
                        {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วันที่ใช้</label>
                        <input type="date" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.startDate || ''} onChange={e => setCurrentItem({...currentItem, startDate: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานที่ปลายทาง</label>
                        <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentItem.destination || ''} onChange={e => setCurrentItem({...currentItem, destination: e.target.value})} />
                      </div>
                    </div>
                  </>
                )}
                
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานะ</label>
                  <div className="flex gap-2">
                    {(activeTab === 'vehicles' ? ['Available', 'Busy', 'Maintenance'] : ['Pending', 'Approved', 'Rejected']).map(status => (
                      <button key={status} type="button" onClick={() => setCurrentItem({...currentItem, status})} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${currentItem.status === status ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white text-slate-400'}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">บันทึกข้อมูล</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleModule;
