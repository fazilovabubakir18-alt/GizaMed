import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Calendar, BookOpen, Layers } from 'lucide-react';
import { Student } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudent?: Student | null;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  editStudent
}) => {
  const { branches, courses, groups, addStudent, updateStudent } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [birthDate, setBirthDate] = useState('2006-01-01');
  const [branchId, setBranchId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [groupId, setGroupId] = useState('');
  const [monthlyFee, setMonthlyFee] = useState(1000000);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Student['status']>('active');

  useEffect(() => {
    if (editStudent) {
      setFullName(editStudent.fullName);
      setPhone(editStudent.phone);
      setBirthDate(editStudent.birthDate);
      setBranchId(editStudent.branchId);
      setCourseId(editStudent.courseId);
      setGroupId(editStudent.groupId);
      setMonthlyFee(editStudent.monthlyFee);
      setGuardianName(editStudent.guardianName || '');
      setGuardianPhone(editStudent.guardianPhone || '');
      setAddress(editStudent.address || '');
      setNotes(editStudent.notes || '');
      setStatus(editStudent.status);
    } else {
      setFullName('');
      setPhone('+998 ');
      setBirthDate('2006-01-01');
      setBranchId(branches[0]?.id || 'br-1');
      setCourseId(courses[0]?.id || 'crs-1');
      setGroupId(groups[0]?.id || 'grp-1');
      setMonthlyFee(courses[0]?.pricePerMonth || 1000000);
      setGuardianName('');
      setGuardianPhone('+998 ');
      setAddress('');
      setNotes('');
      setStatus('active');
    }
  }, [editStudent, branches, courses, groups, isOpen]);

  // Update monthly fee when course changes
  const handleCourseChange = (id: string) => {
    setCourseId(id);
    const crs = courses.find(c => c.id === id);
    if (crs) setMonthlyFee(crs.pricePerMonth);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    if (editStudent) {
      updateStudent(editStudent.id, {
        fullName,
        phone,
        birthDate,
        branchId,
        courseId,
        groupId,
        monthlyFee,
        guardianName,
        guardianPhone,
        address,
        notes,
        status
      });
    } else {
      addStudent({
        fullName,
        phone,
        birthDate,
        branchId,
        courseId,
        groupId,
        monthlyFee,
        guardianName,
        guardianPhone,
        guardianRelation: 'Ota-ona',
        address,
        notes,
        status,
        balance: 0
      });
    }
    onClose();
  };

  const availableGroups = groups.filter(g => g.branchId === branchId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {editStudent ? 'O‘quvchi ma’lumotlarini tahrirlash' : 'Yangi o‘quvchi qo‘shish'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                F.I.Sh (To‘liq ism) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Masalan: Sardor Komilov"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
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

          {/* Branch, Course & Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Filial
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

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Kurs
              </label>
              <select
                value={courseId}
                onChange={e => handleCourseChange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Guruh
              </label>
              <select
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                {availableGroups.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Monthly fee & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Oylik to‘lov summasi (so‘m)
              </label>
              <input
                type="number"
                step="50000"
                value={monthlyFee}
                onChange={e => setMonthlyFee(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                O‘quvchi holati
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              >
                <option value="active">Faol (Active)</option>
                <option value="trial">Sinov darsida (Trial)</option>
                <option value="new">Yangi (New)</option>
                <option value="frozen">Muzlatilgan (Frozen)</option>
                <option value="graduated">Tugatgan (Graduated)</option>
                <option value="expelled">Chiqarilgan (Expelled)</option>
              </select>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Ota-ona / Qonuniy vakil ma’lumotlari (Voyaga yetmaganlar uchun)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Ota-ona F.I.Sh</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={e => setGuardianName(e.target.value)}
                  placeholder="Masalan: Anvar Komilov"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-1">Ota-ona telefoni</label>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={e => setGuardianPhone(e.target.value)}
                  placeholder="+998 90 999 88 77"
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address & Notes */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Yashash manzili
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Toshkent sh., Yunusobod 12-mavze"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Qo‘shimcha izoh
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="O‘quvchi bo‘yicha individual eslatmalar..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
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
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
            >
              {editStudent ? 'Saqlash' : 'O‘quvchini ro‘yxatdan o‘tkazish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
