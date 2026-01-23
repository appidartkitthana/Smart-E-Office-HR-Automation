
import React, { useState } from 'react';
import { FORM_CATALOG } from '../constants';
import { DocumentRequest, Language } from '../types';
import { 
  Files, Search, Filter, Plus, FileText, ChevronRight, 
  Clock, CheckCircle, X, Download, Info, LayoutGrid, 
  List, MoreHorizontal, ArrowUpRight, BadgeCheck, AlertCircle
} from 'lucide-react';

// Add DocumentRequestModuleProps to handle incoming translation props
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

  const categories = ['ทั้งหมด', ...Array.from(new Set(FORM_CATALOG.map(f => f.category)))];

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
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">ระบบร้องขอเอกสาร (Document Requests)</h1>
          <p className="text-slate-500 font-medium">ยื่นคำร้องและติดตามสถานะเอกสารดำเนินการฝ่ายบุคคล</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-sky-100 flex shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-sky-500'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-sky-500'}`}
                >
                  <List size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit shadow-sm">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'catalog' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          <Files size={18} /> แบบฟอร์มที่มีให้
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' : 'text-slate-500 hover:bg-sky-50'}`}
        >
          <Clock size={18} /> ติดตามสถานะคำร้อง
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหารหัส F-HR หรือชื่อเอกสาร..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-sky-100 rounded-2xl outline-none shadow-sm focus:ring-4 focus:ring-sky-500/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
           {categories.map(cat => (
             <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-100' : 'bg-white text-slate-500 border-slate-100 hover:border-sky-200 hover:bg-sky-50/50'}`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'catalog' ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredCatalog.map(form => (
               <div key={form.code} className="bg-white p-6 rounded-[2.5rem] border border-sky-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group relative flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                       <div className="p-4 bg-sky-50 text-sky-500 rounded-2xl group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                          <FileText size={24} />
                       </div>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{form.category}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-relaxed mb-1 min-h-[2.5rem] line-clamp-2">{form.name}</h3>
                    <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-6">{form.code}</p>
                  </div>
                  <button 
                    onClick={() => handleRequest(form)}
                    className="w-full py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-xs hover:bg-sky-500 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Plus size={14} className="group-hover/btn:rotate-90 transition-transform" /> เริ่มยื่นคำร้อง
                  </button>
               </div>
             ))}
          </div>
        ) : (
          /* Catalog Table View */
          <div className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
             <table className="w-full text-left">
                <thead>
                  <tr className="bg-sky-50/50">
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">รหัสแบบฟอร์ม</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อเอกสาร / รายการคำร้อง</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">หมวดหมู่</th>
                     <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredCatalog.map(form => (
                     <tr key={form.code} className="hover:bg-sky-50/40 transition-colors group">
                        <td className="px-8 py-6">
                           <span className="text-xs font-black text-sky-500 bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-all">
                              {form.code}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-slate-700 group-hover:text-sky-600 transition-colors">{form.name}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                              {form.category}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                             onClick={() => handleRequest(form)}
                             className="p-3 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-2xl transition-all shadow-sm"
                           >
                              <ArrowUpRight size={18} />
                           </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )
      ) : (
        /* History Table View - Enhanced */
        <div className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">เลขที่อ้างอิง</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ชื่อเอกสาร</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">วันที่ร้องขอ</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">สถานะปัจจุบัน</th>
                   <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {history.map(req => (
                   <tr key={req.id} className="hover:bg-sky-50/40 transition-colors group">
                      <td className="px-8 py-6">
                         <span className="text-xs font-black text-slate-400">#{req.id}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-sky-50 text-sky-400 rounded-xl group-hover:bg-white transition-colors">
                               <FileText size={18} />
                            </div>
                            <div>
                               <span className="text-sm font-bold text-slate-700 block mb-0.5">{req.formName}</span>
                               <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{req.formCode}</span>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-sm text-slate-500 font-medium">{req.date}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${
                           req.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                           req.status === 'Approved' ? 'bg-sky-50 text-sky-600' :
                           req.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                         }`}>
                           {req.status === 'Completed' ? <BadgeCheck size={14} /> : 
                            req.status === 'Pending' ? <Clock size={14} className="animate-spin-slow" /> : 
                            req.status === 'Approved' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                           <span className="text-[10px] font-black uppercase tracking-wider">
                             {req.status === 'Completed' ? 'เสร็จสิ้น' : 
                              req.status === 'Pending' ? 'รอดำเนินการ' : 
                              req.status === 'Approved' ? 'อนุมัติแล้ว' : 'ปฏิเสธ'}
                           </span>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {req.status === 'Completed' ? (
                               <button className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all" title="ดาวน์โหลดไฟล์">
                                  <Download size={18} />
                               </button>
                            ) : null}
                            <button className="p-2.5 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                               <MoreHorizontal size={18} />
                            </button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
           {history.length === 0 && (
             <div className="py-20 text-center flex flex-col items-center justify-center grayscale opacity-50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                   <Clock size={32} />
                </div>
                <p className="text-sm font-bold text-slate-400">ยังไม่มีประวัติการยื่นคำร้อง</p>
             </div>
           )}
        </div>
      )}

      {/* Request Modal */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowModal(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-16 h-16 bg-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100 rotate-3">
                    <Files size={32} />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-black text-slate-800 truncate">ยื่นคำร้องเอกสาร</h3>
                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{selectedForm.code}</p>
                 </div>
              </div>

              <form onSubmit={submitRequest} className="space-y-6">
                 <div className="p-6 bg-sky-50/50 rounded-3xl border border-sky-100 mb-6">
                    <p className="text-xs font-bold text-sky-700 leading-relaxed text-center italic">
                       "ท่านกำลังดำเนินการยื่นคำร้องสำหรับ <span className="underline font-black">{selectedForm.name}</span> โปรดระบุข้อมูลความต้องการของท่านด้านล่าง"
                    </p>
                 </div>

                 <div className="space-y-4">
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">พนักงานผู้ร้องขอ (Auto-filled)</label>
                       <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-sky-200 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-sky-600">SR</div>
                          <span className="text-sm font-bold text-slate-400 tracking-tight">คุณสมชาย รักดี (IT-001)</span>
                       </div>
                    </div>
                    <div>
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วัตถุประสงค์ในการร้องขอ / หมายเหตุ</label>
                       <textarea 
                        required
                        className="w-full p-5 bg-white border border-sky-100 rounded-3xl text-sm h-32 resize-none outline-none focus:ring-4 focus:ring-sky-500/5 shadow-inner transition-all"
                        placeholder="เช่น ขอเพื่อนำไปใช้ยื่นกู้ธนาคาร หรือ ติดต่อหน่วยงานราชการ..."
                       />
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-400 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase text-[10px] tracking-[0.2em]">ยกเลิก</button>
                    <button type="submit" className="flex-[2] py-4 bg-sky-500 text-white font-black rounded-3xl shadow-2xl shadow-sky-200 hover:bg-sky-600 transition-all text-base tracking-tight">ยืนยันการส่งคำร้อง</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DocumentRequestModule;
