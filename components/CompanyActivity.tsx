import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../services/api';
import { CompanyActivity as ICompanyActivity, Language } from '../types';
import { 
  Calendar, PartyPopper, Plus, X, Edit3, Trash2, 
  MapPin, Clock, Users, Search, RefreshCw, Save,
  ChevronLeft, ChevronRight, Info, CheckCircle2, List, CalendarDays, ExternalLink,
  Triangle, Award, Building, Package, ShieldAlert
} from 'lucide-react';
import { API_CONFIG } from '../config';

const toLocalDateStr = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export interface CompanyHoliday {
  date: string;
  nameTH: string;
  nameEN: string;
  type: 'national' | 'company' | 'inventory';
  dayOfWeekTH: string;
  dayOfWeekEN: string;
}

const COMPANY_HOLIDAYS_2026: CompanyHoliday[] = [
  // National Holidays
  { date: '2026-01-01', nameTH: 'วันขึ้นปีใหม่', nameEN: "New Year's Day", type: 'national', dayOfWeekTH: 'พฤหัสบดี', dayOfWeekEN: 'Thursday' },
  { date: '2026-03-03', nameTH: 'วันมาฆบูชา', nameEN: 'Makha Bucha Day', type: 'national', dayOfWeekTH: 'อังคาร', dayOfWeekEN: 'Tuesday' },
  { date: '2026-04-13', nameTH: 'วันสงกรานต์', nameEN: 'Songkran Day', type: 'national', dayOfWeekTH: 'จันทร์', dayOfWeekEN: 'Monday' },
  { date: '2026-04-14', nameTH: 'วันสงกรานต์', nameEN: 'Songkran Day', type: 'national', dayOfWeekTH: 'อังคาร', dayOfWeekEN: 'Tuesday' },
  { date: '2026-04-15', nameTH: 'วันสงกรานต์', nameEN: 'Songkran Day', type: 'national', dayOfWeekTH: 'พุธ', dayOfWeekEN: 'Wednesday' },
  { date: '2026-05-01', nameTH: 'วันแรงงานแห่งชาติ', nameEN: 'National Labour Day', type: 'national', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-05-31', nameTH: 'วันวิสาขบูชา', nameEN: 'Visakhabucha Day', type: 'national', dayOfWeekTH: 'อาทิตย์', dayOfWeekEN: 'Sunday' },
  { date: '2026-06-01', nameTH: 'วันหยุดชดเชยวันวิสาขบูชา', nameEN: 'Substitute Visakhabucha Day', type: 'national', dayOfWeekTH: 'จันทร์', dayOfWeekEN: 'Monday' },
  { date: '2026-06-03', nameTH: 'วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี', nameEN: "H.M. Queen Suthida's Birthday", type: 'national', dayOfWeekTH: 'พุธ', dayOfWeekEN: 'Wednesday' },
  { date: '2026-07-28', nameTH: 'วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว', nameEN: "H.M. King Maha Vajiralongkorn's Birthday", type: 'national', dayOfWeekTH: 'อังคาร', dayOfWeekEN: 'Tuesday' },
  { date: '2026-07-29', nameTH: 'วันอาสาฬหบูชา', nameEN: 'Asalha Bucha Day', type: 'national', dayOfWeekTH: 'พุธ', dayOfWeekEN: 'Wednesday' },
  { date: '2026-08-12', nameTH: 'วันแม่แห่งชาติ', nameEN: "National Mother's Day", type: 'national', dayOfWeekTH: 'พุธ', dayOfWeekEN: 'Wednesday' },
  { date: '2026-10-23', nameTH: 'วันปิยมหาราช', nameEN: 'King Chulalongkorn Memorial Day', type: 'national', dayOfWeekTH: 'พฤหัสบดี', dayOfWeekEN: 'Thursday' },
  { date: '2026-12-31', nameTH: 'วันสิ้นปี', nameEN: "New Year's Eve", type: 'national', dayOfWeekTH: 'พฤหัสบดี', dayOfWeekEN: 'Thursday' },

  // Company Special Holidays
  { date: '2026-01-02', nameTH: 'วันหยุดพิเศษของบริษัท', nameEN: 'Company Special Holiday', type: 'company', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-05-29', nameTH: 'วันหยุดพิเศษของบริษัท', nameEN: 'Company Special Holiday', type: 'company', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-12-28', nameTH: 'วันหยุดพิเศษของบริษัท', nameEN: 'Company Special Holiday', type: 'company', dayOfWeekTH: 'จันทร์', dayOfWeekEN: 'Monday' },
  { date: '2026-12-29', nameTH: 'วันหยุดพิเศษของบริษัท', nameEN: 'Company Special Holiday', type: 'company', dayOfWeekTH: 'อังคาร', dayOfWeekEN: 'Tuesday' },
  { date: '2026-12-30', nameTH: 'วันหยุดพิเศษของบริษัท', nameEN: 'Company Special Holiday', type: 'company', dayOfWeekTH: 'พุธ', dayOfWeekEN: 'Wednesday' },

  // Inventory Taking Days
  { date: '2026-01-31', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-02-27', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-03-28', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-04-25', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-05-30', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-06-27', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-07-27', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'จันทร์', dayOfWeekEN: 'Monday' },
  { date: '2026-07-31', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-08-28', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' },
  { date: '2026-09-26', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-10-31', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-11-28', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'เสาร์', dayOfWeekEN: 'Saturday' },
  { date: '2026-12-25', nameTH: 'วันตรวจนับสินค้าคงคลัง', nameEN: 'Inventory Taking Day', type: 'inventory', dayOfWeekTH: 'ศุกร์', dayOfWeekEN: 'Friday' }
];

interface CompanyActivityProps {
  lang: Language;
  t: any;
}

const CompanyActivity: React.FC<CompanyActivityProps> = ({ lang, t }) => {
  const [activities, setActivities] = useState<ICompanyActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ICompanyActivity | null>(null);
  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'holidays'>('calendar');
  const [holidayFilter, setHolidayFilter] = useState<'all' | 'national' | 'company' | 'inventory'>('all');

  // New states for Managing Holidays dynamically
  const [holidays, setHolidays] = useState<CompanyHoliday[]>(() => {
    const local = localStorage.getItem('COMPANY_HOLIDAYS_2026');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return COMPANY_HOLIDAYS_2026;
      }
    }
    return COMPANY_HOLIDAYS_2026;
  });

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<CompanyHoliday | null>(null);
  const [holidayFormData, setHolidayFormData] = useState<Partial<CompanyHoliday>>({
    date: toLocalDateStr(new Date()),
    nameTH: '',
    nameEN: '',
    type: 'national'
  });

  const [formData, setFormData] = useState<Partial<ICompanyActivity>>({
    title: '',
    date: toLocalDateStr(new Date()),
    startTime: '09:00',
    endTime: '17:00',
    location: '',
    participants: '',
    details: ''
  });

  // Calculate day of week automatically from string date
  const getDayOfWeek = (dateStr: string) => {
    const daysTH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const daysEN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const d = new Date(dateStr);
    const dayIndex = d.getDay();
    return {
      th: daysTH[dayIndex] || 'จันทร์',
      en: daysEN[dayIndex] || 'Monday'
    };
  };

  // Compute dynamic stats based on holidays list
  const dynamicStats = useMemo(() => {
    const national = holidays.filter(h => h.type === 'national').length;
    const company = holidays.filter(h => h.type === 'company').length;
    const inventory = holidays.filter(h => h.type === 'inventory').length;
    const weeklyHolidays = 52; // Standard 2026/Saturdays & Sundays baseline
    const totalDays = 365;
    const workingDays = totalDays - (national + company + weeklyHolidays);
    return {
      national,
      company,
      inventory,
      weeklyHolidays,
      workingDays
    };
  }, [holidays]);

  const loadActivities = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAll('COMPANY_ACTIVITIES');
      setActivities(Array.isArray(data) ? data : []);
      console.log("Loaded Cloud Activities:", data);
    } catch (e) {
      console.error("Cloud Sync Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHolidays = async () => {
    try {
      const data = await db.getAll('COMPANY_HOLIDAYS_2026');
      if (Array.isArray(data) && data.length > 0) {
        const parsed: CompanyHoliday[] = data.map((item: any) => ({
          date: item.date,
          nameTH: item.nameTH,
          nameEN: item.nameEN,
          type: item.type,
          dayOfWeekTH: item.dayOfWeekTH,
          dayOfWeekEN: item.dayOfWeekEN
        }));
        setHolidays(parsed);
        localStorage.setItem('COMPANY_HOLIDAYS_2026', JSON.stringify(parsed));
      }
    } catch (e) {
      console.warn("Failed loading from remote, fallback to localStorage/default holidays", e);
    }
  };

  useEffect(() => { 
    loadActivities(); 
    loadHolidays();
  }, []);

  const handleSaveHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!holidayFormData.date) return;
      
      const dayOfWeekInfo = getDayOfWeek(holidayFormData.date);
      const payload: CompanyHoliday = {
        date: holidayFormData.date,
        nameTH: holidayFormData.nameTH || '',
        nameEN: holidayFormData.nameEN || '',
        type: holidayFormData.type || 'national',
        dayOfWeekTH: dayOfWeekInfo.th,
        dayOfWeekEN: dayOfWeekInfo.en
      };

      let updatedHolidays: CompanyHoliday[] = [];
      if (editingHoliday) {
        // Edit existing holiday matching old date
        updatedHolidays = holidays.map(h => h.date === editingHoliday.date ? payload : h);
        await db.update('COMPANY_HOLIDAYS_2026', editingHoliday.date, payload).catch(err => console.warn("Google Sheet write warning:", err));
      } else {
        // Prevent duplicate date
        if (holidays.some(h => h.date === payload.date)) {
          alert(lang === 'TH' ? 'วันที่นี้มีวันหยุดกำหนดไว้แล้ว!' : 'A holiday already exists on this date!');
          setIsLoading(false);
          return;
        }
        updatedHolidays = [...holidays, payload].sort((a, b) => a.date.localeCompare(b.date));
        await db.create('COMPANY_HOLIDAYS_2026', payload).catch(err => console.warn("Google Sheet write warning:", err));
      }

      setHolidays(updatedHolidays);
      localStorage.setItem('COMPANY_HOLIDAYS_2026', JSON.stringify(updatedHolidays));

      // Log event
      await db.create('ACTIVITY_LOGS', {
        user: 'Admin User',
        action: editingHoliday ? 'Update Holiday' : 'Create Holiday',
        details: `${payload.nameTH} on ${payload.date}`
      }).catch(e => console.warn(e));

      setShowHolidayModal(false);
    } catch (error) {
      console.error(error);
      alert("Error saving holiday. It is saved in temporary local storage but could not publish to cloud.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteHoliday = async (holidayDate: string) => {
    const confirmMsg = lang === 'TH' 
      ? `คุณต้องการลบทำเนียบวันหยุดวันที่ ${holidayDate} ใช่หรือไม่?` 
      : `Are you sure you want to delete the holiday on date: ${holidayDate}?`;
    if (!confirm(confirmMsg)) return;

    setIsLoading(true);
    try {
      const updatedHolidays = holidays.filter(h => h.date !== holidayDate);
      setHolidays(updatedHolidays);
      localStorage.setItem('COMPANY_HOLIDAYS_2026', JSON.stringify(updatedHolidays));

      await db.delete('COMPANY_HOLIDAYS_2026', holidayDate).catch(err => console.warn("Google Sheet delete warning:", err));

      await db.create('ACTIVITY_LOGS', {
        user: 'Admin User',
        action: 'Delete Holiday',
        details: `Deleted holiday on date: ${holidayDate}`
      }).catch(e => console.warn(e));
    } catch (e) {
      console.error(e);
      alert("Error deleting holiday.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { ...formData };
      let result;
      
      if (editingActivity) {
        result = await db.update('COMPANY_ACTIVITIES', editingActivity.id, payload);
      } else {
        const newId = `ACT-${Date.now()}`;
        result = await db.create('COMPANY_ACTIVITIES', { ...payload, id: newId });
      }

      if (result) {
        // Log activity
        await db.create('ACTIVITY_LOGS', {
          user: 'Admin User',
          action: editingActivity ? 'Update Activity' : 'Create Activity',
          details: `Activity: ${payload.title} on ${payload.date}`
        });
        setShowModal(false);
        await loadActivities();
      } else {
        throw new Error("API returned failure");
      }
    } catch (e) {
      alert("Error saving activity to Google Sheets. Please ensure your Master Script is deployed and URL is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Confirm deletion? This will permanently remove the record from Google Sheets.")) return;
    setIsLoading(true);
    try {
      const result = await db.delete('COMPANY_ACTIVITIES', id);
      if (result) {
        await db.create('ACTIVITY_LOGS', {
          user: 'Admin User',
          action: 'Delete Activity',
          details: `ID: ${id}`
        });
        await loadActivities();
      }
    } catch (e) {
      alert("Error deleting record.");
      setIsLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentViewDate]);

  const getActivityForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = toLocalDateStr(date);
    return activities.filter(a => a.date === dateStr);
  };

  const changeMonth = (offset: number) => {
    const next = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + offset, 1);
    setCurrentViewDate(next);
  };

  const filteredHolidays = useMemo(() => {
    if (holidayFilter === 'all') return holidays;
    return holidays.filter(h => h.type === holidayFilter);
  }, [holidayFilter, holidays]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded shadow-sm border-l-4 border-pink-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-pink-50 rounded-2xl text-pink-500 shadow-inner">
            <PartyPopper size={32} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase">
              {t.companyActivity || 'กิจกรรมบริษัท (Company Activities)'}
            </h2>
            <p className="text-xs text-pink-400 font-bold uppercase tracking-widest mt-0.5">
              {viewMode === 'holidays' 
                ? (lang === 'TH' ? 'ตารางวันหยุดบริษัทปี 2569 / 2026' : 'Company Holiday Schedule 2026')
                : currentViewDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-end">
          {/* View Modes Selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
             <button 
               onClick={() => setViewMode('calendar')} 
               className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${viewMode === 'calendar' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               <CalendarDays size={14}/>
               <span>{lang === 'TH' ? 'ปฏิทิน' : 'Calendar'}</span>
             </button>
             <button 
               onClick={() => setViewMode('list')} 
               className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${viewMode === 'list' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               <List size={14}/>
               <span>{lang === 'TH' ? 'รายการกิจกรรม' : 'Activities'}</span>
             </button>
             <button 
               onClick={() => setViewMode('holidays')} 
               className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${viewMode === 'holidays' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
               <Calendar size={14}/>
               <span className="relative">
                 {lang === 'TH' ? 'วันหยุด & แผนงาน' : 'Holidays'}
                 <span className="absolute -top-3.5 -right-2 px-1 py-0.5 bg-rose-500 text-white text-[7px] font-black rounded-full leading-none zoom-in-50">2026</span>
               </span>
             </button>
          </div>

          {/* Month Changer (Only shown when not in holidays viewMode) */}
          {viewMode !== 'holidays' && (
            <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
               <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500"><ChevronLeft size={16}/></button>
               <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-500"><ChevronRight size={16}/></button>
            </div>
          )}

          {/* Core Controls */}
          {viewMode !== 'holidays' && (
            <>
              <button onClick={loadActivities} className="bg-white border p-2 rounded-xl hover:bg-gray-50 text-gray-400 shadow-sm transition-all active:rotate-180" title="Sync Cloud Data"><RefreshCw size={18} className={isLoading ? 'animate-spin' : ''}/></button>
              <button 
                onClick={() => { setEditingActivity(null); setFormData({title:'', date: toLocalDateStr(new Date()), startTime:'09:00', endTime:'17:00', location:'', participants:'', details:''}); setShowModal(true); }} 
                className="bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg hover:bg-pink-600 active:scale-95 transition-all"
              >
                <Plus size={16}/> {t.newEntry || 'เพิ่มกิจกรรม'}
              </button>
            </>
          )}
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="card shadow-sm border-0 overflow-hidden rounded-3xl bg-white">
          <div className="grid grid-cols-7 bg-gray-50 border-b">
             {['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'].map(d => (
               <div key={d} className="py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-r last:border-0">{d}</div>
             ))}
          </div>
          <div className="grid grid-cols-7 border-l">
             {calendarDays.map((date, idx) => {
                const dayActivities = getActivityForDay(date);
                const isToday = date?.toDateString() === new Date().toDateString();
                const dateStr = date ? toLocalDateStr(date) : null;
                const holiday = dateStr ? holidays.find(h => h.date === dateStr) : null;

                // Determine background color based on holiday type
                let bgClass = "bg-white";
                if (!date) {
                  bgClass = "bg-gray-50/30";
                } else if (holiday) {
                  if (holiday.type === 'national') bgClass = "bg-red-50/45 hover:bg-red-50/70";
                  else if (holiday.type === 'company') bgClass = "bg-pink-50/80 hover:bg-pink-50";
                  else if (holiday.type === 'inventory') bgClass = "bg-amber-50/60 hover:bg-amber-50/80";
                } else {
                  bgClass = "hover:bg-pink-50/10";
                }

                return (
                  <div key={idx} className={`min-h-[150px] border-r border-b p-2.5 relative group transition-all flex flex-col justify-between ${bgClass}`}>
                     <div>
                       {date && (
                         <div className="flex items-center justify-between">
                           <span className={`text-xs font-black rounded-lg w-7 h-7 flex items-center justify-center transition-all ${
                             isToday 
                               ? 'bg-pink-500 text-white shadow-md' 
                               : holiday?.type === 'national' 
                                 ? 'bg-red-500 text-white shadow-sm font-black' 
                                 : holiday?.type === 'company'
                                   ? 'bg-pink-550/20 text-pink-700 font-extrabold'
                                   : holiday?.type === 'inventory'
                                     ? 'bg-amber-500/20 text-amber-800 font-extrabold'
                                     : 'text-gray-400'
                           }`}>
                             {date.getDate()}
                           </span>
                           {holiday && (
                             <span className="text-[10px]">
                               {holiday.type === 'national' && '🔺'}
                               {holiday.type === 'company' && '🏢'}
                               {holiday.type === 'inventory' && '📦'}
                             </span>
                           )}
                         </div>
                       )}

                       {/* Interactive Holiday Banner */}
                       {holiday && date && (
                         <div className={`mt-1.5 p-1 rounded text-[9px] font-extrabold border leading-snug flex items-center gap-1 shadow-2xs ${
                           holiday.type === 'national' 
                             ? 'bg-red-100/70 text-red-700 border-red-200' 
                             : holiday.type === 'company'
                               ? 'bg-pink-100 text-pink-800 border-pink-200'
                               : 'bg-amber-100/80 text-amber-800 border-amber-200'
                         }`} title={lang === 'TH' ? holiday.nameTH : holiday.nameEN}>
                           <span className="truncate">{lang === 'TH' ? holiday.nameTH : holiday.nameEN}</span>
                         </div>
                       )}
                     </div>

                     <div className="mt-2 space-y-1.5 z-10">
                        {dayActivities.map(act => (
                          <div 
                            key={act.id} 
                            onClick={() => { setEditingActivity(act); setFormData({...act}); setShowModal(true); }}
                            className="bg-white border-l-4 border-pink-400 p-1.5 rounded shadow-sm text-[10px] cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                          >
                             <div className="font-black text-gray-700 leading-tight mb-0.5 line-clamp-1">{act.title}</div>
                             <div className="flex items-center gap-1 text-gray-400 font-bold text-[8px]">
                                <Clock size={8}/> {act.startTime}
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                );
             })}
          </div>
        </div>
      ) : viewMode === 'list' ? (
        <div className="card border-t-4 border-pink-400 shadow-lg rounded-3xl overflow-hidden bg-white">
          <div className="card-header bg-white flex justify-between items-center px-6 py-4">
             <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">Activity Ledger</h3>
             <button onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${API_CONFIG.GOOGLE_SHEET_ID}`)} className="text-[10px] font-bold text-sky-500 flex items-center gap-1 hover:underline">
               <ExternalLink size={12}/> View Sheet
             </button>
          </div>
          <div className="card-body p-0 overflow-x-auto">
            <table className="table table-striped mb-0">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6">ACTIVITY DETAILS</th>
                     <th>DATE & TIME</th>
                     <th>LOCATION</th>
                     <th>PARTICIPANTS</th>
                     <th className="text-right px-6">ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  {activities.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(act => (
                    <tr key={act.id} className="hover:bg-pink-50/10">
                      <td className="align-middle px-6 py-4">
                        <div className="font-black text-gray-800 text-sm leading-tight">{act.title}</div>
                        <div className="text-[10px] text-gray-400 font-medium mt-1 line-clamp-1">{act.details}</div>
                      </td>
                      <td className="align-middle">
                         <div className="font-black text-xs text-gray-700">{act.date}</div>
                         <div className="text-gray-400 text-[10px] font-bold uppercase mt-0.5">{act.startTime} - {act.endTime}</div>
                      </td>
                      <td className="align-middle">
                         <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                           <MapPin size={14} className="text-pink-400"/> {act.location}
                         </div>
                      </td>
                      <td className="align-middle">
                         <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                            {act.participants.split(',').map((p, i) => (
                              <span key={i} className="px-2 py-0.5 bg-pink-50 text-[9px] font-black text-pink-500 rounded-lg border border-pink-100 uppercase tracking-tighter">{p.trim()}</span>
                            ))}
                         </div>
                      </td>
                      <td className="text-right align-middle px-6">
                         <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingActivity(act); setFormData({...act}); setShowModal(true); }} className="p-2 bg-sky-50 text-sky-500 rounded-xl hover:bg-sky-500 hover:text-white transition-all shadow-sm"><Edit3 size={14}/></button>
                            <button onClick={() => handleDelete(act.id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={14}/></button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {activities.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                         <Info size={40} className="mx-auto text-gray-200 mb-4" />
                         <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No activities found in cloud</p>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* HOLIDAYS MODULE (Company Holiday view request) */
        <div className="space-y-6">
          {/* Calendar statistics overview block */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
             <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
               <div>
                  <span className="text-blue-100/80 font-bold uppercase tracking-wider text-[9px] block">วันทำงานปกติ / Working Days</span>
                  <h4 className="text-3xl font-black mt-1">{dynamicStats.workingDays} <span className="text-[10px] font-bold">วัน (Days)</span></h4>
               </div>
               <Calendar className="absolute -right-4 -bottom-4 w-16 h-16 text-blue-400/20" />
             </div>
             
             <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
               <div>
                  <span className="text-rose-100/80 font-bold uppercase tracking-wider text-[9px] block">หยุดราชการ/ประเพณี / National Holidays</span>
                  <h4 className="text-3xl font-black mt-1">{dynamicStats.national} <span className="text-[10px] font-bold">วัน (Days)</span></h4>
               </div>
               <Triangle className="absolute -right-4 -bottom-4 w-16 h-16 text-rose-400/20 fill-white/10" />
             </div>

             <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
               <div>
                  <span className="text-pink-100/80 font-bold uppercase tracking-wider text-[9px] block">พิเศษบริษัท / Special Holidays</span>
                  <h4 className="text-3xl font-black mt-1">{dynamicStats.company} <span className="text-[10px] font-bold">วัน (Days)</span></h4>
               </div>
               <Building className="absolute -right-4 -bottom-4 w-16 h-16 text-pink-400/20" />
             </div>

             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px]">
               <div>
                  <span className="text-indigo-100/80 font-bold uppercase tracking-wider text-[9px] block">วันหยุดสุดสัปดาห์ / Weekly Holidays</span>
                  <h4 className="text-3xl font-black mt-1">{dynamicStats.weeklyHolidays} <span className="text-[10px] font-bold">วัน (Days)</span></h4>
               </div>
               <Clock className="absolute -right-4 -bottom-4 w-16 h-16 text-indigo-400/20" />
             </div>

             <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[110px] col-span-2 lg:col-span-1">
               <div>
                  <span className="text-amber-100/80 font-bold uppercase tracking-wider text-[9px] block">ตรวจนับสินค้า / Inventory Taking</span>
                  <h4 className="text-3xl font-black mt-1">{dynamicStats.inventory} <span className="text-[10px] font-bold">ครั้ง (Times)</span></h4>
               </div>
               <Package className="absolute -right-4 -bottom-4 w-16 h-16 text-amber-400/20" />
             </div>
          </div>

          {/* Holiday ledger list with filters */}
          <div className="card shadow-md border-0 rounded-3xl bg-white overflow-hidden">
             <div className="px-6 py-5 bg-gray-50 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                   <h3 className="font-black text-gray-800 text-base uppercase tracking-wider">
                     {lang === 'TH' ? 'ทำเนียบวันทำงาน และวันหยุดองค์กร 2569' : 'Corporate Calendar & Holiday Register 2026'}
                   </h3>
                   <p className="text-xs text-gray-400 mt-1">
                     {lang === 'TH' ? '* ข้อมูลได้รับการอนุมัติและออกประกาศโดยคณะกรรมการฝ่ายบริหาร' : '* Official directory of company calendar constraints authorized by administration'}
                   </p>
                </div>

                {/* Filter buttons and actions */}
                <div className="flex flex-wrap items-center gap-3">
                   <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: 'all', label: lang === 'TH' ? 'แสดงทั้งหมด' : 'All Holidays', color: 'bg-gray-100 text-gray-700' },
                        { id: 'national', label: lang === 'TH' ? 'หยุดราชการ/ประเพณี' : 'National', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                        { id: 'company', label: lang === 'TH' ? 'หยุดพิเศษบริษัท' : 'Company Special', color: 'bg-pink-50 text-pink-700 border-pink-200' },
                        { id: 'inventory', label: lang === 'TH' ? 'ตรวจสต๊อกคลัง' : 'Inventory Day', color: 'bg-amber-50 text-amber-800 border-amber-200' }
                      ].map(btn => (
                        <button
                          key={btn.id}
                          onClick={() => setHolidayFilter(btn.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-wider ${
                            holidayFilter === btn.id 
                              ? 'bg-slate-800 text-white shadow-md scale-102 font-bold' 
                              : `${btn.color} border border-transparent hover:bg-slate-100`
                          }`}
                        >
                          {btn.label}
                        </button>
                      ))}
                   </div>

                   <button
                     onClick={() => {
                       setEditingHoliday(null);
                       setHolidayFormData({
                         date: toLocalDateStr(new Date()),
                         nameTH: '',
                         nameEN: '',
                         type: 'national'
                       });
                       setShowHolidayModal(true);
                     }}
                     className="bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md hover:bg-pink-600 active:scale-95 transition-all"
                   >
                     <Plus size={14}/>
                     <span>{lang === 'TH' ? 'เพิ่มวันหยุด' : 'Add Holiday'}</span>
                   </button>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="table table-striped mb-0 w-full text-left">
                   <thead className="bg-gray-100/50">
                      <tr>
                         <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider w-16">ลำดับ (No)</th>
                         <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider">วันหยุด / กิจกรรมพิเศษ (Event Holiday Name)</th>
                         <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider w-40">วันที่ (Calendar Date)</th>
                         <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider w-36">วันทำงาน (Day of Week)</th>
                         <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center w-36">ประเภท (Type Category)</th>
                          <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-wider text-center w-32">จัดการ (Actions)</th>
                      </tr>
                   </thead>
                   <tbody>
                      {filteredHolidays.map((h, i) => (
                        <tr key={i} className="hover:bg-slate-50/55 transition-colors border-b last:border-b-0">
                           <td className="py-4 px-6 font-mono text-xs text-gray-500 font-extrabold">{i + 1}</td>
                           <td className="py-4 px-6 align-middle">
                              <div className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                                 {h.type === 'national' && <Triangle size={12} className="text-rose-500 fill-rose-500/20"/>}
                                 {h.type === 'company' && <Building size={12} className="text-pink-500"/>}
                                 {h.type === 'inventory' && <Package size={12} className="text-amber-600"/>}
                                 <span>{lang === 'TH' ? h.nameTH : h.nameEN}</span>
                              </div>
                           </td>
                           <td className="py-4 px-6 align-middle">
                              <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                                 {h.date}
                              </span>
                           </td>
                           <td className="py-4 px-6 align-middle">
                              <span className="text-xs font-bold text-gray-500">
                                 {lang === 'TH' ? `วัน${h.dayOfWeekTH}` : h.dayOfWeekEN}
                              </span>
                           </td>
                           <td className="py-4 px-6 align-middle text-center">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border leading-none ${
                                 h.type === 'national' 
                                   ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                   : h.type === 'company' 
                                     ? 'bg-pink-50 text-pink-700 border-pink-200' 
                                     : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}>
                                 {h.type === 'national' && (lang === 'TH' ? 'หยุดราชการ/ประเพณี' : 'National')}
                                 {h.type === 'company' && (lang === 'TH' ? 'วันหยุดพิเศษบริษัท' : 'Company Special')}
                                 {h.type === 'inventory' && (lang === 'TH' ? 'ตรวจเช็กสต๊อกสินค้า' : 'Inventory Taking')}
                              </span>
                           </td>
                           <td className="py-4 px-6 align-middle text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                 <button
                                   onClick={() => {
                                     setEditingHoliday(h);
                                     setHolidayFormData({
                                       date: h.date,
                                       nameTH: h.nameTH,
                                       nameEN: h.nameEN,
                                       type: h.type
                                     });
                                     setShowHolidayModal(true);
                                   }}
                                   className="p-1.5 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors cursor-pointer"
                                   title={lang === 'TH' ? 'แก้ไขวันหยุด' : 'Edit Holiday'}
                                 >
                                    <Edit3 size={14} />
                                 </button>
                                 <button
                                    onClick={() => handleDeleteHoliday(h.date)}
                                    className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                    title={lang === 'TH' ? 'ลบวันหยุด' : 'Delete Holiday'}
                                 >
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>

             {/* Footer Legal Rules of the Calendar specified in the image */}
             <div className="p-6 bg-slate-50 border-t flex flex-col md:flex-row justify-between gap-6">
                <div className="max-w-2xl">
                   <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xs mb-1.5 uppercase tracking-widest">
                      <ShieldAlert size={14}/>
                      <span>หมายเหตุ (Note)</span>
                   </div>
                   <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                      บริษัทขอสงวนสิทธิ์ที่จะแก้ไข เปลี่ยนแปลงวันทำงาน วันหยุด และวันหยุดประเพณี ได้ตามความเหมาะสมและสถานการณ์เศรษฐกิจสมาคม
                   </p>
                   <p className="text-[10px] text-gray-400 mt-1 italic">
                      Remark: The company reserves the right to revise the working days, holidays, and traditional holidays upon the suitability of the situation.
                   </p>
                </div>
                <div className="flex flex-col items-start md:items-end md:justify-center border-l md:border-l-0 md:border-r-0 pl-4 md:pl-0">
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang === 'TH' ? 'ผู้อนุมัติปฏิทิน' : 'Issued & Authorized By'}</span>
                   <span className="font-extrabold text-slate-800 text-xs mt-1">Mr. Liu Dong</span>
                   <span className="text-[10px] text-slate-500 font-bold">{lang === 'TH' ? 'กรรมการผู้จัดการ' : 'Managing Director'}</span>
                   <span className="text-[9px] text-slate-400 mt-1 font-mono">Issued Date: 12_Nov_2025 (Rev. 00)</span>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Cloud-Connected Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-pink-500 p-6 flex items-center justify-between text-white">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl"><Plus size={20}/></div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">{editingActivity ? 'แก้ไขกิจกรรม Cloud' : 'สร้างกิจกรรมใหม่ Cloud'}</h3>
                 </div>
                 <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-5">
                 <div className="grid grid-cols-1 gap-5">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">หัวขอกิจกรรม (Activity Title)</label>
                       <input type="text" required className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-black text-gray-800" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                       <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">วันที่ (Date)</label>
                          <input type="date" required className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-bold text-gray-700 bg-gray-50/50" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                          <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">เริ่ม</label>
                             <input type="time" className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-bold" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
                          </div>
                          <div>
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">จบ</label>
                             <input type="time" className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-bold" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
                          </div>
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">สถานที่ (Location)</label>
                       <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={18}/>
                          <input type="text" className="w-full pl-11 pr-4 p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-bold" placeholder="ระบุสถานที่..." value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                       </div>
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">พนักงานที่เข้าร่วม (Participants - Comma separated)</label>
                       <textarea className="w-full p-3.5 text-sm border rounded-2xl h-24 outline-none focus:border-pink-500 font-medium leading-relaxed" placeholder="สมชาย รักดี, สมหญิง ขยันงาน..." value={formData.participants} onChange={e => setFormData({...formData, participants: e.target.value})} />
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-pink-500 text-white font-black rounded-2xl shadow-xl shadow-pink-100 flex items-center justify-center gap-3 hover:bg-pink-600 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em]">
                        {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                        {isLoading ? 'SYNCING CLOUD...' : 'SAVE TO GOOGLE SHEETS'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
      {/* Dynamic Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-pink-500 p-6 flex items-center justify-between text-white">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl"><Plus size={20}/></div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">{editingHoliday ? (lang === 'TH' ? 'แก้ไขวันหยุดองค์กร' : 'Edit Company Holiday') : (lang === 'TH' ? 'เพิ่มวันหยุดองค์กรใหม่' : 'Create Company Holiday')}</h3>
                 </div>
                 <button onClick={() => setShowHolidayModal(false)} className="hover:rotate-90 transition-transform"><X size={24}/></button>
              </div>
              <form onSubmit={handleSaveHoliday} className="p-8 space-y-5">
                 <div className="grid grid-cols-1 gap-5">
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{lang === 'TH' ? 'วันที่ (Calendar Date)' : 'Calendar Date'}</label>
                       <input 
                         type="date" 
                         required 
                         className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-bold text-gray-700 bg-gray-50/50" 
                         value={holidayFormData.date || ''} 
                         onChange={e => setHolidayFormData({...holidayFormData, date: e.target.value})} 
                       />
                    </div>
                    
                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{lang === 'TH' ? 'ชื่อวันหยุดภาษาไทย (Holiday Name TH)' : 'Holiday Name (Thai)'}</label>
                       <input 
                         type="text" 
                         required 
                         className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-black text-gray-800" 
                         value={holidayFormData.nameTH || ''} 
                         onChange={e => setHolidayFormData({...holidayFormData, nameTH: e.target.value})} 
                         placeholder="เช่น วันขึ้นปีใหม่"
                       />
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{lang === 'TH' ? 'ชื่อวันหยุดภาษาอังกฤษ (Holiday Name EN)' : 'Holiday Name (English)'}</label>
                       <input 
                         type="text" 
                         required 
                         className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-black text-gray-800" 
                         value={holidayFormData.nameEN || ''} 
                         onChange={e => setHolidayFormData({...holidayFormData, nameEN: e.target.value})} 
                         placeholder="e.g. New Year's Day"
                       />
                    </div>

                    <div>
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">{lang === 'TH' ? 'ประเภทวันหยุด (Holiday Category)' : 'Holiday Category'}</label>
                       <select 
                         className="w-full p-3.5 text-sm border rounded-2xl outline-none focus:border-pink-500 font-black text-gray-800 bg-white"
                         value={holidayFormData.type || 'national'}
                         onChange={e => setHolidayFormData({...holidayFormData, type: e.target.value as any})}
                       >
                          <option value="national">{lang === 'TH' ? 'หยุดราชการ/ประเพณี (National)' : 'National Holiday'}</option>
                          <option value="company">{lang === 'TH' ? 'พิเศษบริษัท (Company Special)' : 'Company Special Holiday'}</option>
                          <option value="inventory">{lang === 'TH' ? 'ตรวจสต๊อกคลัง (Inventory taking)' : 'Inventory Day'}</option>
                       </select>
                    </div>
                 </div>

                 <div className="pt-4 flex gap-4">
                    <button type="button" onClick={() => setShowHolidayModal(false)} className="flex-1 py-4 text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">Cancel</button>
                    <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-pink-500 text-white font-black rounded-2xl shadow-xl shadow-pink-100 flex items-center justify-center gap-3 hover:bg-pink-600 active:scale-95 transition-all text-[11px] uppercase tracking-[0.2em]">
                        {isLoading ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                        {isLoading ? 'SYNCING CLOUD...' : 'SAVE HOLIDAY'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default CompanyActivity;
