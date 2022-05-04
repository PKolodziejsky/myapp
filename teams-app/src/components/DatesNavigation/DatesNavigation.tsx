import { DatesNavigation, DatesNavigationInterval } from '@seatti-tech/lithium'
import { DatesNavigationDates, DatesNavigationDatesAllocations } from '@seatti-tech/lithium/dist/DatesNavigation/DatesNavigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { getBookingStatsRequest } from '../../api'
import { useLocale } from '../../hooks'
import { toKey } from '../../utilities'
import { formatWeekLabelForDatesNavigation } from './formatWeeks'

const STALE_TIME = 1000 * 60
const CACHE_TIME = 1000 * 60

interface DateRange {
  from: string
  to: string
}

interface SelectedDates {
  key: string
  dates: DateRange[]
}

const transformAllocations = (bookingStats: any) => bookingStats.ranges.map((data: any) => (data ? data.count : 0))

interface DatesNavigationProps {
  view: DatesNavigationInterval
  selectedDate: Date
  onSelectDate: (date: Date) => void
  minDate?: Date
  maxDate?: Date
}

export const DatesNavigationWithAllocations = ({ view, selectedDate, onSelectDate, minDate, maxDate }: DatesNavigationProps) => {
  const [locale] = useLocale()
  const [selectedDates, setSelectedDates] = useState<SelectedDates[]>([])
  const [allocations, setAllocations] = useState<DatesNavigationDatesAllocations>({})

  const [mainDates, optionalDates] = selectedDates

  // Query visible range
  const { data: mainData } = useQuery(
    ['bookingStats', mainDates?.key],
    () => getBookingStatsRequest({ onlyOwnBookings: true, ranges: mainDates.dates }),
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      enabled: mainDates != null,
    },
  )

  useEffect(() => {
    if (mainData) {
      setAllocations(allocations => ({
        ...allocations,
        [mainDates.key]: transformAllocations(mainData.bookingStats),
      }))
    }
  }, [mainData])

  // Query for additional range if slider is moved between ranges
  const { data: optionalData } = useQuery(
    ['bookingStats', optionalDates?.key],
    () => getBookingStatsRequest({ onlyOwnBookings: true, ranges: optionalDates.dates }),
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      enabled: optionalDates != null,
    },
  )

  useEffect(() => {
    if (optionalData) {
      setAllocations(allocations => ({
        ...allocations,
        [optionalDates.key]: transformAllocations(optionalData.bookingStats),
      }))
    }
  }, [optionalData])

  const onChangeDates = useCallback((dates: DatesNavigationDates) => {
    // Remove invisible allocations by removing it from existing object and don't force a rerender
    setAllocations(allocations => {
      const nextAllocations: DatesNavigationDatesAllocations = {
        ...allocations,
      }

      for (const key in dates) {
        if (!(key in allocations)) {
          nextAllocations[key] = dates[key].map(() => null)
        }
      }

      return nextAllocations
    })

    const formattedDates = Object.entries(dates).map(([key, dates]) => ({
      key,
      dates: dates.map(({ start, end }) => ({
        from: toKey(start),
        to: toKey(end),
      })),
    }))

    setSelectedDates(formattedDates)
  }, [])

  return (
    <DatesNavigation
      key={locale} // Rerender on locale change
      view={view}
      selectedDate={selectedDate}
      allocations={allocations}
      onDatesChange={onChangeDates}
      onSelectDate={onSelectDate}
      formatWeek={week => formatWeekLabelForDatesNavigation(week, locale)}
      minDate={minDate}
      maxDate={maxDate}
    />
  )
}
