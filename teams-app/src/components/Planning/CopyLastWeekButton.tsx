import { Button } from '@seatti-tech/lithium'
import classNames from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'

import { createBookingRequest } from '../../api'
import { toBookingInput } from '../../api/utils/bookings'
import { useBookableDates } from '../../hooks'
import { copyBookingFromPast, queryClient } from '../../request'
import { useCreateOpenBookingByDate } from '../../store'
import { planningDateRangeState } from '../../store/selectors'
import { Booking, SpaceKind } from '../../types'
import { DAYS_IN_WEEK, toKey } from '../../utilities'

type CopyLastWeekButtonProps = {
  className?: string
}

export const CopyLastWeekButton = ({ className }: CopyLastWeekButtonProps) => {
  const { t } = useTranslation()

  const dates = useRecoilValue(planningDateRangeState)

  const createOpenBooking = useCreateOpenBookingByDate()

  const bookableDates = useBookableDates(dates)

  const submitBooking = ({ date, ...booking }: Booking) => {
    const bookingInput = toBookingInput({ date, ...booking })

    queryClient.executeMutation({
      mutationFn: () => createBookingRequest({ bookingInput }),
      mutationKey: ['addBooking', date],
      onError: () =>
        createOpenBooking(date, { data: booking, spaceKind: SpaceKind.WORKSPACE, context: { rootSpace: booking.space.rootPath?.[0] } }),
      onSettled: () => {
        queryClient.invalidateQueries(['personalBookings'])
        queryClient.invalidateQueries(['bookingStats'])
      },
    })
  }

  const copyLastWeek = () => {
    bookableDates.forEach(date => {
      copyBookingFromPast(date, DAYS_IN_WEEK).then(({ bookings }) => {
        const booking = bookings.pop()
        if (booking) submitBooking({ ...booking, date: toKey(date) })
      })
    })
  }

  return (
    <Button className={classNames('w-fit', className)} onClick={copyLastWeek}>
      {t('application.planning.copy-last-week')}
    </Button>
  )
}
