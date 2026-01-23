
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, QrCode, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { MOCK_ATTENDANCE } from '../constants';
import { Language } from '../types';

// Add AttendanceSystemProps to handle incoming translation props
interface AttendanceSystemProps {
  lang: Language;
  t: any;
}

const AttendanceSystem: React.FC<AttendanceSystemProps> = ({ lang, t }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [location, setLocation] = useState<string>('กำลังระบุตำแหน่ง...');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Simulate getting geolocation
    setTimeout(() => setLocation('อาคารสำนักงานใหญ่ (กรุงเทพฯ)'), 1500);
    
    return () => clearInterval(timer);
  }, []);

  const handleCheckAction = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">ลงเวลาเข้า-ออกงาน (Attendance)</h1>
        <p className="text-slate-500">ระบบเช็คชื่อด้วย GPS และ QR Code</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Check-in Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-sky-100 border border-sky-50 flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
                <div className="text-5xl font-black text-slate-800 tracking-tight">
                    {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-slate-400 font-medium mt-1">
                    {currentTime.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            <div className="w-48 h-48 bg-sky-50 rounded-3xl flex items-center justify-center border-4 border-dashed border-sky-200 relative group overflow-hidden">
                <QrCode size={100} className="text-sky-300 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-sky-400/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-sky-600 shadow-sm">สแกน QR Code</span>
                </div>
            </div>

            <div className="w-full space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <MapPin className="text-rose-400" size={20} />
                    <div className="flex-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ตำแหน่งปัจจุบัน</p>
                        <p className="text-sm font-semibold text-slate-700">{location}</p>
                    </div>
                </div>

                <button 
                    onClick={handleCheckAction}
                    className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 ${
                        isCheckedIn 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600' 
                        : 'bg-sky-500 text-white shadow-lg shadow-sky-200 hover:bg-sky-600'
                    }`}
                >
                    {isCheckedIn ? <LogOut /> : <LogIn />}
                    {isCheckedIn ? 'ลงชื่อออกงาน (Check-out)' : 'ลงชื่อเข้างาน (Check-in)'}
                </button>
            </div>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-sky-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">ประวัติสัปดาห์นี้</h3>
                <button className="text-sky-600 text-sm font-bold hover:underline">ดูทั้งหมด</button>
            </div>
            <div className="space-y-4">
                {MOCK_ATTENDANCE.map((rec) => (
                    <div key={rec.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-sky-50 transition-colors border border-transparent hover:border-sky-100">
                        <div className={`p-3 rounded-xl ${rec.status === 'Normal' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-700">{rec.name}</h4>
                            <p className="text-xs text-slate-400 font-medium">{rec.location}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">{rec.checkIn}</p>
                            <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                                rec.status === 'Normal' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'
                            }`}>
                                {rec.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Clock className="text-indigo-500" />
                    </div>
                    <div>
                        <p className="text-xs text-indigo-400 font-bold">เวลาทำงานรวมสัปดาห์นี้</p>
                        <p className="text-xl font-bold text-indigo-900">38 ชม. 45 นาที</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSystem;
