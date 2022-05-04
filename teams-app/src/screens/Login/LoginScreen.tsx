import { Button } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import logo from '../../assets/seatti-logo-round.png'
import { useApplicationEnvironment } from '../../hooks'
import { browserLogin } from '../../utilities/auth'

// TODO Design Screen
// TODO Version number dynamic
// TODO Seatti app link from ENV
export const LoginScreen = () => {
  const environment = useApplicationEnvironment()
  const { t } = useTranslation()

  const onClick = () => {
    window.open('https://my.seatti.co', '_blank')
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center px-4 md:px-0 space-y-6'>
      <img src={logo} className='rounded-full w-32 h-32' alt='Seatti logo' />
      <div className='flex flex-col space-y-2 items-center'>
        <h1 className='text-h1 font-bold'>{t('application.guards.auth.title')}</h1>
        {environment === 'teams' && (
          <span className='text-base text-center'>
            {t('application.guards.auth.action')}{' '}
            <button
              className='text-purple-600 dark:text-purple-400 transition hover:text-pink-600 dark:hover:text-pink-300'
              onClick={onClick}
            >
              {t('application.guards.auth.action-link')}
            </button>
          </span>
        )}
        <span className='text-xxs text-grey-600'>v2.0.0</span>
      </div>
      <Button onClick={() => browserLogin()}>Login</Button>
    </div>
  )
}
