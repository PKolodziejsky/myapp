import React from 'react'
import { useQuery } from 'react-query'

import { getSpaceChildrenWithStatusRequest } from '../../api'
import { Space, SpaceKind } from '../../types'
import { toKey } from '../../utilities'
import { SkeletonSpaceList, SpaceList } from '../Space'

interface RootSpaceSelectProps {
  date: Date
  onSelect: (space: Space) => void
  kind: SpaceKind
  className?: string
}

export const RootSpaceSelect = ({ date, kind, ...props }: RootSpaceSelectProps) => {
  const dateKey = toKey(date)

  const { data: { spaceChildren: rootSpaces = [] } = {}, isLoading } = useQuery(['spaceChildren', kind, null, dateKey], () =>
    getSpaceChildrenWithStatusRequest({ date: toKey(date), onlyWithMeetingRoomsAsChildren: kind === SpaceKind.MEETING_ROOM }),
  )

  return isLoading ? <SkeletonSpaceList {...props} /> : <SpaceList spaces={rootSpaces} {...props} />
}
