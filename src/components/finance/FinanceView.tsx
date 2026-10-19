import React, { useState } from 'react';
import {
  Wallet, DollarSign, ArrowDownLeft, ArrowUpRight, Plus,
  CreditCard, Smartphone, Banknote, Building2, Send,
  AlertTriangle, CheckCircle2, Search, Filter, Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { PaymentMethod, ExpenseCategory } from '../../types';

interface FinanceViewProps {
  initialStudentIdForPayment?: string | null;
  onClearInitialStudentId?: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  initialStudentIdForPayment,
  onClearInitialStudentId
}) => {
  const {
    payments, expenses, cashRegisters, students, branches,
    salaries, staff, selectedBranchId, recordPayment, addExpense
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'payments' | 'cashdesk' | 'expenses' | 'debtors' | 'salaries'>('payments');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(!!initialStudentIdForPayment);
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentIdForPayment || students[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(1000000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('payme');
  const [paymentNote, setPaymentNote] = useState('');
  const [cashierBranchId, setCashierBranchId] = useState('br-1');

  // Expense Modal state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('utilities');
  const [expenseAmount, setExpenseAmount] = useState<number>(500000);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseBranchId, setExpenseBranchId] = useState('br-1');

  // Reminder alert toast state
  const [reminderSentStudentId, setReminderSentStudentId] = useState<string | null>(null);

  // Filter based on branch
  const branchPayments = selectedBranchId === 'all'
    ? payments
    : payments.filter(p => p.branchId === selectedBranchId);

  const branchExpenses = selectedBranchId === 'all'
    ? expenses
    : expenses.filter(e => e.branchId === selectedBranchId);

  const branchCashRegisters = selectedBranchId === 'all'
    ? cashRegisters
    : cashRegisters.filter(c => c.branchId === selectedBranchId);

  const branchStudents = selectedBranchId === 'all'
    ? students
    : students.filter(s => s.branchId === selectedBranchId);

  const debtorsList = branchStudents.filter(s => s.balance < 0);

  const totalRevenue = branchPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = branchExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCashBalance = branchCashRegisters.reduce((sum, cr) => sum + cr.currentBalance, 0);
  const totalDebt = debtorsList.reduce((sum, s) => sum + Math.abs(s.balance), 0);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    recordPayment({
      studentId: st.id,
      groupId: st.groupId,
      branchId: st.branchId || cashierBranchId,
      amount: Number(paymentAmount),
      paymentMethod,
      cashierName: 'Kassir',
      note: paymentNote || 'O‘qish to‘lovi'
    });

    setIsPaymentModalOpen(false);
    if (onClearInitialStudentId) onClearInitialStudentId();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      branchId: expenseBranchId,
      category: expenseCategory,
      amount: Number(expenseAmount),
      description: expenseDesc || 'Xarajat chiqimi',
      date: new Date().toISOString().substring(0, 10),
      approvedBy: 'Bosh direktor'
    });
    setIsExpenseModalOpen(false);
    setExpenseDesc('');
  };

  const handleSendReminder = (stId: string) => {
    setReminderSentStudentId(stId);
    setTimeout(() => {
      setReminderSentStudentId(null);
    }, 3000);
  };

  const paymentMethodBadges: Record<PaymentMethod, { label: string; cls: string; icon: any }> = {
    payme: { label: 'Payme', cls: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300', icon: Smartphone },
    click: { label: 'Click', cls: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300', icon: Smartphone },
    uzum: { label: 'Uzum Bank', cls: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300', icon: CreditCard },
    cash: { label: 'Naqd pul', cls: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300', icon: Banknote },
    terminal: { label: 'Terminal', cls: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300', icon: CreditCard },
    bank_transfer: { label: 'Hisob raqam', cls: 'text-slate-700 bg-slate-100 dark:bg-slate-800', icon: Building2 }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.finance.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            To‘lovlar, kassa operatsiyalari, xarajatlar moddasi va qarzdorlar hisoboti
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>{t.finance.addExpense}</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.finance.newPayment}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">Jami tushum</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {totalRevenue.toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{branchPayments.length} ta operatsiya</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">Jami xarajatlar</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {totalExpenses.toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{branchExpenses.length} ta xarajat yozuvi</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">Kassalardagi naqd qoldiq</div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {totalCashBalance.toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{branchCashRegisters.length} ta faol kassa</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="text-xs text-slate-500 mb-1">Qarzdorlik miqdori</div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {totalDebt.toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">{debtorsList.length} nafar o‘quvchi</div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-medium">
        {[
          { key: 'payments', label: `To‘lovlar tarixi (${branchPayments.length})` },
          { key: 'debtors', label: `Qarzdorlar (${debtorsList.length})` },
          { key: 'cashdesk', label: `Filial kassalari (${branchCashRegisters.length})` },
          { key: 'expenses', label: `Xarajatlar moddasi (${branchExpenses.length})` },
          { key: 'salaries', label: `O‘qituvchilar maoshi (${salaries.length})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Payments Table */}
      {activeTab === 'payments' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Kvitansiya №</th>
                  <th className="py-3 px-4">O‘quvchi</th>
                  <th className="py-3 px-4">To‘lov usuli</th>
                  <th className="py-3 px-4 text-right">Summa</th>
                  <th className="py-3 px-4">Sana va Vaqt</th>
                  <th className="py-3 px-4">Mas’ul</th>
                  <th className="py-3 px-4">Izoh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {branchPayments.map(p => {
                  const student = students.find(s => s.id === p.studentId);
                  const method = paymentMethodBadges[p.paymentMethod] || { label: p.paymentMethod, cls: 'bg-slate-100', icon: CreditCard };
                  const Icon = method.icon;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900 dark:text-white">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {student?.fullName || 'O‘quvchi'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${method.cls}`}>
                          <Icon className="w-3 h-3" />
                          <span>{method.label}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        +{p.amount.toLocaleString()} so‘m
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {p.date}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {p.cashierName}
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {p.note || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Debtors List */}
      {activeTab === 'debtors' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">O‘quvchi F.I.Sh</th>
                  <th className="py-3 px-4">Telefon</th>
                  <th className="py-3 px-4">Ota-ona</th>
                  <th className="py-3 px-4 text-right">Qarzdorlik miqdori</th>
                  <th className="py-3 px-4 text-right">Oylik to‘lov</th>
                  <th className="py-3 px-4 text-center">Eslatma yuborish</th>
                  <th className="py-3 px-4 text-center">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {debtorsList.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      {st.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      {st.phone}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {st.guardianName || 'Mustaqil'} ({st.guardianPhone || '—'})
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      {Math.abs(st.balance).toLocaleString()} so‘m
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      {st.monthlyFee.toLocaleString()} so‘m
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleSendReminder(st.id)}
                        className="px-2.5 py-1 text-[11px] rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 hover:bg-blue-100 font-medium inline-flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>{reminderSentStudentId === st.id ? 'SMS Yuborildi ✓' : 'SMS Eslatma'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedStudentId(st.id);
                          setPaymentAmount(Math.abs(st.balance));
                          setIsPaymentModalOpen(true);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                      >
                        Qabul qilish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cash Registers */}
      {activeTab === 'cashdesk' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branchCashRegisters.map(cr => {
            const branch = branches.find(b => b.id === cr.branchId);
            return (
              <div key={cr.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{cr.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{branch?.name}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                    Ochiq smena
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-1">Kassadagi naqd pul:</span>
                  <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                    {cr.currentBalance.toLocaleString()} <span className="text-xs font-normal text-slate-400">so‘m</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>Smena ochilgan vaqt: <span className="font-mono">{cr.openedAt}</span></div>
                  <div>Mas’ul kassir: <strong>{cr.openedBy}</strong></div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => alert(`Smena hisoboti chop etildi: ${cr.name}`)}
                    className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    X-Hisobot
                  </button>
                  <button
                    onClick={() => alert(`Smena yopildi va inkassatsiya qilindi: ${cr.name}`)}
                    className="flex-1 py-1.5 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg text-xs font-medium hover:opacity-90"
                  >
                    Smenani yopish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 4: Expenses Table */}
      {activeTab === 'expenses' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Xarajat moddasi</th>
                  <th className="py-3 px-4">Tavsif</th>
                  <th className="py-3 px-4 text-right">Summa</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Tasdiqladi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {branchExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white capitalize">
                      {e.category === 'rent' ? 'Ijara' :
                       e.category === 'marketing' ? 'Reklama va Marketing' :
                       e.category === 'utilities' ? 'Kommunal va Internet' :
                       e.category === 'equipment' ? 'Jihozlar va Texnika' : e.category}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {e.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                      -{e.amount.toLocaleString()} so‘m
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {e.date}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {e.approvedBy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Teacher Payroll */}
      {activeTab === 'salaries' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">O‘qituvchi</th>
                  <th className="py-3 px-4">Maosh hisoblash turi</th>
                  <th className="py-3 px-4 text-right">Asosiy maosh</th>
                  <th className="py-3 px-4 text-right">Mukofot (Bonus)</th>
                  <th className="py-3 px-4 text-right">Jami to‘lanadi</th>
                  <th className="py-3 px-4 text-center">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salaries.map(sal => {
                  const teacher = staff.find(s => s.id === sal.teacherId);
                  return (
                    <tr key={sal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                        {teacher?.fullName || 'O‘qituvchi'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {sal.salaryType === 'revenue_percent' ? 'Tushumdan foiz (40%)' : 'O‘quvchi boshiga'}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800 dark:text-slate-200">
                        {sal.baseAmount.toLocaleString()} so‘m
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-600">
                        +{sal.bonusAmount.toLocaleString()} so‘m
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        {sal.totalCalculated.toLocaleString()} so‘m
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          To‘langan ({sal.paidAt})
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                To‘lov qabul qilish
              </h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="text-xl">×</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">O‘quvchi</label>
                <select
                  value={selectedStudentId}
                  onChange={e => {
                    setSelectedStudentId(e.target.value);
                    const st = students.find(s => s.id === e.target.value);
                    if (st && st.balance < 0) {
                      setPaymentAmount(Math.abs(st.balance));
                    } else if (st) {
                      setPaymentAmount(st.monthlyFee);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.phone}) — {s.balance < 0 ? `Qarz: ${Math.abs(s.balance).toLocaleString()} so‘m` : '0 qarz'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">To‘lov summasi (so‘m) *</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">To‘lov usuli</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'payme', label: 'Payme' },
                    { id: 'click', label: 'Click' },
                    { id: 'uzum', label: 'Uzum' },
                    { id: 'cash', label: 'Naqd' },
                    { id: 'terminal', label: 'Terminal' },
                    { id: 'bank_transfer', label: 'Hisob raqam' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`py-2 rounded-lg border font-medium text-center ${
                        paymentMethod === m.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Izoh / Kvitansiya maqsadi</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  placeholder="Masalan: Oktabr oyi to‘liq to‘lovi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  To‘lovni qabul qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Xarajat chiqimini qayd etish
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <span className="text-xl">×</span>
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Xarajat toifasi</label>
                <select
                  value={expenseCategory}
                  onChange={e => setExpenseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="rent">Ijara haqi</option>
                  <option value="marketing">Reklama va Marketing</option>
                  <option value="utilities">Kommunal va Internet</option>
                  <option value="equipment">Jihozlar va Texnika</option>
                  <option value="office_supply">Kantselyariya va Maishiy</option>
                  <option value="other">Boshqa xarajatlar</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Summa (so‘m) *</label>
                <input
                  type="number"
                  step="50000"
                  required
                  value={expenseAmount}
                  onChange={e => setExpenseAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Filial kassasidan chiqim</label>
                <select
                  value={expenseBranchId}
                  onChange={e => setExpenseBranchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Batafsil tavsif</label>
                <textarea
                  rows={2}
                  required
                  value={expenseDesc}
                  onChange={e => setExpenseDesc(e.target.value)}
                  placeholder="Masalan: Optik tolali internet 1 oylik to‘lovi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Kassadan chiqim qilish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
