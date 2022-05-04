import dayjs from 'dayjs'

import { getBookingsFromPastRequest } from '../api'
import { queryClient } from '../request'
import { toKey } from '../utilities'

export const copyBookingFromPast = (date: Date, deltaInDays: number) => {
  const pastDate = dayjs(date).subtract(deltaInDays, 'day').toDate()
  const from = toKey(pastDate)
  const to = from

  return queryClient.fetchQuery({
    queryFn: () => getBookingsFromPastRequest({ from, to, date: toKey(date) }),
    queryKey: ['copyBookingFromPast', from, to],
  })
}
