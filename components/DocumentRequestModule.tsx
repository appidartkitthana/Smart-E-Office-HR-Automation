
import React, { useState } from 'react';
import { FORM_CATALOG } from '../constants';
import { DocumentRequest, Language } from '../types';
import { 
  Files, Search, Filter, Plus, FileText, ChevronRight, 
  Clock, CheckCircle, X, Download, Info, LayoutGrid, 
  List, MoreHorizontal, ArrowUpRight, BadgeCheck, AlertCircle, FilePlus, Printer, Eye
} from 'lucide-react';

interface DocumentRequestModuleProps {
  lang: Language;
  t: any;
}

const DocumentRequestModule: React.FC<DocumentRequestModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [showModal, setShowModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  
  const [history, setHistory] = useState<DocumentRequest[]>([
    { id: 'DR-001', formCode: 'F-HR-020', formName: 'หนังสือรับรองเงินเดือน Salary certificate', requester: 'คุณสมชาย รักดี', date: '2024-05-15', status: 'Completed' },
    { id: 'DR-002', formCode: 'F-HR-011', formName: 'ใบลืมบันทึกเวลา Request for not a finger scan', requester: 'คุณสมชาย รักดี', date: '2024-05-18', status: 'Pending' },
    { id: 'DR-003', formCode: 'F-HR-057', formName: 'แบบฟอร์มการเบิกสวัสดิการค่ารักษาพยาบาล', requester: 'คุณสมชาย รักดี', date: '2024-05-20', status: 'Approved' },
  ]);

  const categories: string[] = ['ทั้งหมด', ...Array.from(new Set(FORM_CATALOG.map(f => f.category)))];

  const filteredCatalog = FORM_CATALOG.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ทั้งหมด' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRequest = (form: any) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: DocumentRequest = {
      id: `DR-${String(history.length + 1).padStart(3, '0')}`,
      formCode: selectedForm.code,
      formName: selectedForm.name,
      requester: 'คุณสมชาย รักดี',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setHistory([newReq, ...history]);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Search and Navigation Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
        <div className="flex gap-1 bg-white p-1 rounded border shadow-sm">
           <button 
             onClick={() => setActiveTab('catalog')} 
             className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'catalog' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             {lang === 'TH' ? 'แบบฟอร์ม' : lang === 'JP' ? 'フォーム' : 'Forms'}
           </button>
           <button 
             onClick={() => setActiveTab('history')} 
             className={`px-4 py-1.5 text-xs font-bold rounded ${activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
           >
             {lang === 'TH' ? 'ประวัติคำร้อง' : lang === 'JP' ? '履歴' : 'History'}
           </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search forms..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-primary"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
           </div>
           <select 
             value={activeCategory} 
             onChange={e => setActiveCategory(e.target.value)}
             className="px-3 py-1.5 text-xs border rounded bg-white font-bold text-gray-600 outline-none"
           >
             {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
           </select>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <div className="card border-t-4 border-info">
          <div className="card-header flex items-center justify-between">
             <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
                <Files size={18} className="text-info" /> Form Catalog
             </h3>
             <div className="card-tools flex gap-1">
                <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}><LayoutGrid size={16}/></button>
                <button onClick={() => setViewMode('table')} className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-gray-100' : ''}`}><List size={16}/></button>
             </div>
          </div>
          <div className="card-body p-0">
            {viewMode === 'table' ? (
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{width: '120px'}}>Form Code</th>
                    <th>Document Description</th>
                    <th>Category</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCatalog.map(form => (
                    <tr key={form.code}>
                      <td className="font-bold text-info">{form.code}</td>
                      <td className="text-gray-700">{form.name}</td>
                      <td><span className={`badge ${form.category === 'HR' ? 'bg-danger' : 'bg-gray-500'}`}>{form.category}</span></td>
                      <td className="text-right">
                        <button onClick={() => handleRequest(form)} className="btn btn-sm bg-primary text-white px-3 py-1 rounded text-[10px] font-bold uppercase hover:bg-blue-600">
                           <FilePlus size={10} className="inline mr-1" /> Request
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                 {filteredCatalog.map(form => (
                   <div key={form.code} className="border border-gray-200 rounded p-3 bg-white flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold text-info uppercase tracking-widest">{form.code}</span>
                          <span className="badge bg-gray-100 text-gray-400 text-[9px]">{form.category}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 line-clamp-2 mb-4">{form.name}</h4>
                      </div>
                      <button onClick={() => handleRequest(form)} className="w-full bg-info text-white py-1.5 rounded text-[10px] font-bold hover:bg-cyan-600">
                        OPEN FORM
                      </button>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card border-t-4 border-success">
           <div className="card-header">
              <h3 className="text-lg font-normal text-gray-800">My Requests History</h3>
           </div>
           <div className="card-body p-0">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{width: '100px'}}>Req ID</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(req => (
                    <tr key={req.id}>
                      <td className="font-bold text-gray-400">#{req.id}</td>
                      <td>
                         <div className="text-sm font-bold text-gray-700">{req.formName}</div>
                         <div className="text-[10px] text-gray-400 uppercase">{req.formCode}</div>
                      </td>
                      <td className="text-gray-500">{req.date}</td>
                      <td>
                         <span className={`badge ${
                           req.status === 'Completed' ? 'bg-success' : 
                           req.status === 'Pending' ? 'bg-warning' : 'bg-primary'
                         }`}>
                           {req.status}
                         </span>
                      </td>
                      <td className="text-right">
                         <div className="flex justify-end gap-1">
                            <button className="p-1.5 bg-info text-white rounded text-[10px] hover:bg-cyan-600"><Eye size={12}/></button>
                            {req.status === 'Completed' && <button className="p-1.5 bg-gray-600 text-white rounded text-[10px] hover:bg-black"><Printer size={12}/></button>}
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* AdminLTE Styled Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded shadow-2xl overflow-hidden border border-gray-300">
             <div className="bg-primary px-4 py-3 flex items-center justify-between text-white">
                <h3 className="text-md font-bold flex items-center gap-2">
                   <FileText size={18}/> New Request: {selectedForm.code}
                </h3>
                <button onClick={() => setShowModal(false)} className="hover:text-gray-200"><X size={20} /></button>
             </div>
             <form onSubmit={submitRequest} className="p-5">
                <div className="mb-4">
                   <label className="text-xs font-bold text-gray-600 mb-1 block">Subject / Description</label>
                   <input type="text" readOnly value={selectedForm.name} className="w-full p-2 text-sm bg-gray-50 border rounded text-gray-500 font-bold" />
                </div>
                <div className="mb-4">
                   <label className="text-xs font-bold text-gray-600 mb-1 block">Request Details / Justification</label>
                   <textarea required className="w-full p-2 text-sm border rounded h-32 outline-none focus:border-primary" placeholder="Enter reason for request..." />
                </div>
                <div className="flex justify-end gap-2 border-t pt-4">
                   <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-bold bg-gray-100 text-gray-600 rounded hover:bg-gray-200">CANCEL</button>
                   <button type="submit" className="px-6 py-2 text-xs font-bold bg-primary text-white rounded hover:bg-blue-600 shadow-sm">SUBMIT REQUEST</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRequestModule;
