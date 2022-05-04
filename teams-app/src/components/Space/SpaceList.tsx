import classNames from 'classnames'
import React from 'react'

import { Space } from '../../types'
import { SkeletonSpaceOption, SpaceOption } from './SpaceOption'

const COUNT_OF_PLACEHOLDER_CARDS = 4

interface MeetingRoomListSkeletonProps {
  count?: number
  className?: string
}

export const SkeletonSpaceList = ({ count, className }: MeetingRoomListSkeletonProps) => (
  <ul className={classNames('w-full flex flex-col space-y-2', className)}>
    {Array.from(Array(count ?? COUNT_OF_PLACEHOLDER_CARDS).keys()).map(i => (
      <li className='w-full' key={i}>
        <SkeletonSpaceOption />
      </li>
    ))}
  </ul>
)

interface SpaceListProps {
  spaces: Space[]
  onSelect?: (space: Space) => void
  selectedSpace?: Space
  className?: string
}

export const SpaceList = ({ spaces, selectedSpace, onSelect, className }: SpaceListProps) => (
  <ul className={classNames('w-full flex flex-col space-y-2', className)}>
    {spaces.map(space => (
      <li className='w-full' key={space.id}>
        <SpaceOption
          role={onSelect ? 'button' : undefined}
          selected={selectedSpace && selectedSpace.id === space.id}
          key={space.id}
          space={space}
          onClick={onSelect ? () => onSelect(space) : undefined}
        />
      </li>
    ))}
  </ul>
)
