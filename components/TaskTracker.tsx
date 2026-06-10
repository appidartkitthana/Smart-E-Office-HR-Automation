
import React, { useState, useMemo, useEffect } from 'react';
import { db } from '../services/api';
import { TaskStatus, Task, Language } from '../types';
import { MOCK_EMPLOYEES } from '../constants';
import { API_CONFIG } from '../config';
import { 
  Calendar, User, ChevronRight, Search, Filter, X, 
  Check, Plus, AlertCircle, Trash2, Edit3, MoreVertical, 
  FileText, Clock, RefreshCw, Save, CheckCircle, List, ArrowRightCircle
} from 'lucide-react';

interface TaskTrackerProps {
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
      ดูรายละเอียด <ArrowRightCircle size={10} className="inline ml-1"/>
    </div>
  </div>
);

const TaskTracker: React.FC<TaskTrackerProps> = ({ lang, t }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    assignee: '',
    priority: 'Medium',
    status: TaskStatus.TODO,
    deadline: new Date().toISOString().split('T')[0]
  });

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const data = await db.getAll('TASKS');
      if (data) {
        // แฟล็กข้อมูลเพื่อให้แน่ใจว่า field ถูกต้อง
        setTasks(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Error loading tasks:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === TaskStatus.TODO).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'todo' && task.status === TaskStatus.TODO) ||
        (activeTab === 'in-progress' && task.status === TaskStatus.IN_PROGRESS) ||
        (activeTab === 'completed' && task.status === TaskStatus.COMPLETED);
      
      const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (task.assignee || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      assignee: '',
      priority: 'Medium',
      status: TaskStatus.TODO,
      deadline: new Date().toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({ ...task });
    setShowModal(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingTask) {
        // บันทึกการแก้ไข (Update)
        const result = await db.update('TASKS', editingTask.id, formData);
        if (!result) throw new Error("Update failed");
      } else {
        // สร้างใหม่ (Create)
        const newTask = {
          ...formData,
          id: `T${Date.now()}`
        };
        const result = await db.create('TASKS', newTask);
        if (!result) throw new Error("Create failed");
      }
      await loadTasks();
      setShowModal(false);
    } catch (e) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาตรวจสอบสคริปต์ Google Apps Script");
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStatusChange = async (task: Task, newStatus: TaskStatus) => {
    // แสดงสถานะกำลังโหลดแบบเจาะจงเฉพาะแถว หรือใช้ global loading
    setIsLoading(true);
    try {
      const updatedData = { ...task, status: newStatus };
      const result = await db.update('TASKS', task.id, updatedData);
      if (result) {
        // อัปเดต state ทันทีเพื่อความลื่นไหลของ UI
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
      } else {
        throw new Error("Update status failed");
      }
    } catch (e) {
      alert("ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง");
      await loadTasks(); // ย้อนกลับไปค่าเดิมจาก Server
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบงานนี้?")) return;
    setIsLoading(true);
    try {
      const result = await db.delete('TASKS', id);
      if (result) {
        await loadTasks();
      }
    } catch (e) {
      alert("Error deleting task");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500 pb-10">
      
      {/* Dashboard Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBox title="งานทั้งหมด" value={stats.total} icon={<List size={60}/>} bgColor="bg-info" />
        <InfoBox title="รอดำเนินการ" value={stats.todo} icon={<Clock size={60}/>} bgColor="bg-warning" />
        <InfoBox title="กำลังดำเนินการ" value={stats.inProgress} icon={<RefreshCw size={60}/>} bgColor="bg-primary" />
        <InfoBox title="เสร็จสมบูรณ์" value={stats.completed} icon={<CheckCircle size={60}/>} bgColor="bg-success" />
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 rounded shadow-sm border-l-4 border-primary">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('all')} className={`whitespace-nowrap px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'all' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>ทั้งหมด</button>
            <button onClick={() => setActiveTab('todo')} className={`whitespace-nowrap px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'todo' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>To Do</button>
            <button onClick={() => setActiveTab('in-progress')} className={`whitespace-nowrap px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'in-progress' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>In Progress</button>
            <button onClick={() => setActiveTab('completed')} className={`whitespace-nowrap px-4 py-1.5 rounded text-xs font-bold transition-all ${activeTab === 'completed' ? 'bg-primary text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>Completed</button>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่องาน หรือ ผู้รับผิดชอบ..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full pl-8 pr-4 py-1.5 text-xs border rounded bg-white outline-none focus:border-primary shadow-sm" 
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <button 
              onClick={loadTasks} 
              disabled={isLoading}
              className="p-1.5 bg-white border rounded hover:bg-gray-50 text-gray-400 transition-all shadow-sm"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={handleOpenCreate}
              className="bg-success text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95"
            >
                <Plus size={16} /> สร้างงานใหม่
            </button>
        </div>
      </div>

      <div className="card border-t-4 border-info shadow-sm">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-lg font-normal text-gray-800 flex items-center gap-2">
            <FileText size={18} className="text-info" /> ระบบติดตามงานอัจฉริยะ (Real-time Tracker)
          </h3>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Database: Online</span>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table table-striped mb-0">
            <thead className="bg-gray-50">
              <tr>
                <th style={{ width: '10px' }}>#</th>
                <th style={{ minWidth: '200px' }}>รายละเอียดงาน</th>
                <th>ผู้รับผิดชอบ</th>
                <th>ลำดับความสำคัญ</th>
                <th className="text-center">วันครบกำหนด</th>
                <th className="text-center" style={{ width: '150px' }}>อัปเดตสถานะ</th>
                <th className="text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && tasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center">
                    <RefreshCw className="animate-spin inline-block mr-2 text-primary" />
                    <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">กำลังซิงค์กับ Google Sheets...</span>
                  </td>
                </tr>
              ) : filteredTasks.map((task, idx) => (
                <tr key={task.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="align-middle text-gray-400">{idx + 1}.</td>
                  <td className="align-middle">
                    <div className="font-bold text-gray-800 text-xs">{task.title}</div>
                    <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">ID: {task.id}</div>
                  </td>
                  <td className="align-middle">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{task.assignee?.charAt(0)}</div>
                      <span className="text-xs text-gray-600 font-medium">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="align-middle">
                    <span className={`badge ${
                        task.priority === 'High' ? 'bg-danger' : 
                        task.priority === 'Medium' ? 'bg-warning' : 'bg-primary'
                    }`}>
                        {task.priority === 'High' ? 'สำคัญสูง' : task.priority === 'Medium' ? 'ปานกลาง' : 'ปกติ'}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-gray-600 flex items-center justify-center gap-1">
                          <Calendar size={12} className="text-gray-400"/> {task.deadline || '-'}
                       </span>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <select 
                      value={task.status}
                      onChange={(e) => handleQuickStatusChange(task, e.target.value as TaskStatus)}
                      disabled={isLoading}
                      className={`text-[10px] font-bold uppercase rounded px-2 py-1 outline-none border cursor-pointer transition-all ${
                        task.status === TaskStatus.COMPLETED ? 'bg-success text-white border-green-600' : 
                        task.status === TaskStatus.IN_PROGRESS ? 'bg-info text-white border-cyan-600' : 
                        'bg-gray-100 text-gray-600 border-gray-300'
                      }`}
                    >
                      <option value={TaskStatus.TODO}>To Do</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                  </td>
                  <td className="text-right align-middle">
                    <div className="flex justify-end gap-1 px-2">
                      <button onClick={() => handleOpenEdit(task)} className="p-1.5 bg-info text-white rounded shadow-sm hover:bg-cyan-600 transition-all"><Edit3 size={12}/></button>
                      <button onClick={() => handleDeleteTask(task.id)} className="p-1.5 bg-danger text-white rounded shadow-sm hover:bg-red-600 transition-all"><Trash2 size={12}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 italic text-[10px] font-bold uppercase">ไม่พบรายการงาน</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="card-footer bg-white border-t p-3 flex justify-between items-center">
           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Sync ID: {API_CONFIG.GOOGLE_SHEET_ID.substring(0, 10)}...</span>
           <div className="flex items-center gap-3">
              {isLoading && <span className="text-[10px] font-black text-primary animate-pulse uppercase tracking-[0.2em]">กำลังซิงค์ Cloud...</span>}
              <button onClick={loadTasks} className="text-xs font-bold text-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
                <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> ดึงข้อมูลล่าสุด
              </button>
           </div>
        </div>
      </div>

      {/* Task Creation / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded shadow-2xl overflow-hidden border">
             <div className="bg-primary px-4 py-3 flex items-center justify-between text-white">
                <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                   {editingTask ? <Edit3 size={18}/> : <Plus size={18}/>}
                   {editingTask ? 'แก้ไขรายละเอียดงาน' : 'สร้างโครงการ/งานใหม่'}
                </h3>
                <button onClick={() => setShowModal(false)} className="hover:text-gray-200 transition-colors"><X size={20} /></button>
             </div>
             <form onSubmit={handleSaveTask} className="p-6 space-y-4">
                <div>
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">หัวข้อโครงการ / งาน</label>
                   <input 
                     type="text" 
                     required 
                     className="w-full p-2.5 text-sm border rounded outline-none focus:border-primary font-bold text-gray-700" 
                     placeholder="ระบุชื่องาน..."
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">ผู้รับผิดชอบ</label>
                    <select 
                      className="w-full p-2.5 text-sm border rounded outline-none focus:border-primary font-bold text-gray-700 bg-white"
                      value={formData.assignee}
                      onChange={e => setFormData({...formData, assignee: e.target.value})}
                      required
                    >
                      <option value="">เลือกพนักงาน...</option>
                      {MOCK_EMPLOYEES.map(emp => (
                        <option key={emp.id} value={emp.name}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">วันครบกำหนด</label>
                    <input 
                      type="date" 
                      required 
                      className="w-full p-2.5 text-sm border rounded outline-none focus:border-primary font-bold text-gray-700" 
                      value={formData.deadline}
                      onChange={e => setFormData({...formData, deadline: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">ความสำคัญ</label>
                    <div className="flex gap-2">
                      {['High', 'Medium', 'Low'].map(p => (
                        <button 
                          key={p} 
                          type="button"
                          onClick={() => setFormData({...formData, priority: p as any})}
                          className={`flex-1 py-2 rounded text-[10px] font-black uppercase transition-all ${formData.priority === p ? (p === 'High' ? 'bg-danger text-white' : p === 'Medium' ? 'bg-warning text-white' : 'bg-primary text-white') : 'bg-gray-100 text-gray-400'}`}
                        >
                          {p === 'High' ? 'สูง' : p === 'Medium' ? 'กลาง' : 'ปกติ'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">สถานะ</label>
                    <select 
                      className="w-full p-2.5 text-sm border rounded outline-none focus:border-primary font-bold text-gray-700 bg-white"
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value={TaskStatus.TODO}>To Do</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-2">
                   <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-all uppercase tracking-widest"
                   >
                     ยกเลิก
                   </button>
                   <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-[2] py-3 text-xs font-bold text-white bg-primary rounded hover:bg-blue-600 transition-all shadow-lg uppercase tracking-widest flex items-center justify-center gap-2"
                   >
                     {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                     {isSaving ? 'กำลังบันทึก...' : (editingTask ? 'อัปเดตงาน' : 'สร้างงาน')}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTracker;
