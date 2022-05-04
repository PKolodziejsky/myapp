import { AvailableLocale } from '../../i18n'

export const formatWeekLabelForDatesNavigation = (week: string, locale: AvailableLocale): string => {
  switch (locale) {
    case 'de':
      return `KW ${week}`
    case 'en':
      return `WEEK ${week}`
    default:
      return week
  }
}
