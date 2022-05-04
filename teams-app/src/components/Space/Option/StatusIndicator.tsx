import { AllocationIndicator, Avatar, ForbiddenIcon, Skeleton, StatusDot } from '@seatti-tech/lithium'
import React from 'react'

import { Space } from '../../../types'
import { OccupationIndicator } from '../../Occupation/OccupationIndicator'

export const SkeletonStatusIndicator = () => <Skeleton variant='shaded' width='24px' height='24px' />

interface StatusIndicatorProps {
  space: Space
}

export const StatusIndicator = ({ space }: StatusIndicatorProps) => {
  const { disabled, isAccessible, status: { users, occupation } = {}, capacity } = space

  const user = users?.[0]

  const isOccupied = capacity !== null && occupation !== undefined && occupation >= capacity

  const isDisabled = disabled || !isAccessible

  const isBookable = !isDisabled && !isOccupied

  const isLeafSpace = capacity === 1

  const isConceptSpace = capacity == null || capacity === 0

  const isAnonymous = isOccupied && !user

  if (isLeafSpace) {
    if (isAnonymous) return <Avatar isAnonymous />
    else if (isOccupied && user?.person) return <OccupationIndicator person={user?.person} />
    else if (!isBookable) return <ForbiddenIcon className='text-grey-400' />
    else return <StatusDot variant='success' />
  } else if (isConceptSpace) {
    return null
  } else {
    if (isDisabled) return <ForbiddenIcon className='text-grey-400' />
    return <AllocationIndicator value={occupation ?? 0} total={capacity ?? 0} hover />
  }
}
