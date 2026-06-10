
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/api';
import { PurchaseRequisition, PurchaseOrder, Language } from '../types';
import { MOCK_PR, MOCK_PO } from '../constants';
import { 
  ShoppingCart, Plus, Edit2, Trash2, Search, FileText, CheckCircle, 
  Clock, X, Printer, Package, ClipboardList, BarChart3, ArrowUpRight, 
  FileSpreadsheet, ArrowRightCircle, AlertCircle, TrendingUp, Filter
} from 'lucide-react';

interface ProcurementModuleProps { lang: Language; t: any; }

const SmallBox: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string, footerText?: string }> = ({ title, value, icon, bgColor, footerText }) => (
  <div className={`small-box ${bgColor}`}>
    <div className="inner">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className="icon">
      {icon}
    </div>
    <button className="w-full bg-black/10 py-1 flex items-center justify-center gap-1 text-[10px] font-bold tracking-wider hover:bg-black/20 transition-all text-white">
      {footerText || 'More info'} <ArrowRightCircle size={10} className="ml-1" />
    </button>
  </div>
);

const ProcurementModule: React.FC<ProcurementModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'pr' | 'po'>('pr');
  const [prs, setPrs] = useState<PurchaseRequisition[]>(MOCK_PR);
  const [pos, setPos] = useState<PurchaseOrder[]>(MOCK_PO);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sourcing dashboard stats
  const stats = useMemo(() => {
    return {
      pendingPRs: prs.filter(p => p.status.includes('Pending') || p.status === 'Draft').length,
      approvedPRs: prs.filter(p => p.status === 'Approved').length,
      pendingPOs: pos.filter(o => o.status.includes('Pending') || o.status === 'Draft').length,
      totalVolume: prs.reduce((acc, curr) => acc + curr.totalAmount, 0)
    };
  }, [prs, pos]);

  const filteredPrs = prs.filter(p => 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.requester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPos = pos.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Mini Dashboard - AdminLTE Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SmallBox 
          title="Pending PRs" 
          value={stats.pendingPRs} 
          icon={<Clock />} 
          bgColor="bg-warning" 
          footerText="Check Requisitions"
        />
        <SmallBox 
          title="Approved PRs" 
          value={stats.approvedPRs} 
          icon={<CheckCircle />} 
          bgColor="bg-success" 
          footerText="View Approved List"
        />
        <SmallBox 
          title="Pending POs" 
          value={stats.pendingPOs} 
          icon={<FileText />} 
          bgColor="bg-info" 
          footerText="Check Purchase Orders"
        />
        <SmallBox 
          title="Total Requisitions" 
          value={`฿${(stats.totalVolume/1000).toFixed(1)}k`} 
          icon={<TrendingUp />} 
          bgColor="bg-primary" 
          footerText="Procurement Summary"
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        
        {/* Navigation and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 bg-white p-1 rounded border shadow-sm">
            <button 
              onClick={() => setActiveTab('pr')} 
              className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'pr' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ClipboardList size={14}/> Purchase Requisitions (PR)
              {stats.pendingPRs > 0 && <span className="badge bg-warning text-white animate-pulse">{stats.pendingPRs}</span>}
            </button>
            <button 
              onClick={() => setActiveTab('po')} 
              className={`px-4 py-1.5 text-xs font-bold rounded flex items-center gap-2 ${activeTab === 'po' ? 'bg-success text-white shadow' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FileSpreadsheet size={14}/> Purchase Orders (PO)
              {stats.pendingPOs > 0 && <span className="badge bg-danger text-white">{stats.pendingPOs}</span>}
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Search documents..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-primary"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <button className={`bg-primary text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 hover:bg-blue-600 transition-all shadow-sm`}>
              <Plus size={14}/> New {activeTab.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Content Card */}
        <div className={`card border-t-4 ${activeTab === 'pr' ? 'border-primary' : 'border-success'}`}>
          <div className="card-header flex items-center justify-between">
            <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
              {activeTab === 'pr' ? <ClipboardList size={18} className="text-primary"/> : <FileSpreadsheet size={18} className="text-success"/>}
              {activeTab === 'pr' ? 'Recent Purchase Requisitions' : 'Purchase Orders Tracking'}
            </h3>
            <div className="card-tools">
              <button className="btn btn-xs text-gray-400 hover:text-gray-600"><Filter size={14}/></button>
            </div>
          </div>
          <div className="card-body p-0 overflow-x-auto">
            {activeTab === 'pr' ? (
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{width: '120px'}}>PR ID</th>
                    <th>Originator</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th className="text-right">Total Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrs.map(p => (
                    <tr key={p.id}>
                      <td className="font-bold text-primary">{p.id}</td>
                      <td>{p.requester}</td>
                      <td><span className="badge bg-info">{p.department}</span></td>
                      <td><span className="text-xs font-bold text-gray-400 uppercase">{p.type}</span></td>
                      <td className="text-right font-bold tabular-nums text-gray-800">฿ {p.totalAmount.toLocaleString()}</td>
                      <td className="text-center">
                        <span className={`badge ${
                          p.status === 'Approved' ? 'bg-success' : 
                          p.status === 'Draft' ? 'bg-gray-500' : 'bg-warning'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-1.5 bg-gray-100 text-gray-600 rounded border hover:bg-gray-200" title="Print Document"><Printer size={12}/></button>
                          <button className="p-1.5 bg-info text-white rounded hover:bg-cyan-600" title="Edit PR"><Edit2 size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPrs.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400 italic">No requisition records found.</td></tr>}
                </tbody>
              </table>
            ) : (
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th style={{width: '120px'}}>PO ID</th>
                    <th>Vendor</th>
                    <th>PR Ref</th>
                    <th>Delivery Date</th>
                    <th className="text-right">Total Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPos.map(o => (
                    <tr key={o.id}>
                      <td className="font-bold text-success">{o.id}</td>
                      <td className="font-bold text-gray-700">{o.vendorName}</td>
                      <td className="text-gray-400 text-xs">{o.prRef}</td>
                      <td>{o.deliveryDate || 'N/A'}</td>
                      <td className="text-right font-bold tabular-nums text-gray-800">฿ {o.totalAmount.toLocaleString()}</td>
                      <td className="text-center">
                        <span className={`badge ${
                          o.status === 'Closed' ? 'bg-gray-800' : 
                          o.status === 'Approved' ? 'bg-success' : 'bg-info'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-1.5 bg-gray-100 text-gray-600 rounded border hover:bg-gray-200" title="Print PO"><Printer size={12}/></button>
                          <button className="p-1.5 bg-success text-white rounded hover:bg-green-600" title="View Details"><ArrowUpRight size={12}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPos.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-gray-400 italic">No purchase order records found.</td></tr>}
                </tbody>
              </table>
            )}
          </div>
          <div className="card-footer text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Enterprise Procurement Management System v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementModule;
