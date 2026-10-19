import React, { useState } from 'react';
import {
  Columns3, Plus, Search, Filter, Phone, Calendar,
  UserCheck, ArrowRight, MessageSquare, Tag, Check, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';
import { Lead, LeadStage, LeadSource } from '../../types';

export const CRMView: React.FC = () => {
  const {
    leads, courses, groups, branches, selectedBranchId,
    addLead, updateLeadStage, convertLeadToStudent
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [convertModalLead, setConvertModalLead] = useState<Lead | null>(null);
  const [selectedGroupIdForConvert, setSelectedGroupIdForConvert] = useState<string>('');

  // Form states for new lead
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('+998 ');
  const [newCourseId, setNewCourseId] = useState('');
  const [newBranchId, setNewBranchId] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('telegram');
  const [newNotes, setNewNotes] = useState('');

  // 11 stages definition from Section 8 of TZ
  const stages: { stage: LeadStage; label: string; color: string }[] = [
    { stage: 'yangi', label: '1. Yangi lid', color: 'border-blue-500' },
    { stage: 'boglanish_kutilmoqda', label: '2. Bog‘lanish kutilmoqda', color: 'border-sky-500' },
    { stage: 'boglanildi', label: '3. Bog‘lanildi', color: 'border-indigo-500' },
    { stage: 'sinov_darsiga_yozildi', label: '4. Sinov darsiga yozildi', color: 'border-cyan-500' },
    { stage: 'sinov_qatnashdi', label: '5. Sinovda qatnashdi', color: 'border-teal-500' },
    { stage: 'qaror_qabul_qilmoqda', label: '6. Qaror qilmoqda', color: 'border-amber-500' },
    { stage: 'shartnoma_yuborildi', label: '7. Shartnoma yuborildi', color: 'border-orange-500' },
    { stage: 'shartnoma_tasdiqlandi', label: '8. Shartnoma tasdiqlandi', color: 'border-purple-500' },
    { stage: 'tolov_amalga_oshirildi', label: '9. To‘lov qilindi', color: 'border-lime-500' },
    { stage: 'faol_oquvchi', label: '10. Faol o‘quvchiga aylandi', color: 'border-emerald-500' },
    { stage: 'yoqotilgan', label: '11. Yo‘qotilgan', color: 'border-rose-500' }
  ];

  // Filter leads
  const filteredLeads = leads.filter(l => {
    if (selectedBranchId !== 'all' && l.branchId !== selectedBranchId) return false;
    if (selectedSource !== 'all' && l.source !== selectedSource) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return l.fullName.toLowerCase().includes(q) || l.phone.includes(q);
    }
    return true;
  });

  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    const crs = courses.find(c => c.id === newCourseId) || courses[0];
    addLead({
      fullName: newFullName,
      phone: newPhone,
      courseId: crs?.id || 'crs-1',
      branchId: newBranchId || branches[0]?.id || 'br-1',
      source: newSource,
      stage: 'yangi',
      assignedManager: 'Sotuv bo‘limi',
      notes: newNotes,
      estimatedValue: crs?.pricePerMonth || 1000000
    });

    setIsAddLeadModalOpen(false);
    setNewFullName('');
    setNewPhone('+998 ');
    setNewNotes('');
  };

  const handleConvertConfirm = () => {
    if (!convertModalLead || !selectedGroupIdForConvert) return;
    convertLeadToStudent(convertModalLead.id, selectedGroupIdForConvert);
    setConvertModalLead(null);
  };

  const sourceLabels: Record<LeadSource, string> = {
    telegram: 'Telegram',
    instagram: 'Instagram',
    website: 'Veb-sayt',
    call: 'Qo‘ng‘iroq',
    walk_in: 'Ofis tashrif',
    referral: 'Tavsiya',
    ads: 'Target reklama'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.crm.pipelineTitle}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Barcha murojaatlar, sinov darslari va o‘quvchiga aylantirish voronkasi ({filteredLeads.length} ta lid)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setNewBranchId(branches[0]?.id || 'br-1');
              setNewCourseId(courses[0]?.id || 'crs-1');
              setIsAddLeadModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi lid qo‘shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Funnel Metrics Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Lid ismi yoki telefoni..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          <select
            value={selectedSource}
            onChange={e => setSelectedSource(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200"
          >
            <option value="all">Barcha manbalar</option>
            <option value="telegram">Telegram</option>
            <option value="instagram">Instagram</option>
            <option value="website">Veb-sayt</option>
            <option value="call">Qo‘ng‘iroq</option>
            <option value="walk_in">Ofis tashrifi</option>
            <option value="referral">Tavsiya</option>
          </select>
        </div>

        {/* Funnel conversion summary */}
        <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
          <span>Yangi murojaatlar: <strong className="text-slate-900 dark:text-white font-mono">{leads.filter(l => l.stage === 'yangi').length}</strong></span>
          <span>Shartnoma bosqichida: <strong className="text-slate-900 dark:text-white font-mono">{leads.filter(l => l.stage.includes('shartnoma')).length}</strong></span>
          <span>Faol o‘quvchi bo‘lganlar: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{leads.filter(l => l.stage === 'faol_oquvchi').length}</strong></span>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Board (11 stages) */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 select-none">
        {stages.map(col => {
          const columnLeads = filteredLeads.filter(l => l.stage === col.stage);
          return (
            <div
              key={col.stage}
              className="w-72 shrink-0 bg-slate-50/80 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col max-h-[700px]"
            >
              {/* Column Header */}
              <div className={`p-3 border-t-2 ${col.color} border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 rounded-t-xl`}>
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                  {col.label}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {columnLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {columnLeads.length === 0 ? (
                  <div className="py-8 text-center text-[11px] text-slate-400">
                    Lidlar yo‘q
                  </div>
                ) : (
                  columnLeads.map(lead => {
                    const crs = courses.find(c => c.id === lead.courseId);
                    return (
                      <div
                        key={lead.id}
                        className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                            {lead.fullName}
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-medium">
                            {sourceLabels[lead.source]}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {crs?.title || 'Umumiy kurs'}
                        </div>

                        {lead.notes && (
                          <p className="text-[10px] text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-800/40 p-1.5 rounded">
                            {lead.notes}
                          </p>
                        )}

                        {/* Stage Selector & Convert Action */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <select
                            value={lead.stage}
                            onChange={e => updateLeadStage(lead.id, e.target.value as LeadStage)}
                            className="text-[10px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 max-w-[120px]"
                          >
                            {stages.map(s => (
                              <option key={s.stage} value={s.stage}>{s.label}</option>
                            ))}
                          </select>

                          {lead.stage !== 'faol_oquvchi' && (
                            <button
                              onClick={() => {
                                setConvertModalLead(lead);
                                setSelectedGroupIdForConvert(groups[0]?.id || 'grp-1');
                              }}
                              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                              title="To‘g‘ridan-to‘g‘ri o‘quvchiga aylantirish"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>O‘quvchiga</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Yangi CRM murojaat (Lid) kiritish
              </h3>
              <button onClick={() => setIsAddLeadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Murojaatchi F.I.Sh *</label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="Masalan: Dilshod Rahimov"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Telefon raqami *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Qiziqqan kursi</label>
                  <select
                    value={newCourseId}
                    onChange={e => setNewCourseId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Qayerdan keldi (Manba)</label>
                  <select
                    value={newSource}
                    onChange={e => setNewSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="instagram">Instagram</option>
                    <option value="website">Veb-sayt</option>
                    <option value="call">Telefon qo‘ng‘iroq</option>
                    <option value="walk_in">Ofisga tashrif</option>
                    <option value="referral">Tavsiya</option>
                    <option value="ads">Target reklama</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Filial</label>
                <select
                  value={newBranchId}
                  onChange={e => setNewBranchId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Eslatma / Izoh</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Mijoz nimalarga qiziqdi, qachon qayta bog‘lanish kerak..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Lidni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Convert Lead to Student Modal */}
      {convertModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Lidni faol o‘quvchiga aylantirish
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                <strong>{convertModalLead.fullName}</strong> ma’lumotlari qayta kiritilmasdan avtomatik yangi o‘quvchi profiliga ko‘chiriladi.
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Qaysi guruhga biriktirilsin?
                </label>
                <select
                  value={selectedGroupIdForConvert}
                  onChange={e => setSelectedGroupIdForConvert(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium"
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.daysOfWeek.join(', ')} · {g.startTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                ✓ Telefon raqami: {convertModalLead.phone}<br />
                ✓ Manba: {sourceLabels[convertModalLead.source]}<br />
                ✓ Kurs: {courses.find(c => c.id === convertModalLead.courseId)?.title}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => setConvertModalLead(null)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleConvertConfirm}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>O‘quvchiga aylantirish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
