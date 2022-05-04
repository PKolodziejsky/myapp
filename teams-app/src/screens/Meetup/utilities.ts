import { Team } from '@microsoft/microsoft-graph-types'

import { Booking, Space } from '../../types'

export const compareSpaceByOccupation = (firstSpace: Space, secondSpace: Space) => {
  if (!firstSpace?.status || !secondSpace?.status) return 0
  return secondSpace.status.occupation - firstSpace.status.occupation
}

export const bookingMatchesQuery = (booking: Booking, query: string) => {
  const trimmedQuery = query.trim()
  if (trimmedQuery === '') return true

  const queryIsIncludedIn = (str: string) => str.toLowerCase().includes(trimmedQuery.toLowerCase())

  let matchesPersonName = false
  if (booking.user?.person?.displayName) matchesPersonName = queryIsIncludedIn(booking.user.person.displayName)

  let matchesSpaceName = false
  if (booking.space.name) {
    booking.space.rootPath?.forEach(space => {
      if (queryIsIncludedIn(space.name)) matchesSpaceName = true
    })
  }

  let matchesDepartment = false
  if (booking.user?.person?.department) matchesDepartment = queryIsIncludedIn(booking.user.person.department)

  let matchesJob = false
  if (booking.user?.person?.jobTitle) matchesJob = queryIsIncludedIn(booking.user.person.jobTitle)

  let matchesNote = false
  if (booking?.note) matchesNote = queryIsIncludedIn(booking.note)

  return matchesPersonName || matchesSpaceName || matchesDepartment || matchesJob || matchesNote
}

export const teamMatchesQuery = (team: Team, query: string) => {
  if (!team.displayName) return false

  const trimmedQuery = query.trim()
  if (trimmedQuery === '') return true

  return team.displayName.toLowerCase().includes(trimmedQuery.toLowerCase())
}

export const sortSpaces = (spaces: Space[], bookings: Booking[]) => {
  if (spaces.length === 0) return []
  if (bookings.length === 0) return [...spaces].sort(compareSpaceByOccupation)

  const filterByFavorite = (booking: Booking, space: Space) => booking.space.rootPath?.[0].id === space.id && booking.user?.isFavorite

  return [...spaces].sort((firstSpace, secondSpace) => {
    const firstSpaceFavoriteCount = bookings.filter(booking => filterByFavorite(booking, firstSpace)).length

    const secondSpaceFavoriteCount = bookings.filter(booking => filterByFavorite(booking, secondSpace)).length

    if (firstSpaceFavoriteCount !== secondSpaceFavoriteCount) return secondSpaceFavoriteCount - firstSpaceFavoriteCount

    return compareSpaceByOccupation(firstSpace, secondSpace)
  })
}

export const MAX_SPACE_NAME_LENGTH = 15

export const truncateSpaceName = (space: Space) => {
  if (space.name.length <= MAX_SPACE_NAME_LENGTH) return space.name
  const regex = new RegExp(`^(.{${MAX_SPACE_NAME_LENGTH}}[^\\s]*).*`)
  return `${space.name.replace(regex, '$1')}...`
}

export const getTruncatedSpaceNameLength = (space: Space) => {
  return space.name.length <= MAX_SPACE_NAME_LENGTH ? space.name.length : MAX_SPACE_NAME_LENGTH
}
