import { AllocationsToggleSection } from '@seatti-tech/lithium'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState } from 'recoil'

import { GetBookingsResult, getBookingsRequest, getSpaceChildrenWithStatusRequest } from '../../api'
import { useMeetupFiltersState } from '../../hooks'
import { bookingMatchesQuery, sortSpaces } from '../../screens/Meetup/utilities'
import { meetupRootSpacesState } from '../../store'
import { SpaceKind } from '../../types'
import { toKey } from '../../utilities'
import { compare } from '../../utilities/booking'
import { OccupationCard } from '../Occupation'

type DaySegmentProps = {
  date: Date
}

export const DaySegment = ({ date }: DaySegmentProps) => {
  const formattedDate = toKey(date)
  const { searchQuery } = useMeetupFiltersState()
  const [rootSpaces, setRootSpaces] = useRecoilState(meetupRootSpacesState)

  const { data: { bookings = [] } = {}, isSuccess: bookingsAreLoaded } = useQuery<GetBookingsResult>(['bookings', formattedDate], () =>
    getBookingsRequest({
      from: formattedDate,
      to: formattedDate,
      includeFilters: true,
    }),
  )

  const { data: { spaceChildren: spaces = [] } = {}, isSuccess: spacesAreLoaded } = useQuery(
    ['spaceChildren', SpaceKind.WORKSPACE, null, date],
    () => getSpaceChildrenWithStatusRequest({ id: null, date: formattedDate }),
  )

  const isLoaded = bookingsAreLoaded && spacesAreLoaded

  useEffect(() => {
    if (!isLoaded) return
    setRootSpaces(rootSpaces => ({
      ...rootSpaces,
      [formattedDate]: sortSpaces(spaces, bookings),
    }))
  }, [setRootSpaces, formattedDate, spaces, bookings, isLoaded])

  const searchBookings = bookings.filter(booking => bookingMatchesQuery(booking, searchQuery ?? ''))

  searchBookings.sort(compare)

  return (
    <AllocationsToggleSection title={dayjs(date).format('ddd, D')}>
      {rootSpaces[formattedDate]?.length > 0 && searchBookings.length > 0 && (
        <ul className='flex flex-col space-y-8'>
          {rootSpaces[formattedDate].map(space => {
            const bookingsWithRootSpace = searchBookings.filter(booking => booking.space.rootPath?.[0].id === space.id)

            if (bookingsWithRootSpace.length === 0) return

            return (
              <li className='flex flex-col space-y-6' key={space.id}>
                <span className='font-semibold text-h4'>{space.name}</span>
                <ul className='grid md:grid-cols-2 gap-2'>
                  {searchBookings.map(booking => {
                    if (booking.space.rootPath?.[0].id !== space.id) return

                    return (
                      <li key={booking.id}>
                        <OccupationCard booking={booking} />
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      )}
    </AllocationsToggleSection>
  )
}
