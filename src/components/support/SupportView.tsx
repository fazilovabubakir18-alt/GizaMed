import React, { useState } from 'react';
import {
  HelpCircle, MessageSquare, Video, FileText, Send,
  ExternalLink, CheckCircle2, Clock, Plus, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';

export const SupportView: React.FC = () => {
  const { supportTickets, createSupportTicket } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  const faqs = [
    {
      q: 'Elektron shartnomani SMS orqali qanday tasdiqlash mumkin?',
      a: 'Shartnomalar bo‘limida shartnomani tanlang va "SMS Tasdiqlash" tugmasini bosing. O‘quvchi yoki ota-ona telefoniga 6 xonali kod boradi, uni kiritish bilan shartnoma qonuniy kuchga kiradi va QR-kodli elektron muhr qo‘yiladi.'
    },
    {
      q: 'Payme va Click orqali to‘lov qilinganda balans avtomatik yangilanadimi?',
      a: 'Ha, tizim integratsiyalangan to‘lov kvitansiyasini yaratadi va o‘quvchining shaxsiy hisobidagi qarzdorlikni avtomatik ravishda kamaytiradi.'
    },
    {
      q: 'Dars jadvalidagi to‘qnashuvlar qanday aniqlanadi?',
      a: 'Tizimning to‘qnashuv algoritmi bir auditoriya yoki o‘qituvchiga bir vaqtda ikkita dars qo‘yilishini tekshiradi va qizil ogohlantirish banneri orqali xabar beradi.'
    },
    {
      q: 'CRM voronkasidan lidni o‘quvchiga aylantirish qanday ishlaydi?',
      a: 'Kanban kartasidagi "O‘quvchiga" tugmasini bosing va guruhni tanlang. Ism, telefon va qiziqqan kursi avtomatik ravishda o‘quvchilar bazasiga ko‘chiriladi.'
    }
  ];

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    createSupportTicket({
      subject,
      description: desc,
      priority,
      submittedBy: 'Administrator'
    });

    setIsTicketModalOpen(false);
    setSubject('');
    setDesc('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.nav.support}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qo‘llanmalar, video darslar, tez-tez beriladigan savollar va texnik murojaatlar
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="https://t.me/eduverse_support"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <Send className="w-3.5 h-3.5 text-blue-500" />
            <span>Telegram Support</span>
          </a>
          <button
            onClick={() => setIsTicketModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yangi murojaat yo‘llash</span>
          </button>
        </div>
      </div>

      {/* Video & Guides Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'EDUVERSE CRM orqali sotuvni boshqarish', duration: '8 daqiqa', views: '1.2k ko‘rish' },
          { title: 'SMS orqali elektron shartnomalar tuzish', duration: '5 daqiqa', views: '950 ko‘rish' },
          { title: 'Kassa smenasi va o‘qituvchilar maoshi hisobi', duration: '6 daqiqa', views: '840 ko‘rish' }
        ].map((video, idx) => (
          <div
            key={idx}
            className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2 hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Video className="w-4 h-4" />
              <span className="text-[11px] font-semibold">Video yo‘riqnoma</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
              {video.title}
            </h4>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>{video.duration}</span>
              <span>{video.views}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <span>Sizning murojaatlaringiz (Tickets)</span>
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {supportTickets.map(tkt => (
            <div key={tkt.id} className="py-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-600">{tkt.ticketNumber}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{tkt.subject}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  tkt.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}>
                  {tkt.status === 'resolved' ? 'Hal qilindi' : 'Ko‘rib chiqilmoqda'}
                </span>
              </div>
              <p className="text-slate-500">{tkt.description}</p>
              {tkt.replyMessage && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-slate-700 dark:text-slate-300 text-[11px]">
                  <strong>Texnik qo‘llab-quvvatlash javobi:</strong> {tkt.replyMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          <span>Tez-tez beriladigan savollar (FAQ)</span>
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {faq.q}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Texnik yordamga murojaat yuborish
              </h3>
              <button onClick={() => setIsTicketModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mavzu *</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Muammo yoki savolning qisqa mazmuni"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Muhimlik darajasi</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                >
                  <option value="normal">Oddiy (Normal)</option>
                  <option value="high">Yuqori (High)</option>
                  <option value="urgent">Kritik (Urgent)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Batafsil tushuntirish</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  placeholder="Xatolik qayerda sodir bo‘ldi, nimani bajarmoqchi edingiz..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Murojaatni yo‘llash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
