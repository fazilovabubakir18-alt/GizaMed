import React, { useState } from 'react';
import {
  Search, Bell, Plus, Globe, Shield, Sparkles,
  Layers, Check, ChevronDown, User, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/translations';
import { LanguageCode, UserRole } from '../../types';

interface TopBarProps {
  onOpenGlobalSearch: () => void;
  onOpenQuickAction: () => void;
  onOpenCustomizer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenGlobalSearch,
  onOpenQuickAction,
  onOpenCustomizer
}) => {
  const { currentRole, setCurrentRole, currentUser } = useAuth();
  const { language, setLanguage } = useTheme();
  const { branches, selectedBranchId, setSelectedBranchId, notifications, markNotificationAsRead } = useApp();
  const t = useTranslation(language);

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showBranchMenu, setShowBranchMenu] = useState(false);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'uz_latin', label: 'O‘zbekcha (Lotin)', flag: '🇺🇿' },
    { code: 'uz_cyrl', label: 'Ўзбекча (Кирилл)', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const roles: { role: UserRole; label: string }[] = [
    { role: 'super_admin', label: t.roles.super_admin },
    { role: 'branch_manager', label: t.roles.branch_manager },
    { role: 'admin', label: t.roles.admin },
    { role: 'crm_manager', label: t.roles.crm_manager },
    { role: 'cashier', label: t.roles.cashier },
    { role: 'teacher', label: t.roles.teacher },
    { role: 'student_parent', label: t.roles.student_parent }
  ];

  const currentBranchName = selectedBranchId === 'all'
    ? t.common.allBranches
    : branches.find(b => b.id === selectedBranchId)?.name || t.common.allBranches;

  return (
    <header className="h-16 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      {/* Left: Search Bar & Branch Switcher */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenGlobalSearch}
          className="flex-1 flex items-center gap-3 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 text-sm transition-all group"
          title="Global qidiruv (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
          <span className="hidden sm:inline truncate">{t.common.globalSearchPlaceholder}</span>
          <span className="sm:hidden">{t.common.search}</span>
          <kbd className="hidden lg:inline-flex ml-auto text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-500 dark:text-slate-300 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Branch Selector Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowBranchMenu(!showBranchMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="max-w-[130px] truncate">{currentBranchName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showBranchMenu && (
            <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t.common.branch}
              </div>
              <button
                onClick={() => { setSelectedBranchId('all'); setShowBranchMenu(false); }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedBranchId === 'all' ? 'text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'}`}
              >
                <span>{t.common.allBranches}</span>
                {selectedBranchId === 'all' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
              {branches.map(b => (
                <button
                  key={b.id}
                  onClick={() => { setSelectedBranchId(b.id); setShowBranchMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${selectedBranchId === b.id ? 'text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span className="truncate">{b.name}</span>
                  {selectedBranchId === b.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Quick Action, Role Switcher, Language, Notifications, Customizer */}
      <div className="flex items-center gap-2">
        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.common.add}</span>
        </button>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
            title="Rolni almashtirish (Test uchun)"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden md:inline max-w-[110px] truncate">{roles.find(r => r.role === currentRole)?.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1.5 z-50">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {t.settings.activeRole}
              </div>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => { setCurrentRole(r.role); setShowRoleMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${currentRole === r.role ? 'text-indigo-600 font-semibold bg-indigo-50/50 dark:bg-indigo-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>{r.label}</span>
                  {currentRole === r.role && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="Tilni o‘zgartirish"
          >
            <Globe className="w-4 h-4" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1.5 z-50">
              {languages.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${language === l.code ? 'text-blue-600 font-semibold bg-blue-50/50 dark:bg-blue-950/30' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </span>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Customizer Trigger */}
        <button
          onClick={onOpenCustomizer}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          title="Dizayn va ranglarni sozlash"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDrawer(!showNotifDrawer)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
            title="Bildirishnomalar"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>

          {showNotifDrawer && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Bildirishnomalar ({notifications.length})
                </span>
                <button
                  onClick={() => setShowNotifDrawer(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`py-2.5 cursor-pointer text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${!n.read ? 'font-medium text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatarUrl || '/src/assets/images/avatar_director_1792036219459.jpg'}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>
    </header>
  );
};
