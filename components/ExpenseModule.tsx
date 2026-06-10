
import React, { useState } from 'react';
import { MOCK_EXPENSE_CLAIMS } from '../constants';
import { ExpenseClaim, Language } from '../types';
import { 
  CreditCard, Plus, Edit2, Trash2, Search, Filter, 
  DollarSign, CheckCircle, Clock, X, User, Image, 
  FileText, ArrowRightCircle, TrendingUp, AlertCircle
} from 'lucide-react';

interface ExpenseModuleProps {
  lang: Language;
  t: any;
}

const InfoBox: React.FC<{ title: string, value: string | number, icon: React.ReactNode, bgColor: string }> = ({ title, value, icon, bgColor }) => (
  <div className={`small-box ${bgColor}`}>
    <div className="inner">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className="icon">{icon}</div>
    <div className="small-box-footer bg-black/10 py-1 text-center text-[10px] uppercase font-bold cursor-pointer">
      Review Ledger <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const ExpenseModule: React.FC<ExpenseModuleProps> = ({ lang, t }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalPending: MOCK_EXPENSE_CLAIMS.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0),
    approvedCount: MOCK_EXPENSE_CLAIMS.filter(c => c.status === 'Approved').length,
    activeClaims: MOCK_EXPENSE_CLAIMS.filter(c => c.status === 'Pending').length,
    rejected: MOCK_EXPENSE_CLAIMS.filter(c => c.status === 'Rejected').length
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Amount Pending" value={`฿${stats.totalPending.toLocaleString()}`} icon={<DollarSign size={60}/>} bgColor="bg-warning" />
        <InfoBox title="Claims waiting" value={stats.activeClaims} icon={<Clock size={60}/>} bgColor="bg-info" />
        <InfoBox title="Claims Approved" value={stats.approvedCount} icon={<CheckCircle size={60}/>} bgColor="bg-success" />
        <InfoBox title="Rejected" value={stats.rejected} icon={<AlertCircle size={60}/>} bgColor="bg-danger" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex-1 max-w-xs relative">
          <input 
            type="text" 
            placeholder="Search claims..." 
            className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-primary" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        </div>
        <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm">
          <Plus size={14} /> New Expense Claim
        </button>
      </div>

      <div className="card border-t-4 border-info">
        <div className="card-header bg-white">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             <CreditCard size={18} className="text-info"/> Expense Disbursement Tracking
           </h3>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th style={{width: '200px'}}>Claim Details</th>
                <th>Requester</th>
                <th className="text-right">Amount</th>
                <th className="text-center">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_EXPENSE_CLAIMS.map(claim => (
                <tr key={claim.id}>
                  <td className="align-middle">
                    <div className="font-bold text-xs text-gray-800">{claim.title}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{claim.category} • {claim.date}</div>
                  </td>
                  <td className="align-middle">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">{claim.requester.charAt(0)}</div>
                       <span className="text-xs font-bold text-gray-700">{claim.requester}</span>
                    </div>
                  </td>
                  <td className="text-right align-middle font-bold text-gray-800 tabular-nums">
                    ฿{claim.amount.toLocaleString()}
                  </td>
                  <td className="text-center align-middle">
                    <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : claim.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="text-right align-middle">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 bg-gray-100 text-gray-500 rounded"><FileText size={12}/></button>
                      {claim.status === 'Pending' && (
                        <button className="p-1.5 bg-success text-white rounded"><CheckCircle size={12}/></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModule;
