import React, { useState } from 'react';
import {
  Users, TrendingUp, Wallet, AlertTriangle, UserPlus,
  FileCheck2, CheckCircle2, ChevronRight, Calendar,
  ArrowUpRight, ArrowDownRight, Building2, BarChart2,
  Clock, DollarSign, Columns3, ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { NavItemKey } from '../common/Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: NavItemKey) => void;
  onOpenQuickAction: (actionType: 'add_lead' | 'add_student' | 'add_teacher' | 'add_payment' | 'add_contract' | 'add_expense') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenQuickAction }) => {
  const {
    students, leads, contracts, payments, expenses, groups,
    branches, selectedBranchId, attendance
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Filter based on branch if selected
  const branchStudents = selectedBranchId === 'all'
    ? students
    : students.filter(s => s.branchId === selectedBranchId);

  const branchLeads = selectedBranchId === 'all'
    ? leads
    : leads.filter(l => l.branchId === selectedBranchId);

  const branchContracts = selectedBranchId === 'all'
    ? contracts
    : contracts.filter(c => c.branchId === selectedBranchId);

  const branchPayments = selectedBranchId === 'all'
    ? payments
    : payments.filter(p => p.branchId === selectedBranchId);

  const branchExpenses = selectedBranchId === 'all'
    ? expenses
    : expenses.filter(e => e.branchId === selectedBranchId);

  // Financial calculations
  const totalMonthlyRevenue = branchPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalMonthlyExpenses = branchExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalMonthlyRevenue - totalMonthlyExpenses;

  const totalDebt = branchStudents
    .filter(s => s.balance < 0)
    .reduce((sum, s) => sum + Math.abs(s.balance), 0);

  const activeStudentsCount = branchStudents.filter(s => s.status === 'active').length;
  const newLeadsCount = branchLeads.filter(l => l.stage === 'yangi').length;
  const officializedContractsCount = branchContracts.filter(c => c.status === 'officialized').length;

  const averageAttendance = branchStudents.length > 0
    ? Math.round(branchStudents.reduce((sum, s) => sum + s.attendanceRate, 0) / branchStudents.length)
    : 92;

  // Conversion rate: active students / total leads
  const conversionRate = branchLeads.length > 0
    ? Math.round((branchLeads.filter(l => l.stage === 'faol_oquvchi').length / branchLeads.length) * 100)
    : 38;

  // Chart data simulation
  const months = ['May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt'];
  const revenuePoints = [210, 245, 290, 310, 420, Math.round(totalMonthlyRevenue / 1000000) || 480];
  const expensePoints = [140, 160, 180, 195, 250, Math.round(totalMonthlyExpenses / 1000000) || 290];

  const maxVal = Math.max(...revenuePoints, ...expensePoints);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner: Welcome & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.dashboard}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.tagline}
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
            {(['today', 'week', 'month', 'year'] as const).map(d => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  dateRange === d
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {d === 'today' ? 'Bugun' : d === 'week' ? 'Hafta' : d === 'month' ? 'Oylik' : 'Yillik'}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenQuickAction('add_student')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.dashboard.quickActionStudent}</span>
          </button>
          <button
            onClick={() => onOpenQuickAction('add_payment')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t.dashboard.quickActionPayment}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (6 metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1: Students */}
        <div
          onClick={() => onNavigate('students')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-blue-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>{t.dashboard.kpiActiveStudents}</span>
            <Users className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {activeStudentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
            <span>Jami: {branchStudents.length} nafar</span>
          </div>
        </div>

        {/* Metric 2: Monthly Revenue */}
        <div
          onClick={() => onNavigate('finance')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-emerald-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>{t.dashboard.kpiMonthlyRevenue}</span>
            <Wallet className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
            {(totalMonthlyRevenue / 1000000).toFixed(1)}M <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% o‘sish</span>
          </div>
        </div>

        {/* Metric 3: Total Debt */}
        <div
          onClick={() => onNavigate('finance')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-rose-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>{t.dashboard.kpiTotalDebt}</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
            {(totalDebt / 1000).toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-rose-500 mt-1.5">
            {branchStudents.filter(s => s.balance < 0).length} nafar qarzdor
          </div>
        </div>

        {/* Metric 4: New Leads */}
        <div
          onClick={() => onNavigate('crm')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-amber-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>{t.dashboard.kpiNewLeads}</span>
            <Columns3 className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {newLeadsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Konversiya: {conversionRate}%
          </div>
        </div>

        {/* Metric 5: Average Attendance */}
        <div
          onClick={() => onNavigate('attendance')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-cyan-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>{t.dashboard.kpiAttendanceRate}</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {averageAttendance}%
          </div>
          <div className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-1.5">
            Yuqori intizom
          </div>
        </div>

        {/* Metric 6: Officialized Contracts */}
        <div
          onClick={() => onNavigate('contracts')}
          className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-purple-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>E-Shartnomalar</span>
            <FileCheck2 className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-purple-600 dark:text-purple-400">
            {officializedContractsCount}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SMS tasdiqlangan</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Visualizations: Asymmetric 2-column split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left (7 cols): Revenue & Expense dynamics */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.dashboard.revenueExpenseFlow}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Oxirgi 6 oylik kassa tushumi va xarajatlar balansi (mln so‘mda)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Tushum
              </span>
              <span className="flex items-center gap-1.5 text-rose-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Xarajat
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-64 flex items-end gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {months.map((m, i) => {
              const revHeight = Math.round((revenuePoints[i] / maxVal) * 100);
              const expHeight = Math.round((expensePoints[i] / maxVal) * 100);
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-4 bg-blue-600 dark:bg-blue-500 rounded-t-sm group-hover:brightness-110 transition-all relative"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {revenuePoints[i]}M
                      </span>
                    </div>
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expHeight}%` }}
                      className="w-4 bg-rose-500/80 dark:bg-rose-500/70 rounded-t-sm group-hover:brightness-110 transition-all relative"
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {expensePoints[i]}M
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{m}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Sof operatsion foyda: <strong className="text-slate-900 dark:text-white font-mono">{((totalMonthlyRevenue - totalMonthlyExpenses) / 1000000).toFixed(1)}M so‘m</strong></span>
            <button
              onClick={() => onNavigate('finance')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Moliya bo‘limiga o‘tish <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right (5 cols): CRM Funnel & Conversion breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {t.dashboard.conversionBreakdown}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                {conversionRate}% muvaffaqiyat
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Murojaatdan to faol o‘quvchiga aylanishgacha bo‘lgan voronka
            </p>

            <div className="space-y-3.5">
              {[
                { label: '1. Yangi lidlar', count: branchLeads.length, color: 'bg-blue-500', width: '100%' },
                { label: '2. Bog‘lanildi va maslahat', count: Math.round(branchLeads.length * 0.82), color: 'bg-indigo-500', width: '82%' },
                { label: '3. Sinov darsiga yozildi', count: Math.round(branchLeads.length * 0.65), color: 'bg-cyan-500', width: '65%' },
                { label: '4. Shartnoma yuborildi', count: Math.round(branchLeads.length * 0.48), color: 'bg-amber-500', width: '48%' },
                { label: '5. To‘lov qildi & Faol o‘quvchi', count: Math.round(branchLeads.length * 0.38), color: 'bg-emerald-500', width: '38%' }
              ].map(st => (
                <div key={st.label} className="text-xs">
                  <div className="flex items-center justify-between mb-1 text-slate-700 dark:text-slate-300">
                    <span>{st.label}</span>
                    <span className="font-mono font-semibold">{st.count} ta</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: st.width }} className={`h-full ${st.color} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500">Eng samarador kanal: <strong>Instagram & Telegram</strong></span>
            <button
              onClick={() => onNavigate('crm')}
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              CRM voronkani ochish <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Today Classes & Debtors Quick Alert Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today Classes Schedule */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Bugungi rejalashtirilgan darslar
              </h3>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              To‘liq jadval
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {groups.slice(0, 4).map(grp => (
              <div key={grp.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{grp.name}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-blue-600 dark:text-blue-400">{grp.startTime} - {grp.endTime}</span>
                    <span>·</span>
                    <span>Xona: {grp.roomId}</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('attendance')}
                  className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 rounded hover:bg-blue-100 transition-colors"
                >
                  Davomat
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Debtors Immediate Action list */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                To‘lov muddati yaqinlashgan / Qarzdorlar
              </h3>
            </div>
            <button
              onClick={() => onNavigate('finance')}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              Qarzdorlar ro‘yxati
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.filter(s => s.balance < 0).slice(0, 4).map(st => (
              <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{st.fullName}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{st.phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-rose-600 dark:text-rose-400">
                    {Math.abs(st.balance).toLocaleString()} so‘m
                  </div>
                  <button
                    onClick={() => onOpenQuickAction('add_payment')}
                    className="text-[11px] text-emerald-600 hover:underline font-medium"
                  >
                    To‘lovni kiritish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
