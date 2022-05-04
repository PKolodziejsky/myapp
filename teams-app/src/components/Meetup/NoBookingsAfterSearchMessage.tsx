import React from 'react'
import { useTranslation } from 'react-i18next'

import SearchDark from '../../assets/search-dark.svg'
import SearchLight from '../../assets/search-light.svg'

export const NoBookingsAfterSearchMessage = () => {
  const { t } = useTranslation()
  return (
    <div className='w-full flex flex-col justify-center items-center space-y-6 md:space-y-10'>
      <header className='text-center flex flex-col space-y-2'>
        <h2 className='font-semibold text-h5'>{t('application.meetup.we-could-not-find-any-no-matches')}</h2>
        <span className='text-grey-600 dark:text-grey-500'>
          {t('application.meetup.maybe-your-colleagues-did-not-plan-their-time-yet')}
        </span>
      </header>
      <img className='dark:hidden w-fit' src={SearchLight} />
      <img className='hidden dark:block w-fit' src={SearchDark} />
      <ul className='flex flex-col items-start space-y-1 list-disc list-inside'>
        <li>{t('application.meetup.check-your-spelling-and-try-again')}</li>
        <li>{t('application.meetup.search-for-another-colleague')}</li>
        <li>{t('application.meetup.select-one-of-the-spaces-to-see-who-is-coming')}</li>
      </ul>
    </div>
  )
}
