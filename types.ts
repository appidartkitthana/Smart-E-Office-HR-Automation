
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

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: TaskStatus;
  deadline: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  checkIn: string;
  checkOut?: string;
  location: string;
  status: 'Normal' | 'Late' | 'Absent';
}

export type ApprovalType = 
  | 'Leave' 
  | 'Expense' 
  | 'OT' 
  | 'Certificate'
  | 'F-HR-002' 
  | 'F-HR-007' 
  | 'F-HR-011' 
  | 'F-HR-057' 
  | 'F-HR-063';

export interface ApprovalRequest {
  id: string;
  requester: string;
  type: ApprovalType;
  title: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  amount?: number;
  formId?: string;
  details?: any;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar: string;
  role: UserRole;
}

export interface KPI {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  score: number;
  status: 'Draft' | 'Submitted' | 'Approved';
  comments: string;
  date: string;
}

export interface OKR {
  id: string;
  objective: string;
  progress: number;
  owner: string;
  deadline: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  modules: number;
  enrolled: number;
  thumbnail: string;
}

export interface TrainingProgress {
  id: string;
  employeeId: string;
  employeeName: string;
  courseId: string;
  courseTitle: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  completionDate?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Sick' | 'Annual' | 'Personal' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface OTRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  hours: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unit: string;
}

export interface SupplyRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  itemName: string;
  quantity: number;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Vehicle {
  id: string;
  model: string;
  plateNumber: string;
  type: 'Sedan' | 'Van' | 'SUV' | 'Pickup';
  status: 'Available' | 'Busy' | 'Maintenance';
}

export interface VehicleBooking {
  id: string;
  vehicleId: string;
  vehicleName: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  destination: string;
  driverName?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  status: 'Available' | 'Busy' | 'Maintenance';
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
  members: number;
  guests: number;
  sat: number;
  equipment: string[];
  safetyEquipment: { name: string; quantity: number }[];
  catering: { name: string; quantity: number }[];
  tableLayout: string;
  notes: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface MaintenanceTicket {
  id: string;
  requester: string;
  item: string;
  category: 'IT' | 'Building' | 'Other';
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  date: string;
}

export interface ExpenseClaim {
  id: string;
  requester: string;
  category: 'Travel' | 'Medical' | 'Entertainment' | 'Other';
  title: string;
  amount: number;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  receiptUrl?: string;
}

export type ProcurementType = 'OPEX' | 'CAPEX';

export interface ProcurementItem {
  id: string;
  partNo?: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  purchaseObjective?: string;
}

export interface Signature {
  dataUrl?: string;
  signerName: string;
  signedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface PurchaseRequisition {
  id: string; 
  date: string;
  department: string;
  type: ProcurementType;
  justification: string;
  items: ProcurementItem[];
  requester: string;
  totalAmount: number;
  status: 'Draft' | 'Pending Supervisor' | 'Pending Purchasing' | 'Pending MD' | 'Approved' | 'Rejected' | 'Converted to PO';
  
  suggestedVendor?: string;
  vendorAddress?: string;
  vendorTel?: string;
  vendorFax?: string;
  
  // Sequential Signatures for PR
  requesterSign: Signature;
  supervisorSign: Signature;
  purchasingSign: Signature;
  mdSign: Signature;

  attachments?: string[];
}

export interface PurchaseOrder {
  id: string;
  date: string;
  prRef: string;
  vendorName: string;
  vendorAddress: string;
  taxId?: string;
  paymentTerms?: string;
  deliveryDate?: string;
  shippingAddress?: string;
  creditTerm?: string;
  deptOrder?: string;
  capreNo?: string;
  items: ProcurementItem[];
  totalAmount: number;
  status: 'Draft' | 'Pending Purchasing' | 'Pending Supervisor' | 'Pending MD' | 'Approved' | 'Rejected' | 'Closed';

  // Sequential Signatures for PO (matches SUMINO layout: Issued -> Check -> Approved)
  purchasingSign: Signature;
  supervisorSign: Signature;
  mdSign: Signature;
  
  attachments?: string[];
}

export interface CAPEXProject {
  id: string;
  name: string;
  totalValue: number;
  lifespan: number;
  roi: string;
  strategicReason: string;
  status: 'Proposed' | 'Reviewed' | 'Approved' | 'Implemented';
}

export interface DocumentRequest {
  id: string;
  formCode: string;
  formName: string;
  requester: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  notes?: string;
}
