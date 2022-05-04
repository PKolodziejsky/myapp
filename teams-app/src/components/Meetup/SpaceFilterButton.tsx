import { RoundButton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'

import { useFavoriteFilterState, useSpaceFilterState } from '../../hooks'
import { truncateSpaceName } from '../../screens/Meetup/utilities'
import { Space } from '../../types'

type SpaceFilterButtonProps = {
  space: Space
}

export const SpaceFilterButton = ({ space }: SpaceFilterButtonProps) => {
  const { spaceFilter, setSpaceFilter } = useSpaceFilterState()
  const { setFavoriteFilter } = useFavoriteFilterState()

  const addSpaceToFilter = (space: Space) => {
    setSpaceFilter([...spaceFilter, space.id])
    setFavoriteFilter(false)
  }
  const removeSpaceFromFilter = (space: Space) => setSpaceFilter(spaceFilter.filter(id => id !== space.id))

  const isSelected = spaceFilter.includes(space.id)

  return (
    <RoundButton
      variant='secondary'
      className={classNames('flex space-x-2 justify-center font-normal', {
        '!bg-pink-600': isSelected,
      })}
      onClick={() => {
        if (isSelected) removeSpaceFromFilter(space)
        else addSpaceToFilter(space)
      }}
    >
      <span
        className={classNames('font-bold', {
          'text-brand-grey-600 dark:text-white': !isSelected,
          'text-white': isSelected,
        })}
      >
        {truncateSpaceName(space)}
      </span>
      <span
        className={classNames('italic', {
          'text-grey-600 dark:text-grey-500': !isSelected,
          'text-white': isSelected,
        })}
      >{`(${space.status?.occupation ?? 0})`}</span>
    </RoundButton>
  )
}
