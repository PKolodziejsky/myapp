import React from 'react'
import { useTranslation } from 'react-i18next'

export const MenuTourContent = () => {
  const { t } = useTranslation()

  return <div className='max-w-[274px]'>{t('product-tour.change-language-or-feedback')}</div>
}
