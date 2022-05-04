import { RoundButton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFavoriteFilterState, useSpaceFilterState } from '../../hooks'

export const FavoriteFilterButton = () => {
  const { t } = useTranslation()

  const { favoriteFilterIsUndefined, favoriteFilter, setFavoriteFilter } = useFavoriteFilterState()
  const { setSpaceFilter } = useSpaceFilterState()

  const toggleFavorite = () => {
    setSpaceFilter([])
    setFavoriteFilter(favoriteFilterIsUndefined ? false : !favoriteFilter)
  }

  return (
    <RoundButton
      variant='secondary'
      className={classNames('font-bold justify-center', {
        '!bg-pink-600 !text-white': favoriteFilterIsUndefined ? true : favoriteFilter,
        'text-brand-grey-600 dark:text-white': favoriteFilterIsUndefined ? false : !favoriteFilter,
      })}
      onClick={toggleFavorite}
    >
      {t('application.planning.my-favorites')}
    </RoundButton>
  )
}
