import { ConfirmationAnimation, ModalController } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Message } from './Message'

export type DeleteBookingConfirmationMessageProps = {
  selector: (onDismiss: () => void) => void
  onConfirm: () => void
  className?: string
}

export const DeleteBookingConfirmationMessage = ({ selector, onConfirm, className }: DeleteBookingConfirmationMessageProps) => {
  const { t } = useTranslation()

  return (
    <ModalController selector={selector} className={className}>
      {toggle => (
        <Message
          animation={<ConfirmationAnimation />}
          header={t('application.planning.do-you-want-to-delete-booking')}
          subheader={t('application.planning.if-delete-booking-cannot-undo')}
          submitButtonLabel={t('application.planning.yes-delete')}
          cancelButtonLabel={t('application.planning.keep-it')}
          onSubmit={onConfirm}
          onCancel={toggle}
        />
      )}
    </ModalController>
  )
}
