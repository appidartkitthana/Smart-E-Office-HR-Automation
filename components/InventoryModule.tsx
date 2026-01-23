
import React, { useState, useMemo } from 'react';
import { MOCK_INVENTORY, MOCK_SUPPLY_REQUESTS, MOCK_EMPLOYEES } from '../constants';
import { InventoryItem, SupplyRequest, Language } from '../types';
import { 
  Box, Plus, Edit2, Trash2, Search, AlertTriangle, CheckCircle, 
  X, ShoppingCart, List, Filter, Shield, BadgeCheck, 
  History, User, Clipboard, ArrowDownToLine
} from 'lucide-react';

interface InventoryModuleProps {
  lang: Language;
  t: any;
}

const InventoryModule: React.FC<InventoryModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'ppe'>('inventory');
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [requests, setRequests] = useState<SupplyRequest[]>(MOCK_SUPPLY_REQUESTS);
  const [showModal, setShowModal] = useState(false);
  const [showPpeModal, setShowPpeModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<InventoryItem> | null>(null);
  const [currentPpeReq, setCurrentPpeReq] = useState<any>({ employeeId: '', itemId: '', quantity: 1, size: '', notes: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const ppeItems = useMemo(() => items.filter(i => i.category === 'PPE'), [items]);
  const nonPpeItems = useMemo(() => items.filter(i => i.category !== 'PPE'), [items]);

  const handleOpenModal = (item?: InventoryItem) => {
    setCurrentItem(item || { name: '', category: 'Office Supplies', stock: 0, minStock: 5, unit: 'Pcs' });
    setShowModal(true);
  };

  const handleOpenPpeModal = () => {
    setCurrentPpeReq({ employeeId: '', itemId: '', quantity: 1, size: '', notes: '' });
    setShowPpeModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem) return;
    if (currentItem.id) {
      setItems(items.map(i => i.id === currentItem.id ? (currentItem as InventoryItem) : i));
    } else {
      setItems([{ ...currentItem as InventoryItem, id: Math.random().toString(36).substr(2, 9) }, ...items]);
    }
    setShowModal(false);
  };

  const handlePpeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedItem = items.find(i => i.id === currentPpeReq.itemId);
    const selectedEmp = MOCK_EMPLOYEES.find(e => e.id === currentPpeReq.employeeId);
    
    if (!selectedItem || !selectedEmp) return;

    const newReq: SupplyRequest = {
      id: 'PPE' + Math.random().toString(36).substr(2, 5),
      employeeId: selectedEmp.id,
      employeeName: selectedEmp.name,
      itemName: `${selectedItem.name} ${currentPpeReq.size ? `(Size: ${currentPpeReq.size})` : ''}`,
      quantity: currentPpeReq.quantity,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setRequests([newReq, ...requests]);
    setShowPpeModal(false);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('ยืนยันการลบพัสดุนี้จากสต็อก?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(i => 
    (activeTab === 'ppe' ? i.category === 'PPE' : i.category !== 'PPE') &&
    (i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const lowStockCount = items.filter(i => i.stock <= i.minStock).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-10 rounded-[3rem] border border-sky-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">คลังพัสดุ & PPE</h1>
          <p className="text-slate-400 font-medium">ศูนย์ควบคุมสต็อกพัสดุสำนักงานและการเบิกจ่ายอุปกรณ์ความปลอดภัย (PPE)</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleOpenPpeModal()}
            className="bg-amber-500 text-white px-8 py-5 rounded-[2.5rem] font-black shadow-2xl shadow-amber-100 hover:bg-amber-600 transition-all flex items-center gap-3"
          >
            <Shield size={22} />
            <span>เบิกรายการ PPE</span>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-sky-500 text-white px-8 py-5 rounded-[2.5rem] font-black shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-3"
          >
            <Plus size={22} />
            <span>เพิ่มพัสดุใหม่</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-sky-50 group-hover:scale-110 transition-transform"><Box size={80}/></div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">พัสดุทั้งหมด</p>
           <h3 className="text-4xl font-black text-slate-800">{items.length}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-rose-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-rose-50 group-hover:scale-110 transition-transform"><AlertTriangle size={80}/></div>
           <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">สินค้าใกล้หมด</p>
           <h3 className="text-4xl font-black text-rose-600">{lowStockCount}</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-amber-50 group-hover:scale-110 transition-transform"><Shield size={80}/></div>
           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">PPE ในสต็อก</p>
           <h3 className="text-4xl font-black text-amber-600">{ppeItems.length} ชนิด</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 text-emerald-50 group-hover:scale-110 transition-transform"><ShoppingCart size={80}/></div>
           <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">คำขอเบิกค้างอยู่</p>
           <h3 className="text-4xl font-black text-emerald-600">{requests.filter(r=>r.status==='Pending').length}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-[2.5rem] border border-sky-100 w-fit shadow-sm overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setActiveTab('inventory')} className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'inventory' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}>
          <Box size={18} /> สต็อกพัสดุทั่วไป
        </button>
        <button onClick={() => setActiveTab('ppe')} className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'ppe' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}>
          <Shield size={18} /> อุปกรณ์ PPE
        </button>
        <button onClick={() => setActiveTab('requests')} className={`px-10 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'requests' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}>
          <List size={18} /> ประวัติการเบิกจ่าย
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
              className="w-full pl-12 pr-4 py-4 bg-white border border-sky-100 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-sky-500/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {activeTab === 'inventory' || activeTab === 'ppe' ? (
          <div className="bg-white rounded-[3.5rem] border border-sky-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">รายการพัสดุ / อุปกรณ์</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">หมวดหมู่</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">จำนวนคงเหลือ</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">สถานะสต็อก</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-sky-50/20 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 ${item.category === 'PPE' ? 'bg-amber-50 text-amber-500' : 'bg-sky-50 text-sky-500'} rounded-2xl flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                          {item.category === 'PPE' ? <Shield size={24}/> : <Box size={24}/>}
                        </div>
                        <span className="font-black text-slate-700 text-lg">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">{item.category}</span>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-800 text-xl tracking-tighter">
                      {item.stock} <span className="text-sm font-medium text-slate-400">{item.unit}</span>
                    </td>
                    <td className="px-10 py-8">
                      {item.stock <= item.minStock ? (
                        <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase bg-rose-50 px-4 py-1.5 rounded-full w-fit">
                          <AlertTriangle size={14} /> <span>Stock Low</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase bg-emerald-50 px-4 py-1.5 rounded-full w-fit">
                          <CheckCircle size={14} /> <span>Available</span>
                        </div>
                      )}
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(item as InventoryItem)} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-[1.25rem] transition-all"><Edit2 size={18}/></button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-4 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-[1.25rem] transition-all"><Trash2 size={18}/></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* History View */
          <div className="bg-white rounded-[3.5rem] border border-sky-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ผู้ขอเบิก (Issuer)</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">รายการพัสดุ / PPE</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">จำนวน</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">วันที่ทำรายการ</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">สถานะการเบิก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-sky-50/20 transition-colors group">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs shadow-inner"><User size={18}/></div>
                          <span className="font-black text-slate-700">{req.employeeName}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 font-bold text-slate-700">{req.itemName}</td>
                    <td className="px-10 py-8 font-black text-slate-800">{req.quantity}</td>
                    <td className="px-10 py-8 text-sm font-medium text-slate-400">{req.requestDate}</td>
                    <td className="px-10 py-8">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          req.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                          req.status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                       }`}>{req.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Standard Inventory Modal */}
      {showModal && currentItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 relative">
              <button onClick={() => setShowModal(false)} className="absolute right-12 top-12 p-3 text-slate-400 hover:bg-slate-50 rounded-full"><X size={32} /></button>
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 bg-sky-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-lg"><Box size={40} /></div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{currentItem.id ? 'แก้ไขข้อมูลพัสดุ' : 'เพิ่มรายการสต็อกใหม่'}</h3>
                    <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Inventory Management System</p>
                 </div>
              </div>
              <form onSubmit={handleSaveItem} className="space-y-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-2">ชื่อพัสดุ / อุปกรณ์</label>
                        <input type="text" required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold outline-none" value={currentItem.name || ''} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">หมวดหมู่</label>
                           <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentItem.category || 'Office Supplies'} onChange={e => setCurrentItem({...currentItem, category: e.target.value})}>
                              <option value="Office Supplies">พัสดุสำนักงาน</option>
                              <option value="IT Supplies">อุปกรณ์ IT</option>
                              <option value="PPE">อุปกรณ์ PPE (Safety)</option>
                              <option value="Other">อื่นๆ</option>
                           </select>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">หน่วยนับ</label>
                           <input type="text" placeholder="เช่น ชิ้น, กล่อง, คู่" required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-bold outline-none" value={currentItem.unit || ''} onChange={e => setCurrentItem({...currentItem, unit: e.target.value})} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">จำนวนปัจจุบัน</label>
                           <input type="number" required min="0" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentItem.stock || 0} onChange={e => setCurrentItem({...currentItem, stock: parseInt(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">จำนวนขั้นต่ำ (Min Stock)</label>
                           <input type="number" required min="0" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentItem.minStock || 0} onChange={e => setCurrentItem({...currentItem, minStock: parseInt(e.target.value)})} />
                        </div>
                     </div>
                  </div>
                  <button type="submit" className="w-full py-6 bg-sky-500 text-white font-black rounded-[2.5rem] shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all uppercase text-xs tracking-widest">บันทึกข้อมูลรายการ</button>
              </form>
           </div>
        </div>
      )}

      {/* PPE Request Modal */}
      {showPpeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[4rem] shadow-2xl p-16 relative">
              <button onClick={() => setShowPpeModal(false)} className="absolute right-12 top-12 p-3 text-slate-400 hover:bg-slate-50 rounded-full"><X size={32} /></button>
              <div className="flex items-center gap-6 mb-12">
                 <div className="w-20 h-20 bg-amber-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-lg"><Shield size={40} /></div>
                 <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">แบบฟอร์มเบิกอุปกรณ์ PPE</h3>
                    <p className="text-amber-500 font-black uppercase text-[10px] tracking-widest">PPE Personal Equipment Issuance</p>
                 </div>
              </div>
              <form onSubmit={handlePpeRequest} className="space-y-8">
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-2">ผู้ขอเบิก (Employee)</label>
                        <select required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentPpeReq.employeeId} onChange={e => setCurrentPpeReq({...currentPpeReq, employeeId: e.target.value})}>
                           <option value="">เลือกพนักงาน...</option>
                           {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-2">เลือกอุปกรณ์ PPE (Item Selection)</label>
                        <select required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentPpeReq.itemId} onChange={e => setCurrentPpeReq({...currentPpeReq, itemId: e.target.value})}>
                           <option value="">เลือกพัสดุ PPE...</option>
                           {ppeItems.map(item => <option key={item.id} value={item.id}>{item.name} (คงเหลือ: {item.stock} {item.unit})</option>)}
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">จำนวนที่ขอ</label>
                           <input type="number" min="1" required className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentPpeReq.quantity} onChange={e => setCurrentPpeReq({...currentPpeReq, quantity: parseInt(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-slate-400 uppercase ml-2">ขนาด (Size - ถ้ามี)</label>
                           <input type="text" placeholder="S, M, L, XL, 42, 43..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black outline-none" value={currentPpeReq.size} onChange={e => setCurrentPpeReq({...currentPpeReq, size: e.target.value})} />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase ml-2">หมายเหตุ / เหตุผลการเบิก</label>
                        <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold outline-none h-24 resize-none shadow-inner" placeholder="เช่น ขอเบิกใหม่เนื่องจากของเดิมชำรุด หรือ สำหรับพนักงานเข้าใหม่..." value={currentPpeReq.notes} onChange={e => setCurrentPpeReq({...currentPpeReq, notes: e.target.value})} />
                     </div>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                     <div className="p-2 bg-white rounded-xl text-amber-500 shadow-sm"><Clipboard size={20}/></div>
                     <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                        การเบิกอุปกรณ์ความปลอดภัยส่วนบุคคล (PPE) จะต้องได้รับการลงบันทึกในประวัติการรับอุปกรณ์ของพนักงาน และพนักงานมีหน้าที่ดูแลรักษาอุปกรณ์ให้พร้อมใช้งานอยู่เสมอ
                     </p>
                  </div>
                  <button type="submit" className="w-full py-6 bg-amber-500 text-white font-black rounded-[2.5rem] shadow-2xl shadow-amber-100 hover:bg-amber-600 transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3">
                     <ArrowDownToLine size={20}/> บันทึกการส่งมอบ PPE
                  </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default InventoryModule;
