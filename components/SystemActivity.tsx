
import React, { useState, useEffect } from 'react';
import { db } from '../services/api';
import { ActivityLog, Language } from '../types';
import { 
  History, Search, RefreshCw, Clock, User, Info, 
  ArrowRightCircle, Filter, Trash2, Calendar
} from 'lucide-react';

interface SystemActivityProps {
  lang: Language;
  t: any;
}

const SystemActivity: React.FC<SystemActivityProps> = ({ lang, t }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAll('ACTIVITY_LOGS');
      if (data) {
        // Sort by timestamp descending
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLogs(sorted);
      }
    } catch (e) {
      console.error("Error loading activity logs:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => 
    (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (log.user || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (log.details || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBadgeColor = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('login')) return 'bg-success';
    if (act.includes('logout')) return 'bg-danger';
    if (act.includes('create') || act.includes('add')) return 'bg-primary';
    if (act.includes('update') || act.includes('edit')) return 'bg-info';
    if (act.includes('delete') || act.includes('remove')) return 'bg-danger';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 rounded shadow-sm border-l-4 border-rose-400">
        <div>
          <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
            <History size={18} className="text-rose-400" /> {t.systemActivityLog || 'System Activity History'}
          </h3>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <input 
                  type="text" 
                  placeholder="ค้นหาผู้ใช้ หรือ กิจกรรม..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-rose-400 shadow-sm" 
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <button 
              onClick={loadLogs} 
              disabled={isLoading}
              className="p-1.5 bg-white border rounded hover:bg-gray-50 text-gray-400 transition-all shadow-sm"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
        </div>
      </div>

      <div className="card border-t-4 border-rose-400 shadow-sm">
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead className="bg-gray-50">
              <tr>
                <th style={{ width: '10px' }}>#</th>
                <th style={{ width: '180px' }}>เวลา (Timestamp)</th>
                <th>ผู้ใช้งาน (User)</th>
                <th>กิจกรรม (Action)</th>
                <th>รายละเอียด (Details)</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <RefreshCw className="animate-spin inline-block mr-2 text-rose-400" />
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">กำลังซิงค์ประวัติกิจกรรม...</span>
                  </td>
                </tr>
              ) : filteredLogs.map((log, idx) => (
                <tr key={log.id} className="hover:bg-rose-50/30 transition-colors">
                  <td className="align-middle text-gray-400">{idx + 1}.</td>
                  <td className="align-middle">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                      <Clock size={12} className="text-gray-400" /> {log.timestamp}
                    </div>
                  </td>
                  <td className="align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[10px] font-bold text-rose-400">{log.user?.charAt(0)}</div>
                      <span className="text-xs text-gray-600 font-medium">{log.user}</span>
                    </div>
                  </td>
                  <td className="align-middle">
                    <span className={`badge ${getBadgeColor(log.action)}`}>
                        {log.action}
                    </span>
                  </td>
                  <td className="align-middle">
                    <div className="text-xs text-gray-500 max-w-md truncate" title={log.details}>
                      {log.details}
                    </div>
                  </td>
                  <td className="text-right align-middle">
                    <button className="p-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-all"><Info size={12}/></button>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 italic text-[10px] font-bold uppercase">ไม่พบประวัติกิจกรรม</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white border-t p-3 text-right">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Connected to Activity Ledger</span>
        </div>
      </div>
    </div>
  );
};

export default SystemActivity;
