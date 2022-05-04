import { CloseIcon } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'

export type LabelProps = {
  children: string | JSX.Element
  onDelete?: () => void
  onClick?: () => void
}

export const Label = ({ children, onClick, onDelete }: LabelProps) => {
  return (
    <div
      className={classNames('w-fit flex items-center py-1 px-2 bg-grey-200 dark:bg-grey-600 dark:text-white rounded-xl text-xs space-x-1', {
        'cursor-pointer': !!onClick,
      })}
      onClick={onClick}
    >
      {children}
      {onDelete && <CloseIcon className='cursor-pointer' onClick={onDelete} />}
    </div>
  )
}
