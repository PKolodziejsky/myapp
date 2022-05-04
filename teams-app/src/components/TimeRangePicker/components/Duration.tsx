import classNames from 'classnames'
import React from 'react'

import { getReadableDuration } from '../../../utilities'

interface DurationPros {
  from: Date
  to: Date
  withBrackets?: boolean
  className?: string
}

export const Duration = ({ from, to, withBrackets, className }: DurationPros) => (
  <span className={classNames('flex items-center justify-center text-xs text-grey-600 dark:text-grey-500 italic', className)}>
    {withBrackets ? `(${getReadableDuration(from, to)})` : getReadableDuration(from, to)}
  </span>
)
