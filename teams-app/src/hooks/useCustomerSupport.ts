import { useLocale } from './useLocale'

export const useCustomerSupport = () => {
  const [locale] = useLocale()

  let url = 'http://seatti.co/support'
  switch (locale) {
    case 'en':
      url = 'http://en.seatti.co/support'
      break
    default:
  }

  return () => window.open(url, '_blank')
}

export const useFeedback = () => {
  const [locale] = useLocale()

  let url = 'http://seatti.co/feedback'
  switch (locale) {
    case 'en':
      url = 'http://en.seatti.co/feedback'
      break
    default:
  }

  return () => window.open(url, '_blank')
}
