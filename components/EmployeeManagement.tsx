
import React, { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../constants';
import { Employee, UserRole, Language } from '../types';
import { db } from '../services/api';
import { 
  Users, UserPlus, Search, X, Settings2, RefreshCw, Trash2, Edit3, 
  UserCheck, Zap, ShieldCheck, Briefcase, IdCard, Contact, 
  FileCheck, AlertCircle, Save, Mail, Phone, MapPin
} from 'lucide-react';

interface EmployeeManagementProps {
  lang: Language;
  t: any;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ lang, t }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDept, setActiveDept] = useState('ทั้งหมด');

  useEffect(() => { loadEmployees(); }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    const data = await db.getAll('EMPLOYEES');
    setEmployees(data);
    setIsLoading(false);
  };

  const filteredEmployees = employees.filter(emp => activeDept === 'ทั้งหมด' || emp.department === activeDept);

  if (isLoading) return <div className="text-center p-10"><RefreshCw className="animate-spin inline mr-2"/> Loading...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map(dept => (
            <button key={dept} onClick={() => setActiveDept(dept)} className={`px-3 py-1 text-xs font-bold rounded ${activeDept === dept ? 'bg-primary text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {dept}
            </button>
          ))}
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-green-600 shadow-sm">
          <UserPlus size={14} /> Add New Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEmployees.map(emp => (
              <div key={emp.id} className="card overflow-hidden">
                  <div className="h-20 bg-primary/10 border-b border-gray-100 flex items-end justify-center pb-2">
                     <img src={emp.avatar || `https://picsum.photos/seed/${emp.id}/100/100`} className="w-20 h-20 rounded-full border-4 border-white shadow-sm object-cover bg-white -mb-8 z-10" alt="" />
                  </div>
                  <div className="card-body pt-10 text-center pb-4">
                      <h4 className="text-lg font-bold text-gray-800 m-0">{emp.name}</h4>
                      <p className="text-xs text-gray-500 mb-4">{emp.position}</p>
                      
                      <div className="flex justify-center gap-3 py-3 border-t border-gray-50">
                         <div className="text-center px-4">
                            <p className="text-sm font-bold text-gray-700">{emp.department}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Dept</p>
                         </div>
                         <div className="border-l border-gray-100"></div>
                         <div className="text-center px-4">
                            <p className="text-sm font-bold text-gray-700">{emp.id}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">ID</p>
                         </div>
                      </div>
                  </div>
                  <div className="card-footer flex gap-2 p-2">
                      <button className="flex-1 py-1.5 bg-info text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 hover:bg-cyan-600"><Edit3 size={10}/> EDIT</button>
                      <button className="flex-1 py-1.5 bg-danger text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 hover:bg-red-600"><Trash2 size={10}/> REMOVE</button>
                  </div>
              </div>
          ))}
      </div>

      {/* List View - AdminLTE Data Table Style */}
      <div className="card border-t-4 border-info mt-8">
          <div className="card-header">
             <h3 className="text-lg font-normal text-gray-800">Complete Employee Directory</h3>
          </div>
          <div className="card-body p-0">
              <table className="table table-striped mb-0">
                  <thead>
                    <tr>
                      <th style={{width: '60px'}}>Avatar</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Position</th>
                      <th>Status</th>
                      <th className="text-right">Access Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id}>
                        <td><img src={emp.avatar} className="w-8 h-8 rounded-full border border-gray-200" /></td>
                        <td className="font-bold text-gray-700">{emp.name}</td>
                        <td>{emp.department}</td>
                        <td>{emp.position}</td>
                        <td>
                          <span className={`badge ${emp.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>{emp.status}</span>
                        </td>
                        <td className="text-right font-bold text-primary text-xs">{emp.role}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
