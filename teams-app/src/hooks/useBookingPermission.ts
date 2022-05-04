import { useQuery } from 'react-query'

import { getPersonalBookingsRequest, getSpaceChildrenRequest } from '../api'
import { Booking, SpaceKind } from '../types'
import { dayInRange, toKey } from '../utilities'
import { useBookingRestrictions } from './useCompanySettings'

const DEFAULT_MAX_GUEST_BOOKINGS = Infinity

export const useHasPersonalBooking = (date: Date) => {
  const { data: { bookings = [] } = {} } = useQuery(['personalBookings', date], () =>
    getPersonalBookingsRequest({ from: toKey(date), to: toKey(date) }),
  )

  return bookings.find(booking => !booking.guestInfo) !== undefined
}

export const useHasEnoughGuestBookings = (date: Date) => {
  const { maxGuestBookings = DEFAULT_MAX_GUEST_BOOKINGS } = useBookingRestrictions()
  const { data: { bookings = [] } = {} } = useQuery(['personalBookings', date], () =>
    getPersonalBookingsRequest({ from: toKey(date), to: toKey(date) }),
  )

  return maxGuestBookings ? bookings.filter(booking => booking.guestInfo).length >= maxGuestBookings : false
}

export const useBookingPermission = (date: Date) => {
  const { range: bookingRange } = useBookingRestrictions()
  const hasPersonalBooking = useHasPersonalBooking(date)
  const hasEnoughGuestBookings = useHasEnoughGuestBookings(date)

  return dayInRange(date, bookingRange) && (!hasPersonalBooking || !hasEnoughGuestBookings)
}

export const useBookableDates = (dates: Date[]) => {
  const { range: bookingRange } = useBookingRestrictions()
  const datesInRange = dates.filter(date => dayInRange(date, bookingRange))

  const from = datesInRange[0]
  const to = datesInRange[datesInRange.length - 1]

  const { data: datesWithBooking = [] } = useQuery(
    ['personalBookings', dates],
    () => getPersonalBookingsRequest({ from: toKey(from), to: toKey(to) }),
    {
      select: ({ bookings = [] }) => bookings.map((booking: Booking) => booking.date),
    },
  )

  const bookableDates = datesInRange.filter(date => !datesWithBooking.includes(toKey(date)))

  return bookableDates
}

export const useHasMeetingRooms = (spaceId?: string) => {
  const { data: { spaceChildren = [] } = {} } = useQuery(['spaceChildren', SpaceKind.MEETING_ROOM, spaceId], () =>
    getSpaceChildrenRequest({ id: spaceId, onlyWithMeetingRoomsAsChildren: true }),
  )

  return spaceChildren.length > 0
}
