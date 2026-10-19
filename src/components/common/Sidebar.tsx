import React from 'react';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, Calendar, CheckSquare,
  FileCheck2, Columns3, FileText, Wallet, Building2,
  Bot, BarChart3, HelpCircle, Settings, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';

export type NavItemKey =
  | 'dashboard'
  | 'students'
  | 'teachers'
  | 'courses'
  | 'schedule'
  | 'attendance'
  | 'homework'
  | 'crm'
  | 'contracts'
  | 'finance'
  | 'branches'
  | 'aiAssistant'
  | 'reports'
  | 'support'
  | 'settings';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapsed
}) => {
  const { hasPermission } = useAuth();
  const { language } = useTheme();
  const t = useTranslation(language);

  const navItems: { key: NavItemKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { key: 'students', label: t.nav.students, icon: Users },
    { key: 'teachers', label: t.nav.teachers, icon: GraduationCap },
    { key: 'courses', label: t.nav.courses, icon: BookOpen },
    { key: 'schedule', label: t.nav.schedule, icon: Calendar },
    { key: 'attendance', label: t.nav.attendance, icon: CheckSquare },
    { key: 'homework', label: t.nav.homework, icon: FileCheck2 },
    { key: 'crm', label: t.nav.crm, icon: Columns3 },
    { key: 'contracts', label: t.nav.contracts, icon: FileText },
    { key: 'finance', label: t.nav.finance, icon: Wallet },
    { key: 'branches', label: t.nav.branches, icon: Building2 },
    { key: 'aiAssistant', label: t.nav.aiAssistant, icon: Bot },
    { key: 'reports', label: t.nav.reports, icon: BarChart3 },
    { key: 'support', label: t.nav.support, icon: HelpCircle },
    { key: 'settings', label: t.nav.settings, icon: Settings }
  ];

  const visibleItems = navItems.filter(item => hasPermission(item.key, 'view'));

  return (
    <aside
      className={`h-screen sticky top-0 bg-[var(--color-sidebar)] text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 z-40 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src="/src/assets/images/eduverse_logo_mark_1792036197442.jpg"
            alt="Eduverse"
            className="w-8 h-8 rounded-lg object-cover shrink-0 ring-1 ring-blue-500/30"
          />
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-white text-base tracking-tight leading-none">
                EDUVERSE
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1">
                CRM · ERP Platform
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapsed}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? "Menyuni yoyish" : "Menyuni qisqartirish"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectTab(item.key)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              {!collapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
          <span>v2.4 Pro</span>
          <span className="text-emerald-400 flex items-center gap-1 font-mono">
            Online
          </span>
        </div>
      )}
    </aside>
  );
};
