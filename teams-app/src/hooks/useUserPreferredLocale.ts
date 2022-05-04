import { useEffect, useState } from 'react'

import { getCustomUserSettingsRequest, setCustomUserSettingRequest } from '../api'
import { AvailableLocale, FALLBACK_LOCALE, applyLocale } from '../i18n'
import { queryClient } from '../request'
import { CustomUserSetting } from '../types/User'
import { getTeamsContext } from '../utilities'
import { ApplicationEnvironment } from './useAuthentication'

export const getUserSettingsLocale = (): Promise<string | null> => {
  return queryClient
    .fetchQuery(['settings'], getCustomUserSettingsRequest)
    .then(({ user }) => user.settings?.custom?.[CustomUserSetting.Language] ?? null)
    .catch(() => null)
}

export const setUserSettingsLocale = (locale: string) => {
  return setCustomUserSettingRequest({ key: CustomUserSetting.Language, value: locale }).then(
    ({ setCustomUserSetting }) => setCustomUserSetting,
  )
}

const getTeamsLocale = () => {
  return getTeamsContext().then(context => context.locale)
}

interface UseUserPreferredLocaleOptions {
  environment: ApplicationEnvironment | null
  useUserSettingsLocale: boolean
}

export const useUserPreferredLocale = ({ environment, useUserSettingsLocale }: UseUserPreferredLocaleOptions) => {
  const [locale, setLocale] = useState<AvailableLocale>(FALLBACK_LOCALE)

  const setUserPreferredLocale = (locale: string | null) => {
    applyLocale(locale).then(locale => {
      setLocale(locale)
      return setUserSettingsLocale(locale)
    })
  }

  useEffect(() => {
    Promise.resolve()
      .then(() => (useUserSettingsLocale ? getUserSettingsLocale() : null))
      .then(userSettingsLocale => (userSettingsLocale === null && environment === 'teams' ? getTeamsLocale() : userSettingsLocale))
      .then(applyLocale)
      .then(locale => setLocale(locale))
  }, [useUserSettingsLocale, environment])

  return { userPreferredLocale: locale, setUserPreferredLocale }
}
