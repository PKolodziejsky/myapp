import { Modal, SuccessAnimation } from '@seatti-tech/lithium'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Message } from './Message'

export type BookingDeletedSuccessfullyMessageProps = {
  onClose: () => void
}

export const BookingDeletedSuccessfullyMessage = ({ onClose }: BookingDeletedSuccessfullyMessageProps) => {
  const { t } = useTranslation()

  return (
    <div className='relative inline-block'>
      <Modal open={true} onClose={onClose}>
        <Message animation={<SuccessAnimation />} header={t('application.planning.booking-deleted')} messageType='success' />
      </Modal>
    </div>
  )
}
