import { Input, InputProps, OnBehalfUserIcon } from '@seatti-tech/lithium'
import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

export const GuestInfoInput = forwardRef<HTMLInputElement, InputProps>(({ className, value, ...props }, ref) => {
  const { t } = useTranslation()

  return (
    <Input
      ref={ref}
      iconStart={<OnBehalfUserIcon />}
      value={value}
      placeholder={t('application.planning.enter-name')}
      variant={value === '' ? 'error' : undefined}
      errorMessage={value === '' ? t('application.planning.empty-guest-booking') : undefined}
      {...props}
    />
  )
})
