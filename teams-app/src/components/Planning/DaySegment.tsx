import { AllocationsEditSection } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React from 'react'
import { useRecoilValue } from 'recoil'

import { useBookingPermission } from '../../hooks'
import { SubmissionScreenFactory } from '../../screens/SubmissionScreen/SubmissionScreenFactory'
import { openBookingsState, useCreateOpenBooking } from '../../store'
import { SpaceKind } from '../../types'
import { dayHasPassed, toKey } from '../../utilities'
import { BookingList } from '../BookingList'
import { AddButton } from './AddButton'

interface DaySegmentProps {
  date: Date
}

export const DaySegment = ({ date }: DaySegmentProps) => {
  const allowBooking = useBookingPermission(date)

  const dateKey = toKey(date)
  const { [dateKey]: booking } = useRecoilValue(openBookingsState)

  const isPast = dayHasPassed(date)

  const createOpenBooking = useCreateOpenBooking(dateKey)

  return (
    <AllocationsEditSection
      active={booking !== undefined}
      title={dayjs(date).format('ddd, D')}
      addOn={
        !isPast ? (
          <AddButton
            disabled={!allowBooking}
            onClick={() => createOpenBooking({ data: { date: dateKey }, spaceKind: SpaceKind.WORKSPACE })}
          />
        ) : undefined
      }
    >
      {booking ? <SubmissionScreenFactory date={date} /> : <BookingList date={date} />}
    </AllocationsEditSection>
  )
}
