import React from 'react';
import { AlertTriangle, Trash2, X, Users, BookOpen } from 'lucide-react';
import { StaffMember, Group } from '../../types';

interface DeleteTeacherConfirmModalProps {
  isOpen: boolean;
  teacher: StaffMember | null;
  assignedGroups: Group[];
  totalStudentsCount: number;
  onClose: () => void;
  onConfirm: (teacherId: string) => void;
}

export const DeleteTeacherConfirmModal: React.FC<DeleteTeacherConfirmModalProps> = ({
  isOpen,
  teacher,
  assignedGroups,
  totalStudentsCount,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              O‘qituvchini o‘chirish
            </h3>
            <p className="text-xs text-slate-500">
              Ushbu amal tizimda qayd qilinadi
            </p>
          </div>
        </div>

        {/* Teacher Mini Info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 mb-4">
          <img
            src={teacher.avatarUrl || '/src/assets/images/avatar_teacher_1792036219476.jpg'}
            alt={teacher.fullName}
            className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
              {teacher.fullName}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 truncate">
              {teacher.specialty || 'Fan ustozi'}
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              {teacher.phone}
            </p>
          </div>
        </div>

        {/* Impact Warning */}
        {assignedGroups.length > 0 ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl mb-5 space-y-2 text-xs text-amber-800 dark:text-amber-300">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              Diqqat: O‘qituvchiga biriktirilgan guruhlar mavjud!
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-amber-900/40 p-2 rounded-lg">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{assignedGroups.length} ta guruh</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-100/60 dark:bg-amber-900/40 p-2 rounded-lg">
                <Users className="w-3.5 h-3.5" />
                <span>~{totalStudentsCount} ta o‘quvchi</span>
              </div>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              O‘qituvchi o‘chirilgach, bu guruhlar saqlanadi, lekin o‘qituvchi ustuni bo‘sh qoladi va ularga yangi murabbiy tayinlash talab etiladi.
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-5">
            Rostdan ham <strong className="text-slate-900 dark:text-white">{teacher.fullName}</strong>ni o‘chirib yubormoqchimisiz?
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(teacher.id);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ha, o‘chirilsin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
