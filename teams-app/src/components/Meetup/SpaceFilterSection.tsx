import { Button, ContextMenuController, RoundButton } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

import { useFavoriteFilterState, useSpaceFilterState } from '../../hooks'
import { getTruncatedSpaceNameLength, truncateSpaceName } from '../../screens/Meetup/utilities'
import { meetupAllRootSpacesState } from '../../store'
import { Space } from '../../types'
import { FilterListEntry } from './FilterListEntry'
import { SpaceFilterButton } from './SpaceFilterButton'

const MAX_COMBINED_VISIBLE_SPACE_NAME_LENGTH = 20

export const SpaceFilterSection = () => {
  const { t } = useTranslation()

  const rootSpaces = useRecoilValue(meetupAllRootSpacesState)
  const { spaceFilter, setSpaceFilter } = useSpaceFilterState()
  const { setFavoriteFilter } = useFavoriteFilterState()

  const addSpaceToFilter = (space: Space) => {
    setSpaceFilter([...spaceFilter, space.id])
    setFavoriteFilter(false)
  }
  const removeSpaceFromFilter = (space: Space) => setSpaceFilter(spaceFilter.filter(id => id !== space.id))

  let combinedVisibleSpaceNameLength = 0
  let spaceIndex = 0

  for (; spaceIndex < rootSpaces.length; spaceIndex++) {
    const spaceNameLength = getTruncatedSpaceNameLength(rootSpaces[spaceIndex])

    if (combinedVisibleSpaceNameLength + spaceNameLength > MAX_COMBINED_VISIBLE_SPACE_NAME_LENGTH) break

    combinedVisibleSpaceNameLength += spaceNameLength
  }

  const visibleSpaces = rootSpaces.slice(0, spaceIndex)
  const menuSpaces = rootSpaces.slice(spaceIndex)

  const reset = () => setSpaceFilter([])

  return (
    <ul className='p-2 md:p-0 grid grid-cols-2 md:flex gap-2'>
      {visibleSpaces.map(space => (
        <li key={space.id}>
          <SpaceFilterButton space={space} />
        </li>
      ))}
      {menuSpaces.length > 0 && (
        <li>
          <ContextMenuController
            selector={toggle => (
              <RoundButton variant='secondary' className='font-bold justify-center text-brand-grey-600 dark:text-white' onClick={toggle}>
                {t('application.planning.more')}
              </RoundButton>
            )}
          >
            {toggle => (
              <ul className='flex flex-col max-h-[420px] w-full md:min-w-[246px] md:w-max px-0 py-6 space-y-2'>
                <li className='px-6 overflow-y-scroll'>
                  <ul className='flex flex-col w-full divide-y divide-grey-200 dark:divide-grey-700'>
                    {menuSpaces.map(space => {
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
        </li>
      )}
    </ul>
  )
}
