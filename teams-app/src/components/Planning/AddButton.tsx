import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'

export type AddButtonProps = {
  disabled?: boolean
  onClick?: () => void
}

export const AddButton = ({ disabled, onClick }: AddButtonProps) => {
  const { t } = useTranslation()

  return (
    <button
      className={classNames('font-semibold transition', {
        'text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-300': !disabled,
        'text-grey-400 dark:text-brand-grey-500 cursor-default': disabled,
      })}
      onClick={onClick}
    >
      + {t('application.planning.add')}
    </button>
  )
}
