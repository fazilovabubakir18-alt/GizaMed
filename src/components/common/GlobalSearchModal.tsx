import React, { useState, useEffect } from 'react';
import { Search, X, Users, BookOpen, Columns3, FileText, ArrowRight, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { NavItemKey } from './Sidebar';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavItemKey) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { students, groups, leads, contracts, staff } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredStudents = q ? students.filter(s => s.fullName.toLowerCase().includes(q) || s.phone.includes(q)).slice(0, 4) : [];
  const filteredTeachers = q ? staff.filter(s => s.role === 'teacher' && (s.fullName.toLowerCase().includes(q) || s.phone.includes(q) || s.specialty?.toLowerCase().includes(q))).slice(0, 3) : [];
  const filteredGroups = q ? groups.filter(g => g.name.toLowerCase().includes(q)).slice(0, 3) : [];
  const filteredLeads = q ? leads.filter(l => l.fullName.toLowerCase().includes(q) || l.phone.includes(q)).slice(0, 3) : [];
  const filteredContracts = q ? contracts.filter(c => c.contractNumber.toLowerCase().includes(q)).slice(0, 3) : [];

  const hasResults = filteredStudents.length > 0 || filteredTeachers.length > 0 || filteredGroups.length > 0 || filteredLeads.length > 0 || filteredContracts.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.common.globalSearchPlaceholder}
            className="w-full py-3.5 px-3 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="ml-2 text-xs text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="py-8 text-center text-xs text-slate-400">
              O‘quvchi, guruh, lid yoki shartnoma raqamini kiriting...
            </div>
          )}

          {q && !hasResults && (
            <div className="py-8 text-center text-xs text-slate-400">
              Hech qanday natija topilmadi
            </div>
          )}

          {/* Students */}
          {filteredStudents.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.nav.students}</span>
              </div>
              <div className="space-y-1">
                {filteredStudents.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { onNavigate('students'); onClose(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{s.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{s.phone}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teachers */}
          {filteredTeachers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>{t.nav.teachers || 'O‘qituvchilar'}</span>
              </div>
              <div className="space-y-1">
                {filteredTeachers.map(teacher => (
                  <button
                    key={teacher.id}
                    onClick={() => { onNavigate('teachers'); onClose(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{teacher.fullName}</div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {teacher.specialty || 'Fan ustozi'} • {teacher.phone}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Groups */}
          {filteredGroups.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.nav.courses}</span>
              </div>
              <div className="space-y-1">
                {filteredGroups.map(g => (
                  <button
                    key={g.id}
                    onClick={() => { onNavigate('courses'); onClose(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{g.name}</div>
                      <div className="text-[11px] text-slate-500">{g.daysOfWeek.join(', ')} · {g.startTime}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <Columns3 className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.nav.crm}</span>
              </div>
              <div className="space-y-1">
                {filteredLeads.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { onNavigate('crm'); onClose(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{l.fullName}</div>
                      <div className="text-[11px] text-slate-500">{l.phone} · {l.stage}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contracts */}
          {filteredContracts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-500" />
                <span>{t.nav.contracts}</span>
              </div>
              <div className="space-y-1">
                {filteredContracts.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { onNavigate('contracts'); onClose(); }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{c.contractNumber}</div>
                      <div className="text-[11px] text-slate-500">{c.monthlyAmount.toLocaleString()} so‘m · {c.status}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
