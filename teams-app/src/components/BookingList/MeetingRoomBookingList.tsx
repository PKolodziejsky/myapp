import { BookingCard } from '@seatti-tech/lithium'
import classNames from 'classnames'
import dayjs from 'dayjs'
import React from 'react'

import { MeetingRoomBooking } from '../../types'
import { TIME_FORMAT, toBrowserTimezone } from '../../utilities'
import { getEquipmentIconList } from '../MeetingRoom'

interface ItemProps {
  booking: MeetingRoomBooking
}

const Item = ({ booking }: ItemProps) => {
  const { name, rootPath, capacity } = booking.room

  const start = booking.dateTimeRange.start
  const end = booking.dateTimeRange.end

  const localStartTime = toBrowserTimezone(start.dateTime, start.timeZone)
  const localEndTime = toBrowserTimezone(end.dateTime, end.timeZone)

  return (
    <li className='w-full' key={`${name}_${start.dateTime}_${end.dateTime}`}>
      <BookingCard
        kind='meetingRoom'
        name={name}
        spaces={rootPath.map(space => space.name)}
        capacity={capacity}
        timeslot={`${dayjs(localStartTime).format(TIME_FORMAT)} - ${dayjs(localEndTime).format(TIME_FORMAT)}`}
        equipments={getEquipmentIconList(booking.room)}
      />
    </li>
  )
}

interface MeetingRoomBookingListProps {
  bookings: MeetingRoomBooking[]
  className?: string
}

export const MeetingRoomBookingList = ({ bookings, className }: MeetingRoomBookingListProps) => (
  <ul className={classNames('w-full flex flex-col space-y-2 md:space-y-4 items-center', className)}>
    {bookings.map(booking => (
      <Item booking={booking} />
    ))}
  </ul>
)
