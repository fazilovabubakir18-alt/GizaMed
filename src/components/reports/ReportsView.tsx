import React, { useState } from 'react';
import {
  BarChart3, Download, Printer, Filter, Calendar,
  TrendingUp, Users, Wallet, Building2, CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';

export const ReportsView: React.FC = () => {
  const {
    students, payments, expenses, leads, groups, branches, selectedBranchId
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [reportType, setReportType] = useState<'finance' | 'academic' | 'marketing' | 'branches'>('finance');

  const branchPayments = selectedBranchId === 'all'
    ? payments
    : payments.filter(p => p.branchId === selectedBranchId);

  const branchExpenses = selectedBranchId === 'all'
    ? expenses
    : expenses.filter(e => e.branchId === selectedBranchId);

  const branchStudents = selectedBranchId === 'all'
    ? students
    : students.filter(s => s.branchId === selectedBranchId);

  const branchLeads = selectedBranchId === 'all'
    ? leads
    : leads.filter(l => l.branchId === selectedBranchId);

  const totalRev = branchPayments.reduce((s, p) => s + p.amount, 0);
  const totalExp = branchExpenses.reduce((s, e) => s + e.amount, 0);
  const netIncome = totalRev - totalExp;

  const exportCurrentReport = () => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `eduverse_report_${reportType}_${new Date().toISOString().substring(0, 10)}.csv`;

    if (reportType === 'finance') {
      headers = ['Kvitansiya', 'Sana', 'Summa', 'Usul', 'Filial'];
      rows = branchPayments.map(p => [p.receiptNumber, p.date, p.amount, p.paymentMethod, p.branchId]);
    } else if (reportType === 'academic') {
      headers = ['O‘quvchi', 'Telefon', 'Kurs', 'Guruh', 'Davomat %', 'Balans'];
      rows = branchStudents.map(s => [s.fullName, s.phone, s.courseId, s.groupId, s.attendanceRate, s.balance]);
    } else if (reportType === 'marketing') {
      headers = ['Lid', 'Telefon', 'Manba', 'Bosqich', 'Qiymat'];
      rows = branchLeads.map(l => [l.fullName, l.phone, l.source, l.stage, l.estimatedValue]);
    } else {
      headers = ['Filial', 'Faol talabalar', 'Xonalar', 'Oylik aylanma'];
      rows = branches.map(b => [b.name, b.activeStudentsCount, b.roomsCount, b.monthlyRevenue]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.reports}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Boshqaruv, moliya, ta’lim samaradorligi va marketing bo‘yicha batafsil analitik hisobotlar
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Chop etish</span>
          </button>
          <button
            onClick={exportCurrentReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Eksport</span>
          </button>
        </div>
      </div>

      {/* Report Categories Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { key: 'finance', label: 'Moliya & Kassa', desc: 'Tushum, xarajat, sof foyda', icon: Wallet },
          { key: 'academic', label: 'Ta’lim & Davomat', desc: 'Davomat ko‘rsatkichi va o‘zlashtirish', icon: Users },
          { key: 'marketing', label: 'Marketing & CRM', desc: 'Lidlar oqimi va konversiya', icon: TrendingUp },
          { key: 'branches', label: 'Filiallar solishtiruvi', desc: 'Hududiy samaradorlik taqqosi', icon: Building2 }
        ].map(cat => {
          const Icon = cat.icon;
          const active = reportType === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setReportType(cat.key as any)}
              className={`p-4 rounded-xl border text-left transition-all ${
                active
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <div className="font-bold text-xs text-slate-900 dark:text-white">{cat.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Report Body */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        {reportType === 'finance' && (
          <div className="space-y-6">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Birlashgan moliyaviy hisobot
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Jami tushum</span>
                <span className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                  {totalRev.toLocaleString()} so‘m
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Jami operatsion xarajat</span>
                <span className="font-mono font-bold text-lg text-rose-600 dark:text-rose-400">
                  {totalExp.toLocaleString()} so‘m
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-500 block mb-1">Sof moliyaviy natija</span>
                <span className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                  {netIncome.toLocaleString()} so‘m
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Ushbu hisobot real kassa va to‘lov tranzaksiyalari asosida shakllantirilgan.
            </p>
          </div>
        )}

        {reportType === 'academic' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Ta’lim sifati va Davomat indeksi
            </h3>
            <p className="text-xs text-slate-500">
              O‘rtacha markaz bo‘yicha davomat: <strong className="text-blue-600 font-mono">92.4%</strong>. Faol guruhlar soni: {groups.length} ta.
            </p>
          </div>
        )}

        {reportType === 'marketing' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Sotuv voronkasi va Mijoz jalb qilish narxi
            </h3>
            <p className="text-xs text-slate-500">
              Jami lidlar: {leads.length} ta · Muvaffaqiyatli konversiya: 38% · Eng sermahsul kanal: Instagram
            </p>
          </div>
        )}

        {reportType === 'branches' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Filiallar rentabelligi va solishtiruvi
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {branches.map(b => (
                <div key={b.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="text-slate-400 block text-[11px]">{b.activeStudentsCount} nafar talaba · {b.roomsCount} ta xona</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(b.monthlyRevenue / 1000000).toFixed(1)}M so‘m/oy
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
