import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
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
});

export function setLang(lang: LangKey) {
  localStorage.setItem(STORAGE_KEY, lang);
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
}

export default i18n;
