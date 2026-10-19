import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeConfig, ThemePreset, FontFamily, InterfaceDensity, InterfaceScale, LanguageCode } from '../types';

export const THEME_PRESETS: Record<ThemePreset, { primary: string; accent: string; sidebar: string; bg: string; name: string }> = {
  midnight: {
    primary: '#1e3a8a', // Deep Blue
    accent: '#38bdf8',  // Sky Cyan
    sidebar: '#0f172a', // Slate 900
    bg: '#f8fafc',
    name: 'Midnight Blue'
  },
  ocean: {
    primary: '#0369a1', // Ocean Blue
    accent: '#06b6d4',  // Cyan
    sidebar: '#082f49', // Deep Cyan
    bg: '#f0f9ff',
    name: 'Ocean Teal'
  },
  aurora: {
    primary: '#047857', // Emerald
    accent: '#10b981',  // Mint
    sidebar: '#064e3b', // Deep Forest
    bg: '#f0fdf4',
    name: 'Aurora Emerald'
  },
  violet: {
    primary: '#6d28d9', // Deep Violet
    accent: '#8b5cf6',  // Purple
    sidebar: '#2e1065', // Dark Violet
    bg: '#faf5ff',
    name: 'Violet Royal'
  },
  graphite: {
    primary: '#18181b', // Pure Charcoal
    accent: '#52525b',  // Zinc
    sidebar: '#09090b', // Deep Black
    bg: '#fafafa',
    name: 'Graphite Dark'
  },
  minimal_white: {
    primary: '#334155', // Slate Slate
    accent: '#64748b',  // Light Slate
    sidebar: '#1e293b', // Crisp Slate
    bg: '#ffffff',
    name: 'Minimal White'
  },
  dark_premium: {
    primary: '#3b82f6', // Bright Sapphire
    accent: '#60a5fa',  // Soft Blue
    sidebar: '#090d16', // Pitch Black
    bg: '#0f172a',      // Dark Slate Canvas
    name: 'Dark Premium'
  },
  custom: {
    primary: '#1d4ed8',
    accent: '#0284c7',
    sidebar: '#0f172a',
    bg: '#f8fafc',
    name: 'Maxsus (Custom)'
  }
};

interface ThemeContextType {
  config: ThemeConfig;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  setThemePreset: (preset: ThemePreset) => void;
  setMode: (mode: 'light' | 'dark' | 'system') => void;
  setFontFamily: (font: FontFamily) => void;
  setDensity: (density: InterfaceDensity) => void;
  setScale: (scale: InterfaceScale) => void;
  setCustomColors: (colors: { primary?: string; accent?: string; sidebar?: string }) => void;
}

const DEFAULT_CONFIG: ThemeConfig = {
  preset: 'midnight',
  mode: 'light',
  primaryColor: THEME_PRESETS.midnight.primary,
  accentColor: THEME_PRESETS.midnight.accent,
  sidebarColor: THEME_PRESETS.midnight.sidebar,
  fontFamily: 'Plus Jakarta Sans',
  density: 'comfortable',
  scale: 'normal'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('eduverse_lang') as LanguageCode) || 'uz_latin';
  });

  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem('eduverse_theme');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('eduverse_lang', lang);
  };

  const setThemePreset = (preset: ThemePreset) => {
    const presetData = THEME_PRESETS[preset];
    const isDarkPreset = preset === 'dark_premium';
    const updated: ThemeConfig = {
      ...config,
      preset,
      primaryColor: presetData.primary,
      accentColor: presetData.accent,
      sidebarColor: presetData.sidebar,
      mode: isDarkPreset ? 'dark' : config.mode
    };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  const setMode = (mode: 'light' | 'dark' | 'system') => {
    const updated: ThemeConfig = { ...config, mode };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  const setFontFamily = (fontFamily: FontFamily) => {
    const updated: ThemeConfig = { ...config, fontFamily };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  const setDensity = (density: InterfaceDensity) => {
    const updated: ThemeConfig = { ...config, density };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  const setScale = (scale: InterfaceScale) => {
    const updated: ThemeConfig = { ...config, scale };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  const setCustomColors = (colors: { primary?: string; accent?: string; sidebar?: string }) => {
    const updated: ThemeConfig = {
      ...config,
      preset: 'custom',
      primaryColor: colors.primary || config.primaryColor,
      accentColor: colors.accent || config.accentColor,
      sidebarColor: colors.sidebar || config.sidebarColor
    };
    setConfig(updated);
    localStorage.setItem('eduverse_theme', JSON.stringify(updated));
  };

  // Apply root variables dynamically
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.primaryColor);
    root.style.setProperty('--color-accent', config.accentColor);
    root.style.setProperty('--color-sidebar', config.sidebarColor);
    root.style.fontFamily = `"${config.fontFamily}", system-ui, sans-serif`;

    if (config.mode === 'dark' || (config.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (config.scale === 'small') {
      root.style.fontSize = '14px';
    } else if (config.scale === 'large') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '15px';
    }
  }, [config]);

  return (
    <ThemeContext.Provider value={{
      config,
      language,
      setLanguage,
      setThemePreset,
      setMode,
      setFontFamily,
      setDensity,
      setScale,
      setCustomColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
