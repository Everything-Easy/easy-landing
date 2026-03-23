import type { Language, TranslationStrings } from '../types';
import { es } from './es';
import { en } from './en';

export const translations: Record<Language, TranslationStrings> = {
  es,
  en,
};

export { es, en };
