import React, { useState } from 'react';
import {
  FileCheck2, Plus, Calendar, Clock, CheckCircle2,
  AlertCircle, Award, MessageSquare, ExternalLink, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Homework, HomeworkSubmission } from '../../types';

export const HomeworkView: React.FC = () => {
  const {
    homeworks, submissions, groups, students,
    addHomework, gradeHomeworkSubmission
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id || 'grp-1');
  const [isAddHomeworkModalOpen, setIsAddHomeworkModalOpen] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<HomeworkSubmission | null>(null);

  // New Homework Form states
  const [hwTitle, setHwTitle] = useState('');
  const [hwDesc, setHwDesc] = useState('');
  const [hwDeadline, setHwDeadline] = useState('2026-10-20');

  // Grading Form states
  const [gradeInput, setGradeInput] = useState<number>(85);
  const [feedbackInput, setFeedbackInput] = useState('');

  const groupHomeworks = homeworks.filter(h => h.groupId === selectedGroupId);

  const handleAddHwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;

    addHomework({
      groupId: selectedGroupId,
      title: hwTitle,
      description: hwDesc,
      deadline: hwDeadline
    });

    setIsAddHomeworkModalOpen(false);
    setHwTitle('');
    setHwDesc('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    gradeHomeworkSubmission(gradingSubmission.id, Number(gradeInput), feedbackInput);
    setGradingSubmission(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.homework}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Topshiriqlar berish, talabalar ishlarini tekshirish va baholash jurnali
          </p>
        </div>

        <button
          onClick={() => setIsAddHomeworkModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yangi vazifa berish</span>
        </button>
      </div>

      {/* Group Selector */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between">
        <div className="w-full sm:w-72">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">Guruhni tanlang</label>
          <select
            value={selectedGroupId}
            onChange={e => setSelectedGroupId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white"
          >
            {groups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Homework List & Submissions */}
      <div className="space-y-4">
        {groupHomeworks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            Ushbu guruh uchun berilgan faol uy vazifalari mavjud emas
          </div>
        ) : (
          groupHomeworks.map(hw => {
            const hwSubmissions = submissions.filter(s => s.homeworkId === hw.id);

            return (
              <div
                key={hw.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {hw.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {hw.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="text-slate-400">Muddat:</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40">
                      {hw.deadline} gacha
                    </span>
                  </div>
                </div>

                {/* Submissions Section */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Topshirilgan javoblar ({hwSubmissions.length} ta)
                  </div>

                  {hwSubmissions.length === 0 ? (
                    <div className="py-4 text-center text-slate-400 text-xs">
                      Talabalar hali topshiriq yuborishmagan
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {hwSubmissions.map(sub => {
                        const student = students.find(s => s.id === sub.studentId);
                        return (
                          <div key={sub.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200">
                                {student?.fullName || 'Talaba'}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
                                {sub.content}
                              </p>
                              {sub.feedback && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                                  O‘qituvchi izohi: {sub.feedback}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {sub.grade !== undefined ? (
                                <div className="text-right">
                                  <span className="font-mono font-bold text-sm text-emerald-600">
                                    {sub.grade} / 100 ball
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">Baholangan</span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-amber-600 font-semibold px-2 py-0.5 rounded bg-amber-50">
                                  Tekshirilmoqda
                                </span>
                              )}

                              <button
                                onClick={() => {
                                  setGradingSubmission(sub);
                                  setGradeInput(sub.grade || 85);
                                  setFeedbackInput(sub.feedback || '');
                                }}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-medium"
                              >
                                Baholash
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Homework Modal */}
      {isAddHomeworkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Yangi uy vazifasi berish
              </h3>
              <button onClick={() => setIsAddHomeworkModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddHwSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Topshiriq mavzusi *</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={e => setHwTitle(e.target.value)}
                  placeholder="Masalan: Tailwind CSS Responsive Grid loyihasi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Topshiriq shartlari va havolalar</label>
                <textarea
                  rows={3}
                  required
                  value={hwDesc}
                  onChange={e => setHwDesc(e.target.value)}
                  placeholder="Talabalar nima qilishlari kerak, qanday texnologiyalar qo‘llanilishi shart..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Topshirishning oxirgi muddati</label>
                <input
                  type="date"
                  value={hwDeadline}
                  onChange={e => setHwDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHomeworkModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Vazifani e’lon qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Talaba ishini baholash
              </h3>
              <button onClick={() => setGradingSubmission(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-slate-700 dark:text-slate-300">
                Talaba: <strong>{students.find(s => s.id === gradingSubmission.studentId)?.fullName}</strong>
                <p className="mt-1 font-mono text-[11px] text-slate-500">{gradingSubmission.content}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Baho (1 dan 100 gacha ball) *
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  required
                  value={gradeInput}
                  onChange={e => setGradeInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  O‘qituvchi taqrizi va tavsiyalari
                </label>
                <textarea
                  rows={2}
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  placeholder="Yaxshi bajarilgan qismlar, xatolar va tuzatishlar..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Bahoni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
