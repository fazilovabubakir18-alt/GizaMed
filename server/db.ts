import fs from 'fs';
import path from 'path';
import {
  Branch, Course, Room, Group, Student, AttendanceRecord,
  Homework, HomeworkSubmission, Lead, Contract, PaymentTransaction,
  CashRegister, Expense, TeacherSalary, StaffMember, StaffTask,
  AuditLog, SupportTicket, SystemNotification, AttendanceStatus,
  LeadStage
} from '../src/types';
import {
  initialBranches, initialCourses, initialRooms, initialStaff,
  initialGroups, initialStudents, initialAttendanceRecords,
  initialHomeworks, initialSubmissions, initialLeads,
  initialContracts, initialPayments, initialCashRegisters,
  initialExpenses, initialSalaries, initialTasks,
  initialAuditLogs, initialSupportTickets
} from '../src/data/mockData';

export interface DatabaseSchema {
  branches: Branch[];
  courses: Course[];
  rooms: Room[];
  staff: StaffMember[];
  groups: Group[];
  students: Student[];
  attendance: AttendanceRecord[];
  homeworks: Homework[];
  submissions: HomeworkSubmission[];
  leads: Lead[];
  contracts: Contract[];
  payments: PaymentTransaction[];
  cashRegisters: CashRegister[];
  expenses: Expense[];
  salaries: TeacherSalary[];
  tasks: StaffTask[];
  auditLogs: AuditLog[];
  supportTickets: SupportTicket[];
  notifications: SystemNotification[];
  metadata: {
    version: string;
    lastSaved: string;
    totalEntities: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'eduverse-db.json');
const TMP_FILE = path.resolve(DATA_DIR, 'eduverse-db.tmp');

const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Bekend muvaffaqiyatli ishga tushdi',
    message: 'EDUVERSE REST API serveri va ma’lumotlar bazasi to‘liq faollashtirildi.',
    timestamp: new Date().toISOString(),
    type: 'success',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Oylik to‘lovlar eslatmasi',
    message: 'IELTS Intensive guruhida 3 nafar talaba to‘lovi muddati yaqinlashmoqda.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'warning',
    read: false
  }
];

class DatabaseEngine {
  private data: DatabaseSchema;
  private isSaving = false;
  private pendingSave = false;

  constructor() {
    this.data = this.loadInitialData();
  }

  private getDefaultData(): DatabaseSchema {
    return {
      branches: JSON.parse(JSON.stringify(initialBranches)),
      courses: JSON.parse(JSON.stringify(initialCourses)),
      rooms: JSON.parse(JSON.stringify(initialRooms)),
      staff: JSON.parse(JSON.stringify(initialStaff)),
      groups: JSON.parse(JSON.stringify(initialGroups)),
      students: JSON.parse(JSON.stringify(initialStudents)),
      attendance: JSON.parse(JSON.stringify(initialAttendanceRecords)),
      homeworks: JSON.parse(JSON.stringify(initialHomeworks)),
      submissions: JSON.parse(JSON.stringify(initialSubmissions)),
      leads: JSON.parse(JSON.stringify(initialLeads)),
      contracts: JSON.parse(JSON.stringify(initialContracts)),
      payments: JSON.parse(JSON.stringify(initialPayments)),
      cashRegisters: JSON.parse(JSON.stringify(initialCashRegisters)),
      expenses: JSON.parse(JSON.stringify(initialExpenses)),
      salaries: JSON.parse(JSON.stringify(initialSalaries)),
      tasks: JSON.parse(JSON.stringify(initialTasks)),
      auditLogs: JSON.parse(JSON.stringify(initialAuditLogs)),
      supportTickets: JSON.parse(JSON.stringify(initialSupportTickets)),
      notifications: JSON.parse(JSON.stringify(initialNotifications)),
      metadata: {
        version: '1.0.0',
        lastSaved: new Date().toISOString(),
        totalEntities: 0
      }
    };
  }

  private loadInitialData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        console.log(`[DB] Persistent database loaded from ${DB_FILE}`);
        return parsed;
      }
    } catch (err) {
      console.error('[DB] Failed to read database file, initializing with defaults:', err);
    }

    const initial = this.getDefaultData();
    this.persistSync(initial);
    return initial;
  }

  private persistSync(dataToSave: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      dataToSave.metadata.lastSaved = new Date().toISOString();
      dataToSave.metadata.totalEntities = 
        dataToSave.branches.length +
        dataToSave.courses.length +
        dataToSave.staff.length +
        dataToSave.groups.length +
        dataToSave.students.length +
        dataToSave.payments.length;

      fs.writeFileSync(TMP_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(TMP_FILE, DB_FILE);
    } catch (err) {
      console.error('[DB] Synchronous save error:', err);
    }
  }

  public async scheduleSave(): Promise<void> {
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }

    this.isSaving = true;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
      }

      this.data.metadata.lastSaved = new Date().toISOString();
      this.data.metadata.totalEntities = 
        this.data.branches.length +
        this.data.courses.length +
        this.data.staff.length +
        this.data.groups.length +
        this.data.students.length +
        this.data.payments.length;

      const serialized = JSON.stringify(this.data, null, 2);
      await fs.promises.writeFile(TMP_FILE, serialized, 'utf-8');
      await fs.promises.rename(TMP_FILE, DB_FILE);
    } catch (err) {
      console.error('[DB] Asynchronous save error:', err);
    } finally {
      this.isSaving = false;
      if (this.pendingSave) {
        this.pendingSave = false;
        this.scheduleSave();
      }
    }
  }

  // --- GETTERS ---
  public getSnapshot(): DatabaseSchema {
    return this.data;
  }

  public getStats() {
    const totalStudents = this.data.students.length;
    const activeStudents = this.data.students.filter(s => s.status === 'active').length;
    const debtors = this.data.students.filter(s => s.balance < 0);
    const totalDebt = debtors.reduce((acc, s) => acc + Math.abs(s.balance), 0);
    const totalPrepaid = this.data.students.filter(s => s.balance > 0).reduce((acc, s) => acc + s.balance, 0);

    const completedPayments = this.data.payments.filter(p => p.status === 'completed');
    const totalRevenue = completedPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = this.data.expenses.reduce((acc, e) => acc + e.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    const totalTeachers = this.data.staff.filter(s => s.role === 'teacher').length;
    const activeGroups = this.data.groups.filter(g => g.status === 'active').length;

    const cashInRegisters = this.data.cashRegisters.reduce((acc, c) => acc + c.currentBalance, 0);

    return {
      totalStudents,
      activeStudents,
      debtorsCount: debtors.length,
      totalDebt,
      totalPrepaid,
      totalRevenue,
      totalExpenses,
      netProfit,
      totalTeachers,
      totalStaff: this.data.staff.length,
      activeGroups,
      totalBranches: this.data.branches.length,
      totalCourses: this.data.courses.length,
      cashInRegisters,
      leadsCount: this.data.leads.length,
      lastSaved: this.data.metadata.lastSaved
    };
  }

  // --- STUDENTS ---
  public getStudents(filters?: { branchId?: string; groupId?: string; status?: string; search?: string }) {
    let result = [...this.data.students];

    if (filters?.branchId && filters.branchId !== 'all') {
      result = result.filter(s => s.branchId === filters.branchId);
    }
    if (filters?.groupId && filters.groupId !== 'all') {
      result = result.filter(s => s.groupId === filters.groupId);
    }
    if (filters?.status && filters.status !== 'all') {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(s => 
        s.fullName.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.guardianName?.toLowerCase().includes(q)
      );
    }
    return result;
  }

  public getStudentById(id: string) {
    return this.data.students.find(s => s.id === id);
  }

  public createStudent(studentData: Omit<Student, 'id' | 'enrolledDate' | 'attendanceRate' | 'averageGrade'>): Student {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now().toString().slice(-6)}`,
      enrolledDate: new Date().toISOString().split('T')[0],
      attendanceRate: 100,
      averageGrade: 0
    };
    this.data.students.unshift(newStudent);
    this.addAuditLog('Yangi o‘quvchi ro‘yxatga olindi', 'Student', newStudent.id, `${newStudent.fullName} (${newStudent.phone})`);
    this.scheduleSave();
    return newStudent;
  }

  public updateStudent(id: string, updates: Partial<Student>): Student | null {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.data.students[index] = { ...this.data.students[index], ...updates };
    this.addAuditLog('O‘quvchi ma’lumotlari yangilandi', 'Student', id, `Yangilandi: ${Object.keys(updates).join(', ')}`);
    this.scheduleSave();
    return this.data.students[index];
  }

  public deleteStudent(id: string): boolean {
    const student = this.getStudentById(id);
    if (!student) return false;

    this.data.students = this.data.students.filter(s => s.id !== id);
    this.addAuditLog('O‘quvchi o‘chirildi', 'Student', id, `${student.fullName} tizimdan o‘chirildi`);
    this.scheduleSave();
    return true;
  }

  // --- TEACHERS & STAFF ---
  public getStaff(role?: string, branchId?: string) {
    let result = [...this.data.staff];
    if (role && role !== 'all') {
      result = result.filter(s => s.role === role);
    }
    if (branchId && branchId !== 'all') {
      result = result.filter(s => s.branchId === branchId);
    }
    return result;
  }

  public getStaffById(id: string) {
    return this.data.staff.find(s => s.id === id);
  }

  public createStaffMember(staffData: Omit<StaffMember, 'id' | 'joinedDate'>): StaffMember {
    const newMember: StaffMember = {
      ...staffData,
      id: `stf-${Date.now().toString().slice(-5)}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this.data.staff.unshift(newMember);
    this.addAuditLog(
      newMember.role === 'teacher' ? 'Yangi o‘qituvchi ishga qabul qilindi' : 'Yangi xodim qo‘shildi',
      'Staff',
      newMember.id,
      `${newMember.fullName} (${newMember.role})`
    );
    this.scheduleSave();
    return newMember;
  }

  public updateStaffMember(id: string, updates: Partial<StaffMember>): StaffMember | null {
    const index = this.data.staff.findIndex(s => s.id === id);
    if (index === -1) return null;

    this.data.staff[index] = { ...this.data.staff[index], ...updates };
    this.addAuditLog('Xodim ma’lumotlari yangilandi', 'Staff', id, `O‘zgartirildi: ${this.data.staff[index].fullName}`);
    this.scheduleSave();
    return this.data.staff[index];
  }

  public deleteStaffMember(id: string): boolean {
    const member = this.getStaffById(id);
    if (!member) return false;

    this.data.staff = this.data.staff.filter(s => s.id !== id);

    // Safely unassign from any groups
    this.data.groups = this.data.groups.map(g => {
      if (g.teacherId === id) {
        return { ...g, teacherId: '' };
      }
      return g;
    });

    this.addAuditLog(
      member.role === 'teacher' ? 'O‘qituvchi o‘chirildi' : 'Xodim o‘chirildi',
      'Staff',
      id,
      `${member.fullName} tizimdan olib tashlandi va guruhlardan ajratildi`
    );
    this.scheduleSave();
    return true;
  }

  // --- BRANCHES ---
  public getBranches() {
    return this.data.branches;
  }

  public createBranch(branchData: Omit<Branch, 'id' | 'activeStudentsCount' | 'roomsCount' | 'monthlyRevenue'>): Branch {
    const newBranch: Branch = {
      ...branchData,
      id: `br-${this.data.branches.length + 1}`,
      activeStudentsCount: 0,
      roomsCount: 0,
      monthlyRevenue: 0
    };
    this.data.branches.push(newBranch);
    this.scheduleSave();
    return newBranch;
  }

  public updateBranch(id: string, updates: Partial<Branch>): Branch | null {
    const index = this.data.branches.findIndex(b => b.id === id);
    if (index === -1) return null;
    this.data.branches[index] = { ...this.data.branches[index], ...updates };
    this.scheduleSave();
    return this.data.branches[index];
  }

  // --- COURSES ---
  public getCourses() {
    return this.data.courses;
  }

  public createCourse(courseData: Omit<Course, 'id'>): Course {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${this.data.courses.length + 1}`
    };
    this.data.courses.push(newCourse);
    this.scheduleSave();
    return newCourse;
  }

  public updateCourse(id: string, updates: Partial<Course>): Course | null {
    const index = this.data.courses.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.courses[index] = { ...this.data.courses[index], ...updates };
    this.scheduleSave();
    return this.data.courses[index];
  }

  // --- ROOMS ---
  public getRooms(branchId?: string) {
    if (branchId && branchId !== 'all') {
      return this.data.rooms.filter(r => r.branchId === branchId);
    }
    return this.data.rooms;
  }

  // --- GROUPS ---
  public getGroups(filters?: { branchId?: string; courseId?: string; teacherId?: string }) {
    let result = [...this.data.groups];
    if (filters?.branchId && filters.branchId !== 'all') {
      result = result.filter(g => g.branchId === filters.branchId);
    }
    if (filters?.courseId && filters.courseId !== 'all') {
      result = result.filter(g => g.courseId === filters.courseId);
    }
    if (filters?.teacherId) {
      result = result.filter(g => g.teacherId === filters.teacherId);
    }
    return result;
  }

  public createGroup(groupData: Omit<Group, 'id'>): Group {
    const newGroup: Group = {
      ...groupData,
      id: `grp-${Date.now().toString().slice(-5)}`
    };
    this.data.groups.push(newGroup);

    // If teacher assigned, update teacher's assigned groups
    if (newGroup.teacherId) {
      const teacher = this.getStaffById(newGroup.teacherId);
      if (teacher) {
        const currentGroups = teacher.assignedGroupIds || [];
        if (!currentGroups.includes(newGroup.id)) {
          teacher.assignedGroupIds = [...currentGroups, newGroup.id];
        }
      }
    }

    this.addAuditLog('Yangi guruh ochildi', 'Group', newGroup.id, `${newGroup.name} (${newGroup.daysOfWeek.join(', ')})`);
    this.scheduleSave();
    return newGroup;
  }

  public updateGroup(id: string, updates: Partial<Group>): Group | null {
    const index = this.data.groups.findIndex(g => g.id === id);
    if (index === -1) return null;

    this.data.groups[index] = { ...this.data.groups[index], ...updates };
    this.scheduleSave();
    return this.data.groups[index];
  }

  public deleteGroup(id: string): boolean {
    const group = this.data.groups.find(g => g.id === id);
    if (!group) return false;

    this.data.groups = this.data.groups.filter(g => g.id !== id);
    // Unassign students from this group
    this.data.students = this.data.students.map(s => {
      if (s.groupId === id) {
        return { ...s, groupId: '' };
      }
      return s;
    });

    this.addAuditLog('Guruh o‘chirildi', 'Group', id, `${group.name} yopildi/o‘chirildi`);
    this.scheduleSave();
    return true;
  }

  // --- ATTENDANCE ---
  public getAttendance(filters?: { groupId?: string; studentId?: string; date?: string }) {
    let result = [...this.data.attendance];
    if (filters?.groupId) {
      result = result.filter(a => a.groupId === filters.groupId);
    }
    if (filters?.studentId) {
      result = result.filter(a => a.studentId === filters.studentId);
    }
    if (filters?.date) {
      result = result.filter(a => a.date === filters.date);
    }
    return result;
  }

  public markAttendance(groupId: string, studentId: string, date: string, status: AttendanceStatus, note?: string): AttendanceRecord {
    const index = this.data.attendance.findIndex(a => a.groupId === groupId && a.studentId === studentId && a.date === date);
    const now = new Date().toISOString();

    let record: AttendanceRecord;
    if (index >= 0) {
      this.data.attendance[index] = {
        ...this.data.attendance[index],
        status,
        note: note !== undefined ? note : this.data.attendance[index].note,
        updatedAt: now
      };
      record = this.data.attendance[index];
    } else {
      record = {
        id: `att-${Date.now().toString().slice(-6)}`,
        groupId,
        studentId,
        date,
        status,
        note,
        markedBy: 'Admin / Teacher',
        updatedAt: now
      };
      this.data.attendance.unshift(record);
    }

    // Recalculate student attendance rate
    const studentRecords = this.data.attendance.filter(a => a.studentId === studentId);
    if (studentRecords.length > 0) {
      const presentCount = studentRecords.filter(a => a.status === 'present' || a.status === 'late' || a.status === 'remote').length;
      const rate = Math.round((presentCount / studentRecords.length) * 100);
      const studentIndex = this.data.students.findIndex(s => s.id === studentId);
      if (studentIndex >= 0) {
        this.data.students[studentIndex].attendanceRate = rate;
      }
    }

    this.scheduleSave();
    return record;
  }

  public bulkMarkAttendance(groupId: string, date: string, status: AttendanceStatus): AttendanceRecord[] {
    const groupStudents = this.data.students.filter(s => s.groupId === groupId);
    const results: AttendanceRecord[] = [];

    for (const st of groupStudents) {
      const rec = this.markAttendance(groupId, st.id, date, status);
      results.push(rec);
    }
    return results;
  }

  // --- HOMEWORKS & SUBMISSIONS ---
  public getHomeworks(groupId?: string) {
    if (groupId) {
      return this.data.homeworks.filter(h => h.groupId === groupId);
    }
    return this.data.homeworks;
  }

  public createHomework(data: Omit<Homework, 'id' | 'createdAt' | 'totalSubmissions' | 'evaluatedSubmissions'>): Homework {
    const newHw: Homework = {
      ...data,
      id: `hw-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      totalSubmissions: 0,
      evaluatedSubmissions: 0
    };
    this.data.homeworks.unshift(newHw);
    this.scheduleSave();
    return newHw;
  }

  public getSubmissions(homeworkId?: string, studentId?: string) {
    let result = [...this.data.submissions];
    if (homeworkId) {
      result = result.filter(s => s.homeworkId === homeworkId);
    }
    if (studentId) {
      result = result.filter(s => s.studentId === studentId);
    }
    return result;
  }

  public gradeSubmission(submissionId: string, grade: number, feedback: string): HomeworkSubmission | null {
    const index = this.data.submissions.findIndex(s => s.id === submissionId);
    if (index === -1) return null;

    this.data.submissions[index] = {
      ...this.data.submissions[index],
      grade,
      feedback,
      status: 'graded'
    };

    const studentId = this.data.submissions[index].studentId;
    const gradedStudentSubmissions = this.data.submissions.filter(s => s.studentId === studentId && s.grade !== undefined);
    if (gradedStudentSubmissions.length > 0) {
      const avg = Math.round(gradedStudentSubmissions.reduce((acc, s) => acc + (s.grade || 0), 0) / gradedStudentSubmissions.length);
      const studentIndex = this.data.students.findIndex(s => s.id === studentId);
      if (studentIndex >= 0) {
        this.data.students[studentIndex].averageGrade = avg;
      }
    }

    this.scheduleSave();
    return this.data.submissions[index];
  }

  // --- LEADS ---
  public getLeads(stage?: string) {
    if (stage && stage !== 'all') {
      return this.data.leads.filter(l => l.stage === stage);
    }
    return this.data.leads;
  }

  public createLead(data: Omit<Lead, 'id' | 'createdAt'>): Lead {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    };
    this.data.leads.unshift(newLead);
    this.addAuditLog('Yangi lid qo‘shildi', 'Lead', newLead.id, `${newLead.fullName} (${newLead.phone})`);
    this.scheduleSave();
    return newLead;
  }

  public updateLeadStage(id: string, stage: LeadStage): Lead | null {
    const index = this.data.leads.findIndex(l => l.id === id);
    if (index === -1) return null;

    this.data.leads[index].stage = stage;
    this.addAuditLog('Lid bosqichi o‘zgardi', 'Lead', id, `Yangi bosqich: ${stage}`);
    this.scheduleSave();
    return this.data.leads[index];
  }

  public convertLeadToStudent(leadId: string, groupId: string): Student | null {
    const lead = this.data.leads.find(l => l.id === leadId);
    if (!lead) return null;

    const group = this.data.groups.find(g => g.id === groupId);

    const newStudent = this.createStudent({
      fullName: lead.fullName,
      phone: lead.phone,
      birthDate: '2005-01-01',
      branchId: lead.branchId,
      courseId: lead.courseId,
      groupId,
      status: 'active',
      balance: -(group?.monthlyFee || 1000000),
      monthlyFee: group?.monthlyFee || 1000000,
      notes: `Liddan o'tkazildi (Manba: ${lead.source})`
    });

    lead.stage = 'faol_oquvchi';
    lead.convertedStudentId = newStudent.id;
    this.scheduleSave();
    return newStudent;
  }

  // --- CONTRACTS ---
  public getContracts() {
    return this.data.contracts;
  }

  public createContract(data: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'status' | 'termsAccepted'>): Contract {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newContract: Contract = {
      ...data,
      id: `cnt-${Date.now().toString().slice(-6)}`,
      contractNumber: `EDU-2026-${randomNum}`,
      status: 'draft',
      termsAccepted: false,
      createdAt: new Date().toISOString()
    };
    this.data.contracts.unshift(newContract);
    this.addAuditLog('E-Shartnoma tuzildi', 'Contract', newContract.id, `Shartnoma #${newContract.contractNumber}`);
    this.scheduleSave();
    return newContract;
  }

  public verifyContractSms(contractId: string, phone: string): { success: boolean; contract?: Contract; message: string } {
    const index = this.data.contracts.findIndex(c => c.id === contractId);
    if (index === -1) {
      return { success: false, message: 'Shartnoma topilmadi' };
    }

    const now = new Date().toISOString();
    const hash = `HASH-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    this.data.contracts[index] = {
      ...this.data.contracts[index],
      status: 'sms_verified',
      termsAccepted: true,
      smsVerifiedAt: now,
      verificationPhone: phone,
      verificationIp: '178.218.201.45',
      verificationAuditHash: hash
    };

    this.addAuditLog('Shartnoma SMS orqali tasdiqlandi', 'Contract', contractId, `SMS tasdiq: ${phone}, Hash: ${hash}`);
    this.scheduleSave();
    return { 
      success: true, 
      contract: this.data.contracts[index], 
      message: 'Shartnoma muvaffaqiyatli SMS bilan tasdiqlandi va qonuniy kuchga kirdi' 
    };
  }

  // --- PAYMENTS & FINANCES ---
  public getPayments(filters?: { studentId?: string; branchId?: string }) {
    let result = [...this.data.payments];
    if (filters?.studentId) {
      result = result.filter(p => p.studentId === filters.studentId);
    }
    if (filters?.branchId && filters.branchId !== 'all') {
      result = result.filter(p => p.branchId === filters.branchId);
    }
    return result;
  }

  public recordPayment(paymentData: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>): PaymentTransaction {
    const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`;
    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay-${Date.now().toString().slice(-6)}`,
      receiptNumber,
      date: new Date().toISOString(),
      status: 'completed'
    };
    this.data.payments.unshift(newPayment);

    // Increase student balance
    const studentIndex = this.data.students.findIndex(s => s.id === paymentData.studentId);
    if (studentIndex >= 0) {
      this.data.students[studentIndex].balance += paymentData.amount;
    }

    // Increase cash register balance if found
    const cashRegister = this.data.cashRegisters.find(c => c.branchId === paymentData.branchId && c.status === 'open');
    if (cashRegister) {
      cashRegister.currentBalance += paymentData.amount;
    }

    this.addAuditLog(
      'To‘lov qabul qilindi',
      'Payment',
      newPayment.id,
      `${paymentData.amount.toLocaleString('uz-UZ')} so‘m (${paymentData.paymentMethod}, Kvitansiya: ${receiptNumber})`
    );

    this.scheduleSave();
    return newPayment;
  }

  public getCashRegisters(branchId?: string) {
    if (branchId && branchId !== 'all') {
      return this.data.cashRegisters.filter(c => c.branchId === branchId);
    }
    return this.data.cashRegisters;
  }

  public getExpenses(branchId?: string) {
    if (branchId && branchId !== 'all') {
      return this.data.expenses.filter(e => e.branchId === branchId);
    }
    return this.data.expenses;
  }

  public addExpense(expenseData: Omit<Expense, 'id'>): Expense {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now().toString().slice(-5)}`
    };
    this.data.expenses.unshift(newExpense);

    // Deduct from cash register
    const register = this.data.cashRegisters.find(c => c.branchId === expenseData.branchId && c.status === 'open');
    if (register && register.currentBalance >= expenseData.amount) {
      register.currentBalance -= expenseData.amount;
    }

    this.addAuditLog('Chiqim kiritildi', 'Expense', newExpense.id, `${newExpense.description}: ${newExpense.amount.toLocaleString('uz-UZ')} so‘m`);
    this.scheduleSave();
    return newExpense;
  }

  public getSalaries(teacherId?: string) {
    if (teacherId) {
      return this.data.salaries.filter(s => s.teacherId === teacherId);
    }
    return this.data.salaries;
  }

  // --- TASKS ---
  public getTasks(assignedTo?: string) {
    if (assignedTo) {
      return this.data.tasks.filter(t => t.assignedTo === assignedTo);
    }
    return this.data.tasks;
  }

  public createTask(taskData: Omit<StaffTask, 'id' | 'createdAt'>): StaffTask {
    const newTask: StaffTask = {
      ...taskData,
      id: `tsk-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString()
    };
    this.data.tasks.unshift(newTask);
    this.scheduleSave();
    return newTask;
  }

  public updateTaskStatus(taskId: string, status: StaffTask['status']): StaffTask | null {
    const index = this.data.tasks.findIndex(t => t.id === taskId);
    if (index === -1) return null;

    this.data.tasks[index].status = status;
    this.scheduleSave();
    return this.data.tasks[index];
  }

  // --- AUDIT & NOTIFICATIONS ---
  public getAuditLogs() {
    return this.data.auditLogs;
  }

  public addAuditLog(action: string, entityType: string, entityId: string, details: string) {
    const newLog: AuditLog = {
      id: `log-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userName: 'Tizim Boshqaruvchisi',
      userRole: 'super_admin',
      action,
      entityType,
      entityId,
      details,
      ipAddress: '127.0.0.1'
    };
    this.data.auditLogs.unshift(newLog);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
  }

  public getNotifications() {
    return this.data.notifications;
  }

  public markNotificationAsRead(id: string) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.scheduleSave();
    }
  }

  public markAllNotificationsAsRead() {
    this.data.notifications.forEach(n => { n.read = true; });
    this.scheduleSave();
  }

  // --- BACKUP & RESTORE ---
  public restoreFromJson(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.students || !parsed.groups || !parsed.staff) {
        throw new Error('Noto‘g‘ri ma’lumotlar bazasi formati');
      }
      this.data = parsed;
      this.persistSync(this.data);
      console.log('[DB] Database successfully restored from JSON payload.');
      return true;
    } catch (err) {
      console.error('[DB] Restore failed:', err);
      return false;
    }
  }

  public resetToDefault(): void {
    this.data = this.getDefaultData();
    this.persistSync(this.data);
    console.log('[DB] Database reset to factory default data.');
  }
}

export const db = new DatabaseEngine();
