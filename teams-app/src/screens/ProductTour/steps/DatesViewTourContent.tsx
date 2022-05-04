import React from 'react'
import { useTranslation } from 'react-i18next'

import darkImage from '../../../assets/product-tour/planning/dates-navigation-dark.png'
import lightImage from '../../../assets/product-tour/planning/dates-navigation.png'

export const DatesViewTourContent = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col space-y-4 max-w-[276px]'>
      <h2>{t('product-tour.switch-between-weekly-daily')}</h2>
      <img src={lightImage} className='dark:hidden object-contain' aria-hidden alt='Symbol image' />
      <img src={darkImage} className='hidden dark:inline object-contain' aria-hidden alt='Symbol image' />
    </div>
  )
}
