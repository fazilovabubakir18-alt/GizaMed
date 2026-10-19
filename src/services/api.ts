import {
  Student, Branch, Course, Room, Group, AttendanceRecord,
  Homework, HomeworkSubmission, Lead, Contract, PaymentTransaction,
  CashRegister, Expense, TeacherSalary, StaffMember, StaffTask,
  AuditLog, SupportTicket, SystemNotification, AttendanceStatus, LeadStage
} from '../types';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const api = {
  // System Health & Diagnostics
  async getHealth() {
    return fetchJson<{
      status: string;
      timestamp: string;
      uptimeSeconds: number;
      service: string;
      database: { status: string; lastSaved: string; totalStudents: number; totalTeachers: number; totalBranches: number };
    }>('/health');
  },

  async getStats() {
    return fetchJson<{ success: boolean; stats: any }>('/stats/overview');
  },

  // Students
  async getStudents(filters?: { branchId?: string; groupId?: string; status?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.branchId) params.append('branchId', filters.branchId);
    if (filters?.groupId) params.append('groupId', filters.groupId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; data: Student[] }>(`/students${qs}`);
  },

  async createStudent(student: Omit<Student, 'id' | 'enrolledDate' | 'attendanceRate' | 'averageGrade'>) {
    return fetchJson<{ success: boolean; data: Student; message: string }>('/students', {
      method: 'POST',
      body: JSON.stringify(student)
    });
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    return fetchJson<{ success: boolean; data: Student; message: string }>(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteStudent(id: string) {
    return fetchJson<{ success: boolean; message: string }>(`/students/${id}`, {
      method: 'DELETE'
    });
  },

  // Teachers & Staff
  async getTeachers(branchId?: string) {
    const qs = branchId ? `?branchId=${branchId}` : '';
    return fetchJson<{ success: boolean; count: number; data: StaffMember[] }>(`/teachers${qs}`);
  },

  async createTeacher(teacher: Omit<StaffMember, 'id' | 'joinedDate'>) {
    return fetchJson<{ success: boolean; data: StaffMember; message: string }>('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacher)
    });
  },

  async updateTeacher(id: string, updates: Partial<StaffMember>) {
    return fetchJson<{ success: boolean; data: StaffMember; message: string }>(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteTeacher(id: string) {
    return fetchJson<{ success: boolean; message: string }>(`/teachers/${id}`, {
      method: 'DELETE'
    });
  },

  async getStaff(role?: string, branchId?: string) {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (branchId) params.append('branchId', branchId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; data: StaffMember[] }>(`/staff${qs}`);
  },

  async createStaff(staff: Omit<StaffMember, 'id' | 'joinedDate'>) {
    return fetchJson<{ success: boolean; data: StaffMember }>('/staff', {
      method: 'POST',
      body: JSON.stringify(staff)
    });
  },

  async deleteStaff(id: string) {
    return fetchJson<{ success: boolean; message: string }>(`/staff/${id}`, {
      method: 'DELETE'
    });
  },

  // Branches & Courses & Rooms
  async getBranches() {
    return fetchJson<{ success: boolean; data: Branch[] }>('/branches');
  },

  async createBranch(branch: Omit<Branch, 'id' | 'activeStudentsCount' | 'roomsCount' | 'monthlyRevenue'>) {
    return fetchJson<{ success: boolean; data: Branch }>('/branches', {
      method: 'POST',
      body: JSON.stringify(branch)
    });
  },

  async getCourses() {
    return fetchJson<{ success: boolean; data: Course[] }>('/courses');
  },

  async createCourse(course: Omit<Course, 'id'>) {
    return fetchJson<{ success: boolean; data: Course }>('/courses', {
      method: 'POST',
      body: JSON.stringify(course)
    });
  },

  async getRooms(branchId?: string) {
    const qs = branchId ? `?branchId=${branchId}` : '';
    return fetchJson<{ success: boolean; data: Room[] }>(`/rooms${qs}`);
  },

  // Groups
  async getGroups(filters?: { branchId?: string; courseId?: string; teacherId?: string }) {
    const params = new URLSearchParams();
    if (filters?.branchId) params.append('branchId', filters.branchId);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.teacherId) params.append('teacherId', filters.teacherId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; data: Group[] }>(`/groups${qs}`);
  },

  async createGroup(group: Omit<Group, 'id'>) {
    return fetchJson<{ success: boolean; data: Group; message: string }>('/groups', {
      method: 'POST',
      body: JSON.stringify(group)
    });
  },

  async updateGroup(id: string, updates: Partial<Group>) {
    return fetchJson<{ success: boolean; data: Group }>(`/groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async deleteGroup(id: string) {
    return fetchJson<{ success: boolean; message: string }>(`/groups/${id}`, {
      method: 'DELETE'
    });
  },

  // Attendance
  async getAttendance(filters?: { groupId?: string; studentId?: string; date?: string }) {
    const params = new URLSearchParams();
    if (filters?.groupId) params.append('groupId', filters.groupId);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.date) params.append('date', filters.date);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; count: number; data: AttendanceRecord[] }>(`/attendance${qs}`);
  },

  async markAttendance(groupId: string, studentId: string, date: string, status: AttendanceStatus, note?: string) {
    return fetchJson<{ success: boolean; data: AttendanceRecord; message: string }>('/attendance', {
      method: 'POST',
      body: JSON.stringify({ groupId, studentId, date, status, note })
    });
  },

  async bulkMarkAttendance(groupId: string, date: string, status: AttendanceStatus) {
    return fetchJson<{ success: boolean; count: number; data: AttendanceRecord[]; message: string }>('/attendance/bulk', {
      method: 'POST',
      body: JSON.stringify({ groupId, date, status })
    });
  },

  // Homeworks
  async getHomeworks(groupId?: string) {
    const qs = groupId ? `?groupId=${groupId}` : '';
    return fetchJson<{ success: boolean; data: Homework[] }>(`/homeworks${qs}`);
  },

  async createHomework(homework: Omit<Homework, 'id' | 'createdAt' | 'totalSubmissions' | 'evaluatedSubmissions'>) {
    return fetchJson<{ success: boolean; data: Homework }>('/homeworks', {
      method: 'POST',
      body: JSON.stringify(homework)
    });
  },

  async getSubmissions(homeworkId?: string, studentId?: string) {
    const params = new URLSearchParams();
    if (homeworkId) params.append('homeworkId', homeworkId);
    if (studentId) params.append('studentId', studentId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; data: HomeworkSubmission[] }>(`/homework-submissions${qs}`);
  },

  async gradeSubmission(submissionId: string, grade: number, feedback: string) {
    return fetchJson<{ success: boolean; data: HomeworkSubmission; message: string }>(`/homework-submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ grade, feedback })
    });
  },

  // Leads
  async getLeads(stage?: string) {
    const qs = stage ? `?stage=${stage}` : '';
    return fetchJson<{ success: boolean; data: Lead[] }>(`/leads${qs}`);
  },

  async createLead(lead: Omit<Lead, 'id' | 'createdAt'>) {
    return fetchJson<{ success: boolean; data: Lead; message: string }>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead)
    });
  },

  async updateLeadStage(id: string, stage: LeadStage) {
    return fetchJson<{ success: boolean; data: Lead; message: string }>(`/leads/${id}/stage`, {
      method: 'PUT',
      body: JSON.stringify({ stage })
    });
  },

  async convertLeadToStudent(leadId: string, groupId: string) {
    return fetchJson<{ success: boolean; data: Student; message: string }>(`/leads/${leadId}/convert`, {
      method: 'POST',
      body: JSON.stringify({ groupId })
    });
  },

  // Contracts
  async getContracts() {
    return fetchJson<{ success: boolean; data: Contract[] }>('/contracts');
  },

  async createContract(contract: Omit<Contract, 'id' | 'contractNumber' | 'createdAt' | 'status' | 'termsAccepted'>) {
    return fetchJson<{ success: boolean; data: Contract; message: string }>('/contracts', {
      method: 'POST',
      body: JSON.stringify(contract)
    });
  },

  async verifyContractSms(contractId: string, phone: string) {
    return fetchJson<{ success: boolean; contract?: Contract; message: string }>(`/contracts/${contractId}/verify-sms`, {
      method: 'POST',
      body: JSON.stringify({ phone })
    });
  },

  // Finance & Payments
  async getPayments(filters?: { studentId?: string; branchId?: string }) {
    const params = new URLSearchParams();
    if (filters?.studentId) params.append('studentId', filters.studentId);
    if (filters?.branchId) params.append('branchId', filters.branchId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetchJson<{ success: boolean; data: PaymentTransaction[] }>(`/payments${qs}`);
  },

  async recordPayment(payment: Omit<PaymentTransaction, 'id' | 'receiptNumber' | 'date' | 'status'>) {
    return fetchJson<{ success: boolean; data: PaymentTransaction; message: string }>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment)
    });
  },

  async getCashRegisters(branchId?: string) {
    const qs = branchId ? `?branchId=${branchId}` : '';
    return fetchJson<{ success: boolean; data: CashRegister[] }>(`/cash-registers${qs}`);
  },

  async getExpenses(branchId?: string) {
    const qs = branchId ? `?branchId=${branchId}` : '';
    return fetchJson<{ success: boolean; data: Expense[] }>(`/expenses${qs}`);
  },

  async addExpense(expense: Omit<Expense, 'id'>) {
    return fetchJson<{ success: boolean; data: Expense; message: string }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense)
    });
  },

  async getSalaries(teacherId?: string) {
    const qs = teacherId ? `?teacherId=${teacherId}` : '';
    return fetchJson<{ success: boolean; data: TeacherSalary[] }>(`/salaries${qs}`);
  },

  // Tasks
  async getTasks(assignedTo?: string) {
    const qs = assignedTo ? `?assignedTo=${assignedTo}` : '';
    return fetchJson<{ success: boolean; data: StaffTask[] }>(`/tasks${qs}`);
  },

  async createTask(task: Omit<StaffTask, 'id' | 'createdAt'>) {
    return fetchJson<{ success: boolean; data: StaffTask }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    });
  },

  async updateTaskStatus(taskId: string, status: StaffTask['status']) {
    return fetchJson<{ success: boolean; data: StaffTask }>(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Audit & Notifications
  async getAuditLogs() {
    return fetchJson<{ success: boolean; data: AuditLog[] }>('/audit-logs');
  },

  async getNotifications() {
    return fetchJson<{ success: boolean; data: SystemNotification[] }>('/notifications');
  },

  async markNotificationAsRead(id: string) {
    return fetchJson<{ success: boolean }>(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  },

  async markAllNotificationsAsRead() {
    return fetchJson<{ success: boolean }>('/notifications/read-all', {
      method: 'POST'
    });
  },

  // AI Advisor
  async askAi(prompt: string, contextData?: any, language?: string) {
    return fetchJson<{ success: boolean; text: string; provider: string }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({ prompt, contextData, language })
    });
  },

  // System Backup & Reset
  async exportDatabase() {
    return fetch('/api/system/export').then(res => res.text());
  },

  async restoreDatabase(jsonString: string) {
    return fetchJson<{ success: boolean; message: string }>('/system/restore', {
      method: 'POST',
      body: jsonString
    });
  },

  async resetDatabase() {
    return fetchJson<{ success: boolean; message: string }>('/system/reset', {
      method: 'POST'
    });
  }
};
