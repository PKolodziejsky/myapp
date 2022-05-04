import { Card, CardProps, DropdownIcon } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'

import { Space } from '../../types'
import { Header, PlaceholderHeader } from './Option'

interface SpaceSelectorProps extends Omit<CardProps, 'role'> {
  selectedSpace?: Space
}

export const SpaceSelector = ({ selectedSpace, className, ...props }: SpaceSelectorProps) => (
  <Card role='button' className={classNames('flex space-x-4 items-center justify-between', className)} {...props}>
    {selectedSpace ? <Header name={selectedSpace.name} description={selectedSpace.labels?.join(', ')} /> : <PlaceholderHeader />}
    <DropdownIcon />
  </Card>
)
