import React, { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'

import { GetBookingsResult, getBookingsRequest, getSpaceChildrenWithStatusRequest } from '../../api'
import { FavoriteOnboardingMessage, NoBookingsAfterSearchMessage, NoBookingsMessage } from '../../components/Meetup'
import { OccupationCard } from '../../components/Occupation'
import { MeetupSkeleton } from '../../components/Skeletons'
import { useMeetupFiltersState } from '../../hooks'
import { meetupBaseDateState, meetupRootSpacesState } from '../../store'
import { SpaceKind } from '../../types'
import { toKey } from '../../utilities'
import { compare } from '../../utilities/booking'
import { bookingMatchesQuery, sortSpaces } from './utilities'

export const DailyScreen = () => {
  const date = useRecoilValue(meetupBaseDateState)
  const formattedDate = toKey(date)
  const { searchQuery, favoriteFilter } = useMeetupFiltersState()
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

  let countOfBookings = 0
  rootSpaces[formattedDate]?.forEach(space => {
    countOfBookings += space.status?.occupation ?? 0
  })

  let content = <MeetupSkeleton />

  if (!isLoaded) content = <MeetupSkeleton />
  else if (countOfBookings === 0) content = <NoBookingsMessage />
  else {
    if (favoriteFilter === null) content = <FavoriteOnboardingMessage />
    else if (searchBookings.length === 0) {
      if (favoriteFilter) content = <FavoriteOnboardingMessage />
      else content = <NoBookingsAfterSearchMessage />
    } else {
      content = (
        <ul className='w-full flex flex-col space-y-10'>
          {rootSpaces[formattedDate].map(space => {
            const bookingsWithRootSpace = searchBookings.filter(booking => booking.space.rootPath?.[0].id === space.id)

            if (bookingsWithRootSpace.length === 0) return

            return (
              <li className='flex flex-col space-y-4 md:space-y-6' key={space.id}>
                <span className='font-semibold text-h4'>{space.name}</span>
                <ul className='grid grid-cols-1 md:grid-cols-2 gap-2'>
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
      )
    }
  }

  return content
}
