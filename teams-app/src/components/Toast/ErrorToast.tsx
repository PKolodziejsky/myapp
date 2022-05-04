import { Toast } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useCustomerSupport } from '../../hooks'

export type ErrorToastProps = {
  children: string
  onRetry?: () => void
}

export const ErrorToast = ({ children, onRetry }: ErrorToastProps) => {
  const { t } = useTranslation()
  const navigateToSupport = useCustomerSupport()

  return onRetry ? (
    <Toast
      variant='error'
      className='w-full md:w-fit'
      message={children}
      primaryActionLabel={t('application.planning.try-again')}
      primaryActionOnClick={onRetry}
      secondaryActionLabel={t('application.planning.get-support')}
      secondaryActionOnClick={navigateToSupport}
    />
  ) : (
    <Toast
      variant='error'
      className='w-full md:w-fit'
      message={children}
      primaryActionLabel={t('application.planning.get-support')}
      primaryActionOnClick={navigateToSupport}
    />
  )
}
