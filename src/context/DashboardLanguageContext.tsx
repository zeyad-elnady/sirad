'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardTranslations, type DashboardLocale, type TranslationKey } from '@/lib/dashboard-translations';

interface DashboardLanguageContextType {
  locale: DashboardLocale;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  setLocale: (locale: DashboardLocale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
  formatCurrency: (amount: number) => string;
}

const DashboardLanguageContext = createContext<DashboardLanguageContextType | undefined>(undefined);

export function DashboardLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<DashboardLocale>('en');

  // Load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dashboard_lang') as DashboardLocale | null;
      if (saved === 'en' || saved === 'ar') {
        setLocaleState(saved);
        applyDocumentAttributes(saved);
        return;
      }

      // Check cookie
      const match = document.cookie.match(/dashboard_lang=([^;]+)/);
      if (match && (match[1] === 'en' || match[1] === 'ar')) {
        setLocaleState(match[1] as DashboardLocale);
        applyDocumentAttributes(match[1] as DashboardLocale);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function applyDocumentAttributes(loc: DashboardLocale) {
    const d = loc === 'ar' ? 'rtl' : 'ltr';
    if (typeof document !== 'undefined') {
      document.documentElement.dir = d;
      document.documentElement.lang = loc;
    }
  }

  function setLocale(newLocale: DashboardLocale) {
    setLocaleState(newLocale);
    applyDocumentAttributes(newLocale);
    try {
      localStorage.setItem('dashboard_lang', newLocale);
      document.cookie = `dashboard_lang=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      /* ignore */
    }
  }

  function toggleLocale() {
    setLocale(locale === 'en' ? 'ar' : 'en');
  }

  function t(key: TranslationKey, fallback?: string): string {
    const dict = dashboardTranslations[locale];
    if (dict && key in dict) {
      return dict[key];
    }
    return fallback || key;
  }

  function formatCurrency(amount: number): string {
    const formattedNum = Number(amount || 0).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US');
    if (locale === 'ar') {
      return `${formattedNum} ج.م`;
    }
    return `EGP ${formattedNum}`;
  }

  const isRtl = locale === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  return (
    <DashboardLanguageContext.Provider
      value={{
        locale,
        dir,
        isRtl,
        setLocale,
        toggleLocale,
        t,
        formatCurrency,
      }}
    >
      {children}
    </DashboardLanguageContext.Provider>
  );
}

export function useDashboardLang() {
  const context = useContext(DashboardLanguageContext);
  if (!context) {
    // Return safe fallback if rendered outside provider
    return {
      locale: 'en' as DashboardLocale,
      dir: 'ltr' as const,
      isRtl: false,
      setLocale: () => {},
      toggleLocale: () => {},
      t: (key: TranslationKey, fallback?: string) => fallback || key,
      formatCurrency: (amount: number) => `EGP ${Number(amount || 0).toLocaleString()}`,
    };
  }
  return context;
}
