import { CheckIcon, CloseIcon, EditIcon, Input } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useState } from 'react'

import { Space } from '../../../types'

type SpaceLabelProps = {
  space: Space
  onClick?: () => void
  onSave: (name: string) => void
}

export const SpaceLabel = ({ space, onClick, onSave }: SpaceLabelProps) => {
  const [name, setName] = useState(space.name)

  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className='flex items-center space-x-1 font-semibold'>
      {!isEditing ? (
        <>
          <div
            className={classNames({
              'transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer': !!onClick,
            })}
            onClick={onClick}
          >
            {space.name}
          </div>
          <EditIcon
            className='transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer'
            onClick={() => setIsEditing(true)}
          />
        </>
      ) : (
        <>
          <Input
            className='!py-1'
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
            autoFocus
          />
          <CheckIcon
            className='transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer'
            onClick={() => {
              onSave(name)
              setIsEditing(false)
            }}
          />
          <CloseIcon
            className='transition hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer'
            onClick={() => {
              setName(space.name)
              setIsEditing(false)
            }}
          />
        </>
      )}
    </div>
  )
}
