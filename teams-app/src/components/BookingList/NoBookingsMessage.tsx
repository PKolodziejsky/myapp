import React from 'react'
import { useTranslation } from 'react-i18next'

import NoBookingsImageDark from '../../assets/no-bookings-dark.svg'
import NoBookingsImageLight from '../../assets/no-bookings-light.svg'

export const NoBookingsMessage = () => {
  const { t } = useTranslation()

  return (
    <div className='flex flex-col space-y-6 md:space-y-10'>
      <h2 className='font-semibold text-h5 text-center'>{t('application.planning.no-bookings')}</h2>
      <img className='dark:hidden' src={NoBookingsImageLight} />
      <img className='hidden dark:block' src={NoBookingsImageDark} />
    </div>
  )
}
