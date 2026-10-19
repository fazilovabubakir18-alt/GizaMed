import React from 'react';
import {
  X, Phone, Mail, Building2, BookOpen, Users,
  Calendar, Award, Star, DollarSign, Clock,
  Edit3, Trash2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { StaffMember, Group, Student, Course } from '../../types';
import { useApp } from '../../context/AppContext';

interface TeacherProfileDrawerProps {
  isOpen: boolean;
  teacher: StaffMember | null;
  onClose: () => void;
  onEdit: (teacher: StaffMember) => void;
  onRequestDelete: (teacher: StaffMember) => void;
}

export const TeacherProfileDrawer: React.FC<TeacherProfileDrawerProps> = ({
  isOpen,
  teacher,
  onClose,
  onEdit,
  onRequestDelete
}) => {
  const { branches, groups, students, courses } = useApp();

  if (!isOpen || !teacher) return null;

  const branch = branches.find(b => b.id === teacher.branchId);

  // Groups taught by this teacher
  const teacherGroups = groups.filter(g => g.teacherId === teacher.id);

  // Total students in these groups
  const groupIds = teacherGroups.map(g => g.id);
  const teacherStudents = students.filter(s => groupIds.includes(s.groupId));

  // Estimate earnings based on formula
  let estimatedEarnings = 0;
  if (teacher.salaryType === 'fixed') {
    estimatedEarnings = teacher.salaryRate;
  } else if (teacher.salaryType === 'per_student') {
    estimatedEarnings = teacherStudents.length * teacher.salaryRate;
  } else if (teacher.salaryType === 'revenue_percent') {
    // Total group revenue * percent
    const totalGroupRevenue = teacherStudents.reduce((acc, s) => acc + s.monthlyFee, 0);
    estimatedEarnings = Math.round((totalGroupRevenue * teacher.salaryRate) / 100);
  } else if (teacher.salaryType === 'hourly') {
    // Approximate 36 hours a month per group
    estimatedEarnings = teacherGroups.length * 36 * teacher.salaryRate;
  }

  const roleLabels: Record<string, string> = {
    fixed: 'Fiksirlangan oylik',
    revenue_percent: 'Tushumdan foiz',
    per_student: 'O‘quvchi boshiga to‘lov',
    hourly: 'Soatbay to‘lov'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              O‘qituvchi profili
            </span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
              teacher.status === 'active'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                : teacher.status === 'on_leave'
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {teacher.status === 'active' ? '● Faol' : teacher.status === 'on_leave' ? '● Ta’tilda' : '● Nofaol'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={teacher.avatarUrl || '/src/assets/images/avatar_teacher_1792036219476.jpg'}
              alt={teacher.fullName}
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {teacher.fullName}
              </h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {teacher.specialty || 'Fan ustozi'}
              </p>
              <div className="flex items-center gap-3 text-slate-500 text-xs">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {branch?.name || 'Filial'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  {teacher.experienceYears || 3} yillik tajriba
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold font-mono">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {teacher.rating || 4.9}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Action pills */}
          <div className="flex flex-wrap gap-2.5">
            <a
              href={`tel:${teacher.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 font-mono transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{teacher.phone}</span>
            </a>
            <a
              href={`mailto:${teacher.email}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>{teacher.email}</span>
            </a>
          </div>

          {/* KPI Metrics cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">Guruhlari</span>
              <strong className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                {teacherGroups.length} ta
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">O‘quvchilari</span>
              <strong className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                {teacherStudents.length} nafar
              </strong>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block mb-1">Oylik hisob</span>
              <strong className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 block truncate">
                {(estimatedEarnings / 1000000).toFixed(1)} mln so‘m
              </strong>
            </div>
          </div>

          {/* Salary Formula Box */}
          <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Maosh hisoblash sxemasi
              </span>
              <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                {roleLabels[teacher.salaryType] || teacher.salaryType}
              </span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 text-[11px]">
              {teacher.salaryType === 'revenue_percent' && `Har bir o‘quvchi to‘lagan to‘lov summasidan ${teacher.salaryRate}% ulush o‘qituvchiga hisoblanadi.`}
              {teacher.salaryType === 'per_student' && `O‘qitilayotgan har bir faol o‘quvchi uchun ${teacher.salaryRate.toLocaleString()} so‘m oylik stavka hisoblanadi.`}
              {teacher.salaryType === 'fixed' && `Har oy qat’iy belgilangan ${teacher.salaryRate.toLocaleString()} so‘m xizmat haqi to‘lanadi.`}
              {teacher.salaryType === 'hourly' && `Har bir o‘tilgan akademik soat uchun ${teacher.salaryRate.toLocaleString()} so‘m stavka hisoblanadi.`}
            </p>
          </div>

          {/* Bio if exists */}
          {teacher.bio && (
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                O‘qituvchi haqida
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                {teacher.bio}
              </p>
            </div>
          )}

          {/* Assigned Groups Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Biriktirilgan guruhlar ({teacherGroups.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                Jami: {teacherStudents.length} ta o‘quvchi
              </span>
            </div>

            {teacherGroups.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400">
                Hozircha bu o‘qituvchiga guruh biriktirilmagan.
              </div>
            ) : (
              <div className="space-y-2">
                {teacherGroups.map(grp => {
                  const course = courses.find(c => c.id === grp.courseId);
                  const groupStudents = students.filter(s => s.groupId === grp.id);

                  return (
                    <div
                      key={grp.id}
                      className="p-3 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors flex items-center justify-between"
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white truncate">
                            {grp.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                            {course?.title || 'Kurs'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {grp.daysOfWeek.join(', ')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {grp.startTime} - {grp.endTime}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                            <Users className="w-3 h-3 text-slate-400" />
                            {groupStudents.length}/{grp.capacity}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs block">
                          {(grp.monthlyFee / 1000).toLocaleString()} ming
                        </span>
                        <span className="text-[10px] text-slate-400">oyiga</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => onRequestDelete(teacher)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>O‘qituvchini o‘chirish</span>
          </button>

          <button
            onClick={() => {
              onEdit(teacher);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Tahrirlash</span>
          </button>
        </div>
      </div>
    </div>
  );
};
