import React from 'react'
import { useTranslation } from 'react-i18next'

export const LoadingScreen = () => {
  const { t } = useTranslation()

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div>
        <div className='animate-pulse w-32 h-32 bg-seatti-logo' />
        <div className='sr-only'>{t('application.common.loading')}</div>
      </div>
    </div>
  )
}
