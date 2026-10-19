import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Phone, Mail, DollarSign, Building2, BookOpen } from 'lucide-react';
import { StaffMember, UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTeacher?: StaffMember | null;
  defaultRole?: UserRole;
}

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  onClose,
  editTeacher,
  defaultRole = 'teacher'
}) => {
  const { branches, courses, addStaffMember, updateStaffMember } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [branchId, setBranchId] = useState(branches[0]?.id || 'br-1');
  const [salaryType, setSalaryType] = useState<StaffMember['salaryType']>('revenue_percent');
  const [salaryRate, setSalaryRate] = useState<number>(40);
  const [status, setStatus] = useState<StaffMember['status']>('active');

  useEffect(() => {
    if (editTeacher) {
      setFullName(editTeacher.fullName);
      setPhone(editTeacher.phone);
      setEmail(editTeacher.email);
      setRole(editTeacher.role);
      setBranchId(editTeacher.branchId);
      setSalaryType(editTeacher.salaryType);
      setSalaryRate(editTeacher.salaryRate);
      setStatus(editTeacher.status);
    } else {
      setFullName('');
      setPhone('+998 ');
      setEmail('');
      setRole(defaultRole);
      setBranchId(branches[0]?.id || 'br-1');
      setSalaryType(defaultRole === 'teacher' ? 'revenue_percent' : 'fixed');
      setSalaryRate(defaultRole === 'teacher' ? 40 : 6000000);
      setStatus('active');
    }
  }, [editTeacher, defaultRole, branches, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    if (editTeacher) {
      updateStaffMember(editTeacher.id, {
        fullName,
        phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@eduverse.uz`,
        role,
        branchId,
        salaryType,
        salaryRate: Number(salaryRate),
        status
      });
    } else {
      addStaffMember({
        fullName,
        phone,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@eduverse.uz`,
        role,
        branchId,
        salaryType,
        salaryRate: Number(salaryRate),
        status,
        avatarUrl: role === 'teacher'
          ? '/src/assets/images/avatar_teacher_1792036219476.jpg'
          : '/src/assets/images/avatar_director_1792036219459.jpg'
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {editTeacher ? 'O‘qituvchi ma’lumotlarini tahrirlash' : 'Yangi o‘qituvchi qo‘shish'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                F.I.Sh (Ism, familiya) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Masalan: Behruz Nurmatov"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Telefon raqami *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          {/* Email & Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Elektron pochta (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="behruz.teacher@eduverse.uz"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Biriktirilgan filial
              </label>
              <select
                value={branchId}
                onChange={e => setBranchId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Lavozimi / Roli
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="teacher">O‘qituvchi / Murabbiy</option>
                <option value="branch_manager">Filial rahbari</option>
                <option value="admin">Administrator</option>
                <option value="crm_manager">Menejer / Sotuv</option>
                <option value="cashier">Kassir</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Holati (Faollik)
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="active">Faol (Active)</option>
                <option value="on_leave">Ta’tilda (On leave)</option>
                <option value="inactive">Nofaol (Inactive)</option>
              </select>
            </div>
          </div>

          {/* Salary Type & Rate */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Maosh hisoblash tizimi
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Maosh turi</label>
                <select
                  value={salaryType}
                  onChange={e => {
                    const st = e.target.value as StaffMember['salaryType'];
                    setSalaryType(st);
                    if (st === 'revenue_percent') setSalaryRate(40);
                    else if (st === 'per_student') setSalaryRate(350000);
                    else if (st === 'hourly') setSalaryRate(100000);
                    else setSalaryRate(7000000);
                  }}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="revenue_percent">Tushumdan foiz (foizda)</option>
                  <option value="per_student">O‘quvchi boshiga (so‘mda)</option>
                  <option value="hourly">Soatbay stavka (so‘m/soat)</option>
                  <option value="fixed">Fiksatsiyalangan oylik (so‘m)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">
                  {salaryType === 'revenue_percent' ? 'Foiz stavkasi (%)' : 'Stavka summasi (so‘m)'}
                </label>
                <input
                  type="number"
                  required
                  value={salaryRate}
                  onChange={e => setSalaryRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{editTeacher ? 'Saqlash' : 'O‘qituvchini qo‘shish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
