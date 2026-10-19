import React, { useState } from 'react';
import {
  X, User, Phone, MapPin, Calendar, BookOpen,
  Wallet, CheckCircle2, FileText, Award, Edit3, Trash2, Send
} from 'lucide-react';
import { Student, PaymentTransaction, Contract, AttendanceRecord, HomeworkSubmission } from '../../types';
import { useApp } from '../../context/AppContext';

interface StudentProfileDrawerProps {
  student: Student | null;
  onClose: () => void;
  onOpenPaymentModal: (studentId: string) => void;
  onEditStudent: (student: Student) => void;
}

export const StudentProfileDrawer: React.FC<StudentProfileDrawerProps> = ({
  student,
  onClose,
  onOpenPaymentModal,
  onEditStudent
}) => {
  const {
    courses, groups, branches, payments, contracts, attendance,
    deleteStudent
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'payments' | 'attendance' | 'contracts' | 'homework'>('info');

  if (!student) return null;

  const course = courses.find(c => c.id === student.courseId);
  const group = groups.find(g => g.id === student.groupId);
  const branch = branches.find(b => b.id === student.branchId);

  const studentPayments = payments.filter(p => p.studentId === student.id);
  const studentContracts = contracts.filter(c => c.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);

  const statusColors = {
    active: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300',
    trial: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300',
    new: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300',
    frozen: 'text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300',
    graduated: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300',
    expelled: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
              {student.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {student.fullName}
                </h2>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${statusColors[student.status]}`}>
                  {student.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono mt-1">
                {student.phone} · ID: {student.id}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditStudent(student)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Tahrirlash"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`${student.fullName}ni o‘chirishni tasdiqlaysizmi?`)) {
                  deleteStudent(student.id);
                  onClose();
                }
              }}
              className="p-2 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              title="O‘chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Balance & Action Strip */}
        <div className="px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Balans holati</span>
              <span className={`font-mono font-bold text-sm ${student.balance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {student.balance < 0 ? `-${Math.abs(student.balance).toLocaleString()} so‘m (Qarz)` : `+${student.balance.toLocaleString()} so‘m`}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Oylik to‘lov</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {student.monthlyFee.toLocaleString()} so‘m
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Davomat ko‘rsatkichi</span>
              <span className="font-mono font-semibold text-blue-600">
                {student.attendanceRate}%
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenPaymentModal(student.id)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>To‘lov qabul qilish</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-6 text-xs font-medium">
          {[
            { key: 'info', label: 'Ma’lumotlar' },
            { key: 'payments', label: `To‘lovlar (${studentPayments.length})` },
            { key: 'attendance', label: `Davomat (${studentAttendance.length})` },
            { key: 'contracts', label: `Shartnomalar (${studentContracts.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-xs space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Educational info */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Ta’lim ma’lumotlari</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Kurs:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{course?.title || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Guruh:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{group?.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Filial:</span>
                    <span className="text-slate-800 dark:text-slate-200">{branch?.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Qabul qilingan sana:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{student.enrolledDate}</span>
                  </div>
                </div>
              </div>

              {/* Personal & Guardian info */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span>Ota-ona va Shaxsiy ma’lumotlar</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Tug‘ilgan sana:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{student.birthDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Yashash manzili:</span>
                    <span className="text-slate-800 dark:text-slate-200">{student.address || 'Kiritilmagan'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ota-ona (Vakil):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{student.guardianName || 'Mustaqil'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Ota-ona telefoni:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">{student.guardianPhone || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {student.notes && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block mb-1 font-semibold">Qo‘shimcha izoh:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{student.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-3">
              {studentPayments.length === 0 ? (
                <div className="py-8 text-center text-slate-400">To‘lov yozuvlari mavjud emas</div>
              ) : (
                studentPayments.map(p => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        +{p.amount.toLocaleString()} so‘m
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Kvitansiya: {p.receiptNumber} · Usul: {p.paymentMethod.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 font-mono block">{p.date}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Muvaffaqiyatli</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-2">
              {studentAttendance.length === 0 ? (
                <div className="py-8 text-center text-slate-400">Davomat yozuvlari topilmadi</div>
              ) : (
                studentAttendance.map(a => (
                  <div key={a.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{a.date}</span>
                      {a.note && <p className="text-[11px] text-slate-500 mt-0.5">{a.note}</p>}
                    </div>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      a.status === 'present' ? 'bg-emerald-50 text-emerald-700' :
                      a.status === 'late' ? 'bg-amber-50 text-amber-700' :
                      a.status === 'excused' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {a.status === 'present' ? 'Kelgan' : a.status === 'late' ? 'Kechikkan' : a.status === 'excused' ? 'Sababli' : 'Kelmadi'}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-3">
              {studentContracts.length === 0 ? (
                <div className="py-8 text-center text-slate-400">Shartnomalar tuzilmagan</div>
              ) : (
                studentContracts.map(c => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">{c.contractNumber}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        c.status === 'officialized' ? 'bg-purple-50 text-purple-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {c.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      Umumiy qiymat: <strong className="font-mono">{c.totalAmount.toLocaleString()} so‘m</strong> (Oylik: {c.monthlyAmount.toLocaleString()} so‘m)
                    </div>
                    {c.smsVerifiedAt && (
                      <div className="text-[11px] text-emerald-600 flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>SMS orqali tasdiqlangan: {c.smsVerifiedAt}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
