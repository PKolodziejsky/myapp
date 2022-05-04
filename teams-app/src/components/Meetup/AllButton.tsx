import { RoundButton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFavoriteFilterState, useSpaceFilterState } from '../../hooks/useMeetupFilters'

export const AllButton = () => {
  const { t } = useTranslation()

  const { spaceFilter, setSpaceFilter } = useSpaceFilterState()
  const { favoriteFilterIsUndefined, favoriteFilter, setFavoriteFilter } = useFavoriteFilterState()
  const isFiltered = (spaceFilter && spaceFilter.length > 0) || favoriteFilter || favoriteFilterIsUndefined

  const resetSpaceFilter = () => setSpaceFilter([])
  const resetFavoriteFilter = () => setFavoriteFilter(false)

  return (
    <RoundButton
      className={classNames('font-bold', {
        'text-brand-grey-600 dark:text-white': isFiltered,
      })}
      active={!isFiltered}
      variant='secondary'
      onClick={() => {
        if (!isFiltered) return
        resetSpaceFilter()
        resetFavoriteFilter()
      }}
    >
      {t('application.planning.all')}
    </RoundButton>
  )
}
