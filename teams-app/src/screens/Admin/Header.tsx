import { ArrowLeftIcon, EditIcon, MeetupIcon } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { BurgerMenu, LinkButton } from '../../components/Navbar'

export const Header = () => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <nav className='w-full flex items-center justify-between pl-4 md:pl-0'>
      <LinkButton to='/' iconStart={<ArrowLeftIcon />}>
        {t('application.common.back-to-home')}
      </LinkButton>
      <ul className='flex items-center'>
        {location.pathname.includes('users') ? (
          <li>
            <LinkButton to='/admin/spaces' iconEnd={<EditIcon />}>
              {t('application.nav-bar.menu.spaces-tab')}
            </LinkButton>
          </li>
        ) : (
          <li>
            <LinkButton to='/admin/users' iconEnd={<MeetupIcon />}>
              {t('application.nav-bar.menu.users-tab')}
            </LinkButton>
          </li>
        )}
        <li>
          <BurgerMenu />
        </li>
      </ul>
    </nav>
  )
}
