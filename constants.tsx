
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
  Files
} from 'lucide-react';
import { 
  Task, TaskStatus, AttendanceRecord, ApprovalRequest, Employee, 
  KPI, OKR, Course, TrainingProgress, LeaveRequest, OTRequest, 
  InventoryItem, SupplyRequest, Vehicle, VehicleBooking, 
  MeetingRoom, RoomBooking, MaintenanceTicket, ExpenseClaim,
  PurchaseRequisition, PurchaseOrder, CAPEXProject, UserRole
} from './types';

export const COLORS = {
  primary: '#38bdf8', // sky-400
  secondary: '#7dd3fc', // sky-300
  accent: '#bae6fd', // sky-200
  success: '#86efac', // green-300
  warning: '#fde047', // yellow-300
  error: '#fca5a5', // red-300
};

export const DEPARTMENTS = ['ทั้งหมด', 'IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Production', 'Safety'];

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'แดชบอร์ด', icon: <LayoutDashboard size={20} /> },
  { id: 'tasks', label: 'ติดตามงาน', icon: <ClipboardList size={20} /> },
  { id: 'attendance', label: 'ลงเวลางาน', icon: <UserCheck size={20} /> },
  { id: 'approvals', label: 'ระบบอนุมัติ', icon: <FileText size={20} /> },
  { id: 'document-requests', label: 'คำร้องเอกสาร', icon: <Files size={20} /> },
  { id: 'employees', label: 'พนักงาน', icon: <Users size={20} /> },
  { id: 'procurement', label: 'จัดซื้อจัดจ้าง', icon: <ShoppingCart size={20} /> },
  { id: 'performance', label: 'KPI & ผลงาน', icon: <TrendingUp size={20} /> },
  { id: 'training', label: 'การอบรม (LMS)', icon: <BookOpen size={20} /> },
  { id: 'leave', label: 'การลา & OT', icon: <Calendar size={20} /> },
  { id: 'inventory', label: 'พัสดุ & อุปกรณ์', icon: <Box size={20} /> },
  { id: 'vehicles', label: 'จองรถส่วนกลาง', icon: <Truck size={20} /> },
  { id: 'rooms', label: 'จองห้องประชุม', icon: <Building size={20} /> },
  { id: 'maintenance', label: 'แจ้งซ่อม', icon: <Wrench size={20} /> },
  { id: 'expenses', label: 'เบิกค่าใช้จ่าย', icon: <CreditCard size={20} /> },
];

export const FORM_CATALOG = [
  { code: 'MISC-001', name: 'CCTV Request Form', category: 'Admin' },
  { code: 'MISC-002', name: 'รายงานการมาทำงานสาย', category: 'HR' },
  { code: 'F-HR-001', name: 'ใบขอขอกำลังคน Manpower Requisition Form', category: 'Recruitment' },
  { code: 'F-HR-002', name: 'ใบสมัครงาน APPLICATION Form (Rev.02)', category: 'Recruitment' },
  { code: 'F-HR-003', name: 'ใบประเมินผลสัมภาษณ์งาน Assessment Interview Form', category: 'Recruitment' },
  { code: 'DF-HR-004', name: 'ใบอนุมัติค่าจ้างและสวัสดิการ Salary & Welfare Form', category: 'Compensation' },
  { code: 'F-HR-005', name: 'ใบประเมินทดลองงาน รายเดือน Assessment Probation Form', category: 'Performance' },
  { code: 'F-HR-006', name: 'ใบประเมินทดลองงาน รายวัน Interview Assessment Probation Form', category: 'Performance' },
  { code: 'F-HR-007', name: 'ใบขอลาออก Resignation Form (Rev.01)', category: 'HR' },
  { code: 'F-HR-008', name: 'แบบสำรวจความพึงพอใจพนักงานลาออก 従業員満足度調査表', category: 'HR' },
  { code: 'F-HR-009', name: 'ใบผ่านบุคคลภายนอก Gate Pass (Rev.03)', category: 'Admin' },
  { code: 'F-HR-010', name: 'ใบขออนุญาตนำทรัพย์สินออกนอกโรงงาน', category: 'Admin' },
  { code: 'F-HR-011', name: 'ใบลืมบันทึกเวลา Request for not a finger scan', category: 'Attendance' },
  { code: 'F-HR-012', name: 'ใบขออนุญาตออกนอกบริษัท Request for leave company', category: 'Attendance' },
  { code: 'F-HR-013', name: 'แบบฟอร์มหัวจดหมาย Head Paper', category: 'Admin' },
  { code: 'F-HR-014', name: 'บันทึกการสอบสวน Investigation record', category: 'Legal' },
  { code: 'F-HR-015', name: 'หนังสือเตือนลายลักษณ์อักษร Warning Letter', category: 'Legal' },
  { code: 'F-HR-016', name: 'บันทึกการตักเตือนด้วยวาจา Verbal warning record', category: 'Legal' },
  { code: 'F-HR-017', name: 'ใบแจ้งพักงาน Suspension Notice', category: 'Legal' },
  { code: 'F-HR-018', name: 'ใบแจ้งข้อกล่าวหา Letter of charge', category: 'Legal' },
  { code: 'F-HR-019', name: 'ใบขอทำงานล่วงเวลาและวันหยุด Request for OT and Holiday Work (Rev.01)', category: 'Compensation' },
  { code: 'F-HR-020', name: 'หนังสือรับรองเงินเดือน Salary certificate', category: 'Certification' },
  { code: 'F-HR-021', name: 'หนังสือรับรองการทำงาน(TH) Employment Certification', category: 'Certification' },
  { code: 'F-HR-022', name: 'หนังสือรับรองการทำงาน (EN) Employment Certification', category: 'Certification' },
  { code: 'F-HR-025', name: 'ใบลงชื่อเข้าร่วมประชุม Meeting Registration', category: 'Admin' },
  { code: 'F-HR-026', name: 'ใบขออนุมัติเปลี่ยนแปลงตำแหน่ง', category: 'HR' },
  { code: 'F-HR-027', name: 'ใบลา Attendance Record (Rev.02)', category: 'Attendance' },
  { code: 'F-HR-028', name: 'ใบรับทราบการปรับ Up Salary & Welfare', category: 'Compensation' },
  { code: 'DF-HR-029', name: 'ใบคำร้องขอใบรับรอง Request certificate form', category: 'Certification' },
  { code: 'F-HR-030', name: 'สัญญาจ้างพนักงาน Contract', category: 'Recruitment' },
  { code: 'F-HR-031', name: 'ใบเบิกค่าอาหาร Request food for outside working (Rev.01)', category: 'Welfare' },
  { code: 'F-HR-032', name: 'ใบเบิกค่าน้ำมันรถส่วนตัว Request transport by private car', category: 'Welfare' },
  { code: 'F-HR-033', name: 'จัดเตรียมงานธุรการสำหรับพนักงานใหม่ New Employee Admin Preparation', category: 'Admin' },
  { code: 'F-HR-034', name: 'ประกาศรับสมัครงาน Job postings', category: 'Recruitment' },
  { code: 'F-HR-035', name: 'ใบแจ้งซ่อมรถยนต์ Request maintenance car', category: 'Admin' },
  { code: 'DF-HR-036', name: 'แบบฟอร์มการขอใช้รถบริษัทฯ Request use car', category: 'Admin' },
  { code: 'F-HR-038', name: 'ประวัติการฝึกอบรม Training Record', category: 'Training' },
  { code: 'F-HR-039', name: 'แบบรายงานการทำความสะอาด', category: 'Admin' },
  { code: 'F-HR-040', name: 'ระเบียบข้อบังคับของพนักงานตั้งครรภ์ Regulations regarding pregnant employees (Rev.02)', category: 'Legal' },
  { code: 'F-HR-041', name: 'ขออนุญาตนำยานพาหนะเข้ามาในบริษัท', category: 'Admin' },
  { code: 'F-HR-042', name: 'ตารางกะทำงาน shift Scheduled form', category: 'Attendance' },
  { code: 'F-HR-044', name: 'Job description', category: 'HR' },
  { code: 'F-HR-045', name: 'Skill matrix Form (Rev.01)', category: 'Training' },
  { code: 'D-F-HR-046', name: 'OJT Form', category: 'Training' },
  { code: 'F-HR-047', name: 'แบบประเมินประจำปี', category: 'Performance' },
  { code: 'F-HR-048', name: 'แบบฟอร์มแจ้งความประสงค์ขอรับเงินค่าอายุงาน', category: 'Welfare' },
  { code: 'F-HR-049', name: 'แบบฟอร์มขอเบิกสวัสดิการ กองทุนการศึกษาบุตร', category: 'Welfare' },
  { code: 'F-HR-050', name: 'แบบฟอร์มขอลดตำแหน่ง', category: 'HR' },
  { code: 'F-HR-051', name: 'แบบฟอร์มขอเบิกสวัสดิการ เงินค่าทะเบียนสมรส', category: 'Welfare' },
  { code: 'F-HR-052', name: 'แบบสำรวจความจำเป็นในการฝึกอบรม Training Needs (Rev.01)', category: 'Training' },
  { code: 'F-HR-053', name: 'แบบฟอร์มลงทะเบียนเข้ารับการอบรม Training register', category: 'Training' },
  { code: 'F-HR-054', name: 'แบบฟอร์มการขอฝึกอบรม Training Request Form (Rev.03)', category: 'Training' },
  { code: 'F-HR-055', name: 'แบบฟอร์มรายงานการฝึกอบรม Training-Seminar Report (Rev.02)', category: 'Training' },
  { code: 'F-HR-056', name: 'แบบฟอร์มแผนการฝึกอบรม SAT TRAINING PLAN', category: 'Training' },
  { code: 'F-HR-057', name: 'แบบฟอร์มการเบิกสวัสดิการค่ารักษาพยาบาล Form for receiving medical benefits (Rev:02)', category: 'Welfare' },
  { code: 'F-HR-058', name: 'หนังสือแจ้งขอเกษียณอายุ', category: 'HR' },
  { code: 'F-HR-059', name: 'หนังสือแจ้งอนุมัติพนักงานเกษียณอายุ', category: 'HR' },
  { code: 'F-HR-060', name: 'แบบฟอร์มขอเบิกสวัสดิการของขวัญรับขวัญบุตร', category: 'Welfare' },
  { code: 'F-HR-061', name: 'แบบฟอร์มขอเบิกสวัสดิการเงินช่วยเหลือค่างานศพและพวงหรีด', category: 'Welfare' },
  { code: 'F-HR-062', name: 'ทะเบียนหลักสูตรอบรม (Training Roadmap and Need)', category: 'Training' },
  { code: 'DF-HR-063', name: 'แบบรายงานการติดตามประเมินผลการฝึกอบรม', category: 'Training' },
];

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'เตรียมรายงานประจำปี 2567', assignee: 'สมชาย รักดี', priority: 'High', status: TaskStatus.IN_PROGRESS, deadline: '2024-05-20' },
  { id: '2', title: 'ตรวจสอบงบประมาณฝ่ายไอที', assignee: 'สมหญิง ขยันงาน', priority: 'Medium', status: TaskStatus.TODO, deadline: '2024-05-25' },
  { id: '3', title: 'จัดประชุมนโยบาย HR ใหม่', assignee: 'วิชัย มีชัย', priority: 'High', status: TaskStatus.COMPLETED, deadline: '2024-05-15' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: '1', employeeId: 'EMP001', name: 'สมชาย รักดี', checkIn: '08:15', location: 'สำนักงานใหญ่', status: 'Normal' },
  { id: '2', employeeId: 'EMP002', name: 'สมหญิง ขยันงาน', checkIn: '08:45', location: 'สำนักงานใหญ่', status: 'Late' },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  { id: '1', requester: 'นพดล เก่งกาจ', type: 'Leave', title: 'ลาพักร้อน 3 วัน', status: 'Pending', date: '2024-05-18' },
  { id: '2', requester: 'พรพิศ มั่นคง', type: 'Expense', title: 'ค่ารับรองลูกค้า', status: 'Approved', date: '2024-05-17', amount: 2500 },
];

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'สมชาย รักดี', position: 'Senior Developer', department: 'IT', status: 'Active', avatar: 'https://picsum.photos/id/64/100/100', role: UserRole.ADMIN },
  { id: '2', name: 'สมหญิง ขยันงาน', position: 'HR Manager', department: 'HR', status: 'Active', avatar: 'https://picsum.photos/id/65/100/100', role: UserRole.HR },
  { id: '3', name: 'วิชัย มีชัย', position: 'Accounting Officer', department: 'Finance', status: 'On Leave', avatar: 'https://picsum.photos/id/91/100/100', role: UserRole.MANAGER },
  { id: '4', name: 'อาทิตย์ สดใส', position: 'Marketing Lead', department: 'Marketing', status: 'Active', avatar: 'https://picsum.photos/id/101/100/100', role: UserRole.EMPLOYEE },
];

export const MOCK_KPI: KPI[] = [
  { id: '1', employeeId: '1', employeeName: 'สมชาย รักดี', period: 'Q1 2024', score: 88, status: 'Approved', comments: 'ยอดเยี่ยมมาก', date: '2024-03-31' },
];

export const MOCK_OKRS: OKR[] = [
  { id: '1', objective: 'เพิ่มยอดผู้ใช้ระบบ E-Office 20%', progress: 65, owner: 'ฝ่าย Marketing', deadline: '2024-06-30' },
  { id: '2', objective: 'ลดเวลาการจัดซื้อจัดจ้าง 50%', progress: 40, owner: 'ฝ่าย Operations', deadline: '2024-12-31' },
];

export const MOCK_COURSES: Course[] = [
  { id: '1', title: 'การใช้งานระบบ Smart E-Office เบื้องต้น', category: 'General', duration: '2h 30m', modules: 5, enrolled: 120, thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=250&fit=crop' },
];

export const MOCK_TRAINING_PROGRESS: TrainingProgress[] = [
  { id: '1', employeeId: '1', employeeName: 'สมชาย รักดี', courseId: '1', courseTitle: 'การใช้งานระบบ Smart E-Office เบื้องต้น', progress: 100, status: 'Completed', completionDate: '2024-05-10' },
];

export const MOCK_LEAVES: LeaveRequest[] = [
  { id: 'L1', employeeId: '1', employeeName: 'สมชาย รักดี', type: 'Annual', startDate: '2024-06-01', endDate: '2024-06-03', reason: 'ธุระส่วนตัว', status: 'Pending' },
];

export const MOCK_OTS: OTRequest[] = [
  { id: 'OT1', employeeId: '1', employeeName: 'สมชาย รักดี', date: '2024-05-15', hours: 3, reason: 'เคลียร์งานโปรเจกต์', status: 'Approved' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'กระดาษ A4 (Double A)', category: 'Office Supplies', stock: 45, minStock: 20, unit: 'Reams' },
  { id: 'PPE1', name: 'รองเท้าเซฟตี้ (Safety Shoes)', category: 'PPE', stock: 12, minStock: 5, unit: 'Pairs' },
  { id: 'PPE2', name: 'หมวกนิรภัย (Helmet - White)', category: 'PPE', stock: 8, minStock: 2, unit: 'Pcs' },
  { id: 'PPE3', name: 'แว่นตานิรภัย (Goggles)', category: 'PPE', stock: 25, minStock: 10, unit: 'Pcs' },
  { id: 'PPE4', name: 'ถุงมือกันบาด (Cut-resistant Gloves)', category: 'PPE', stock: 30, minStock: 15, unit: 'Pairs' },
];

export const MOCK_SUPPLY_REQUESTS: SupplyRequest[] = [
  { id: 'REQ1', employeeId: '1', employeeName: 'สมชาย รักดี', itemName: 'กระดาษ A4', quantity: 2, requestDate: '2024-05-18', status: 'Pending' },
  { id: 'REQ2', employeeId: '4', employeeName: 'อาทิตย์ สดใส', itemName: 'รองเท้าเซฟตี้', quantity: 1, requestDate: '2024-05-19', status: 'Approved' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'V1', model: 'Toyota Camry', plateNumber: 'กข 1234', type: 'Sedan', status: 'Available' },
  { id: 'V2', model: 'Toyota Commuter', plateNumber: 'ฮพ 9999', type: 'Van', status: 'Busy' },
  { id: 'V3', model: 'Honda CR-V', plateNumber: 'รน 5678', type: 'SUV', status: 'Available' },
];

export const MOCK_VEHICLE_BOOKINGS: VehicleBooking[] = [
  { id: 'VB1', vehicleId: 'V2', vehicleName: 'Toyota Commuter (ฮพ 9999)', employeeName: 'สมชาย รักดี', startDate: '2024-05-20', endDate: '2024-05-20', destination: 'ระยอง', driverName: 'นายมานะ ไปเรียน', status: 'Approved' },
];

export const MOCK_MEETING_ROOMS: MeetingRoom[] = [
  { id: 'R1', name: 'Meeting Room Tokyo F1', capacity: 20, facilities: ['Projector', 'Whiteboard'], status: 'Available' },
  { id: 'R2', name: 'Meeting Room Okinawa F2', capacity: 15, facilities: ['Monitor', 'Whiteboard'], status: 'Busy' },
  { id: 'R3', name: 'Meeting Room Hiroshima VIP F2', capacity: 10, facilities: ['Luxury Seating', 'Video Conference'], status: 'Available' },
];

export const MOCK_ROOM_BOOKINGS: RoomBooking[] = [
  { 
    id: 'RB1', 
    roomId: 'R2', 
    roomName: 'Meeting Room Okinawa F2', 
    employeeName: 'Thanawuth P.', 
    department: 'Sales',
    date: '2025-12-02', 
    startTime: '13:30', 
    endTime: '15:00', 
    title: 'Summit Keylex (Thailand)', 
    members: 9,
    guests: 7,
    sat: 2,
    equipment: ['Welcome Board', 'Projector'],
    safetyEquipment: [{ name: 'Cloth Hat', quantity: 7 }, { name: 'Glasses', quantity: 7 }, { name: 'Cool Cloth', quantity: 9 }],
    catering: [{ name: 'Coffee', quantity: 8 }, { name: 'Water', quantity: 9 }],
    tableLayout: 'Boardroom',
    notes: 'ลูกค้า Summit Keylex',
    status: 'Approved' 
  },
];

export const MOCK_MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  { id: 'MT1', requester: 'สมชาย รักดี', item: 'จอคอมพิวเตอร์', category: 'IT', description: 'จอกะพริบเป็นระยะ', priority: 'Medium', status: 'Pending', date: '2024-05-18' },
  { id: 'MT2', requester: 'วิชัย มีชัย', item: 'เครื่องปรับอากาศ', category: 'Building', description: 'แอร์มีเสียงดังผิดปกติ', priority: 'High', status: 'In Progress', date: '2024-05-17' },
];

export const MOCK_EXPENSE_CLAIMS: ExpenseClaim[] = [
  { id: 'EX1', requester: 'พรพิศ มั่นคง', category: 'Entertainment', title: 'เลี้ยงรับรองลูกค้าโปรเจกต์ A', amount: 3500, date: '2024-05-16', status: 'Approved' },
];

export const MOCK_PR: PurchaseRequisition[] = [
  {
    id: 'PR-2024-001',
    date: '2024-05-15',
    department: 'IT',
    type: 'OPEX',
    justification: 'Replacement of broken laptops for new dev team',
    items: [{ id: 'I1', description: 'Dell Latitude 5420', unit: 'Pcs', quantity: 3, unitPrice: 35000, total: 105000 }],
    requester: 'สมชาย รักดี',
    totalAmount: 105000,
    status: 'Approved',
    requesterSign: { status: 'Approved', signerName: 'สมชาย รักดี', signedDate: '2024-05-15' },
    supervisorSign: { status: 'Approved', signerName: 'หัวหน้าไอที', signedDate: '2024-05-16' },
    purchasingSign: { status: 'Approved', signerName: 'เจ้าหน้าที่จัดซื้อ', signedDate: '2024-05-17' },
    mdSign: { status: 'Approved', signerName: 'Managing Director', signedDate: '2024-05-18' }
  }
];

export const MOCK_PO: PurchaseOrder[] = [
  {
    id: 'PO-2024-001',
    date: '2024-05-20',
    prRef: 'PR-2024-001',
    vendorName: 'Tech Solution Co., Ltd.',
    vendorAddress: '123 Rama 9, Bangkok',
    taxId: '0105555000123',
    paymentTerms: 'Credit 30 Days',
    deliveryDate: '2024-05-30',
    items: [{ id: 'I1', description: 'Dell Latitude 5420', unit: 'Pcs', quantity: 3, unitPrice: 35000, total: 105000 }],
    totalAmount: 105000,
    status: 'Closed',
    purchasingSign: { status: 'Approved', signerName: 'เจ้าหน้าที่จัดซื้อ', signedDate: '2024-05-20' },
    supervisorSign: { status: 'Approved', signerName: 'หัวหน้าไอที', signedDate: '2024-05-21' },
    mdSign: { status: 'Approved', signerName: 'Managing Director', signedDate: '2024-05-22' }
  }
];

export const MOCK_CAPEX: CAPEXProject[] = [
  {
    id: 'CPX-2024-01',
    name: 'Expansion Project Phase 1',
    totalValue: 2500000,
    lifespan: 10,
    roi: '15% annually',
    strategicReason: 'Support multi-province logistics growth',
    status: 'Approved'
  }
];
