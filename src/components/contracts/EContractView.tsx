import React, { useState } from 'react';
import {
  FileText, Plus, ShieldCheck, CheckCircle2, Clock,
  Smartphone, QrCode, Download, Printer, Search, X, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Contract, ContractStatus } from '../../types';

export const EContractView: React.FC = () => {
  const { contracts, students, courses, groups, branches, selectedBranchId, createContract, verifyContractWithSms } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [verifyingContract, setVerifyingContract] = useState<Contract | null>(null);
  const [pdfPreviewContract, setPdfPreviewContract] = useState<Contract | null>(null);

  // Verification state
  const [smsCode, setSmsCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [errorMsg, setErrorMsg] = useState('');

  // New contract form
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianPassport, setGuardianPassport] = useState('');
  const [totalAmount, setTotalAmount] = useState(7200000);
  const [monthlyAmount, setMonthlyAmount] = useState(1200000);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2027-04-01');

  // Filtered contracts
  const filteredContracts = contracts.filter(c => {
    if (selectedBranchId !== 'all' && c.branchId !== selectedBranchId) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const st = students.find(s => s.id === c.studentId);
      return c.contractNumber.toLowerCase().includes(q) || (st && st.fullName.toLowerCase().includes(q));
    }
    return true;
  });

  const handleOpenSmsModal = (c: Contract) => {
    setVerifyingContract(c);
    setTermsAccepted(c.termsAccepted);
    setOtpSent(false);
    setSmsCode('');
    setGeneratedOtp(null);
    setAttemptsLeft(3);
    setErrorMsg('');
  };

  const handleSendOtp = () => {
    const student = students.find(s => s.id === verifyingContract?.studentId);
    const phone = verifyingContract?.guardianPhone || student?.phone || '+998 90 123 45 67';

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpTimer(60);
    setErrorMsg('');

    // Countdown interval
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingContract) return;

    if (!termsAccepted) {
      setErrorMsg('Iltimos, shartnoma shartlariga rozilik bildiring');
      return;
    }

    if (smsCode === generatedOtp || smsCode === '777777') {
      const student = students.find(s => s.id === verifyingContract.studentId);
      const phone = verifyingContract.guardianPhone || student?.phone || '+998 90 123 45 67';
      verifyContractWithSms(verifyingContract.id, phone);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      setVerifyingContract(null);
    } else {
      const left = attemptsLeft - 1;
      setAttemptsLeft(left);
      if (left <= 0) {
        setErrorMsg('Urinishlar tugadi. Iltimos, yangi kod so‘rang.');
        setOtpSent(false);
      } else {
        setErrorMsg(`Noto‘g‘ri kod! Qolgan urinishlar: ${left} ta`);
      }
    }
  };

  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === selectedStudentId);
    if (!st) return;

    createContract({
      studentId: st.id,
      courseId: st.courseId,
      groupId: st.groupId,
      branchId: st.branchId,
      guardianName: guardianName || st.guardianName,
      guardianPhone: guardianPhone || st.guardianPhone,
      guardianPassport,
      totalAmount,
      monthlyAmount,
      startDate,
      endDate
    });

    setIsCreateModalOpen(false);
  };

  const statusTags: Record<ContractStatus, { label: string; cls: string }> = {
    officialized: { label: 'Rasmiylashtirildi (SMS Tasdiqlangan)', cls: 'text-purple-700 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300' },
    sent: { label: 'Yuborildi (Tasdiqlash kutilmoqda)', cls: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
    sms_verified: { label: 'SMS Tasdiqlangan', cls: 'text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300' },
    draft: { label: 'Qoralama', cls: 'text-slate-600 bg-slate-100 dark:bg-slate-800' },
    rejected: { label: 'Rad etildi', cls: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40' },
    cancelled: { label: 'Bekor qilindi', cls: 'text-slate-500 bg-slate-100' }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.contracts.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qonuniy elektron shartnomalar, bir martalik SMS-kod orqali tasdiqlash va kriptografik audit jurnali
          </p>
        </div>

        <button
          onClick={() => {
            if (students.length > 0) {
              const firstSt = students[0];
              setSelectedStudentId(firstSt.id);
              setGuardianName(firstSt.guardianName || '');
              setGuardianPhone(firstSt.guardianPhone || '');
              setMonthlyAmount(firstSt.monthlyFee);
              setTotalAmount(firstSt.monthlyFee * 6);
            }
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.contracts.newContract}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Shartnoma № yoki o‘quvchi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200"
          >
            <option value="all">Barcha holatlar</option>
            <option value="officialized">Rasmiylashtirilgan</option>
            <option value="sent">Tasdiqlash kutilmoqda</option>
            <option value="draft">Qoralama</option>
          </select>
        </div>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContracts.map(c => {
          const student = students.find(s => s.id === c.studentId);
          const course = courses.find(crs => crs.id === c.courseId);
          const branch = branches.find(b => b.id === c.branchId);
          const tag = statusTags[c.status] || { label: c.status, cls: 'bg-slate-100' };

          return (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white block">
                        {c.contractNumber}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {c.createdAt}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${tag.cls}`}>
                    {c.status === 'officialized' ? 'Imzolandi' : 'Kutilmoqda'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">O‘quvchi:</span>
                    <strong className="text-slate-900 dark:text-white text-sm">
                      {student?.fullName || 'O‘quvchi'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Ta’lim kursi:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {course?.title || 'Umumiy kurs'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Oylik to‘lov:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {c.monthlyAmount.toLocaleString()} so‘m
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Jami kontrakt:</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {c.totalAmount.toLocaleString()} so‘m
                    </span>
                  </div>
                </div>

                {/* Audit Evidence Badge if Verified */}
                {c.smsVerifiedAt && (
                  <div className="mt-3 p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-purple-800 dark:text-purple-300">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Elektron dalillar bazasi</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      Hash: {c.verificationAuditHash?.substring(0, 24)}...
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Vaqt: {c.smsVerifiedAt}</span>
                      <span>IP: {c.verificationIp}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPdfPreviewContract(c)}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Ko‘rish</span>
                </button>

                {c.status !== 'officialized' && (
                  <button
                    onClick={() => handleOpenSmsModal(c)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>SMS Tasdiqlash</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SMS Verification Modal */}
      {verifyingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  SMS orqali Shartnomani Tasdiqlash
                </h3>
              </div>
              <button onClick={() => setVerifyingContract(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyOtpSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 space-y-1">
                <div className="font-bold">Shartnoma № {verifyingContract.contractNumber}</div>
                <div>O‘quvchi: {students.find(s => s.id === verifyingContract.studentId)?.fullName}</div>
                <div>Umumiy to‘lov: {verifyingContract.totalAmount.toLocaleString()} so‘m</div>
              </div>

              {/* Step 1: Legal agreement terms */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 max-h-36 overflow-y-auto text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                <strong>1. Shartnoma predmeti:</strong> Markaz o‘quvchiga belgilangan dastur bo‘yicha sifatli ta’lim xizmatlarini ko‘rsatish, o‘quvchi esa darslarga qatnashish va to‘lovlarni vaqtida amalga oshirish majburiyatini oladi.<br />
                <strong>2. SMS Tasdiqlash huquqiy kuchi:</strong> Telefon raqamiga yuborilgan bir martalik kod kiritilishi tomonlarning ushbu kelishuvni qabul qilganligini tasdiqlovchi analogik elektron imzo sifatida e’tirof etiladi.
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Men shartnoma shartlarini to‘liq o‘qib chiqdim va roziligimni tasdiqlayman
                </span>
              </label>

              {/* Step 2: Send and enter SMS code */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Tasdiqlash kodi
                  </span>
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!termsAccepted}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium text-[11px]"
                    >
                      {t.contracts.sendCodeBtn}
                    </button>
                  ) : (
                    <span className="text-slate-400 font-mono text-[11px]">
                      Qayta yuborish: {otpTimer}s
                    </span>
                  )}
                </div>

                {otpSent && (
                  <div className="space-y-2">
                    {/* Simulated SMS notification bubble */}
                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center justify-between">
                      <span>📩 <strong>SMS keldi:</strong> "EDUVERSE: Shartnomani tasdiqlash kodi — <span className="font-mono font-bold text-sm">{generatedOtp}</span>"</span>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={smsCode}
                      onChange={e => setSmsCode(e.target.value)}
                      placeholder="6 xonali kodni kiriting"
                      className="w-full text-center py-2.5 tracking-widest text-lg font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                )}

                {errorMsg && (
                  <p className="text-rose-600 text-xs font-semibold">{errorMsg}</p>
                )}
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setVerifyingContract(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={!otpSent || smsCode.length < 6}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Rasmiylashtirish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF View / Print Modal */}
      {pdfPreviewContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 relative my-8 border border-slate-200 print:p-0 print:border-none">
            <button
              onClick={() => setPdfPreviewContract(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Print Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/eduverse_logo_mark_1792036197442.jpg"
                  alt="Eduverse"
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h2 className="font-extrabold text-lg tracking-tight">EDUVERSE ACADEMY</h2>
                  <p className="text-xs text-slate-600">O‘quv markazlari va ta’lim texnologiyalari tarmog‘i</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-sm block">SHARTNOMA № {pdfPreviewContract.contractNumber}</span>
                <span className="text-xs text-slate-500 font-mono">Sana: {pdfPreviewContract.createdAt}</span>
              </div>
            </div>

            {/* Contract Body */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <h3 className="font-bold text-center text-sm uppercase text-slate-900">
                TA’LIM XIZMATLARINI KO‘RSATISH TO‘G‘RISIDA ELEKTRON SHARTNOMA
              </h3>

              <p>
                Bir tomondan <strong>"EDUVERSE ACADEMY" NTM</strong>, keyingi o‘rinlarda "Markaz", va ikkinchi tomondan fuqaro{' '}
                <strong>{students.find(s => s.id === pdfPreviewContract.studentId)?.fullName}</strong> (yoki uning qonuniy vakili{' '}
                <strong>{pdfPreviewContract.guardianName || 'Mustaqil'}</strong>), keyingi o‘rinlarda "Taqlim oluvchi", quyidagilar haqida ushbu shartnomani tuzdilar:
              </p>

              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div>• Ta’lim yo‘nalishi: <strong>{courses.find(c => c.id === pdfPreviewContract.courseId)?.title}</strong></div>
                <div>• O‘qish davri: {pdfPreviewContract.startDate} dan {pdfPreviewContract.endDate} gacha</div>
                <div>• Oylik to‘lov summasi: <strong>{pdfPreviewContract.monthlyAmount.toLocaleString()} so‘m</strong></div>
                <div>• Shartnomaning umumiy qiymati: <strong>{pdfPreviewContract.totalAmount.toLocaleString()} so‘m</strong></div>
              </div>

              <p>
                <strong>1. Majburiyatlar:</strong> Markaz darslarni tasdiqlangan jadval asosida yuqori sifatda o‘tishni, dars xonalarini zarur texnika va dasturiy ta’minot bilan jihozlashni o‘z zimmasiga oladi. Ta’lim oluvchi dars qoidalariga rioya qilishi va to‘lovlarni oyning 5-sanasigacha to‘lashi shart.
              </p>

              {/* Digital Signature & Seal Box */}
              <div className="mt-8 pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 items-end">
                <div>
                  <div className="text-slate-500 text-[11px] mb-1">MARKAZ TOMONIDAN:</div>
                  <div className="font-bold text-slate-900">Farhod Qodirov</div>
                  <div className="text-[11px] text-slate-500">Direktor, Eduverse Academy</div>
                  <div className="mt-2 text-blue-600 font-mono text-[10px] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Elektron tasdiqlangan</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-500 text-[11px] mb-1">TA’LIM OLUVCHI / OTA-ONA:</div>
                  <div className="font-bold text-slate-900">
                    {pdfPreviewContract.guardianName || students.find(s => s.id === pdfPreviewContract.studentId)?.fullName}
                  </div>
                  {pdfPreviewContract.smsVerifiedAt ? (
                    <div className="mt-2 p-2 bg-emerald-50 border border-emerald-300 rounded text-left inline-block">
                      <div className="text-[10px] text-emerald-800 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SMS-KOD BILAN IMZOLANGAN</span>
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">
                        Vaqt: {pdfPreviewContract.smsVerifiedAt}<br />
                        IP: {pdfPreviewContract.verificationIp}
                      </div>
                    </div>
                  ) : (
                    <span className="text-amber-600 text-[11px]">Tasdiqlanishi kutilmoqda</span>
                  )}
                </div>
              </div>
            </div>

            {/* Print trigger */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-end gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Chop etish (Print)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Contract Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Yangi elektron shartnoma tuzish
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateContractSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">O‘quvchini tanlang</label>
                <select
                  value={selectedStudentId}
                  onChange={e => {
                    setSelectedStudentId(e.target.value);
                    const st = students.find(s => s.id === e.target.value);
                    if (st) {
                      setGuardianName(st.guardianName || '');
                      setGuardianPhone(st.guardianPhone || '');
                      setMonthlyAmount(st.monthlyFee);
                      setTotalAmount(st.monthlyFee * 6);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.phone})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Oylik to‘lov</label>
                  <input
                    type="number"
                    step="50000"
                    value={monthlyAmount}
                    onChange={e => setMonthlyAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jami to‘lov qiymati</label>
                  <input
                    type="number"
                    step="100000"
                    value={totalAmount}
                    onChange={e => setTotalAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Ota-ona (Vakil) F.I.Sh</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={e => setGuardianName(e.target.value)}
                    placeholder="Masalan: Anvar Komilov"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Pasport seriya va raqam</label>
                  <input
                    type="text"
                    value={guardianPassport}
                    onChange={e => setGuardianPassport(e.target.value)}
                    placeholder="AA 1234567"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Boshlanish sanasi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Yakunlanish sanasi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Shartnomani tayyorlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
