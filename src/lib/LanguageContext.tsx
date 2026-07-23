'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Lang, getDict, detectLanguage } from './i18n';

type LanguageContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh');

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null;
    if (stored === 'zh' || stored === 'en') {
      setLang(stored);
    } else {
      setLang(detectLanguage());
    }
  }, []);

  const changeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.lang = newLang === 'zh' ? 'zh-CN' : 'en';
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>) => {
    const dict = getDict(lang);
    let text = dict[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace('{' + k + '}', v);
      });
    }
    return text;
  }, [lang]);

  return React.createElement(LanguageContext.Provider, { value: { lang, setLang: changeLang, t } }, children);
};

export function useT() {
  const ctx = useContext(LanguageContext);
  return { t: ctx.t, lang: ctx.lang, setLang: ctx.setLang };
}
