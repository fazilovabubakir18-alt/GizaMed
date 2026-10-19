import React from 'react';
import { X, Check, Palette, Type, Sliders, Sun, Moon, Laptop, RotateCcw } from 'lucide-react';
import { useTheme, THEME_PRESETS } from '../../context/ThemeContext';
import { ThemePreset, FontFamily, InterfaceDensity, InterfaceScale } from '../../types';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({ isOpen, onClose }) => {
  const {
    config,
    setThemePreset,
    setMode,
    setFontFamily,
    setDensity,
    setScale,
    setCustomColors
  } = useTheme();

  if (!isOpen) return null;

  const fontOptions: FontFamily[] = [
    'Plus Jakarta Sans',
    'Manrope',
    'Inter',
    'Outfit',
    'JetBrains Mono'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Dizayn va Shaxsiylashtirish
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Theme Mode */}
          <div>
            <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2.5">
              Interfeys rejimi
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mode: 'light', label: 'Yorug‘', icon: Sun },
                { mode: 'dark', label: 'Qorong‘i', icon: Moon },
                { mode: 'system', label: 'Tizim', icon: Laptop }
              ].map(m => {
                const Icon = m.icon;
                const active = config.mode === m.mode;
                return (
                  <button
                    key={m.mode}
                    onClick={() => setMode(m.mode as any)}
                    className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition-all ${
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:border-blue-500 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preset Palettes */}
          <div>
            <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2.5">
              Tayyor rang mavzulari
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEME_PRESETS) as ThemePreset[]).filter(k => k !== 'custom').map(preset => {
                const p = THEME_PRESETS[preset];
                const active = config.preset === preset;
                return (
                  <button
                    key={preset}
                    onClick={() => setThemePreset(preset)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                      active
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-slate-800'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-4 h-4 rounded-full border border-white dark:border-slate-900" style={{ backgroundColor: p.primary }} />
                      <span className="w-4 h-4 rounded-full border border-white dark:border-slate-900" style={{ backgroundColor: p.accent }} />
                    </div>
                    <span className="truncate font-medium text-slate-800 dark:text-slate-200 flex-1">
                      {p.name}
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Hex Color Pickers */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
            <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" />
              <span>Maxsus HEX ranglar</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">Asosiy rang</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={e => setCustomColors({ primary: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={e => setCustomColors({ primary: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 text-[11px] block mb-1">Aksent rang</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accentColor}
                    onChange={e => setCustomColors({ accent: e.target.value })}
                    className="w-7 h-7 rounded border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.accentColor}
                    onChange={e => setCustomColors({ accent: e.target.value })}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Font Family Selection */}
          <div>
            <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2.5">
              Tipografika va Shrift
            </label>
            <div className="space-y-1.5">
              {fontOptions.map(font => {
                const active = config.fontFamily === font;
                return (
                  <button
                    key={font}
                    onClick={() => setFontFamily(font)}
                    className={`w-full px-3 py-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                      active
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    style={{ fontFamily: font }}
                  >
                    <span className="text-sm">{font}</span>
                    {active && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Density & Text Scale */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                Zichlik
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['comfortable', 'compact'] as InterfaceDensity[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={`py-1.5 text-center rounded-lg border font-medium ${
                      config.density === d
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d === 'comfortable' ? 'Keng' : 'Ixcham'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-500 font-semibold uppercase tracking-wider block mb-2">
                Matn o‘lchami
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['small', 'normal', 'large'] as InterfaceScale[]).map(s => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`py-1.5 text-center rounded-lg border font-medium ${
                      config.scale === s
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s === 'small' ? '90%' : s === 'normal' ? '100%' : '110%'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setThemePreset('midnight')}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Standartga qaytarish</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-xs shadow-xs"
          >
            Tayyor
          </button>
        </div>
      </div>
    </div>
  );
};
