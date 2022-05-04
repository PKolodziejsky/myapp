import { Card, CardProps } from '@seatti-tech/lithium'
import React from 'react'

import { Space } from '../../types'
import { Header, SkeletonHeader, SkeletonStatusIndicator, StatusIndicator } from './Option'

export const SkeletonSpaceOption = () => (
  <Card className='flex space-x-4 items-center justify-between'>
    <SkeletonHeader />
    <SkeletonStatusIndicator />
  </Card>
)

interface SpaceOptionProps extends CardProps {
  space: Space
  selected?: boolean
}

export const SpaceOption = ({ space, selected, ...props }: SpaceOptionProps) => {
  const { name, disabled, isAccessible, status: { occupation } = {}, labels, capacity } = space

  const description = labels?.join(', ')

  const isOccupied = capacity !== null && occupation !== undefined && occupation >= capacity

  const isDisabled = disabled || !isAccessible

  const isBookable = !isDisabled && !isOccupied

  return (
    <Card className='flex space-x-4 items-center justify-between' disabled={!isBookable && !selected} selected={selected} {...props}>
      <Header name={name} description={description} disabled={!isBookable} />
      <StatusIndicator space={space} />
    </Card>
  )
}
