import React from 'react'
import { useTranslation } from 'react-i18next'

export const TermsOfUseScreen = () => {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('application.terms.header')}</h1>
    </div>
  )
}
