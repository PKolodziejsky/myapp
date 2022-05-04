import i18next from 'i18next'
import React, { ReactNode, createContext } from 'react'
import { I18nextProvider } from 'react-i18next'

import { AvailableLocale, FALLBACK_LOCALE } from '../i18n'

interface LocaleContextValue {
  locale: AvailableLocale
  setLocale: (locale: string) => void
}

export const LocaleContext = createContext<LocaleContextValue>({
  locale: FALLBACK_LOCALE,
  setLocale: () => {},
})

interface LanguageProviderProps {
  locale: AvailableLocale
  onChangeLocale: (locale: string) => void
  children: ReactNode
}

export const LocaleProvider = ({ locale, onChangeLocale, children }: LanguageProviderProps) => {
  return (
    <I18nextProvider i18n={i18next}>
      <LocaleContext.Provider value={{ locale, setLocale: onChangeLocale }}>{children}</LocaleContext.Provider>
    </I18nextProvider>
  )
}
