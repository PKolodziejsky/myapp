import { FailAnimation } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useCustomerSupport } from '../../hooks'
import { Message } from './Message'

export type BookingFailedMessageProps = {
  onBack: () => void
  className?: string
}

export const BookingFailedMessage = ({ onBack, className }: BookingFailedMessageProps) => {
  const { t } = useTranslation()
  const navigateToSupport = useCustomerSupport()

  return (
    <Message
      animation={<FailAnimation />}
      header={t('application.planning.oops')}
      subheader={t('application.planning.something-wrong-try-again')}
      submitButtonLabel={t('application.planning.try-again')}
      cancelButtonLabel={t('application.planning.get-support')}
      onSubmit={onBack}
      onCancel={navigateToSupport}
      buttonAlignment={'vertical'}
      messageType='error'
      className={className}
    />
  )
}
