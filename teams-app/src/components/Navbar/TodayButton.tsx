import { Button } from '@seatti-tech/lithium'
import React, { ButtonHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

export const TodayButton = (props: ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
  const { t } = useTranslation()
  return (
    <>
      <Button className='hidden md:block' variant='secondary' {...props}>
        {t('application.navbar.today')}
      </Button>
      <button className='md:hidden text-purple-600 dark:text-purple-400 font-semibold' {...props}>
        {t('application.navbar.today')}
      </button>
    </>
  )
}
