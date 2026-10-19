import React, { useState } from 'react';
import {
  BookOpen, Layers, Plus, Users, Calendar, Clock,
  MapPin, DollarSign, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Course, Group } from '../../types';

export const CoursesGroupsView: React.FC = () => {
  const {
    courses, groups, students, staff, rooms, branches,
    selectedBranchId, addCourse, addGroup
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'groups' | 'courses'>('groups');
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

  // New Course states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseSubject, setCourseSubject] = useState('Dasturlash');
  const [courseMonths, setCourseMonths] = useState(6);
  const [coursePrice, setCoursePrice] = useState(1200000);
  const [courseDesc, setCourseDesc] = useState('');

  // New Group states
  const [groupName, setGroupName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'crs-1');
  const [selectedBranchIdForm, setSelectedBranchIdForm] = useState(branches[0]?.id || 'br-1');
  const [selectedTeacherId, setSelectedTeacherId] = useState(staff.find(s => s.role === 'teacher')?.id || 'stf-3');
  const [selectedRoomId, setSelectedRoomId] = useState(rooms[0]?.id || 'rm-101');
  const [daysSchedule, setDaysSchedule] = useState<Group['daysOfWeek']>(['Dush', 'Chor', 'Jum']);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [groupCapacity, setGroupCapacity] = useState(16);

  // Filter groups
  const filteredGroups = groups.filter(g => {
    if (selectedBranchId !== 'all' && g.branchId !== selectedBranchId) return false;
    return true;
  });

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;

    addCourse({
      title: courseTitle,
      subject: courseSubject,
      durationMonths: Number(courseMonths),
      pricePerMonth: Number(coursePrice),
      description: courseDesc,
      level: 'All levels',
      branchIds: branches.map(b => b.id)
    });

    setIsAddCourseModalOpen(false);
    setCourseTitle('');
    setCourseDesc('');
  };

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const crs = courses.find(c => c.id === selectedCourseId);
    addGroup({
      name: groupName,
      courseId: selectedCourseId,
      branchId: selectedBranchIdForm,
      teacherId: selectedTeacherId,
      roomId: selectedRoomId,
      daysOfWeek: daysSchedule,
      startTime,
      endTime,
      capacity: Number(groupCapacity),
      startDate: new Date().toISOString().substring(0, 10),
      endDate: '2027-04-01',
      monthlyFee: crs?.pricePerMonth || 1000000,
      status: 'active'
    });

    setIsAddGroupModalOpen(false);
    setGroupName('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.courses}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ta’lim dasturlari katalogi, faol guruhlar va xonalarga taqsimot
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi kurs</span>
          </button>
          <button
            onClick={() => setIsAddGroupModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi guruh ochish</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('groups')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'groups'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Faol Guruhlar ({filteredGroups.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'courses'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Kurslar Katalogi ({courses.length})
        </button>
      </div>

      {/* Groups Grid */}
      {activeTab === 'groups' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGroups.map(grp => {
            const course = courses.find(c => c.id === grp.courseId);
            const teacher = staff.find(s => s.id === grp.teacherId);
            const room = rooms.find(r => r.id === grp.roomId);
            const branch = branches.find(b => b.id === grp.branchId);
            const enrolledStudents = students.filter(s => s.groupId === grp.id);
            const fillPercent = Math.round((enrolledStudents.length / grp.capacity) * 100);

            return (
              <div
                key={grp.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {grp.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[220px]">
                        {course?.title}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 uppercase">
                      Faol
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono font-medium">{grp.startTime} - {grp.endTime}</span>
                      <span>({grp.daysOfWeek.join(', ')})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{room?.name || grp.roomId} ({branch?.name.replace(' filiali', '')})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>O‘qituvchi: <strong>{teacher?.fullName || 'Biriktirilmagan'}</strong></span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500">To‘ldirilganlik:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {enrolledStudents.length} / {grp.capacity} o‘rin ({fillPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(fillPercent, 100)}%` }}
                          className={`h-full rounded-full ${
                            fillPercent >= 90 ? 'bg-rose-500' : fillPercent >= 70 ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-900 dark:text-white">
                  <span>{grp.monthlyFee.toLocaleString()} so‘m / oy</span>
                  <span className="text-[11px] font-normal text-slate-500 font-sans">
                    {enrolledStudents.length} ta talaba
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Courses Catalog Grid */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(crs => {
            const courseGroups = groups.filter(g => g.courseId === crs.id);
            const courseStudents = students.filter(s => s.courseId === crs.id);

            return (
              <div
                key={crs.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {crs.subject}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                        {crs.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {crs.level}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {crs.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Davomiyligi:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{crs.durationMonths} oy</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Faol guruhlar:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{courseGroups.length} ta guruh</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                    {crs.pricePerMonth.toLocaleString()} so‘m
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Jami: {courseStudents.length} o‘quvchi
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Course Modal */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Yangi kurs qo‘shish
              </h3>
              <button onClick={() => setIsAddCourseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kurs nomi *</label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={e => setCourseTitle(e.target.value)}
                  placeholder="Masalan: Flutter Mobil Dasturlash"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Yo‘nalish (Fan)</label>
                  <input
                    type="text"
                    value={courseSubject}
                    onChange={e => setCourseSubject(e.target.value)}
                    placeholder="IT & Dasturlash"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Davomiyligi (oy)</label>
                  <input
                    type="number"
                    value={courseMonths}
                    onChange={e => setCourseMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Oylik narxi (so‘m) *</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={coursePrice}
                  onChange={e => setCoursePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Qisqacha tavsif</label>
                <textarea
                  rows={2}
                  value={courseDesc}
                  onChange={e => setCourseDesc(e.target.value)}
                  placeholder="Kurs dasturi, texnologiyalar va kutilayotgan natijalar..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Kursni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Group Modal */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Yangi guruh ochish
              </h3>
              <button onClick={() => setIsAddGroupModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGroupSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Guruh nomi *</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Masalan: Frontend React #45"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kurs</label>
                  <select
                    value={selectedCourseId}
                    onChange={e => setSelectedCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Filial</label>
                  <select
                    value={selectedBranchIdForm}
                    onChange={e => setSelectedBranchIdForm(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">O‘qituvchi</label>
                  <select
                    value={selectedTeacherId}
                    onChange={e => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {staff.filter(s => s.role === 'teacher').map(t => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Xona (Auditoriya)</label>
                  <select
                    value={selectedRoomId}
                    onChange={e => setSelectedRoomId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name} ({r.capacity} o‘rin)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Boshlanish vaqti</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tugash vaqti</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Talabalar limiti</label>
                  <input
                    type="number"
                    value={groupCapacity}
                    onChange={e => setGroupCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddGroupModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Guruhni ochish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
