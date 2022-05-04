import { Button } from '@seatti-tech/lithium'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'

import darkImage from '../../../assets/product-tour/planning/intro-dark.png'
import lightImage from '../../../assets/product-tour/planning/intro.png'
import { TourStartContext } from '../../../components/ProductTour/Tooltip'

export const IntroTourContent = () => {
  const onStart = useContext(TourStartContext)
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center space-y-6 md:space-y-8 -m-6 md:-m-8 max-content w-[780px] pt-4 md:pt-8'>
      <header className='w-full flex flex-col space-y-4 md:space-y-1 text-center px-4 md:px-0'>
        <h2 className='text-h2 font-bold'>{t('product-tour.welcome-to-new-look')}</h2>
        <span className='text-md text-grey-900 dark:text-grey-500'>{t('product-tour.available-on-teams-app')}</span>
      </header>
      <Button className='w-fit' onClick={onStart}>
        {t('product-tour.lets-go')}
      </Button>
      <img src={lightImage} className='dark:hidden object-contain' aria-hidden alt='Symbol image' />
      <img src={darkImage} className='hidden dark:inline object-contain' aria-hidden alt='Symbol image' />
    </div>
  )
}
