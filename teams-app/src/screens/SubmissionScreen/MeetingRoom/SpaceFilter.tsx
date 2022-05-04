import classNames from 'classnames'
import React, { useCallback, useMemo } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'

import { getSpaceRootPathRequest } from '../../../api'
import { meetingRoomFiltersState } from '../../../store'
import { Space } from '../../../types'
import { Dropdown } from './Dropdown'

interface SpaceFilterProps {
  date: Date
  className?: string
  rootSpace?: Space
}

export const SpaceFilter = ({ date, className, rootSpace }: SpaceFilterProps) => {
  const [{ space }, setFilters] = useRecoilState(meetingRoomFiltersState)

  const spaceFilter = useMemo(() => space ?? rootSpace, [rootSpace, space])

  const { data: { spaceRootPath = [] } = {} } = useQuery(
    ['rootPath', spaceFilter?.id],
    () => getSpaceRootPathRequest({ id: spaceFilter?.id ?? '' }),
    {
      keepPreviousData: true,
    },
  )

  const onSelect = useCallback((space: Space) => setFilters(filters => ({ ...filters, space })), [setFilters])

  return (
    <ul className={classNames('w-full flex flex-col space-y-2', className)}>
      {spaceRootPath.map((space, index) => {
        if (index === spaceRootPath.length - 1 && spaceRootPath.length > 1) return

        return (
          <li className='w-full' key={space.id}>
            <Dropdown date={date} parent={space} selectedSpace={spaceRootPath[index + 1]} onSelect={onSelect} />
          </li>
        )
      })}
    </ul>
  )
}
