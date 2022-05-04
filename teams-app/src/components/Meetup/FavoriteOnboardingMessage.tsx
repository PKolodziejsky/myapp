import { Button } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import FavoriteDark from '../../assets/favorite-dark.svg'
import FavoriteLight from '../../assets/favorite-light.svg'
import { useFavoriteFilterState } from '../../hooks'

export const FavoriteOnboardingMessage = () => {
  const { t } = useTranslation()

  const { setFavoriteFilter } = useFavoriteFilterState()
  const disableFavoriteFilter = () => setFavoriteFilter(false)

  return (
    <div className='w-full flex flex-col justify-center items-center space-y-6 md:space-y-10'>
      <header className='text-center flex flex-col space-y-2'>
        <h2 className='font-semibold text-h5'>{t('application.meetup.welcome-to-your-favorites-page')}</h2>
        <ul className='text-grey-600 dark:text-grey-500 flex flex-col items-start space-y-1 list-disc list-inside'>
          <li>{t('application.meetup.find-people-you-enjoy-working-with')}</li>
          <li>{t('application.meetup.press-the-star-to-add-them-to-your-favorites')}</li>
          <li>{t('application.meetup.see-what-they-planned-at-a-glance')}</li>
        </ul>
      </header>
      <img className='dark:hidden w-fit' src={FavoriteLight} />
      <img className='hidden dark:block w-fit' src={FavoriteDark} />
      <Button onClick={disableFavoriteFilter}>{t('application.meetup.find-colleagues')}</Button>
    </div>
  )
}
