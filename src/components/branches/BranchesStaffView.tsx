import React, { useState } from 'react';
import {
  Building2, Users, CheckSquare, Plus, Phone, Mail,
  Calendar, Clock, Shield, CheckCircle2, AlertCircle, X,
  Trash2, GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { StaffMember, StaffTask, UserRole } from '../../types';

export const BranchesStaffView: React.FC = () => {
  const {
    branches, staff, tasks, selectedBranchId,
    addStaffTask, updateTaskStatus, addStaffMember, deleteStaffMember
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'branches' | 'staff' | 'tasks'>('branches');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<StaffMember | null>(null);

  // New staff form state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('+998 ');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('teacher');
  const [newStaffBranchId, setNewStaffBranchId] = useState(branches[0]?.id || 'br-1');
  const [newStaffSpecialty, setNewStaffSpecialty] = useState('');
  const [newStaffSalaryType, setNewStaffSalaryType] = useState<StaffMember['salaryType']>('revenue_percent');
  const [newStaffSalaryRate, setNewStaffSalaryRate] = useState<number>(40);

  // New task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState(staff[0]?.id || 'stf-1');
  const [taskDueDate, setTaskDueDate] = useState('2026-10-18');
  const [taskPriority, setTaskPriority] = useState<StaffTask['priority']>('medium');

  const filteredStaff = selectedBranchId === 'all'
    ? staff
    : staff.filter(s => s.branchId === selectedBranchId);

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addStaffTask({
      title: taskTitle,
      description: taskDesc,
      assignedTo: taskAssignee,
      dueDate: taskDueDate,
      priority: taskPriority,
      status: 'pending',
      createdBy: 'Bosh direktor'
    });

    setIsAddTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const roleTitles: Record<string, string> = {
    super_admin: 'Bosh direktor / Markaz egasi',
    branch_manager: 'Filial rahbari',
    admin: 'Bosh administrator',
    crm_manager: 'Menejer / Sotuv bo‘limi',
    cashier: 'Bosh kassir',
    teacher: 'O‘qituvchi / Murabbiy'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.branches}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Filiallar tarmog‘i, xodimlar shtati va operatsion vazifalar nazorati
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {activeTab === 'staff' && (
            <button
              onClick={() => setIsAddStaffModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi xodim / o‘qituvchi</span>
            </button>
          )}

          {activeTab === 'tasks' && (
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi vazifa berish</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('branches')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'branches'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Filiallar ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'staff'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Xodimlar va O‘qituvchilar ({filteredStaff.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'tasks'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Operatsion Vazifalar ({tasks.length})
        </button>
      </div>

      {/* Tab 1: Branches Grid */}
      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.map(br => (
            <div
              key={br.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {br.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mas’ul: {br.managerName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="text-[11px] text-slate-500">
                  {br.address}
                </p>
                <div className="font-mono text-slate-700 dark:text-slate-300">
                  {br.phone}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Faol o‘quvchilar:</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {br.activeStudentsCount} nafar
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Xonalar soni:</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm">
                    {br.roomsCount} ta auditoriya
                  </strong>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Oylik aylanma:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {(br.monthlyRevenue / 1000000).toFixed(1)} mln so‘m
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Staff List */}
      {activeTab === 'staff' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Xodim F.I.Sh</th>
                  <th className="py-3 px-4">Lavozim</th>
                  <th className="py-3 px-4">Filial</th>
                  <th className="py-3 px-4">Telefon & Email</th>
                  <th className="py-3 px-4 text-right">Maosh stavkasi</th>
                  <th className="py-3 px-4 text-center">Holat</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStaff.map(s => {
                  const branch = branches.find(b => b.id === s.branchId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={s.avatarUrl || (s.role === 'teacher' ? '/src/assets/images/avatar_teacher_1792036219476.jpg' : '/src/assets/images/avatar_director_1792036219459.jpg')}
                          alt={s.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white block">
                            {s.fullName}
                          </span>
                          {s.specialty && (
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                              {s.specialty}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                        {roleTitles[s.role] || s.role}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {branch?.name.replace(' filiali', '')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div>{s.phone}</div>
                        <div className="text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {s.salaryType === 'revenue_percent' ? `${s.salaryRate}% (tushumdan)` : `${s.salaryRate.toLocaleString()} so‘m`}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 uppercase">
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setMemberToDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title={s.role === 'teacher' ? "O‘qituvchini o‘chirish" : "Xodimni o‘chirish"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Staff Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          {tasks.map(tsk => {
            const assignee = staff.find(s => s.id === tsk.assignedTo);
            return (
              <div
                key={tsk.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {tsk.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      tsk.priority === 'urgent' ? 'bg-rose-50 text-rose-700' :
                      tsk.priority === 'high' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tsk.priority}
                    </span>
                  </div>
                  <p className="text-slate-500">{tsk.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span>Mas’ul: <strong>{assignee?.fullName || 'Xodim'}</strong></span>
                    <span>·</span>
                    <span>Muddat: <strong className="font-mono text-slate-700 dark:text-slate-300">{tsk.dueDate}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={tsk.status}
                    onChange={e => updateTaskStatus(tsk.id, e.target.value as any)}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium"
                  >
                    <option value="pending">Kutilmoqda</option>
                    <option value="in_progress">Bajarilmoqda</option>
                    <option value="completed">Bajarildi (Tayyor)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Xodimga vazifa tayinlash
              </h3>
              <button onClick={() => setIsAddTaskModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Vazifa sarlavhasi *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="Masalan: 102-auditoriya kompyuterlarini tekshirish"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Batafsil tavsif</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                  placeholder="Vazifa bajarilish shartlari va topshirish talablari..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Ijrochi xodim</label>
                  <select
                    value={taskAssignee}
                    onChange={e => setTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Muddat</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTaskModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Vazifani tayinlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff / Teacher Modal */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <button
              onClick={() => setIsAddStaffModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Yangi xodim yoki o‘qituvchi qo‘shish
                </h3>
                <p className="text-xs text-slate-500">
                  Lavozim, filial va maosh stavkasini biriktiring
                </p>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!newStaffName.trim()) return;
                addStaffMember({
                  fullName: newStaffName.trim(),
                  phone: newStaffPhone.trim(),
                  email: newStaffEmail.trim() || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@eduverse.uz`,
                  role: newStaffRole,
                  branchId: newStaffBranchId,
                  specialty: newStaffRole === 'teacher' ? (newStaffSpecialty.trim() || 'Fan ustozi') : undefined,
                  salaryType: newStaffSalaryType,
                  salaryRate: Number(newStaffSalaryRate) || 0,
                  status: 'active',
                  experienceYears: 3,
                  rating: 4.9
                });
                setIsAddStaffModalOpen(false);
                setNewStaffName('');
                setNewStaffPhone('+998 ');
                setNewStaffEmail('');
                setNewStaffSpecialty('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  F.I.Sh (Ism, Familiya) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Jamshid Yo‘ldoshev"
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Telefon raqami *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+998 (90) 123-45-67"
                    value={newStaffPhone}
                    onChange={e => setNewStaffPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Lavozim *
                  </label>
                  <select
                    value={newStaffRole}
                    onChange={e => setNewStaffRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="teacher">O‘qituvchi / Murabbiy</option>
                    <option value="admin">Administrator</option>
                    <option value="crm_manager">Menejer / Sotuv</option>
                    <option value="cashier">Kassir</option>
                    <option value="branch_manager">Filial rahbari</option>
                  </select>
                </div>
              </div>

              {newStaffRole === 'teacher' && (
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Fan / Mutaxassislik (O‘qituvchi uchun)
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: IELTS 7.5+ yoki Frontend Web"
                    value={newStaffSpecialty}
                    onChange={e => setNewStaffSpecialty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Filial *
                  </label>
                  <select
                    value={newStaffBranchId}
                    onChange={e => setNewStaffBranchId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    {branches.map(br => (
                      <option key={br.id} value={br.id}>{br.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    To‘lov modeli
                  </label>
                  <select
                    value={newStaffSalaryType}
                    onChange={e => {
                      const st = e.target.value as StaffMember['salaryType'];
                      setNewStaffSalaryType(st);
                      if (st === 'revenue_percent') setNewStaffSalaryRate(40);
                      else if (st === 'per_student') setNewStaffSalaryRate(350000);
                      else if (st === 'fixed') setNewStaffSalaryRate(7000000);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="revenue_percent">Foiz stavka (%)</option>
                    <option value="per_student">O‘quvchi boshiga (so‘m)</option>
                    <option value="fixed">Fiksirlangan maosh (so‘m)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Stavka qiymati ({newStaffSalaryType === 'revenue_percent' ? '%' : 'so‘m'})
                </label>
                <input
                  type="number"
                  value={newStaffSalaryRate}
                  onChange={e => setNewStaffSalaryRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 relative">
            <button
              onClick={() => setMemberToDelete(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {memberToDelete.role === 'teacher' ? 'O‘qituvchini o‘chirish' : 'Xodimni o‘chirish'}
                </h4>
                <p className="text-xs text-slate-500">
                  Ushbu amalni ortga qaytarib bo‘lmaydi
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mb-5">
              Rostdan ham <strong className="text-slate-900 dark:text-white">{memberToDelete.fullName}</strong>ni ({roleTitles[memberToDelete.role] || memberToDelete.role}) tizimdan o‘chirib tashlamoqchimisiz?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaffMember(memberToDelete.id);
                  setMemberToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>O‘chirilsin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
