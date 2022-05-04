import { Skeleton } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

export const SkeletonHeader = () => (
  <div className='flex flex-grow flex-col space-y-0.5'>
    <Skeleton variant='shaded' width='100%' height='16px' />
    <Skeleton variant='shaded' width='100%' height='16px' />
  </div>
)

export const PlaceholderHeader = () => {
  const { t } = useTranslation()

  return <div className='text-sm text-grey-600 dark:text-grey-500'>{t('application.planning.select-place')}</div>
}

interface HeaderProps {
  name?: string
  description?: string
  disabled?: boolean
}

export const Header = ({ name, description, disabled }: HeaderProps) => (
  <div className='flex flex-grow flex-col space-y-0.5'>
    {name && (
      <div
        className={classNames('w-full font-semibold text-sm', {
          'text-grey-500 dark:text-grey-600': disabled,
        })}
      >
        {name}
      </div>
    )}
    {description && (
      <div className={classNames('w-full text-xs', disabled ? 'text-grey-400 dark:text-grey-600' : 'text-grey-600 dark:text-grey-500')}>
        {description}
      </div>
    )}
  </div>
)
