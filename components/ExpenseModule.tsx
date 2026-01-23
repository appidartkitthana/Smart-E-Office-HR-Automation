
import React, { useState } from 'react';
import { MOCK_EXPENSE_CLAIMS, MOCK_EMPLOYEES } from '../constants';
import { ExpenseClaim, Language } from '../types';
import { CreditCard, Plus, Edit2, Trash2, Search, Filter, DollarSign, CheckCircle, Clock, X, User, Image, FileText } from 'lucide-react';

// Add ExpenseModuleProps to handle incoming translation props
interface ExpenseModuleProps {
  lang: Language;
  t: any;
}

const ExpenseModule: React.FC<ExpenseModuleProps> = ({ lang, t }) => {
  const [claims, setClaims] = useState<ExpenseClaim[]>(MOCK_EXPENSE_CLAIMS);
  const [showModal, setShowModal] = useState(false);
  const [currentClaim, setCurrentClaim] = useState<Partial<ExpenseClaim> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenModal = (claim?: ExpenseClaim) => {
    setCurrentClaim(claim || { title: '', category: 'Other', amount: 0, status: 'Pending', requester: '' });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentClaim) return;

    if (currentClaim.id) {
      setClaims(claims.map(c => c.id === currentClaim.id ? (currentClaim as ExpenseClaim) : c));
    } else {
      const newClaim: ExpenseClaim = {
        ...currentClaim as ExpenseClaim,
        id: 'EX' + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString().split('T')[0]
      };
      setClaims([newClaim, ...claims]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('ยืนยันการลบรายการเบิกจ่ายนี้?')) {
      setClaims(claims.filter(c => c.id !== id));
    }
  };

  const filteredClaims = claims.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.requester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalApprovedAmount = claims.filter(c => c.status === 'Approved').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">เบิกค่าใช้จ่าย (Expenses)</h1>
          <p className="text-slate-500">ยื่นคำร้องเบิกค่าใช้จ่ายและตรวจสอบสถานะคืนเงิน</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span>ยื่นคำร้องเบิกเงินใหม่</span>
        </button>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-2xl w-fit mb-4">
            <DollarSign size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ยอดรออนุมัติ</p>
          <h3 className="text-2xl font-black text-slate-800">฿ {claims.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm ring-1 ring-emerald-100">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl w-fit mb-4">
            <CheckCircle size={24} />
          </div>
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">อนุมัติแล้ว (รวม)</p>
          <h3 className="text-2xl font-black text-emerald-600">฿ {totalApprovedAmount.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl w-fit mb-4">
            <FileText size={24} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">คำร้องทั้งหมด</p>
          <h3 className="text-2xl font-black text-slate-800">{claims.length} รายการ</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-amber-50 shadow-sm">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">รอดำเนินการ</p>
          <h3 className="text-2xl font-black text-amber-800">{claims.filter(c => c.status === 'Pending').length} รายการ</h3>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={`ค้นหาหัวข้อการเบิก หรือพนักงาน...`} 
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
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">รายการ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ผู้ยื่นคำร้อง</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">จำนวนเงิน</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะ</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClaims.map(claim => (
                  <tr key={claim.id} className="hover:bg-sky-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <span className="text-xs font-black text-sky-600 uppercase mb-1 block">{claim.category}</span>
                        <span className="text-sm font-bold text-slate-700">{claim.title}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-sky-50 rounded-full flex items-center justify-center text-[10px] font-bold text-sky-500">
                           {claim.requester.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-600 font-medium">{claim.requester}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-800">฿ {claim.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-5 text-sm text-slate-500">{claim.date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                        claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' : 
                        claim.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {claim.status === 'Approved' ? 'อนุมัติ' : claim.status === 'Pending' ? 'รออนุมัติ' : 'ปฏิเสธ'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-1">
                        <button onClick={() => handleOpenModal(claim)} className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(claim.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Expense Modal */}
      {showModal && currentClaim && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowModal(false)} className="absolute right-6 top-6 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg"><CreditCard size={24} /></div>
               <div>
                  <h3 className="text-2xl font-black text-slate-800">{currentClaim.id ? 'แก้ไขรายการเบิกจ่าย' : 'ยื่นเบิกค่าใช้จ่ายใหม่'}</h3>
               </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">พนักงานผู้ยื่นเบิก</label>
                  <select required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentClaim.requester || ''} onChange={e => setCurrentClaim({...currentClaim, requester: e.target.value})}>
                    <option value="">เลือกพนักงาน...</option>
                    {MOCK_EMPLOYEES.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">หัวข้อการเบิก</label>
                  <input type="text" required className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={currentClaim.title || ''} onChange={e => setCurrentClaim({...currentClaim, title: e.target.value})} placeholder="เช่น ค่าที่พักตากอากาศระยอง..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">หมวดหมู่</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentClaim.category || 'Other'} onChange={e => setCurrentClaim({...currentClaim, category: e.target.value as any})}>
                      <option value="Travel">เดินทาง (Travel)</option>
                      <option value="Medical">ค่ารักษาพยาบาล (Medical)</option>
                      <option value="Entertainment">รับรองลูกค้า (Entertainment)</option>
                      <option value="Other">อื่นๆ (Other)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">จำนวนเงิน (บาท)</label>
                    <input type="number" required min="1" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none" value={currentClaim.amount || 0} onChange={e => setCurrentClaim({...currentClaim, amount: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">อัปโหลดใบเสร็จ (จำลอง)</label>
                  <div className="w-full p-8 border-2 border-dashed border-sky-100 rounded-2xl bg-sky-50/30 flex flex-col items-center justify-center text-sky-400 hover:bg-sky-50 transition-all cursor-pointer">
                    <Image size={32} className="mb-2" />
                    <span className="text-xs font-bold">เลือกไฟล์ หรือลากวางที่นี่</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานะ</label>
                  <div className="flex gap-2">
                    {['Pending', 'Approved', 'Rejected'].map(status => (
                      <button key={status} type="button" onClick={() => setCurrentClaim({...currentClaim, status: status as any})} className={`flex-1 py-2 text-xs font-bold rounded-xl border ${currentClaim.status === status ? 'bg-sky-500 border-sky-500 text-white shadow-md' : 'bg-white text-slate-400 hover:bg-sky-50'}`}>
                        {status === 'Pending' ? 'รออนุมัติ' : status === 'Approved' ? 'อนุมัติ' : 'ปฏิเสธ'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-sky-500 text-white font-bold rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">บันทึกรายการเบิก</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseModule;
