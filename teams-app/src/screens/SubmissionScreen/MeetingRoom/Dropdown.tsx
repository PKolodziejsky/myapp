import { ContextMenuController } from '@seatti-tech/lithium'
import React from 'react'
import { useQuery } from 'react-query'

import { getSpaceChildrenRequest } from '../../../api'
import { SpaceSelector } from '../../../components/Space'
import { SkeletonSpaceList, SpaceList } from '../../../components/Space/SpaceList'
import { Space, SpaceKind } from '../../../types'
import { toKey } from '../../../utilities'

interface DropdownProps {
  date: Date
  parent: Space
  selectedSpace?: Space
  onSelect: (space: Space) => void
}

export const Dropdown = ({ date, parent, selectedSpace, onSelect }: DropdownProps) => {
  const dateKey = toKey(date)

  const { data: { spaceChildren = [] } = {}, isLoading } = useQuery(['spaceChildren', SpaceKind.MEETING_ROOM, parent, dateKey], () =>
    getSpaceChildrenRequest({
      date: dateKey,
      id: parent.id,
      onlyWithMeetingRoomsAsChildren: true,
    }),
  )

  return (
    <>
      <div className='w-full flex flex-col items-center space-y-2'>
        <ContextMenuController
          alignment='center'
          className='w-full md:w-[540px]'
          selector={toggle => <SpaceSelector selectedSpace={selectedSpace} onClick={toggle} />}
        >
          {toggle => (
            <div className='w-full md:w-[540px] max-h-screen md:max-h-[344px] overflow-y-auto'>
              {isLoading ? (
                <SkeletonSpaceList />
              ) : (
                <SpaceList
                  className='p-4'
                  spaces={spaceChildren}
                  selectedSpace={selectedSpace}
                  onSelect={space => {
                    onSelect(space)
                    toggle()
                  }}
                />
              )}
            </div>
          )}
        </ContextMenuController>
      </div>
    </>
  )
}
