
import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Plus, Search, GraduationCap, Users, Clock, 
  CheckCircle, X, Award, Download, LayoutGrid, List, 
  BarChart3, History, ArrowRight, UserCheck, TrendingUp,
  MapPin, User, FileText, Filter, ChevronRight, Activity,
  AlertTriangle
} from 'lucide-react';
import { Language } from '../types';

interface LMSModuleProps {
  lang: Language;
  t: any;
}

const LMSModule: React.FC<LMSModuleProps> = ({ lang, t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Data samples derived from your SQL dump (coursedata_tb, record_tb, emp_tb)
  const trainingHistory = [
    { id: 1, empNo: 'SAT0287', date: '24/10/2018', type: 'InHouse', course: 'TRN-005', courseName: 'ผู้บังคับปั้นจั่น (Overhead Crane)', place: 'Sumino Aapico', fee: '592.59', progress: 100 },
    { id: 2, empNo: 'SAT0338', date: '24/10/2018', type: 'InHouse', course: 'TRN-005', courseName: 'ผู้บังคับปั้นจั่น (Overhead Crane)', place: 'Sumino Aapico', fee: '592.59', progress: 100 },
    { id: 29, empNo: 'SAT0309', date: '08/08/2018', type: 'Public', course: 'TRN-120', courseName: 'Steel Ruler and Steel Tape Calibration', place: 'Inctech Metrological', fee: '4,500.00', progress: 100 },
    { id: 30, empNo: 'SAT0229', date: '25/12/2018', type: 'Public', course: 'TRN-124', courseName: 'Accounting techniques for BOI', place: 'Swissotel Le Concorde', fee: '4,680.00', progress: 100 },
    { id: 3055, empNo: 'SAT0132', date: '04/09/2025', type: 'InHouse', course: 'TRN-420', courseName: 'ผู้บังคับปั้นจั่น (ทบทวน)', place: 'RTN Safety', fee: '2,600.00', progress: 75 },
    { id: 3113, empNo: 'SAT0394', date: '23/09/2025', type: 'Online', course: 'TRN-228', courseName: 'Risk and Opportunity ISO9001:2015', place: 'Q&A Quality', fee: '0.00', progress: 45 },
  ];

  // Calculated stats based on emp_tb departments
  const departmentStats = [
    { name: 'Production', active: 245, total: 312, color: 'bg-primary' },
    { name: 'QA/QC', active: 85, total: 92, color: 'bg-success' },
    { name: 'HR/Admin', active: 18, total: 20, color: 'bg-info' },
    { name: 'PC&L', active: 56, total: 75, color: 'bg-warning' },
    { name: 'Maintenance', active: 14, total: 18, color: 'bg-danger' },
  ];

  const filteredHistory = trainingHistory.filter(h => 
    h.empNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="small-box bg-info">
          <div className="inner">
            <h3>427</h3>
            <p>Course Catalog</p>
          </div>
          <div className="icon"><BookOpen size={60} /></div>
          <button className="w-full py-1 text-center bg-black/10 text-[10px] uppercase font-bold text-white hover:bg-black/20">
            View All Courses <ArrowRight size={10} className="inline ml-1"/>
          </button>
        </div>
        <div className="small-box bg-success">
          <div className="inner">
            <h3>588</h3>
            <p>Active Employees</p>
          </div>
          <div className="icon"><Users size={60} /></div>
          <button className="w-full py-1 text-center bg-black/10 text-[10px] uppercase font-bold text-white hover:bg-black/20">
            View Directory <ArrowRight size={10} className="inline ml-1"/>
          </button>
        </div>
        <div className="small-box bg-warning">
          <div className="inner">
            <h3>82%</h3>
            <p>Completion Rate</p>
          </div>
          <div className="icon"><TrendingUp size={60} /></div>
          <button className="w-full py-1 text-center bg-black/10 text-[10px] uppercase font-bold text-white hover:bg-black/20">
            Performance Analysis <ArrowRight size={10} className="inline ml-1"/>
          </button>
        </div>
        <div className="small-box bg-danger">
          <div className="inner">
            <h3>24</h3>
            <p>Pending Certificate</p>
          </div>
          <div className="icon"><Award size={60} /></div>
          <button className="w-full py-1 text-center bg-black/10 text-[10px] uppercase font-bold text-white hover:bg-black/20">
            Verify Now <ArrowRight size={10} className="inline ml-1"/>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Department Progress Bars */}
        <div className="lg:col-span-4">
          <div className="card border-t-4 border-primary">
            <div className="card-header bg-white">
               <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
                 <Activity size={18} className="text-primary"/> Progress by Department
               </h3>
            </div>
            <div className="card-body">
               {departmentStats.map(dept => (
                 <div key={dept.name} className="mb-5">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-sm font-bold text-gray-700">{dept.name}</span>
                       <span className="text-xs font-bold text-gray-500">{Math.round((dept.active/dept.total)*100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 shadow-inner">
                       <div 
                         className={`${dept.color} h-2.5 rounded-full transition-all duration-1000 shadow-sm`} 
                         style={{ width: `${(dept.active/dept.total)*100}%` }}
                       />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">{dept.active} / {dept.total} Employees Trained</p>
                 </div>
               ))}
            </div>
            <div className="card-footer bg-gray-50">
               <button className="w-full py-2 text-xs font-bold text-primary hover:underline uppercase tracking-widest flex items-center justify-center gap-2">
                 <Download size={14} /> Full Department Report
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Training Timeline Table */}
        <div className="lg:col-span-8">
           <div className="card border-t-4 border-success">
              <div className="card-header flex items-center justify-between bg-white">
                 <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
                   <Clock size={18} className="text-success"/> Training History Log
                 </h3>
                 <div className="card-tools flex gap-2">
                    <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search EmpNo or Course..." 
                          className="pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-success w-48 md:w-64" 
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                    </div>
                 </div>
              </div>
              <div className="card-body p-0 overflow-x-auto">
                 <table className="table table-striped mb-0 min-w-[700px]">
                    <thead className="bg-gray-50">
                       <tr>
                          <th style={{width: '120px'}}>Employee</th>
                          <th>Course</th>
                          <th className="text-center">Date</th>
                          <th style={{width: '150px'}}>Progress</th>
                          <th className="text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody>
                       {filteredHistory.map(rec => (
                         <tr key={rec.id} className="hover:bg-green-50/30 transition-colors">
                            <td className="align-middle">
                               <div className="flex items-center gap-2">
                                  <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center text-success font-bold text-[10px] shadow-inner border border-success/20">
                                    <User size={16}/>
                                  </div>
                                  <div>
                                     <div className="font-bold text-gray-800 text-xs">{rec.empNo}</div>
                                     <div className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Authorized</div>
                                  </div>
                               </div>
                            </td>
                            <td>
                               <div className="text-xs font-bold text-gray-700 leading-snug">{rec.courseName}</div>
                               <div className="flex items-center gap-1 text-[9px] text-gray-400 uppercase font-bold mt-0.5">
                                  <MapPin size={8} className="text-gray-300"/> {rec.place} • <span className="text-success">{rec.course}</span>
                               </div>
                            </td>
                            <td className="text-center align-middle">
                               <span className="text-[11px] font-bold text-gray-500">{rec.date}</span>
                            </td>
                            <td className="align-middle">
                               <div className="flex items-center gap-3">
                                  <div className="w-20 bg-gray-200 rounded-full h-1.5 shadow-inner overflow-hidden">
                                     <div 
                                       className={`${rec.progress === 100 ? 'bg-success' : rec.progress > 50 ? 'bg-warning' : 'bg-danger'} h-1.5 rounded-full transition-all duration-500`} 
                                       style={{ width: `${rec.progress}%` }}
                                     />
                                  </div>
                                  <span className={`text-[10px] font-black ${rec.progress === 100 ? 'text-success' : 'text-gray-500'}`}>{rec.progress}%</span>
                               </div>
                            </td>
                            <td className="text-right align-middle">
                               <div className="flex justify-end gap-1 px-2">
                                  <button className="p-1.5 bg-info text-white rounded shadow-sm hover:bg-cyan-600 transition-all active:scale-95" title="View Details">
                                    <FileText size={12}/>
                                  </button>
                                  <button className="p-1.5 bg-gray-500 text-white rounded shadow-sm hover:bg-gray-700 transition-all active:scale-95" title="Certificate">
                                    <Award size={12}/>
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))}
                       {filteredHistory.length === 0 && (
                         <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                               No matching training records found.
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LMSModule;
