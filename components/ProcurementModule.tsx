
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MOCK_PR, MOCK_PO, MOCK_CAPEX, DEPARTMENTS } from '../constants';
import { PurchaseRequisition, PurchaseOrder, CAPEXProject, ProcurementType, ProcurementItem, Language, Signature } from '../types';
import { 
  ShoppingCart, Plus, Edit2, Trash2, Search, Filter, FileText, CheckCircle, 
  Clock, X, DollarSign, Briefcase, Truck, BarChart3, 
  Printer, Upload, Paperclip, PenTool, Check, ShieldCheck, 
  FileCheck, AlertCircle, RotateCcw, Save, ChevronDown, File, ExternalLink
} from 'lucide-react';

interface ProcurementModuleProps {
  lang: Language;
  t: any;
}

// --- Signature Canvas Component ---
const SignatureModal: React.FC<{ 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (dataUrl: string) => void 
}> = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => setIsDrawing(false);

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const save = () => {
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">ลงลายมือชื่อดิจิทัล</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full"><X size={20}/></button>
        </div>
        <div className="bg-slate-50 border-2 border-dashed border-sky-100 rounded-3xl overflow-hidden touch-none">
          <canvas 
            ref={canvasRef}
            width={400}
            height={200}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-[200px] cursor-crosshair"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button onClick={clear} className="py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"><RotateCcw size={18}/> ล้างใหม่</button>
          <button onClick={save} className="py-4 bg-sky-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-600 shadow-lg shadow-sky-100 transition-all"><Save size={18}/> บันทึก</button>
        </div>
      </div>
    </div>
  );
};

// --- Signature Pad Component ---
const SignaturePad: React.FC<{ 
  label: string, 
  signature: Signature, 
  onSign: (dataUrl: string) => void,
  canSign: boolean 
}> = ({ label, signature, onSign, canSign }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => onSign(re.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`flex flex-col items-center p-5 border-2 rounded-[2rem] transition-all ${canSign ? 'border-sky-200 bg-sky-50/30 ring-4 ring-sky-500/5' : 'border-slate-100 bg-slate-50/20 opacity-80'}`}>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</p>
      
      {signature.status === 'Approved' ? (
        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <div className="w-28 h-14 bg-white rounded-xl shadow-sm border border-emerald-100 flex items-center justify-center p-1 mb-2">
            {signature.dataUrl ? (
              <img src={signature.dataUrl} className="max-h-full max-w-full grayscale brightness-50" alt="sign" />
            ) : (
              <CheckCircle className="text-emerald-500" size={24} />
            )}
          </div>
          <p className="text-[10px] font-black text-emerald-600 uppercase text-center">{signature.signerName}</p>
          <p className="text-[8px] text-slate-400">{signature.signedDate}</p>
        </div>
      ) : signature.status === 'Rejected' ? (
        <div className="flex flex-col items-center">
           <X className="text-rose-500 mb-2" size={24} />
           <p className="text-[10px] font-black text-rose-600 uppercase">Rejected</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {canSign ? (
            <>
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full px-4 py-2.5 bg-white text-sky-600 border border-sky-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <PenTool size={14}/> เซ็นชื่อ
              </button>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Upload size={14}/> อัปโหลด
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
              <SignatureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onSign} />
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <Clock className="text-slate-200 mb-2" size={24} />
              <p className="text-[9px] font-bold text-slate-300 italic uppercase">รอการอนุมัติก่อนหน้า</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'pr' | 'po' | 'capex'>('stats');
  const [prs, setPrs] = useState<PurchaseRequisition[]>(MOCK_PR.map(pr => ({
    ...pr,
    attachments: pr.attachments || [],
    requesterSign: pr.requesterSign || { status: 'Approved', signerName: pr.requester, signedDate: pr.date },
    supervisorSign: pr.supervisorSign || { status: 'Pending', signerName: '', signedDate: '' },
    purchasingSign: pr.purchasingSign || { status: 'Pending', signerName: '', signedDate: '' },
    mdSign: pr.mdSign || { status: 'Pending', signerName: '', signedDate: '' }
  })));
  const [pos, setPos] = useState<PurchaseOrder[]>(MOCK_PO.map(po => ({
    ...po,
    purchasingSign: po.purchasingSign || { status: 'Pending', signerName: '', signedDate: '' },
    supervisorSign: po.supervisorSign || { status: 'Pending', signerName: '', signedDate: '' },
    mdSign: po.mdSign || { status: 'Pending', signerName: '', signedDate: '' }
  })));
  const [capexProjects, setCapexProjects] = useState<CAPEXProject[]>(MOCK_CAPEX);
  
  const [showPrModal, setShowPrModal] = useState(false);
  const [currentPr, setCurrentPr] = useState<Partial<PurchaseRequisition> | null>(null);
  
  const [showPoModal, setShowPoModal] = useState(false);
  const [currentPo, setCurrentPo] = useState<Partial<PurchaseOrder> | null>(null);

  const [showPrintPr, setShowPrintPr] = useState(false);
  const [showPrintPo, setShowPrintPo] = useState(false);
  const [printData, setPrintData] = useState<any>(null);

  const [poVendorFilter, setPoVendorFilter] = useState('');

  const uniqueVendors = useMemo(() => {
    return Array.from(new Set(pos.map(o => o.vendorName).filter(Boolean)));
  }, [pos]);

  const filteredPos = pos.filter(o => {
    if (!poVendorFilter) return true;
    return o.vendorName === poVendorFilter;
  });

  const handleOpenPrModal = (pr?: PurchaseRequisition) => {
    setCurrentPr(pr || { 
      id: `PR-${new Date().getFullYear()}-${String(prs.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      department: 'IT',
      type: 'OPEX',
      justification: '',
      items: [],
      requester: 'คุณสมชาย รักดี',
      totalAmount: 0,
      status: 'Draft',
      attachments: [],
      requesterSign: { status: 'Approved', signerName: 'คุณสมชาย รักดี', signedDate: new Date().toISOString().split('T')[0] },
      supervisorSign: { status: 'Pending', signerName: '', signedDate: '' },
      purchasingSign: { status: 'Pending', signerName: '', signedDate: '' },
      mdSign: { status: 'Pending', signerName: '', signedDate: '' },
    });
    setShowPrModal(true);
  };

  const handleOpenPoModal = (po?: PurchaseOrder) => {
    setCurrentPo(po || {
      id: `PO-${new Date().getFullYear()}-${String(pos.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      vendorName: '',
      vendorAddress: '',
      items: [],
      totalAmount: 0,
      status: 'Pending Purchasing',
      purchasingSign: { status: 'Pending', signerName: '', signedDate: '' },
      supervisorSign: { status: 'Pending', signerName: '', signedDate: '' },
      mdSign: { status: 'Pending', signerName: '', signedDate: '' }
    });
    setShowPoModal(true);
  };

  const handleSavePr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPr) return;
    const exists = prs.find(p => p.id === currentPr.id);
    if (exists) {
      setPrs(prs.map(p => p.id === currentPr.id ? (currentPr as PurchaseRequisition) : p));
    } else {
      setPrs([currentPr as PurchaseRequisition, ...prs]);
    }
    setShowPrModal(false);
  };

  const handleSavePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPo) return;
    const exists = pos.find(p => p.id === currentPo.id);
    if (exists) {
      setPos(pos.map(p => p.id === currentPo.id ? (currentPo as PurchaseOrder) : p));
    } else {
      setPos([currentPo as PurchaseOrder, ...pos]);
    }
    setShowPoModal(false);
  };

  const updateCapexStatus = (id: string, newStatus: CAPEXProject['status']) => {
    setCapexProjects(capexProjects.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const handleSignPr = (role: 'supervisor' | 'purchasing' | 'md', dataUrl: string) => {
    if (!currentPr) return;
    const now = new Date().toISOString().split('T')[0];
    const updated = { ...currentPr };
    
    if (role === 'supervisor') {
      updated.supervisorSign = { status: 'Approved', signerName: 'Manager', signedDate: now, dataUrl };
      updated.status = 'Pending Purchasing';
    } else if (role === 'purchasing') {
      updated.purchasingSign = { status: 'Approved', signerName: 'Purchasing', signedDate: now, dataUrl };
      updated.status = 'Pending MD';
    } else if (role === 'md') {
      updated.mdSign = { status: 'Approved', signerName: 'MD', signedDate: now, dataUrl };
      updated.status = 'Approved';
    }
    setCurrentPr(updated);
  };

  const handleSignPo = (role: 'purchasing' | 'supervisor' | 'md', dataUrl: string) => {
    if (!currentPo) return;
    const now = new Date().toISOString().split('T')[0];
    const updated = { ...currentPo };
    
    if (role === 'purchasing') {
      updated.purchasingSign = { status: 'Approved', signerName: 'Purchasing Team', signedDate: now, dataUrl };
      updated.status = 'Pending Supervisor';
    } else if (role === 'supervisor') {
      updated.supervisorSign = { status: 'Approved', signerName: 'Manager', signedDate: now, dataUrl };
      updated.status = 'Pending MD';
    } else if (role === 'md') {
      updated.mdSign = { status: 'Approved', signerName: 'MD', signedDate: now, dataUrl };
      updated.status = 'Approved';
    }
    setCurrentPo(updated);
  };

  const handleCreatePoFromPr = (pr: PurchaseRequisition) => {
    if (pr.status !== 'Approved') {
        alert('PR ต้องได้รับการอนุมัติสมบูรณ์ก่อนจึงจะออก PO ได้');
        return;
    }
    const newPo: PurchaseOrder = {
      id: `PO-${new Date().getFullYear()}-${String(pos.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      prRef: pr.id,
      vendorName: pr.suggestedVendor || '',
      vendorAddress: '',
      items: pr.items,
      totalAmount: pr.totalAmount,
      status: 'Pending Purchasing',
      purchasingSign: { status: 'Pending', signerName: '', signedDate: '' },
      supervisorSign: { status: 'Pending', signerName: '', signedDate: '' },
      mdSign: { status: 'Pending', signerName: '', signedDate: '' }
    };
    handleOpenPoModal(newPo);
  };

  const updateItem = (currentDoc: any, setDoc: any, id: string, field: keyof ProcurementItem, value: any) => {
    const items = (currentDoc.items || []).map((item: any) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
        return updated;
      }
      return item;
    });
    const total = items.reduce((acc: number, curr: any) => acc + curr.total, 0);
    setDoc({ ...currentDoc, items, totalAmount: total });
  };

  const addAttachment = (fileName: string) => {
    if (!currentPr) return;
    const current = currentPr.attachments || [];
    setCurrentPr({ ...currentPr, attachments: [...current, fileName] });
  };

  const removeAttachment = (fileName: string) => {
    if (!currentPr) return;
    const current = currentPr.attachments || [];
    setCurrentPr({ ...currentPr, attachments: current.filter(f => f !== fileName) });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[3rem] border border-sky-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-sky-50/50"><ShoppingCart size={140}/></div>
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">ระบบจัดซื้อ (Procurement)</h1>
          <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.2em]">Purchase Requisition & Sequential Approval Workflow</p>
        </div>
        <div className="flex items-center gap-3 relative">
           <button onClick={() => handleOpenPrModal()} className="bg-sky-500 text-white px-10 py-5 rounded-[2.5rem] font-black shadow-2xl shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-3">
             <Plus size={22} />
             <span>เปิดใบขอซื้อ (PR)</span>
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-2 rounded-[2.5rem] border border-sky-100 w-fit shadow-sm overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setActiveTab('stats')} className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'stats' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}><BarChart3 size={18} /> ภาพรวม</button>
        <button onClick={() => setActiveTab('pr')} className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'pr' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}><FileText size={18} /> รายการ PR</button>
        <button onClick={() => setActiveTab('po')} className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'po' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}><Truck size={18} /> รายการ PO</button>
        <button onClick={() => setActiveTab('capex')} className={`px-8 py-4 rounded-[2rem] text-sm font-black transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'capex' ? 'bg-sky-500 text-white shadow-lg' : 'text-slate-500 hover:bg-sky-50'}`}><Briefcase size={18} /> งบลงทุน CAPEX</button>
      </div>

      {/* View Content Logic */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-8 rounded-[2.5rem] border border-sky-100 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-sky-50/20 group-hover:scale-110 transition-transform"><FileText size={100} /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PR ทั้งหมด</p>
              <h3 className="text-4xl font-black text-slate-800">{prs.length} รายการ</h3>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-amber-100 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-amber-50 group-hover:scale-110 transition-transform"><Clock size={100} /></div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">PO รอดำเนินการ</p>
              <h3 className="text-4xl font-black text-amber-600">{pos.filter(o => o.status !== 'Closed').length} รายการ</h3>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-indigo-50 group-hover:scale-110 transition-transform"><Briefcase size={100} /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CAPEX Projects</p>
              <h3 className="text-4xl font-black text-indigo-600">{capexProjects.length} โครงการ</h3>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-100 shadow-sm relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-emerald-50 group-hover:scale-110 transition-transform"><CheckCircle size={100} /></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">อนุมัติแล้วเดือนนี้</p>
              <h3 className="text-4xl font-black text-emerald-600">฿ {(pos.reduce((a,b)=>a+b.totalAmount,0)/1000).toFixed(1)}k</h3>
           </div>
        </div>
      )}

      {activeTab === 'pr' && (
        <div className="bg-white rounded-[3.5rem] border border-sky-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-sky-50/50">
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PR Details</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Flow Status</th>
                  <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {prs.map(p => (
                  <tr key={p.id} className="hover:bg-sky-50/20 transition-colors group">
                    <td className="px-10 py-8">
                      <p className="font-black text-slate-700">{p.id}</p>
                      <p className="text-[10px] text-sky-500 font-bold uppercase">{p.date}</p>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-sm font-black text-slate-700">{p.requester}</p>
                       <p className="text-[10px] text-slate-400 font-bold uppercase">{p.department}</p>
                    </td>
                    <td className="px-10 py-8 font-black text-slate-800">฿ {p.totalAmount.toLocaleString()}</td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 rounded-full ${p.mdSign.status === 'Approved' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{p.status}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-3">
                          {p.status === 'Approved' && (
                             <button onClick={() => handleCreatePoFromPr(p)} className="p-4 bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-3xl transition-all shadow-sm active:scale-90" title="ออกใบสั่งซื้อ PO">
                                <FileCheck size={20} />
                             </button>
                          )}
                          <button onClick={() => { setPrintData(p); setShowPrintPr(true); }} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-3xl transition-all shadow-sm">
                             <Printer size={20} />
                          </button>
                          <button onClick={() => handleOpenPrModal(p)} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-3xl transition-all"><Edit2 size={20} /></button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'po' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="bg-white p-6 rounded-[2.5rem] border border-sky-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                 <div className="p-3 bg-sky-50 text-sky-500 rounded-xl"><Filter size={20}/></div>
                 <select 
                    className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer"
                    value={poVendorFilter}
                    onChange={e => setPoVendorFilter(e.target.value)}
                 >
                    <option value="">กรองตามผู้ขาย (All Vendors)</option>
                    {uniqueVendors.map(v => <option key={v} value={v}>{v}</option>)}
                 </select>
              </div>
              {poVendorFilter && (
                <button onClick={() => setPoVendorFilter('')} className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1 hover:underline"><X size={14}/> Clear Filter</button>
              )}
           </div>

           <div className="bg-white rounded-[3.5rem] border border-sky-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                  <thead>
                    <tr className="bg-sky-50/50">
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PO NO / REF PR</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Vendor Name</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Amount</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workflow status</th>
                      <th className="px-10 py-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPos.map(o => (
                      <tr key={o.id} className="hover:bg-sky-50/20 transition-colors group">
                        <td className="px-10 py-8">
                           <p className="font-black text-slate-700">{o.id}</p>
                           <p className="text-[10px] text-sky-500 font-bold uppercase">REF PR: {o.prRef}</p>
                        </td>
                        <td className="px-10 py-8">
                           <p className="text-sm font-black text-slate-700">{o.vendorName || 'N/A'}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{o.date}</p>
                        </td>
                        <td className="px-10 py-8 font-black text-slate-800">฿ {o.totalAmount.toLocaleString()}</td>
                        <td className="px-10 py-8">
                           <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${o.status === 'Approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>{o.status}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setPrintData(o); setShowPrintPo(true); }} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-3xl transition-all"><Printer size={20} /></button>
                              <button onClick={() => handleOpenPoModal(o)} className="p-4 bg-slate-50 text-slate-400 hover:bg-sky-500 hover:text-white rounded-3xl transition-all"><Edit2 size={20} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'capex' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           {capexProjects.map(project => (
              <div key={project.id} className="bg-white rounded-[2.5rem] border border-sky-100 shadow-sm overflow-hidden flex flex-col group hover:border-indigo-300 transition-all">
                 <div className="p-8 space-y-6 flex-1">
                    <div className="flex justify-between items-start">
                       <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-all"><Briefcase size={24}/></div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{project.id}</p>
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                             project.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                             project.status === 'Reviewed' ? 'bg-amber-100 text-amber-600' :
                             project.status === 'Implemented' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                          }`}>{project.status}</span>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">{project.name}</h3>
                       <p className="text-sm text-slate-500 font-medium line-clamp-2">{project.strategicReason}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                          <p className="text-lg font-black text-slate-800 tracking-tight">฿ {(project.totalValue/1000000).toFixed(1)}M</p>
                       </div>
                       <div className="bg-slate-50 p-4 rounded-2xl border border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target ROI</p>
                          <p className="text-lg font-black text-indigo-600 tracking-tight">{project.roi}</p>
                       </div>
                    </div>
                 </div>
                 <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update status:</p>
                    <div className="flex gap-2">
                       {['Proposed', 'Reviewed', 'Approved', 'Implemented'].map(s => (
                          <button 
                            key={s} 
                            onClick={() => updateCapexStatus(project.id, s as any)}
                            title={s}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${project.status === s ? 'bg-indigo-500 border-indigo-200' : 'bg-white border-slate-100'}`}
                          />
                       ))}
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* PR Modal with Attachments */}
      {showPrModal && currentPr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[4rem] shadow-2xl p-16 relative scrollbar-hide">
              <button onClick={() => setShowPrModal(false)} className="absolute right-12 top-12 p-3 text-slate-400 hover:bg-slate-50 rounded-full transition-colors active:scale-90"><X size={32} /></button>
              
              <div className="flex flex-col md:flex-row items-center gap-8 mb-16 border-b border-slate-100 pb-12">
                 <div className="w-24 h-24 bg-sky-500 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-sky-200 transform rotate-3">
                    <PenTool size={48} />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase mb-1">ใบขอซื้อ (PR)</h3>
                    <p className="text-sky-500 font-black uppercase text-[12px] tracking-[0.3em]">Sequential Digital Signature Workflow & Multi-Attachment</p>
                 </div>
              </div>

              {/* Sequential Signature Flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                 <SignaturePad label="1. Requester" signature={currentPr.requesterSign!} onSign={(url) => setCurrentPr({...currentPr, requesterSign: { ...currentPr.requesterSign!, status: 'Approved', dataUrl: url, signedDate: new Date().toISOString().split('T')[0] }})} canSign={!currentPr.id} />
                 <SignaturePad label="2. Supervisor" signature={currentPr.supervisorSign!} onSign={(url) => handleSignPr('supervisor', url)} canSign={currentPr.status === 'Draft' || currentPr.status === 'Pending Supervisor'} />
                 <SignaturePad label="3. Purchasing" signature={currentPr.purchasingSign!} onSign={(url) => handleSignPr('purchasing', url)} canSign={currentPr.status === 'Pending Purchasing'} />
                 <SignaturePad label="4. MD Approval" signature={currentPr.mdSign!} onSign={(url) => handleSignPr('md', url)} canSign={currentPr.status === 'Pending MD'} />
              </div>

              <form onSubmit={handleSavePr} className="space-y-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                     <div className="lg:col-span-2 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">PR No.</label>
                              <input type="text" disabled className="w-full p-5 bg-slate-100 border border-slate-100 rounded-[2rem] text-sm font-black text-slate-400" value={currentPr.id || ''} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">วันที่ (Date)</label>
                              <input type="date" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black outline-none" value={currentPr.date || ''} onChange={e => setCurrentPr({...currentPr, date: e.target.value})} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">ผู้ขาย (Suggested Vendor)</label>
                              <input type="text" placeholder="ระบุชื่อบริษัทผู้ขาย..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black outline-none" value={currentPr.suggestedVendor || ''} onChange={e => setCurrentPr({...currentPr, suggestedVendor: e.target.value})} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">แผนก (Department)</label>
                              <select className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-black outline-none" value={currentPr.department || 'IT'} onChange={e => setCurrentPr({...currentPr, department: e.target.value})}>
                                 {DEPARTMENTS.filter(d => d !== 'ทั้งหมด').map(d => <option key={d} value={d}>{d}</option>)}
                              </select>
                           </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">วัตถุประสงค์ (Justification)</label>
                            <textarea className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[3rem] text-sm font-bold h-32 resize-none outline-none focus:ring-4 focus:ring-sky-500/5 transition-all shadow-inner" placeholder="ระบุเหตุผลความจำเป็นในการจัดซื้อ..." value={currentPr.justification || ''} onChange={e => setCurrentPr({...currentPr, justification: e.target.value})} />
                        </div>
                     </div>
                     
                     {/* Multi-Attachment Area */}
                     <div className="space-y-6">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1">ไฟล์แนบ (Quotations / Specs)</label>
                        <div className="bg-sky-50/50 p-6 rounded-[3rem] border border-sky-100 shadow-inner space-y-4">
                           <div 
                              onClick={() => addAttachment(`Quotation_${Math.floor(Math.random()*9000)+1000}.pdf`)}
                              className="w-full py-8 border-2 border-dashed border-sky-200 rounded-[2rem] flex flex-col items-center justify-center text-sky-400 hover:bg-sky-100/50 hover:text-sky-600 transition-all cursor-pointer group"
                           >
                              <Paperclip size={32} className="mb-2 group-hover:rotate-12 transition-transform" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Click to add file</span>
                           </div>
                           <div className="space-y-2">
                              {(currentPr.attachments || []).map((file, idx) => (
                                 <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border border-sky-100 group">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-500"><File size={16}/></div>
                                       <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">{file}</span>
                                    </div>
                                    <button type="button" onClick={() => removeAttachment(file)} className="p-2 text-rose-300 hover:text-rose-50 transition-colors"><Trash2 size={14}/></button>
                                 </div>
                              ))}
                              {(!currentPr.attachments || currentPr.attachments.length === 0) && (
                                 <p className="text-[10px] text-slate-300 italic text-center py-4">No attachments uploaded</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Items Grid */}
                  <div className="space-y-8">
                     <div className="flex items-center justify-between px-2">
                        <h4 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3"><RotateCcw size={20} className="text-sky-400"/> รายละเอียดรายการ (Order Specification)</h4>
                        <button type="button" onClick={() => setCurrentPr({...currentPr, items: [...(currentPr.items || []), { id: Math.random().toString(36).substr(2,5), description: '', unit: 'Pcs', quantity: 1, unitPrice: 0, total: 0 }]})} className="px-8 py-3 bg-sky-50 text-sky-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all shadow-sm active:scale-95">+ เพิ่มรายการ</button>
                     </div>
                     <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner">
                        <table className="w-full">
                           <thead>
                              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                 <th className="pb-6 text-left">รายละเอียด</th>
                                 <th className="pb-6 text-center w-24">หน่วย</th>
                                 <th className="pb-6 text-center w-24">จำนวน</th>
                                 <th className="pb-6 text-right w-32">ราคาต่อหน่วย</th>
                                 <th className="pb-6 text-right w-40">รวมสุทธิ</th>
                                 <th className="pb-6 text-right w-16"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {(currentPr.items || []).map(item => (
                                 <tr key={item.id} className="group/row">
                                    <td className="py-6"><input type="text" className="w-full bg-transparent text-sm font-black text-slate-700 outline-none focus:text-sky-600 transition-colors" value={item.description} onChange={e => updateItem(currentPr, setCurrentPr, item.id, 'description', e.target.value)} /></td>
                                    <td className="py-6 text-center"><input type="text" className="w-20 bg-transparent text-sm font-black text-center text-slate-600 outline-none" value={item.unit} onChange={e => updateItem(currentPr, setCurrentPr, item.id, 'unit', e.target.value)} /></td>
                                    <td className="py-6 text-center"><input type="number" className="w-16 bg-transparent text-sm font-black text-center text-slate-800 outline-none" value={item.quantity} onChange={e => updateItem(currentPr, setCurrentPr, item.id, 'quantity', parseInt(e.target.value))} /></td>
                                    <td className="py-6 text-right"><input type="number" className="w-32 bg-transparent text-sm font-black text-right text-slate-800 outline-none" value={item.unitPrice} onChange={e => updateItem(currentPr, setCurrentPr, item.id, 'unitPrice', parseInt(e.target.value))} /></td>
                                    <td className="py-6 text-right font-black text-sky-600 text-lg">฿ {item.total.toLocaleString()}</td>
                                    <td className="py-6 text-right opacity-0 group-hover/row:opacity-100 transition-opacity">
                                       <button type="button" onClick={() => setCurrentPr({...currentPr, items: currentPr.items?.filter(i => i.id !== item.id)})} className="p-2 text-rose-300 hover:text-rose-50 rounded-xl transition-all"><Trash2 size={16}/></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                        <div className="mt-10 pt-10 border-t border-slate-200 text-right flex justify-end">
                           <div className="bg-white px-12 py-8 rounded-[2.5rem] shadow-sm border border-sky-100">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Grand Total Amount</p>
                              <p className="text-5xl font-black text-sky-600 tracking-tighter">฿ {currentPr.totalAmount?.toLocaleString()}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-6 pt-12 border-t border-slate-100">
                      <button type="button" onClick={() => setShowPrModal(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 font-black rounded-[2.5rem] uppercase text-xs tracking-widest hover:bg-slate-100 transition-all active:scale-95">Cancel</button>
                      <button type="submit" className="flex-[2] py-6 bg-sky-500 text-white font-black rounded-[2.5rem] shadow-2xl shadow-sky-100 uppercase text-xs tracking-widest hover:bg-sky-600 transition-all active:scale-95">Save Document</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* PO Edit Modal */}
      {showPoModal && currentPo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[4rem] shadow-2xl p-16 relative scrollbar-hide">
              <button onClick={() => setShowPoModal(false)} className="absolute right-12 top-12 p-3 text-slate-400 hover:bg-slate-50 rounded-full active:scale-90"><X size={32} /></button>
              
              <div className="flex items-center gap-6 mb-12 border-b border-slate-100 pb-10">
                 <div className="w-20 h-20 bg-sky-500 text-white rounded-[2rem] flex items-center justify-center shadow-lg"><Truck size={32} /></div>
                 <div>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase">PO Workflow (Update & Sign)</h3>
                    <p className="text-sky-500 font-black uppercase text-[12px] tracking-[0.3em]">Sequential Signing Workflow (Purchasing -> Manager -> MD)</p>
                 </div>
              </div>

              {/* Sequential Signature Flow for PO */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 <SignaturePad label="1. Issued By (Purchasing)" signature={currentPo.purchasingSign!} onSign={(url) => handleSignPo('purchasing', url)} canSign={currentPo.status === 'Draft' || currentPo.status === 'Pending Purchasing'} />
                 <SignaturePad label="2. Checked By (Manager)" signature={currentPo.supervisorSign!} onSign={(url) => handleSignPo('supervisor', url)} canSign={currentPo.status === 'Pending Supervisor'} />
                 <SignaturePad label="3. Approved By (MD)" signature={currentPo.mdSign!} onSign={(url) => handleSignPo('md', url)} canSign={currentPo.status === 'Pending MD'} />
              </div>

              <form onSubmit={handleSavePo} className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">Vendor Target Information</label>
                       <input type="text" placeholder="Vendor Name..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-black outline-none" value={currentPo.vendorName || ''} onChange={e => setCurrentPo({...currentPo, vendorName: e.target.value})} />
                       <textarea placeholder="Vendor Address..." className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm font-bold h-24 resize-none outline-none" value={currentPo.vendorAddress || ''} onChange={e => setCurrentPo({...currentPo, vendorAddress: e.target.value})} />
                    </div>
                    <div className="space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">PO NO.</label>
                             <input type="text" disabled className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-black text-slate-400" value={currentPo.id || ''} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Date</label>
                             <input type="date" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none" value={currentPo.date || ''} onChange={e => setCurrentPo({...currentPo, date: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Payment Terms</label>
                             <input type="text" placeholder="Credit 30 Days..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black outline-none" value={currentPo.paymentTerms || ''} onChange={e => setCurrentPo({...currentPo, paymentTerms: e.target.value})} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase ml-2">REF PR NO.</label>
                             <input type="text" disabled className="w-full p-4 bg-slate-100 border border-slate-100 rounded-2xl text-sm font-black text-slate-400" value={currentPo.prRef || ''} />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <h4 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Purchase Order Items</h4>
                    <div className="bg-slate-50/50 p-8 rounded-[3rem] border border-slate-100">
                       <table className="w-full">
                          <thead>
                             <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-4 text-left">Description</th>
                                <th className="pb-4 text-center w-24">Unit</th>
                                <th className="pb-4 text-center w-24">Qty</th>
                                <th className="pb-4 text-right w-32">Price</th>
                                <th className="pb-4 text-right w-40">Total</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {(currentPo.items || []).map(item => (
                                <tr key={item.id}>
                                   <td className="py-5"><input type="text" className="w-full bg-transparent text-sm font-black outline-none" value={item.description} onChange={e => updateItem(currentPo, setCurrentPo, item.id, 'description', e.target.value)} /></td>
                                   <td className="py-5 text-center"><input type="text" className="w-20 bg-transparent text-sm font-black text-center outline-none" value={item.unit} onChange={e => updateItem(currentPo, setCurrentPo, item.id, 'unit', e.target.value)} /></td>
                                   <td className="py-5 text-center"><input type="number" className="w-16 bg-transparent text-sm font-black text-center outline-none" value={item.quantity} onChange={e => updateItem(currentPo, setCurrentPo, item.id, 'quantity', parseInt(e.target.value))} /></td>
                                   <td className="py-5 text-right"><input type="number" className="w-32 bg-transparent text-sm font-black text-right outline-none" value={item.unitPrice} onChange={e => updateItem(currentPo, setCurrentPo, item.id, 'unitPrice', parseInt(e.target.value))} /></td>
                                   <td className="py-5 text-right font-black text-slate-800">฿ {item.total.toLocaleString()}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                       <div className="mt-8 pt-8 border-t border-slate-200 text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Grand Total (Baht)</p>
                          <p className="text-4xl font-black text-sky-600 tracking-tighter">฿ {currentPo.totalAmount?.toLocaleString()}</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-6">
                    <button type="button" onClick={() => setShowPoModal(false)} className="flex-1 py-6 bg-slate-100 text-slate-500 font-black rounded-3xl uppercase text-xs active:scale-95 transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] py-6 bg-sky-500 text-white font-black rounded-3xl shadow-xl shadow-sky-100 uppercase text-xs active:scale-95 transition-all">Update PO State</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* PR Print Preview mimicking F-GA-001 */}
      {showPrintPr && printData && (
         <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-in zoom-in-105 duration-300 print:static print:p-0">
            <div className="max-w-[1000px] mx-auto p-12 bg-white min-h-screen shadow-2xl relative print:shadow-none print:p-8">
               <button onClick={() => setShowPrintPr(false)} className="absolute top-10 right-10 p-3 bg-slate-100 rounded-full hover:bg-slate-200 print:hidden transition-all"><X size={24} /></button>
               <button onClick={() => window.print()} className="absolute top-10 right-28 px-6 py-3 bg-sky-500 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-sky-600 print:hidden shadow-lg shadow-sky-100 active:scale-95 transition-all"><Printer size={20} /> Print PR</button>

               <div className="border border-slate-400 p-8 min-h-full">
                  <div className="flex justify-between items-start border-b-2 border-slate-400 pb-6 mb-8">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none text-left">SUMINO AAPICO (Thailand) Company Limited (Head Office)</h2>
                        <p className="text-[10px] font-medium text-slate-600 text-left">700/706 Moo 3, T. Bankao, A. Panthong, Chonburi 20160</p>
                        <p className="text-[10px] font-medium text-slate-600 text-left">Tel: 66-38-447-628-31, Fax No. 66-38-447-632</p>
                        <p className="text-[10px] font-medium text-slate-600 text-left">Tax No. 0-2055-56012-44-8</p>
                     </div>
                     <div className="text-right space-y-4 shrink-0">
                        <h1 className="text-2xl font-black text-slate-800 tracking-[0.1em] uppercase border-b-2 border-slate-800 inline-block">Purchase Requisition</h1>
                        <div className="space-y-1 text-[10px] font-bold text-slate-500">
                           <p>FORM NO : F-GA-001</p>
                           <p>REV : 01</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-[11px] font-bold text-slate-700">
                     <div className="space-y-2">
                        <div className="flex items-start">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left">Requester Name:</span>
                           <span className="flex-1 font-black underline underline-offset-4 decoration-slate-200 text-left">{printData.requester}</span>
                        </div>
                        <div className="flex items-start">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left">Department:</span>
                           <span className="flex-1 font-black text-left">{printData.department}</span>
                        </div>
                        <div className="flex items-start pt-4">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left italic font-medium">Suggested Vendor:</span>
                           <span className="flex-1 font-bold text-left">{printData.suggestedVendor || '-'}</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">P/R No. :</span>
                           <span className="font-black text-sky-700">{printData.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">Date :</span>
                           <span className="font-black">{printData.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1 pt-4">
                           <span className="text-slate-400 uppercase tracking-tighter">Procurement Type:</span>
                           <span className="font-black uppercase">{printData.type}</span>
                        </div>
                     </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-left">Justification / Reason for purchase:</p>
                    <div className="w-full p-4 border border-slate-200 bg-slate-50 min-h-[60px] text-xs font-bold text-slate-600 text-left rounded-sm">
                      {printData.justification}
                    </div>
                  </div>

                  <div className="border-2 border-slate-400 mb-6 overflow-hidden rounded-sm">
                     <table className="w-full text-[11px] border-collapse">
                        <thead className="bg-slate-100 uppercase font-black tracking-widest border-b border-slate-400 text-[9px]">
                           <tr>
                              <th className="border-r border-slate-400 p-3 w-10">No.</th>
                              <th className="border-r border-slate-400 p-3 text-left">Item Description / Specifications</th>
                              <th className="border-r border-slate-400 p-3 w-20 text-center">Unit</th>
                              <th className="border-r border-slate-400 p-3 w-16 text-center">Qty</th>
                              <th className="border-r border-slate-400 p-3 w-28 text-right">Unit Price</th>
                              <th className="p-3 w-32 text-right">Total Amount</th>
                           </tr>
                        </thead>
                        <tbody>
                           {printData.items.map((item: any, i: number) => (
                              <tr key={i} className="border-b border-slate-300 h-10">
                                 <td className="border-r border-slate-400 p-3 text-center font-bold">{i + 1}</td>
                                 <td className="border-r border-slate-400 p-3 font-bold text-left">{item.description}</td>
                                 <td className="border-r border-slate-400 p-3 text-center">{item.unit}</td>
                                 <td className="border-r border-slate-400 p-3 text-center font-black">{item.quantity}</td>
                                 <td className="border-r border-slate-400 p-3 text-right">{item.unitPrice.toLocaleString()}</td>
                                 <td className="p-3 text-right font-black">{item.total.toLocaleString()}</td>
                              </tr>
                           ))}
                           {Array.from({length: Math.max(0, 8 - printData.items.length)}).map((_, i) => (
                             <tr key={`empty-${i}`} className="border-b border-slate-100 h-10">
                               <td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td></td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot className="font-black text-slate-800 bg-slate-50 uppercase tracking-tighter">
                           <tr className="border-t-2 border-slate-400">
                              <td colSpan={5} className="p-2 text-right border-r border-slate-400 font-bold uppercase">Sub Total</td>
                              <td className="p-2 text-right font-black">{printData.totalAmount.toLocaleString()}</td>
                           </tr>
                           <tr className="border-t border-slate-300">
                              <td colSpan={5} className="p-2 text-right border-r border-slate-400 font-bold uppercase">Vat 7%</td>
                              <td className="p-2 text-right font-black">{(printData.totalAmount * 0.07).toLocaleString()}</td>
                           </tr>
                           <tr className="border-t-2 border-slate-400 bg-slate-200">
                              <td colSpan={5} className="p-3 text-right border-r border-slate-400 font-black text-base uppercase">Grand Total (Baht)</td>
                              <td className="p-3 text-right font-black text-base underline underline-offset-2">{(printData.totalAmount * 1.07).toLocaleString()}</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  <div className="mt-10">
                     <div className="grid grid-cols-4 border-2 border-slate-400 text-[9px] uppercase font-black text-slate-700 h-44">
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">1. Requester :</p>
                           <div className="space-y-1">
                              {printData.requesterSign?.dataUrl && <img src={printData.requesterSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.requesterSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.requesterSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">2. Supervisor :</p>
                           <div className="space-y-1">
                              {printData.supervisorSign?.dataUrl && <img src={printData.supervisorSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.supervisorSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.supervisorSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">3. Purchasing :</p>
                           <div className="space-y-1">
                              {printData.purchasingSign?.dataUrl && <img src={printData.purchasingSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.purchasingSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.purchasingSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">4. Approved By (MD) :</p>
                           <div className="space-y-1">
                              {printData.mdSign?.dataUrl && <img src={printData.mdSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.mdSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.mdSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* PO Print Preview mimicking F-GA-002 */}
      {showPrintPo && printData && (
         <div className="fixed inset-0 z-[200] bg-white overflow-y-auto animate-in zoom-in-105 duration-300 print:static print:p-0">
            <div className="max-w-[1000px] mx-auto p-12 bg-white min-h-screen shadow-2xl relative print:shadow-none print:p-8">
               <button onClick={() => setShowPrintPo(false)} className="absolute top-10 right-10 p-3 bg-slate-100 rounded-full hover:bg-slate-200 print:hidden transition-all"><X size={24} /></button>
               <button onClick={() => window.print()} className="absolute top-10 right-28 px-6 py-3 bg-sky-500 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-sky-600 print:hidden shadow-lg shadow-sky-100 active:scale-95 transition-all"><Printer size={20} /> Print PO</button>

               <div className="border border-slate-400 p-8 min-h-full">
                  <div className="flex justify-between items-start border-b-2 border-slate-400 pb-6 mb-8">
                     <div className="space-y-1">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none text-left">SUMINO AAPICO (Thailand) Company Limited (Head Office)</h2>
                        <p className="text-[10px] font-medium text-slate-600 text-left">700/706 Moo 3, T. Bankao, A. Panthong, Chonburi 20160</p>
                        <p className="text-[10px] font-medium text-slate-600 text-left">Tel: 66-38-447-628-31, Fax No. 66-38-447-632</p>
                        <p className="text-[10px] font-medium text-slate-600 text-left">Tax No. 0-2055-56012-44-8</p>
                     </div>
                     <div className="text-right space-y-4 shrink-0">
                        <h1 className="text-2xl font-black text-slate-800 tracking-[0.2em] uppercase border-b-2 border-slate-800 inline-block">Purchase Order</h1>
                        <div className="space-y-1 text-[10px] font-bold text-slate-50">
                           <p>Page : 1/1</p>
                           <p>CAPRE NO : {printData.capreNo || '-'}</p>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 text-[11px] font-bold text-slate-700">
                     <div className="space-y-2">
                        <div className="flex items-start">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left">Shipping Address:</span>
                           <span className="flex-1 font-black underline underline-offset-4 decoration-slate-200 text-left">SUMINO AAPICO (Thailand) Co., Ltd.</span>
                        </div>
                        <div className="flex items-start pt-2">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left">Vendor Name:</span>
                           <span className="flex-1 font-black text-left">{printData.vendorName}</span>
                        </div>
                        <div className="flex items-start">
                           <span className="w-32 shrink-0 text-slate-400 uppercase tracking-tighter text-left">Address:</span>
                           <span className="flex-1 font-medium italic text-left">{printData.vendorAddress || '................................................................'}</span>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">P/O No. :</span>
                           <span className="font-black text-sky-700">{printData.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">Date :</span>
                           <span className="font-black">{printData.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1 pt-4">
                           <span className="text-slate-400 uppercase tracking-tighter">Credit Term:</span>
                           <span className="font-black">{printData.creditTerm || '30 Days'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">Refer P/R No :</span>
                           <span className="font-black">{printData.prRef}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 pb-1">
                           <span className="text-slate-400 uppercase tracking-tighter">Dept.Order :</span>
                           <span className="font-black uppercase">{printData.department || 'IT'}</span>
                        </div>
                     </div>
                  </div>

                  <div className="border-2 border-slate-400 mb-6 overflow-hidden rounded-sm">
                     <table className="w-full text-[11px] border-collapse">
                        <thead className="bg-slate-100 uppercase font-black tracking-widest border-b border-slate-400 text-[9px]">
                           <tr>
                              <th className="border-r border-slate-400 p-3 w-10">Item</th>
                              <th className="border-r border-slate-400 p-3 text-left">Description</th>
                              <th className="border-r border-slate-400 p-3 w-24 text-center">Request Date</th>
                              <th className="border-r border-slate-400 p-3 w-16 text-center">Unit</th>
                              <th className="border-r border-slate-400 p-3 w-12 text-center">Qty</th>
                              <th className="border-r border-slate-400 p-3 w-28 text-right">Unit Price(Baht)</th>
                              <th className="p-3 w-32 text-right">Amount(Baht)</th>
                           </tr>
                        </thead>
                        <tbody>
                           {printData.items.map((item: any, i: number) => (
                              <tr key={i} className="border-b border-slate-300 h-10">
                                 <td className="border-r border-slate-400 p-3 text-center font-bold">{i + 1}</td>
                                 <td className="border-r border-slate-400 p-3 font-bold text-left">{item.description}</td>
                                 <td className="border-r border-slate-400 p-3 text-center">{printData.date}</td>
                                 <td className="border-r border-slate-400 p-3 text-center">{item.unit}</td>
                                 <td className="border-r border-slate-400 p-3 text-center font-black">{item.quantity}</td>
                                 <td className="border-r border-slate-400 p-3 text-right">{item.unitPrice.toLocaleString()}</td>
                                 <td className="p-3 text-right font-black">{item.total.toLocaleString()}</td>
                              </tr>
                           ))}
                           {Array.from({length: Math.max(0, 12 - printData.items.length)}).map((_, i) => (
                             <tr key={`empty-${i}`} className="border-b border-slate-100 h-10">
                               <td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td className="border-r border-slate-400"></td><td></td>
                             </tr>
                           ))}
                        </tbody>
                        <tfoot className="font-black text-slate-800 bg-slate-50 uppercase tracking-tighter">
                           <tr className="border-t-2 border-slate-400">
                              <td colSpan={6} className="p-2 text-right border-r border-slate-400 font-bold uppercase">Total</td>
                              <td className="p-2 text-right font-black">{printData.totalAmount.toLocaleString()}</td>
                           </tr>
                           <tr className="border-t border-slate-300">
                              <td colSpan={6} className="p-2 text-right border-r border-slate-400 font-bold uppercase">VAT 7%</td>
                              <td className="p-2 text-right font-black">{(printData.totalAmount * 0.07).toLocaleString()}</td>
                           </tr>
                           <tr className="border-t-2 border-slate-400 bg-slate-200">
                              <td colSpan={6} className="p-3 text-right border-r border-slate-400 font-black text-base uppercase">Grand Total</td>
                              <td className="p-3 text-right font-black text-base underline underline-offset-2">{(printData.totalAmount * 1.07).toLocaleString()}</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>

                  <div className="space-y-10">
                     <div className="p-6 bg-slate-50 border border-slate-300 text-[10px] text-slate-600 space-y-1 rounded-sm shadow-inner italic text-left">
                        <p className="font-black text-slate-800 mb-2 uppercase not-italic underline">Notes:</p>
                        <p>1. Delivery: After receive of PO</p>
                        <p>2. Payment term: 30 Days after receiving billing note</p>
                        <p>3. Place of shipment: At Sumino aapico (Thailand) factory</p>
                     </div>

                     <div className="grid grid-cols-4 border-2 border-slate-400 text-[9px] uppercase font-black text-slate-700 h-44">
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">Issued By : (จัดซื้อ)</p>
                           <div className="space-y-1">
                              {printData.purchasingSign?.dataUrl && <img src={printData.purchasingSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.purchasingSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.purchasingSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">Check By : (Manager)</p>
                           <div className="space-y-1">
                              {printData.supervisorSign?.dataUrl && <img src={printData.supervisorSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.supervisorSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.supervisorSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="border-r border-slate-400 p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400">Approved By : (MD)</p>
                           <div className="space-y-1">
                              {printData.mdSign?.dataUrl && <img src={printData.mdSign.dataUrl} className="h-14 mx-auto grayscale brightness-50" alt="sign" />}
                              <p className="border-t border-slate-500 pt-2 px-4 whitespace-nowrap">{printData.mdSign?.signerName || '................................'}</p>
                              <p className="text-[8px] text-slate-400">Date : {printData.mdSign?.signedDate || '..../..../....'}</p>
                           </div>
                        </div>
                        <div className="p-4 flex flex-col justify-between items-center text-center">
                           <p className="w-full text-left font-bold text-slate-400 italic lowercase tracking-tighter">seller acknowledgement</p>
                           <div className="space-y-1">
                              <div className="h-14"></div>
                              <p className="border-t border-slate-500 pt-2 px-4">................................</p>
                              <p className="text-[8px] text-slate-400">Date : ..../..../....</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      <style>{`
         @media print {
            body { background: white !important; font-family: 'Anuphan', sans-serif !important; }
            .no-print { display: none !important; }
            .print-only { display: block !important; }
            aside, header, nav, .bg-sky-50 { background: white !important; }
         }
      `}</style>
    </div>
  );
};

export default ProcurementModule;
