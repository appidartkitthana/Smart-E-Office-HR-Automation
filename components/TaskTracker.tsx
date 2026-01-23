
import React, { useState, useMemo } from 'react';
import { MOCK_TASKS, MOCK_EMPLOYEES } from '../constants';
import { TaskStatus, Task, Language } from '../types';
import { Calendar, User, ChevronRight, Search, Filter, X, Check, Plus, AlertCircle, Trash2, Edit3 } from 'lucide-react';

// Add TaskTrackerProps to handle incoming translation props
interface TaskTrackerProps {
  lang: Language;
  t: any;
}

const TaskTracker: React.FC<TaskTrackerProps> = ({ lang, t }) => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Create/Edit Modal State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);

  // Filter States
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterAssignee, setFilterAssignee] = useState<string>('All');
  const [deadlineRange, setDeadlineRange] = useState({ start: '', end: '' });

  const assignees = useMemo(() => ['All', ...Array.from(new Set(MOCK_EMPLOYEES.map(t => t.name)))], []);

  const filteredTasks = tasks.filter(task => {
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'todo' && task.status === TaskStatus.TODO) ||
      (activeTab === 'in-progress' && task.status === TaskStatus.IN_PROGRESS) ||
      (activeTab === 'completed' && task.status === TaskStatus.COMPLETED);
    
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'All' || task.assignee === filterAssignee;
    
    let matchesDeadline = true;
    if (deadlineRange.start) {
        matchesDeadline = matchesDeadline && new Date(task.deadline) >= new Date(deadlineRange.start);
    }
    if (deadlineRange.end) {
        matchesDeadline = matchesDeadline && new Date(task.deadline) <= new Date(deadlineRange.end);
    }

    return matchesTab && matchesSearch && matchesPriority && matchesAssignee && matchesDeadline;
  });

  const handleOpenForm = (task?: Task) => {
    setEditingTask(task || {
      title: '',
      assignee: '',
      priority: 'Medium',
      status: TaskStatus.TODO,
      deadline: new Date().toISOString().split('T')[0]
    });
    setShowFormModal(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    if (editingTask.id) {
      // Edit
      setTasks(tasks.map(t => t.id === editingTask.id ? (editingTask as Task) : t));
    } else {
      // Create
      const newTask: Task = {
        ...editingTask as Task,
        id: Math.random().toString(36).substr(2, 9),
      };
      setTasks([newTask, ...tasks]);
    }
    setShowFormModal(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('ยืนยันการลบงานนี้?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const clearFilters = () => {
    setFilterPriority('All');
    setFilterAssignee('All');
    setDeadlineRange({ start: '', end: '' });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ติดตามภารกิจ (Task Tracking)</h1>
          <p className="text-slate-500">บริหารจัดการงานและติดตามสถานะความคืบหน้า</p>
        </div>
        <button 
            onClick={() => handleOpenForm()}
            className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2"
        >
            <Plus size={20} />
            <span>สร้างงานใหม่</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-sky-100 shadow-sm relative z-10">
        <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่องานหรือพนักงาน..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-200 outline-none"
            />
        </div>
        <div className="flex items-center gap-1 bg-sky-50 p-1 rounded-xl">
            {['all', 'todo', 'in-progress', 'completed'].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    {tab === 'all' ? 'ทั้งหมด' : tab === 'todo' ? 'รอดำเนินการ' : tab === 'in-progress' ? 'กำลังทำ' : 'เสร็จสิ้น'}
                </button>
            ))}
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setShowFilterModal(!showFilterModal)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all ${showFilterModal ? 'bg-sky-50 border-sky-300 text-sky-600' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
            >
                <Filter size={18} />
                <span className="text-sm font-bold">ตัวกรอง</span>
                {(filterPriority !== 'All' || filterAssignee !== 'All' || deadlineRange.start || deadlineRange.end) && (
                    <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                )}
            </button>

            {showFilterModal && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-sky-100 shadow-2xl rounded-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-slate-800">ตัวกรองขั้นสูง</h4>
                        <button onClick={clearFilters} className="text-xs text-sky-600 font-bold hover:underline">ล้างทั้งหมด</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">ความสำคัญ (Priority)</label>
                            <div className="flex flex-wrap gap-2">
                                {['All', 'High', 'Medium', 'Low'].map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setFilterPriority(p)}
                                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${filterPriority === p ? 'bg-sky-400 border-sky-400 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">ผู้รับผิดชอบ (Assignee)</label>
                            <select 
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-sky-100"
                            >
                                {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">ช่วงวันกำหนดส่ง (Deadline)</label>
                            <div className="flex flex-col gap-2">
                                <input 
                                    type="date" 
                                    value={deadlineRange.start}
                                    onChange={(e) => setDeadlineRange({...deadlineRange, start: e.target.value})}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none" 
                                />
                                <span className="text-[10px] text-center text-slate-300 font-bold">ถึง</span>
                                <input 
                                    type="date" 
                                    value={deadlineRange.end}
                                    onChange={(e) => setDeadlineRange({...deadlineRange, end: e.target.value})}
                                    className="w-full p-2 text-sm border border-slate-200 rounded-lg outline-none" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowFilterModal(false)}
                        className="w-full mt-6 py-2 bg-sky-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all"
                    >
                        ตกลง
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length > 0 ? filteredTasks.map((task) => (
          <div key={task.id} className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
            <div className="flex items-start gap-4 flex-1">
                <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${
                    task.status === TaskStatus.COMPLETED ? 'bg-green-400' : 
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-sky-400' : 'bg-slate-300'
                }`} />
                <div>
                    <h3 className="font-bold text-slate-800 text-lg group-hover:text-sky-600 transition-colors">{task.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <User size={14} className="text-slate-400" />
                            <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar size={14} className="text-slate-400" />
                            <span>กำหนดส่ง: {new Date(task.deadline).toLocaleDateString('th-TH')}</span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            task.priority === 'High' ? 'bg-rose-100 text-rose-600' : 
                            task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {task.priority}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block mr-4">
                    <span className={`text-[10px] font-black uppercase ${
                        task.status === 'เสร็จสิ้น' ? 'text-green-600' : 
                        task.status === 'กำลังทำ' ? 'text-sky-600' : 'text-slate-400'
                    }`}>
                        {task.status}
                    </span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-1000 ${
                                task.status === TaskStatus.COMPLETED ? 'bg-green-400 w-full' : 
                                task.status === TaskStatus.IN_PROGRESS ? 'bg-sky-400 w-1/2' : 'bg-slate-300 w-0'
                            }`}
                        />
                    </div>
                </div>
                <button onClick={() => handleOpenForm(task)} className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                    <Edit3 size={18} />
                </button>
                <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={18} />
                </button>
            </div>
          </div>
        )) : (
            <div className="bg-white p-20 rounded-[3rem] border border-dashed border-sky-200 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center text-sky-400 mb-4">
                    <X size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-600">ไม่พบภารกิจที่ตรงตามเงื่อนไข</h3>
                <p className="text-slate-400">ลองล้างตัวกรองหรือเปลี่ยนคำค้นหา</p>
                <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-sky-100 text-sky-600 rounded-xl font-bold hover:bg-sky-200 transition-colors">
                    ล้างตัวกรองทั้งหมด
                </button>
            </div>
        )}
      </div>

      {/* Create/Edit Task Modal */}
      {showFormModal && editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-200">
              <button onClick={() => setShowFormModal(false)} className="absolute right-8 top-8 p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"><X size={24} /></button>
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 bg-sky-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-sky-100 transform rotate-3">
                    <Plus size={28} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-slate-800">{editingTask.id ? 'แก้ไขงาน' : 'สร้างงานใหม่'}</h3>
                    <p className="text-sm text-slate-400 font-medium">ระบุรายละเอียดของภารกิจที่ต้องการติดตาม</p>
                 </div>
              </div>

              <form onSubmit={handleSaveTask} className="space-y-6">
                 <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">หัวข้อภารกิจ (Task Title)</label>
                        <input 
                            type="text" 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-200 shadow-sm"
                            value={editingTask.title || ''}
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                            placeholder="ระบุชื่องาน..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ผู้รับผิดชอบ (Assignee)</label>
                        <select 
                            required
                            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-sky-200 shadow-sm"
                            value={editingTask.assignee || ''}
                            onChange={(e) => setEditingTask({...editingTask, assignee: e.target.value})}
                        >
                            <option value="">เลือกพนักงาน...</option>
                            {MOCK_EMPLOYEES.map(emp => (
                                <option key={emp.id} value={emp.name}>{emp.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">ความสำคัญ (Priority)</label>
                            <select 
                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none"
                                value={editingTask.priority || 'Medium'}
                                onChange={(e) => setEditingTask({...editingTask, priority: e.target.value as any})}
                            >
                                <option value="High">สูง (High)</option>
                                <option value="Medium">ปานกลาง (Medium)</option>
                                <option value="Low">ต่ำ (Low)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">วันกำหนดส่ง (Deadline)</label>
                            <input 
                                type="date" 
                                required
                                className="w-full p-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold outline-none"
                                value={editingTask.deadline || ''}
                                onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">สถานะปัจจุบัน</label>
                        <div className="flex gap-2">
                            {Object.values(TaskStatus).map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setEditingTask({...editingTask, status})}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl border transition-all ${
                                        editingTask.status === status 
                                        ? 'bg-sky-500 border-sky-500 text-white shadow-md' 
                                        : 'bg-white border-slate-100 text-slate-400 hover:bg-sky-50'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <button 
                        type="button" 
                        onClick={() => setShowFormModal(false)} 
                        className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                    >
                        ยกเลิก
                    </button>
                    <button 
                        type="submit" 
                        className="flex-[2] py-4 bg-sky-500 text-white font-black rounded-2xl shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all text-lg"
                    >
                        {editingTask.id ? 'บันทึกการแก้ไข' : 'สร้างงานใหม่'}
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
