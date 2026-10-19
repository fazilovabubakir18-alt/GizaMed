import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student, Branch, Course, Room, Group, AttendanceRecord,
  Homework, HomeworkSubmission, Lead, Contract, PaymentTransaction,
  CashRegister, Expense, TeacherSalary, StaffMember, StaffTask,
  AuditLog, SupportTicket, SystemNotification, LeadStage, AttendanceStatus,
  PaymentMethod, ContractStatus
} from '../types';
import {
  initialBranches, initialCourses, initialRooms, initialStaff,
  initialGroups, initialStudents, initialAttendanceRecords,
  initialHomeworks, initialSubmissions, initialLeads,
  initialContracts, initialPayments, initialCashRegisters,
  initialExpenses, initialSalaries, initialTasks,
  initialAuditLogs, initialSupportTickets
} from '../data/mockData';

interface AppContextType {
  // Data
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

  // Global filters
  selectedBranchId: string; // 'all' or specific branch
  setSelectedBranchId: (id: string) => void;

  // Actions
  addStudent: (student: Omit<Student, 'id' | 'enrolledDate' | 'attendanceRate' | 'averageGrade'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addGroup: (group: Omit<Group, 'id'>) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;

  addCourse: (course: Omit<Course, 'id'>) => void;

  markAttendance: (groupId: string, studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  bulkMarkAttendance: (groupId: string, date: string, status: AttendanceStatus) => void;

  addHomework: (homework: Omit<Homework, 'id' | 'createdAt' | 'totalSubmissions' | 'evaluatedSubmissions'>) => void;
  gradeHomeworkSubmission: (submissionId: string, grade: number, feedback: string) => void;

  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  convertLeadToStudent: (leadId: string, groupId: string) => void;

  createContract: (contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'status' | 'termsAccepted'>) => Contract;
  verifyContractWithSms: (contractId: string, phone: string) => { success: boolean; message: string };

  recordPayment: (payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>) => PaymentTransaction;
  addExpense: (expense: Omit<Expense, 'id'>) => void;

  addStaffTask: (task: Omit<StaffTask, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, status: StaffTask['status']) => void;

  addStaffMember: (staffData: Omit<StaffMember, 'id' | 'joinedDate'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;

  addTeacher: (teacherData: Omit<StaffMember, 'id' | 'joinedDate' | 'role'> & { role?: 'teacher' }) => void;
  updateTeacher: (id: string, updates: Partial<StaffMember>) => void;
  deleteTeacher: (id: string) => void;

  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => void;
  markNotificationAsRead: (id: string) => void;

  logAudit: (action: string, entityType: string, entityId: string, details: string) => void;
  exportDatabaseJson: () => string;
  restoreDatabaseJson: (jsonString: string) => boolean;
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const load = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`eduverse_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [branches, setBranches] = useState<Branch[]>(() => load('branches', initialBranches));
  const [courses, setCourses] = useState<Course[]>(() => load('courses', initialCourses));
  const [rooms, setRooms] = useState<Room[]>(() => load('rooms', initialRooms));
  const [staff, setStaff] = useState<StaffMember[]>(() => load('staff', initialStaff));
  const [groups, setGroups] = useState<Group[]>(() => load('groups', initialGroups));
  const [students, setStudents] = useState<Student[]>(() => load('students', initialStudents));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => load('attendance', initialAttendanceRecords));
  const [homeworks, setHomeworks] = useState<Homework[]>(() => load('homeworks', initialHomeworks));
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>(() => load('submissions', initialSubmissions));
  const [leads, setLeads] = useState<Lead[]>(() => load('leads', initialLeads));
  const [contracts, setContracts] = useState<Contract[]>(() => load('contracts', initialContracts));
  const [payments, setPayments] = useState<PaymentTransaction[]>(() => load('payments', initialPayments));
  const [cashRegisters, setCashRegisters] = useState<CashRegister[]>(() => load('cashRegisters', initialCashRegisters));
  const [expenses, setExpenses] = useState<Expense[]>(() => load('expenses', initialExpenses));
  const [salaries, setSalaries] = useState<TeacherSalary[]>(() => load('salaries', initialSalaries));
  const [tasks, setTasks] = useState<StaffTask[]>(() => load('tasks', initialTasks));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => load('auditLogs', initialAuditLogs));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => load('supportTickets', initialSupportTickets));

  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-1',
      title: 'Yangi lid qabul qilindi',
      message: 'Sherzodbek Mahmudov Instagram orqali Frontend kursiga yozildi.',
      timestamp: '10 daqiqa oldin',
      type: 'info',
      read: false
    },
    {
      id: 'notif-2',
      title: 'Shartnoma SMS orqali tasdiqlandi',
      message: 'EDU-2026-0850 raqamli shartnoma ota-ona tomonidan tasdiqlandi.',
      timestamp: '1 soat oldin',
      type: 'success',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Qarzdorlik eslatmasi',
      message: '3 nafar o‘quvchining to‘lov muddati 5 kundan oshdi.',
      timestamp: '3 soat oldin',
      type: 'warning',
      read: true
    }
  ]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('eduverse_students', JSON.stringify(students));
    localStorage.setItem('eduverse_groups', JSON.stringify(groups));
    localStorage.setItem('eduverse_courses', JSON.stringify(courses));
    localStorage.setItem('eduverse_leads', JSON.stringify(leads));
    localStorage.setItem('eduverse_contracts', JSON.stringify(contracts));
    localStorage.setItem('eduverse_payments', JSON.stringify(payments));
    localStorage.setItem('eduverse_expenses', JSON.stringify(expenses));
    localStorage.setItem('eduverse_attendance', JSON.stringify(attendance));
    localStorage.setItem('eduverse_staff', JSON.stringify(staff));
    localStorage.setItem('eduverse_tasks', JSON.stringify(tasks));
    localStorage.setItem('eduverse_auditLogs', JSON.stringify(auditLogs));
    localStorage.setItem('eduverse_supportTickets', JSON.stringify(supportTickets));
  }, [students, groups, courses, leads, contracts, payments, expenses, attendance, staff, tasks, auditLogs, supportTickets]);

  const logAudit = (action: string, entityType: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userName: 'Tizim foydalanuvchisi',
      userRole: 'super_admin',
      action,
      entityType,
      entityId,
      details,
      ipAddress: '178.218.201.44'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Student Actions
  const addStudent = (data: Omit<Student, 'id' | 'enrolledDate' | 'attendanceRate' | 'averageGrade'>) => {
    const newStudent: Student = {
      ...data,
      id: `stu-${Date.now()}`,
      enrolledDate: new Date().toISOString().substring(0, 10),
      attendanceRate: 100,
      averageGrade: 85
    };
    setStudents(prev => [newStudent, ...prev]);
    logAudit('Yangi o‘quvchi qo‘shildi', 'Student', newStudent.id, `${newStudent.fullName} tizimga kiritildi.`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAudit('O‘quvchi ma’lumotlari yangilandi', 'Student', id, `O‘zgarishlar kiritildi: ${Object.keys(updates).join(', ')}`);
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    logAudit('O‘quvchi o‘chirildi', 'Student', id, `${student?.fullName || id} tizimdan o‘chirildi.`);
  };

  // Group Actions
  const addGroup = (groupData: Omit<Group, 'id'>) => {
    const newGroup: Group = {
      ...groupData,
      id: `grp-${Date.now()}`
    };
    setGroups(prev => [...prev, newGroup]);
    logAudit('Yangi guruh ochildi', 'Group', newGroup.id, `${newGroup.name} guruhi ochildi.`);
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    setGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    logAudit('Guruh yangilandi', 'Group', id, `Guruh yangilandi.`);
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `crs-${Date.now()}`
    };
    setCourses(prev => [...prev, newCourse]);
    logAudit('Yangi kurs kiritildi', 'Course', newCourse.id, `${newCourse.title} kursi qo‘shildi.`);
  };

  // Attendance Actions
  const markAttendance = (groupId: string, studentId: string, date: string, status: AttendanceStatus, note?: string) => {
    setAttendance(prev => {
      const existingIndex = prev.findIndex(a => a.groupId === groupId && a.studentId === studentId && a.date === date);
      const updatedRecord: AttendanceRecord = {
        id: existingIndex >= 0 ? prev[existingIndex].id : `att-${Date.now()}-${studentId}`,
        groupId,
        studentId,
        date,
        status,
        note,
        markedBy: 'O‘qituvchi',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updatedRecord;
        return copy;
      }
      return [updatedRecord, ...prev];
    });

    logAudit('Davomat belgilandi', 'Attendance', studentId, `Sana: ${date}, Holat: ${status}`);
  };

  const bulkMarkAttendance = (groupId: string, date: string, status: AttendanceStatus) => {
    const groupStudents = students.filter(s => s.groupId === groupId);
    groupStudents.forEach(st => {
      markAttendance(groupId, st.id, date, status);
    });
    logAudit('Ommaviy davomat belgilandi', 'Attendance', groupId, `${groupStudents.length} ta o‘quvchiga "${status}" qo‘yildi.`);
  };

  // Homework Actions
  const addHomework = (hwData: Omit<Homework, 'id' | 'createdAt' | 'totalSubmissions' | 'evaluatedSubmissions'>) => {
    const newHw: Homework = {
      ...hwData,
      id: `hw-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10),
      totalSubmissions: 0,
      evaluatedSubmissions: 0
    };
    setHomeworks(prev => [newHw, ...prev]);
    logAudit('Uy vazifasi yaratildi', 'Homework', newHw.id, `${newHw.title} vazifasi berildi.`);
  };

  const gradeHomeworkSubmission = (submissionId: string, grade: number, feedback: string) => {
    setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, grade, feedback, status: 'graded' } : s));
    logAudit('Vazifa baholandi', 'HomeworkSubmission', submissionId, `Baho: ${grade}/100`);
  };

  // CRM Actions
  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `ld-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setLeads(prev => [newLead, ...prev]);
    logAudit('Yangi lid kiritildi', 'Lead', newLead.id, `${newLead.fullName} (${newLead.source})`);
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage } : l));
    logAudit('Lid bosqichi o‘zgardi', 'Lead', id, `Yangi bosqich: ${stage}`);
  };

  const convertLeadToStudent = (leadId: string, groupId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const course = courses.find(c => c.id === lead.courseId);
    const newStudentId = `stu-${Date.now()}`;

    const newStudent: Student = {
      id: newStudentId,
      fullName: lead.fullName,
      phone: lead.phone,
      birthDate: '2005-01-01',
      branchId: lead.branchId,
      courseId: lead.courseId,
      groupId: groupId,
      enrolledDate: new Date().toISOString().substring(0, 10),
      status: 'active',
      balance: 0,
      monthlyFee: course?.pricePerMonth || 1000000,
      attendanceRate: 100,
      averageGrade: 80,
      notes: `CRM lididan o‘tkazildi. Manba: ${lead.source}`
    };

    setStudents(prev => [newStudent, ...prev]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage: 'faol_oquvchi', convertedStudentId: newStudentId } : l));

    logAudit('Lid o‘quvchiga aylantirildi', 'Lead', leadId, `${lead.fullName} -> Yangi o‘quvchi ID: ${newStudentId}`);
  };

  // Contract Actions
  const createContract = (data: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'status' | 'termsAccepted'>): Contract => {
    const contractNum = `EDU-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newContract: Contract = {
      ...data,
      id: `cnt-${Date.now()}`,
      contractNumber: contractNum,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'sent',
      termsAccepted: false
    };

    setContracts(prev => [newContract, ...prev]);
    logAudit('Yangi shartnoma yaratildi', 'Contract', newContract.id, `Shartnoma № ${contractNum} yaratildi.`);
    return newContract;
  };

  const verifyContractWithSms = (contractId: string, phone: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return { success: false, message: 'Shartnoma topilmadi' };

    const randomHash = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const auditHash = `SHA256:${randomHash}`;

    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          status: 'officialized',
          termsAccepted: true,
          smsVerifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          verificationPhone: phone,
          verificationIp: '213.230.82.' + Math.floor(10 + Math.random() * 80),
          verificationAuditHash: auditHash
        };
      }
      return c;
    }));

    logAudit('Shartnoma SMS orqali tasdiqlandi', 'Contract', contractId, `Shartnoma № ${contract.contractNumber} tasdiqlandi. Hash: ${auditHash.substring(0, 18)}...`);

    return {
      success: true,
      message: `Shartnoma № ${contract.contractNumber} muvaffaqiyatli rasmiylashtirildi!`
    };
  };

  // Payment Actions
  const recordPayment = (data: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>): PaymentTransaction => {
    const receiptNum = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPayment: PaymentTransaction = {
      ...data,
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'completed'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update student balance
    setStudents(prev => prev.map(s => {
      if (s.id === data.studentId) {
        return {
          ...s,
          balance: s.balance + data.amount
        };
      }
      return s;
    }));

    // Update Cash register if cash
    if (data.paymentMethod === 'cash') {
      setCashRegisters(prev => prev.map(cr => {
        if (cr.branchId === data.branchId) {
          return { ...cr, currentBalance: cr.currentBalance + data.amount };
        }
        return cr;
      }));
    }

    logAudit('To‘lov qabul qilindi', 'Payment', newPayment.id, `Summa: ${data.amount.toLocaleString()} so‘m, Usul: ${data.paymentMethod}`);
    return newPayment;
  };

  const addExpense = (data: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...data,
      id: `exp-${Date.now()}`
    };
    setExpenses(prev => [newExpense, ...prev]);

    // Deduct from cash register
    setCashRegisters(prev => prev.map(cr => {
      if (cr.branchId === data.branchId) {
        return { ...cr, currentBalance: Math.max(0, cr.currentBalance - data.amount) };
      }
      return cr;
    }));

    logAudit('Xarajat kiritildi', 'Expense', newExpense.id, `${data.category}: ${data.amount.toLocaleString()} so‘m`);
  };

  // Tasks & Support
  const addStaffTask = (taskData: Omit<StaffTask, 'id' | 'createdAt'>) => {
    const newTask: StaffTask = {
      ...taskData,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setTasks(prev => [newTask, ...prev]);
    logAudit('Yangi vazifa tayinlandi', 'Task', newTask.id, newTask.title);
  };

  const updateTaskStatus = (taskId: string, status: StaffTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    logAudit('Vazifa holati o‘zgardi', 'Task', taskId, `Status: ${status}`);
  };

  // Staff & Teacher Actions
  const addStaffMember = (data: Omit<StaffMember, 'id' | 'joinedDate'>) => {
    const newStaff: StaffMember = {
      ...data,
      id: `stf-${Date.now()}`,
      joinedDate: new Date().toISOString().substring(0, 10),
      avatarUrl: data.avatarUrl || (data.role === 'teacher' ? '/src/assets/images/avatar_teacher_1792036219476.jpg' : '/src/assets/images/avatar_director_1792036219459.jpg')
    };
    setStaff(prev => [newStaff, ...prev]);
    logAudit(
      data.role === 'teacher' ? 'Yangi o‘qituvchi qo‘shildi' : 'Yangi xodim qo‘shildi',
      'StaffMember',
      newStaff.id,
      `${newStaff.fullName} (${data.role}) tizimga kiritildi.`
    );
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAudit('Xodim ma’lumotlari yangilandi', 'StaffMember', id, `O‘zgarishlar: ${Object.keys(updates).join(', ')}`);
  };

  const deleteStaffMember = (id: string) => {
    const member = staff.find(s => s.id === id);
    setStaff(prev => prev.filter(s => s.id !== id));
    // Safely unassign deleted teacher from any associated groups
    setGroups(prev => prev.map(g => g.teacherId === id ? { ...g, teacherId: '' } : g));
    logAudit(
      member?.role === 'teacher' ? 'O‘qituvchi o‘chirildi' : 'Xodim o‘chirildi',
      'StaffMember',
      id,
      `${member?.fullName || id} tizimdan to‘liq o‘chirildi.`
    );
  };

  const addTeacher = (data: Omit<StaffMember, 'id' | 'joinedDate' | 'role'> & { role?: 'teacher' }) => {
    addStaffMember({
      ...data,
      role: 'teacher'
    });
  };

  const updateTeacher = (id: string, updates: Partial<StaffMember>) => {
    updateStaffMember(id, updates);
  };

  const deleteTeacher = (id: string) => {
    deleteStaffMember(id);
  };

  const createSupportTicket = (ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TCK-2026-00${Math.floor(10 + Math.random() * 89)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'open'
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    logAudit('Yordam murojaati yaratildi', 'SupportTicket', newTicket.id, newTicket.subject);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const exportDatabaseJson = () => {
    const data = {
      branches, courses, rooms, staff, groups, students,
      attendance, homeworks, submissions, leads, contracts,
      payments, cashRegisters, expenses, salaries, tasks,
      auditLogs, exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const restoreDatabaseJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students)) setStudents(data.students);
      if (data.groups && Array.isArray(data.groups)) setGroups(data.groups);
      if (data.courses && Array.isArray(data.courses)) setCourses(data.courses);
      if (data.leads && Array.isArray(data.leads)) setLeads(data.leads);
      if (data.contracts && Array.isArray(data.contracts)) setContracts(data.contracts);
      if (data.payments && Array.isArray(data.payments)) setPayments(data.payments);
      if (data.expenses && Array.isArray(data.expenses)) setExpenses(data.expenses);
      if (data.attendance && Array.isArray(data.attendance)) setAttendance(data.attendance);
      if (data.staff && Array.isArray(data.staff)) setStaff(data.staff);
      logAudit('Ma’lumotlar bazasi tiklandi', 'System', 'backup', 'Zaxira nusxadan muvaffaqiyatli tiklandi.');
      return true;
    } catch {
      return false;
    }
  };

  const resetToDefault = () => {
    setBranches(initialBranches);
    setCourses(initialCourses);
    setRooms(initialRooms);
    setStaff(initialStaff);
    setGroups(initialGroups);
    setStudents(initialStudents);
    setAttendance(initialAttendanceRecords);
    setHomeworks(initialHomeworks);
    setSubmissions(initialSubmissions);
    setLeads(initialLeads);
    setContracts(initialContracts);
    setPayments(initialPayments);
    setCashRegisters(initialCashRegisters);
    setExpenses(initialExpenses);
    setSalaries(initialSalaries);
    setTasks(initialTasks);
    setAuditLogs(initialAuditLogs);
    setSupportTickets(initialSupportTickets);
    localStorage.clear();
    logAudit('Tizim standart holatga qaytarildi', 'System', 'reset', 'Barcha namunaviy ma’lumotlar yangilandi.');
  };

  return (
    <AppContext.Provider value={{
      branches, courses, rooms, staff, groups, students,
      attendance, homeworks, submissions, leads, contracts,
      payments, cashRegisters, expenses, salaries, tasks,
      auditLogs, supportTickets, notifications,
      selectedBranchId, setSelectedBranchId,
      addStudent, updateStudent, deleteStudent,
      addGroup, updateGroup, addCourse,
      markAttendance, bulkMarkAttendance,
      addHomework, gradeHomeworkSubmission,
      addLead, updateLeadStage, convertLeadToStudent,
      createContract, verifyContractWithSms,
      recordPayment, addExpense,
      addStaffTask, updateTaskStatus,
      addStaffMember, updateStaffMember, deleteStaffMember,
      addTeacher, updateTeacher, deleteTeacher,
      createSupportTicket, markNotificationAsRead,
      logAudit, exportDatabaseJson, restoreDatabaseJson, resetToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
