
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_TRAINING_PROGRESS, COLORS } from '../constants';
import { Course, TrainingProgress, Language } from '../types';
import { BookOpen, Plus, Edit2, Trash2, Search, Play, GraduationCap, Users, Clock, CheckCircle, X, Award, Download } from 'lucide-react';

// Add LMSModuleProps to handle incoming translation props
interface LMSModuleProps {
  lang: Language;
  t: any;
}

const LMSModule: React.FC<LMSModuleProps> = ({ lang, t }) => {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [progressData, setProgressData] = useState<TrainingProgress[]>(MOCK_TRAINING_PROGRESS);
  const [showModal, setShowModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'courses' | 'progress'>('courses');

  const handleOpenModal = (course?: Course) => {
    setCurrentCourse(course || { title: '', category: 'General', duration: '1h', modules: 1, enrolled: 0 });
    setShowModal(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse) return;
    if (currentCourse.id) {
      setCourses(courses.map(c => c.id === currentCourse.id ? (currentCourse as Course) : c));
    } else {
      const newCourse: Course = {
        ...currentCourse as Course,
        id: Math.random().toString(36).substr(2, 9),
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'
      };
      setCourses([newCourse, ...courses]);
    }
    setShowModal(false);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('ยืนยันการลบคอร์สนี้?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const generateCertificate = (prog: TrainingProgress) => {
    alert(`กำลังสร้างเกียรติบัตรสำหรับ ${prog.employeeName}\nคอร์ส: ${prog.courseTitle}\nวันที่สำเร็จ: ${prog.completionDate}`);
  };

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ศูนย์การเรียนรู้ (LMS)</h1>
          <p className="text-slate-500">พัฒนาทักษะพนักงานด้วยคอร์สออนไลน์และแบบทดสอบ</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleOpenModal()} className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2">
            <Plus size={20} />
            <span>สร้างคอร์สใหม่</span>
          </button>
        </div>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-sky-100 w-fit">
        <button onClick={() => setActiveView('courses')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'courses' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}>คอร์สเรียนทั้งหมด</button>
        <button onClick={() => setActiveView('progress')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeView === 'progress' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-500 hover:bg-sky-50'}`}>ความคืบหน้าพนักงาน</button>
      </div>

      {activeView === 'courses' ? (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาชื่อคอร์ส..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-sky-100 rounded-2xl outline-none" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-black uppercase text-sky-600">{course.category}</span></div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{course.enrolled} ลงทะเบียน</span>
                    <div className="flex gap-1">
                      <button onClick={() => handleOpenModal(course)} className="p-2 text-slate-400 hover:text-sky-500"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteCourse(course.id)} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-sky-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sky-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">พนักงาน</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">คอร์สเรียน</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">ความคืบหน้า</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase">สถานะ</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase text-center">เกียรติบัตร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {progressData.map(prog => (
                <tr key={prog.id} className="hover:bg-sky-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-700">{prog.employeeName}</td>
                  <td className="px-8 py-5 text-sm text-slate-600">{prog.courseTitle}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4 w-40">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-sky-400" style={{ width: `${prog.progress}%` }} /></div>
                      <span className="text-xs font-black text-sky-600">{prog.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${prog.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{prog.status}</span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {prog.status === 'Completed' ? (
                      <button onClick={() => generateCertificate(prog)} className="px-3 py-1.5 bg-sky-50 text-sky-600 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 hover:bg-sky-500 hover:text-white mx-auto transition-all"><Download size={12} /> สร้างเกียรติบัตร</button>
                    ) : <span className="text-slate-300">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LMSModule;
