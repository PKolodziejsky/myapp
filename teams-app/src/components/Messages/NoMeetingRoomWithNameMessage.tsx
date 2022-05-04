import React from 'react'
import { useTranslation } from 'react-i18next'

import { SearchAnimation } from './Animations/SearchAnimation'
import { Message } from './Message'

export const NoMeetingRoomWithNameMessage = () => {
  const { t } = useTranslation()

  return (
    <Message
      animation={<SearchAnimation />}
      header={t('application.meeting.no-meeting-room-with-name')}
      subheader={t('application.meeting.check-search')}
    />
  )
}
