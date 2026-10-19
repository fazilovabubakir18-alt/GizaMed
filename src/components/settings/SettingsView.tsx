import React, { useState } from 'react';
import {
  Settings, Shield, Database, Download, Upload, RotateCcw,
  Palette, Globe, Lock, CheckCircle2, AlertTriangle, FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/translations';
import { ThemePreset, FontFamily, LanguageCode, UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    auditLogs, exportDatabaseJson, restoreDatabaseJson, resetToDefault
  } = useApp();
  const {
    config, language, setLanguage, setThemePreset, setMode,
    setFontFamily, setDensity, setScale, setCustomColors
  } = useTheme();
  const { currentRole, setCurrentRole } = useAuth();
  const t = useTranslation(language);

  const [activeTab, setActiveTab] = useState<'theme' | 'roles' | 'audit' | 'backup'>('theme');
  const [restoreJson, setRestoreJson] = useState('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const json = exportDatabaseJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduverse_backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setBackupStatus('Ma’lumotlar bazasi nusxasi muvaffaqiyatli yuklab olindi!');
  };

  const handleRestoreSubmit = () => {
    if (!restoreJson.trim()) return;
    const ok = restoreDatabaseJson(restoreJson);
    if (ok) {
      setBackupStatus('Baza muvaffaqiyatli tiklandi!');
      setRestoreJson('');
    } else {
      setBackupStatus('Xatolik: JSON formati noto‘g‘ri!');
    }
  };

  const rolesList: { role: UserRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Markaz egasi / Super Admin', desc: 'Barcha modullar, to‘lovlar, sozlamalar va auditga to‘liq cheklanmagan kirish' },
    { role: 'branch_manager', label: 'Filial rahbari', desc: 'O‘z filialiga tegishli guruhlar, o‘quvchilar, kassa va hisobotlarni boshqarish' },
    { role: 'admin', label: 'Administrator', desc: 'O‘quvchilar qabuli, dars jadvali, shartnomalar va davomatni nazorat qilish' },
    { role: 'crm_manager', label: 'Menejer (Sotuv)', desc: 'Lidlar, qo‘ng‘iroqlar, sinov darslari va shartnomalar yuborish' },
    { role: 'cashier', label: 'Kassir', desc: 'To‘lovlarni qabul qilish, kassa smenasini ochish va yopish, kvitansiyalar' },
    { role: 'teacher', label: 'O‘qituvchi', desc: 'Biriktirilgan guruhlar, davomat qayd etish va uy vazifalarini baholash' },
    { role: 'student_parent', label: 'Talaba / Ota-ona', desc: 'Shaxsiy jadval, davomat tarixi, elektron shartnomani imzolash va to‘lovlar' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.settings.title}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Dizayn mavzulari, rollar va ruxsatlar, audit jurnali va zaxira nusxalash
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('theme')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'theme' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Dizayn & Tipografika
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'roles' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rollar & Ruxsatlar (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'audit' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Audit Jurnali ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          className={`py-3 border-b-2 transition-colors ${
            activeTab === 'backup' ? 'border-blue-600 text-blue-600 font-semibold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Zaxira Nusxa & Tiklash
        </button>
      </div>

      {/* Tab 1: Theme & Typography */}
      {activeTab === 'theme' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6 text-xs">
          {/* Preset Colors */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Tayyor rang mavzulari
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).filter(k => k !== 'custom').map(preset => {
                const p = THEME_PRESETS[preset];
                const active = config.preset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => setThemePreset(preset)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      active
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border border-white dark:border-slate-900" style={{ backgroundColor: p.primary }} />
                      <span className="font-medium text-slate-900 dark:text-white">{p.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font selection */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
              Interfeys shrifti
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['Plus Jakarta Sans', 'Manrope', 'Inter', 'Outfit', 'JetBrains Mono'].map(f => (
                <button
                  key={f}
                  onClick={() => setFontFamily(f as FontFamily)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    config.fontFamily === f
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  style={{ fontFamily: f }}
                >
                  <span className="text-sm block">{f}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interface mode & density */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                Yorug‘lik rejimi
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { m: 'light', label: 'Yorug‘' },
                  { m: 'dark', label: 'Qorong‘i' },
                  { m: 'system', label: 'Tizim' }
                ].map(item => (
                  <button
                    key={item.m}
                    onClick={() => setMode(item.m as any)}
                    className={`py-2 text-center rounded-lg border font-medium ${
                      config.mode === item.m
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
                Interfeys zichligi
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { d: 'comfortable', label: 'Standart (Keng)' },
                  { d: 'compact', label: 'Ixcham (Compact)' }
                ].map(item => (
                  <button
                    key={item.d}
                    onClick={() => setDensity(item.d as any)}
                    className={`py-2 text-center rounded-lg border font-medium ${
                      config.density === item.d
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Roles */}
      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4 text-xs">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-900 dark:text-blue-200 text-xs leading-relaxed">
            Har bir rol o‘ziga tegishli bo‘limlar va huquqlar bilan cheklanadi. Test rejimida istalgan rolni faollashtirib ko‘rishingiz mumkin.
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {rolesList.map(r => (
              <div key={r.role} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{r.label}</span>
                    {currentRole === r.role && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-semibold">
                        Faol rol
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{r.desc}</p>
                </div>
                <button
                  onClick={() => setCurrentRole(r.role)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    currentRole === r.role
                      ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {currentRole === r.role ? 'Tanlangan' : 'O‘tish'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Live Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Vaqt</th>
                  <th className="py-3 px-4">Foydalanuvchi</th>
                  <th className="py-3 px-4">Amal</th>
                  <th className="py-3 px-4">Obyekt</th>
                  <th className="py-3 px-4">Tafsilotlar</th>
                  <th className="py-3 px-4">IP manzil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-sans font-medium">{log.userName}</td>
                    <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold font-sans">{log.action}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{log.entityType}</td>
                    <td className="py-3 px-4 text-slate-500 font-sans">{log.details}</td>
                    <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Backup & Recovery */}
      {activeTab === 'backup' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-6 text-xs">
          {backupStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded-xl text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{backupStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Backup */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-blue-600" />
                <span>To‘liq zaxira nusxasini yuklab olish</span>
              </h3>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Barcha o‘quvchilar, guruhlar, to‘lovlar, shartnomalar va CRM lidlarini o‘z ichiga olgan JSON zaxira faylini saqlab oling.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON nusxani yuklab olish</span>
              </button>
            </div>

            {/* Reset to Default */}
            <div className="p-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
              <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Standart holatga qaytarish</span>
              </h3>
              <p className="text-slate-500 leading-relaxed text-[11px]">
                Barcha kiritilgan o‘zgarishlarni tozalab, tizimni dastlabki namunaviy o‘quv markazi ma’lumotlariga qaytaradi.
              </p>
              <button
                onClick={() => {
                  if (confirm('Barcha ma’lumotlarni standart holatga qaytarishni tasdiqlaysizmi?')) {
                    resetToDefault();
                    setBackupStatus('Tizim dastlabki holatga qaytarildi!');
                  }
                }}
                className="px-4 py-2 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-300 rounded-lg font-semibold hover:bg-rose-100/50"
              >
                Standartga qaytarish (Reset)
              </button>
            </div>
          </div>

          {/* Restore JSON input */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Zaxira nusxadan tiklash (Restore)</span>
            </h3>
            <textarea
              rows={4}
              value={restoreJson}
              onChange={e => setRestoreJson(e.target.value)}
              placeholder="Ilgari yuklab olingan JSON fayl matnini bu yerga joylashtiring..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[11px]"
            />
            <button
              onClick={handleRestoreSubmit}
              disabled={!restoreJson.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-semibold shadow-xs"
            >
              Bazani tiklash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
