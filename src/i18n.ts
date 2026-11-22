import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import zhCN from './locales/zh_CN';
import enUS from './locales/en_US';

export const LANGS = [
  { key: 'zh-CN', label: '简体中文' },
  { key: 'en-US', label: 'English' },
] as const;

export type LangKey = (typeof LANGS)[number]['key'];

const STORAGE_KEY = 'rd-admin-lang';

export function getStoredLang(): LangKey {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'en-US' ? 'en-US' : 'zh-CN';
}

i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
    'en-US': { translation: enUS },
  },
  lng: getStoredLang(),
  fallbackLng: 'zh-CN',
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__rdI18n = i18n;
}

export function setLang(lang: LangKey) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  if (i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }
  // Broadcast through the DOM as well: the module-level listener set proved
  // unreliable across chunk boundaries, which is why the sidebar used to stay in
  // the previous language until a reload.
  listeners.forEach((fn) => fn(lang));
  window.dispatchEvent(new CustomEvent('rd:lang', { detail: lang }));
}

const listeners = new Set<(lang: LangKey) => void>();

export function subscribeLang(fn: (lang: LangKey) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function currentLang(): LangKey {
  return i18n.language === 'en-US' ? 'en-US' : 'zh-CN';
}

/**
 * Language state that always re-renders its consumer. Kept separate from
 * `i18n.language` because ProLayout caches its menu from the `route` prop, so an
 * i18next-only update is not enough to refresh the sidebar.
 */
export function useLang(): LangKey {
  const [lang, setLangState] = useState<LangKey>(currentLang());
  useEffect(() => {
    const apply = (l: string) => setLangState(l === 'en-US' ? 'en-US' : 'zh-CN');
    const off = subscribeLang(apply);
    const onDom = (e: Event) => apply(String((e as CustomEvent).detail));
    const onChanged = (l: string) => apply(l);
    window.addEventListener('rd:lang', onDom);
    i18n.on('languageChanged', onChanged);
    apply(i18n.language);
    return () => {
      off();
      window.removeEventListener('rd:lang', onDom);
      i18n.off('languageChanged', onChanged);
    };
  }, []);
  return lang;
}

/**
 * Translation function bound to the current language. We avoid `useTranslation`
 * here because its internal `languageChanged` subscription does not refresh the
 * already-bound `t` inside ProLayout's memoised menu, which left the sidebar in
 * the previous language until a full page reload.
 */
export function useT() {
  const lang = useLang();
  return useCallback(
    (key: string, options?: Record<string, unknown>) => i18n.t(key, options) as string,
    [lang],
  );
}

export default i18n;
