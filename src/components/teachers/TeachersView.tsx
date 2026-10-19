import React, { useState } from 'react';
import {
  GraduationCap, Plus, Search, Filter, Phone, Mail,
  Building2, BookOpen, Users, Star, Award, DollarSign,
  Edit3, Trash2, ChevronRight, LayoutGrid, List, CheckCircle2,
  Calendar, Clock, ShieldCheck
} from 'lucide-react';
import { StaffMember, Group } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { AddTeacherModal } from './AddTeacherModal';
import { TeacherProfileDrawer } from './TeacherProfileDrawer';
import { DeleteTeacherConfirmModal } from './DeleteTeacherConfirmModal';

export const TeachersView: React.FC = () => {
  const {
    staff, branches, groups, students, selectedBranchId,
    deleteTeacher
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [teacherToEdit, setTeacherToEdit] = useState<StaffMember | null>(null);
  const [selectedTeacherForDrawer, setSelectedTeacherForDrawer] = useState<StaffMember | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<StaffMember | null>(null);

  // All teachers in staff
  const allTeachers = staff.filter(s => s.role === 'teacher');

  // Filtered teachers
  const filteredTeachers = allTeachers.filter(teacher => {
    // Branch filter
    if (selectedBranchId !== 'all' && teacher.branchId !== selectedBranchId) {
      return false;
    }
    // Status filter
    if (selectedStatus !== 'all' && teacher.status !== selectedStatus) {
      return false;
    }
    // Specialty filter
    if (selectedSpecialty !== 'all') {
      if (!teacher.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase())) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = teacher.fullName.toLowerCase().includes(q);
      const matchPhone = teacher.phone.includes(q);
      const matchSpecialty = teacher.specialty?.toLowerCase().includes(q);
      const matchEmail = teacher.email.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSpecialty && !matchEmail) {
        return false;
      }
    }
    return true;
  });

  // Calculate stats
  const totalTeachersCount = allTeachers.length;
  const activeTeachersCount = allTeachers.filter(t => t.status === 'active').length;

  // Active groups assigned to teachers
  const teacherIds = allTeachers.map(t => t.id);
  const assignedGroupsCount = groups.filter(g => teacherIds.includes(g.teacherId)).length;

  // Total students taught
  const assignedGroupIds = groups.filter(g => teacherIds.includes(g.teacherId)).map(g => g.id);
  const totalStudentsTaught = students.filter(s => assignedGroupIds.includes(s.groupId)).length;

  const handleOpenAddModal = () => {
    setTeacherToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (teacher: StaffMember) => {
    setTeacherToEdit(teacher);
    setIsAddModalOpen(true);
  };

  const handleRequestDelete = (teacher: StaffMember) => {
    setTeacherToDelete(teacher);
  };

  const handleConfirmDelete = (id: string) => {
    deleteTeacher(id);
    if (selectedTeacherForDrawer?.id === id) {
      setSelectedTeacherForDrawer(null);
    }
    setTeacherToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.nav.teachers || 'O‘qituvchilar'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Markaz o‘qituvchilari shtati, fan yo‘nalishlari, dars guruhlari va to‘lov stavkalari
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi o‘qituvchi qo‘shish</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Jami o‘qituvchilar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {totalTeachersCount} nafar
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {activeTeachersCount} faol
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Biriktirilgan guruhlar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
              {assignedGroupsCount} ta
            </span>
            <span className="text-[11px] text-slate-400">
              faol guruh
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Ta’lim olayotgan o‘quvchilar
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {totalStudentsTaught} nafar
            </span>
            <span className="text-[11px] text-slate-400">
              talabalar
            </span>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            O‘rtacha pedagog reytingi
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-500 flex items-center gap-1">
              <Star className="w-5 h-5 fill-current" />
              4.9
            </span>
            <span className="text-[11px] text-slate-400">
              5.0 ballik shkalada
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="O‘qituvchi ismi, fan yoki telefon raqami bo‘yicha qidiruv..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Specialty Filter */}
          <select
            value={selectedSpecialty}
            onChange={e => setSelectedSpecialty(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Barcha fanlar / Mutaxassisliklar</option>
            <option value="Frontend">Frontend Dasturlash</option>
            <option value="Python">Python & Backend</option>
            <option value="IELTS">IELTS & Ingliz tili</option>
            <option value="Dizayn">Grafik Dizayn & UI/UX</option>
            <option value="Matematika">Matematika & Mental</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol ustozlar</option>
            <option value="on_leave">Ta’tilda</option>
            <option value="inactive">Nofaol</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Kartochka ko‘rinishi"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Jadval ko‘rinishi"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Grid vs Table */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            O‘qituvchilar topilmadi
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Qidiruv mezonlariga mos keladigan o‘qituvchi topilmadi yoki hali o‘qituvchilar kiritilmagan.
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi o‘qituvchi qo‘shish</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map(teacher => {
            const branch = branches.find(b => b.id === teacher.branchId);
            const teacherGroups = groups.filter(g => g.teacherId === teacher.id);
            const teacherGroupIds = teacherGroups.map(g => g.id);
            const teacherStudents = students.filter(s => teacherGroupIds.includes(s.groupId));

            return (
              <div
                key={teacher.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group space-y-4"
              >
                {/* Top: Avatar & Name */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={teacher.avatarUrl || '/src/assets/images/avatar_teacher_1792036219476.jpg'}
                        alt={teacher.fullName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800 shadow-xs shrink-0 cursor-pointer"
                        onClick={() => setSelectedTeacherForDrawer(teacher)}
                      />
                      <div className="min-w-0">
                        <h3
                          onClick={() => setSelectedTeacherForDrawer(teacher)}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer truncate"
                        >
                          {teacher.fullName}
                        </h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                          {teacher.specialty || 'Fan ustozi'}
                        </p>
                      </div>
                    </div>

                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                      teacher.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                        : teacher.status === 'on_leave'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {teacher.status === 'active' ? 'Faol' : teacher.status === 'on_leave' ? 'Ta’tilda' : 'Nofaol'}
                    </span>
                  </div>

                  {/* Badges: Branch & Experience */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {branch?.name.replace(' filiali', '') || 'Filial'}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-amber-500" />
                      {teacher.experienceYears || 3} yil tajriba
                    </span>
                    <span className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-mono font-semibold px-1.5 py-0.5 rounded-md ml-auto">
                      <Star className="w-3 h-3 fill-current" />
                      {teacher.rating || 4.9}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{teacher.email}</span>
                    </div>
                  </div>

                  {/* Groups & Students summary */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Guruhlar:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono font-semibold">
                        {teacherGroups.length} ta guruh
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">O‘quvchilar:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono font-semibold">
                        {teacherStudents.length} nafar
                      </strong>
                    </div>
                  </div>

                  {/* Assigned Groups Tags */}
                  {teacherGroups.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Dars guruhlari:</span>
                      <div className="flex flex-wrap gap-1">
                        {teacherGroups.map(grp => (
                          <span
                            key={grp.id}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium truncate max-w-[150px]"
                            title={`${grp.name} (${grp.daysOfWeek.join(', ')} • ${grp.startTime})`}
                          >
                            {grp.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Salary Model Badge */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Maosh modeli:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">
                      {teacher.salaryType === 'revenue_percent' && `${teacher.salaryRate}% tushumdan`}
                      {teacher.salaryType === 'per_student' && `${teacher.salaryRate.toLocaleString()} so‘m / talaba`}
                      {teacher.salaryType === 'fixed' && `${(teacher.salaryRate / 1000000).toFixed(1)} mln oylik`}
                      {teacher.salaryType === 'hourly' && `${teacher.salaryRate.toLocaleString()} so‘m / soat`}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTeacherForDrawer(teacher)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Batafsil ko‘rish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(teacher)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                      title="O‘qituvchini tahrirlash"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRequestDelete(teacher)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="O‘qituvchini o‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">O‘qituvchi F.I.Sh</th>
                  <th className="py-3 px-4">Fan / Mutaxassislik</th>
                  <th className="py-3 px-4">Filial</th>
                  <th className="py-3 px-4">Telefon & Email</th>
                  <th className="py-3 px-4 text-center">Guruhlar</th>
                  <th className="py-3 px-4 text-right">Maosh stavkasi</th>
                  <th className="py-3 px-4 text-center">Holat</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map(teacher => {
                  const branch = branches.find(b => b.id === teacher.branchId);
                  const teacherGroups = groups.filter(g => g.teacherId === teacher.id);

                  return (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setSelectedTeacherForDrawer(teacher)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <img
                            src={teacher.avatarUrl || '/src/assets/images/avatar_teacher_1792036219476.jpg'}
                            alt={teacher.fullName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors block">
                              {teacher.fullName}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ★ {teacher.rating || 4.9} • {teacher.experienceYears || 3} yil tajriba
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {teacher.specialty || 'Fan ustozi'}
                      </td>

                      <td className="py-3 px-4 text-slate-500">
                        {branch?.name.replace(' filiali', '') || 'Bosh filial'}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        <div>{teacher.phone}</div>
                        <div className="text-slate-400 truncate max-w-[150px]">{teacher.email}</div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full text-xs">
                          {teacherGroups.length} ta
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {teacher.salaryType === 'revenue_percent' && `${teacher.salaryRate}%`}
                        {teacher.salaryType === 'per_student' && `${teacher.salaryRate.toLocaleString()} so‘m`}
                        {teacher.salaryType === 'fixed' && `${teacher.salaryRate.toLocaleString()} so‘m`}
                        {teacher.salaryType === 'hourly' && `${teacher.salaryRate.toLocaleString()} s/soat`}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          teacher.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {teacher.status === 'active' ? 'Faol' : teacher.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedTeacherForDrawer(teacher)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Ko‘rish"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(teacher)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRequestDelete(teacher)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        teacherToEdit={teacherToEdit}
        onClose={() => {
          setIsAddModalOpen(false);
          setTeacherToEdit(null);
        }}
      />

      {/* Details Profile Drawer */}
      <TeacherProfileDrawer
        isOpen={Boolean(selectedTeacherForDrawer)}
        teacher={selectedTeacherForDrawer}
        onClose={() => setSelectedTeacherForDrawer(null)}
        onEdit={teacher => {
          setSelectedTeacherForDrawer(null);
          handleOpenEditModal(teacher);
        }}
        onRequestDelete={teacher => {
          setSelectedTeacherForDrawer(null);
          handleRequestDelete(teacher);
        }}
      />

      {/* Delete Confirmation Modal */}
      {teacherToDelete && (
        <DeleteTeacherConfirmModal
          isOpen={Boolean(teacherToDelete)}
          teacher={teacherToDelete}
          assignedGroups={groups.filter(g => g.teacherId === teacherToDelete.id)}
          totalStudentsCount={
            students.filter(s =>
              groups.filter(g => g.teacherId === teacherToDelete.id).map(g => g.id).includes(s.groupId)
            ).length
          }
          onClose={() => setTeacherToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};
