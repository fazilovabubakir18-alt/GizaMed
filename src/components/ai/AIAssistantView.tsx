import React, { useState } from 'react';
import {
  Bot, Sparkles, Send, TrendingUp, AlertTriangle,
  Users, CheckCircle2, DollarSign, BrainCircuit, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../i18n/translations';

export const AIAssistantView: React.FC = () => {
  const {
    students, leads, contracts, payments, expenses, groups, branches
  } = useApp();
  const { language } = useTheme();
  const t = useTranslation(language);

  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  // Pre-aggregated context metrics for AI
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalDebt = students.filter(s => s.balance < 0).reduce((sum, s) => sum + Math.abs(s.balance), 0);
  const activeStudents = students.filter(s => s.status === 'active').length;
  const avgAttendance = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length)
    : 92;

  const quickPrompts = [
    { title: t.ai.promptRevenue, icon: DollarSign, query: 'Markazning oxirgi oydagi tushumi, xarajatlari va qarzdorlik holatini tahlil qilib, daromadni oshirish bo‘yicha 3 ta amaliy tavsiya bering.' },
    { title: t.ai.promptAttendance, icon: Users, query: 'Dars qoldirish xavfi yuqori bo‘lgan o‘quvchilar va ularning sabablari bo‘yicha pedagogik va ma’muriy tahlil tayyorlang.' },
    { title: t.ai.promptGroups, icon: TrendingUp, query: 'Guruhlar to‘ldirilishi (fill rate) va xonalar bandligini baholang. Qaysi yo‘nalishda yangi guruh ochish kerak?' },
    { title: t.ai.promptMarketing, icon: Sparkles, query: 'CRM lidlari konversiyasi va reklama kanallari (Instagram, Telegram, Referral) samaradorligini tahlil qiling.' }
  ];

  const handleRunAnalysis = async (queryText: string) => {
    setIsLoading(true);
    setResponse(null);

    const contextData = {
      totalStudents: students.length,
      activeStudents,
      totalLeads: leads.length,
      newLeads: leads.filter(l => l.stage === 'yangi').length,
      totalContracts: contracts.length,
      signedContracts: contracts.filter(c => c.status === 'officialized').length,
      totalRevenue,
      totalExpenses,
      totalDebt,
      avgAttendance,
      branchesCount: branches.length,
      groupsCount: groups.length
    };

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          contextData,
          language
        })
      });

      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
        setProvider(data.provider || 'gemini-3.8-flash');
      } else {
        setResponse('Tahlil yakunlandi.');
      }
    } catch (err: any) {
      setResponse(`Xatolik yuz berdi: ${err.message || 'Server javob bermadi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.ai.title}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" />
              <span>Gemini 3.8 Flash</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t.ai.subtitle}
          </p>
        </div>
      </div>

      {/* Quick Analysis Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickPrompts.map(qp => {
          const Icon = qp.icon;
          return (
            <button
              key={qp.title}
              onClick={() => {
                setPrompt(qp.query);
                handleRunAnalysis(qp.query);
              }}
              className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs text-left hover:border-blue-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all group flex flex-col justify-between h-32"
            >
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 w-fit group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {qp.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                  1 bosishda hisobot
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inquiry Input Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
          Maxsus savol yoki tahlil buyurtmasi
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleRunAnalysis(prompt); }}
            placeholder={t.ai.placeholder}
            className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => handleRunAnalysis(prompt)}
            disabled={isLoading || !prompt.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Tahlil qilinmoqda...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.ai.runAnalysis}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Response Display Card */}
      {response && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-slate-900 dark:text-white">
                EDUVERSE AI Boshqaruv Xulosasi
              </span>
            </div>
            {provider && (
              <span className="text-[10px] text-slate-400 font-mono">
                Model: {provider}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
