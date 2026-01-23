
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModulePlaceholderProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-24 h-24 bg-sky-100 rounded-[2.5rem] flex items-center justify-center text-sky-500 mb-6 shadow-xl shadow-sky-100 transform rotate-6 hover:rotate-0 transition-transform duration-500">
        <Icon size={48} />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium">{description}</p>
      <div className="flex gap-4">
        <button className="px-8 py-3 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">
          เพิ่มข้อมูลใหม่
        </button>
        <button className="px-8 py-3 bg-white border border-sky-100 text-sky-500 rounded-2xl font-bold hover:bg-sky-50 transition-all">
          ดูคู่มือการใช้งาน
        </button>
      </div>
      
      {/* Mock content grid to give a sense of UI */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 opacity-40 select-none grayscale">
          {[1,2,3].map(i => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
                  <div className="w-12 h-2 bg-slate-100 rounded mb-4"></div>
                  <div className="w-full h-4 bg-slate-50 rounded mb-2"></div>
                  <div className="w-2/3 h-4 bg-slate-50 rounded"></div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default ModulePlaceholder;
