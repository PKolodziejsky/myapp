import React from 'react'
import { useTranslation } from 'react-i18next'

export const DatesNavigationAllocationsTourContent = () => {
  const { t } = useTranslation()

  return <div className='max-w-[274px]'>{t('product-tour.days-and-weeks-booked-overview')}</div>
}
