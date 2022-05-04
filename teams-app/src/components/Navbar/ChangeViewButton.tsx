import { HierarchyChildrenIcon, HierarchySiblingsIcon } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { DatesView } from '../../types'

interface ChangeViewButtonProps {
  view: DatesView
  onChange: (view: DatesView) => void
}

export const ChangeViewButton = ({ view, onChange }: ChangeViewButtonProps) => {
  const { t } = useTranslation()

  const changeMode = () => onChange(view === 'daily' ? 'weekly' : 'daily')

  return (
    <div data-tour='change-view' className='inline-flex'>
      <button
        className='transition hidden md:block font-semibold text-sm hover:text-pink-600 dark:hover:text-pink-600'
        onClick={changeMode}
      >
        {view === 'daily' ? t('application.planning.weekly-view') : t('application.planning.daily-view')}
      </button>
      <button className='transition md:hidden hover:text-pink-600' onClick={changeMode}>
        {view === 'daily' ? <HierarchyChildrenIcon /> : <HierarchySiblingsIcon />}
      </button>
    </div>
  )
}
