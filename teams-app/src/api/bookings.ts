import { gql } from 'graphql-request'

import { graphClient } from '../request'
import { Booking } from '../types'

export const BOOKINGS_QUERY = gql`
  query GetBookings($from: String!, $to: String!, $includeFilters: Boolean) {
    bookings(from: $from, to: $to, includeFilters: $includeFilters) {
      id
      date
      note
      isAnonymous
      guestInfo
      user {
        id
        isFavorite
        person {
          id
          displayName
          jobTitle
          profileImage
          department
        }
      }
      space {
        id
        name
        rootPath {
          name
          id
        }
      }
    }
  }
`

interface GetBookingsParameters {
  from: string
  to: string
  includeFilters?: boolean
}

export type GetBookingsResult = {
  [key: string]: Booking[]
}

export const getBookingsRequest = (parameters: GetBookingsParameters) => {
  return graphClient.request(BOOKINGS_QUERY, parameters)
}

export const PERSONAL_BOOKINGS_QUERY = gql`
  query GetPersonalBookings($from: String!, $to: String!) {
    bookings(from: $from, to: $to, onlyOwnBookings: true) {
      id
      date
      note
      guestInfo
      space {
        id
        name
        canHaveNote
        rootPath {
          id
          name
          disabled
          isAccessible
        }
      }
      isAnonymous
    }
  }
`

interface GetPersonalBookingsRequestParameters {
  from: string
  to: string
}

export const getPersonalBookingsRequest = (parameters: GetPersonalBookingsRequestParameters): Promise<GetBookingsResult> => {
  return graphClient.request(PERSONAL_BOOKINGS_QUERY, parameters)
}

export const GET_BOOKINGS_FROM_PAST_QUERY = gql`
  query GetBookingsFromPast($from: String!, $to: String!, $date: String!) {
    bookings(onlyOwnBookings: true, from: $from, to: $to) {
      id
      date
      note
      space {
        id
        status(date: $date) {
          date
          occupation
        }
      }
      isAnonymous
    }
  }
`

interface GetBookingsFromPastRequestParameters {
  from: string
  to: string
  date: string
}

export interface GetBookingsFromPastResult {
  [key: string]: Booking[]
}

export const getBookingsFromPastRequest = (parameters: GetBookingsFromPastRequestParameters): Promise<GetBookingsFromPastResult> => {
  return graphClient.request(GET_BOOKINGS_FROM_PAST_QUERY, parameters)
}

type BookingInput = Omit<Booking, 'id' | 'user' | 'space'> & { spaceId: string }

interface CreateBookingRequestParameters {
  bookingInput: BookingInput
}

interface CreateBookingRequestResult {
  [key: string]: Booking
}

export const CREATE_BOOKING_QUERY = gql`
  mutation addBooking($bookingInput: AddBookingInputType!) {
    addBooking(bookingInput: $bookingInput) {
      date
      space {
        id
      }
      note
      isAnonymous
      guestInfo
    }
  }
`

export const createBookingRequest = (parameters: CreateBookingRequestParameters): Promise<CreateBookingRequestResult> => {
  return graphClient.request(CREATE_BOOKING_QUERY, parameters)
}

interface UpdateBookingRequestParameters {
  id: string
  bookingInput: BookingInput
}

interface UpdateBookingRequestResult {
  [key: string]: Booking
}

export const UPDATE_BOOKING_QUERY = gql`
  mutation updateBooking($id: String!, $bookingInput: UpdateBookingInputType!) {
    updateBooking(id: $id, bookingInput: $bookingInput) {
      id
      date
      space {
        id
      }
    }
  }
`

export const updateBookingRequest = (parameters: UpdateBookingRequestParameters): Promise<UpdateBookingRequestResult> => {
  return graphClient.request(UPDATE_BOOKING_QUERY, parameters)
}

export const OCCUPATIONS_QUERY = gql`
  query GetOccupations($from: String!, $to: String!) {
    occupation(from: $from, to: $to) {
      occupation
      date
      space {
        id
      }
    }
  }
`

interface GetOccupationsRequestParameters {
  from: string
  to: string
}

export const getOccupationsRequest = (parameters: GetOccupationsRequestParameters) => {
  return graphClient.request(OCCUPATIONS_QUERY, parameters)
}

export const LAST_BOOKING_QUERY = gql`
  query GetLastBooking($spaceId: String!, $isGuestBooking: Boolean) {
    lastBooking(spaceId: $spaceId, isGuestBooking: $isGuestBooking) {
      space {
        id
      }
      note
      guestInfo
    }
  }
`

export interface GetLastBookingParameters {
  spaceId: string
  isGuestBooking?: boolean
}

export interface GetLastBookingResult {
  [key: string]: Booking
}

export const getLastBookingRequest = (parameters: GetLastBookingParameters): Promise<GetLastBookingResult> => {
  return graphClient.request(LAST_BOOKING_QUERY, parameters)
}

export const GET_BOOKING_QUERY = gql`
  query getBooking($id: String!) {
    booking(id: $id) {
      date
      space {
        id
      }
      note
      isAnonymous
    }
  }
`

export const getBookingRequest = (parameters: { id: string }) => {
  return graphClient.request(GET_BOOKING_QUERY, parameters)
}

export const DELETE_BOOKING_QUERY = gql`
  mutation deleteBooking($id: String!) {
    deleteBooking(id: $id)
  }
`

export const deleteBookingRequest = (parameters: { id: string }) => {
  return graphClient.request(DELETE_BOOKING_QUERY, parameters)
}

export const BOOKING_STATS_QUERY = gql`
  query GetBookingStats($onlyOwnBookings: Boolean, $ranges: [BookingStatsRangeInputType!]!) {
    bookingStats(onlyOwnBookings: $onlyOwnBookings, ranges: $ranges) {
      ranges {
        from
        to
        count
      }
    }
  }
`

interface GetBookingStatsRangeRequestParameters {
  from: string
  to: string
}

interface GetBookingStatsRequestParameters {
  onlyOwnBookings?: boolean
  ranges: GetBookingStatsRangeRequestParameters[]
}

export const getBookingStatsRequest = (parameters: GetBookingStatsRequestParameters) => {
  return graphClient.request(BOOKING_STATS_QUERY, parameters)
}
