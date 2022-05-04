import { SuccessAnimation } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Message } from './Message'

interface BookingSuccessfulMessageProps {
  className?: string
}

export const BookingSuccessfulMessage = ({ className }: BookingSuccessfulMessageProps) => {
  const { t } = useTranslation()

  return (
    <Message
      animation={<SuccessAnimation />}
      header={t('application.planning.booking-confirmed')}
      messageType='success'
      className={className}
    />
  )
}
