import { useContext } from 'react'

import { AvailableLocale } from '../i18n'
import { LocaleContext } from '../providers'

export const useLocale = (): [AvailableLocale, (locale: string) => void] => {
  const { locale, setLocale } = useContext(LocaleContext)

  return [locale, setLocale]
}
