import { Button, Checkbox, ContextMenuController, DropdownIcon, RoundButton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

import { useFavoriteFilterState, useSpaceFilterState } from '../../hooks/useMeetupFilters'
import { truncateSpaceName } from '../../screens/Meetup/utilities'
import { meetupAllRootSpacesState } from '../../store'
import { Space } from '../../types'
import { FilterListEntry } from './FilterListEntry'

export const FavoriteAndSpaceFilterButton = () => {
  const { t } = useTranslation()

  const rootSpaces = useRecoilValue(meetupAllRootSpacesState)
  const { spaceFilter, setSpaceFilter } = useSpaceFilterState()
  const { favoriteFilterIsUndefined, favoriteFilter, setFavoriteFilter } = useFavoriteFilterState()

  const addSpaceToFilter = (space: Space) => {
    setSpaceFilter([...spaceFilter, space.id])
    setFavoriteFilter(false)
  }
  const removeSpaceFromFilter = (space: Space) => setSpaceFilter(spaceFilter.filter(id => id !== space.id))

  const toggleFavorite = () => {
    setSpaceFilter([])
    setFavoriteFilter(favoriteFilterIsUndefined ? false : !favoriteFilter)
  }

  const isFiltered = (spaceFilter && spaceFilter.length > 0) || favoriteFilter || favoriteFilterIsUndefined

  const reset = () => {
    setSpaceFilter([])
    setFavoriteFilter(false)
  }

  const filterCount = (favoriteFilter || favoriteFilterIsUndefined ? 1 : 0) + spaceFilter.length

  return (
    <ContextMenuController
      alignment='right'
      selector={toggle => (
        <RoundButton
          className={classNames('flex space-x-2 justify-center font-normal', {
            'text-brand-grey-600 dark:text-white': !isFiltered,
          })}
          iconEnd={<DropdownIcon />}
          active={isFiltered}
          variant='secondary'
          onClick={toggle}
        >
          <span className='font-bold'>{isFiltered ? t('application.meetup.selected') : t('application.planning.all')}</span>
          {isFiltered && <span className='italic'>{`(${filterCount})`}</span>}
        </RoundButton>
      )}
    >
      {toggle => (
        <ul className='flex flex-col max-h-[420px] w-full md:w-max py-6 px-0 space-y-4'>
          <li className='overflow-y-scroll'>
            <ul className='px-6 flex flex-col w-full divide-y divide-grey-200 dark:divide-grey-700'>
              <li className='w-full py-4 flex items-center justify-between space-x-4 cursor-pointer' onClick={toggleFavorite}>
                <span className='font-semibold'>{t('application.planning.my-favorites')}</span>
                <Checkbox className='cursor-pointer' checked={favoriteFilter || favoriteFilterIsUndefined} />
              </li>
              {rootSpaces.map(space => {
                const isSelected = spaceFilter?.includes(space.id)

                return (
                  <FilterListEntry
                    id={space.id}
                    selected={isSelected}
                    text={truncateSpaceName(space)}
                    count={space.status?.occupation ?? 0}
                    onClick={() => {
                      if (isSelected) removeSpaceFromFilter(space)
                      else addSpaceToFilter(space)
                    }}
                  />
                )
              })}
            </ul>
          </li>
          <li className='px-6 h-fit w-full'>
            <ul className='w-full flex justify-center items-center space-x-2'>
              <li>
                <Button variant='secondary' onClick={reset}>
                  {t('application.planning.clear-all')}
                </Button>
              </li>
              <li>
                <Button onClick={toggle}>{t('application.planning.done')}</Button>
              </li>
            </ul>
          </li>
        </ul>
      )}
    </ContextMenuController>
  )
}
