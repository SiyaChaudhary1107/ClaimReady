import { Language } from '../types';
import { en } from './en';
import { hi } from './hi';
import { pa } from './pa';
import { bn } from './bn';

export const translations = {
  en,
  hi,
  pa,
  bn,
};

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिंदी', english: 'Hindi' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  bn: { native: 'বাংলা', english: 'Bengali' },
};

export function getTranslation(lang: Language): typeof en {
  return translations[lang] || en;
}
