
import React, { useState } from 'react';
import { MOCK_EMPLOYEES, DEPARTMENTS } from '../constants';
import { Employee, UserRole, Language } from '../types';
import { Users, UserPlus, Mail, Phone, MapPin, Search, ChevronRight, Edit2, X, Settings2 } from 'lucide-react';

// Add EmployeeManagementProps to handle incoming translation props
interface EmployeeManagementProps {
  lang: Language;
  t: any;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ lang, t }) => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [activeDept, setActiveDept] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = activeDept === 'ทั้งหมด' || emp.department === activeDept;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const getDeptCount = (dept: string) => employees.filter(e => e.department === dept).length;

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setShowEditModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    setEmployees(employees.map(e => e.id === editingEmployee.id ? (editingEmployee as Employee) : e));
    setShowEditModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">จัดการบุคลากร (Employee Management)</h1>
          <p className="text-slate-500">ฐานข้อมูลพนักงานและการจัดการแผนก</p>
        </div>
        <button className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2">
            <UserPlus size={20} />
            <span>เพิ่มพนักงานใหม่</span>
        </button>
      </div>

      {/* Dept Count Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {DEPARTMENTS.filter(d => d !== 'ทั้งหมด').map(dept => (
           <div key={dept} className="bg-white p-4 rounded-3xl border border-sky-100 shadow-sm text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{dept}</p>
              <h4 className="text-xl font-black text-sky-600">{getDeptCount(dept)}</h4>
           </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
              {DEPARTMENTS.map(dept => (
                  <button key={dept} onClick={() => setActiveDept(dept)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeDept === dept ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'bg-white text-slate-500 hover:bg-sky-50 border border-sky-100'}`}>
                      {dept} {dept !== 'ทั้งหมด' && <span className="ml-1 opacity-60">({getDeptCount(dept)})</span>}
                  </button>
              ))}
          </div>
          <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input type="text" placeholder="ค้นหาพนักงานด้วยชื่อ หรือตำแหน่ง..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-sky-100 shadow-sm outline-none" />
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
              <div key={emp.id} className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm p-6 hover:shadow-xl transition-all group relative">
                  <button onClick={() => handleEdit(emp)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Settings2 size={18} /></button>
                  <div className="flex items-center gap-4 mb-4">
                      <img src={emp.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-sky-50" alt="" />
                      <div>
                          <h4 className="font-bold text-slate-800 text-lg">{emp.name}</h4>
                          <p className="text-sm text-sky-500 font-bold">{emp.position}</p>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-50">
                      <div className="text-[10px] font-black text-slate-400 uppercase">แผนก: <span className="text-slate-600 ml-1">{emp.department}</span></div>
                      <div className="text-[10px] font-black text-slate-400 uppercase">สิทธิ: <span className="text-sky-600 ml-1">{emp.role}</span></div>
                  </div>
                  <div className="mt-4"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${emp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{emp.status}</span></div>
              </div>
          ))}
      </div>

      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative">
            <button onClick={() => setShowEditModal(false)} className="absolute right-8 top-8 p-2 text-slate-400"><X size={24} /></button>
            <h3 className="text-2xl font-black text-slate-800 mb-8">แก้ไขข้อมูลพนักงาน</h3>
            <form onSubmit={handleSave} className="space-y-6">
               <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">ตำแหน่ง</label><input type="text" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={editingEmployee.position || ''} onChange={e => setEditingEmployee({...editingEmployee, position: e.target.value})} /></div>
               <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">แผนก</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={editingEmployee.department || ''} onChange={e => setEditingEmployee({...editingEmployee, department: e.target.value})}>
                       {DEPARTMENTS.filter(d => d !== 'ทั้งหมด').map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">ระดับสิทธิ (Role)</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={editingEmployee.role || UserRole.EMPLOYEE} onChange={e => setEditingEmployee({...editingEmployee, role: e.target.value as UserRole})}>
                       {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
               </div>
               <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">สถานะ</label>
                  <select className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold" value={editingEmployee.status || 'Active'} onChange={e => setEditingEmployee({...editingEmployee, status: e.target.value as any})}>
                     <option value="Active">ทำงานปกติ (Active)</option>
                     <option value="On Leave">ลางาน (On Leave)</option>
                     <option value="Terminated">พ้นสภาพ (Terminated)</option>
                  </select>
               </div>
               <button type="submit" className="w-full py-4 bg-sky-500 text-white font-black rounded-2xl shadow-lg">บันทึกการเปลี่ยนแปลง</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
