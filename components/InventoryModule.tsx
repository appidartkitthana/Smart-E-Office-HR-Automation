
import React, { useState } from 'react';
import { MOCK_INVENTORY, MOCK_SUPPLY_REQUESTS } from '../constants';
import { InventoryItem, Language } from '../types';
import { 
  Box, Plus, Edit2, Trash2, Search, AlertTriangle, 
  CheckCircle, X, ShoppingCart, List, Filter, Shield, 
  ArrowRightCircle, Package, TrendingDown
} from 'lucide-react';

interface InventoryModuleProps {
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
      Monitor Stock <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const InventoryModule: React.FC<InventoryModuleProps> = ({ lang, t }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalItems: MOCK_INVENTORY.length,
    lowStock: MOCK_INVENTORY.filter(i => i.stock <= i.minStock).length,
    ppeCount: MOCK_INVENTORY.filter(i => i.category === 'PPE').length,
    pendingReq: MOCK_SUPPLY_REQUESTS.filter(r => r.status === 'Pending').length
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* AdminLTE Small Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="Total Stock" value={stats.totalItems} icon={<Box size={60}/>} bgColor="bg-info" />
        <InfoBox title="Low Stock Alert" value={stats.lowStock} icon={<AlertTriangle size={60}/>} bgColor="bg-danger" />
        <InfoBox title="PPE Items" value={stats.ppeCount} icon={<Shield size={60}/>} bgColor="bg-success" />
        <InfoBox title="Pending Requests" value={stats.pendingReq} icon={<ShoppingCart size={60}/>} bgColor="bg-warning" />
      </div>

      <div className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex gap-1">
          <button onClick={() => setActiveTab('inventory')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Inventory List</button>
          <button onClick={() => setActiveTab('requests')} className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'requests' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Supply Requests</button>
        </div>
        <div className="flex gap-2">
           <button className="bg-amber-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm"><Shield size={14}/> Request PPE</button>
           <button className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 shadow-sm"><Plus size={14}/> Add Stock</button>
        </div>
      </div>

      <div className={`card border-t-4 ${activeTab === 'inventory' ? 'border-info' : 'border-success'}`}>
        <div className="card-header flex items-center justify-between">
           <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
             {activeTab === 'inventory' ? <Package size={18} className="text-info"/> : <List size={18} className="text-success"/>}
             {activeTab === 'inventory' ? 'Current Stock Level' : 'Activity History'}
           </h3>
           <div className="card-tools">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Filter stock..." 
                  className="pl-8 pr-4 py-1 text-xs border rounded bg-white outline-none" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
              </div>
           </div>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead className="bg-gray-50/50">
              <tr>
                <th style={{width: '250px'}}>Item Name / Category</th>
                <th className="text-center">Current Stock</th>
                <th className="text-center">Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVENTORY.map(item => (
                <tr key={item.id}>
                  <td className="align-middle">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded bg-gray-50 flex items-center justify-center ${item.category === 'PPE' ? 'text-amber-500' : 'text-info'}`}>
                         {item.category === 'PPE' ? <Shield size={20}/> : <Box size={20}/>}
                       </div>
                       <div>
                          <div className="font-bold text-gray-800 text-xs">{item.name}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{item.category}</div>
                       </div>
                    </div>
                  </td>
                  <td className="text-center align-middle font-bold text-gray-700">
                    {item.stock} <span className="text-[10px] text-gray-400 font-normal">{item.unit}</span>
                  </td>
                  <td className="text-center align-middle">
                    <span className={`badge ${item.stock <= item.minStock ? 'bg-danger' : 'bg-success'}`}>
                      {item.stock <= item.minStock ? 'Low Stock' : 'Normal'}
                    </span>
                  </td>
                  <td className="text-right align-middle">
                    <div className="flex justify-end gap-1">
                      <button className="p-1.5 bg-info text-white rounded shadow-sm"><Edit2 size={10}/></button>
                      <button className="p-1.5 bg-danger text-white rounded shadow-sm"><Trash2 size={10}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white border-t text-right">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Last Synced: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryModule;
