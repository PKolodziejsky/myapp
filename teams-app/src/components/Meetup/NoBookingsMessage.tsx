import React from 'react'
import { useTranslation } from 'react-i18next'

import NoBookingsDark from '../../assets/meetup-no-bookings-dark.svg'
import NoBookingsLight from '../../assets/meetup-no-bookings-light.svg'

export const NoBookingsMessage = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col items-center space-y-6 md:space-y-10'>
      <h2 className='font-semibold text-h5 text-center'>{t('application.planning.nobody-has-planned-yet')}</h2>
      <img className='dark:hidden w-fit' src={NoBookingsLight} />
      <img className='hidden dark:block w-fit' src={NoBookingsDark} />
    </div>
  )
}
