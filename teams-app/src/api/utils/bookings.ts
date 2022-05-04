import { Booking } from '../../types'

export const toBookingInput = (booking: Booking) => {
  const { id, user, space, ...bookingInput } = booking

  return {
    ...bookingInput,
    spaceId: space?.id ?? '',
  }
}
