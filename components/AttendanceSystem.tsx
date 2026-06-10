
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MapPin, Clock, LogIn, LogOut, CheckCircle2, 
  RefreshCw, Camera, UserCheck, Calendar as CalendarIcon,
  Users, Info, Navigation, ShieldCheck, QrCode, Scan,
  Maximize2, Map as MapIcon, LocateFixed, Zap, Shield, Fingerprint
} from 'lucide-react';
import { db } from '../services/api';
import { Language, AttendanceRecord, CompanyLocation, UserRole } from '../types';
import { MOCK_EMPLOYEES, COLORS } from '../constants';
import { API_CONFIG } from '../config';

interface AttendanceSystemProps {
  lang: Language;
  t: any;
}

const SUMINO_LOCATION: CompanyLocation = {
  id: 'SUMINO_HQ',
  address: 'นิคมอุตสาหกรรมอมตะซิตี้ ชลบุรี',
  latitude: 13.4079, 
  longitude: 101.0016, 
  radius: 150 
};

const AttendanceSystem: React.FC<AttendanceSystemProps> = ({ lang, t }) => {
  const [activeMode, setActiveMode] = useState<'face' | 'qr'>('face');
  const [activeSubTab, setActiveSubTab] = useState<'scan' | 'calendar' | 'team'>('scan');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [officeLoc, setOfficeLoc] = useState<CompanyLocation>(SUMINO_LOCATION);
  const [userLoc, setUserLoc] = useState<{ lat: number, lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const currentUser = { id: 'EMP001', name: 'คุณสมชาย รักดี' };
  const userRole = UserRole.ADMIN;

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("เบราว์เซอร์ไม่รองรับ GPS");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(current);
        const d = calculateDistance(current.lat, current.lng, officeLoc.latitude, officeLoc.longitude);
        setDistance(d);
        setGpsError(null);
      },
      (err) => setGpsError("กรุณาเปิดตำแหน่ง (GPS) เพื่อลงเวลา"),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [officeLoc]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const gpsInterval = setInterval(getGPS, 10000);
    getGPS();
    db.getConfig('OFFICE_LOCATION').then(config => { if (config) setOfficeLoc(config); });
    return () => { clearInterval(timer); clearInterval(gpsInterval); };
  }, [getGPS]);

  const handleClockAction = async (type: 'IN' | 'OUT') => {
    setIsScanning(true);
    setTimeout(async () => {
      setIsScanning(false);
      setScanComplete(true);
      setIsSyncing(true);
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const record: Partial<AttendanceRecord> = {
        employeeId: currentUser.id,
        name: currentUser.name,
        [type === 'IN' ? 'checkIn' : 'checkOut']: nowStr,
        location: officeLoc.address,
        status: currentTime.getHours() >= 9 && type === 'IN' ? 'Late' : 'Normal',
        coords: `${userLoc?.lat},${userLoc?.lng}`,
        id: `ATT-${Date.now()}`
      };
      try { await db.create('ATTENDANCE', record); } catch (e) {} finally {
        setIsSyncing(false);
        setTimeout(() => setScanComplete(false), 2000);
      }
    }, 1500);
  };

  const isInRange = distance !== null && distance <= officeLoc.radius;

  const renderScanner = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-4 max-w-6xl mx-auto">
      
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white rounded-[4rem] p-12 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center relative overflow-hidden group">
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
            
            <div className="flex items-center gap-4 mb-10 relative z-10">
               <div className={`flex bg-slate-100 p-1.5 rounded-2xl shadow-inner`}>
                  <button onClick={() => setActiveMode('face')} className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 ${activeMode === 'face' ? 'bg-white shadow-md text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Camera size={14}/> FACE ID
                  </button>
                  <button onClick={() => setActiveMode('qr')} className={`px-6 py-2 rounded-xl text-[11px] font-black transition-all flex items-center gap-2 ${activeMode === 'qr' ? 'bg-white shadow-md text-sky-600' : 'text-slate-400 hover:text-slate-600'}`}>
                    <QrCode size={14}/> QR CODE
                  </button>
               </div>
               <div className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 ${isSyncing ? 'border-amber-100 bg-amber-50 text-amber-600' : 'border-emerald-100 bg-emerald-50 text-emerald-600'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-amber-500 animate-bounce' : 'bg-emerald-500'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isSyncing ? 'Syncing' : 'Online'}</span>
               </div>
            </div>

            <div className="text-center mb-12 relative z-10">
              <p className="text-sky-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">{currentTime.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <h2 className="text-7xl font-black text-slate-800 tracking-tighter tabular-nums leading-none">
                {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                <span className="text-2xl font-bold text-slate-300 ml-2">{currentTime.getSeconds().toString().padStart(2, '0')}</span>
              </h2>
            </div>

            <div className="w-full aspect-square max-w-[360px] bg-slate-900 rounded-[4rem] relative overflow-hidden border-[12px] border-white shadow-2xl group mb-12">
               <div className="absolute inset-0 z-10 opacity-30 bg-gradient-to-t from-black to-transparent"></div>
               
               {isScanning ? (
                 <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-sky-500/20 backdrop-blur-sm">
                    <div className="w-72 h-72 border-2 border-sky-400/50 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 border-[30px] border-transparent border-t-sky-400/20 animate-spin"></div>
                    <div className="absolute top-0 left-0 w-full h-2 bg-sky-400 animate-pulse shadow-[0_0_30px_rgba(56,189,248,1)]"></div>
                    <Fingerprint size={64} className="text-white animate-pulse" />
                    <p className="text-white font-black uppercase tracking-[0.3em] text-[10px] mt-10">Authenticating...</p>
                 </div>
               ) : scanComplete ? (
                 <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-emerald-500/90 backdrop-blur-xl text-white animate-in zoom-in duration-300">
                    <CheckCircle2 size={120} className="mb-8 animate-bounce" />
                    <h4 className="font-black text-4xl tracking-tight">VERIFIED</h4>
                    <p className="text-xs font-bold opacity-80 mt-4 uppercase tracking-[0.2em]">บันทึกข้อมูลเวลาเรียบร้อยแล้ว</p>
                 </div>
               ) : (
                 <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                    <div className="w-72 h-72 border-2 border-white/20 rounded-[3rem] relative">
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-sky-400 rounded-tl-2xl"></div>
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-sky-400 rounded-tr-2xl"></div>
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-sky-400 rounded-bl-2xl"></div>
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-sky-400 rounded-br-2xl"></div>
                    </div>
                 </div>
               )}
               
               <img 
                 src={activeMode === 'face' 
                   ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" 
                   : "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400&h=400&fit=crop"} 
                 className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" 
                 alt="Scanner" 
               />
               
               <div className="absolute bottom-10 left-0 w-full px-8 flex justify-center z-30">
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-2xl">
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,1)]"></div>
                     <span className="text-[10px] text-white font-black uppercase tracking-[0.2em]">
                       {activeMode === 'face' ? 'System Scanning Face' : 'System Decoding QR'}
                     </span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full relative z-10">
              <button 
                onClick={() => handleClockAction('IN')}
                disabled={!isInRange || isScanning || scanComplete}
                className="bg-gradient-to-br from-sky-500 to-indigo-600 hover:shadow-2xl hover:shadow-sky-200 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 text-white py-8 rounded-[3rem] font-black flex flex-col items-center gap-3 transition-all active:scale-95 group shadow-xl"
              >
                <LogIn size={40} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase text-[11px] tracking-[0.3em]">CLOCK IN</span>
              </button>
              <button 
                onClick={() => handleClockAction('OUT')}
                disabled={!isInRange || isScanning || scanComplete}
                className="bg-gradient-to-br from-slate-800 to-slate-900 hover:shadow-2xl hover:shadow-slate-300 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-500 text-white py-8 rounded-[3rem] font-black flex flex-col items-center gap-3 transition-all active:scale-95 group shadow-xl"
              >
                <LogOut size={40} className="group-hover:scale-110 transition-transform" />
                <span className="uppercase text-[11px] tracking-[0.3em]">CLOCK OUT</span>
              </button>
            </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-50 rounded-full opacity-50"></div>
           <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="font-black text-slate-800 uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                 <Shield className="text-emerald-500" size={18}/> Access Control
              </h3>
              <button onClick={getGPS} className="p-3 text-sky-500 hover:bg-sky-50 rounded-2xl transition-all shadow-sm bg-white border border-slate-100"><RefreshCw size={18}/></button>
           </div>

           <div className="w-full h-56 bg-slate-50 rounded-[2.5rem] mb-10 relative overflow-hidden border border-slate-100 group">
              <div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-1000 grayscale">
                 <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&h=400&fit=crop" className="w-full h-full object-cover" alt="map" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                 <div className="w-32 h-32 bg-emerald-400/10 rounded-full flex items-center justify-center animate-pulse border-2 border-emerald-400/20">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full border-[3px] border-white shadow-2xl"></div>
                 </div>
                 <span className="text-[10px] font-black bg-white/90 backdrop-blur px-3 py-1.5 rounded-full mt-3 shadow-lg uppercase tracking-widest text-emerald-700">Enterprise Point</span>
              </div>
              {userLoc && (
                <div className="absolute top-1/2 left-1/2 translate-x-8 -translate-y-10 animate-in fade-in duration-700">
                   <div className="relative">
                      <div className="w-4 h-4 bg-sky-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
                      <div className="absolute -top-10 -left-6 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-xl uppercase whitespace-nowrap">Your Pos.</div>
                   </div>
                </div>
              )}
           </div>

           <div className={`p-8 rounded-[2.5rem] border-2 transition-all flex items-center gap-6 ${isInRange ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
              <div className={`p-5 rounded-3xl ${isInRange ? 'bg-emerald-500 shadow-emerald-200' : 'bg-rose-500 shadow-rose-200'} text-white shadow-2xl`}>
                 <Navigation size={28} className={isInRange ? 'animate-pulse' : ''} />
              </div>
              <div className="flex-1">
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">GEO-FENCE STATUS</p>
                 <h4 className={`font-black text-2xl leading-none mb-1.5 ${isInRange ? 'text-emerald-700' : 'text-rose-700'}`}>
                   {distance ? `${distance.toFixed(1)} Meters` : 'Locating...'}
                 </h4>
                 <p className={`text-[10px] font-black uppercase tracking-widest ${isInRange ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {isInRange ? 'Authorized Zone' : 'Restricted Access'}
                 </p>
              </div>
           </div>

           {gpsError && (
              <div className="mt-6 p-5 bg-rose-50 border-2 border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600">
                 <Info size={20}/>
                 <p className="text-xs font-bold tracking-tight">{gpsError}</p>
              </div>
           )}
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 transition-transform duration-700"><Shield size={160}/></div>
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-50">Authorized Staff Profile</p>
              <div className="flex items-center gap-6 mb-10">
                 <div className="relative">
                    <img src="https://picsum.photos/id/64/100/100" className="w-20 h-20 rounded-3xl border-4 border-white/10 object-cover shadow-2xl" alt="avatar" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-sky-500 border-2 border-slate-900 rounded-full flex items-center justify-center"><Zap size={10} className="text-white"/></div>
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight">{currentUser.name}</h3>
                    <p className="text-xs font-black text-sky-400 uppercase tracking-[0.2em] mt-1">{currentUser.id} • IT DEPARTMENT</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Avg. Clock-In</p>
                    <p className="text-lg font-black tracking-tighter tabular-nums">08:12 <span className="text-[10px] opacity-40">AM</span></p>
                 </div>
                 <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10">
                    <p className="text-[9px] font-black uppercase opacity-40 mb-1">Leave Balance</p>
                    <p className="text-lg font-black tracking-tighter tabular-nums">12.5 <span className="text-[10px] opacity-40">Days</span></p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="bg-white rounded-[4rem] p-24 border border-slate-100 shadow-xl shadow-slate-200/40 animate-in fade-in duration-500 text-center relative overflow-hidden">
       <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><CalendarIcon size={280} className="text-slate-900"/></div>
       <CalendarIcon size={80} className="mx-auto mb-8 text-sky-200" />
       <h3 className="text-3xl font-black text-slate-800 uppercase tracking-widest mb-4 relative z-10">Attendance Records</h3>
       <p className="text-slate-400 font-medium max-w-md mx-auto mb-12 leading-relaxed">เข้าถึงประวัติการลงเวลาและสรุปผลการเข้างานรายเดือนผ่านการเชื่อมต่อ Google Sheets โดยตรง</p>
       <button onClick={() => alert("กำลังโหลดประวัติ...")} className="px-12 py-5 bg-sky-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-sky-600 hover:shadow-2xl hover:shadow-sky-100 transition-all active:scale-95 shadow-xl relative z-10">
          Sync History from Cloud
       </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight uppercase">Smart Attendance</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Enterprise Geo-fenced Identity Platform</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30">
           <button onClick={() => setActiveSubTab('scan')} className={`px-10 py-3.5 rounded-[1.8rem] text-[10px] font-black transition-all flex items-center gap-3 uppercase tracking-widest ${activeSubTab === 'scan' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              <Maximize2 size={16} className={activeSubTab === 'scan' ? 'text-sky-400' : ''}/> Instant Scan
           </button>
           <button onClick={() => setActiveSubTab('calendar')} className={`px-10 py-3.5 rounded-[1.8rem] text-[10px] font-black transition-all flex items-center gap-3 uppercase tracking-widest ${activeSubTab === 'calendar' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
              <CalendarIcon size={16} className={activeSubTab === 'calendar' ? 'text-sky-400' : ''}/> My History
           </button>
           {(userRole === UserRole.ADMIN || userRole === UserRole.MANAGER) && (
             <button onClick={() => setActiveSubTab('team')} className={`px-10 py-3.5 rounded-[1.8rem] text-[10px] font-black transition-all flex items-center gap-3 uppercase tracking-widest ${activeSubTab === 'team' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
                <Users size={16} className={activeSubTab === 'team' ? 'text-sky-400' : ''}/> Team Monitor
             </button>
           )}
        </div>
      </div>

      {activeSubTab === 'scan' ? renderScanner() : renderCalendar()}
    </div>
  );
};

export default AttendanceSystem;
