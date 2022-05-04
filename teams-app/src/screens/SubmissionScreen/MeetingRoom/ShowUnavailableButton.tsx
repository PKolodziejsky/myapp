import { Toggle } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilState } from 'recoil'

import { meetingRoomFiltersState } from '../../../store'

interface ShowUnavailableButtonProps {
  className?: string
}

export const ShowUnavailableButton = ({ className }: ShowUnavailableButtonProps) => {
  const { t } = useTranslation()

  const [{ includeUnavailable }, setFilters] = useRecoilState(meetingRoomFiltersState)

  const onClick = useCallback(
    () =>
      setFilters(filters => ({
        ...filters,
        includeUnavailable: !filters.includeUnavailable,
      })),
    [setFilters],
  )

  return (
    <div className={classNames('flex justify-between space-x-4 cursor-pointer', className)} onClick={onClick}>
      <span>{t('application.meeting.show-unavailable-rooms')}</span>
      <Toggle checked={includeUnavailable} />
    </div>
  )
}
