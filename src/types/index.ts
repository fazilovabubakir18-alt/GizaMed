export type UserRole = 
  | 'super_admin'     // Markaz egasi / Super admin
  | 'branch_manager'  // Filial rahbari
  | 'admin'           // Administrator
  | 'crm_manager'     // Menejer / Sotuv
  | 'cashier'         // Kassir
  | 'teacher'         // O‘qituvchi
  | 'student_parent'  // Talaba yoki Ota-ona
  | 'support_agent';  // Texnik yordam

export type LanguageCode = 'uz_latin' | 'uz_cyrl' | 'ru' | 'en';

export type ThemePreset = 
  | 'midnight' 
  | 'ocean' 
  | 'aurora' 
  | 'violet' 
  | 'graphite' 
  | 'minimal_white' 
  | 'dark_premium'
  | 'custom';

export type FontFamily = 
  | 'Plus Jakarta Sans'
  | 'Manrope'
  | 'Inter'
  | 'Outfit'
  | 'JetBrains Mono';

export type InterfaceDensity = 'comfortable' | 'compact';
export type InterfaceScale = 'small' | 'normal' | 'large';

export interface ThemeConfig {
  preset: ThemePreset;
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  sidebarColor: string;
  fontFamily: FontFamily;
  density: InterfaceDensity;
  scale: InterfaceScale;
}

export type StudentStatus = 
  | 'new'            // yangi
  | 'trial'          // sinov darsida
  | 'active'         // faol
  | 'frozen'         // vaqtincha to‘xtatgan
  | 'graduated'      // kursni tugatgan
  | 'expelled';      // chiqarilgan

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  birthDate: string;
  branchId: string;
  courseId: string;
  groupId: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  address?: string;
  enrolledDate: string;
  status: StudentStatus;
  balance: number;      // musbat bo'lsa oldindan to'lov, manfiy bo'lsa qarz
  monthlyFee: number;
  discountPercent?: number;
  notes?: string;
  avatarUrl?: string;
  attendanceRate: number; // 0-100%
  averageGrade: number;   // 0-100
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  managerName: string;
  activeStudentsCount: number;
  roomsCount: number;
  monthlyRevenue: number;
}

export interface Course {
  id: string;
  title: string;
  subject: string;
  durationMonths: number;
  pricePerMonth: number;
  description: string;
  level: 'Beginner' | 'Elementary' | 'Intermediate' | 'Advanced' | 'All levels';
  branchIds: string[];
}

export interface Room {
  id: string;
  branchId: string;
  name: string;
  capacity: number;
  equipment: string[];
}

export interface Group {
  id: string;
  name: string;
  courseId: string;
  branchId: string;
  teacherId: string;
  roomId: string;
  daysOfWeek: ('Dush' | 'Sesh' | 'Chor' | 'Pay' | 'Jum' | 'Shan' | 'Yak')[];
  startTime: string; // "14:00"
  endTime: string;   // "16:00"
  capacity: number;
  startDate: string;
  endDate: string;
  monthlyFee: number;
  status: 'active' | 'forming' | 'completed';
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late' | 'remote';

export interface AttendanceRecord {
  id: string;
  groupId: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  note?: string;
  markedBy: string;
  updatedAt: string;
}

export interface Homework {
  id: string;
  groupId: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  createdAt: string;
  totalSubmissions: number;
  evaluatedSubmissions: number;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submittedAt: string;
  content: string;
  fileAttachment?: string;
  grade?: number; // 1-100
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
}

export type LeadStage = 
  | 'yangi'                   // 1. Yangi lid
  | 'boglanish_kutilmoqda'    // 2. Bog‘lanish kutilmoqda
  | 'boglanildi'              // 3. Bog‘lanildi
  | 'sinov_darsiga_yozildi'   // 4. Sinov darsiga yozildi
  | 'sinov_qatnashdi'         // 5. Sinov darsida qatnashdi
  | 'qaror_qabul_qilmoqda'    // 6. Qaror qabul qilmoqda
  | 'shartnoma_yuborildi'     // 7. Shartnoma yuborildi
  | 'shartnoma_tasdiqlandi'   // 8. Shartnoma tasdiqlandi
  | 'tolov_amalga_oshirildi'  // 9. To‘lov amalga oshirildi
  | 'faol_oquvchi'            // 10. Faol o‘quvchiga aylandi
  | 'yoqotilgan';             // 11. Yo‘qotilgan lid

export type LeadSource = 
  | 'telegram' 
  | 'instagram' 
  | 'website' 
  | 'call' 
  | 'walk_in' 
  | 'referral' 
  | 'ads';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  courseId: string;
  branchId: string;
  source: LeadSource;
  stage: LeadStage;
  assignedManager: string;
  nextFollowUpDate?: string;
  notes?: string;
  createdAt: string;
  convertedStudentId?: string;
  estimatedValue: number;
}

export type ContractStatus = 
  | 'draft'               // Qoralama
  | 'sent'                // Yuborildi
  | 'sms_verified'        // SMS bilan tasdiqlandi
  | 'officialized'        // Rasmiylashtirildi
  | 'rejected'            // Rad etildi
  | 'cancelled';          // Bekor qilindi

export interface Contract {
  id: string;
  contractNumber: string; // e.g. "EDU-2026-0849"
  studentId: string;
  courseId: string;
  groupId: string;
  branchId: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianPassport?: string;
  totalAmount: number;
  monthlyAmount: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  termsAccepted: boolean;
  smsVerifiedAt?: string;
  verificationPhone?: string;
  verificationIp?: string;
  verificationAuditHash?: string;
  createdAt: string;
}

export type PaymentMethod = 'cash' | 'terminal' | 'payme' | 'click' | 'uzum' | 'bank_transfer';

export interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  studentId: string;
  groupId: string;
  branchId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  cashierName: string;
  note?: string;
  status: 'completed' | 'refunded';
}

export interface CashRegister {
  id: string;
  branchId: string;
  name: string;
  currentBalance: number;
  status: 'open' | 'closed';
  openedAt: string;
  openedBy: string;
}

export type ExpenseCategory = 
  | 'rent'          // Ijara
  | 'salary'        // Ish haqi
  | 'utilities'     // Kommunal xizmatlar
  | 'marketing'     // Reklama va marketing
  | 'equipment'     // Jihozlar va texnika
  | 'office_supply' // Kantselyariya
  | 'maintenance'   // Ta’mirlash
  | 'other';        // Boshqa

export interface Expense {
  id: string;
  branchId: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  date: string;
  approvedBy: string;
}

export interface TeacherSalary {
  id: string;
  teacherId: string;
  branchId: string;
  month: string; // "2026-10"
  salaryType: 'fixed' | 'hourly' | 'per_student' | 'revenue_percent';
  baseAmount: number;
  bonusAmount: number;
  deductions: number;
  totalCalculated: number;
  status: 'pending' | 'approved' | 'paid';
  paidAt?: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  branchId: string;
  salaryType: 'fixed' | 'hourly' | 'per_student' | 'revenue_percent';
  salaryRate: number; // so'mda yoki foizda
  status: 'active' | 'on_leave' | 'inactive';
  joinedDate: string;
  avatarUrl?: string;
  assignedGroupIds?: string[];
  specialty?: string;        // Masalan: "Frontend Dasturlash", "IELTS 8.5"
  experienceYears?: number;  // Ish tajribasi (yil)
  bio?: string;              // O‘qituvchi haqida ma'lumot
  rating?: number;           // 1.0 - 5.0
}

export type Teacher = StaffMember;

export interface StaffTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  createdBy: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  priority: 'normal' | 'high' | 'urgent';
  status: 'open' | 'in_review' | 'resolved';
  submittedBy: string;
  createdAt: string;
  replyMessage?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  read: boolean;
  linkUrl?: string;
}
