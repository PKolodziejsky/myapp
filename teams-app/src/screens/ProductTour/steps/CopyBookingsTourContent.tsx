import React from 'react'
import { useTranslation } from 'react-i18next'

export const CopyBookingsTourContent = () => {
  const { t } = useTranslation()

  return <div className='max-w-[274px]'>{t('product-tour.copy-bookings-from-last-week')}</div>
}
