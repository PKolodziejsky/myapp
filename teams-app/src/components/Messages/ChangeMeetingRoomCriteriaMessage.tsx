import React from 'react'
import { useTranslation } from 'react-i18next'

import { MeetingAnimation } from './Animations/MeetingAnimation'
import { Message } from './Message'

export type ChangeMeetingRoomCriteriaMessageProps = {
  capacity: number
}

export const ChangeMeetingRoomCriteriaMessage = ({ capacity }: ChangeMeetingRoomCriteriaMessageProps) => {
  const { t } = useTranslation()

  return (
    <Message
      animation={<MeetingAnimation />}
      header={t('application.meeting.no-meeting-rooms-fit', { capacity })}
      subheader={t('application.meeting.change-criteria')}
    />
  )
}
