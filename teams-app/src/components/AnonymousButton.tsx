import { EyeOpenIcon, IncognitoIcon, Toggle } from '@seatti-tech/lithium'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface AnonymousButtonProps {
  className?: string
  defaultChecked?: boolean
  onChange?: (isAnonymous: boolean) => void
}

export const AnonymousButton = ({ className, onChange, defaultChecked }: AnonymousButtonProps) => {
  const [checked, setChecked] = useState<boolean>(defaultChecked ?? false)
  const { t } = useTranslation()
  const toggle = () => {
    setChecked(!checked)
    if (onChange) onChange(!checked)
  }
  return (
    <section className={`flex justify-between space-x-4 cursor-pointer ${className}`} onClick={toggle}>
      <div className='flex space-x-2 items-center'>
        {checked ? <IncognitoIcon /> : <EyeOpenIcon />}
        <span>{t('application.planning.anonymous-booking')}</span>
      </div>
      <Toggle checked={checked} />
    </section>
  )
}
