import React, { useState, useEffect } from 'react';
import {
  X, User, Phone, Mail, Building2, BookOpen,
  DollarSign, Briefcase, Award, CheckCircle2, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StaffMember, Group } from '../../types';
import { useApp } from '../../context/AppContext';

interface AddTeacherModalProps {
  isOpen: boolean;
  teacherToEdit?: StaffMember | null;
  onClose: () => void;
}

const COMMON_SPECIALTIES = [
  'Frontend Web Dasturlash (React / Next.js / TypeScript)',
  'Backend Dasturlash (Python / Django / FastAPI)',
  'IELTS Intensive 7.5+ & Academic Writing',
  'General English (CEFR B1 - C1)',
  'Grafik Dizayn & UI/UX (Figma, Adobe)',
  'Mental Arifmetika & Tez O‘qish',
  'Olimpiada Matematikasi & Mantiq',
  'Mobil Dasturlash (Flutter & Dart)',
  'Rus tili (So‘zlashuv va Grammatika)',
  'Data Science & Sun’iy Intellekt'
];

export const AddTeacherModal: React.FC<AddTeacherModalProps> = ({
  isOpen,
  teacherToEdit,
  onClose
}) => {
  const { branches, groups, addTeacher, updateTeacher } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [specialty, setSpecialty] = useState(COMMON_SPECIALTIES[0]);
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [salaryType, setSalaryType] = useState<StaffMember['salaryType']>('revenue_percent');
  const [salaryRate, setSalaryRate] = useState<number>(40);
  const [status, setStatus] = useState<StaffMember['status']>('active');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (teacherToEdit) {
      setFullName(teacherToEdit.fullName);
      setPhone(teacherToEdit.phone);
      setEmail(teacherToEdit.email);
      setBranchId(teacherToEdit.branchId);
      if (COMMON_SPECIALTIES.includes(teacherToEdit.specialty || '')) {
        setSpecialty(teacherToEdit.specialty || COMMON_SPECIALTIES[0]);
        setCustomSpecialty('');
      } else {
        setSpecialty('custom');
        setCustomSpecialty(teacherToEdit.specialty || '');
      }
      setExperienceYears(teacherToEdit.experienceYears || 3);
      setSalaryType(teacherToEdit.salaryType);
      setSalaryRate(teacherToEdit.salaryRate);
      setStatus(teacherToEdit.status);
      setSelectedGroupIds(teacherToEdit.assignedGroupIds || []);
      setBio(teacherToEdit.bio || '');
    } else {
      setFullName('');
      setPhone('+998 ');
      setEmail('');
      setBranchId(branches[0]?.id || '');
      setSpecialty(COMMON_SPECIALTIES[0]);
      setCustomSpecialty('');
      setExperienceYears(3);
      setSalaryType('revenue_percent');
      setSalaryRate(40);
      setStatus('active');
      setSelectedGroupIds([]);
      setBio('');
    }
    setError(null);
  }, [teacherToEdit, isOpen, branches]);

  if (!isOpen) return null;

  // Filter groups in chosen branch
  const branchGroups = groups.filter(g => branchId === 'all' || g.branchId === branchId);

  const handleToggleGroup = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Iltimos, o‘qituvchining to‘liq familiya va ismini kiriting!');
      return;
    }
    if (!phone || phone.length < 9) {
      setError('Iltimos, to‘g‘ri telefon raqamini kiriting!');
      return;
    }

    const finalSpecialty = specialty === 'custom' ? customSpecialty.trim() : specialty;
    if (!finalSpecialty) {
      setError('Iltimos, o‘qituvchi mutaxassisligini (fanni) belgilang!');
      return;
    }

    const teacherData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@eduverse.uz`,
      branchId,
      specialty: finalSpecialty,
      experienceYears: Number(experienceYears) || 1,
      salaryType,
      salaryRate: Number(salaryRate) || 0,
      status,
      assignedGroupIds: selectedGroupIds,
      bio: bio.trim(),
      rating: teacherToEdit?.rating || 4.9,
      avatarUrl: teacherToEdit?.avatarUrl || '/src/assets/images/avatar_teacher_1792036219476.jpg'
    };

    if (teacherToEdit) {
      updateTeacher(teacherToEdit.id, teacherData);
    } else {
      addTeacher(teacherData);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {teacherToEdit ? 'O‘qituvchi ma’lumotlarini tahrirlash' : 'Yangi o‘qituvchi qo‘shish'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              O‘qituvchi shaxsiy ma’lumotlari, mutaxassisligi va oylik hisob-kitob modeli
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Full name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                F.I.Sh (Familiya, Ism) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardorbek Alimov"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefon raqami *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="+998 (90) 123-45-67"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Branch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email manzili
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="ustoz@eduverse.uz"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Filial *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select
                  value={branchId}
                  onChange={e => setBranchId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  {branches.map(br => (
                    <option key={br.id} value={br.id}>
                      {br.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 3: Specialty / Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Fan / Mutaxassislik *
              </label>
              <div className="relative">
                <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  {COMMON_SPECIALTIES.map(spec => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                  <option value="custom">Boshqa mutaxassislik (qo‘lda kiritish)</option>
                </select>
              </div>
            </div>

            {specialty === 'custom' ? (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Boshqa mutaxassislik nomi *
                </label>
                <input
                  type="text"
                  placeholder="Masalan: Arab tili & Tajvid"
                  value={customSpecialty}
                  onChange={e => setCustomSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ish tajribasi (yil)
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={experienceYears}
                    onChange={e => setExperienceYears(parseInt(e.target.value) || 1)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Salary Model & Rate */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Oylik maosh / Hisob-kitob modeli
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  To‘lov turi
                </label>
                <select
                  value={salaryType}
                  onChange={e => {
                    const newType = e.target.value as StaffMember['salaryType'];
                    setSalaryType(newType);
                    if (newType === 'revenue_percent') setSalaryRate(40);
                    else if (newType === 'per_student') setSalaryRate(350000);
                    else if (newType === 'fixed') setSalaryRate(8000000);
                    else if (newType === 'hourly') setSalaryRate(120000);
                  }}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="revenue_percent">Foiz stavka (% kurs tushumidan)</option>
                  <option value="per_student">O‘quvchi boshiga (har bir o‘quvchidan)</option>
                  <option value="fixed">Fiksirlangan oylik maosh</option>
                  <option value="hourly">Soatbay (har bir akademik soat uchun)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  {salaryType === 'revenue_percent' && 'Foiz miqdori (%)'}
                  {salaryType === 'per_student' && 'Har bir o‘quvchi uchun (so‘m)'}
                  {salaryType === 'fixed' && 'Oylik fiksirlangan summa (so‘m)'}
                  {salaryType === 'hourly' && 'Soatbay stavka (so‘m)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step={salaryType === 'revenue_percent' ? '1' : '10000'}
                    value={salaryRate}
                    onChange={e => setSalaryRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-900 dark:text-white"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 font-medium">
                    {salaryType === 'revenue_percent' ? '%' : 'so‘m'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 5: Status & Groups assignment */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Holat
            </label>
            <div className="flex gap-4">
              {[
                { val: 'active', label: 'Faol dars bermoqda' },
                { val: 'on_leave', label: 'Ta’tilda / Vaqtincha to‘xtatgan' },
                { val: 'inactive', label: 'Nofaol' }
              ].map(st => (
                <label
                  key={st.val}
                  className={`flex-1 flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    status === st.val
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="teacherStatus"
                    value={st.val}
                    checked={status === st.val}
                    onChange={() => setStatus(st.val as StaffMember['status'])}
                    className="sr-only"
                  />
                  <span className="text-xs">{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Assign Groups */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Guruhlarni biriktirish ({selectedGroupIds.length} ta tanlandi)
            </label>
            {branchGroups.length === 0 ? (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                Ushbu filialda hali guruhlar ochilmagan. Keyinroq guruh yaratishda ushbu o‘qituvchini tanlashingiz mumkin.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
                {branchGroups.map(grp => {
                  const isChecked = selectedGroupIds.includes(grp.id);
                  return (
                    <button
                      type="button"
                      key={grp.id}
                      onClick={() => handleToggleGroup(grp.id)}
                      className={`text-left p-2 rounded-lg border text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-semibold truncate">{grp.name}</div>
                        <div className="text-[10px] text-slate-500">{grp.daysOfWeek.join(', ')} • {grp.startTime}</div>
                      </div>
                      {isChecked && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bio / Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              O‘qituvchi haqida qisqacha ma’lumot (Bio)
            </label>
            <textarea
              rows={2}
              placeholder="Masalan: IELTS 8.5 sohibi, Cambridge sertifikati egasi, 5 yillik tajribali mentor..."
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{teacherToEdit ? 'Saqlash' : 'O‘qituvchini qo‘shish'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
