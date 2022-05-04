import React from 'react'
import { useTranslation } from 'react-i18next'

import darkImage from '../../../assets/product-tour/planning/add-booking-dark.png'
import lightImage from '../../../assets/product-tour/planning/add-booking.png'

export const AddBookingTourContent = () => {
  const { t } = useTranslation()

  return (
    <div className='max-w-[274px] space-y-4'>
      <span>{t('product-tour.add-booking-preload-last')}</span>
      <img src={lightImage} className='dark:hidden' aria-hidden alt='Symbol image' />
      <img src={darkImage} className='hidden dark:inline' aria-hidden alt='Symbol image' />
    </div>
  )
}
