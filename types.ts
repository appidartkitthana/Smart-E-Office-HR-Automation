
export type Language = 'TH' | 'EN' | 'JP';

export enum TaskStatus {
  TODO = 'รอดำเนินการ',
  IN_PROGRESS = 'กำลังทำ',
  COMPLETED = 'เสร็จสิ้น',
  OVERDUE = 'ล่าช้า'
}

export enum UserRole {
  ADMIN = 'Super Admin',
  HR = 'HR Admin',
  MANAGER = 'Manager',
  EMPLOYEE = 'Employee'
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface CompanyActivity {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string; // Comma-separated names
  details: string;
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: TaskStatus;
  deadline: string;
}

export interface Employee {
  id: string;
  empNo: string;
  nameThai: string;
  nameEng: string;
  dept: string;
  pos: string;
  startWorking: string;
  name?: string;
  department?: string;
  position?: string;
  status?: 'Active' | 'Inactive';
  role?: UserRole;
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  checkIn: string;
  checkOut?: string;
  location: string;
  status: 'Normal' | 'Late' | 'Absent';
  coords?: string;
}

export interface CompanyLocation {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export type ApprovalType = 'Leave' | 'Expense' | 'OT' | 'F-HR-002' | 'F-HR-007' | 'F-HR-011' | 'F-HR-057' | 'F-HR-063';

export interface ApprovalRequest {
  id: string;
  title: string;
  requester: string;
  type: ApprovalType;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface KPI {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  score: number;
  status: 'Draft' | 'Approved' | 'Pending';
  date: string;
  comments?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface OTRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  hours: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'PPE' | 'Office' | 'IT' | 'Tools';
  stock: number;
  minStock: number;
  unit: string;
}

export interface SupplyRequest {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Vehicle {
  id: string;
  model: string;
  plateNumber: string;
  type: string;
  status: 'Available' | 'Busy' | 'Maintenance';
}

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  employeeName: string;
  driverName?: string;
  startDate: string;
  destination: string;
  status: string;
}

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: 'Available' | 'Busy';
}

export interface RoomBooking {
  id: string;
  roomId: string;
  roomName: string;
  employeeName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  status: string;
  members: number;
  guests: number;
}

export interface MaintenanceTicket {
  id: string;
  item: string;
  category: 'IT' | 'General';
  description: string;
  requester: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ExpenseClaim {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  requester: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PurchaseRequisition {
  id: string;
  requester: string;
  department: string;
  type: string;
  totalAmount: number;
  status: string;
}

export interface PurchaseOrder {
  id: string;
  vendorName: string;
  prRef: string;
  deliveryDate?: string;
  totalAmount: number;
  status: string;
}

export interface DocumentRequest {
  id: string;
  formCode: string;
  formName: string;
  requester: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Completed';
}
