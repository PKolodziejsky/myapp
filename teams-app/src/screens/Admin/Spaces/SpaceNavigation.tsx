import { ArrowLeftIcon, DoubleArrowRightIcon } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Space } from '../../../types'

type SpaceNavigationProps = {
  space: Space | undefined
  spaceRootPath: Space[] | undefined
}

export const SpaceNavigation = ({ space, spaceRootPath }: SpaceNavigationProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <header className='flex flex-col space-y-4'>
      {space && (
        <nav>
          <ol className='flex space-x-1 text-sm items-center h-[24px]'>
            <li className='cursor-pointer' onClick={() => navigate('/admin/spaces')}>
              {t('application.admin.overview')}
            </li>
            {spaceRootPath?.slice(0, -1).map(space => (
              <li className='flex space-x-2 items-center' key={space.id}>
                <DoubleArrowRightIcon />
                <span className='cursor-pointer' onClick={() => navigate(`/admin/spaces/${space.id}`)}>
                  {space.name}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className='flex items-center space-x-2'>
        {space && (
          <ArrowLeftIcon
            className='cursor-pointer'
            onClick={() => {
              if (space?.parent) navigate(`/admin/spaces/${space.parent}`)
              else navigate('/admin/spaces')
            }}
          />
        )}
        <h1 className='text-2xl font-semibold'>{space?.name || t('application.admin.overview')}</h1>
      </div>
    </header>
  )
}
