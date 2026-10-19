import React, { useState } from 'react';
import {
  CheckSquare, Calendar, Users, Check, X, Clock,
  AlertCircle, Globe, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { AttendanceStatus } from '../../types';

export const AttendanceView: React.FC = () => {
  const {
    groups, students, attendance, courses, branches,
    selectedBranchId, markAttendance, bulkMarkAttendance
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 'grp-1');
  const [selectedDate, setSelectedDate] = useState('2026-10-14');
  const [attendanceNote, setAttendanceNote] = useState<Record<string, string>>({});

  const group = groups.find(g => g.id === selectedGroupId);
  const course = courses.find(c => c.id === group?.courseId);
  const branch = branches.find(b => b.id === group?.branchId);

  const groupStudents = students.filter(s => s.groupId === selectedGroupId);

  const statusConfigs: Record<AttendanceStatus, { label: string; cls: string; icon: any }> = {
    present: { label: 'Keldi', cls: 'bg-emerald-600 text-white', icon: Check },
    absent: { label: 'Kelmadi', cls: 'bg-rose-600 text-white', icon: X },
    late: { label: 'Kechikdi', cls: 'bg-amber-500 text-white', icon: Clock },
    excused: { label: 'Sababli', cls: 'bg-blue-600 text-white', icon: AlertCircle },
    remote: { label: 'Masofaviy', cls: 'bg-purple-600 text-white', icon: Globe }
  };

  const getRecordForStudent = (studentId: string) => {
    return attendance.find(a => a.groupId === selectedGroupId && a.studentId === studentId && a.date === selectedDate);
  };

  const presentCount = groupStudents.filter(s => getRecordForStudent(s.id)?.status === 'present').length;
  const absentCount = groupStudents.filter(s => getRecordForStudent(s.id)?.status === 'absent').length;
  const lateCount = groupStudents.filter(s => getRecordForStudent(s.id)?.status === 'late').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.attendance.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Darslarda qatnashishni 1 bosishda qayd etish, sababli qoldirishlar va davomat statistikasi
          </p>
        </div>

        <button
          onClick={() => bulkMarkAttendance(selectedGroupId, selectedDate, 'present')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t.attendance.markAllPresent}</span>
        </button>
      </div>

      {/* Group & Date Selection Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Group selector */}
          <div className="w-full sm:w-64">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Guruhni tanlang</label>
            <select
              value={selectedGroupId}
              onChange={e => setSelectedGroupId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
            >
              {groups.map(g => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.daysOfWeek.join(', ')} · {g.startTime})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Dars sanasi</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono font-medium text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Group Quick Stats */}
        <div className="flex items-center gap-6 text-xs font-medium">
          <div className="text-center">
            <span className="text-slate-500 block text-[11px]">Jami talabalar</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{groupStudents.length}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block text-[11px]">Keldi</span>
            <span className="font-mono font-bold text-emerald-600">{presentCount}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block text-[11px]">Kelmadi</span>
            <span className="font-mono font-bold text-rose-600">{absentCount}</span>
          </div>
          <div className="text-center">
            <span className="text-slate-500 block text-[11px]">Kechikdi</span>
            <span className="font-mono font-bold text-amber-600">{lateCount}</span>
          </div>
        </div>
      </div>

      {/* Attendance Grid Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs">
            <strong className="text-slate-900 dark:text-white">{group?.name}</strong> · {course?.title} · Xona: {group?.roomId}
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {selectedDate}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {groupStudents.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Bu guruhda hozircha o‘quvchilar yo‘q
            </div>
          ) : (
            groupStudents.map(student => {
              const record = getRecordForStudent(student.id);
              const currentStatus = record?.status;

              return (
                <div
                  key={student.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* Student details */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {student.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-slate-900 dark:text-white">
                        {student.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {student.phone} · Umumiy davomat: {student.attendanceRate}%
                      </div>
                    </div>
                  </div>

                  {/* 1-click status buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(['present', 'absent', 'late', 'excused', 'remote'] as AttendanceStatus[]).map(st => {
                      const cfg = statusConfigs[st];
                      const isSelected = currentStatus === st;
                      const Icon = cfg.icon;

                      return (
                        <button
                          key={st}
                          onClick={() => markAttendance(selectedGroupId, student.id, selectedDate, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isSelected
                              ? `${cfg.cls} shadow-xs`
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
