import React from 'react'
import { useTranslation } from 'react-i18next'

import { MeetingAnimation } from './Animations/MeetingAnimation'
import { Message } from './Message'

export const NoSuggestedMeetingRoomsMessage = () => {
  const { t } = useTranslation()

  return (
    <Message
      animation={<MeetingAnimation />}
      header={t('application.meeting.no-suggested-meeting-rooms')}
      subheader={t('application.meeting.choose-preferences')}
    />
  )
}
