import React, { useState } from 'react';
import {
  Users, Search, Filter, Plus, Download, MoreHorizontal,
  ChevronRight, Phone, BookOpen, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Student, StudentStatus } from '../../types';
import { StudentProfileDrawer } from './StudentProfileDrawer';
import { AddStudentModal } from './AddStudentModal';

interface StudentsViewProps {
  onOpenPaymentModal: (studentId: string) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onOpenPaymentModal }) => {
  const { students, courses, groups, branches, selectedBranchId } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(s => {
    if (selectedBranchId !== 'all' && s.branchId !== selectedBranchId) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (courseFilter !== 'all' && s.courseId !== courseFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.fullName.toLowerCase().includes(q) || s.phone.includes(q);
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['ID', 'F.I.Sh', 'Telefon', 'Kurs', 'Guruh', 'Holat', 'Balans', 'Davomat %'];
    const rows = filteredStudents.map(s => {
      const crs = courses.find(c => c.id === s.courseId)?.title || '';
      const grp = groups.find(g => g.id === s.groupId)?.name || '';
      return [s.id, s.fullName, s.phone, crs, grp, s.status, s.balance, s.attendanceRate];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `eduverse_students_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadges: Record<StudentStatus, { label: string; cls: string }> = {
    active: { label: 'Faol', cls: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300' },
    trial: { label: 'Sinov', cls: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
    new: { label: 'Yangi', cls: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300' },
    frozen: { label: 'Muzlatilgan', cls: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
    graduated: { label: 'Tugatgan', cls: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300' },
    expelled: { label: 'Chiqarilgan', cls: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.students}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Markazdagi barcha o‘quvchilar profili, qarzdorlik va davomat tahlili ({filteredStudents.length} nafar)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.common.export}</span>
          </button>

          <button
            onClick={() => { setEditingStudent(null); setIsAddModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi o‘quvchi</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ism yoki telefon bo‘yicha qidirish..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200"
          >
            <option value="all">Barcha holatlar</option>
            <option value="active">Faol o‘quvchilar</option>
            <option value="trial">Sinov darsidagilar</option>
            <option value="new">Yangi qabul qilingan</option>
            <option value="frozen">Muzlatilgan</option>
            <option value="graduated">Kursni tugatgan</option>
          </select>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 max-w-[200px]"
          >
            <option value="all">Barcha kurslar</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* High-density Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">O‘quvchi F.I.Sh</th>
                <th className="py-3 px-4">Kurs va Guruh</th>
                <th className="py-3 px-4">Filial</th>
                <th className="py-3 px-4">Holat</th>
                <th className="py-3 px-4 text-right">Balans</th>
                <th className="py-3 px-4 text-right">Davomat</th>
                <th className="py-3 px-4 text-right">Oylik to‘lov</th>
                <th className="py-3 px-4 text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    O‘quvchilar ro‘yxati bo‘sh yoki qidiruv bo‘yicha natija topilmadi
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const crs = courses.find(c => c.id === student.courseId);
                  const grp = groups.find(g => g.id === student.groupId);
                  const br = branches.find(b => b.id === student.branchId);
                  const badge = statusBadges[student.status] || { label: student.status, cls: 'bg-slate-100 text-slate-600' };

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      {/* Name & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {student.fullName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {student.phone}
                        </div>
                      </td>

                      {/* Course & Group */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-[200px]">
                          {crs?.title || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {grp?.name || 'Guruh biriktirilmagan'}
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {br?.name.replace(' filiali', '') || '—'}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {student.balance < 0 ? (
                          <span className="text-rose-600 dark:text-rose-400">
                            -{Math.abs(student.balance).toLocaleString()} so‘m
                          </span>
                        ) : student.balance > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            +{student.balance.toLocaleString()} so‘m
                          </span>
                        ) : (
                          <span className="text-slate-400">0 so‘m</span>
                        )}
                      </td>

                      {/* Attendance */}
                      <td className="py-3 px-4 text-right font-mono font-semibold">
                        <span className={student.attendanceRate < 80 ? 'text-amber-600' : 'text-slate-700 dark:text-slate-300'}>
                          {student.attendanceRate}%
                        </span>
                      </td>

                      {/* Monthly fee */}
                      <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                        {student.monthlyFee.toLocaleString()} so‘m
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onOpenPaymentModal(student.id)}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded font-semibold text-[11px] transition-colors"
                        >
                          To‘lov
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Drawer */}
      <StudentProfileDrawer
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onOpenPaymentModal={id => {
          setSelectedStudent(null);
          onOpenPaymentModal(id);
        }}
        onEditStudent={s => {
          setSelectedStudent(null);
          setEditingStudent(s);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingStudent(null); }}
        editStudent={editingStudent}
      />
    </div>
  );
};
