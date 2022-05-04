import { MapIcon } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { ButtonHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

export interface FloorplanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen: boolean
}

export const FloorplanButton = ({ isOpen, className, ...props }: FloorplanButtonProps) => {
  const { t } = useTranslation()
  return (
    <button
      className={classNames(
        'flex items-center font-semibold gap-2 ml-auto transition hover:text-pink-600 dark:hover:text-pink-300',
        {
          'text-pink-600 dark:text-pink-400': isOpen,
          'text-purple-600 dark:text-purple-400': !isOpen,
        },
        className,
      )}
      {...props}
    >
      {isOpen ? t('application.planning.close-floor-plan') : t('application.planning.floor-plan')}
      <MapIcon />
    </button>
  )
}
