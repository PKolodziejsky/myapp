import { DropdownIcon, TimeIcon } from '@seatti-tech/lithium'
import React, { ReactNode } from 'react'

interface SelectorProps {
  onClick: () => void
  children: ReactNode
  className?: string
}

export const Selector = ({ onClick, children, className }: SelectorProps) => {
  return (
    <div className={className}>
      <button
        className='w-full text-sm p-4 flex items-center justify-between rounded-2xl border border-purple-600 dark:border-purple-400 bg-white dark:bg-grey-900'
        onClick={onClick}
      >
        <span className='flex items-center space-x-3'>
          <TimeIcon width='20px' height='20px' />
          {children}
        </span>
        <DropdownIcon width='20px' height='20px' />
      </button>
    </div>
  )
}
