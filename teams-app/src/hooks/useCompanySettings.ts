import { useQuery } from 'react-query'

import { getCompanySettingsRequest } from '../api'
import { futureTimePeriodToDate, pastTimePeriodToDate } from '../utilities'

export const DEFAULT_ADVANCE_BOOKING_DAYS = 14
export const DEFAULT_LAST_ADVANCE_BOOKING_DATE = futureTimePeriodToDate({
  value: DEFAULT_ADVANCE_BOOKING_DAYS,
  unit: 'day',
})

export const DEFAULT_PAST_VISIBILITY_DAYS = 14
export const DEFAULT_FUTURE_VISIBILITY_DAYS = 14

export const DEFAULT_PAST_VISIBILITY_DATE = pastTimePeriodToDate({
  value: DEFAULT_PAST_VISIBILITY_DAYS,
  unit: 'day',
})

export const DEFAULT_FUTURE_VISIBILITY_DATE = futureTimePeriodToDate({
  value: DEFAULT_FUTURE_VISIBILITY_DAYS,
  unit: 'day',
})

export const useCompanySettings = () => {
  const { data: settings } = useQuery(['getCompanySettings'], getCompanySettingsRequest, {
    select: ({ company }) => company.settings,
  })

  return settings
}

export const useBookingRestrictions = () => {
  const settings = useCompanySettings()

  const future = settings?.booking?.restrictions?.defaults?.future
  const past = settings?.booking?.restrictions?.defaults?.past

  return {
    range: {
      start: past ? pastTimePeriodToDate(past) : undefined,
      end: future ? futureTimePeriodToDate(future) : DEFAULT_LAST_ADVANCE_BOOKING_DATE,
    },
    maxGuestBookings: settings?.booking?.restrictions?.maxGuestBookings,
  }
}

export const useVisibilityRestrictions = () => {
  const settings = useCompanySettings()

  const future = settings?.visibility?.restrictions?.defaults?.future
  const past = settings?.visibility?.restrictions?.defaults?.past

  return {
    range: {
      start: past ? pastTimePeriodToDate(past) : DEFAULT_PAST_VISIBILITY_DATE,
      end: future ? futureTimePeriodToDate(future) : DEFAULT_FUTURE_VISIBILITY_DATE,
    },
  }
}
