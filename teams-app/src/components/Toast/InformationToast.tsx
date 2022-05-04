import { Toast } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type InformationToastProps = {
  children: string
  onUndo?: () => void
}

export const InformationToast = ({ children, onUndo }: InformationToastProps) => {
  const { t } = useTranslation()

  return (
    <Toast
      className='w-full md:w-fit'
      message={children}
      primaryActionLabel={onUndo && t('application.planning.undo')}
      primaryActionOnClick={onUndo}
    />
  )
}
