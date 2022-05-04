import { Button, SkeletonBookingCard } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useRecoilValue } from 'recoil'

import { getPersonalBookingsRequest } from '../../api'
import { useBookingPermission } from '../../hooks'
import { planningDatesViewState, useCreateOpenBooking } from '../../store'
import { SpaceKind } from '../../types'
import { dayHasPassed, toKey } from '../../utilities'
import { ErrorToast } from '../Toast'
import { NoBookingsMessage } from './NoBookingsMessage'
import { WorkspaceBookingList } from './WorkspaceBookingList'

const COUNT_OF_PLACEHOLDER_CARDS = 3

interface BookingListSkeletonProps {
  count?: number
  className?: string
}

export const BookingListSkeleton = ({ count, className }: BookingListSkeletonProps) => (
  <ul className={classNames('w-full flex flex-col items-center space-y-2 md:space-y-4', className)}>
    {Array.from(Array(count ?? COUNT_OF_PLACEHOLDER_CARDS).keys()).map(i => (
      <li className='w-full' key={i}>
        <SkeletonBookingCard />
      </li>
    ))}
  </ul>
)

enum State {
  INIT,
  NO_BOOKING,
  HAS_BOOKING,
}

interface BookingListProps {
  date: Date
  className?: string
}

export const BookingList = ({ date, className }: BookingListProps) => {
  const { t } = useTranslation()

  const dateKey = toKey(date)
  const isPast = dayHasPassed(date)

  const view = useRecoilValue(planningDatesViewState)
  const isDailyView = view === 'daily'

  const allowBooking = useBookingPermission(date)

  const [state, setState] = useState<State>(State.INIT)

  const {
    data: { bookings = [] } = {},
    refetch,
    isLoading: isLoadingPersonalBookings,
  } = useQuery(['personalBookings', date], () => getPersonalBookingsRequest({ from: dateKey, to: dateKey }), {
    onError: () => {
      toast.custom(<ErrorToast onRetry={refetch}>{t('application.planning.loading-bookings-error')}</ErrorToast>, {
        id: 'CANNOT_LOAD_BOOKINGS',
      })
    },
  })

  // const { data: { meetingRoomBookings = [] } = {}, isLoading: isLoadingMeetingRoomBookings } = useQuery(['meetingRoomBookings', date], () =>
  //   getMeetingRoomBookingsRequest({ input: { date: dateKey } }),
  // )

  const isLoading = isLoadingPersonalBookings

  useEffect(() => {
    if (!isLoading) {
      if (bookings.length > 0) setState(State.HAS_BOOKING)
      else setState(State.NO_BOOKING)
    }
  }, [isLoading, bookings])

  const createOpenBooking = useCreateOpenBooking(dateKey)

  const AddBookingButton = () => (
    <Button disabled={!allowBooking} onClick={() => createOpenBooking({ data: { date: dateKey }, spaceKind: SpaceKind.WORKSPACE })}>
      {t('application.planning.add-booking')}
    </Button>
  )

  const List = () => (
    <div className='w-full flex flex-col items-center space-y-2 md:space-y-4'>
      {bookings && <WorkspaceBookingList date={date} bookings={bookings} className={className} />}
      {/* {meetingRoomBookings && <MeetingRoomBookingList bookings={meetingRoomBookings} className={className} />} */}
    </div>
  )

  let content
  switch (state) {
    case State.HAS_BOOKING:
      content = (
        <>
          {!isPast && isDailyView && <AddBookingButton />}
          <List />
        </>
      )
      break
    case State.NO_BOOKING:
      content = (
        <>
          {isDailyView && <NoBookingsMessage />}
          {!isPast && isDailyView && <AddBookingButton />}
        </>
      )
      break
    default:
      content = null
  }

  return isLoading ? isDailyView ? <BookingListSkeleton className={className} /> : null : content
}
