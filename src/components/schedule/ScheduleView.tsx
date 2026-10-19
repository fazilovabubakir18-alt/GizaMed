import React, { useState } from 'react';
import {
  Calendar as CalendarIcon, Clock, Users, MapPin,
  AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Group } from '../../types';

export const ScheduleView: React.FC = () => {
  const { groups, courses, staff, rooms, branches, selectedBranchId } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState<'Dush' | 'Sesh' | 'Chor' | 'Pay' | 'Jum' | 'Shan'>('Dush');

  const days: ('Dush' | 'Sesh' | 'Chor' | 'Pay' | 'Jum' | 'Shan')[] = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];

  const timeSlots = [
    '09:00 - 11:00',
    '11:30 - 13:30',
    '14:00 - 16:00',
    '16:30 - 18:30',
    '18:30 - 20:30'
  ];

  const branchGroups = selectedBranchId === 'all'
    ? groups
    : groups.filter(g => g.branchId === selectedBranchId);

  // Clash Detection Algorithm:
  // Detect if two groups share the same room OR same teacher on the same day and overlapping time!
  const clashes: { group1: Group; group2: Group; reason: string }[] = [];

  for (let i = 0; i < branchGroups.length; i++) {
    for (let j = i + 1; j < branchGroups.length; j++) {
      const g1 = branchGroups[i];
      const g2 = branchGroups[j];

      // Check common days
      const commonDays = g1.daysOfWeek.filter(d => g2.daysOfWeek.includes(d));
      if (commonDays.length > 0) {
        // Time overlap check:
        if (g1.startTime === g2.startTime) {
          if (g1.roomId === g2.roomId) {
            clashes.push({
              group1: g1,
              group2: g2,
              reason: `Xona to‘qnashuvi (${g1.roomId}): ${g1.name} va ${g2.name} bir vaqtda (${commonDays.join(', ')}) bir xonaga belgilangan!`
            });
          } else if (g1.teacherId === g2.teacherId) {
            clashes.push({
              group1: g1,
              group2: g2,
              reason: `O‘qituvchi to‘qnashuvi: O‘qituvchi ayni vaqtda ikkala guruhga dars o‘ta olmaydi!`
            });
          }
        }
      }
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.schedule.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Haftalik dars jadvali, xonalar bandligi va to‘qnashuvlarni avtomatik nazorat qilish tizimi
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Haftalik jadval
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'day'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Kunlik ko‘rinish
            </button>
          </div>
        </div>
      </div>

      {/* Clash Warning or Clean Status Banner */}
      {clashes.length > 0 ? (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-rose-900 dark:text-rose-200 block text-sm font-bold">
              Diqqat: Dars jadvalida {clashes.length} ta to‘qnashuv aniqlandi!
            </strong>
            <ul className="mt-1 space-y-1 text-rose-700 dark:text-rose-300">
              {clashes.map((c, idx) => (
                <li key={idx}>• {c.reason}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t.schedule.noConflicts} — Barcha xonalar va o‘qituvchilar vaqti optimal taqsimlangan.</span>
        </div>
      )}

      {/* Day Selector if in Day View */}
      {viewMode === 'day' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {days.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === d
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {d === 'Dush' ? 'Dushanba' :
               d === 'Sesh' ? 'Seshanba' :
               d === 'Chor' ? 'Chorshanba' :
               d === 'Pay' ? 'Payshanba' :
               d === 'Jum' ? 'Juma' : 'Shanba'}
            </button>
          ))}
        </div>
      )}

      {/* Timetable Grid View */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 w-36 border-r border-slate-200 dark:border-slate-800">
                  Dars vaqti
                </th>
                {(viewMode === 'week' ? days : [selectedDay]).map(d => (
                  <th key={d} className="py-3 px-4 border-r border-slate-200 dark:border-slate-800 text-center">
                    {d === 'Dush' ? 'Dushanba' :
                     d === 'Sesh' ? 'Seshanba' :
                     d === 'Chor' ? 'Chorshanba' :
                     d === 'Pay' ? 'Payshanba' :
                     d === 'Jum' ? 'Juma' : 'Shanba'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {timeSlots.map(slot => {
                const [start] = slot.split(' - ');
                return (
                  <tr key={slot} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                    {/* Time slot header */}
                    <td className="py-4 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-800/30 border-r border-slate-200 dark:border-slate-800">
                      {slot}
                    </td>

                    {/* Day Cells */}
                    {(viewMode === 'week' ? days : [selectedDay]).map(d => {
                      const matchingGroups = branchGroups.filter(g =>
                        g.daysOfWeek.includes(d) && g.startTime.startsWith(start.substring(0, 2))
                      );

                      return (
                        <td
                          key={d}
                          className="py-3 px-3 border-r border-slate-200 dark:border-slate-800 align-top min-w-[170px]"
                        >
                          {matchingGroups.length === 0 ? (
                            <div className="h-14 flex items-center justify-center text-slate-300 dark:text-slate-700 text-[11px]">
                              Bo‘sh
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {matchingGroups.map(grp => {
                                const teacher = staff.find(s => s.id === grp.teacherId);
                                const room = rooms.find(r => r.id === grp.roomId);
                                const isClashing = clashes.some(c => c.group1.id === grp.id || c.group2.id === grp.id);

                                return (
                                  <div
                                    key={grp.id}
                                    className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                                      isClashing
                                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                                        : 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-slate-800 dark:text-slate-200'
                                    }`}
                                  >
                                    <div className="font-bold truncate text-[11px] text-blue-700 dark:text-blue-300">
                                      {grp.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <MapPin className="w-2.5 h-2.5" />
                                      <span className="truncate">{room?.name || grp.roomId}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 dark:text-slate-300 truncate">
                                      {teacher?.fullName.split(' ')[0]}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
