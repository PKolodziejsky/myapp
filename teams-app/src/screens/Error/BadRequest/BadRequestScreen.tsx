import { Button, FailAnimation } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useCustomerSupport } from '../../../hooks'

export const BadRequestScreen = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const navigateToSupport = useCustomerSupport()

  return (
    <main className='w-full md:w-[780px] md:mx-auto min-h-screen px-4 md:px-0 py-2 md:py-10 mx-auto md:space-y-10 flex flex-col space-y-8 items-center justify-center'>
      <FailAnimation />
      <div className='flex flex-col space-y-2 items-center text-center'>
        <h1 className='font-semibold text-h3'>{t('application.planning.oops')}</h1>
        <p className='text-base text-grey-600'>{t('application.planning.something-wrong-try-again')}</p>
      </div>
      <div className='flex flex-col space-y-2 items-center'>
        <Button onClick={() => navigate('/')}>{t('application.common.back-to-home')}</Button>
        <Button variant='secondary' onClick={navigateToSupport}>
          {t('application.planning.get-support')}
        </Button>
      </div>
    </main>
  )
}
