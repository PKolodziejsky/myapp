import 'dayjs/locale/en-gb'
import 'dayjs/locale/de'

import dayjs from 'dayjs'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import de from './locales/de/main.json'
import en from './locales/en/main.json'

export type AvailableLocale = 'en' | 'de'

export const AVAILABLE_LOCALES: AvailableLocale[] = ['en', 'de']

export const FALLBACK_LOCALE = 'en'

i18n.use(LanguageDetector).init({
  interpolation: {
    escapeValue: false,
  },
  fallbackLng: FALLBACK_LOCALE,
  detection: {
    caches: [],
  },
  react: {
    useSuspense: false,
  },
  resources: {
    en: {
      main: en,
    },
    de: {
      main: de,
    },
  },
  defaultNS: 'main',
})

export default i18n

export const isAvailableLocale = (locale: string | null): locale is AvailableLocale => {
  return AVAILABLE_LOCALES.includes(locale as AvailableLocale)
}

const changeLanguageLocale = (locale: AvailableLocale) => {
  return i18n.changeLanguage(locale)
}

const changeDateLocale = (locale: AvailableLocale) => {
  // Fix for monday start: use en-gb not en
  return dayjs.locale(locale == 'en' ? 'en-gb' : locale)
}

export const applyLocale = (locale: string | null) => {
  const availableLocale = isAvailableLocale(locale) ? locale : FALLBACK_LOCALE

  return Promise.all([changeDateLocale(availableLocale), changeLanguageLocale(availableLocale)]).then(() => availableLocale)
}
