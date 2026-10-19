import React, { useState } from 'react';
import { X, UserPlus, Columns3, Wallet, FileText, ArrowDownLeft, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSpecificModal: (actionType: 'add_lead' | 'add_student' | 'add_teacher' | 'add_payment' | 'add_contract' | 'add_expense') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onOpenSpecificModal
}) => {
  const { language } = useTheme();
  const t = useTranslation(language);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'add_lead',
      title: t.dashboard.quickActionLead,
      desc: 'Instagram, Telegram yoki tashrifdan kelgan yangi lidni ro‘yxatga olish',
      icon: Columns3,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'
    },
    {
      id: 'add_student',
      title: t.dashboard.quickActionStudent,
      desc: 'Yangi o‘quvchini kurs va guruhga biriktirib bazaga kiritish',
      icon: UserPlus,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'
    },
    {
      id: 'add_teacher',
      title: 'Yangi o‘qituvchi',
      desc: 'Yangi o‘qituvchini filial, fan va ish haqi stavkasi bilan ro‘yxatga olish',
      icon: GraduationCap,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900'
    },
    {
      id: 'add_payment',
      title: t.dashboard.quickActionPayment,
      desc: 'Payme, Click, Uzum, Terminal yoki naqd to‘lovni qayd qilish',
      icon: Wallet,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900'
    },
    {
      id: 'add_contract',
      title: t.dashboard.quickActionContract,
      desc: 'O‘quvchi yoki ota-ona uchun yangi elektron shartnoma rasmiylashtirish',
      icon: FileText,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900'
    },
    {
      id: 'add_expense',
      title: t.finance.addExpense,
      desc: 'Ijara, kommunal, reklama yoki xo‘jalik xarajatlarini kassa chiqimiga yozish',
      icon: ArrowDownLeft,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900'
    }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Tezkor amallar (Quick Action)
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {actions.map(act => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onClose();
                  onOpenSpecificModal(act.id);
                }}
                className="w-full text-left p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-start gap-3.5 transition-all group"
              >
                <div className={`p-2.5 rounded-lg border ${act.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {act.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {act.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
