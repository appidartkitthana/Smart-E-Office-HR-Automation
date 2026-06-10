
import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  UserCheck, 
  FileText, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Calendar,
  Box,
  Truck,
  Wrench,
  CreditCard,
  Building,
  ShoppingCart,
  Files,
  Settings,
  History,
  PartyPopper
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: <LayoutDashboard size={20} />, color: 'text-sky-500' },
  { id: 'company-activity', label: 'กิจกรรมบริษัท', icon: <PartyPopper size={20} />, color: 'text-pink-500' },
  { id: 'tasks', label: 'ติดตามงาน', icon: <ClipboardList size={20} />, color: 'text-indigo-500' },
  { id: 'approvals', label: 'ระบบอนุมัติ', icon: <FileText size={20} />, color: 'text-rose-500' },
  { id: 'document-requests', label: 'คำร้องเอกสาร', icon: <Files size={20} />, color: 'text-violet-500' },
  { id: 'procurement', label: 'จัดซื้อจัดจ้าง', icon: <ShoppingCart size={20} />, color: 'text-amber-500' },
  { id: 'performance', label: 'KPI & ผลงาน', icon: <TrendingUp size={20} />, color: 'text-teal-500' },
  { id: 'training', label: 'การอบรม (LMS)', icon: <BookOpen size={20} />, color: 'text-cyan-500' },
  { id: 'leave', label: 'การลา & OT', icon: <Calendar size={20} />, color: 'text-orange-500' },
  { id: 'inventory', label: 'พัสดุ & อุปกรณ์', icon: <Box size={20} />, color: 'text-amber-600' },
  { id: 'vehicles', label: 'จองรถส่วนกลาง', icon: <Truck size={20} />, color: 'text-slate-600' },
  { id: 'rooms', label: 'จองห้องประชุม', icon: <Building size={20} />, color: 'text-indigo-600' },
  { id: 'maintenance', label: 'แจ้งซ่อม', icon: <Wrench size={20} />, color: 'text-zinc-500' },
  { id: 'expenses', label: 'เบิกค่าใช้จ่าย', icon: <CreditCard size={20} />, color: 'text-emerald-600' },
  { id: 'system-activity', label: 'กิจกรรมระบบ', icon: <History size={20} />, color: 'text-rose-400' },
  { id: 'settings', label: 'ตั้งค่าระบบ Cloud', icon: <Settings size={20} />, color: 'text-slate-400' },
];

export const MOCK_EMPLOYEES = [
  { id: 'EMP001', name: 'สมชาย รักดี' },
  { id: 'EMP002', name: 'สมหญิง ขยันงาน' },
  { id: 'EMP003', name: 'วิชัย มีชัย' },
  { id: 'EMP004', name: 'อาทิตย์ สดใส' }
];

export const DEPARTMENTS = ['ทั้งหมด', 'IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Production', 'Safety'];

export const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2', '#e83e8c', '#fd7e14', '#20c997', '#6f42c1'];

export const MOCK_APPROVALS = [
  { id: '1', title: 'ลาพักร้อน 3 วัน', requester: 'สมชาย รักดี', type: 'Leave', date: '2024-05-20', status: 'Pending' },
  { id: '2', title: 'เบิกค่าเดินทางไปนิคมฯ', requester: 'สมหญิง ขยันงาน', type: 'Expense', date: '2024-05-19', status: 'Approved' },
  { id: '3', title: 'ขอทำ OT 4 ชม.', requester: 'วิชัย มีชัย', type: 'OT', date: '2024-05-21', status: 'Pending' },
];

export const MOCK_KPI = [
  { id: '1', employeeId: 'EMP001', employeeName: 'สมชาย รักดี', period: 'Q1 2024', score: 85, status: 'Approved', date: '2024-04-10' },
  { id: '2', employeeId: 'EMP002', employeeName: 'สมหญิง ขยันงาน', period: 'Q1 2024', score: 92, status: 'Approved', date: '2024-04-12' },
];

export const MOCK_OKRS = [
  { id: '1', objective: 'เพิ่มประสิทธิภาพการผลิต 10%', progress: 65, owner: 'Production Dept', deadline: '2024-12-31' },
  { id: '2', objective: 'ลดอัตราการลาออกของพนักงาน', progress: 40, owner: 'HR Dept', deadline: '2024-12-31' },
];

export const MOCK_LEAVES = [
  { id: '1', employeeId: 'EMP001', employeeName: 'สมชาย รักดี', type: 'ลากิจ', reason: 'ธุระครอบครัว', startDate: '2024-05-25', endDate: '2024-05-26', status: 'Pending' },
];

export const MOCK_OTS = [
  { id: '1', employeeId: 'EMP002', employeeName: 'สมหญิง ขยันงาน', hours: 4, reason: 'เคลียร์งานด่วน', date: '2024-05-20', status: 'Approved' },
];

export const MOCK_INVENTORY = [
  { id: '1', name: 'ถุงมือกันความร้อน', category: 'PPE', stock: 50, minStock: 20, unit: 'คู่' },
  { id: '2', name: 'กระดาษ A4', category: 'Office', stock: 5, minStock: 10, unit: 'รีม' },
];

export const MOCK_SUPPLY_REQUESTS = [
  { id: '1', itemId: '2', itemName: 'กระดาษ A4', quantity: 10, status: 'Pending' },
];

export const MOCK_VEHICLES = [
  { id: '1', model: 'Toyota Hilux Revo', plateNumber: 'กข 1234', type: 'Pickup', status: 'Available' },
  { id: '2', model: 'Toyota Commuter', plateNumber: 'ฮน 5678', type: 'Van', status: 'Busy' },
];

export const MOCK_VEHICLE_BOOKINGS = [
  { id: '1', vehicleId: '2', vehicleName: 'Toyota Commuter', employeeName: 'สมชาย รักดี', driverName: 'นายพูนศักดิ์', startDate: '2024-05-22', destination: 'กรุงเทพฯ', status: 'Confirmed' },
];

export const MOCK_MEETING_ROOMS = [
  { id: '1', name: 'ห้องประชุม A1', capacity: 20, facilities: ['Projector', 'Whiteboard', 'Conference Call'], status: 'Available' },
  { id: '2', name: 'ห้องประชุม B2', capacity: 10, facilities: ['TV', 'Whiteboard'], status: 'Busy' },
];

export const MOCK_ROOM_BOOKINGS = [
  { id: '1', roomId: '2', roomName: 'ห้องประชุม B2', employeeName: 'สมหญิง ขยันงาน', department: 'IT', date: '2024-05-22', startTime: '10:00', endTime: '12:00', title: 'Sprint Planning', status: 'Confirmed', members: 8, guests: 0 },
];

export const MOCK_MAINTENANCE_TICKETS = [
  { id: '1', item: 'เครื่องพิมพ์ชั้น 2', category: 'IT', description: 'กระดาษติดบ่อย', requester: 'วิชัย มีชัย', priority: 'Medium', status: 'In Progress' },
];

export const MOCK_EXPENSE_CLAIMS = [
  { id: '1', title: 'ค่าทางด่วนไปพบลูกค้า', category: 'Travel', amount: 150, date: '2024-05-18', requester: 'สมหญิง ขยันงาน', status: 'Approved' },
];

export const MOCK_PR = [
  { id: 'PR-2024-001', requester: 'สมชาย รักดี', department: 'IT', type: 'Hardware', totalAmount: 45000, status: 'Pending' },
];

export const MOCK_PO = [
  { id: 'PO-2024-001', vendorName: 'IT Solutions Co.', prRef: 'PR-2024-001', deliveryDate: '2024-06-01', totalAmount: 45000, status: 'Approved' },
];

export const FORM_CATALOG = [
  { code: 'F-HR-011', name: 'ใบลืมบันทึกเวลา Request for not a finger scan', category: 'HR' },
  { code: 'F-HR-020', name: 'หนังสือรับรองเงินเดือน Salary certificate', category: 'HR' },
  { code: 'F-HR-057', name: 'แบบฟอร์มการเบิกสวัสดิการค่ารักษาพยาบาล', category: 'HR' },
];
